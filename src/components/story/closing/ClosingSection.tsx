import { PhotoCarousel } from "./PhotoCarousel";
import section from "@/components/story/section.module.css";

export function ClosingSection() {
  return (
    <section className={section.section} id="closing">
      <div className={section.inner}>
        <p className={section.prose}>
          New York probably isn&rsquo;t going back to a city of 600 movie theaters. But the places where we watch
          movies aren&rsquo;t just screens and seats. They&rsquo;re neighborhood institutions, gathering places and
          pieces of the city&rsquo;s physical fabric.
        </p>
        <p className={section.prose}>
          So before the credits roll on another one, maybe it&rsquo;s worth holding on to what we have left.
        </p>
      </div>

      <div className={section.wide} style={{ marginTop: 40 }}>
        <PhotoCarousel />
      </div>
    </section>
  );
}
