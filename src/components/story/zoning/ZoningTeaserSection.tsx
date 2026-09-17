import { LazyMount } from "@/components/story/LazyMount";
import { CurrentZoningMap } from "@/components/zoning/CurrentZoningMap";
import { TweetEmbed } from "./TweetEmbed";
import section from "@/components/story/section.module.css";
import mapStyles from "@/components/zoning/CurrentZoningMap.module.css";

export function ZoningTeaserSection() {
  return (
    <section className={section.section} id="where-could-nyc-build-today">
      <div className={section.inner}>
        <p className={section.lede}>Where could NYC build a movie theater today?</p>
        <p className={section.prose}>
          NYC&rsquo;s Department of City Planning tweeted out their{" "}
          <a href="https://x.com/NYCPlanning/status/2092250711899689214" target="_blank" rel="noreferrer">
            ZoLa map
          </a>{" "}
          given the news of AMC Kips Bay closing.
        </p>
      </div>

      <LazyMount fallback={null} rootMargin="400px">
        <TweetEmbed />
      </LazyMount>

      <div className={section.inner}>
        <p className={section.prose}>
          To make it a little easier, I plotted the existing locations of all the theaters on this map, labeled by
          whether a movie theater would be allowed to be there today, to show how zoning regulation has changed over
          time as well as where a new theater could be placed today.
        </p>
      </div>

      <div className={section.wide}>
        <LazyMount fallback={<div className={mapStyles.placeholder} />} rootMargin="400px">
          <CurrentZoningMap />
        </LazyMount>
        <p className={section.caption}>
          Zoning districts are colored based on whether an ordinary movie theater could be there today. Feel free to
          read the{" "}
          <a href="https://zoningresolution.planning.nyc.gov/" target="_blank" rel="noreferrer">
            Zoning Resolution
          </a>{" "}
          for more details on &sect; ZR 32-181, 32-183, 42-181.
        </p>
      </div>

      <div className={section.inner}>
        <p className={section.prose}>
          There&rsquo;s a lot of free real estate for more out in Brooklyn, Queens and the Bronx.
        </p>
      </div>
    </section>
  );
}
