"use client";

import { useEffect, useState } from "react";
import styles from "./ScrollCue.module.css";

/** Invites the reader to scroll past the opening map into the story. Fades as they start scrolling. */
export function ScrollCue() {
  const [pastThreshold, setPastThreshold] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastThreshold(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`${styles.wrap} ${pastThreshold ? styles.hidden : ""}`}>
      <p className={styles.prompt}>Where did all the theaters go?</p>
      <span className={styles.arrow} aria-hidden="true" />
    </div>
  );
}
