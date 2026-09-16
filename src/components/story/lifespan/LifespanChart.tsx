"use client";

import { useMemo, useState } from "react";
import { theaters } from "@/data/theaters";
import type { Theater } from "@/types/theater";
import { useTimeline } from "@/state/TimelineContext";
import { getLifespan, longestRunning, shortestLived } from "@/lib/theater-stats";
import { formatYearRange } from "@/lib/theater-format";
import { MAX_YEAR, MIN_YEAR } from "@/lib/timeline";
import styles from "./LifespanChart.module.css";

const AXIS_TICKS = [1900, 1920, 1940, 1960, 1980, 2000, 2020];

function pct(year: number): number {
  return ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
}

function curatedSet(): Theater[] {
  const featured = theaters.filter((t) => t.featured);
  const combined = new Map<string, Theater>();
  for (const t of [...longestRunning(theaters, 10), ...shortestLived(theaters, 8), ...featured]) {
    combined.set(t.id, t);
  }
  return [...combined.values()].sort((a, b) => a.openingYear - b.openingYear);
}

export function LifespanChart() {
  const [expanded, setExpanded] = useState(false);
  const { selectTheater } = useTimeline();

  const curated = useMemo(() => curatedSet(), []);
  const all = useMemo(() => [...theaters].sort((a, b) => a.openingYear - b.openingYear), []);
  const rows = expanded ? all : curated;

  return (
    <div className={styles.wrap}>
      <div className={styles.axisHeader}>
        <div className={styles.axisLabelSpacer} />
        <div className={styles.axisTrack}>
          {AXIS_TICKS.map((year) => (
            <span key={year} className={styles.axisTick} style={{ left: `${pct(year)}%` }}>
              {year}
            </span>
          ))}
        </div>
      </div>

      <div className={expanded ? styles.rowsScroll : styles.rows}>
        {rows.map((t) => {
          const lifespan = getLifespan(t);
          const left = pct(t.openingYear);
          return (
            <button
              key={t.id}
              type="button"
              className={styles.row}
              onClick={() => selectTheater(t)}
              title={`${t.name} — ${formatYearRange(t)}`}
            >
              <span className={styles.label}>{t.name}</span>
              <span className={styles.track}>
                {lifespan.unknownEnd ? (
                  <span className={styles.unknownDot} style={{ left: `${left}%` }} />
                ) : (
                  <span
                    className={`${styles.bar} ${lifespan.openEnded ? styles.barOpenEnded : ""}`}
                    style={{
                      left: `${left}%`,
                      width: `${pct(lifespan.openEnded ? MAX_YEAR : t.closingYear!) - left}%`,
                    }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.controls}>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.legendBar} style={{ background: "var(--accent)", opacity: 0.82 }} /> Closed, known
            span
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendBar} style={{ background: "var(--ink)", opacity: 0.82 }} /> Still open
            (arrow marks &ldquo;ongoing&rdquo;)
          </span>
          <span className={styles.legendItem}>
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                border: "1.5px solid var(--ink-faint)",
              }}
            />{" "}
            Closed, exact year unknown
          </span>
        </div>
        <button type="button" className={styles.toggleBtn} onClick={() => setExpanded((e) => !e)}>
          {expanded ? "Show representative selection" : `Show all ${theaters.length.toLocaleString()} theaters`}
        </button>
      </div>
    </div>
  );
}
