import RoomPuzzle from '@/components/whimsy/RoomPuzzle';
import CopyEmail from '@/components/ui/CopyEmail';
import type { Landing } from '@/lib/landing';
import styles from './GetInTouch.module.css';

type Props = {
  headline: string;
  body: string;
  sentence: string;
  mailingListUrl: string;
  ctaLabel: string;
  fieldLabel: string;
  placeholder: string;
  email: string;
  channels: Landing['channels'];
  /** Gutter index number, assigned by the page. */
  index: string;
};

/*
 * The two lines of copy beside the puzzle, quoted from FIX-2 section 6. They
 * are about the puzzle rather than about the chapter, so they sit with the
 * component that owns it; everything the chapter says is still a prop out of
 * content/landing.ts.
 */
const PUZZLE_LEAD = 'Slide a tile into the open space. Put the sentence back together.';
const PUZZLE_ASIDE = 'No rush. Some things are worth figuring out just because.';

/**
 * The play beat and then the invitation. docs/02: "The invitation never waits
 * on the puzzle."
 *
 * Two columns: the heading and its two lines on the left, the puzzle on the
 * right. Directly beneath, unblocked by anything the puzzle does, the mailing
 * list field, the chapter inbox and the socials.
 *
 * The form is a plain GET to the Logicform endpoint in a new tab, with the
 * field named `email`, which is the same shape the Astro site has been posting
 * with. No JavaScript is involved in submitting it, so it works whatever else
 * on the page did not load.
 */
export default function GetInTouch({
  headline,
  body,
  sentence,
  mailingListUrl,
  ctaLabel,
  fieldLabel,
  placeholder,
  email,
  channels,
  index,
}: Props) {
  const socials = channels.filter((c) => c.label === 'Instagram' || c.label === 'LinkedIn');

  return (
    <section className="section container" id="get-in-touch" data-index={index}>
      <div className={styles.wrap}>
        <div className={styles.play}>
          {/* Archivo 800 at 40px is the global h2; nothing is overridden here. */}
          <div className={styles.intro}>
            <h2>{headline}</h2>
            <p>{PUZZLE_LEAD}</p>
            <p className={styles.aside}>{PUZZLE_ASIDE}</p>
          </div>

          <RoomPuzzle sentence={sentence} />
        </div>

        <div className={styles.invite}>
          <p className={styles.body}>{body}</p>

          <form className={styles.form} action={mailingListUrl} method="get" target="_blank">
            <label className={styles.field}>
              {fieldLabel}
              <input type="email" name="email" placeholder={placeholder} required autoComplete="email" />
            </label>
            <button type="submit" className={styles.submit}>
              {ctaLabel}
            </button>
          </form>

          <div className={styles.reach}>
            <CopyEmail email={email} />
            {socials.map((c) => (
              <a key={c.href} className="link" href={c.href} target="_blank" rel="noopener">
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
