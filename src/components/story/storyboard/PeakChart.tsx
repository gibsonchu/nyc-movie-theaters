"use client";

import { useId, useMemo } from "react";
import { theaters } from "@/data/theaters";
import { activeCountsByYear, type YearCounts } from "@/lib/theater-stats";
import { TV_OWNERSHIP_BY_YEAR } from "@/lib/historical-context";
import { MIN_YEAR, MAX_YEAR } from "@/lib/timeline";
import styles from "./PeakChart.module.css";

const VIEW_W = 620;
const VIEW_H = 520;
const MARGIN = { top: 16, right: 16, bottom: 34, left: 44 };
const PLOT_W = VIEW_W - MARGIN.left - MARGIN.right;
const PLOT_H = VIEW_H - MARGIN.top - MARGIN.bottom;

function xForYear(year: number): number {
  return MARGIN.left + ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * PLOT_W;
}

function buildAreaPath(series: YearCounts[], top: (d: YearCounts) => number, bottom: (d: YearCounts) => number): string {
  if (series.length === 0) return "";
  const topPoints = series.map((d) => `${xForYear(d.year)},${top(d)}`);
  const bottomPoints = series
    .slice()
    .reverse()
    .map((d) => `${xForYear(d.year)},${bottom(d)}`);
  return `M${topPoints.join(" L")} L${bottomPoints.join(" L")} Z`;
}

function interpolateTvPercent(year: number): number {
  const points = TV_OWNERSHIP_BY_YEAR;
  if (year <= points[0].year) return points[0].percentOfHomes;
  if (year >= points[points.length - 1].year) return points[points.length - 1].percentOfHomes;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (year >= a.year && year <= b.year) {
      const t = (year - a.year) / (b.year - a.year);
      return a.percentOfHomes + t * (b.percentOfHomes - a.percentOfHomes);
    }
  }
  return 0;
}

export function PeakChart({ revealYear, showTv = false }: { revealYear: number; showTv?: boolean }) {
  const clipId = useId();
  const series = useMemo(() => activeCountsByYear(theaters), []);
  const maxTotal = useMemo(() => Math.max(...series.map((d) => d.confirmed + d.uncertain)), [series]);

  const yScale = useMemo(() => (value: number) => MARGIN.top + PLOT_H - (value / maxTotal) * PLOT_H, [maxTotal]);

  const confirmedPath = useMemo(
    () => buildAreaPath(series, (d) => yScale(d.confirmed), () => yScale(0)),
    [series, yScale]
  );
  const uncertainPath = useMemo(
    () => buildAreaPath(series, (d) => yScale(d.confirmed + d.uncertain), (d) => yScale(d.confirmed)),
    [series, yScale]
  );

  // TV ownership scaled against the same theater-count axis so both lines
  // share one plot: percent-of-homes mapped onto the theater-count max.
  const tvPath = useMemo(() => {
    const tvYears: YearCounts[] = [];
    for (let year = MIN_YEAR; year <= MAX_YEAR; year += 2) {
      const pct = interpolateTvPercent(year);
      tvYears.push({ year, confirmed: (pct / 100) * maxTotal, uncertain: 0 });
    }
    return buildAreaPath(tvYears, (d) => yScale(d.confirmed), () => yScale(0));
  }, [maxTotal, yScale]);

  const yTicks = useMemo(() => {
    const step = maxTotal > 400 ? 100 : 50;
    const ticks: number[] = [];
    for (let v = 0; v <= maxTotal; v += step) ticks.push(v);
    return ticks;
  }, [maxTotal]);

  const xTicks = [1900, 1920, 1940, 1960, 1980, 2000, 2020];

  // The area is revealed left-to-right as the reader scrolls, rather than
  // shown all at once — a clip rect grows toward revealYear and CSS
  // transitions its width, so the reveal keeps animating smoothly forward
  // (or backward) whenever revealYear changes between renders.
  const revealWidth = Math.max(0, xForYear(revealYear) - MARGIN.left);

  return (
    <div className={styles.wrap}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className={styles.svg} role="img" aria-label="Operating theaters over time">
        <defs>
          <clipPath id={clipId}>
            <rect x={MARGIN.left} y={0} width={revealWidth} height={VIEW_H} className={styles.revealRect} />
          </clipPath>
        </defs>

        {yTicks.map((v) => (
          <g key={v}>
            <line x1={MARGIN.left} x2={VIEW_W - MARGIN.right} y1={yScale(v)} y2={yScale(v)} className={styles.gridLine} />
            <text x={MARGIN.left - 8} y={yScale(v)} className={styles.yLabel} textAnchor="end" dy="0.32em">
              {v}
            </text>
          </g>
        ))}

        <g clipPath={`url(#${clipId})`}>
          <path d={confirmedPath} className={styles.confirmedArea} />
          <path d={uncertainPath} className={styles.uncertainArea} />
          <path d={tvPath} className={styles.tvArea} style={{ opacity: showTv ? 1 : 0 }} />
        </g>

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
        <span className={styles.legendItem}>
          <span className={styles.swatch} style={{ background: "var(--accent)", opacity: 0.82 }} /> Theaters operating
        </span>
        <span className={styles.legendItem}>
          <span className={styles.swatch} style={{ background: "var(--accent)", opacity: 0.22 }} /> Closing year unknown
        </span>
        {showTv && (
          <span className={styles.legendItem}>
            <span className={styles.swatch} style={{ background: "var(--meta)", opacity: 0.55 }} /> Homes with a TV
            (scaled)
          </span>
        )}
      </div>
    </div>
  );
}
