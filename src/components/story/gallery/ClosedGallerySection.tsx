import { TheaterGallery } from "./TheaterGallery";
import { CLOSED_THEATERS_GALLERY } from "./curatedGalleries";
import section from "@/components/story/section.module.css";

export function ClosedGallerySection() {
  return (
    <section className={section.section} id="theaters-lost">
      <div className={section.wide}>
        <TheaterGallery items={CLOSED_THEATERS_GALLERY} />
      </div>
    </section>
  );
}
