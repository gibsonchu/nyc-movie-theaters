import type { NarrativeEvent } from "@/types/narrative";
import type { Theater } from "@/types/theater";
import { NARRATIVE_DWELL_YEARS } from "./timeline";

/**
 * Returns the single most relevant active narrative event for a given year:
 * the most recently triggered event whose dwell window contains the year.
 * Kept simple/deterministic so at most one editorial card competes with
 * the map at a time.
 */
export function getActiveNarrativeEvent(
  events: NarrativeEvent[],
  year: number
): NarrativeEvent | null {
  let best: NarrativeEvent | null = null;
  let bestDelta = Infinity;
  for (const event of events) {
    const delta = year - event.year;
    if (delta >= 0 && delta <= NARRATIVE_DWELL_YEARS && delta < bestDelta) {
      best = event;
      bestDelta = delta;
    }
  }
  return best;
}

export function resolveEventCoordinates(
  event: NarrativeEvent,
  theaterById: Map<string, Theater>
): [number, number] | null {
  if (event.theaterId) {
    const theater = theaterById.get(event.theaterId);
    if (theater) return [theater.longitude, theater.latitude];
  }
  return event.coordinates ?? null;
}
