"use client";

import { useTimeline } from "@/state/TimelineContext";
import { formatYearRange } from "@/lib/theater-format";
import type { Profile } from "./selectProfiles";
import styles from "./ProfileCard.module.css";

export function ProfileCard({ theater, reason }: Profile) {
  const { selectTheater } = useTimeline();

  const open = () => selectTheater(theater);

  return (
    <article
      className={styles.card}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {theater.image && (
        <div className={styles.imageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={theater.image} alt={theater.name} className={styles.image} loading="lazy" />
        </div>
      )}
      <div className={styles.body}>
        <p className={styles.reason}>{reason}</p>
        <h3 className={styles.name}>{theater.name}</h3>
        <p className={styles.meta}>
          {formatYearRange(theater)} &middot; {theater.borough}
        </p>
        <p className={styles.address}>{theater.address}</p>
        <p className={styles.description}>{theater.description}</p>
        <span className={styles.link}>Full record &rarr;</span>
      </div>
    </article>
  );
}
