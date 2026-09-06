import styles from './Voices.module.css';

export type Testimonial = { quote: string; name: string; role?: string };

/**
 * The Voices marquee: paper quote cards in Lora italic, travelling on a CSS
 * keyframe. No JavaScript, no library.
 *
 * RENDERS NOTHING with fewer than two real testimonials, and today there are
 * zero: `content/landing.ts` keeps `testimonials` deliberately empty and says
 * why. An empty band with a heading over it would be worse than no band, and a
 * placeholder quote would be a fabricated claim in the chapter's name. So this
 * returns null and the section does not exist in the DOM.
 *
 * When the e-board supplies quotes with names, add them to the content file
 * and the section appears. Nothing else has to change.
 */
export default function Voices({
  testimonials,
  headline,
  index,
}: {
  testimonials: Testimonial[];
  headline: string;
  /** Gutter index number, assigned by the page so the rail stays contiguous. */
  index: string;
}) {
  if (testimonials.length < 2) return null;

  // Doubled so the loop has something to slide into. The copy is aria-hidden
  // so nothing is announced twice.
  const lap = [...testimonials, ...testimonials];

  return (
    <section className="section" data-index={index} aria-label="Voices">
      <div className="container">
        <h2>{headline}</h2>
      </div>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {lap.map((t, i) => (
            <figure key={`${t.name}-${i}`} className={styles.card} aria-hidden={i >= testimonials.length}>
              <blockquote className={styles.quote}>{t.quote}</blockquote>
              <figcaption className={styles.who}>
                {t.name}
                {t.role && <span className={styles.role}>{t.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
