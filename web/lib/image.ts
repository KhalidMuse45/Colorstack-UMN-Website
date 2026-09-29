import manifest from './image-manifest.json';

type ImageFormat = 'webp' | 'avif';
type ImageEntry = { width: number; height: number; widths: number[]; hash?: string };
const images: Record<string, ImageEntry> = manifest;

/** Images are served from the Cloudflare R2 bucket behind this custom domain. */
export const ASSETS_BASE = 'https://cdn.colorstackumn.org';

function withBase(path: string) {
  return path.startsWith('/images/') ? `${ASSETS_BASE}${path}` : path;
}

function variant(src: string, width: number, format: ImageFormat) {
  return src.replace('/images/', '/images/responsive/').replace(/\.[^.]+$/, `-${width}.${format}`);
}

/**
 * Every responsive URL carries the source image's content hash. Static hosts
 * cache images for hours under a fixed path, so without this an updated photo
 * keeps serving the old bytes until the cache expires.
 */
function versioned(url: string, entry: ImageEntry) {
  return entry.hash ? `${url}?v=${entry.hash}` : url;
}

/** Smallest generated image meeting the requested pixel width, never upscaled. */
export function imageUrl(src: string, width: number, format: ImageFormat = 'webp') {
  const entry = images[src];
  if (!entry) return withBase(src);
  const chosen = entry.widths.find((candidate) => candidate >= width) ?? entry.widths[entry.widths.length - 1];
  return withBase(versioned(variant(src, chosen, format), entry));
}

export function imageSrcSet(src: string, format: ImageFormat = 'webp') {
  const entry = images[src];
  if (!entry) return undefined;
  return entry.widths.map((width) => `${withBase(versioned(variant(src, width, format), entry))} ${width}w`).join(', ');
}

export function imageDimensions(src: string) {
  const entry = images[src];
  return entry ? { width: entry.width, height: entry.height } : undefined;
}
