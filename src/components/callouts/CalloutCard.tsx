"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { NarrativeEvent } from "@/types/narrative";
import styles from "./CalloutCard.module.css";

const GAP = 30;
const SAFE_TOP = 96;
const SAFE_BOTTOM = 168;
const SAFE_SIDE = 16;

interface Props {
  event: NarrativeEvent;
  anchor: { x: number; y: number };
  onFocusTheater?: () => void;
}

export function CalloutCard({ event, anchor, onFocusTheater }: Props) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [box, setBox] = useState<{ left: number; top: number; width: number; height: number } | null>(
    null
  );

  const placement = event.placement ?? "right";

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el || typeof window === "undefined") return;

    const rect = el.getBoundingClientRect();
    const height = rect.height;
    const width = rect.width;
    let left: number;
    let top: number;

    if (placement === "left") {
      left = anchor.x - GAP - width;
      top = anchor.y - height / 2;
    } else if (placement === "top") {
      left = anchor.x - width / 2;
      top = anchor.y - GAP - height;
    } else if (placement === "bottom") {
      left = anchor.x - width / 2;
      top = anchor.y + GAP;
    } else {
      left = anchor.x + GAP;
      top = anchor.y - height / 2;
    }

    const maxLeft = window.innerWidth - SAFE_SIDE - width;
    const maxTop = window.innerHeight - SAFE_BOTTOM - height;
    left = Math.min(Math.max(left, SAFE_SIDE), Math.max(SAFE_SIDE, maxLeft));
    top = Math.min(Math.max(top, SAFE_TOP), Math.max(SAFE_TOP, maxTop));

    setBox({ left, top, width, height });
  }, [anchor.x, anchor.y, placement, event.id]);

  const connectorPoint =
    box &&
    (() => {
      switch (placement) {
        case "left":
          return { x: box.left + box.width, y: box.top + box.height / 2 };
        case "right":
          return { x: box.left, y: box.top + box.height / 2 };
        case "top":
          return { x: box.left + box.width / 2, y: box.top + box.height };
        case "bottom":
        default:
          return { x: box.left + box.width / 2, y: box.top };
      }
    })();

  return (
    <>
      {connectorPoint && (
        <svg className={styles.connectorLayer} aria-hidden="true">
          <line
            x1={anchor.x}
            y1={anchor.y}
            x2={connectorPoint.x}
            y2={connectorPoint.y}
            stroke="var(--ink)"
            strokeWidth={1}
          />
          <circle cx={anchor.x} cy={anchor.y} r={3.5} fill="none" stroke="var(--ink)" strokeWidth={1} />
        </svg>
      )}
      <article
        ref={cardRef as React.RefObject<HTMLElement>}
        className={styles.card}
        style={{
          left: box?.left ?? anchor.x,
          top: box?.top ?? anchor.y,
          visibility: box ? "visible" : "hidden",
        }}
      >
        <p className={styles.year}>{event.year}</p>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.text}>{event.text}</p>
        {onFocusTheater && (
          <button type="button" className={styles.link} onClick={onFocusTheater}>
            View theater details &rarr;
          </button>
        )}
      </article>
    </>
  );
}
