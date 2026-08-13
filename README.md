# ColorStack UMN

The official website for the University of Minnesota chapter of ColorStack, a community
dedicated to increasing the number of Black, Latinx, and Indigenous technologists who
graduate and launch rewarding technical careers.

## Live site

The site builds to static HTML and deploys to GitHub Pages on every push to `main`. The
intended address is `colorstackumn.org`, set as `site` in `astro.config.mjs` and as the
custom domain in `public/CNAME`. Known limitation: that domain is not yet connected in the
repository's GitHub Pages settings, so it does not resolve. Until someone with admin access
configures it there and points DNS at GitHub, the deployed build is only reachable at the
repository's default `github.io` address.

## Local development

Requires Node `^20.19.0` or `>=22.12.0`.

```bash
git clone https://github.com/KhalidMuse45/Colorstack-UMN-Website.git colorstack-umn-website
cd colorstack-umn-website
npm install
git config core.hooksPath .githooks
npm run dev
```

`npm run dev` serves the site at http://localhost:4321.

The `core.hooksPath` line has to be run once per clone. It enables the pre-commit checks
described in [CONTRIBUTING.md](CONTRIBUTING.md).

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server with live reload |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run check` | `astro check`, type and template diagnostics |
| `npm run lint` | Brand and accessibility guardrails, `scripts/guardrails.sh` |
| `npm run lint:links` | Link check across `dist/`, run a build first |

## Roadmap

Built: `/`, `/about` and `/join`, plus `/motion-lab`, an internal component gallery that is
`noindex` and is not linked from the site.

Not built yet: `/events`, `/newsletter`, `/opportunities`, `/about/team` and `/sponsor`.
The navigation links to all five today, so those links 404.

All five are already specified in `design/UX-SPEC.md` section 5, so the hold-up is content
rather than engineering. They need the chapter to supply an event schedule, newsletter
issues, an opportunities list, team names and roles, and sponsor details. This site does
not publish invented data, so the routes stay unbuilt until that material exists.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

© 2025 ColorStack, University of Minnesota Chapter. All rights reserved.
