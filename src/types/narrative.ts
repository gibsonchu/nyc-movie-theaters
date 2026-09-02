/**
 * Narrative events are editorial callouts triggered by the timeline year.
 * They are intentionally decoupled from the theater dataset — a callout may
 * reference a theater by id (to draw a connector to its map dot) or stand on
 * its own with explicit coordinates (e.g. a citywide moment).
 */
export interface NarrativeEvent {
  id: string;
  /** Year on the timeline that triggers this callout. */
  year: number;
  title: string;
  text: string;
  image?: string | null;
  /** Theater this callout connects to, if any. */
  theaterId?: string | null;
  /** Fallback anchor point when the callout isn't tied to a single theater. */
  coordinates?: [number, number] | null;
  /** Preferred side for the card relative to its anchor point. */
  placement?: "left" | "right" | "top" | "bottom";
}
