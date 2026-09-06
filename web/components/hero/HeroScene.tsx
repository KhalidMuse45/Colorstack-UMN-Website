'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { fragmentShader, vertexShader } from './heroShader';
import { tokens } from '@/lib/tokens';

type SceneProps = {
  src: string;
  /** Written by Hero.tsx's ScrollTrigger. Read every frame here. */
  progress: RefObject<number>;
  /** True while the hero pin is active. False stops the render loop. */
  running: boolean;
  displace?: boolean;
  glyphs?: boolean;
};

function Plane({ src, progress, displace = true }: Omit<SceneProps, 'running' | 'glyphs'>) {
  const texture = useTexture(src);
  const { size } = useThree();
  const viewport = useThree((s) => s.viewport);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const mat = useRef<THREE.ShaderMaterial>(null);

  // The fragment shader samples with texture2D and does its own colour work,
  // so nothing decodes sRGB for it. Tag the texture as untagged and turn the
  // renderer's output conversion off (see the Canvas below) and the plane
  // matches the <img> underneath it byte for byte.
  useEffect(() => {
    texture.colorSpace = THREE.NoColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uCover: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uZoom: { value: 1 },
      uGrain: { value: 0.035 },
      uDisplace: { value: displace ? 1 : 0 },
    }),
    [texture, displace],
  );

  useFrame((state, dt) => {
    const p = progress.current;
    // R3F v9 CLONES the `uniforms` prop when it constructs the material (v8
    // shared the reference). Mutating the memo'd object therefore reaches
    // nothing the GPU ever reads. Write to the material's own uniforms, which
    // are the only ones that exist as far as the renderer is concerned.
    const u = mat.current?.uniforms;
    if (!u) return;

    // cover-fit
    const img = texture.image as { width: number; height: number } | undefined;
    if (img && img.width && img.height) {
      const planeAspect = size.width / size.height;
      const imgAspect = img.width / img.height;
      if (planeAspect > imgAspect) u.uCover.value.set(1, imgAspect / planeAspect);
      else u.uCover.value.set(planeAspect / imgAspect, 1);
    }

    // scroll-driven values. The zoom is the whole scroll story now: no mix,
    // no tint, the photograph is full colour at every position.
    u.uZoom.value = 1 + 0.45 * THREE.MathUtils.smoothstep(p, 0, 1);
    u.uTime.value += dt;

    // eased pointer
    pointer.current.lerp(state.pointer, 0.06);
    u.uPointer.value.copy(pointer.current);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={mat} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
}

/** The three brand glyphs, in the order DESIGN.md lists them. */
const GLYPHS = ['✳', '✦', '★'];

/**
 * Draw one glyph centered on a 128x128 canvas in the gold token and hand it
 * back as a texture. Runtime canvases rather than image files: three glyphs at
 * 128px cost nothing to draw and add no network requests to a page whose LCP
 * budget is already spent on the photograph.
 *
 * The font stack is symbol faces only. An emoji face would render U+2733 in
 * its own colours and the gold would be lost.
 */
function glyphTexture(ch: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 128, 128);
    ctx.fillStyle = tokens.gold;
    ctx.font = '96px "Segoe UI Symbol", "Apple Symbols", "Noto Sans Symbols 2", "DejaVu Sans", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ch, 64, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  // Same reasoning as the photo plane: the renderer's output conversion is
  // off, so an untagged texture puts the token's own bytes on screen.
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

type Seed = {
  /** Fixed. The sprite only ever drifts on y. */
  x: number;
  y: number;
  /** Rotation phase, so the eight are never in step. */
  phase: number;
  /** Downward drift, world units per second. */
  drift: number;
  size: number;
  /** Which of the three glyph textures. */
  glyph: number;
};

/**
 * Eight drifting glyph sprites at the edges of the canvas, scattering from the
 * cursor. They are confined to the left and right 18% of the viewport so they
 * never sit over the wordmark, the lede or the pill. Desktop only, and only
 * while the hero pin is active, because the whole canvas stops with it.
 */
function GlyphField({ count = 8 }: { count?: number }) {
  const viewport = useThree((s) => s.viewport);
  const group = useRef<THREE.Group>(null);

  const textures = useMemo(() => GLYPHS.map(glyphTexture), []);
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  // `seeds` is the drift position, mutated in place every frame. `eased` is
  // where the sprite actually is: it chases the drift position, or the pushed
  // position while the cursor is close, at the same rate either way. That is
  // what makes it lerp back on its own when the pointer leaves.
  const { seeds, eased } = useMemo(() => {
    const next: Seed[] = Array.from({ length: count }, (_, i) => ({
      // Outer 18% of each side: |x| between 0.32 and 0.50 of the width.
      x: (i % 2 === 0 ? -1 : 1) * viewport.width * (0.32 + Math.random() * 0.18),
      y: (Math.random() - 0.5) * viewport.height,
      phase: Math.random() * Math.PI * 2,
      drift: 0.05 + Math.random() * 0.08,
      size: 0.08 + Math.random() * 0.1,
      glyph: i % GLYPHS.length,
    }));
    return { seeds: next, eased: next.map((s) => new THREE.Vector2(s.x, s.y)) };
  }, [count, viewport.width, viewport.height]);

  useFrame((state, dt) => {
    if (!group.current) return;

    // Pointer is NDC. The sprites live on the z = 0 plane, which is what
    // `viewport` measures, so half the viewport converts it to world units.
    const px = state.pointer.x * viewport.width * 0.5;
    const py = state.pointer.y * viewport.height * 0.5;
    const edge = viewport.height / 2 + 0.2;

    group.current.children.forEach((child, i) => {
      const s = seeds[i];
      const e = eased[i];
      if (!s || !e) return;

      // Slow fall, wrapping to the top.
      s.y -= s.drift * dt;
      if (s.y < -edge) s.y = edge;

      // Scatter: within 1.1 world units of the cursor, push away along the
      // pointer to sprite vector by up to 0.9 units, falling off to nothing
      // at the edge of that radius.
      let tx = s.x;
      let ty = s.y;
      const dx = s.x - px;
      const dy = s.y - py;
      const dist = Math.hypot(dx, dy);
      if (dist < 1.1 && dist > 1e-4) {
        const push = (1 - dist / 1.1) * 0.9;
        tx += (dx / dist) * push;
        ty += (dy / dist) * push;
      }

      e.x = THREE.MathUtils.lerp(e.x, tx, 0.08);
      e.y = THREE.MathUtils.lerp(e.y, ty, 0.08);
      child.position.set(e.x, e.y, 0.01);

      // A sprite always faces the camera, so it turns through its material
      // rather than through its transform.
      const sprite = child as THREE.Sprite;
      const mat = sprite.material as THREE.SpriteMaterial | undefined;
      if (mat) mat.rotation = s.phase + state.clock.elapsedTime * 0.2;
    });
  });

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <sprite key={i} position={[s.x, s.y, 0.01]} scale={[s.size, s.size, 1]}>
          <spriteMaterial map={textures[s.glyph]} transparent depthWrite={false} toneMapped={false} />
        </sprite>
      ))}
    </group>
  );
}

