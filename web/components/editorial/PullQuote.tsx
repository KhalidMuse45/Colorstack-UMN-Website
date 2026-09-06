import styles from './editorial.module.css';

/** Pentagram-style interjection between images. Lora italic, no attribution needed. */
export default function PullQuote({ children, cite }: { children: React.ReactNode; cite?: string }) {
  return (
    <blockquote className={styles.pull}>
      <p>{children}</p>
      {cite && <footer>{cite}</footer>}
    </blockquote>
  );
}
