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
          Zoning districts are colored based on whether an ordinary movie theater could be there today. Feel free to
          read the{" "}
          <a href="https://zoningresolution.planning.nyc.gov/" target="_blank" rel="noreferrer">
            Zoning Resolution
          </a>{" "}
          for more details on &sect; ZR 32-181, 32-183, 42-181.
        </p>
      </div>
    </section>
  );
}
