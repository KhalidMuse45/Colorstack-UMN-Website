import { tokens } from '@/lib/tokens';

/**
 * A short, dependency-free confetti burst for the "You're on the list" moment.
 * Two cannons fire from `origin` (usually the confirmation note), paper
 * falls under gravity, and the canvas removes itself when the last piece
 * leaves the screen. Skipped entirely for prefers-reduced-motion.
 */
const COLORS = [tokens.maroon, tokens.gold, tokens.goldSoft, tokens.rose, tokens.teal, tokens.pink, tokens.paper];

type Piece = { x: number; y: number; vx: number; vy: number; w: number; h: number; r: number; vr: number; tilt: number; color: string; round: boolean };

export function fireConfetti(origin?: DOMRect) {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: '100' });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  const box = origin ?? new DOMRect(W / 2 - 150, H / 3, 300, 0);
  const cannons = [
    { x: box.left + box.width * 0.15, y: box.top + 24, dir: -1 },
    { x: box.left + box.width * 0.85, y: box.top + 24, dir: 1 },
  ];
  const count = W < 600 ? 90 : 160;
  const pieces: Piece[] = [];
  for (let i = 0; i < count; i++) {
    const c = cannons[i % 2];
    const angle = (-90 + c.dir * (15 + Math.random() * 45)) * (Math.PI / 180);
    const speed = 7 + Math.random() * 9;
    pieces.push({
      x: c.x, y: c.y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.35,
      tilt: Math.random() * Math.PI, color: COLORS[i % COLORS.length], round: Math.random() < 0.2,
    });
  }

  const start = performance.now();
  const frame = (now: number) => {
    ctx.clearRect(0, 0, W, H);
    let alive = 0;
    for (const p of pieces) {
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.28;
      p.x += p.vx + Math.sin(p.tilt) * 0.6;
      p.y += p.vy;
      p.r += p.vr;
      p.tilt += 0.08;
      if (p.y > H + 20) continue;
      alive++;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.scale(1, Math.cos(p.tilt));
      ctx.fillStyle = p.color;
      if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill(); }
      else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (alive && now - start < 6000) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}
