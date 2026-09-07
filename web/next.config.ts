import path from 'path';
import type { NextConfig } from 'next';

/**
 * Export the redesign as static files for GitHub Pages.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  /**
   * Keep build tracing inside the self-contained web/ app.
   */
  outputFileTracingRoot: path.resolve(process.cwd()),
  images: {
    // GitHub Pages cannot run the Next.js image optimization server.
    unoptimized: true,
    // Every image on the landing page is a local WebP under public/images.
    // Sanity's CDN gets added to remotePatterns when the studio exists.
    formats: ['image/webp'],
  },
};

export default nextConfig;
