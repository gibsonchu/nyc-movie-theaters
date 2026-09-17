import { ImagePlaceholder } from "@/components/story/ImagePlaceholder";
import section from "@/components/story/section.module.css";

export function ZoningTeaserSection() {
  return (
    <section className={section.section} id="where-could-nyc-build-today">
      <div className={section.inner}>
        <p className={section.lede}>Where could NYC build a movie theater today? Based off of Zola, &hellip;</p>
      </div>
      <div className={section.wide}>
        <ImagePlaceholder label="Zoning map — pending current ZoLa data" aspectRatio="16 / 10" />
      </div>
      <div className={section.inner}>
        <p className={section.prose}>Kips Bay will become another dot on this map.</p>
      </div>
    </section>
  );
}
