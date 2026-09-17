"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useTimeline } from "@/state/TimelineContext";
import { narrativeEvents } from "@/data/narrativeEvents";
import { zoningDatasets } from "@/data/zoning";
import { decadeTicks, percentToYear, yearToPercent } from "@/lib/timeline-scale";
import { MAX_YEAR, MIN_YEAR } from "@/lib/timeline";
import styles from "./Timeline.module.css";

interface TimelineProps {
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export function Timeline({ isExpanded = false, onToggleExpanded }: TimelineProps) {
  const { year, setYear, playing, togglePlay, pause } = useTimeline();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const ticks = useMemo(() => decadeTicks(), []);
  const eraBoundaries = useMemo(
    () => zoningDatasets.slice(1).map((d) => d.startYear),
    []
  );

  const yearFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return year;
    const rect = track.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    return percentToYear(Math.min(100, Math.max(0, percent)));
  }, [year]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      pause();
      setDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setYear(yearFromClientX(e.clientX));
    },
    [pause, setYear, yearFromClientX]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      setYear(yearFromClientX(e.clientX));
    },
    [dragging, setYear, yearFromClientX]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  const handlePercent = yearToPercent(year);

  return (
    <div className={styles.wrap}>
      <div className={styles.controlRow}>
        <button
          type="button"
          className={styles.playButton}
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "❚❚ Pause" : "▶ Play"}
        </button>

        <div className={styles.yearReadout}>{year}</div>

        <div className={styles.trackArea}>
          <div
            ref={trackRef}
            className={styles.track}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            role="slider"
            aria-valuemin={MIN_YEAR}
            aria-valuemax={MAX_YEAR}
            aria-valuenow={year}
            aria-label="Timeline year"
            tabIndex={0}
          >
            <div className={styles.trackLine} />

            {eraBoundaries.map((boundaryYear) => (
              <div
                key={`era-${boundaryYear}`}
                className={styles.eraBoundary}
                style={{ left: `${yearToPercent(boundaryYear)}%` }}
              />
            ))}

            {narrativeEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                className={styles.eventMarker}
                style={{ left: `${yearToPercent(event.year)}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  pause();
                  setYear(event.year);
                }}
                title={`${event.year} — ${event.title}`}
                aria-label={`Jump to ${event.year}: ${event.title}`}
              />
            ))}

            <div className={styles.ticksLayer}>
              {ticks.map((tickYear) => (
                <div
                  key={tickYear}
                  className={styles.tick}
                  style={{ left: `${yearToPercent(tickYear)}%` }}
                >
                  <span className={styles.tickLabel}>{tickYear}</span>
                </div>
              ))}
            </div>

            <div className={styles.handle} style={{ left: `${handlePercent}%` }} />
          </div>
        </div>

        {onToggleExpanded && (
          <button
            type="button"
            className={styles.expandButton}
            onClick={onToggleExpanded}
            aria-label={isExpanded ? "Exit fullscreen" : "View fullscreen"}
            title={isExpanded ? "Exit fullscreen" : "View fullscreen"}
          >
            {isExpanded ? "✕" : "⛶"}
          </button>
        )}
      </div>
    </div>
  );
}
