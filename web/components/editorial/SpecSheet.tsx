import NumberRoll from '@/components/motion/NumberRoll';
import styles from './editorial.module.css';

export type Stat = { value: string; label: string; confirmedOn?: string };

/**
 * Hardware-label stats on cream. Hairline grid, mono keys, Archivo 900 values,
 * rolled once on first entry.
 *
 * FIXED from the handoff, twice, both in the same direction:
 *
 *   1. The band's guard read `... < 2 && process.env.NODE_ENV === 'production'`,
 *      so outside a production build it rendered a one-cell or zero-cell spec
 *      sheet. docs/06 has no environment in it: fewer than two confirmed
 *      stats and the band does not render at all.
 *   2. Worse, `const ok = Boolean(s.confirmedOn) || NODE_ENV === 'production'`
 *      made every unconfirmed stat render as a real number in production and
 *      as a dot in development, which is exactly backwards. A number nobody
 *      has signed their name to is the one thing this component exists to keep
 *      off the page. `ok` is now confirmation and nothing else.
 */
export default function SpecSheet({ stats, aside }: { stats: Stat[]; aside?: string }) {
  const confirmed = stats.filter((s) => s.confirmedOn);
  if (confirmed.length < 2) return null;

  return (
    <section className={styles.spec} aria-label="Chapter at a glance">
      <dl className={styles.specGrid}>
        {stats.map((s) => {
          const ok = Boolean(s.confirmedOn);
          return (
            <div key={s.label} className={styles.cell}>
              <dt>{s.label}</dt>
              <dd>{ok ? <NumberRoll value={s.value} /> : '·'}</dd>
              {!ok && <small>confirm with e-board</small>}
            </div>
          );
        })}
      </dl>
      {aside && <p className={styles.aside}>{aside}</p>}
    </section>
  );
}
