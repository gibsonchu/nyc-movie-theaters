import { ImagePlaceholder } from "@/components/story/ImagePlaceholder";
import styles from "./PosterGallery.module.css";

const POSTERS = [
  { title: "Casablanca", year: 1942 },
  { title: "Double Indemnity", year: 1944 },
  { title: "Meet Me in St. Louis", year: 1944 },
];

/** Placeholder posters for the peak-era moment — the author will swap these for licensed images. */
export function PosterGallery() {
  return (
    <div className={styles.grid}>
      {POSTERS.map((p) => (
        <div key={p.title} className={styles.card}>
          <ImagePlaceholder label={p.title} aspectRatio="2 / 3" />
          <p className={styles.caption}>
            {p.title} <span className={styles.year}>({p.year})</span>
          </p>
        </div>
      ))}
    </div>
  );
}
