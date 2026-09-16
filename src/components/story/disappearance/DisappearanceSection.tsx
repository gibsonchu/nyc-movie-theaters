"use client";

import { useMemo } from "react";
import { theaters } from "@/data/theaters";
import { activeCountsByYear, currentTheaters, peakDecade, openingsByDecade } from "@/lib/theater-stats";
import { OperatingTheatersChart } from "@/components/story/charts/OperatingTheatersChart";
import { OpeningsClosuresChart } from "@/components/story/charts/OpeningsClosuresChart";
import section from "@/components/story/section.module.css";

export function DisappearanceSection() {
  const { peakYear, peakTotal, todayTotal, declinePct, peakOpeningDecade, formerCount } = useMemo(() => {
    const active = activeCountsByYear(theaters);
    const peak = active.reduce((max, y) => (y.confirmed + y.uncertain > max.confirmed + max.uncertain ? y : max));
    const peakSum = peak.confirmed + peak.uncertain;
    // "Operating today" means status === "open" — not merely "active at some
    // point during 2026," which would also catch theaters confirmed closed
    // with a recorded closing year of 2026 itself.
    const todaySum = currentTheaters(theaters).length;
    return {
      peakYear: peak.year,
      peakTotal: peakSum,
      todayTotal: todaySum,
      declinePct: Math.round((1 - todaySum / peakSum) * 100),
      peakOpeningDecade: peakDecade(openingsByDecade(theaters)),
      formerCount: theaters.length - todaySum,
    };
  }, []);

  return (
    <section className={section.section} id="the-great-disappearance">
      <div className={section.inner}>
        <p className={section.kicker}>Part One</p>
        <h2 className={section.heading}>The Great Disappearance</h2>
        <p className={section.lede}>
          This dataset tracks {theaters.length.toLocaleString()} movie theaters that have operated somewhere in New
          York City since 1896. Only {currentTheaters(theaters).length.toLocaleString()} are still open.{" "}
          {formerCount.toLocaleString()} have closed. Theater construction peaked in the {peakOpeningDecade?.decade}s,
          and the citywide network of theaters was at its largest around {peakYear} — after which closures started
          outpacing openings, and never really stopped.
        </p>

        <div className={section.statRow}>
          <div className={section.stat}>
            <span className={section.statValue}>{peakTotal.toLocaleString()}</span>
            <span className={section.statLabel}>Theaters operating at the peak, around {peakYear}</span>
          </div>
          <div className={section.stat}>
            <span className={section.statValue}>{todayTotal.toLocaleString()}</span>
            <span className={section.statLabel}>Confirmed operating today</span>
          </div>
          <div className={section.stat}>
            <span className={section.statValue}>{declinePct}%</span>
            <span className={section.statLabel}>Decline from peak to today</span>
          </div>
        </div>
      </div>

      <div className={section.wide}>
        <h3 className={section.subheading}>Operating theaters, by year</h3>
        <OperatingTheatersChart />
        <p className={section.caption}>
          A theater counts as &ldquo;confirmed operating&rdquo; in a given year if it had opened by then and either
          is still open, or has a recorded closing year that hadn&rsquo;t arrived yet. About a quarter of all
          confirmed closures in this dataset have no recorded closing year — a geocoding and address audit confirmed
          they&rsquo;re gone, but not when. Rather than guess, they&rsquo;re shown as a lighter band on top: it
          remains possible they were operating in a given year, just not confirmed.
        </p>
      </div>

      <div className={section.wide} style={{ marginTop: 64 }}>
        <h3 className={section.subheading}>Openings vs. closures, by decade</h3>
        <OpeningsClosuresChart />
      </div>
    </section>
  );
}
