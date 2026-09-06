import NumberRoll from '@/components/motion/NumberRoll';
import styles from './editorial.module.css';

export type Stat = { value: string; label: string; confirmedOn?: string };

/**
 * Hardware-label stats. Hairline grid, mono keys, Archivo 900 values.
 * Unconfirmed stats are filtered upstream (Sanity query). If a cell is
 * passed without confirmedOn in dev, it renders a dot and a note.
 */
export default function SpecSheet({ stats, aside }: { stats: Stat[]; aside?: string }) {
  // docs/06: fewer than two confirmed stats and the band does not render at all.
  if (stats.filter((s) => s.confirmedOn).length < 2 && process.env.NODE_ENV === 'production') return null;
  return (
    <section className={styles.spec} aria-label="Chapter at a glance">
      <dl className={styles.specGrid}>
        {stats.map((s) => {
          const ok = Boolean(s.confirmedOn) || process.env.NODE_ENV === 'production';
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
