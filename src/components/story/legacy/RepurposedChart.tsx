"use client";

import { useMemo } from "react";
import { theaters } from "@/data/theaters";
import { currentPlaceCategoryCounts, formerTheaters } from "@/lib/theater-stats";
import styles from "./RepurposedChart.module.css";

export function RepurposedChart() {
  const counts = useMemo(() => currentPlaceCategoryCounts(formerTheaters(theaters)), []);
  const max = Math.max(...counts.map((c) => c.count));
  const total = counts.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className={styles.wrap}>
      {counts.map((c) => (
        <div key={c.category} className={styles.row}>
          <span className={styles.label}>{c.category}</span>
          <div className={styles.track}>
            <div className={styles.bar} style={{ width: `${(c.count / max) * 100}%` }} />
          </div>
          <span className={styles.count}>{c.count}</span>
        </div>
      ))}
      <p className={styles.caption}>
        Based on a geocoding audit of former addresses; {total.toLocaleString()} closed theaters had a citeable
        present-day occupant worth naming — most others are now just an ordinary building, or the geocoder found
        nothing distinctive there.
      </p>
    </div>
  );
}
