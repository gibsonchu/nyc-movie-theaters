"use client";

import { useMemo } from "react";
import { theaters } from "@/data/theaters";
import { selectProfiles } from "./selectProfiles";
import { ProfileCard } from "./ProfileCard";
import section from "@/components/story/section.module.css";
import styles from "./ProfilesSection.module.css";

export function ProfilesSection() {
  const profiles = useMemo(() => selectProfiles(theaters, 6), []);

  return (
    <section className={section.section} id="every-dot-was-a-place">
      <div className={section.inner}>
        <p className={section.kicker}>Part Three</p>
        <h2 className={section.heading}>Every Dot Was a Place</h2>
        <p className={section.lede}>
          Numbers flatten the story. Behind each one is an address, a marquee, a name that sometimes changed more
          than once. A handful of the more distinctive records from this dataset, below.
        </p>
      </div>

      <div className={section.wide}>
        <div className={styles.grid}>
          {profiles.map((p) => (
            <ProfileCard key={p.theater.id} theater={p.theater} reason={p.reason} />
          ))}
        </div>
      </div>
    </section>
  );
}
