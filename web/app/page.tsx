import ResponsiveImage from '@/components/ui/ResponsiveImage';
import Hero from '@/components/hero/Hero';
import PullQuote from '@/components/editorial/PullQuote';
import SpecSheet from '@/components/editorial/SpecSheet';
import GetInTouch from '@/components/sections/GetInTouch';
import FloatingCards from '@/components/whimsy/FloatingCards';
import { getLanding, type Landing } from '@/lib/landing';
import styles from './page.module.css';

function Program({ program, index, className = '' }: { program: Landing['programs'][number]; index: number; className?: string }) {
  return (
    <article className={`${styles.program} ${className}`}>
      <figure className={styles.programImage}>
        <ResponsiveImage src={program.photo.src} alt={program.photo.alt} width={program.photo.width} height={program.photo.height} sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1319px) 52vw, 660px" style={{ objectPosition: program.photo.objectPosition }} />
      </figure>
      <div className={styles.programCopy}>
        <span className={styles.programNumber} aria-hidden="true">0{index + 1}</span>
        <h3>{program.title}</h3>
        <p>{program.body}</p>
      </div>
    </article>
  );
}
export default async function Page() {
  const d = await getLanding();
  const portrait = d.communityRoll[0];
  return (
    <main id="main-content">
      <Hero wordmark={d.heroWordmark} eyebrow={d.heroEyebrow} lede={d.heroLede} primary={{ label: d.heroPrimaryCta, href: d.mailingListUrl, external: true }} photo={d.heroPhoto} caption={d.heroPhoto.caption} />
      <section className={`section container ${styles.mission}`} id="about" aria-labelledby="mission-heading">
        <div><p className="eyebrow">01 / Our purpose</p><h2 id="mission-heading">{d.missionHeadline}</h2></div>
        <div className={styles.missionBody}>{d.missionBody.map((p) => <p key={p}>{p}</p>)}<p className={styles.missionSignoff}>Building a space for <span>you.</span></p></div>
      </section>
      <section className={`section container ${styles.programsSection}`} id="what-we-do" aria-labelledby="programs-heading">
        <div className={styles.sectionHead}><p className="eyebrow">02 / What we do</p><h2 id="programs-heading">{d.programsHeadline}</h2></div>
        <div className={styles.programs}>
          {d.programs[0] && <Program program={d.programs[0]} index={0} className={styles.featuredProgram} />}
          <div className={styles.programPair}>{d.programs.slice(1, 3).map((program, i) => <Program key={program.title} program={program} index={i + 1} />)}</div>
          {d.programs[1]?.pullQuote && <div className={styles.quote}><PullQuote>{d.programs[1].pullQuote}</PullQuote></div>}
          {d.programs.slice(3).map((program, i) => <Program key={program.title} program={program} index={i + 3} className={styles.finalProgram} />)}
        </div>
      </section>
      <div className={`container ${styles.stats}`}><SpecSheet stats={d.stats} aside={d.statsAside} /></div>
      <section className={`section ${styles.community}`} id="community" aria-labelledby="community-heading">
        <div className={`container ${styles.communityGrid}`}>
          <div className={styles.communityCopy}><p className="eyebrow">03 / A place to belong</p><h2 id="community-heading">{d.communityHeadline}</h2>{d.communityBody.map((p) => <p key={p}>{p}</p>)}<a href="#join" className={styles.communityLink}>Find your people <span aria-hidden="true">↗</span></a></div>
          {portrait && <figure className={styles.communityPhoto}><ResponsiveImage src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} sizes="(max-width: 767px) 78vw, (max-width: 1319px) 30vw, 360px" /></figure>}
        </div>
      </section>
      <section className={`section container ${styles.room}`} id="in-the-room" aria-labelledby="room-heading">
        <div className={styles.roomIntro}><div><p className="eyebrow">04 / In the room</p><h2 id="room-heading">{d.roomHeadline}</h2></div><p>From first introductions to shared ambitions. A few moments with our community.</p></div>
        <FloatingCards photos={d.candids} />
      </section>
      <GetInTouch headline={d.getInTouchHeadline} body={d.getInTouchBody} mailingListUrl={d.mailingListUrl} ctaLabel={d.heroPrimaryCta} email={d.contactEmail} channels={d.channels} />
    </main>
  );
}
