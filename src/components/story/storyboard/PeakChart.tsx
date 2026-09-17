"use client";

import { useMemo } from "react";
import { theaters } from "@/data/theaters";
import { activeCountsByYearAndBorough } from "@/lib/theater-stats";
import { MIN_YEAR, MAX_YEAR } from "@/lib/timeline";
import type { Borough } from "@/types/theater";
import styles from "./PeakChart.module.css";

const VIEW_W = 620;
const VIEW_H = 520;
const MARGIN = { top: 16, right: 16, bottom: 34, left: 44 };
const PLOT_W = VIEW_W - MARGIN.left - MARGIN.right;
const PLOT_H = VIEW_H - MARGIN.top - MARGIN.bottom;

const BOROUGH_ORDER: Borough[] = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];

const BOROUGH_COLORS: Record<Borough, string> = {
  Manhattan: "#a4283c",
  Brooklyn: "#3d6f8c",
  Queens: "#c98a2e",
  Bronx: "#5c7a45",
  "Staten Island": "#8a6b9e",
};

function xForYear(year: number): number {
  return MARGIN.left + ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * PLOT_W;
}

export function PeakChart() {
  const byBorough = useMemo(() => activeCountsByYearAndBorough(theaters), []);
  const years = useMemo(() => byBorough.Manhattan.map((d) => d.year), [byBorough]);

  // Only the confirmed (dated) count per borough feeds the stack — see the
  // chart's own footnote for why undated theaters are excluded entirely.
  const maxTotal = useMemo(() => {
    let max = 0;
    for (let i = 0; i < years.length; i++) {
      let sum = 0;
      for (const borough of BOROUGH_ORDER) sum += byBorough[borough][i].confirmed;
      if (sum > max) max = sum;
    }
    return max;
  }, [byBorough, years]);

  const yScale = useMemo(() => (value: number) => MARGIN.top + PLOT_H - (value / maxTotal) * PLOT_H, [maxTotal]);

  // Stack each borough's band on top of the previous one's running total.
  const stackedAreas = useMemo(() => {
    const cumulative = new Array(years.length).fill(0);
    return BOROUGH_ORDER.map((borough) => {
      const series = byBorough[borough];
      const bottoms = cumulative.slice();
      for (let i = 0; i < years.length; i++) cumulative[i] += series[i].confirmed;
      const tops = cumulative.slice();

      const topPoints = years.map((year, i) => `${xForYear(year)},${yScale(tops[i])}`);
      const bottomPoints = years
        .map((year, i) => `${xForYear(year)},${yScale(bottoms[i])}`)
        .reverse();
      return {
        borough,
        color: BOROUGH_COLORS[borough],
        path: `M${topPoints.join(" L")} L${bottomPoints.join(" L")} Z`,
      };
    });
  }, [byBorough, years, yScale]);

  const yTicks = useMemo(() => {
    const step = maxTotal > 400 ? 100 : 50;
    const ticks: number[] = [];
    for (let v = 0; v <= maxTotal; v += step) ticks.push(v);
    return ticks;
  }, [maxTotal]);

  const xTicks = [1900, 1920, 1940, 1960, 1980, 2000, 2020];

  return (
    <div className={styles.wrap}>
      <p className={styles.chartTitle}>Operating Movie Theaters in NYC Over Time</p>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className={styles.svg} role="img" aria-label="Operating theaters over time, by borough">
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={MARGIN.left} x2={VIEW_W - MARGIN.right} y1={yScale(v)} y2={yScale(v)} className={styles.gridLine} />
            <text x={MARGIN.left - 8} y={yScale(v)} className={styles.yLabel} textAnchor="end" dy="0.32em">
              {v}
            </text>
          </g>
        ))}

        {stackedAreas.map(({ borough, color, path }) => (
          <path key={borough} d={path} fill={color} fillOpacity={0.85} />
        ))}

        {xTicks.map((year) => (
          <text key={year} x={xForYear(year)} y={VIEW_H - MARGIN.bottom + 20} className={styles.xLabel} textAnchor="middle">
            {year}
          </text>
        ))}
        <line
          x1={MARGIN.left}
          x2={VIEW_W - MARGIN.right}
          y1={VIEW_H - MARGIN.bottom}
          y2={VIEW_H - MARGIN.bottom}
          className={styles.axisLine}
        />
      </svg>

      <div className={styles.legend}>
        {BOROUGH_ORDER.map((borough) => (
          <span key={borough} className={styles.legendItem}>
            <span className={styles.swatch} style={{ background: BOROUGH_COLORS[borough] }} /> {borough}
          </span>
        ))}
      </div>

      <p className={styles.footnote}>
        The movie theaters counted here excludes those in which we are missing either the opening or closing dates.
      </p>
    </div>
  );
}
