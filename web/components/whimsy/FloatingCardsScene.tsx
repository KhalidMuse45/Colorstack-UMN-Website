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
 * Spec: handoff/docs/07-FLOATINGCARDS.md. Cards are thin textured planes in a
 * loose 4x4 grid, each turning on its own vertical axis at its own speed and
 * phase. The camera never moves and nothing here reads scroll.
 */

export type ScenePhoto = {
  uid: string;
  src: string;
  width: number;
  height: number;
};

/** Fixed card height in local units. Width comes from the photo's aspect. */
const CARD_H = 0.9;
/** Grid pitch in local units, before the group is scaled to the viewport. */
const SPACING = 1.25;
/** Positional jitter, as a fraction of SPACING, applied to x and y. */
const JITTER = 0.2;
const TAU = Math.PI * 2;
/** docs/07: the group tilts toward the cursor by at most 4 degrees. */
const TILT = THREE.MathUtils.degToRad(4);
/**
 * Damping rate for the hover transitions. `damp` closes 1 - e^(-lambda*dt) of
 * the remaining distance each frame, so 11 lands inside a percent of the
 * target in the ~400ms docs/07 asks for.
 */
const HOVER_LAMBDA = 11;

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

type Seed = { x: number; y: number; z: number; speed: number; phase: number };

function seedsFor(count: number, cols: number): Seed[] {
  const rand = mulberry32(0x5713c0);
  const rows = Math.ceil(count / cols);
  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      x: (col - (cols - 1) / 2) * SPACING + (rand() - 0.5) * 2 * JITTER * SPACING,
      y: ((rows - 1) / 2 - row) * SPACING + (rand() - 0.5) * 2 * JITTER * SPACING,
      // docs/07: z in -0.8 .. 0.2.
      z: -0.8 + rand(),
      // 0.15 .. 0.35 rad/s, random sign.
      speed: (0.15 + rand() * 0.2) * (rand() < 0.5 ? -1 : 1),
      phase: rand() * TAU,
    };
  });
}

function Card({
  photo,
  seed,
  hovered,
  onHover,
  onOpen,
}: {
  photo: ScenePhoto;
  seed: Seed;
  hovered: boolean;
  onHover: (uid: string | null) => void;
  onOpen: (uid: string) => void;
}) {
  const texture = useTexture(photo.src);
  const mesh = useRef<THREE.Mesh>(null);

  /*
   * The photos are sRGB and meshBasicMaterial does no colour work of its own,
   * so the texture has to say so or every card renders washed out against the
   * white ground. The renderer's output conversion is left at its default,
   * which is the other half of the same round trip.
   */
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  // Card size comes from the image's aspect. Never a uniform tile: the mixed
  // aspects are most of what makes the cloud read as real material.
  const width = CARD_H * (photo.width / photo.height);

  useFrame((state, dt) => {
    const m = mesh.current;
    if (!m) return;

    if (hovered) {
      // Ease to the nearest multiple of 2pi, which is the front face, and stop.
      const target = Math.round(m.rotation.y / TAU) * TAU;
      m.rotation.y = THREE.MathUtils.damp(m.rotation.y, target, HOVER_LAMBDA, dt);
    } else {
      // Resumes from wherever the hover left it, because this is the same value.
      m.rotation.y += seed.speed * dt;
    }

    m.position.y = seed.y + Math.sin(state.clock.elapsedTime * 0.4 + seed.phase) * 0.02;
    m.position.z = THREE.MathUtils.damp(
      m.position.z,
      hovered ? seed.z + 0.3 : seed.z,
      HOVER_LAMBDA,
      dt,
    );
  });

  return (
    <mesh
      ref={mesh}
      position={[seed.x, seed.y, seed.z]}
      rotation={[0, seed.phase, 0]}
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
  const viewport = useThree((s) => s.viewport);

  const seeds = useMemo(() => seedsFor(photos.length, cols), [photos.length, cols]);

  /*
   * One scale for the whole cloud rather than a spacing recomputed per
   * viewport, so the cards keep their proportions to each other and to the
   * gaps at every window size.
   *
   * docs/07 asks for "~70% of viewport width". A 4x4 grid of mostly portrait
   * cards is taller than it is wide, so on a wide window the height is what
   * binds and the cloud settles nearer 60% of the width. The alternative is
   * cards leaving the frame, which costs more than the ten points.
   */
  const scale = useMemo(() => {
    const rows = Math.ceil(photos.length / cols);
    const widest = photos.reduce((m, p) => Math.max(m, CARD_H * (p.width / p.height)), CARD_H);
    const spanX = (cols - 1) * SPACING + 2 * JITTER * SPACING + widest;
    const spanY = (rows - 1) * SPACING + 2 * JITTER * SPACING + CARD_H;
    return Math.min((viewport.width * 0.72) / spanX, (viewport.height * 1.06) / spanY);
  }, [photos, cols, viewport.width, viewport.height]);

  useFrame((state) => {
    const g = group.current;
    if (!g || !tilt) return;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * TILT, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * TILT, 0.05);
  });

  return (
    <group ref={group} scale={scale}>
      {photos.map((p, i) => (
        // One boundary per card, so each appears as its own texture arrives
        // rather than the whole cloud waiting on the slowest file. No spinner:
        // the ground is white and stays white until there is a photo to show.
        <Suspense key={p.uid} fallback={null}>
          <Card
            photo={p}
            seed={seeds[i]}
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
  cols: number;
  /** Pointer tilt. Off on mobile, per docs/07. */
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
