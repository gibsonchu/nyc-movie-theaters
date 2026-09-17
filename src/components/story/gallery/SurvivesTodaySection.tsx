"use client";

import { useMemo } from "react";
import { theaters } from "@/data/theaters";
import { currentTheaters, survivingVenues } from "@/lib/theater-stats";
import { TheaterGallery } from "./TheaterGallery";
import { SURVIVING_THEATERS_GALLERY } from "./curatedGalleries";
import section from "@/components/story/section.module.css";

export function SurvivesTodaySection() {
  const { survives, showingMovies } = useMemo(
    () => ({
      survives: survivingVenues(theaters).length,
      showingMovies: currentTheaters(theaters).length,
    }),
    []
  );

  return (
    <section className={section.section} id="survives-today" style={{ paddingTop: 40 }}>
      <div className={section.inner}>
        <p className={section.lede}>
          A number of theaters continue to survive today, with {survives.toLocaleString()} venues that once showed
          films still standing, and {showingMovies.toLocaleString()} still actively showing movies. You can check
          out and see what&rsquo;s playing on each of their individual sites, or across{" "}
          <a
            href="https://screenslate.com/"
            target="_blank"
            rel="noreferrer"
            style={{ borderBottom: "1px solid var(--accent)" }}
          >
            Screen Slate
          </a>{" "}
          if you&rsquo;d rather go by movie.
        </p>
      </div>
      <div className={section.wide}>
        <TheaterGallery items={SURVIVING_THEATERS_GALLERY} />
      </div>
    </section>
  );
}
