"use client";

import { useMemo, useRef, useState } from "react";
import { theaters } from "@/data/theaters";
import type { Borough } from "@/types/theater";
import { activeCountsByYear, activeCountsByYearAndBorough, type YearCounts } from "@/lib/theater-stats";
import { MAX_YEAR, MIN_YEAR } from "@/lib/timeline";
import styles from "./OperatingTheatersChart.module.css";

const BOROUGHS: Borough[] = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];
const FILTERS = ["All boroughs", ...BOROUGHS] as const;
type Filter = (typeof FILTERS)[number];

const VIEW_W = 880;
const VIEW_H = 400;
const MARGIN = { top: 16, right: 16, bottom: 36, left: 40 };
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

export function OperatingTheatersChart() {
  const [filter, setFilter] = useState<Filter>("All boroughs");
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const byBorough = useMemo(() => activeCountsByYearAndBorough(theaters), []);
  const cityWide = useMemo(() => activeCountsByYear(theaters), []);

  const series = filter === "All boroughs" ? cityWide : byBorough[filter];

  const maxTotal = useMemo(() => Math.max(...series.map((d) => d.confirmed + d.uncertain)), [series]);
  const yScale = useMemo(
    () => (value: number) => MARGIN.top + PLOT_H - (value / maxTotal) * PLOT_H,
    [maxTotal]
  );

  const confirmedPath = useMemo(
    () => buildAreaPath(series, (d) => yScale(d.confirmed), () => yScale(0)),
    [series, yScale]
  );
  const uncertainPath = useMemo(
    () => buildAreaPath(series, (d) => yScale(d.confirmed + d.uncertain), (d) => yScale(d.confirmed)),
    [series, yScale]
  );

  const yTicks = useMemo(() => {
    const step = maxTotal > 400 ? 100 : maxTotal > 150 ? 50 : 20;
    const ticks: number[] = [];
    for (let v = 0; v <= maxTotal; v += step) ticks.push(v);
    return ticks;
  }, [maxTotal]);

  const xTicks = [1900, 1920, 1940, 1960, 1980, 2000, 2020];

  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * VIEW_W;
    const year = Math.round(MIN_YEAR + ((relX - MARGIN.left) / PLOT_W) * (MAX_YEAR - MIN_YEAR));
    setHoverYear(Math.min(MAX_YEAR, Math.max(MIN_YEAR, year)));
  };

  const hovered = hoverYear != null ? series.find((d) => d.year === hoverYear) : null;
  const hoverX = hoverYear != null ? xForYear(hoverYear) : null;

  return (
    <div className={styles.wrap}>
      <div className={styles.filters} role="tablist" aria-label="Filter by borough">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className={styles.svg}
        onPointerMove={handleMove}
        onPointerLeave={() => setHoverYear(null)}
        role="img"
        aria-label="Operating theaters in New York City by year"
      >
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={MARGIN.left}
              x2={VIEW_W - MARGIN.right}
              y1={yScale(v)}
              y2={yScale(v)}
              className={styles.gridLine}
            />
            <text x={MARGIN.left - 8} y={yScale(v)} className={styles.yLabel} textAnchor="end" dy="0.32em">
              {v}
            </text>
          </g>
        ))}

        <path d={confirmedPath} className={styles.confirmedArea} />
        <path d={uncertainPath} className={styles.uncertainArea} />

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

        {hoverX != null && (
          <line x1={hoverX} x2={hoverX} y1={MARGIN.top} y2={VIEW_H - MARGIN.bottom} className={styles.hoverLine} />
        )}
      </svg>

      {hovered && hoverX != null && (
        <div
          className={styles.tooltip}
          style={{ left: `${(hoverX / VIEW_W) * 100}%` }}
        >
          <p className={styles.tooltipYear}>{hovered.year}</p>
          <p className={styles.tooltipRow}>
            <span className={styles.swatchConfirmed} />
            {hovered.confirmed.toLocaleString()} confirmed operating
          </p>
          {hovered.uncertain > 0 && (
            <p className={styles.tooltipRow}>
              <span className={styles.swatchUncertain} />
              {hovered.uncertain.toLocaleString()} closed by an unrecorded date
            </p>
          )}
        </div>
      )}

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.swatchConfirmed} /> Confirmed operating that year
        </span>
        <span className={styles.legendItem}>
          <span className={styles.swatchUncertain} /> Since confirmed closed, but the year is unrecorded
        </span>
      </div>
    </div>
  );
}
