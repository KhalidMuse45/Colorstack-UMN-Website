// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://colorstackumn.org',
  output: 'static',
  // /motion-lab is an internal gate route (LANDING-PAGE.md:99) and a standing
  // component gallery. It carries noindex, but a sitemap entry would still
  // advertise it, so keep the two consistent.
  integrations: [sitemap({ filter: (page) => !page.includes('/motion-lab') })],
  prefetch: false,
});
