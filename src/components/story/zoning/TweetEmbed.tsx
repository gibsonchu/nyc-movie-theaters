"use client";

import Script from "next/script";
import styles from "./TweetEmbed.module.css";

/** Live embed of the real NYC Planning tweet, via X's own oEmbed markup. */
export function TweetEmbed() {
  return (
    <div className={styles.wrap}>
      <blockquote className="twitter-tweet">
        <p lang="en" dir="ltr">
          are you looking to open a new movie theater?? 👀
          <br />
          <br />
          our land use lookup tool shows you which zoning districts allow theaters:{" "}
          <a href="https://t.co/R0hyrYveVM">https://t.co/R0hyrYveVM</a>
        </p>
        &mdash; NYC Planning (@NYCPlanning){" "}
        <a href="https://twitter.com/NYCPlanning/status/2092250711899689214?ref_src=twsrc%5Etfw">
          August 25, 2026
        </a>
      </blockquote>
      <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
    </div>
  );
}
