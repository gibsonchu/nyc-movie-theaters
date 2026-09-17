import styles from "./PersonalIntro.module.css";

export function PersonalIntro() {
  return (
    <div className={styles.wrap}>
      <blockquote className={styles.quote}>
        <p>
          Many of you who know me know that I love catching movies in the movie theaters. It is one of my favorite
          pastimes in NYC, with me even going so far as to be one of those crazy individuals waiting in line at AMC
          Lincoln Square for the <em>Dune 3</em> IMAX 70MM early ticket drop. Nowadays, I typically catch a film over
          at the Brooklyn Academy of Music, making use of my membership to catch some indie flicks.
        </p>
        <p>
          With the{" "}
          <a
            href="https://www.cbsnews.com/newyork/news/amc-kips-bay-15-movie-theater-closing-2026/"
            target="_blank"
            rel="noreferrer"
          >
            recent announcement of the closure of AMC Kips Bay
          </a>
          , I thought about how many movie theaters were there in the city? How many closed over the years?
        </p>
        <p>
          I started digging through the history of New York&rsquo;s theaters to understand where they came and
          went, and what occupies their place today.
        </p>
      </blockquote>
    </div>
  );
}
