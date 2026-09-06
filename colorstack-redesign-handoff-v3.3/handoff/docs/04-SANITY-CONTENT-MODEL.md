# 04 — Sanity Content Model

Chosen for the e-board's editing experience and for future additions (events, newsletter archive, opportunities) without touching layout.

## Documents

| Type | Singleton | Purpose |
|---|---|---|
| `siteSettings` | yes | Chapter email, socials, mailing-list URL, footer line, chapter mark |
| `landingPage` | yes | Every string and photo on `/`, in section order |
| `program` | no | Workshops, Leadership, Professional Development, Community. Ordered |
| `testimonial` | no | Quote, name, role, optional photo. Voices renders only when ≥ 2 exist |
| `chapterPhoto` | no | Reusable photo with truthful alt text, `takenAt`, `event` |
| `stat` | no | Value, label, `confirmedBy`, `confirmedOn`. Unconfirmed stats never render |
| `event` (future) | no | Title, date, location, RSVP link |
| `newsletterIssue` (future) | no | Portable text issue with the editorial print treatment |

## Rules the schema enforces

- `chapterPhoto.alt` is required and must be a full sentence describing the frame.
- `stat` requires `confirmedBy` and `confirmedOn`. Frontend filters `defined(confirmedOn)`.
- `program` has an `order` integer; the query sorts on it.
- Portable text blocks allow only `strong`, `em`, links. No headings inside body copy, no em dash (validation regex on string fields).
- "ColorStack" casing validated on every string field via a shared `noBadCasing` rule.

## Queries (`lib/sanity/queries.ts`)

- `landingQuery` fetches the singleton, expands `hero.photo`, `programs[]->`, `stats[]->` (confirmed only), `testimonials[]->`, `inTheRoom[]->`, `communityRoll[]->`.
- Use `sanityFetch` with `next: { revalidate: 60, tags: ['landing'] }`. Add a webhook route at `/api/revalidate` that calls `revalidateTag`.

## Studio

Mounted at `/studio` inside the Next app. Desk structure pins the two singletons at the top, then Programs, Photos, Stats, Testimonials. Preview pane uses the Next dev URL.

## Editing workflow for the e-board

1. Upload photos under **Photos** first, with alt text. The alt field will not save empty.
2. Edit copy in **Landing Page**. Section fields are in page order.
3. Stats require the name of whoever confirmed the number and the date. Otherwise they don't ship.
4. Publish. The site updates within a minute.

## Migration of existing content

Run once: a script under `scripts/seed-sanity.ts` that reads `content/landing.ts`, uploads the six WebPs as `chapterPhoto` documents with their existing alt text, creates the four `program` docs, the two `stat` docs (confirmedBy: chapter, confirmedOn: 2026-08-12), and the `landingPage` singleton. Testimonials: none.
