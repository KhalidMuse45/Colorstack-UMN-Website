import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './Pill.module.css';

type Props = {
  href: string;
  children: ReactNode;
  tone?: 'gold' | 'maroon' | 'ghost';
  /** Mono suffix inside the pill, teenage-engineering style: "↗ 01". Optional. */
  index?: string;
  external?: boolean;
};

export default function Pill({ href, children, tone = 'gold', index, external }: Props) {
  const cls = `${styles.pill} ${styles[tone]}`;
  const inner = (
    <>
      <span>{children}</span>
      {index && <span className={styles.index}>↗ {index}</span>}
    </>
  );
  return external ? (
    <a className={cls} href={href} target="_blank" rel="noopener">
      {inner}
    </a>
  ) : (
    <Link className={cls} href={href}>
      {inner}
    </Link>
  );
}
