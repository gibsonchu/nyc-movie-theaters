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
    <section className={section.section} id="survives-today" style={{ paddingTop: 16, paddingBottom: 24 }}>
      <div className={section.inner}>
        <p className={section.lede}>
          Out of the theaters that continue to exist today, over {survives.toLocaleString()} venues of them
          don&rsquo;t actively show films anymore, with {showingMovies.toLocaleString()} of them actively showing
          movies.
        </p>
      </div>
      <div className={section.wide}>
        <TheaterGallery items={SURVIVING_THEATERS_GALLERY} />
      </div>
    </section>
  );
}
