"use client";

import { useMemo } from "react";
import { theaters } from "@/data/theaters";
import { formatYearRange } from "@/lib/theater-format";
import styles from "./PhotoCarousel.module.css";

/** A closing sweep through the dataset's photographed theaters — featured ones first, then a broad sample. */
function pickCarouselTheaters() {
  const withImage = theaters.filter((t) => t.image);
  const featured = withImage.filter((t) => t.featured);
  const rest = withImage.filter((t) => !t.featured);
  // Deterministic spread across the rest rather than the first N alphabetically/by-id.
  const step = Math.max(1, Math.floor(rest.length / 14));
  const sampled = rest.filter((_, i) => i % step === 0).slice(0, 16);
  const combined = [...featured, ...sampled];
  return combined.slice(0, 20);
}

export function PhotoCarousel() {
  const items = useMemo(() => pickCarouselTheaters(), []);

  return (
    <div className={styles.scroller}>
      {items.map((t) => (
        <figure key={t.id} className={styles.slide}>
          <div className={styles.imageWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.image!} alt={t.name} className={styles.image} loading="lazy" />
          </div>
          <figcaption className={styles.caption}>
            {t.name} <span className={styles.captionYears}>&middot; {formatYearRange(t)}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
