'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import Arrow from '@/components/ui/Arrow';
import Icon from '@/components/ui/Icon';
import { JOIN_ENDPOINT, joinForm as f, joinHero as hero, joinSuccess as done } from '@/content/join';
import { fireConfetti } from './confetti';
import n from '@/components/notes/notes.module.css';
import styles from './JoinHero.module.css';

type Photo = { src: string; alt: string; width: number; height: number };
type Status = 'idle' | 'sending' | 'error' | 'done';

/**
 * 01 · Join Hero. Pencil frames "Join Form · A — Pull Up a Chair" (the form)
 * and "join-form.html — Submitted" (the confirmation). The same hero swaps
 * between them, so the submit lands on "You're on the list" with confetti
 * instead of leaving the page.
 */
export default function JoinHero({ photo, email, instagram }: { photo: Photo; email: string; instagram: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const successTitle = useRef<HTMLHeadingElement>(null);
  const successNote = useRef<HTMLDivElement>(null);
  const submitted = status === 'done';

  useEffect(() => {
    if (!submitted) return;
    successTitle.current?.focus({ preventScroll: true });
    successNote.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const id = window.setTimeout(() => fireConfetti(successNote.current?.getBoundingClientRect()), 180);
    return () => window.clearTimeout(id);
  }, [submitted]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      year: data.get('year'),
      major: data.get('major'),
      interests: data.getAll('interests'),
      newsletter: data.get('newsletter') === 'on',
      company: data.get('company'),
    };
    setStatus('sending');
    try {
      // `next dev` has no Pages Functions runtime, so local runs skip the network.
      if (process.env.NODE_ENV === 'development') await new Promise((r) => setTimeout(r, 500));
      else {
        const res = await fetch(JOIN_ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(String(res.status));
      }
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className={styles.hero} id="join" aria-labelledby={submitted ? 'join-done-heading' : 'join-heading'}>
      <div className={styles.photo} aria-hidden="true">
        <ResponsiveImage src={photo.src} alt="" width={photo.width} height={photo.height} sizes="100vw" priority />
      </div>
      <div className={styles.scrim} aria-hidden="true" />

      <header className={styles.nav}>
        <Link href="/" className={styles.brand} aria-label="ColorStack UMN, home">ColorStack <span>UMN</span></Link>
        <Link href="/" className={styles.back}><Icon name="arrow-left" size={16} />{hero.back}</Link>
      </header>

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{submitted ? done.eyebrow : hero.eyebrow}</p>
          <h1 id="join-heading" className={styles.heading}>{submitted ? done.headline : hero.headline}</h1>
          <p className={styles.body}>{submitted ? done.body : hero.body}</p>
          <ol className={styles.perks}>
            {hero.perks.map((perk, i) => <li key={perk}><span>0{i + 1}</span>{perk}</li>)}
          </ol>
        </div>

        <div className={`${n.stack} ${styles.stack} ${submitted ? styles.stackDone : ''}`}>
          <span className={`${n.sheet} ${n.maroon} ${styles.sheet}`} aria-hidden="true" />
          {submitted ? (
            <div ref={successNote} className={`${n.note} ${styles.note} ${styles.doneNote}`} role="status">
              <span className={n.tape} aria-hidden="true" />
              <span className={styles.badge}><Icon name="check" size={32} style={{ strokeWidth: 2.4 }} /></span>
              <p className={n.label}>{done.noteEyebrow}</p>
              <h2 id="join-done-heading" ref={successTitle} tabIndex={-1} className={styles.doneTitle}>{done.title}</h2>
              <p className={styles.doneBody}>{done.noteBody}</p>
              <div className={`${n.rows} ${styles.doneRows}`}>
                {done.rows.map((row) => (
                  <a key={row.label} className={n.row} href={instagram} target="_blank" rel="noopener noreferrer">
                    <span className={n.tile}><Icon name={row.icon} size={15} /></span>
                    <span className={n.rowText}><span className={n.microLabel}>{row.label}</span><span className={n.rowValue}>{row.value}</span></span>
                    <Arrow className={n.rowArrow} />
                  </a>
                ))}
              </div>
              <Link href="/" className={styles.submit}>{done.back}</Link>
              <p className={`${n.scrawl} ${styles.sign}`}>{f.sign}</p>
            </div>
          ) : (
            <form className={`${n.note} ${styles.note}`} onSubmit={onSubmit} aria-labelledby="join-form-title">
              <span className={n.tape} aria-hidden="true" />
              <div className={styles.formHead}>
                <p className={n.label}>{f.eyebrow}</p>
                <h2 id="join-form-title" className={styles.formTitle}>{f.title}</h2>
              </div>

              <div className={styles.pair}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{f.name.label}</span>
                  <input className={styles.input} name="name" autoComplete="name" placeholder={f.name.placeholder} required maxLength={120} />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{f.email.label}</span>
                  <input className={styles.input} name="email" type="email" autoComplete="email" inputMode="email" placeholder={f.email.placeholder} required maxLength={200} />
                </label>
              </div>

              <fieldset className={styles.group}>
                <legend className={styles.fieldLabel}>{f.year.label}</legend>
                <div className={styles.chips}>
                  {f.year.options.map((y) => (
                    <label key={y} className={styles.chip}><input type="radio" name="year" value={y} /><span>{y}</span></label>
                  ))}
                </div>
              </fieldset>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>{f.major.label}</span>
                <input className={styles.input} name="major" autoComplete="off" placeholder={f.major.placeholder} maxLength={120} />
              </label>

              <fieldset className={styles.group}>
                <legend className={styles.fieldLabel}>{f.interests.label}</legend>
                <div className={styles.chips}>
                  {f.interests.options.map((o) => (
                    <label key={o} className={styles.chip}><input type="checkbox" name="interests" value={o} /><span>{o}</span></label>
                  ))}
                </div>
              </fieldset>

              <label className={styles.check}>
                <input type="checkbox" name="newsletter" defaultChecked />
                <span className={styles.box} aria-hidden="true"><Icon name="check" size={14} style={{ strokeWidth: 2.6 }} /></span>
                <span>{f.newsletter}</span>
              </label>

              {/* Honeypot, hidden from people and assistive tech. */}
              <input className={styles.trap} name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <div className={styles.foot}>
                {status === 'error' && (
                  <p className={styles.error} role="alert">{f.error} <a href={`mailto:${email}`}>{email}</a></p>
                )}
                <button className={styles.submit} type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? f.submitting : f.submit}
                </button>
                <p className={`${n.scrawl} ${styles.sign}`}>{f.sign}</p>
              </div>
            </form>
          )}
        </div>
      </div>

      <p className={styles.caption}>{hero.caption}</p>
    </section>
  );
}
