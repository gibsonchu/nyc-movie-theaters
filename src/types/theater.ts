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
  | "multiplex";

export interface TheaterSource {
  label: string;
  url?: string;
}

export interface Theater {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  borough: Borough;
  /** Year the theater began exhibiting film to the public. */
  openingYear: number;
  /** Year the theater stopped exhibiting film. Null if still operating. */
  closingYear: number | null;
  theaterType: TheaterType;
  screens: number | null;
  seats: number | null;
  operator: string | null;
  /** Featured theaters are eligible for editorial emphasis (larger mark, callouts). */
  featured: boolean;
  image: string | null;
  description: string;
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
};
