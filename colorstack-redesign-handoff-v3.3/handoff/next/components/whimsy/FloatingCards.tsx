'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

export type FloatingCard = { id: string; src: string; title: string; date?: string; href?: string; aspect?: number };

/**
 * Taste Labs-style cloud of event flyers on white. Drift, tilt toward the
 * cursor, hover raises, click brings to front and calls onSelect.
 * Events page hero. Reduced motion: caller renders a static grid instead.
 */
function Card({ card, index, total, active, onSelect }: { card: FloatingCard; index: number; total: number; active: boolean; onSelect: (id: string) => void }) {
  const tex = useTexture(card.src);
  const mesh = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const { viewport } = useThree();

  const seed = useMemo(() => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    return {
      x: (col - 1.5) * (viewport.width / 4.6) + (Math.random() - 0.5) * 0.6,
      y: (row - Math.floor(total / 4) / 2) * (viewport.height / 3.2) + (Math.random() - 0.5) * 0.5,
      z: -1 - Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      rot: (Math.random() - 0.5) * 0.3,
    };
  }, [index, total, viewport.width, viewport.height]);

  const aspect = card.aspect ?? 0.75;
  const w = 0.9;

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    const targetZ = active ? 0.6 : hover ? seed.z + 0.4 : seed.z;
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, active ? 0 : seed.x, 0.08);
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, active ? 0 : seed.y + Math.sin(t * 0.5 + seed.phase) * 0.08, 0.08);
    mesh.current.position.z = THREE.MathUtils.lerp(mesh.current.position.z, targetZ, 0.08);
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, active ? 0 : state.pointer.x * 0.25 + seed.rot, 0.06);
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, active ? 0 : -state.pointer.y * 0.15, 0.06);
  });

  return (
    <mesh
      ref={mesh}
      position={[seed.x, seed.y, seed.z]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={() => onSelect(card.id)}
    >
      <planeGeometry args={[w, w / aspect]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

export default function FloatingCards({ cards, onSelect }: { cards: FloatingCard[]; onSelect?: (card: FloatingCard) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const select = (id: string) => {
    const next = active === id ? null : id;
    setActive(next);
    const c = cards.find((k) => k.id === next);
    if (c && onSelect) onSelect(c);
  };
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3.2], fov: 45 }} style={{ position: 'absolute', inset: 0 }} onPointerMissed={() => setActive(null)}>
      {cards.map((c, i) => (
        <Card key={c.id} card={c} index={i} total={cards.length} active={active === c.id} onSelect={select} />
      ))}
    </Canvas>
  );
}
