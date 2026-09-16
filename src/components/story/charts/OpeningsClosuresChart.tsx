"use client";

import { useMemo, useState } from "react";
import { theaters } from "@/data/theaters";
import { openingsByDecade, closuresByDecade, undatedClosureCount } from "@/lib/theater-stats";
import styles from "./OpeningsClosuresChart.module.css";

const VIEW_W = 880;
const VIEW_H = 340;
const MARGIN = { top: 16, right: 16, bottom: 34, left: 40 };
const PLOT_W = VIEW_W - MARGIN.left - MARGIN.right;
const PLOT_H = VIEW_H - MARGIN.top - MARGIN.bottom;

export function OpeningsClosuresChart() {
  const [hoverDecade, setHoverDecade] = useState<number | null>(null);

  const { decades, openings, closures, undated } = useMemo(() => {
    const openMap = new Map(openingsByDecade(theaters).map((d) => [d.decade, d.count]));
    const closeMap = new Map(closuresByDecade(theaters).map((d) => [d.decade, d.count]));
    const allDecades = [...new Set([...openMap.keys(), ...closeMap.keys()])]
      .filter((d) => d >= 1890)
      .sort((a, b) => a - b);
    return {
      decades: allDecades,
      openings: allDecades.map((d) => openMap.get(d) ?? 0),
      closures: allDecades.map((d) => closeMap.get(d) ?? 0),
      undated: undatedClosureCount(theaters),
    };
  }, []);

  const maxCount = Math.max(...openings, ...closures);
  const yScale = (v: number) => MARGIN.top + PLOT_H - (v / maxCount) * PLOT_H;

  const groupWidth = PLOT_W / decades.length;
  const barWidth = Math.min(22, groupWidth * 0.32);

  const yTicks = useMemo(() => {
    const step = maxCount > 200 ? 50 : 20;
    const ticks: number[] = [];
    for (let v = 0; v <= maxCount; v += step) ticks.push(v);
    return ticks;
  }, [maxCount]);

  const hoverIndex = hoverDecade != null ? decades.indexOf(hoverDecade) : -1;

  return (
    <div className={styles.wrap}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className={styles.svg}
        role="img"
        aria-label="Theater openings versus closures by decade"
      >
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={MARGIN.left} x2={VIEW_W - MARGIN.right} y1={yScale(v)} y2={yScale(v)} className={styles.gridLine} />
            <text x={MARGIN.left - 8} y={yScale(v)} className={styles.yLabel} textAnchor="end" dy="0.32em">
              {v}
            </text>
          </g>
        ))}

        {decades.map((decade, i) => {
          const groupX = MARGIN.left + i * groupWidth;
          const center = groupX + groupWidth / 2;
          const isHover = hoverDecade === decade;
          return (
            <g
              key={decade}
              onPointerEnter={() => setHoverDecade(decade)}
              onPointerLeave={() => setHoverDecade((d) => (d === decade ? null : d))}
            >
              <rect x={groupX} y={MARGIN.top} width={groupWidth} height={PLOT_H} fill="transparent" />
              <rect
                x={center - barWidth - 2}
                y={yScale(openings[i])}
                width={barWidth}
                height={yScale(0) - yScale(openings[i])}
                className={isHover ? styles.openBarHover : styles.openBar}
              />
              <rect
                x={center + 2}
                y={yScale(closures[i])}
                width={barWidth}
                height={yScale(0) - yScale(closures[i])}
                className={isHover ? styles.closeBarHover : styles.closeBar}
              />
              <text x={center} y={VIEW_H - MARGIN.bottom + 18} className={styles.xLabel} textAnchor="middle">
                {String(decade).slice(2)}s
              </text>
            </g>
          );
        })}

        <line x1={MARGIN.left} x2={VIEW_W - MARGIN.right} y1={yScale(0)} y2={yScale(0)} className={styles.axisLine} />
      </svg>

      {hoverIndex >= 0 && (
        <div className={styles.tooltip} style={{ left: `${((hoverIndex + 0.5) / decades.length) * 100}%` }}>
          <p className={styles.tooltipDecade}>{decades[hoverIndex]}s</p>
          <p className={styles.tooltipRow}>
            <span className={styles.swatchOpen} /> {openings[hoverIndex]} opened
          </p>
          <p className={styles.tooltipRow}>
            <span className={styles.swatchClose} /> {closures[hoverIndex]} closed (dated)
          </p>
        </div>
      )}

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.swatchOpen} /> Opened
        </span>
        <span className={styles.legendItem}>
          <span className={styles.swatchClose} /> Closed, with a recorded year
        </span>
      </div>
      <p className={styles.caption}>
        {undated.toLocaleString()} additional confirmed closures aren&rsquo;t shown here because their closing year
        was never recorded — see the note above.
      </p>
    </div>
  );
}
