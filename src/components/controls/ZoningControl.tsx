"use client";

import { useTimeline } from "@/state/TimelineContext";
import { getActiveZoningDataset } from "@/data/zoning";
import { ZONING_CATEGORY_COLORS, ZONING_CATEGORY_LABELS, type ZoningCategory } from "@/types/zoning";
import styles from "./ZoningControl.module.css";

const CATEGORY_ORDER: ZoningCategory[] = [
  "permitted",
  "conditional",
  "special-permit",
  "not-permitted",
];

export function ZoningControl() {
  const { year, zoningVisible, toggleZoning } = useTimeline();
  const dataset = getActiveZoningDataset(year);

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.toggleRow}
        onClick={toggleZoning}
        aria-pressed={zoningVisible}
      >
        <span className={`${styles.switch} ${zoningVisible ? styles.switchOn : ""}`}>
          <span className={styles.switchKnob} />
        </span>
        <span className={styles.toggleLabel}>Movie Theater Zoning</span>
      </button>

      {zoningVisible && dataset && (
        <div className={styles.panel}>
          <p className={styles.eraLabel}>{dataset.label}</p>
          <ul className={styles.legend}>
            {CATEGORY_ORDER.map((category) => (
              <li key={category} className={styles.legendRow}>
                <span
                  className={styles.swatch}
                  style={{ background: ZONING_CATEGORY_COLORS[category] }}
                />
                <span>{ZONING_CATEGORY_LABELS[category]}</span>
              </li>
            ))}
          </ul>
          <p className={styles.eraNote}>{dataset.description}</p>
        </div>
      )}
    </div>
  );
}
