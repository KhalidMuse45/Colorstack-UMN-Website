# ColorStack UMN

Website for the University of Minnesota chapter of ColorStack, built with Next.js, React, and TypeScript.

## Get started

Install Node.js 22.12+ and Git. On Windows, use **Git Bash** so the lint script works.

```bash
git clone https://github.com/KhalidMuse45/Colorstack-UMN-Website.git colorstack-umn
cd colorstack-umn/web
npm ci
npm run dev -- --port 3399
```

Open **http://localhost:3399**. Changes reload automatically. No environment variables, API keys, or CMS account are needed.

For an existing clone, commit or stash your work, switch to `main`, and run `git pull --ff-only`. Then run `npm ci` and the development command from `web/`.

## Where to work

The app lives in **`web/`**. Run all npm commands there.

| Path | What to edit |
| --- | --- |
| `web/app/` | Pages, layout, and global styles |
| `web/components/` | UI and animations |
| `web/content/landing.ts` | Homepage copy, links, and chapter content |
| `web/lib/` | Shared helpers and design tokens |
| `web/images/` | Website image sources (pre-built and served from the Cloudflare CDN) |

## Commands

Run from `web/`:

| Command | Purpose |
| --- | --- |
| `npm run dev -- --port 3399` | Local development |
| `npm run lint` | ESLint and current design guardrails |
| `npm run build` | Typecheck and export the site to `web/out/` |
| `npm run images:build` | Generate responsive AVIF/WebP files after adding or changing photos |
| `npm run deploy` | Build images, upload changed files to R2, build, and deploy to Cloudflare Pages |

Use the development command locally. The build fetches Google Fonts, so it needs internet access.

Keep original website photos in `web/images/` (not committed), then run `npm run deploy`. That regenerates the responsive AVIF/WebP files, uploads only what changed to the R2 bucket (`colorstackumn-assets`), and ships `web/out/` to Cloudflare Pages. Images are served from `https://cdn.colorstackumn.org`. Use `ResponsiveImage` for page images so the CDN serves the right size. Chapter photography sources and credits are recorded in `web/SOURCES.json`.

Deploys need Cloudflare auth: run `npx wrangler login` once, or set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## Contribute and deploy

Create a branch, make your changes, run lint and build, then open a PR into `main`. See [CONTRIBUTING.md](CONTRIBUTING.md).

GitHub Actions checks the app; `web/out/` is deployed to Cloudflare Pages. Images are served from the Cloudflare R2 CDN at `cdn.colorstackumn.org`. The site lives at [colorstackumn.org](https://colorstackumn.org).

## License

Copyright 2025 ColorStack, University of Minnesota Chapter. All rights reserved.
