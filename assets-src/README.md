# assets-src

Original photo masters, straight off the camera or phone. **Nothing here is
served.** The site only ever loads the optimised WebP files in
`public/images/`.

These are kept so a photo can be re-cropped or re-exported later without
chasing the original down again. That matters because
`design/reference/LandingPage.dc.html` tunes `object-position` per photo, and
re-framing a shot means going back to the master, not upscaling a WebP.

## Regenerating a WebP from a master

Convert a master directly with the `sharp` that already ships under Astro's
image pipeline:

```bash
node -e "
const s = require('sharp');
s('assets-src/photos/<name>.jpg')
  .rotate()                                   // honour EXIF orientation
  .resize(2400, 1800, { fit: 'cover', position: 'attention' })
  .webp({ quality: 80, effort: 6 })
  .toFile('public/images/<name>.webp')
  .then(i => console.log(i.width + 'x' + i.height, (i.size/1024).toFixed(0) + 'KB'));
"
```

Then update the entry in `src/data/landing.ts`: set `width` and `height` to the
real output dimensions, and remove `placeholder: true`.

Always eyeball the result before committing. `position: 'attention'` picks the
crop automatically and will happily cut heads off a group photo.

## What is here

| File | Used for | Notes |
| --- | --- | --- |
| `photos/summit-group.jpeg` | `/images/summit-group.webp` | Group at a table at the national summit. The hero photo |
| `photos/summit-portrait.jpg` | `/images/summit-portrait.webp` | The delegation posed together, portrait orientation |
| `photos/summit-signage.jpg` | `/images/summit-signage.webp` | Stacked Up Summit 2026 welcome screen |
| `photos/ideathon.jpg` | `/images/ideathon.webp` | Members at laptops during the Ideathon |
| `photos/game-night-chess.jpg` | `/images/game-night-chess.webp` | Chess and Connect Four at game night |
| `photos/game-night-signage.jpg` | `/images/game-night-signage.webp` | The hand-drawn game night whiteboard |

Every landing-page photo slot is now filled with a real chapter photo. No
generated placeholders remain on `/`.

## If you add a new photo slot

Drop the master in `photos/`, convert it with the command above, add the entry
to `src/data/landing.ts` with truthful alt text and the real output dimensions,
and log it in `docs/CONTENT-NEEDED.md`.

## A note on the people in these photos

These are identifiable chapter members, supplied by the chapter for the chapter
website. If anyone asks to be removed, replace the master and re-convert; do
not crop them out of a served WebP, because the master is what future crops
come from.
