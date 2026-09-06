import styles from './editorial.module.css';

type Props = {
  /** "00".."06". The page index reads these too. */
  index: string;
  label: string;
  /** e.g. "4 programs", "updated Aug 2026". Joined with " · ". */
  meta?: string[];
  id?: string;
  inverse?: boolean;
};

/**
 * Mono meta row. Per docs/05: at most ONE per page outside the spec sheet
 * and footer, and never on the landing page. Kept for the newsletter and
 * about pages where a dated, numbered row is real information.
 */
export default function MetaRow({ index, label, meta = [], id, inverse }: Props) {
  return (
    <div id={id} className={`${styles.metaRow} ${inverse ? styles.inverse : ''}`} data-index={index}>
      <span>
        № {index} — {label}
      </span>
      {meta.length > 0 && <span className={styles.metaRight}>{meta.join(' · ')}</span>}
    </div>
  );
}
