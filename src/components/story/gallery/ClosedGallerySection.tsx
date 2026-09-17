import { TheaterGallery } from "./TheaterGallery";
import { CLOSED_THEATERS_GALLERY } from "./curatedGalleries";
import section from "@/components/story/section.module.css";

export function ClosedGallerySection() {
  return (
    <section className={section.section} id="theaters-lost" style={{ paddingTop: 40, paddingBottom: 32 }}>
      <div className={section.inner}>
        <p className={section.articleText}>Here are some of the most famous theaters that have closed over the years.</p>
      </div>
      <div className={section.wide} style={{ marginTop: 32 }}>
        <TheaterGallery items={CLOSED_THEATERS_GALLERY} />
      </div>
    </section>
  );
}
