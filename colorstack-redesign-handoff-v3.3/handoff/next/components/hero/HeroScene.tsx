'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { fragmentShader, vertexShader } from './heroShader';
import { tokens, hexToRgb01 } from '@/lib/tokens';

type SceneProps = {
  src: string;
  /** Written by Hero.tsx's ScrollTrigger. Read every frame here. */
  progress: MutableRefObject<number>;
  /** True while the hero pin is active. When false the canvas stops rendering. */
  active: MutableRefObject<boolean>;
  displace?: boolean;
  glyphs?: boolean;
};

/** Stops the render loop once the hero has scrolled away or the tab is hidden. */
function FrameGate({ active }: { active: MutableRefObject<boolean> }) {
  const { invalidate, setFrameloop } = useThree();
  useFrame(() => {
    const visible = document.visibilityState === 'visible';
    if (active.current && visible) setFrameloop('always');
    else setFrameloop('demand');
  });
  useEffect(() => {
    const on = () => invalidate();
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, [invalidate]);
  return null;
}

function Plane({ src, progress, displace = true }: SceneProps) {
  const texture = useTexture(src);
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();
  const pointer = useRef(new THREE.Vector2(0, 0));

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
    const u = uniforms;

    // cover-fit
    const img = texture.image as { width: number; height: number };
    const planeAspect = size.width / size.height;
    const imgAspect = img.width / img.height;
    if (planeAspect > imgAspect) u.uCover.value.set(1, imgAspect / planeAspect);
    else u.uCover.value.set(planeAspect / imgAspect, 1);

    // scroll-driven values (see docs/02, hero table)
    u.uZoom.value = 1 + 0.35 * THREE.MathUtils.smoothstep(p, 0, 1);
    u.uMix.value = THREE.MathUtils.smoothstep(p, 0.6, 0.69); // the room turns on
    u.uTime.value += dt;

    // eased pointer
    pointer.current.lerp(state.pointer, 0.06);
    u.uPointer.value.copy(pointer.current);
  });

  return (
    <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
}

/** Drifting ✳ ✦ ★ that scatter from the cursor. Same canvas, cheap. Desktop only. */
function GlyphField({ count = 8 }: { count?: number }) {
  const { viewport } = useThree();
  const group = useRef<THREE.Group>(null);
  const seeds = useMemo(
    () =>
      // edges only: left/right 18% of the viewport, so sprites never sit over copy
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

  useFrame((state, dt) => {
    if (!group.current) return;
    const px = state.pointer.x * viewport.width * 0.5;
    const py = state.pointer.y * viewport.height * 0.5;
    group.current.children.forEach((c, i) => {
      const s = seeds[i];
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

  const gold = new THREE.Color(...hexToRgb01(tokens.gold));
  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh key={i} scale={s.s}>
          {/* three flat glyph-ish shapes: 8-point star, 4-point star, 5-point star. Flat, no lighting. */}
          <circleGeometry args={[0.5, s.k === 0 ? 8 : s.k === 1 ? 4 : 5]} />
          <meshBasicMaterial color={gold} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene(props: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 1], fov: 50 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <FrameGate active={props.active} />
      <Plane {...props} />
      {props.glyphs && <GlyphField />}
    </Canvas>
  );
}
