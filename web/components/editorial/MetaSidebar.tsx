import styles from './editorial.module.css';

/** Pentagram's Client / Sector / Team block, for a chapter. About page. */
export default function MetaSidebar({ rows }: { rows: { key: string; value: string | string[] }[] }) {
  return (
    <aside className={styles.sidebar}>
      {rows.map((r) => (
        <div key={r.key}>
          <dt>{r.key}</dt>
          {(Array.isArray(r.value) ? r.value : [r.value]).map((v) => (
            <dd key={v}>{v}</dd>
          ))}
        </div>
      ))}
    </aside>
  );
}
