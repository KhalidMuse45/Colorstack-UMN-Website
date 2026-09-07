import path from 'path';
import type { NextConfig } from 'next';

/**
 * Export the redesign as static files for GitHub Pages.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  /**
   * The repository root has its own lockfile for the Astro site, so Next
   * guesses the root is one level up and traces the wrong file tree. This app
   * is self-contained in web/.
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
