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
        <p className={section.prose}>
          New York probably isn&rsquo;t going back to a city of 600 movie theaters. But the places where we watch
          movies aren&rsquo;t just screens and seats. They&rsquo;re neighborhood institutions, gathering places and
          pieces of the city&rsquo;s physical fabric.
        </p>
        <p className={section.prose}>
          So before the credits roll on another one, maybe it&rsquo;s worth holding on to what we have left.
        </p>
        <p className={section.prose}>Explore more of the theaters over time on this map here.</p>
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
