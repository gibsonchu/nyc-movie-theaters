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

/**
 * What a geocoding + on-the-ground audit found at a theater's address today,
 * for theaters whose closure was confirmed but whose exact closing year
 * wasn't recoverable from the source. Only populated for that cohort.
 */
export interface ClosureAudit {
  /** e.g. "closed_unknown_date" — the audit's finding. */
  result: string;
  confidence: Confidence | null;
  note: string | null;
}

/** What occupies the theater's former address today, if the geocoder found something worth noting. */
export interface CurrentPlace {
  name: string | null;
  /** Coarse OSM category, e.g. "amenity", "shop", "building", "highway". */
  category: string | null;
  /** Finer OSM type within that category, e.g. "restaurant", "convenience". */
  type: string | null;
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
  /**
   * True if the venue itself still stands and operates in some form today
   * — including the ~38 venues (mostly Broadway/live-performance houses)
   * that are open but not confirmed to still show films, so `status` reads
   * "closed" for them even though the building is very much in use.
   */
  venueSurvives: boolean;
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
  /** Set only for theaters confirmed closed whose exact closing year is unknown. */
  closureAudit: ClosureAudit | null;
  /** Set only when the geocoder found a present-day occupant worth surfacing. */
  currentPlace: CurrentPlace | null;
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
