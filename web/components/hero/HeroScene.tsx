'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { fragmentShader, vertexShader } from './heroShader';
import { tokens, hexToRgb01 } from '@/lib/tokens';

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
      uMix: { value: 0 },
      uGrain: { value: 0.035 },
      uDisplace: { value: displace ? 1 : 0 },
      uDark: { value: new THREE.Color(...hexToRgb01(tokens.maroon)) },
      uLight: { value: new THREE.Color(...hexToRgb01(tokens.page)) },
    }),
    [texture, displace],
  );

  useFrame((state, dt) => {
    const p = progress.current;
    // R3F v9 CLONES the `uniforms` prop when it constructs the material (v8
    // shared the reference). Mutating the memo'd object therefore reaches
    // nothing the GPU ever reads, and the room never turns on. Write to the
    // material's own uniforms, which are the only ones that exist as far as
    // the renderer is concerned.
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

    // scroll-driven values (docs/06, reconciled hero table)
    u.uZoom.value = 1 + 0.35 * THREE.MathUtils.smoothstep(p, 0, 1);
    u.uMix.value = THREE.MathUtils.smoothstep(p, 0.6, 0.69); // the room turns on
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

/** An n-pointed star, so the sprites read as the brand glyphs rather than as polygons. */
function starShape(points: number, inner: number): THREE.Shape {
  const s = new THREE.Shape();
  const step = Math.PI / points;
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? 0.5 : inner;
    const a = i * step - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

/**
 * Eight drifting glyph sprites at the edges of the canvas, scattering from the
 * cursor. docs/06: eight, not twenty-four, and they never cover copy, so they
 * are confined to the outer thirds of the viewport. Desktop only.
 */
function GlyphField({ count = 8 }: { count?: number }) {
  const viewport = useThree((s) => s.viewport);
  const group = useRef<THREE.Group>(null);

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (i % 2 === 0 ? -1 : 1) * viewport.width * (0.32 + Math.random() * 0.18),
        y: (Math.random() - 0.5) * viewport.height,
        r: Math.random() * Math.PI * 2,
        v: 0.05 + Math.random() * 0.08,
        s: 0.08 + Math.random() * 0.1,
        k: i % 3,
      })),
    [count, viewport.width, viewport.height],
  );

  // Three shapes standing in for the three brand glyphs.
  const shapes = useMemo(() => [starShape(8, 0.16), starShape(4, 0.14), starShape(5, 0.22)], []);
  const gold = useMemo(() => new THREE.Color(...hexToRgb01(tokens.gold)), []);

  useFrame((state, dt) => {
    if (!group.current) return;
    const px = state.pointer.x * viewport.width * 0.5;
    const py = state.pointer.y * viewport.height * 0.5;
    group.current.children.forEach((c, i) => {
      const s = seeds[i];
      if (!s) return;
      s.y -= s.v * dt;
      if (s.y < -viewport.height / 2 - 0.2) s.y = viewport.height / 2 + 0.2;
      const dx = s.x - px;
      const dy = s.y - py;
      const d2 = dx * dx + dy * dy;
      const repel = Math.max(0, 1 - d2 / 1.2) * 0.9;
      c.position.set(s.x + dx * repel, s.y + dy * repel, 0.01);
      c.rotation.z = s.r + state.clock.elapsedTime * 0.2;
    });
  });

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh key={i} scale={s.s} position={[s.x, s.y, 0.01]}>
          <shapeGeometry args={[shapes[s.k]]} />
          <meshBasicMaterial color={gold} transparent opacity={0.85} toneMapped={false} />
        </mesh>
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
   */
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={running && visible ? 'always' : 'demand'}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 1], fov: 50 }}
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
