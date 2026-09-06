import Image from 'next/image';
import { Fragment } from 'react';
import Hero from '@/components/hero/Hero';
import PullQuote from '@/components/editorial/PullQuote';
import SpecSheet from '@/components/editorial/SpecSheet';
import NextBand from '@/components/editorial/NextBand';
import Reveal from '@/components/motion/Reveal';
import TextLoop from '@/components/motion/TextLoop';
import PhotoRoll from '@/components/media/PhotoRoll';
import Voices from '@/components/sections/Voices';
import GetInTouch from '@/components/sections/GetInTouch';
import GlyphSticker from '@/components/whimsy/GlyphSticker';
import Marginalia from '@/components/whimsy/Marginalia';
import { getLanding } from '@/lib/landing';
import styles from './page.module.css';

/**
 * The landing page. Server component. Section order and copy: DESIGN.md "The
 * landing page", detail in docs/02, revised by docs/05.
 *
 * Nothing on this page carries a `Fig.` caption, an image tag, a meta note or
 * a scroll cue. The only mono on it is the gutter index, the `[ Menu ]`
 * bracket, the spec-sheet keys and the footer.
 *
 * Gutter index numbering. The handoff skeleton numbered Voices as 05, which
 * would leave the rail reading 01 02 03 04 06 for as long as the chapter has
 * no real testimonials, which is today and is the expected state. The six
 * sections that actually render carry 01 to 06 and Voices takes 07 when it
 * appears. PageIndex reads these off the DOM, so it stays honest either way.
 */
export default async function Page() {
  const d = await getLanding();

  // Voices only exists when the chapter has supplied two or more real quotes.
  // Numbering the rail around it here keeps 01 to 06 contiguous today and 01
  // to 07 contiguous the day the quotes land.
  const hasVoices = d.testimonials.length >= 2;

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
        <div className={styles.missionBody}>
          {d.missionBody.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
        <p className={styles.rotator}>
          {d.missionRotatorPrefix}{' '}
          <TextLoop items={d.missionRotator} interval={2.4} />
        </p>
      </section>

      {/* 02 What We Do. Pentagram rhythm: photo, then title left, body right. */}
      <section className="section" id="what-we-do" data-index="02">
        <div className="container">
          <h2>{d.programsHeadline}</h2>
        </div>

        <div className={styles.programs}>
          {d.programs.map((pr) => (
            <Fragment key={pr.title}>
              <Reveal mode="wipe" as="figure" className={styles.programPhoto}>
                <Image
                  src={pr.photo.src}
                  alt={pr.photo.alt}
                  fill
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

      {/* 04 Who We Show Up For. Rose is a change in distance, not a colour. */}
      <section className="section section-rose" data-index="04">
        <div className="container">
          <div className={styles.communityLayout}>
            <div className={styles.communityCopy}>
              <h2>{d.communityHeadline}</h2>
              {d.communityBody.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            <PhotoRoll photos={d.communityRoll} />
          </div>
        </div>
      </section>

      {/*
        05 In the Room.

        INTERIM PLACEHOLDER. The 2x2 duotone-to-colour-on-hover grid this
        section was specced with is retired (owner decision, 2026-09-06). The
        section becomes a rotating R3F candid-photo gallery built on
        FloatingCards, per handoff/docs/07-FLOATINGCARDS.md, and a follow-up
        pass owns that component.

        What is deliberately here and should survive the swap: the section
        shell. The headline, the marginalia note in the gutter, the glyph
        stickers, the `data-index` the page rail reads, and the same four
        photographs with their real alt text. What is deliberately NOT here:
        any hover treatment or duotone polish, because it is about to be
        replaced by a canvas. A plain static grid until then.
      */}
      <section className="section container" data-index="05">
        <h2>{d.roomHeadline}</h2>
        <div className={styles.roomLayout}>
          <div className={styles.roomGrid}>
            {d.roomGrid.map((ph) => (
              <figure key={ph.src} className={styles.roomCell}>
                <Image
                  src={ph.src}
                  alt={ph.alt}
                  fill
                  sizes="(min-width: 900px) 45vw, 50vw"
                  style={{ objectPosition: ph.objectPosition }}
                />
              </figure>
            ))}
          </div>

          <div className={styles.gutter}>
            {d.marginalia && <Marginalia>{d.marginalia}</Marginalia>}
            <GlyphSticker glyph="✦" rotate={-12} size={44} className={styles.sticker1} />
            <GlyphSticker glyph="✳" rotate={9} size={36} tone="maroon" delay={0.1} className={styles.sticker2} />
          </div>
        </div>
      </section>

      {/* Voices. Renders nothing at all until there are two real quotes. */}
      <Voices testimonials={d.testimonials} headline={d.voicesHeadline} index="06" />

      {/* Get in Touch: the puzzle, then the invitation it never blocks. */}
      <GetInTouch
        index={hasVoices ? '07' : '06'}
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
