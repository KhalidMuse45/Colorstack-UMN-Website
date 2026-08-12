/**
 * One-off generator for landing-page photo placeholders.
 *
 * NOT a build step. Run by hand, commit the .webp output, delete nothing.
 * Uses `sharp`, which is already installed as part of Astro's image pipeline,
 * so this adds no dependency to package.json.
 *
 * design/LANDING-PAGE.md:25 claims the landing photos already exist in the
 * repo. They do not (see HANDOFF-LOG.md). These stand in until the chapter
 * supplies real ones.
 *
 * Deliberately abstract. A stock photo of students in these slots would read
 * as a real ColorStack UMN event and would be a fabricated claim about the
 * chapter. Each frame carries a corner label so it cannot ship unnoticed.
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const OUT = process.argv[2];
const REPO = process.argv[3];
if (!OUT || !REPO) throw new Error('usage: node gen-placeholders.mjs <output-dir> <repo-root>');

// This script sits outside the repo, so bare "sharp" will not resolve. Pull it
// from the repo's own node_modules, where Astro's image pipeline installed it.
const sharp = createRequire(join(REPO, 'package.json'))('sharp');
mkdirSync(OUT, { recursive: true });

// Straight from src/styles/colors.css. Kept in sync by hand; this file is a
// tool, not shipped source, so it is not bound by the no-literal-hex rule.
const C = {
  ground: '#F3E9DA',
  cream: '#FBF5EC',
  maroon: '#7A0019',
  maroonLight: '#900021',
  gold: '#FFCC33',
  goldSoft: '#FFDE7A',
  rose: '#C6887F',
  ink: '#1F1A17',
};

/** Deterministic: same input always yields the same frame. No Math.random. */
const frames = [
  {
    name: 'summit-group',
    w: 1920,
    h: 1080,
    label: 'Placeholder · group photo, national summit',
    shapes: [
      { t: 'circle', cx: 0.28, cy: 0.62, r: 0.34, fill: C.maroon, o: 0.92 },
      { t: 'circle', cx: 0.52, cy: 0.44, r: 0.26, fill: C.gold, o: 0.95 },
      { t: 'circle', cx: 0.74, cy: 0.66, r: 0.3, fill: C.rose, o: 0.9 },
      { t: 'rect', x: 0.0, y: 0.82, w: 1.0, h: 0.18, fill: C.maroonLight, o: 0.85 },
    ],
  },
  {
    name: 'summit-portrait',
    w: 1400,
    h: 1750,
    label: 'Placeholder · delegation portrait',
    shapes: [
      { t: 'rect', x: 0.0, y: 0.0, w: 1.0, h: 0.46, fill: C.maroon, o: 0.94 },
      { t: 'circle', cx: 0.5, cy: 0.52, r: 0.3, fill: C.goldSoft, o: 0.95 },
      { t: 'circle', cx: 0.5, cy: 0.52, r: 0.17, fill: C.maroonLight, o: 0.9 },
      { t: 'rect', x: 0.0, y: 0.86, w: 1.0, h: 0.14, fill: C.gold, o: 0.9 },
    ],
  },
  {
    name: 'summit-signage',
    w: 1600,
    h: 1200,
    label: 'Placeholder · summit signage',
    shapes: [
      { t: 'rect', x: 0.08, y: 0.14, w: 0.84, h: 0.6, fill: C.ink, o: 0.93 },
      { t: 'rect', x: 0.14, y: 0.24, w: 0.44, h: 0.08, fill: C.gold, o: 0.95 },
      { t: 'rect', x: 0.14, y: 0.4, w: 0.62, h: 0.05, fill: C.cream, o: 0.7 },
      { t: 'rect', x: 0.14, y: 0.5, w: 0.36, h: 0.05, fill: C.cream, o: 0.45 },
      { t: 'circle', cx: 0.84, cy: 0.86, r: 0.13, fill: C.rose, o: 0.9 },
    ],
  },
  {
    name: 'ideathon',
    w: 1600,
    h: 1200,
    label: 'Placeholder · ideathon work session',
    shapes: [
      { t: 'rect', x: 0.06, y: 0.56, w: 0.4, h: 0.3, fill: C.maroon, o: 0.92 },
      { t: 'rect', x: 0.52, y: 0.46, w: 0.4, h: 0.4, fill: C.gold, o: 0.94 },
      { t: 'circle', cx: 0.26, cy: 0.32, r: 0.15, fill: C.rose, o: 0.9 },
      { t: 'circle', cx: 0.72, cy: 0.26, r: 0.12, fill: C.maroonLight, o: 0.9 },
    ],
  },
  {
    name: 'game-night-chess',
    w: 1600,
    h: 1200,
    label: 'Placeholder · game night',
    shapes: [
      { t: 'checker', x: 0.2, y: 0.24, w: 0.6, h: 0.6, n: 6, a: C.ink, b: C.cream },
      { t: 'circle', cx: 0.34, cy: 0.38, r: 0.07, fill: C.gold, o: 0.96 },
      { t: 'circle', cx: 0.63, cy: 0.68, r: 0.07, fill: C.maroon, o: 0.96 },
    ],
  },
  {
    name: 'game-night-signage',
    w: 1600,
    h: 1200,
    label: 'Placeholder · hand-drawn signage',
    shapes: [
      { t: 'rect', x: 0.12, y: 0.18, w: 0.76, h: 0.56, fill: C.cream, o: 1 },
      { t: 'rect', x: 0.12, y: 0.18, w: 0.76, h: 0.56, fill: 'none', stroke: C.ink, sw: 0.012 },
      { t: 'rect', x: 0.2, y: 0.3, w: 0.42, h: 0.07, fill: C.maroon, o: 0.9 },
      { t: 'rect', x: 0.2, y: 0.44, w: 0.56, h: 0.045, fill: C.rose, o: 0.85 },
      { t: 'rect', x: 0.2, y: 0.545, w: 0.3, h: 0.045, fill: C.gold, o: 0.95 },
    ],
  },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function shapeSvg(s, w, h) {
  if (s.t === 'circle') {
    return `<circle cx="${s.cx * w}" cy="${s.cy * h}" r="${s.r * Math.min(w, h)}" fill="${s.fill}" opacity="${s.o}"/>`;
  }
  if (s.t === 'rect') {
    const stroke = s.stroke
      ? ` stroke="${s.stroke}" stroke-width="${s.sw * Math.min(w, h)}"`
      : '';
    return `<rect x="${s.x * w}" y="${s.y * h}" width="${s.w * w}" height="${s.h * h}" fill="${s.fill}" opacity="${s.o ?? 1}"${stroke}/>`;
  }
  if (s.t === 'checker') {
    const cw = (s.w * w) / s.n;
    const ch = (s.h * h) / s.n;
    let out = '';
    for (let r = 0; r < s.n; r++) {
      for (let c = 0; c < s.n; c++) {
        out += `<rect x="${s.x * w + c * cw}" y="${s.y * h + r * ch}" width="${cw}" height="${ch}" fill="${(r + c) % 2 ? s.a : s.b}" opacity="0.9"/>`;
      }
    }
    return out;
  }
  return '';
}

function svgFor(f) {
  const { w, h } = f;
  const body = f.shapes.map((s) => shapeSvg(s, w, h)).join('');
  const fs = Math.round(Math.min(w, h) * 0.026);
  const pad = Math.round(Math.min(w, h) * 0.038);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${C.ground}"/>
  ${body}
  <rect x="0" y="${h - pad * 2.2}" width="${w}" height="${pad * 2.2}" fill="${C.ink}" opacity="0.82"/>
  <text x="${pad}" y="${h - pad * 0.78}" font-family="Helvetica,Arial,sans-serif" font-size="${fs}" font-weight="700" fill="${C.cream}" letter-spacing="${fs * 0.06}">${esc(f.label.toUpperCase())}</text>
</svg>`;
}

const results = [];
for (const f of frames) {
  const file = join(OUT, `${f.name}.webp`);
  const info = await sharp(Buffer.from(svgFor(f)))
    .webp({ quality: 82, effort: 6 })
    .toFile(file);
  results.push({ name: `${f.name}.webp`, w: info.width, h: info.height, kb: (info.size / 1024).toFixed(1) });
}
console.table(results);
