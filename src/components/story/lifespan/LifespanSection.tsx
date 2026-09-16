"use client";

import { useMemo } from "react";
import { theaters } from "@/data/theaters";
import { getLifespan, longestRunning, shortestLived } from "@/lib/theater-stats";
import { LifespanChart } from "./LifespanChart";
import section from "@/components/story/section.module.css";

export function LifespanSection() {
  const { oldest, briefest } = useMemo(
    () => ({
      oldest: longestRunning(theaters, 1)[0],
      briefest: shortestLived(theaters, 1)[0],
    }),
    []
  );

  const oldestLifespan = oldest ? getLifespan(oldest) : null;
  const briefestLifespan = briefest ? getLifespan(briefest) : null;

  return (
    <section className={section.section} id="every-theater-had-a-lifespan">
      <div className={section.inner}>
        <p className={section.kicker}>Part Three</p>
        <h2 className={section.heading}>Every Theater Had a Lifespan</h2>
        <p className={section.lede}>
          Behind every dot on the map is a stretch of years — a year it opened its doors, and, for most, a year it
          shut them. {oldest && oldestLifespan?.years != null && (
            <>
              {oldest.name} in {oldest.borough} has run the longest of any theater in this dataset: {oldestLifespan.years}{" "}
              years and counting, since {oldest.openingYear}.
            </>
          )}{" "}
          {briefest && briefestLifespan?.years != null && briefestLifespan.years <= 1 && (
            <>
              {briefest.name} lasted less than a year, opening and closing in {briefest.openingYear}.
            </>
          )}
        </p>
      </div>

      <div className={section.wide}>
        <LifespanChart />
        <p className={section.caption}>
          Click any row for that theater&rsquo;s full record. Lifespans are measured in whole years from the source
          data — a theater that opened and closed within the same calendar year shows as a very short bar, not
          necessarily zero months.
        </p>
      </div>
    </section>
  );
}
