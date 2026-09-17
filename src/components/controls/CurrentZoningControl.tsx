"use client";

import { useTimeline } from "@/state/TimelineContext";
import { CURRENT_ZONING_COLORS, CURRENT_ZONING_LABELS, type CurrentZoningClassification } from "@/types/current-zoning";
import styles from "./ZoningControl.module.css";

const CATEGORY_ORDER: CurrentZoningClassification[] = ["permitted", "restricted", "special", "not_permitted"];

export function CurrentZoningControl() {
  const { currentZoningMode, toggleCurrentZoningMode } = useTimeline();

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.toggleRow}
        onClick={toggleCurrentZoningMode}
        aria-pressed={currentZoningMode}
      >
        <span className={`${styles.switch} ${currentZoningMode ? styles.switchOn : ""}`}>
          <span className={styles.switchKnob} />
        </span>
        <span className={styles.toggleLabel}>Where Theaters Are Allowed Today</span>
      </button>

      {currentZoningMode && (
        <div className={styles.panel}>
          <p className={styles.eraLabel}>Current zoning screen, July 2026</p>
          <ul className={styles.legend}>
            {CATEGORY_ORDER.map((category) => (
              <li key={category} className={styles.legendRow}>
                <span className={styles.swatch} style={{ background: CURRENT_ZONING_COLORS[category] }} />
                <span>{CURRENT_ZONING_LABELS[category]}</span>
              </li>
            ))}
          </ul>
          <p className={styles.eraNote}>
            A planning screen against today&rsquo;s citywide zoning rules (ZR 32-181, 32-183, 42-181) &mdash; not a
            legal opinion. Every historical theater site is colored the same way; click one for its full screening
            record. The timeline above doesn&rsquo;t affect this view.
          </p>
        </div>
      )}
    </div>
  );
}
