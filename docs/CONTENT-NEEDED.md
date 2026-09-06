# Content needed from the chapter

Five pages are unbuilt. **None of them are blocked on engineering.** They are
blocked because nobody has supplied the content, and this project does not
invent chapter data.

That rule is not fussiness. This is a real student organisation's public site,
read by recruiters and sponsors. A made-up member count or a plausible-sounding
quote is a claim made on the chapter's behalf that nobody actually said. If a
fact is missing, the slot is left out and listed here instead.

Hand any of the following to a developer and the matching page can be built.

## Blocking a whole page

| Needed | Unblocks |
| --- | --- |
| Event listings: date, title, location, RSVP link, past or upcoming | `/events`, and the next-event band on the home page |
| Board roster: names, roles, headshots, LinkedIn URLs | `/about/team` |
| Confirmed reach numbers for sponsors | `/sponsor` |
| Chapter Notes newsletter issues | `/newsletter` |
| Current job and internship listings | `/opportunities` |

`/opportunities` has a second half, the national ColorStack programmes, that
could be written from public sources. The jobs board is the blocked part, and a
stale jobs board is worse than none.

## Blocking part of a page that already exists

**Slack and GroupMe URLs.** `/join` is built and working, but the community
links the spec asks for are missing because no URL for them exists anywhere in
this repository. The slot is left out rather than stubbed.

**Meeting time and location.** Deliberately absent from the entire site. The
location has never been confirmed, so the contact copy routes that question to
the inbox instead. Supply a confirmed time and place and it can go on `/join`
and the home page.

**Testimonials.** `testimonials` in `src/data/landing.ts` is an empty array on
purpose, so the Voices section renders nothing at all rather than an empty
band. The design reference shipped three placeholder quotes reading
"Placeholder quote / Replace"; those must not ship. Add real quotes with a real
name and role and the section appears by itself.

If a quote comes with a photo, get the person's consent on the record first.

## From the redesign photo drop (2026-09-06, see assets-src/photo-triage.md)

**Usage rights for the Stacked Up Summit photos.** Everything in
`assets-src/photos/UMNSTACKEDUP/` is professional photography from the
national summit, credited to Chloe Jackman Photography in the filenames. The
chapter supplied the files, but written confirmation that the chapter may use
them on its own site is worth having before launch.

**"In the Room" wants a Tuesday, the drop supplies a photoshoot.** 42 of the
45 board-shoot photos are a styled editorial shoot of two or three board
members at Northrop, not a meeting in progress. The section ships with the
closest genuine candids for now; real meeting-night photos with broader member
representation would replace them well.

**No community-program photos in the new drop.** Nothing new shows a game
night or potluck, so that slot keeps `game-night-chess`. More would help.

**The puzzle sentence is designer copy.** The Get in Touch slide puzzle
assembles `You have a place in this room ✳` until the e-board writes its own
sentence (eight words or fewer works best).

**The hero caption is off until the chapter turns it on.** One optional
string naming the hero photo's event, nothing else.

**Sanity project.** The redesign's CMS swap needs someone to create the Sanity
project (project ID + dataset) so the e-board can edit copy. Until then the
new site reads from `web/content/landing.ts`.

## Worth a second look before launch

**The stat band says `100+` members and `10+` offers.** Both were confirmed by
the chapter. Flagging it anyway because the retired site advertised `50+`
members and `25+` offers. Members doubling is plausible. Offers falling from
25+ to 10+ is not obviously so, and one of the two figures is probably
miscounted. This is the most sponsor-facing number on the site.

**Three photo slots reuse summit shots.** All six landing photos are real
chapter photos, but the chapter may prefer different frames for the portrait
and the two game-night slots. Masters are in `assets-src/`; the conversion
command is in `assets-src/README.md`.

**The people in the photos are identifiable members**, supplied by the chapter
for this purpose. If anyone asks to be removed, replace the master and
re-convert rather than cropping a served image, because the master is what
future crops come from.
