import Link from 'next/link';
import Image from 'next/image';
import { editorialNav } from '@/lib/nav';
import styles from './SideNav.module.css';

/**
 * Poolside-style indented panel for editorial pages: rounded, 1px border,
 * mascot mark, short vertical list. Fixed top-left ≥ 900px; below that the
 * page falls back to <Nav>'s [ Menu ] bracket.
 */
export default function SideNav({ tone = 'warm' }: { tone?: 'warm' | 'paper' }) {
  return (
    <aside className={`${styles.panel} ${tone === 'warm' ? styles.warm : styles.paper}`} aria-label="Editorial navigation">
      <Link href="/" className={styles.mark} aria-label="ColorStack UMN, home">
        <Image src="/images/colorstack-umn-mark-192.webp" alt="" width={28} height={28} />
      </Link>
      <nav className={styles.list}>
        {editorialNav.map((i) => (
          <Link key={i.href} href={i.href}>
            {i.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
