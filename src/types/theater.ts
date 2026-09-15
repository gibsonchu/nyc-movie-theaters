export type Borough =
  | "Manhattan"
  | "Brooklyn"
  | "Queens"
  | "Bronx"
  | "Staten Island";

export type TheaterType =
  | "exhibition-hall"
  | "nickelodeon"
  | "movie-palace"
  | "neighborhood"
  | "grindhouse"
  | "art-house"
  | "multiplex"
  /** Type not confidently known from the source record. */
  | "unknown";

/** Whether the theater is currently exhibiting film, per the source record. */
export type TheaterStatus = "open" | "closed";

/** How confident the source is in this record's dates/details. */
export type Confidence = "high" | "medium" | "low";

export interface TheaterSource {
  label: string;
  url?: string;
}

export interface Theater {
  id: string;
  name: string;
  /** Other names this theater has operated under (renamings, prior operators). */
  alternateNames: string[];
  address: string;
  latitude: number;
  longitude: number;
  borough: Borough;
  /** Year the theater first opened. */
  openingYear: number;
  /**
   * Year the theater closed, if known. Null both when it's still operating
   * (see `status`) and when it's known to have closed but the exact year
   * wasn't recorded — check `status` to tell those apart.
   */
  closingYear: number | null;
  /** Year it reopened after an earlier closure, if it did and that's recorded. */
  reopeningYear: number | null;
  status: TheaterStatus;
  theaterType: TheaterType;
  screens: number | null;
  seats: number | null;
  operator: string | null;
  /** Featured theaters are eligible for editorial emphasis (larger mark, callouts). */
  featured: boolean;
  image: string | null;
  description: string;
  confidence: Confidence;
  sources: TheaterSource[];
}

export const THEATER_TYPE_LABELS: Record<TheaterType, string> = {
  "exhibition-hall": "Exhibition Hall",
  nickelodeon: "Nickelodeon",
  "movie-palace": "Movie Palace",
  neighborhood: "Neighborhood House",
  grindhouse: "Grindhouse",
  "art-house": "Art House",
  multiplex: "Multiplex",
  unknown: "Theater",
};
