"use client";

import { createContext, useContext } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";

export interface MapContextValue {
  map: MapLibreMap | null;
  /** Increments on every camera move; subscribe to it to recompute pixel positions. */
  moveTick: number;
}

export const MapContext = createContext<MapContextValue>({ map: null, moveTick: 0 });

export function useMapInstance(): MapContextValue {
  return useContext(MapContext);
}
