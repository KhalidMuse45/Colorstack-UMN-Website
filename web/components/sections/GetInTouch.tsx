import type { Landing } from '@/lib/landing';
import styles from './GetInTouch.module.css';

type Props = {
  headline: string;
  body: string;
  mailingListUrl: string;
  ctaLabel: string;
  email: string;
  channels: Landing['channels'];
};

/** A direct invitation. The hosted signup form owns validation and submissions. */
export default function GetInTouch({ headline, body, mailingListUrl, ctaLabel, email, channels }: Props) {
  const socials = channels.filter((c) => c.label === 'Instagram' || c.label === 'LinkedIn');
  return (
    <section className={`section ${styles.section}`} id="join" aria-labelledby="join-heading">
      <div className={`container ${styles.wrap}`}>
        <div className={styles.intro}>
          <p className="eyebrow">05 / Your next chapter</p>
          <h2 id="join-heading">{headline}</h2>
          <p className={styles.body}>{body}</p>
          <a className={styles.join} href={mailingListUrl} target="_blank" rel="noopener noreferrer">{ctaLabel}<span aria-hidden="true">↗</span></a>
        </div>
        <div className={styles.reach} id="get-in-touch">
          <p className={styles.reachTitle}>Start a conversation.</p>
          <a className={styles.email} href={`mailto:${email}`}>{email}</a>
          <p>Questions about joining, partnering, or speaking at a meeting? Get in touch.</p>
          <div className={styles.socials}>{socials.map((c) => <a key={c.href} href={c.href} target="_blank" rel="noopener noreferrer">{c.label} <span aria-hidden="true">↗</span></a>)}</div>
        </div>
      </div>
    </section>
  );
}
