"use client";

import { useEffect, useRef } from "react";
import { Map as MapLibreMap, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { theaters } from "@/data/theaters";
import { currentTheaters } from "@/lib/theater-stats";
import { theatersToFeatureCollection } from "@/lib/theater-geo";
import { MAP_STYLE_URL, NYC_CENTER, NYC_MAX_BOUNDS, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from "@/lib/map-config";
import styles from "./ComparisonMap.module.css";

setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

const allFeatures = theatersToFeatureCollection(theaters);
const currentFeatures = theatersToFeatureCollection(currentTheaters(theaters));

export function ComparisonMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = new MapLibreMap({
      container: containerRef.current,
      style: MAP_STYLE_URL,
      center: NYC_CENTER,
      zoom: DEFAULT_ZOOM - 0.4,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      maxBounds: NYC_MAX_BOUNDS,
      attributionControl: { compact: true },
    });

    const resizeObserver = new ResizeObserver(() => instance.resize());
    resizeObserver.observe(containerRef.current);

    instance.on("load", () => {
      instance.addSource("all-theaters", { type: "geojson", data: allFeatures });
      instance.addLayer({
        id: "all-theaters-dots",
        type: "circle",
        source: "all-theaters",
        paint: {
          "circle-radius": 3,
          "circle-color": "#161717",
          "circle-opacity": 0.28,
        },
      });

      instance.addSource("current-theaters", { type: "geojson", data: currentFeatures });
      instance.addLayer({
        id: "current-theaters-dots",
        type: "circle",
        source: "current-theaters",
        paint: {
          "circle-radius": 5,
          "circle-color": "#a4283c",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1.2,
        },
      });
    });

    return () => {
      resizeObserver.disconnect();
      instance.remove();
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <div ref={containerRef} className={styles.map} aria-label="Map comparing every theater that ever operated with those still open today" />
      <div className={styles.legend}>
        <div className={styles.legendRow}>
          <span className={styles.swatchGhost} /> Every theater in the dataset ({theaters.length.toLocaleString()})
        </div>
        <div className={styles.legendRow}>
          <span className={styles.swatchCurrent} /> Confirmed open today ({currentTheaters(theaters).length.toLocaleString()})
        </div>
      </div>
    </div>
  );
}
