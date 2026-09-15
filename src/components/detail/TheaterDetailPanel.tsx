"use client";

import { useTimeline } from "@/state/TimelineContext";
import { THEATER_TYPE_LABELS } from "@/types/theater";
import { formatYearRange } from "@/lib/theater-format";
import styles from "./TheaterDetailPanel.module.css";

export function TheaterDetailPanel() {
  const { selectedTheater, selectTheater } = useTimeline();

  if (!selectedTheater) return null;
  const t = selectedTheater;

  return (
    <aside className={styles.panel}>
      <button type="button" className={styles.close} onClick={() => selectTheater(null)} aria-label="Close">
        &times;
      </button>

      <p className={styles.eyebrow}>
        {t.borough}
        {t.theaterType !== "unknown" ? ` · ${THEATER_TYPE_LABELS[t.theaterType]}` : ""}
      </p>
      <h2 className={styles.name}>{t.name}</h2>
      {t.alternateNames.length > 0 && (
        <p className={styles.alternateNames}>also known as {t.alternateNames.join(", ")}</p>
      )}
      <p className={styles.years}>{formatYearRange(t)}</p>

      {t.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.image} alt={t.name} className={styles.image} />
      )}

      <p className={styles.address}>{t.address}</p>

      <dl className={styles.stats}>
        {t.screens != null && (
          <div className={styles.stat}>
            <dt>Screens</dt>
            <dd>{t.screens}</dd>
          </div>
        )}
        {t.seats != null && (
          <div className={styles.stat}>
            <dt>Seats</dt>
            <dd>{t.seats.toLocaleString()}</dd>
          </div>
        )}
        {t.operator && (
          <div className={styles.stat}>
            <dt>Operator</dt>
            <dd>{t.operator}</dd>
          </div>
        )}
      </dl>

      <p className={styles.description}>{t.description}</p>

      {t.sources.length > 0 && (
        <div className={styles.sources}>
          <p className={styles.sourcesLabel}>Sources</p>
          <ul>
            {t.sources.map((source) => (
              <li key={source.label}>
                {source.url ? (
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                ) : (
                  source.label
                )}
              </li>
            ))}
          </ul>
          {t.confidence !== "high" && (
            <p className={styles.confidenceNote}>Source confidence: {t.confidence}</p>
          )}
        </div>
      )}
    </aside>
  );
}
