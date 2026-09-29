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
    // Static export: no Next.js image optimization server.
    unoptimized: true,
    formats: ['image/webp'],
    // Source photos live in web/images/ and are served from the R2 bucket
    // behind this custom domain. Sanity's CDN gets added when the studio exists.
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.colorstackumn.org' }],
  },
};

export default nextConfig;
