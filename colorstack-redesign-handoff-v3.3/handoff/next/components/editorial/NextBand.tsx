import Link from 'next/link';
import Image from 'next/image';
import styles from './editorial.module.css';

/** Full-width maroon handoff at the bottom of every page. */
export default function NextBand({ href, label, photo }: { href: string; label: string; photo?: { src: string; alt: string } }) {
  return (
    <Link href={href} className={styles.next}>
      <span>→ Next: {label}</span>
      {photo && (
        <span className={styles.nextPeek} aria-hidden>
          <Image src={photo.src} alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} />
        </span>
      )}
    </Link>
  );
}
