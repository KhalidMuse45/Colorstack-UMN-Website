# 03 — Stack and Migration

## Decision

Next.js 15 App Router · Sanity v3 · GSAP + ScrollTrigger · Lenis · React Three Fiber + drei · Framer Motion (drag/spring only) · TypeScript · plain CSS with custom properties (no Tailwind).

Why no Tailwind: the token layer is already CSS variables and the brand rules ban literal hexes outside two files. Tailwind's config duplicates that and the class strings fight the hex-lint. CSS Modules per component.

## Packages

```
next react react-dom typescript
gsap @gsap/react
lenis
three @react-three/fiber @react-three/drei
framer-motion
next-sanity @sanity/image-url @sanity/client sanity @sanity/vision
@portabletext/react
```

Dev: `@types/three eslint eslint-config-next`.

## Folder layout

```
app/
  layout.tsx          fonts, SmoothScroll, PageIndex, Nav, Footer
  page.tsx            landing (server component; fetches Sanity, renders sections)
  about/page.tsx
  join/page.tsx
  globals.css         tokens + base
  studio/[[...tool]]/page.tsx   embedded Sanity Studio at /studio
components/
  hero/       Hero.tsx  HeroScene.tsx  heroShader.ts
  editorial/  MetaRow (restricted, see 05)  PullQuote  SpecSheet  NextBand  MetaSidebar
  motion/     SmoothScroll  Reveal  TextRoll  TextLoop  NumberRoll  ZoomImage
  whimsy/     GlyphSticker  Marginalia  CardDeck  FloatingCards  Cursor
  ui/         Pill  Nav  SideNav  Footer  PageIndex
  events/     (Events page uses FloatingCards as its hero)
lib/
  gsap.ts     registers plugins, exports EASE, DURATION, STAGGER
  tokens.ts   hex values for JS/GLSL (the only JS file allowed to hold hexes)
  sanity/     client.ts  queries.ts  image.ts
sanity/
  sanity.config.ts
  schemaTypes/
public/images/   the existing WebP set, unchanged
scripts/guardrails.sh   four checks only (see 01)
```

## Migration from Astro (one day)

1. **Scaffold.** `npx create-next-app@latest colorstack-umn --ts --app --src-dir=false --eslint --no-tailwind`. Copy `public/images` and `public/CNAME`.
2. **Tokens.** `src/styles/colors.css` + `spacing.css` + `typography.css` → `app/globals.css`. Remove `--photo-ground` and `--photo-tint` (addendum-only). Page ground is `--page: #FFFFFF`; `--cream` becomes an alias of `--surface-warm` (see 05). Mirror hexes into `lib/tokens.ts`.
3. **Fonts.** `next/font/google` for Archivo (700, 800, 900), Lora (400, 500, 600, italic 400/500), IBM Plex Mono (400, 500). Expose as CSS variables `--font-display`, `--font-body`, `--font-mono`.
4. **Content.** `src/data/landing.ts` → `content/landing.ts` unchanged for now. Page reads from it until Sanity is populated; then swap to `getLanding()` from `lib/sanity/queries.ts`. Keep the file until the swap is verified.
5. **Components.** Drop in `next/components/*` from this handoff. Port `TextLoop`, `NumberRoll`, `TextRoll` from the Astro motion folder to GSAP (the logic is the same; replace the vanilla DOM timing with `useGSAP`). Delete `LiquidMenu`, `ProgressiveBlur`, `InfiniteSlider`, `AnimatedGroup`, `Accordion`; replace the marquee with a 30-line CSS keyframe.
6. **Motion root.** `SmoothScroll` wraps `{children}` in `layout.tsx`. Registers ScrollTrigger and drives it from the Lenis raf.
7. **Sanity.** `npm create sanity@latest -- --template clean --typescript` into `sanity/`, copy `schemaTypes/`. Mount studio at `/studio`. Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET=production`, `SANITY_API_READ_TOKEN`.
8. **Guardrails.** Replace the script with the four surviving checks. Add `lib/tokens.ts` and `app/globals.css` to the hex-exempt list.
9. **Deploy.** Vercel. Keep `colorstackumn.org` DNS; add `/studio` to the same deployment. Set `images.remotePatterns` for `cdn.sanity.io`.
10. **Verify.** Lighthouse mobile ≥ 90 performance with the canvas enabled. LCP is the hero `<img>` fallback that renders under the canvas until the texture loads; keep it `priority`.

## Performance rules

- One `<Canvas>` per page (landing: HeroScene; events: FloatingCards), `dpr={[1, 1.5]}`, `frameloop="always"` only while the hero is in view; `frameloop="demand"` after.
- Hero texture: 2000px wide WebP, ≤ 350KB. Ship a 24px blurred placeholder inline.
- GSAP ScrollTrigger `scrub` values ≤ 0.8. No `scrub: true` on the hero (it looks stepped under Lenis).
- Framer Motion only in `CardDeck`. Everything else is GSAP.
- Fonts: `display: 'swap'`, subset `latin`.

## Page transitions

Next App Router with `ViewTransition` (React canary) is not required. Use a 320ms cream wipe via a fixed overlay driven by `usePathname()` change in `SmoothScroll`. Do not persist the hero canvas across routes; each page that wants a canvas mounts its own.
