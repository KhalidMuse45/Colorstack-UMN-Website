/**
 * Upload everything under web/images/ to the R2 bucket, skipping files whose
 * bytes have not changed since the last upload. Change state is kept in
 * web/.r2-state.json (git-ignored). Requires `wrangler login`.
 *
 * Run with: npm run images:upload (or as part of `npm run deploy`).
 */
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);

const BUCKET = 'colorstackumn-assets';
const imagesDir = fileURLToPath(new URL('../images/', import.meta.url));
const statePath = fileURLToPath(new URL('../.r2-state.json', import.meta.url));
const localWrangler = fileURLToPath(new URL('../node_modules/.bin/wrangler', import.meta.url));
const wrangler = existsSync(localWrangler) ? localWrangler : 'wrangler';
const CONCURRENCY = 6;

const TYPES = {
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

let state = {};
try {
  state = JSON.parse(readFileSync(statePath, 'utf8'));
} catch {
  state = {};
}

if (!existsSync(imagesDir)) {
  console.warn('No web/images/ directory; nothing to upload.');
  process.exit(0);
}

const files = walk(imagesDir).filter((file) => TYPES[extname(file).toLowerCase()]);
const jobs = [];
for (const full of files) {
  const key = `images/${relative(imagesDir, full).replaceAll('\\', '/')}`;
  const hash = createHash('sha256').update(readFileSync(full)).digest('hex').slice(0, 12);
  if (state[key] === hash) continue;
  jobs.push({ key, full, hash, ct: TYPES[extname(full).toLowerCase()] });
}

if (jobs.length === 0) {
  console.log(`R2 upload: ${files.length} images already current.`);
  process.exit(0);
}
console.log(`R2 upload: ${jobs.length} of ${files.length} images changed.`);

const failures = [];
let cursor = 0;
async function worker() {
  while (cursor < jobs.length) {
    const job = jobs[cursor++];
    try {
      await run(wrangler, ['r2', 'object', 'put', `${BUCKET}/${job.key}`, '--file', job.full, '--content-type', job.ct, '--remote']);
      state[job.key] = job.hash;
    } catch (error) {
      failures.push({ key: job.key, message: error.message?.split('\n').slice(0, 3).join(' ') ?? String(error) });
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);

if (failures.length) {
  console.error(`R2 upload: ${failures.length} failed.`);
  for (const failure of failures.slice(0, 10)) console.error(`  ${failure.key}: ${failure.message}`);
  process.exit(1);
}
console.log(`R2 upload: done (${jobs.length} uploaded).`);
