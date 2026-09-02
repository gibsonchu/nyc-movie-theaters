import styles from "./Masthead.module.css";

export function Masthead() {
  return (
    <header className={styles.wrap}>
      <h1 className={styles.title}>Reel City</h1>
      <p className={styles.subtitle}>
        Movie theaters across New York City, 1896&ndash;2026
      </p>
    </header>
  );
}
