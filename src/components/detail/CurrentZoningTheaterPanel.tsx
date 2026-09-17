"use client";

import { useTimeline } from "@/state/TimelineContext";
import { CURRENT_ZONING_COLORS } from "@/types/current-zoning";
import styles from "./CurrentZoningTheaterPanel.module.css";

export function CurrentZoningTheaterPanel() {
  const { selectedZoningTheater, selectZoningTheater } = useTimeline();

  if (!selectedZoningTheater) return null;
  const t = selectedZoningTheater;

  return (
    <aside className={styles.panel}>
      <button type="button" className={styles.close} onClick={() => selectZoningTheater(null)} aria-label="Close">
        &times;
      </button>

      <p className={styles.eyebrow}>
        {t.borough} &middot; {t.openingYear}&ndash;{t.closingYear ?? "?"}
      </p>
      <h3 className={styles.name}>{t.name}</h3>
      {t.alternateNames && <p className={styles.alternateNames}>also known as {t.alternateNames}</p>}
      <p className={styles.address}>{t.historicalAddress}</p>

      <p className={styles.classification} style={{ color: CURRENT_ZONING_COLORS[t.classification] }}>
        <span className={styles.swatch} style={{ background: CURRENT_ZONING_COLORS[t.classification] }} />
        {t.classificationLabel}
      </p>
      <p className={styles.explanation}>{t.classificationExplanation}</p>

      <dl className={styles.stats}>
        <div className={styles.stat}>
          <dt>Base zoning</dt>
          <dd>{t.currentBaseZoning}</dd>
        </div>
        {t.currentCommercialOverlay && (
          <div className={styles.stat}>
            <dt>Commercial overlay</dt>
            <dd>{t.currentCommercialOverlay}</dd>
          </div>
        )}
        <div className={styles.stat}>
          <dt>Effective use district</dt>
          <dd>{t.effectiveUseDistrict}</dd>
        </div>
        {t.specialPurposeDistrict && (
          <div className={styles.stat}>
            <dt>Special-purpose district</dt>
            <dd>{t.specialPurposeDistrict}</dd>
          </div>
        )}
        <div className={styles.stat}>
          <dt>BBL</dt>
          <dd>{t.bbl}</dd>
        </div>
      </dl>

      {t.manualReviewReason && <p className={styles.reviewFlag}>Flagged for review: {t.manualReviewReason}</p>}

      <p className={styles.footnote}>
        Screening confidence: {t.screeningConfidence}. {t.ruleCitation}. Data date {t.zoningDataDate}.
      </p>

      {t.sourceUrl && (
        <a href={t.sourceUrl} target="_blank" rel="noreferrer" className={styles.sourceLink}>
          Cinema Treasures record &rarr;
        </a>
      )}
    </aside>
  );
}
