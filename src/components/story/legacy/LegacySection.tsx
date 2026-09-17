"use client";

import { useMemo } from "react";
import { theaters } from "@/data/theaters";
import { currentTheaters, getLifespan, medianLifespan } from "@/lib/theater-stats";
import { LifespanHistogram } from "./LifespanHistogram";
import { RepurposedChart } from "./RepurposedChart";
import section from "@/components/story/section.module.css";

export function LegacySection() {
  const { median, oldestOpen } = useMemo(() => {
    const open = currentTheaters(theaters);
    const oldest = [...open].sort((a, b) => a.openingYear - b.openingYear)[0];
    return { median: medianLifespan(theaters), oldestOpen: oldest };
  }, []);

  const oldestYears = oldestOpen ? getLifespan(oldestOpen).years : null;

  return (
    <>
      <section className={section.section} id="how-long-they-lasted">
        <div className={section.inner}>
          <p className={section.lede}>
            Most movie theaters in this dataset lasted {median} years, with the oldest surviving theater,{" "}
            {oldestOpen?.name}, at over {oldestYears} years old.
          </p>
        </div>
        <div className={section.wide}>
          <LifespanHistogram />
          <p className={section.caption}>
            Distribution of theater lifespans in years. Excludes theaters confirmed closed with no recorded closing
            year, and a handful with a same-year open/close (measured in whole years from the source data, so a
            theater that opened and closed within one calendar year shows near zero rather than a true zero).
          </p>
        </div>
      </section>

      <section className={section.section} id="what-replaced-them">
        <div className={section.inner}>
          <p className={section.lede}>
            For those that closed, a number of them were turned into other useful places for the city.
          </p>
        </div>
        <div className={section.wide}>
          <RepurposedChart />
        </div>
      </section>
    </>
  );
}
