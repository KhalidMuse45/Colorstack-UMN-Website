/** Pre-render responsive assets for static hosting; no image server required. */
import sharp from 'sharp';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceDir = fileURLToPath(new URL('../public/images/', import.meta.url));
const widths = [320, 480, 768, 1200, 1600];
const files = (await readdir(sourceDir, { recursive: true }))
  .filter((file) => /\.(webp|jpe?g|png)$/i.test(file) && !file.startsWith('responsive'))
  .sort();
const manifest = {};
let totalBytes = 0;
let count = 0;

// Process one source at a time to keep memory bounded on contributor laptops.
for (const file of files) {
  const input = join(sourceDir, file);
  const metadata = await sharp(input).metadata();
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
      pipeline.clone().webp({ quality: 80, effort: 5 }).toFile(`${base}.webp`),
      pipeline.clone().avif({ quality: 53, effort: 4 }).toFile(`${base}.avif`),
    ]);
    totalBytes += (await stat(`${base}.webp`)).size + (await stat(`${base}.avif`)).size;
    count += 2;
  }
  manifest[`/images/${file.replaceAll('\\', '/')}`] = {
    width: sourceWidth, height: sourceHeight, widths: available,
  };
}

await writeFile(new URL('../lib/image-manifest.json', import.meta.url), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${count} responsive files for ${files.length} images (${(totalBytes / 1024 / 1024).toFixed(2)} MB on disk; browsers download one size/format per image).`);
