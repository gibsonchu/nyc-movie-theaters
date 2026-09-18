"use client";

import { useMemo } from "react";
import { theaters } from "@/data/theaters";
import { activeCountsByYear, openingsByDecade, peakDecade } from "@/lib/theater-stats";
import { US_MOVIE_INDUSTRY_PEAK_1946 } from "@/lib/historical-context";
import { useActiveStep } from "@/components/story/useActiveStep";
import { PeakChart } from "./PeakChart";
import section from "@/components/story/section.module.css";
import styles from "./StoryboardSection.module.css";

interface Step {
  text: React.ReactNode;
}

export function StoryboardSection() {
  const { peakTotal, openingPeakDecade } = useMemo(() => {
    const active = activeCountsByYear(theaters);
    const peak = active.reduce((max, y) => (y.confirmed + y.uncertain > max.confirmed + max.uncertain ? y : max));
    return {
      peakTotal: peak.confirmed + peak.uncertain,
      openingPeakDecade: peakDecade(openingsByDecade(theaters))?.decade,
    };
  }, []);

  const steps: Step[] = [
    {
      text: (
        <p>
          There have been approximately {theaters.length.toLocaleString()} movie theaters that have operated across
          NYC since the start of commercial cinema. New York built movie theaters at an extraordinary pace, with
          construction peaking in the {openingPeakDecade}s.
        </p>
      ),
    },
    {
      text: (
        <>
          <p>
            Near the peak of this time, around the 1940s, over {peakTotal.toLocaleString()} theaters were operating
            across the boroughs.
          </p>
          <p>
            Nationally, moviegoing reached its postwar peak in {US_MOVIE_INDUSTRY_PEAK_1946.year}. An estimated{" "}
            {US_MOVIE_INDUSTRY_PEAK_1946.weeklyAdmissionsMillions} million Americans went to the movies each week,
            <sup>1</sup> buying tickets that cost an average of just{" "}
            {US_MOVIE_INDUSTRY_PEAK_1946.averageTicketPriceCents}&cent; &mdash; about $
            {US_MOVIE_INDUSTRY_PEAK_1946.averageTicketPriceTodayUsd} today.<sup>2</sup> The industry took in nearly $
            {US_MOVIE_INDUSTRY_PEAK_1946.boxOfficeBillionsUsd} billion at the box office that year, equivalent to
            roughly ${US_MOVIE_INDUSTRY_PEAK_1946.boxOfficeTodayBillionsUsd} billion today.<sup>3</sup>
          </p>
          <p>
            It was a remarkable high point for American moviegoing: theaters were drawing tens of millions of people
            every week, and Hollywood was supplying them with hundreds of new films each year.
          </p>
          <ol className={styles.footnotes}>
            <li>
              Susan B. Carter et al., eds., <em>Historical Statistics of the United States: Millennial Edition</em>,
              Table Dh388&ndash;391, &ldquo;Motion Picture Attendance, Box Office Receipts, and Admission Prices:
              1922&ndash;1998&rdquo; (Cambridge University Press, 2006).
            </li>
            <li>
              &ldquo;Moviegoers Speak Up,&rdquo; <em>Los Angeles Times</em>, January 3, 2006, citing Motion Picture
              Association of America historical admissions data. Inflation adjustment based on the U.S. Consumer
              Price Index.
            </li>
            <li>
              Carter et al., <em>Historical Statistics of the United States</em>, Table Dh388&ndash;391. Inflation
              adjustment based on the U.S. Consumer Price Index.
            </li>
          </ol>
        </>
      ),
    },
    {
      text: (
        <p>
          New York started losing more and more theaters over time &mdash; single-screen neighborhood houses
          typically closing first, then the ornate movie palaces, until finally most of the theaters able to survive
          were the larger multiplexes.
        </p>
      ),
    },
  ];

  const { active, setRef } = useActiveStep(steps.length);

  return (
    <section className={section.section} id="the-peak-and-the-decline" style={{ paddingBottom: 40 }}>
      <div className={styles.grid}>
        <div className={styles.visualCol}>
          <div className={styles.visualSticky}>
            <PeakChart />
          </div>
        </div>

        <div className={styles.textCol}>
          {steps.map((step, i) => (
            <div key={i} ref={setRef(i)} className={styles.step}>
              <div className={`${styles.stepText} ${i === active ? styles.stepTextActive : ""}`}>{step.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
