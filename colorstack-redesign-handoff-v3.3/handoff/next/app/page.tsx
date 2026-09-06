import Image from 'next/image';
import Hero from '@/components/hero/Hero';
import PullQuote from '@/components/editorial/PullQuote';
import SpecSheet from '@/components/editorial/SpecSheet';
import NextBand from '@/components/editorial/NextBand';
import Reveal from '@/components/motion/Reveal';
import GlyphSticker from '@/components/whimsy/GlyphSticker';
import Marginalia from '@/components/whimsy/Marginalia';
import { getLanding } from '@/lib/sanity/queries';

/**
 * Landing page. Server component. Section order and copy: docs/02, revised per docs/05.
 * No MetaRow, no Fig. captions, no image tags on this page. Sections carry data-index for the gutter index only.
 * Swap `getLanding()` for the local `content/landing.ts` export while Sanity
 * is empty; the shape is identical.
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

      {/* Mission */}
      <section className="section container" data-index="01">
        <h2>{d.missionHeadline}</h2>
        {d.missionBody.map((p, i) => <p key={i}>{p}</p>)}
        {/* TextLoop lives in components/motion; rotator words from d.missionRotator */}
      </section>

      {/* What we do */}
      <section className="section container" id="what-we-do" data-index="02">
        <h2>{d.programsHeadline}</h2>
        {d.programs.map((pr, i) => (
          <article key={pr.title}>
            <Reveal mode="wipe" as="figure" className="full-bleed">
              <Image src={pr.photo.src} alt={pr.photo.alt} width={pr.photo.width} height={pr.photo.height} sizes="100vw" />
            </Reveal>
            <div className="two-col">
              <h3>{pr.title}</h3>
              <p>{pr.body}</p>
            </div>
            {pr.pullQuote && i === 1 && (
              <div className="band-warm full-bleed">
                <div className="container"><PullQuote>{pr.pullQuote}</PullQuote></div>
              </div>
            )}
          </article>
        ))}
      </section>

      <div className="band-warm">
        <div className="container">
          <SpecSheet stats={d.stats} aside={d.statsAside} />
        </div>
      </div>

      {/* Who we show up for */}
      <section className="section section-rose" data-index="03">
        <div className="container">
          <h2>{d.communityHeadline}</h2>
          {d.communityBody.map((p, i) => <p key={i}>{p}</p>)}
          {/* PhotoRoll (to build): cycles d.communityRoll with a wipe every 4s, duotone on rose */}
        </div>
      </section>

      {/* In the room */}
      <section className="section container" data-index="04">
        <h2>{d.roomHeadline}</h2>
        {d.marginalia && <Marginalia>{d.marginalia}</Marginalia>}
        <div className="grid-2">
          {d.roomGrid.map((ph) => (
            <figure key={ph.src} className="duotone">
              <Image src={ph.src} alt={ph.alt} width={ph.width} height={ph.height} sizes="(min-width: 768px) 50vw, 100vw" />
            </figure>
          ))}
        </div>
        <GlyphSticker glyph="✦" rotate={-12} />
      </section>

      {/* Voices: renders only with two or more real quotes */}
      {d.testimonials.length >= 2 && (
        <section className="section container" data-index="05">
          {/* Marquee (to build): CSS keyframe, paper cards, Lora italic */}
        </section>
      )}

      {/* Get in touch: CardDeck (to build, framer-motion drag) + mailing list form. No label above the deck. */}
      <section className="section container" id="get-in-touch" data-index="06">
        <h2>Come find your people.</h2>
      </section>

      <NextBand href="/about" label="About the chapter" photo={d.communityRoll[0]} />
    </main>
  );
}
