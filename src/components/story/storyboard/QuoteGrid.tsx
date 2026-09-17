import styles from "./QuoteGrid.module.css";

const PLACEHOLDER_QUOTES = [
  { quote: "Quote placeholder — a New Yorker on what going to the movies felt like in the 1940s.", attribution: "Name, context TK" },
  { quote: "Quote placeholder — a memory of a specific neighborhood theater.", attribution: "Name, context TK" },
  { quote: "Quote placeholder — on the experience of the movie palace itself.", attribution: "Name, context TK" },
];

/** Placeholder quotes for the peak-era moment — the author will swap these in later. */
export function QuoteGrid() {
  return (
    <div className={styles.grid}>
      {PLACEHOLDER_QUOTES.map((q, i) => (
        <blockquote key={i} className={styles.card}>
          <p className={styles.quote}>&ldquo;{q.quote}&rdquo;</p>
          <p className={styles.attribution}>{q.attribution}</p>
        </blockquote>
      ))}
    </div>
  );
}
