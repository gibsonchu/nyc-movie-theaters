import type { FeatureCollection, Point } from "geojson";
import type { Theater } from "@/types/theater";
import { OPEN_ENDED_SENTINEL } from "./timeline";

export interface TheaterPointProperties {
  id: string;
  name: string;
  borough: string;
  theaterType: string;
  openingYear: number;
  closingYear: number;
  featured: number;
}

export type TheaterFeatureCollection = FeatureCollection<Point, TheaterPointProperties>;

/**
 * Converts the editorial theater dataset into the GeoJSON MapLibre expects.
 * This is the one place that knows about the `closingYear: null` ->
 * sentinel-number translation MapLibre's expression language needs; the
 * rest of the visualization layer only ever sees TheaterPointProperties.
 */
export function theatersToFeatureCollection(theaters: Theater[]): TheaterFeatureCollection {
  return {
    type: "FeatureCollection",
    features: theaters.map((theater) => ({
      type: "Feature",
      id: theater.id,
      geometry: {
        type: "Point",
        coordinates: [theater.longitude, theater.latitude],
      },
      properties: {
        id: theater.id,
        name: theater.name,
        borough: theater.borough,
        theaterType: theater.theaterType,
        openingYear: theater.openingYear,
        closingYear: theater.closingYear ?? OPEN_ENDED_SENTINEL,
        featured: theater.featured ? 1 : 0,
      },
    })),
  };
}
