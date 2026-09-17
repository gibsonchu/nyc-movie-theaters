"use client";

import { useEffect, useMemo, useRef } from "react";
import { theaters } from "@/data/theaters";
import {
  activeCountsByYear,
  activityInYear,
  majorityBorough,
  openingsByDecade,
  peakDecade,
} from "@/lib/theater-stats";
import { US_MOVIE_INDUSTRY_PEAK_1946, TV_OWNERSHIP_BY_YEAR } from "@/lib/historical-context";
import { MAX_YEAR } from "@/lib/timeline";
import { useActiveStep } from "@/components/story/useActiveStep";
import { PeakChart } from "./PeakChart";
import { PosterGallery } from "./PosterGallery";
import { QuoteGrid } from "./QuoteGrid";
import section from "@/components/story/section.module.css";
import styles from "./StoryboardSection.module.css";

type Visual = "chart" | "posters" | "quotes";

interface Step {
  visual: Visual;
  /** How far along the timeline the area chart should be revealed while this step is active. */
  revealYear: number;
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
      revealYear: 1896,
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
      revealYear: peakYear,
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
      revealYear: peakYear,
      caption: `Playing across New York, ${peakYear}`,
      text: <>A handful of what was on the marquee that year &mdash; placeholders, to be swapped in.</>,
    },
    {
      visual: "quotes",
      revealYear: peakYear,
      caption: "What it felt like",
      text: <>Placeholder quotes &mdash; to be replaced with real recollections.</>,
    },
    {
      visual: "chart",
      revealYear: 1950,
      text: (
        <>
          But as everyone knows, the advent of television was just around the corner. By the early 1950s, over{" "}
          {tvPeak1950}% of American homes had a television.
        </>
      ),
    },
    {
      visual: "chart",
      revealYear: 1955,
      showTv: true,
      text: <>Television arrived just as New York&rsquo;s enormous theater network began shutting down.</>,
    },
    {
      visual: "chart",
      revealYear: MAX_YEAR,
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
  const isMovieMoment = current.visual === "posters" || current.visual === "quotes";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isMovieMoment) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isMovieMoment]);

  return (
    <section className={section.section} id="the-peak-and-the-decline">
      <div className={styles.grid}>
        <div className={styles.visualCol}>
          <div className={styles.visualSticky}>
            {current.caption && (
              <p className={`${styles.stepCaption} ${styles.stepCaptionActive}`}>{current.caption}</p>
            )}

            <div className={styles.visualStack}>
              <div className={`${styles.bgVideoWrap} ${isMovieMoment ? styles.bgVideoWrapVisible : ""}`}>
                <video
                  ref={videoRef}
                  className={styles.bgVideo}
                  src="/movies-1940s.mov"
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                />
                <div className={styles.bgVideoScrim} />
              </div>

              {/* The chart stays mounted the whole time (never unmounted) so its reveal
                  animation keeps its place and continues forward when it fades back in. */}
              <div className={`${styles.visualLayer} ${current.visual === "chart" ? styles.visualLayerVisible : ""}`}>
                <PeakChart revealYear={current.revealYear} showTv={current.showTv} />
              </div>
              <div className={`${styles.visualLayer} ${current.visual === "posters" ? styles.visualLayerVisible : ""}`}>
                <PosterGallery />
              </div>
              <div className={`${styles.visualLayer} ${current.visual === "quotes" ? styles.visualLayerVisible : ""}`}>
                <QuoteGrid />
              </div>
            </div>
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
