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
