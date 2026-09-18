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
          Major shoutout to{" "}
          <a href="https://cinematreasures.org/" target="_blank" rel="noreferrer">
            Cinema Treasures
          </a>{" "}
          for providing me with most of the data in this article. Feel free to check out what&rsquo;s playing at
          each theater by exploring the map or checking out on{" "}
          <a href="https://screenslate.com/" target="_blank" rel="noreferrer">
            Screen Slate
          </a>
          .
        </p>
        <p className={section.articleText} style={{ fontStyle: "italic" }}>
          If you&rsquo;d like to keep up with other stories about city planning and spaces, subscribe to{" "}
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
