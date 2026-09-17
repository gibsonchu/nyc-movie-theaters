import styles from "./Masthead.module.css";

export function Masthead() {
  return (
    <header className={styles.wrap}>
      <h1 className={styles.title}>Thank You for Coming to the Movies</h1>
      <p className={styles.subtitle}>Where movie theaters have come and gone across New York City</p>
      <p className={styles.byline}>By Gibson Chu</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/AMC-kips-bay.jpg" alt="AMC Kips Bay 15" className={styles.heroImage} />
    </header>
  );
}
