'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * The WebGL half of FloatingCards. Loaded with `ssr: false` by the shell, so
 * three and the fiber reconciler never enter the server render or the initial
 * bundle. Everything the user can read or operate without JavaScript lives in
 * FloatingCards.tsx; nothing in this file is required for the section to make
 * sense.
 *
 * Candid chapter photographs as thin textured planes in a loose grid over
 * white, each turning on its own vertical axis at its own speed and phase. The
 * camera never moves, nothing here reads scroll, and there is no reduced-motion
 * branch to find.
 *
 * WHY THE LAYOUT IS IN WORLD UNITS. The first build laid the cards out on a
 * fixed pitch and then scaled the whole group to fit, which put the cloud off
 * centre: the scale factor was chosen from the widest card, so the actual
 * spread never matched the frame and the jitter pushed the whole thing off
 * again on top of that. This version measures the viewport in world units at
 * z = 0, derives the pitch from that measurement, and then subtracts the
 * bounding-box centre of the card positions so the cloud sits on the origin
 * whatever the jitter did. `__fcLayout` below carries that centre back out so
 * the claim can be checked rather than believed.
 */

export type ScenePhoto = {
  uid: string;
  src: string;
  width: number;
  height: number;
};

/** Fixed card height in world units. Width comes from the photo's aspect. */
const CARD_H = 0.9;
/** Fraction of the viewport the grid pitch spans on each axis. */
const FILL = 0.72;
/** The y pitch denominator: the grid is four rows tall at its fullest. */
const ROWS = 4;
/** Positional jitter, as a fraction of the pitch, applied to x and y. */
const JITTER = 0.2;
/** Depth range. Nearer than the camera plane at the front, behind it at the back. */
const Z_NEAR = 0.2;
const Z_FAR = -0.8;
const TAU = Math.PI * 2;
/** The group tilts toward the pointer by at most 4 degrees. */
const TILT = THREE.MathUtils.degToRad(4);
const TILT_LERP = 0.05;
/**
 * Damping rate for the hover transitions. `damp` closes 1 - e^(-lambda*dt) of
 * the remaining distance each frame, so 11 lands inside a percent of the
 * target in the ~400ms the brief asks for.
 */
const HOVER_LAMBDA = 11;
/** How far a hovered card comes forward. */
const HOVER_LIFT = 0.3;
/** Bob amplitude, in world units. */
const BOB = 0.02;

/**
 * Deterministic PRNG. The jitter, speeds and phases have to be random-looking
 * but stable: `Math.random` would re-scatter every card on every resize, and a
 * screenshot of the section would never be comparable to the last one.
 */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Placed = { x: number; y: number; z: number; speed: number; phase: number };

/** The centre of the bounding box of a set of card positions, on x and y. */
function boundsCentre(cards: readonly { x: number; y: number }[]) {
  if (cards.length === 0) return { x: 0, y: 0 };
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const c of cards) {
    if (c.x < minX) minX = c.x;
    if (c.x > maxX) maxX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.y > maxY) maxY = c.y;
  }
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

/**
 * Where every card goes, in world units at z = 0.
 *
 * `cols` is 4 on desktop and 2 on mobile. The brief writes the pitch as
 * `0.72 x viewportWidth / 4`, which is the four-column case; a phone viewport
 * is barely one and a half world units wide, and four columns of 0.9-unit cards
 * on a quarter-width pitch would be a pile rather than a cloud, so the
 * denominator follows the column count. On desktop the two are the same number.
 * The y pitch stays on four rows either way: desktop fills three of them with
 * twelve cards, mobile fills four with eight.
 *
 * The last step is the one that matters. Jitter is applied first and the whole
 * set is then translated by minus the centre of its own bounding box, so the
 * cloud is centred on the origin by construction rather than by luck. z is left
 * alone: it has a deliberate range, not a target.
 */
function place(count: number, cols: number, viewW: number, viewH: number): Placed[] {
  const rand = mulberry32(0x5713c0);
  const rows = Math.max(1, Math.ceil(count / cols));
  const sx = (FILL * viewW) / cols;
  const sy = (FILL * viewH) / ROWS;

  const cards = Array.from({ length: count }, (_, i): Placed => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      x: (col - (cols - 1) / 2) * sx + (rand() - 0.5) * 2 * JITTER * sx,
      // Row 0 at the top, so the cloud runs in the same order as the masonry
      // the server renders and the button list a keyboard reader tabs through.
      y: ((rows - 1) / 2 - row) * sy + (rand() - 0.5) * 2 * JITTER * sy,
      z: Z_FAR + rand() * (Z_NEAR - Z_FAR),
      // 0.15 .. 0.35 rad/s, random sign.
      speed: (0.15 + rand() * 0.2) * (rand() < 0.5 ? -1 : 1),
      phase: rand() * TAU,
    };
  });

  const centre = boundsCentre(cards);
  for (const c of cards) {
    c.x -= centre.x;
    c.y -= centre.y;
  }
  return cards;
}

/**
 * The verification hook. Attached on every layout, logged only when a caller
 * has set `window.__fcDebug = true`, and `centre` is measured back off the
 * final positions rather than assumed to be zero, so it can actually fail.
 */
export type FloatingCardsDebug = {
  centre: { x: number; y: number };
  /** Same value under the spelling the brief uses, so either name reads. */
  center: { x: number; y: number };
  count: number;
  cols: number;
  rows: number;
  viewport: { width: number; height: number };
  positions: { x: number; y: number; z: number }[];
};

