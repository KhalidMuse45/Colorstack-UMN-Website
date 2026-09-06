import Image from 'next/image';
import { Fragment } from 'react';
import Hero from '@/components/hero/Hero';
import PullQuote from '@/components/editorial/PullQuote';
import SpecSheet from '@/components/editorial/SpecSheet';
import NextBand from '@/components/editorial/NextBand';
import Reveal from '@/components/motion/Reveal';
import TextLoop from '@/components/motion/TextLoop';
import GetInTouch from '@/components/sections/GetInTouch';
import FloatingCards from '@/components/whimsy/FloatingCards';
import GlyphSticker from '@/components/whimsy/GlyphSticker';
import Marginalia from '@/components/whimsy/Marginalia';
import { getLanding } from '@/lib/landing';
import styles from './page.module.css';

/**
 * The landing page. Server component.
 *
 * Every section is `.container`: one width, one padding, no local max-widths.
 * Vertical rhythm is `--section-y` and nothing else. Every photograph sits in
 * one of the three shared aspect-ratio frames from globals.css with explicit
 * width and height and a `sizes` attribute, so no image can move the layout
 * when it loads.
 *
 * Nothing here carries a Fig. caption, an image tag, a meta note, a scroll
 * cue, a keyboard hint or a "Chapter Index" heading. The only mono on the page
 * is the gutter index, `[ Menu ]`, the spec-sheet keys and the footer.
 *
 * The gutter index runs 01 to 06 across the six sections that render.
 */
export default async function Page() {
  const d = await getLanding();

  return (
    <main>
      <Hero
        wordmark={d.heroWordmark}
        lede={d.heroLede}
        primary={{ label: d.heroPrimaryCta, href: d.mailingListUrl, external: true }}
        photo={d.heroPhoto}
        caption={d.heroPhoto.caption}
      />

      {/* 01 Mission */}
      <section className="section container" data-index="01">
        <h2>{d.missionHeadline}</h2>
        {d.missionBody.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
        {/* FIX-2 §5: prefix and rotating word on one line, the word underlined
            in gold. TextLoop owns the whole row, including the hairline. */}
        <TextLoop prefix={d.missionRotatorPrefix} items={d.missionRotator} interval={2.4} />
      </section>

      {/* 02 What We Do. Pentagram rhythm: photo, then title left, body right. */}
      <section className="section" id="what-we-do" data-index="02">
        <div className="container">
          <h2>{d.programsHeadline}</h2>
        </div>

        <div className={styles.programs}>
          {d.programs.map((pr) => (
            <Fragment key={pr.title}>
              {/* The one 8% wipe, once, per docs/06. The only reveal on the page. */}
              <Reveal mode="wipe" as="figure" className="frame frame-wide">
                <Image
                  src={pr.photo.src}
                  alt={pr.photo.alt}
                  width={pr.photo.width}
                  height={pr.photo.height}
                  sizes="100vw"
                  style={{ objectPosition: pr.photo.objectPosition }}
                />
              </Reveal>

              <div className="container">
                <div className={styles.programRow}>
                  <h3>{pr.title}</h3>
                  <p>{pr.body}</p>
                </div>
              </div>

              {/* The chapter's own sentence, on cream, between programs 2 and 3. */}
              {pr.pullQuote && (
                <div className="band-warm">
                  <div className="container">
                    <PullQuote>{pr.pullQuote}</PullQuote>
                  </div>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </section>

      {/* 03 Spec sheet. Renders only with two or more confirmed stats. */}
      <div className="band-warm" data-index="03">
        <div className="container">
          <SpecSheet stats={d.stats} aside={d.statsAside} />
        </div>
      </div>

      {/*
        04 Who We Show Up For. Rose is a change in distance, not a colour.

        The cycling duotone portrait that used to sit beside this copy went
        with the rest of the carousels. Rather than drop a still photograph in
        as a stand-in, the image slot is removed: this is a rose band that
        speaks in second person, and it does not need a picture to do it.
      */}
      <section className="section section-rose" data-index="04">
        <div className="container">
          <h2>{d.communityHeadline}</h2>
          {d.communityBody.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </section>

      {/*
        05 In the Room.

        The 2x2 duotone-to-colour-on-hover grid this section was specced with
        is retired (owner decision, 2026-09-06). It is now the rotating candid
        gallery from handoff/docs/07-FLOATINGCARDS.md: thin planes on white,
        each turning on its own vertical axis.

        `d.candids` is candids only, filtered on the `candid` flag in
        `lib/landing.ts`. Passing the whole photo pool here would put a posed
        portrait in the cloud, so this prop takes the filtered list and the
        filter is not repeated inside the component.

        The section shell is unchanged from the interim placeholder it replaced:
        the headline, the marginalia note in the gutter, the glyph stickers and
        the `data-index` the page rail reads. FloatingCards renders its own
        server-side markup, a static masonry of every photograph with its alt
        text, so this section still says something with the canvas removed.
      */}
      <section className="section container" data-index="05">
        <h2>{d.roomHeadline}</h2>
        <div className={styles.roomLayout}>
          <FloatingCards photos={d.candids} />

          <div className={styles.gutter}>
            {d.marginalia && <Marginalia>{d.marginalia}</Marginalia>}
            <GlyphSticker glyph="✦" rotate={-12} size={44} className={styles.sticker1} />
            <GlyphSticker glyph="✳" rotate={9} size={36} delay={0.1} className={styles.sticker2} />
          </div>
        </div>
      </section>

      {/* 06 Get in Touch: the puzzle, then the invitation it never blocks. */}
      <GetInTouch
        index="06"
        headline={d.getInTouchHeadline}
        body={d.getInTouchBody}
        sentence={d.puzzleSentence}
        mailingListUrl={d.mailingListUrl}
        ctaLabel={d.heroPrimaryCta}
        fieldLabel={d.getInTouchFieldLabel}
        placeholder={d.getInTouchPlaceholder}
        email={d.contactEmail}
        channels={d.channels}
      />

      <NextBand href="/about" label="About the chapter" photo={d.communityRoll[1]} />
    </main>
  );
}
