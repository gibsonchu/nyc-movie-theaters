import type { Theater } from "@/types/theater";
import { THEATER_TYPE_LABELS } from "@/types/theater";
import { formatYearRange } from "@/lib/theater-format";
import styles from "./TheaterHoverCard.module.css";

const OFFSET = 16;
const CARD_WIDTH = 260;
const SAFE_TOP = 24;
const SAFE_BOTTOM = 168;
const SAFE_SIDE = 16;

interface Props {
  theater: Theater;
  point: { x: number; y: number };
}

export function TheaterHoverCard({ theater, point }: Props) {
  let left = point.x + OFFSET;
  if (typeof window !== "undefined" && left + CARD_WIDTH + SAFE_SIDE > window.innerWidth) {
    left = point.x - OFFSET - CARD_WIDTH;
  }
  let top = point.y + OFFSET;
  if (typeof window !== "undefined") {
    left = Math.min(Math.max(left, SAFE_SIDE), Math.max(SAFE_SIDE, window.innerWidth - SAFE_SIDE - CARD_WIDTH));
    top = Math.min(top, window.innerHeight - SAFE_BOTTOM - 90);
    top = Math.max(top, SAFE_TOP);
  }

  return (
    <div className={styles.card} style={{ left, top }}>
      {theater.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={theater.image} alt="" className={styles.image} />
      )}
      <p className={styles.name}>{theater.name}</p>
      <p className={styles.meta}>
        {formatYearRange(theater)}
        <span className={styles.metaNote}>
          {" · "}
          {theater.borough}
          {theater.theaterType !== "unknown" ? ` · ${THEATER_TYPE_LABELS[theater.theaterType]}` : ""}
        </span>
      </p>
    </div>
  );
}
