import { LazyMount } from "@/components/story/LazyMount";
import { CurrentZoningMap } from "@/components/zoning/CurrentZoningMap";
import section from "@/components/story/section.module.css";
import mapStyles from "@/components/zoning/CurrentZoningMap.module.css";

export function ZoningTeaserSection() {
  return (
    <section className={section.section} id="where-could-nyc-build-today">
      <div className={section.inner}>
        <p className={section.lede}>Where could NYC build a movie theater today?</p>
      </div>
      <div className={section.wide}>
        <LazyMount fallback={<div className={mapStyles.placeholder} />} rootMargin="400px">
          <CurrentZoningMap />
        </LazyMount>
        <p className={section.caption}>
          Every zoning district in the city, screened against today&rsquo;s rules (ZR 32-181, 32-183, 42-181) and
          colored by whether an ordinary indoor theater could go there &mdash; plus every historical theater site
          from this piece, colored the same way. Click a dot for its full record. This is a planning screen, not a
          legal opinion.
        </p>
      </div>
      <div className={section.inner}>
        <p className={section.prose}>Kips Bay will become another dot on this map.</p>
      </div>
    </section>
  );
}
