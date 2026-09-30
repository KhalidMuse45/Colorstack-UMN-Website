import type { Landing } from '@/lib/landing';
import Arrow from '@/components/ui/Arrow';
import Icon from '@/components/ui/Icon';
import CopyButton from '@/components/ui/CopyButton';
import { getInTouchNote as note } from '@/content/join';
import n from '@/components/notes/notes.module.css';
import styles from './GetInTouch.module.css';

type Props = {
  headline: string;
  body: string;
  joinHref: string;
  ctaLabel: string;
  email: string;
  channels: Landing['channels'];
};

/**
 * 05 / Your next chapter. Pencil frame "05 Your Next Chapter — Start a
 * Conversation": the invitation on the left, and the Get in Touch sticky note
 * (rose and maroon sheets tucked behind) on the right.
 */
export default function GetInTouch({ headline, body, joinHref, ctaLabel, email, channels }: Props) {
  const socials = channels.filter((c) => c.label === 'Instagram' || c.label === 'LinkedIn');
  return (
    <section className={`section ${styles.section}`} id="join" aria-labelledby="join-heading">
      <div className={`container ${styles.wrap}`}>
        <div className={styles.intro}>
          <p className="eyebrow">05 / Your next chapter</p>
          <h2 id="join-heading">{headline}</h2>
          <p className={styles.body}>{body}</p>
          <a className={styles.join} href={joinHref}>{ctaLabel}<Arrow /></a>
        </div>

        <div className={`${n.stack} ${styles.stack}`} id="get-in-touch">
          <span className={`${n.sheet} ${n.rose} ${styles.sheetRose}`} aria-hidden="true" />
          <span className={`${n.sheet} ${n.maroon} ${styles.sheetMaroon}`} aria-hidden="true" />
          <div className={`${n.note} ${styles.note}`}>
            <span className={n.tape} aria-hidden="true" />
            <p className={n.label}>{note.eyebrow}</p>
            <h3 className={styles.title}>{note.title}</h3>
            <div className={styles.emailBox}>
              <div className={styles.emailText}>
                <span className={n.microLabel}>{note.emailLabel}</span>
                <a className={styles.email} href={`mailto:${email}`}>{email}</a>
              </div>
              <CopyButton text={email} className={styles.copy} />
            </div>
            <p className={styles.noteBody}>{note.body}</p>
            <div className={n.rows}>
              {socials.map((c) => (
                <a key={c.href} className={n.row} href={c.href} target="_blank" rel="noopener noreferrer">
                  <span className={n.tile}><Icon name={c.label === 'Instagram' ? 'instagram' : 'linkedin'} size={15} /></span>
                  <span className={n.rowText}><span className={n.microLabel}>{c.label}</span><span className={n.rowValue}>{c.value}</span></span>
                  <Arrow className={n.rowArrow} />
                </a>
              ))}
            </div>
            <p className={`${n.scrawl} ${styles.sign}`}>{note.sign} <span className={styles.signYou}>{note.signEmphasis}</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}
