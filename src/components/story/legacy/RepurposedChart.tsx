"use client";

import { useMemo } from "react";
import { theaters } from "@/data/theaters";
import { currentPlaceCategoryCounts, formerTheaters } from "@/lib/theater-stats";
import styles from "./RepurposedChart.module.css";

export function RepurposedChart() {
  const counts = useMemo(() => currentPlaceCategoryCounts(formerTheaters(theaters)), []);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Current use</th>
          <th>Theaters</th>
        </tr>
      </thead>
      <tbody>
        {counts.map((c) => (
          <tr key={c.category}>
            <td className={styles.category}>{c.category}</td>
            <td className={styles.count}>{c.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
