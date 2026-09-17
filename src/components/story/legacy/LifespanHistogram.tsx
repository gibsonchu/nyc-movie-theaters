"use client";

import { useMemo } from "react";
import { theaters } from "@/data/theaters";
import { lifespanDistribution, medianLifespan } from "@/lib/theater-stats";
import styles from "./LifespanHistogram.module.css";

const VIEW_W = 720;
const VIEW_H = 320;
// Extra top margin gives the median callout room to sit above every bar,
// rather than at a fixed height that can land inside a tall one.
const MARGIN = { top: 34, right: 16, bottom: 34, left: 36 };
const PLOT_W = VIEW_W - MARGIN.left - MARGIN.right;
const PLOT_H = VIEW_H - MARGIN.top - MARGIN.bottom;
const BUCKET_SIZE = 10;

export function LifespanHistogram() {
  const buckets = useMemo(() => lifespanDistribution(theaters, BUCKET_SIZE), []);
  const median = useMemo(() => medianLifespan(theaters), []);

  const maxCount = Math.max(...buckets.map((b) => b.count));
  const minFrom = buckets[0]?.from ?? 0;
  const maxFrom = buckets[buckets.length - 1]?.from ?? 100;
  const totalBuckets = (maxFrom - minFrom) / BUCKET_SIZE + 1;

  const xForBucket = (from: number) => MARGIN.left + ((from - minFrom) / BUCKET_SIZE / totalBuckets) * PLOT_W;
  const barWidth = PLOT_W / totalBuckets - 2;
  const yScale = (v: number) => MARGIN.top + PLOT_H - (v / maxCount) * PLOT_H;

  const medianX = MARGIN.left + ((median - minFrom) / BUCKET_SIZE / totalBuckets) * PLOT_W;

  const xTicks = buckets.filter((_, i) => i % 2 === 0);

  return (
    <div className={styles.wrap}>
      <p className={styles.chartTitle}>Distribution of theater lifespans in years.</p>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className={styles.svg} role="img" aria-label="Distribution of theater lifespans">
        {buckets.map((b) => (
          <rect
            key={b.from}
            x={xForBucket(b.from)}
            y={yScale(b.count)}
            width={barWidth}
            height={yScale(0) - yScale(b.count)}
            className={styles.bar}
          />
        ))}

        {xTicks.map((b) => (
          <text
            key={b.from}
            x={xForBucket(b.from) + barWidth / 2}
            y={VIEW_H - MARGIN.bottom + 18}
            textAnchor="middle"
            className={styles.xLabel}
          >
            {b.from}
          </text>
        ))}
        <line x1={MARGIN.left} x2={VIEW_W - MARGIN.right} y1={yScale(0)} y2={yScale(0)} className={styles.axisLine} />

        <line x1={medianX} x2={medianX} y1={MARGIN.top} y2={yScale(0)} className={styles.medianLine} />
        <text x={medianX} y={MARGIN.top - 10} textAnchor="middle" className={styles.medianLabel}>
          Median: {median} yrs
        </text>
      </svg>
    </div>
  );
}
