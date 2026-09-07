import manifest from './image-manifest.json';

type ImageFormat = 'webp' | 'avif';
type ImageEntry = { width: number; height: number; widths: number[] };
const images: Record<string, ImageEntry> = manifest;

function variant(src: string, width: number, format: ImageFormat) {
  return src.replace('/images/', '/images/responsive/').replace(/\.[^.]+$/, `-${width}.${format}`);
}

/** Smallest generated image meeting the requested pixel width, never upscaled. */
export function imageUrl(src: string, width: number, format: ImageFormat = 'webp') {
  const entry = images[src];
  if (!entry) return src;
  const chosen = entry.widths.find((candidate) => candidate >= width) ?? entry.widths[entry.widths.length - 1];
  return variant(src, chosen, format);
}

export function imageSrcSet(src: string, format: ImageFormat = 'webp') {
  return images[src]?.widths.map((width) => `${variant(src, width, format)} ${width}w`).join(', ');
}

export function imageDimensions(src: string) {
  const entry = images[src];
  return entry ? { width: entry.width, height: entry.height } : undefined;
}
