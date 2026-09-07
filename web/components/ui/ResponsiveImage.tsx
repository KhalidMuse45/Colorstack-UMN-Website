import type { ImgHTMLAttributes } from 'react';
import { imageDimensions, imageSrcSet, imageUrl } from '@/lib/image';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height' | 'srcSet'> & {
  src: string;
  width: number;
  height: number;
  priority?: boolean;
};

/** Static-export equivalent of image optimization: real files and native selection. */
export default function ResponsiveImage({
  src, width, height, alt = '', sizes = '100vw', priority = false,
  loading, decoding = 'async', fetchPriority, ...props
}: Props) {
  const dimensions = imageDimensions(src) ?? { width, height };
  const avif = imageSrcSet(src, 'avif');
  return (
    <picture style={{ display: 'contents' }}>
      {avif && <source type="image/avif" srcSet={avif} sizes={sizes} />}
      {/* These sources are optimized at build time for GitHub Pages static hosting. */}
      <img
        {...props}
        src={imageUrl(src, Math.min(width, 1200))}
        srcSet={imageSrcSet(src)}
        sizes={sizes}
        width={dimensions.width}
        height={dimensions.height}
        alt={alt}
        loading={priority ? 'eager' : (loading ?? 'lazy')}
        decoding={decoding}
        fetchPriority={priority ? 'high' : fetchPriority}
      />
    </picture>
  );
}
