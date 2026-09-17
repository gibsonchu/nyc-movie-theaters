"use client";

import { useEffect, useState } from "react";
import { MapCanvas } from "@/components/map/MapCanvas";
import { CalloutLayer } from "@/components/callouts/CalloutLayer";
import { ZoningControl } from "@/components/controls/ZoningControl";
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
        <p className={section.kicker}>Now Explore It Yourself</p>
        <h2 className={section.heading}>Every Theater, on the Map</h2>
        <p className={section.lede}>
          Drag the timeline through 1896&ndash;2026 or press play to watch theaters open and close, filter by the
          zoning rules of the era, and click any dot for its full record. Only theaters confirmed to be movie
          theaters at the time are shown &mdash; live-performance venues that Cinema Treasures tracked for an
          earlier era of film exhibition are excluded from &ldquo;open today.&rdquo;
        </p>
      </div>

      <LazyMount fallback={<div className={styles.mapPlaceholder} />} rootMargin="400px">
        <div className={`${styles.mapFrame} ${expanded ? styles.mapFrameExpanded : ""}`}>
          <MapCanvas>
            <CalloutLayer />
          </MapCanvas>
          <ZoningControl />
          <Timeline isExpanded={expanded} onToggleExpanded={() => setExpanded((prev) => !prev)} />
        </div>
      </LazyMount>
    </section>
  );
}
