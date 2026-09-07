import ResponsiveImage from '@/components/ui/ResponsiveImage';
import styles from './Hero.module.css';

export type HeroProps = {
  wordmark: string;
  eyebrow?: string;
  lede: string;
  primary: { label: string; href: string; external?: boolean };
  photo: { src: string; alt: string; width: number; height: number; objectPosition?: string };
  caption?: string;
};

/** The actual LCP photograph and headline render on the server, without a canvas. */
export default function Hero({ wordmark, eyebrow, lede, primary, photo, caption }: HeroProps) {
  return (
    <section data-hero className={styles.hero} aria-label={wordmark}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className={styles.mark}>
            {wordmark.split(' ').map((word, index) => (
              <span key={`${word}-${index}`}>{word}{index < wordmark.split(' ').length - 1 ? ' ' : ''}</span>
            ))}
          </h1>
          <p className={styles.lede}>{lede}</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={primary.href} target={primary.external ? '_blank' : undefined} rel={primary.external ? 'noopener noreferrer' : undefined}>
              {primary.label}<span aria-hidden="true">↗</span>
            </a>
            <a className={styles.secondary} href="#what-we-do">Meet the chapter <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <figure className={styles.media}>
          <div className={styles.photoFrame}>
            <ResponsiveImage className={styles.photo} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} priority sizes="(max-width: 453px) calc(100vw - 40px), (min-width: 768px) and (max-width: 1000px) 42vw, 414px" style={{ objectPosition: photo.objectPosition }} />
          </div>
          <figcaption className={styles.caption}>{caption || 'Our people. Our next chapter.'}</figcaption>
        </figure>
      </div>
    </section>
  );
}