declare global {
  interface Window {
    __fcDebug?: boolean;
    __fcLayout?: FloatingCardsDebug;
  }
}

function Card({
  photo,
  placed,
  hovered,
  onHover,
  onOpen,
}: {
  photo: ScenePhoto;
  placed: Placed;
  hovered: boolean;
  onHover: (uid: string | null) => void;
  onOpen: (uid: string) => void;
}) {
  const texture = useTexture(photo.src);
  const mesh = useRef<THREE.Mesh>(null);

  /*
   * The photos are sRGB and meshBasicMaterial does no colour work of its own,
   * so the texture has to say so or every card renders washed out against the
   * white ground. The renderer's output conversion is the other half of the
   * same round trip.
   */
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  // Card size comes from the image's aspect. Never a uniform tile: the mixed
  // aspects are most of what makes the cloud read as real material.
  const width = CARD_H * (photo.width / photo.height);

  // A relayout moves the card rather than remounting it, so the mesh has to be
  // told: `position` is only read on the first render.
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    m.position.set(placed.x, placed.y, placed.z);
  }, [placed]);

  useFrame((state, dt) => {
    const m = mesh.current;
    if (!m) return;

    if (hovered) {
      // Ease to the nearest multiple of 2pi, which is the front face, and stop.
      const target = Math.round(m.rotation.y / TAU) * TAU;
      m.rotation.y = THREE.MathUtils.damp(m.rotation.y, target, HOVER_LAMBDA, dt);
    } else {
      // Resumes from wherever the hover left it, because this is the same value.
      m.rotation.y += placed.speed * dt;
    }

    m.position.x = placed.x;
    m.position.y = placed.y + Math.sin(state.clock.elapsedTime * 0.4 + placed.phase) * BOB;
    m.position.z = THREE.MathUtils.damp(
      m.position.z,
      hovered ? placed.z + HOVER_LIFT : placed.z,
      HOVER_LAMBDA,
      dt,
    );
  });

  return (
    <mesh
      ref={mesh}
      position={[placed.x, placed.y, placed.z]}
      rotation={[0, placed.phase, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(photo.uid);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen(photo.uid);
      }}
    >
      <planeGeometry args={[width, CARD_H]} />
      {/*
        DoubleSide so the back of the plane shows the same texture, mirrored,
        which is what makes an edge-on card turn into a readable photo again.
        toneMapped false so the colours match the same file rendered as an
        <img> anywhere else on the page.
      */}
      <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Cloud({
  photos,
  cols,
  tilt,
  hoveredUid,
  onHover,
  onOpen,
}: {
  photos: ScenePhoto[];
  cols: number;
  tilt: boolean;
  hoveredUid: string | null;
  onHover: (uid: string | null) => void;
  onOpen: (uid: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  /*
   * World units at z = 0 for the current camera and canvas size, recomputed by
   * fiber whenever the canvas resizes. This is the measurement the layout is
   * built from, which is why the cloud fits the frame at any window size
   * without a fitting factor anywhere.
   */
  const viewport = useThree((s) => s.viewport);

  const cards = useMemo(
    () => place(photos.length, cols, viewport.width, viewport.height),
    [photos.length, cols, viewport.width, viewport.height],
  );

  useEffect(() => {
    const centre = boundsCentre(cards);
    window.__fcLayout = {
      centre,
      center: centre,
      count: cards.length,
      cols,
      rows: Math.max(1, Math.ceil(cards.length / cols)),
      viewport: { width: viewport.width, height: viewport.height },
      positions: cards.map(({ x, y, z }) => ({ x, y, z })),
    };
    if (window.__fcDebug === true) {
      console.log('[FloatingCards] bounding-box centre of card positions', centre);
    }
  }, [cards, cols, viewport.width, viewport.height]);

  useFrame((state) => {
    const g = group.current;
    if (!g || !tilt) return;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * TILT, TILT_LERP);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * TILT, TILT_LERP);
  });

  return (
    <group ref={group}>
      {photos.map((p, i) => (
        // One boundary per card, so each appears as its own texture arrives
        // rather than the whole cloud waiting on the slowest file. No spinner:
        // the ground is white and stays white until there is a photo to show.
        <Suspense key={p.uid} fallback={null}>
          <Card
            photo={p}
            placed={cards[i]}
            hovered={hoveredUid === p.uid}
            onHover={onHover}
            onOpen={onOpen}
          />
        </Suspense>
      ))}
    </group>
  );
}

export type FloatingCardsSceneProps = {
  photos: ScenePhoto[];
  /** 4 on desktop, 2 on mobile. */
  cols: number;
  /** Pointer tilt. Off on mobile. */
  tilt: boolean;
  /** False parks the render loop on `demand`. Driven by the section's observer. */
  running: boolean;
  hoveredUid: string | null;
  onHover: (uid: string | null) => void;
  onOpen: (uid: string) => void;
};

export default function FloatingCardsScene({
  photos,
  cols,
  tilt,
  running,
  hoveredUid,
  onHover,
  onOpen,
}: FloatingCardsSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={running ? 'always' : 'demand'}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      // Static. Nothing in this file ever moves the camera.
      camera={{ position: [0, 0, 3.2], fov: 45 }}
      onPointerMissed={() => onHover(null)}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.NoToneMapping;
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Cloud
        photos={photos}
        cols={cols}
        tilt={tilt}
        hoveredUid={hoveredUid}
        onHover={onHover}
        onOpen={onOpen}
      />
    </Canvas>
  );
}
