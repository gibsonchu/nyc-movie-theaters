"use client";

import { useEffect, useState } from "react";
import { MapCanvas } from "@/components/map/MapCanvas";
import { TheaterDetailPanel } from "@/components/detail/TheaterDetailPanel";
import { Timeline } from "@/components/timeline/Timeline";
import { LazyMount } from "@/components/story/LazyMount";
import section from "@/components/story/section.module.css";
import styles from "./ExploreSection.module.css";

export function ExploreSection() {
  const [expanded, setExpanded] = useState(false);

  // Lock page scroll and allow Escape to back out while the map fills the viewport.
  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [expanded]);

  return (
    <section className={styles.wrap} id="explore-the-map">
      <div className={section.inner}>
        <p className={section.articleText}>
          AMC Kips Bay is announced to be closing at the end of this year 2026, with the property purchased by NYU
          Langone in 2025. Originally designed by David Rockwell, a Loews architect, this 15-screen, 3,000 seat
          megaplex opened up back on May 14, 1999 as the Loews Kips Bay Theatre, before AMC took over, also adding
          indie films to its lineup.
        </p>
        <p className={section.articleText}>
          It will have run for over 27 years as one of the most popular movie venues to catch a flick in Manhattan.
          The last movie I personally caught there was half of the animated film, <em>Flow</em>, before being kicked
          out due to an electrical issue.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/AMC-kips-bay.jpg" alt="AMC Kips Bay 15" className={styles.photo} />
        <p className={styles.photoCaption}>Photo by Jim.henderson on Wikimedia</p>
        <p className={section.articleText}>RIP AMC Kips Bay.</p>
        <p className={section.articleText}>
          New York won&rsquo;t be adding hundreds more movie theaters anymore. But these spaces aren&rsquo;t just to
          watch movies, but also neighborhood institutions, gathering places, and pieces of the city&rsquo;s physical
          fabric.
        </p>
        <p className={section.articleText}>
          So before the credits roll on another one, maybe it&rsquo;s worth holding on to what we have left. See you
          at the movies.
        </p>
      </div>

      <LazyMount fallback={<div className={styles.mapPlaceholder} />} rootMargin="400px">
        <div className={`${styles.mapFrame} ${expanded ? styles.mapFrameExpanded : ""}`}>
          <MapCanvas />
          <TheaterDetailPanel />
          <Timeline isExpanded={expanded} onToggleExpanded={() => setExpanded((prev) => !prev)} />
        </div>
      </LazyMount>
    </section>
  );
}
