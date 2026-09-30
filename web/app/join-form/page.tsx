import type { Metadata } from 'next';
import Arrow from '@/components/ui/Arrow';
import Icon from '@/components/ui/Icon';
import JoinHero from '@/components/join/JoinHero';
import { boardApplications as board, joinFaq as faq, joinSteps as steps } from '@/content/join';
import { channels, contact, photos } from '@/content/landing';
import n from '@/components/notes/notes.module.css';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Join the list · ColorStack UMN',
  description: 'Pull up a chair. One list for event invites, internship deadlines, and Chapter Notes, our monthly newsletter.',
};

const instagram = channels.find((c) => c.label === 'Instagram')?.href ?? '/';

/** join-form.html. Pencil frame "join-form.html — Full Page". */
export default function JoinFormPage() {
  const photo = photos.staircaseGroup;
  return (
    <>
      <main id="main-content">
        <JoinHero photo={photo} email={contact.email} instagram={instagram} />

        <section className={`container ${styles.steps}`} aria-labelledby="steps-heading">
          <div className={styles.stepsHead} data-reveal>
            <div>
              <p className="eyebrow">{steps.eyebrow}</p>
              <h2 id="steps-heading" className={styles.bigTitle}>{steps.title}</h2>
            </div>
            <p className={styles.aside}>{steps.aside.map((line) => <span key={line}>{line}</span>)}</p>
          </div>
          <ol className={styles.stepList}>
            {steps.steps.map((s, i) => (
              <li key={s.title} className={styles.step} data-reveal>
                <div className={styles.stepTop}><span>0{i + 1}</span><span className={styles.stepIcon}><Icon name={s.icon} size={19} /></span></div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                {s.cta && <a className={styles.outline} href={instagram} target="_blank" rel="noopener noreferrer"><Icon name="instagram" size={16} />{s.cta}<Arrow /></a>}
                <p className={`${n.scrawl} ${styles.stepNote}`}>{s.note}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.board} aria-labelledby="board-heading">
          <div className={`container ${styles.boardGrid}`}>
            <div data-reveal>
              <p className={`eyebrow ${styles.gold}`}>{board.eyebrow}</p>
              <h2 id="board-heading" className={`${styles.bigTitle} ${styles.onDark}`}>{board.title}</h2>
              <p className={styles.boardBody}>{board.body}</p>
              <div className={styles.actions}>
                <a className={styles.goldButton} href="#join">{board.cta}<Icon name="arrow-up" size={16} /></a>
                <span className={styles.status}>{board.status}</span>
              </div>
            </div>
            <div className={`${n.stack} ${styles.rolesStack}`} data-reveal>
              <span className={`${n.sheet} ${n.maroon} ${styles.rolesSheet}`} aria-hidden="true" />
              <div className={`${n.note} ${styles.rolesNote}`}>
                <span className={n.tape} aria-hidden="true" />
                <h3 className={styles.rolesTitle}>{board.noteTitle}</h3>
                <p className={styles.stamp}><span>{board.stamp}</span><span>{board.stampSub}</span></p>
                <ul className={styles.roles}>
                  {board.roles.map((r) => <li key={r.role}><strong>{r.role}</strong><span>{r.what}</span></li>)}
                </ul>
                <p className={`${n.scrawl} ${styles.rolesSign}`}>{board.sign}</p>
              </div>
            </div>
          </div>
        </section>

        <section className={`container ${styles.faq}`} aria-labelledby="faq-heading">
          <div className={styles.faqHead} data-reveal>
            <p className="eyebrow">{faq.eyebrow}</p>
            <h2 id="faq-heading" className={styles.faqTitle}>{faq.title}</h2>
            <p className={`${n.scrawl} ${styles.scribble}`}>{faq.scribble}</p>
          </div>
          <div className={styles.faqList} data-reveal>
            {faq.items.map((item, i) => (
              <details key={item.q} className={styles.faqItem} open={i === 0}>
                <summary><span>{item.q}</span><span className={styles.toggle} aria-hidden="true"><Icon name="plus" size={14} className={styles.plus} /><Icon name="minus" size={14} className={styles.minus} /></span></summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>{'©'} 2026 ColorStack UMN {'·'} Not affiliated with the University of Minnesota</p>
        <p className={styles.help}>Questions? <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
      </footer>
    </>
  );
}
