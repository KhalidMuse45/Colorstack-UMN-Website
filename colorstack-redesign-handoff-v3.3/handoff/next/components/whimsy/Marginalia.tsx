import styles from './whimsy.module.css';

/** One per page. Lora italic note in the outer gutter, desktop only. */
export default function Marginalia({ children }: { children: string }) {
  return <aside className={styles.marginalia}>{children}</aside>;
}
