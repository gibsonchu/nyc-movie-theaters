import { ImagePlaceholder } from "@/components/story/ImagePlaceholder";
import styles from "./Masthead.module.css";

export function Masthead() {
  return (
    <header className={styles.wrap}>
      <h1 className={styles.title}>Thank You for Coming to the Movies</h1>
      <p className={styles.subtitle}>Where movie theaters have come and gone across New York City</p>
      <ImagePlaceholder label="AMC Kips Bay 15" className={styles.heroImage} aspectRatio="16 / 9" />
    </header>
  );
}