export default function HeroScene({ running, glyphs, ...plane }: SceneProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const on = () => setVisible(document.visibilityState === 'visible');
    on();
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);

  /*
   * FIXED from the handoff version, which gated the render loop with a
   * <FrameGate> component that called setFrameloop() from inside useFrame.
   * That is a trap two ways over: it pushed a store update on every single
   * frame, and the moment it set 'demand' its own useFrame stopped running, so
   * nothing was left to ever set 'always' again. Scrolling back up to the hero
   * left a frozen canvas. The frameloop is a prop now, driven by the pin state
   * Hero already tracks and by page visibility. docs/06: the canvas stops
   * rendering after the hero, and the page uses stillness.
   *
   * The camera sits at z = 3.2 rather than z = 1. The plane is scaled to the
   * viewport either way, so the photograph is identical; what changes is the
   * size of a world unit. At z = 1 the whole frame is only about 1.5 units
   * across, which is narrower than the glyph sprites' own 1.1 unit scatter
   * radius, so every sprite would be permanently pushed and none would ever
   * scatter and return. At 3.2 the frame is about 4.8 units across and the
   * spec's world-unit numbers mean what they say.
   */
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={running && visible ? 'always' : 'demand'}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 3.2], fov: 50 }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.LinearSRGBColorSpace;
        gl.toneMapping = THREE.NoToneMapping;
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Plane {...plane} />
      {glyphs && <GlyphField />}
    </Canvas>
  );
}
