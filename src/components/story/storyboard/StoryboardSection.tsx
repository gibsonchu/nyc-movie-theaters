"use client";

import { useMemo } from "react";
import { theaters } from "@/data/theaters";
import {
  activeCountsByYear,
  activityInYear,
  majorityBorough,
  openingsByDecade,
  peakDecade,
} from "@/lib/theater-stats";
import { US_MOVIE_INDUSTRY_PEAK_1946, TV_OWNERSHIP_BY_YEAR } from "@/lib/historical-context";
import { useActiveStep } from "@/components/story/useActiveStep";
import { PeakChart } from "./PeakChart";
import { PosterGallery } from "./PosterGallery";
import { QuoteGrid } from "./QuoteGrid";
import section from "@/components/story/section.module.css";
import styles from "./StoryboardSection.module.css";

type Visual = "chart" | "posters" | "quotes";

interface Step {
  visual: Visual;
  dotYear: number;
  showTv?: boolean;
  caption?: string;
  text: React.ReactNode;
}

export function StoryboardSection() {
  const { peakYear, peakTotal, peakBorough, openingPeakDecade } = useMemo(() => {
    const active = activeCountsByYear(theaters);
    const peak = active.reduce((max, y) => (y.confirmed + y.uncertain > max.confirmed + max.uncertain ? y : max));
    const atPeak = theaters.filter((t) => activityInYear(t, peak.year) !== "inactive");
    return {
      peakYear: peak.year,
      peakTotal: peak.confirmed + peak.uncertain,
      peakBorough: majorityBorough(atPeak),
      openingPeakDecade: peakDecade(openingsByDecade(theaters))?.decade,
    };
  }, []);

  const tvPeak1950 = TV_OWNERSHIP_BY_YEAR.find((d) => d.year === 1950)?.percentOfHomes ?? 9;

  const steps: Step[] = [
    {
      visual: "chart",
      dotYear: 1896,
      text: (
        <>
          There have been approximately {theaters.length.toLocaleString()} movie theaters that have operated across
          NYC since the start of commercial cinema. New York built movie theaters at an extraordinary pace, with
          construction peaking in the {openingPeakDecade}s.
        </>
      ),
    },
    {
      visual: "chart",
      dotYear: peakYear,
      text: (
        <>
          Over {peakTotal.toLocaleString()} theaters were operating across the boroughs, with a majority of them in{" "}
          {peakBorough}. Nationally, movie-going itself peaked a few years later, in {US_MOVIE_INDUSTRY_PEAK_1946.year}
          : roughly {US_MOVIE_INDUSTRY_PEAK_1946.weeklyAdmissionsMillions} million tickets were sold every week, at
          an average price of {US_MOVIE_INDUSTRY_PEAK_1946.averageTicketPriceCents}&cent; &mdash; about $
          {US_MOVIE_INDUSTRY_PEAK_1946.averageTicketPriceTodayUsd.toFixed(2)} in today&rsquo;s dollars. The industry
          earned ${US_MOVIE_INDUSTRY_PEAK_1946.boxOfficeBillionsUsd} billion at the box office that year, or roughly $
          {US_MOVIE_INDUSTRY_PEAK_1946.boxOfficeTodayBillionsUsd} billion today, with Hollywood releasing more than{" "}
          {US_MOVIE_INDUSTRY_PEAK_1946.moviesReleasedPerYear} movies a year to fill all those screens.
        </>
      ),
    },
    {
      visual: "posters",
      dotYear: peakYear,
      caption: `Playing across New York, ${peakYear}`,
      text: <>A handful of what was on the marquee that year &mdash; placeholders, to be swapped in.</>,
    },
    {
      visual: "quotes",
      dotYear: peakYear,
      caption: "What it felt like",
      text: <>Placeholder quotes &mdash; to be replaced with real recollections.</>,
    },
    {
      visual: "chart",
      dotYear: 1950,
      text: (
        <>
          But as everyone knows, the advent of television was just around the corner. By the early 1950s, over{" "}
          {tvPeak1950}% of American homes had a television.
        </>
      ),
    },
    {
      visual: "chart",
      dotYear: 1955,
      showTv: true,
      text: <>Television arrived just as New York&rsquo;s enormous theater network began shutting down.</>,
    },
    {
      visual: "chart",
      dotYear: 1990,
      showTv: true,
      text: (
        <>
          New York started losing more and more theaters over time &mdash; single-screen neighborhood houses
          typically closing first, then the ornate movie palaces, until finally most of the theaters able to survive
          were the larger multiplexes.
        </>
      ),
    },
  ];

  const { active, setRef } = useActiveStep(steps.length);
  const current = steps[active];

  return (
    <section className={`${styles.section} ${section.section}`} id="the-peak-and-the-decline">
      <div className={styles.grid}>
        <div className={styles.visualCol}>
          <div className={styles.visualSticky}>
            {current.caption && (
              <p className={`${styles.stepCaption} ${styles.stepCaptionActive}`}>{current.caption}</p>
            )}
            {current.visual === "chart" && <PeakChart dotYear={current.dotYear} showTv={current.showTv} />}
            {current.visual === "posters" && <PosterGallery />}
            {current.visual === "quotes" && <QuoteGrid />}
          </div>
        </div>

        <div className={styles.textCol}>
          {steps.map((step, i) => (
            <div key={i} ref={setRef(i)} className={styles.step}>
              <p className={`${styles.stepText} ${i === active ? styles.stepTextActive : ""}`}>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
