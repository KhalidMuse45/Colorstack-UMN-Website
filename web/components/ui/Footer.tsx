import Link from 'next/link';
import Image from 'next/image';
import { primaryNav, footerNav, socialNav, contactEmail } from '@/lib/nav';
import CopyEmail from './CopyEmail';
import styles from './Footer.module.css';

/**
 * Full sitemap, the chapter inbox, socials, chapter mark bottom-right at 32px.
 *
 * The legal line is the wording docs/02 specifies, including the "not
 * affiliated" disclaimer. It is a statement about the chapter's relationship
 * to the University and it was given to us, not inferred.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <nav className={styles.col} aria-label="Sitemap">
            <p className={styles.heading}>The site</p>
            {primaryNav.map((i) => (
              <Link key={i.href} href={i.href}>
                {i.label}
              </Link>
            ))}
          </nav>

          <nav className={styles.col} aria-label="More">
            <p className={styles.heading}>More</p>
            {footerNav.map((i) => (
              <Link key={i.href} href={i.href}>
                {i.label}
              </Link>
            ))}
          </nav>

          <div className={styles.col}>
            <p className={styles.heading}>Reach us</p>
            <CopyEmail email={contactEmail} />
            {socialNav.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className={styles.foot}>
          <p className={styles.legal}>
            {'©'} 2026 ColorStack UMN {'·'} Not affiliated with the University of Minnesota
          </p>
          <span className={styles.mark}>
            <Image
              src="/images/colorstack-umn-mark-192.webp"
              alt="ColorStack UMN chapter mark"
              width={32}
              height={32}
            />
          </span>
        </div>
      </div>
    </footer>
  );
}
