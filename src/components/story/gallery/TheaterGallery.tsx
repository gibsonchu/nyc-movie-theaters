import { ImagePlaceholder } from "@/components/story/ImagePlaceholder";
import type { GalleryItem } from "./curatedGalleries";
import styles from "./TheaterGallery.module.css";

export function TheaterGallery({ items }: { items: GalleryItem[] }) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <article key={item.name} className={styles.card}>
          {item.image ? (
            <div className={styles.imageWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className={styles.image} loading="lazy" />
            </div>
          ) : (
            <ImagePlaceholder label={item.name} aspectRatio="4 / 3" />
          )}
          <h3 className={styles.name}>{item.name}</h3>
          <p className={styles.years}>{item.years}</p>
          <p className={styles.description}>{item.description}</p>
          {item.dataNote && <p className={styles.dataNote}>{item.dataNote}</p>}
        </article>
      ))}
    </div>
  );
}
