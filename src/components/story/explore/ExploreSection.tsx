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
          New York won&rsquo;t be adding hundreds more movie theaters anymore. But these spaces aren&rsquo;t just to
          watch movies, but also neighborhood institutions, gathering places, and pieces of the city&rsquo;s physical
          fabric.
        </p>
        <p className={section.articleText}>
          Feel free to check out what&rsquo;s playing by exploring the map or checking on{" "}
          <a href="https://screenslate.com/" target="_blank" rel="noreferrer">
            Screen Slate
          </a>
          .
        </p>
        <p className={section.articleText}>
          So before the credits roll on another one, maybe it&rsquo;s worth holding on to what we have left. See you
          at the movies.
        </p>
        <p className={section.articleText} style={{ fontStyle: "italic" }}>
          I want to give a major shoutout to{" "}
          <a href="https://cinematreasures.org/" target="_blank" rel="noreferrer">
            Cinema Treasures
          </a>{" "}
          for providing me with most of the data in this article. If you&rsquo;d like to keep up with other stories
          like or notice any issues, feel free to subscribe to{" "}
          <a href="https://inspacesstudio.com/" target="_blank" rel="noreferrer">
            In Spaces
          </a>{" "}
          or reach out to me{" "}
          <a href="https://gibsonchu.com/" target="_blank" rel="noreferrer">
            @gibsontchu
          </a>
          .
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
