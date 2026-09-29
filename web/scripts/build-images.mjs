/** Pre-render responsive assets for static hosting; no image server required. */
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceDir = fileURLToPath(new URL('../images/', import.meta.url));
const widths = [320, 480, 768, 1200, 1600];
let files = [];
try {
  files = (await readdir(sourceDir, { recursive: true }))
    .filter((file) => /\.(webp|jpe?g|png)$/i.test(file) && !file.startsWith('responsive'))
    .sort();
} catch {
  files = [];
}
// Source images are not committed (they live on the CDN). Refuse to overwrite
// the shipped manifest with an empty one when a clone has no sources.
if (files.length === 0) {
  console.warn('No source images under web/images/; leaving the existing manifest untouched.');
  process.exit(0);
}
const manifest = {};
let totalBytes = 0;
let count = 0;

// Process one source at a time to keep memory bounded on contributor laptops.
for (const file of files) {
  const input = join(sourceDir, file);
  const metadata = await sharp(input).metadata();
  // Content hash busts the long-lived CDN cache when a source image changes.
  const hash = createHash('sha256').update(await readFile(input)).digest('hex').slice(0, 12);
  const rotated = [5, 6, 7, 8].includes(metadata.orientation);
  const sourceWidth = rotated ? metadata.height : metadata.width;
  const sourceHeight = rotated ? metadata.width : metadata.height;
  const maxWidth = Math.min(sourceWidth, 1600);
  const available = [...new Set([...widths.filter((width) => width < maxWidth), maxWidth])];
  const stem = file.replace(/\.[^.]+$/, '').replaceAll('\\', '/');
  for (const width of available) {
    const base = join(sourceDir, 'responsive', `${stem}-${width}`);
    await mkdir(dirname(base), { recursive: true });
    const pipeline = sharp(input).rotate().resize({ width, withoutEnlargement: true });
    await Promise.all([
      pipeline.clone().webp({ quality: 84, effort: 5 }).toFile(`${base}.webp`),
      pipeline.clone().avif({ quality: 62, effort: 4 }).toFile(`${base}.avif`),
    ]);
    totalBytes += (await stat(`${base}.webp`)).size + (await stat(`${base}.avif`)).size;
    count += 2;
  }
  manifest[`/images/${file.replaceAll('\\', '/')}`] = {
    width: sourceWidth, height: sourceHeight, widths: available, hash,
  };
}

await writeFile(new URL('../lib/image-manifest.json', import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${count} responsive files for ${files.length} images (${(totalBytes / 1024 / 1024).toFixed(2)} MB on disk; browsers download one size/format per image).`);
