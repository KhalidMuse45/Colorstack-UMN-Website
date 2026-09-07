import styles from './editorial.module.css';

export type Stat = { value: string; label: string; confirmedOn?: string };

/** Only confirmed chapter figures render; no animation delays their reading. */
export default function SpecSheet({ stats, aside }: { stats: Stat[]; aside?: string }) {
  const confirmed = stats.filter((s) => s.confirmedOn);
  if (confirmed.length < 2) return null;
  return (
    <section className={styles.spec} aria-label="Chapter at a glance">
      <dl className={styles.specGrid}>{confirmed.map((s) => <div key={s.label} className={styles.cell}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>
      {aside && <p className={styles.aside}>{aside}</p>}
    </section>
  );
}
