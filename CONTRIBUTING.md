# Contributing

Follow the [README setup](README.md#get-started), then create a branch from the latest `main`:

```bash
git switch -c feat/your-change
```

Work in `web/`. Put chapter copy and links in `web/content/landing.ts`, images in `web/public/images/`, and reusable UI in `web/components/`.

## Before opening a PR

From `web/`, run:

```bash
npm run lint
npm run build
```

On Windows, run lint in Git Bash. Check your change in the browser at desktop and mobile sizes, including keyboard navigation and reduced motion when relevant.

Lint checks ESLint, token colors, visible focus outlines, ColorStack casing, and em dashes in chapter content. Use `web/lib/tokens.ts` and `web/app/globals.css` for palette values. Use confirmed chapter information for names, statistics, and quotes.

No Git hook installation is required. CI runs the current checks on every pull request.

## Submit your change

Stage the files you changed, commit, and push your branch:

```bash
git push -u origin HEAD
```

Open a PR into `main`. Explain the change and how you checked it; include screenshots for visible UI changes. Wait for CI to pass before merging.

Do not commit dependencies, generated builds, secrets, or local tool output. Keep runtime features compatible with a static export: GitHub Pages does not run a Next.js server.
