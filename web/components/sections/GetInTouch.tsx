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

/**
 * The play beat and then the invitation. docs/02: "The invitation never waits
 * on the puzzle."
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
        <div className={styles.intro}>
          <h2>{headline}</h2>
          <p>{body}</p>
        </div>

        <RoomPuzzle sentence={sentence} />

        <div className={styles.invite}>
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
