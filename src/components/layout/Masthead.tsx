"use client";

import { theaters } from "@/data/theaters";
import { currentTheaters } from "@/lib/theater-stats";
import styles from "./Masthead.module.css";

export function Masthead() {
  const total = theaters.length;
  const open = currentTheaters(theaters).length;

  return (
    <header className={styles.wrap}>
      <h1 className={styles.title}>Reel City</h1>
      <p className={styles.subtitle}>Movie theaters across New York City, 1896&ndash;2026</p>
      <p className={styles.dek}>
        This dataset has a record of {total.toLocaleString()} movie theaters that have operated somewhere in New
        York City since 1896. Only {open.toLocaleString()} are still open. This is the story of what the city&rsquo;s
        movie theaters looked like at their peak, how the network thinned out, and what remains today &mdash;
        ending with the full interactive map to explore on your own.
      </p>
    </header>
  );
}
