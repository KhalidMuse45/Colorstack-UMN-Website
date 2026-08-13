# Roadmap

Where the site stands and what comes next. For the content the chapter still
needs to supply, see [CONTENT-NEEDED.md](CONTENT-NEEDED.md).

## Built

| Route | Notes |
| --- | --- |
| `/` | Landing page. All copy, photos and links come from `src/data/landing.ts` |
| `/about` | Chapter story and national affiliation |
| `/join` | Mailing-list signup. The form is a plain GET that works with JavaScript disabled |
| `/motion-lab` | Internal only. Shows the motion primitives in isolation, carries `noindex`, excluded from the sitemap |

Verified on the landing page, so these can be trusted:

- JavaScript disabled and reduced motion both leave every section readable,
  with nothing stranded at `opacity: 0`
- No horizontal overflow at 1280 or 375
- Lighthouse mobile: accessibility 100, best practices 100, SEO 92
- LCP 1744ms against the 2000ms budget in `design/UX-SPEC.md` section 8
- CLS 0.00

## Next

### 1. The five remaining routes

`/events` · `/newsletter` · `/opportunities` · `/about/team` · `/sponsor`

Every one of these is linked from the navigation and currently 404s. Each has a
content spec in `design/UX-SPEC.md` section 5. All five are blocked on content,
not on engineering; see [CONTENT-NEEDED.md](CONTENT-NEEDED.md).

`/newsletter` is the one place the editorial treatment survives: IBM Plex Mono,
`No.` indexes, `Fig.` captions. Its reference is
`design/reference/Chapter Notes Newsletter.html`.

**When you build one of these, delete its entry from the `--skip` list in the
`lint:links` script in `package.json`.** Those skips exist only because the
routes 404 today. Leaving one in means the link checker silently stops
protecting that route.

### 2. Connect the custom domain

The site is deployed but `colorstackumn.org` is not connected. GitHub Pages
reports no custom domain, so the `public/CNAME` file alone is not enough: the
domain has to be set in the repository's Pages settings and DNS has to point at
GitHub.

Until then the site serves from the github.io URL, and because
`astro.config.mjs` sets `site` to the custom domain with no `base`, internal
links resolve correctly only once the domain is live.

### 3. Requested extras

Asked for directly, not part of the design bundle. None are specified, so agree
the look before building.

- **Join dialog.** A real `<dialog>` for mailing-list capture. Keyboard
  closable, returns focus to whatever opened it, and still works with
  JavaScript off by falling back to the existing form.
- **Wunderbar.** Owner asked to discuss the design before anything is built.
  **Do not start this without that conversation.**
- **Word-tile bar for the sub-bar.** The swatches originally supplied are a
  different palette. Retone to the chapter's maroon and gold first, and show
  the owner before building. Reduced motion must render the bar assembled and
  static.
- **Text ripple on the logo.** `TextEffect` already does per-character reveal
  and is the natural base, but the logo is currently an image, so this needs a
  text wordmark first. The iCiel Gotham face is not in the repository.

### 4. Polish still outstanding

- An axe accessibility pass. Lighthouse is clean but does not cover everything.
- Decide whether the toolbar/dock idea replaces the floating action button or
  sits alongside it. Two floating controls on one page is one too many.
