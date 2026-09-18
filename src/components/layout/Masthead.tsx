import styles from "./Masthead.module.css";

export function Masthead() {
  return (
    <header className={styles.wrap}>
      <a href="https://inspacesstudio.com/" target="_blank" rel="noreferrer" className={styles.logoLink}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/inspaceslogo.jpg" alt="In Spaces" className={styles.logo} />
      </a>
      <h1 className={styles.title}>Thank You for Coming to the Movies</h1>
      <p className={styles.subtitle}>Where movie theaters have come and gone across New York City</p>
      <p className={styles.byline}>
        By{" "}
        <a href="https://gibsonchu.com/" target="_blank" rel="noreferrer">
          Gibson Chu
        </a>
        {" "}&middot; Published: September 18, 2026
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/personal-kipsbay.jpg" alt="Catching a film at AMC Kips Bay" className={styles.heroImage} />
      <p className={styles.heroCaption}>
        Film photo I shot, catching a film at AMC Kips Bay with my friend Michelle.
      </p>
    </header>
  );
}
