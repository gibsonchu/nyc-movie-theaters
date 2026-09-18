import { PhotoCarousel } from "./PhotoCarousel";
import section from "@/components/story/section.module.css";

export function ClosingSection() {
  return (
    <section className={section.section} id="closing">
      <div className={section.wide}>
        <PhotoCarousel />
      </div>
      <div className={section.inner} style={{ marginTop: 32 }}>
        <p className={section.articleText} style={{ fontStyle: "italic" }}>
          I want to give a major shoutout to{" "}
          <a href="https://cinematreasures.org/" target="_blank" rel="noreferrer">
            Cinema Treasures
          </a>{" "}
          for providing me with most of the data in this article. If you&rsquo;d like to keep up with other stories
          like or notice any issues, feel free to subscribe to{" "}
          <a href="https://inspacesstudio.com/" target="_blank" rel="noreferrer">
            In Spaces
          </a>{" "}
          or reach out to me{" "}
          <a href="https://gibsonchu.com/" target="_blank" rel="noreferrer">
            @gibsontchu
          </a>
          .
        </p>
      </div>
    </section>
  );
}
