'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/** "100+" rolls from 0 to 100 on first entry, keeps the suffix. */
export default function NumberRoll({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const m = value.match(/^(\d+)(.*)$/);
  const n = m ? parseInt(m[1], 10) : NaN;
  const suffix = m ? m[2] : '';

  useGSAP(
    () => {
      if (!ref.current || Number.isNaN(n)) return;
      const o = { v: 0 };
      gsap.to(o, {
        v: n,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        onUpdate: () => {
          if (ref.current) ref.current.textContent = Math.round(o.v).toString();
        },
      });
    },
    { scope: ref },
  );

  if (Number.isNaN(n)) return <>{value}</>;
  return (
    <>
      <span ref={ref}>{n}</span>
      {suffix}
    </>
  );
}
