import path from 'path';
import type { NextConfig } from 'next';

/**
 * The Astro site at the repository root still owns the live deployment, so
 * nothing here touches `public/CNAME` or the root build. This app is built and
 * served from `web/` alone.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * The repository root has its own lockfile for the Astro site, so Next
   * guesses the root is one level up and traces the wrong file tree. This app
   * is self-contained in web/.
   */
  outputFileTracingRoot: path.resolve(process.cwd()),
  images: {
    // Every image on the landing page is a local WebP under public/images.
    // Sanity's CDN gets added to remotePatterns when the studio exists.
    formats: ['image/webp'],
  },
};

export default nextConfig;
