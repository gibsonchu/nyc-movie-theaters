"use client";

import { useMemo } from "react";
import { theaters } from "@/data/theaters";
import { boroughCounts, currentTheaters } from "@/lib/theater-stats";
import type { Borough } from "@/types/theater";
import { ComparisonMap } from "./ComparisonMap";
import { LazyMount } from "@/components/story/LazyMount";
import section from "@/components/story/section.module.css";
import styles from "./TodaySection.module.css";

const BOROUGHS: Borough[] = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"];

export function TodaySection() {
  const { totalByBorough, currentByBorough, totalCurrent } = useMemo(() => {
    const current = currentTheaters(theaters);
    return {
      totalByBorough: boroughCounts(theaters),
      currentByBorough: boroughCounts(current),
      totalCurrent: current.length,
    };
  }, []);

  return (
    <section className={section.section} id="what-remains-today">
      <div className={section.inner}>
        <p className={section.kicker}>Part Four</p>
        <h2 className={section.heading}>What Remains Today</h2>
        <p className={section.lede}>
          Every faint dot below is a theater this dataset has a record of, anywhere in the city, at any point since
          1896. The {totalCurrent.toLocaleString()} bold dots are what&rsquo;s left: theaters confirmed still
          showing movies today. The historical network was citywide and dense; what remains is thinner, and
          unevenly so.
        </p>
      </div>

      <div className={section.wide}>
        <LazyMount fallback={<div className={styles.mapPlaceholder} />}>
          <ComparisonMap />
        </LazyMount>

        <table className={styles.boroughTable}>
          <thead>
            <tr>
              <th>Borough</th>
              <th>Ever recorded</th>
              <th>Open today</th>
              <th>Share remaining</th>
            </tr>
          </thead>
          <tbody>
            {BOROUGHS.map((b) => {
              const total = totalByBorough[b];
              const current = currentByBorough[b];
              return (
                <tr key={b}>
                  <td>{b}</td>
                  <td>{total.toLocaleString()}</td>
                  <td>{current.toLocaleString()}</td>
                  <td>{total > 0 ? `${Math.round((current / total) * 100)}%` : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.returnPrompt}>
        <p className={section.prose} style={{ margin: "0 auto", textAlign: "center" }}>
          That&rsquo;s the shape of the decline. Keep scrolling for the full interactive map — every theater, any
          year, on your own terms.
        </p>
      </div>
    </section>
  );
}
