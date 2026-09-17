import { PhotoCarousel } from "./PhotoCarousel";
import section from "@/components/story/section.module.css";

export function ClosingSection() {
  return (
    <section className={section.section} id="closing">
      <div className={section.wide}>
        <PhotoCarousel />
      </div>
    </section>
  );
}
