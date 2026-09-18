"use client";

import { useEffect, useRef, useState } from "react";
import { Map as MapLibreMap, setWorkerUrl, type GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTimeline } from "@/state/TimelineContext";
import {
  CURRENT_ZONING_COLORS,
  CURRENT_ZONING_LABELS,
  type CurrentZoningClassification,
  type CurrentZoningTheaterProperties,
} from "@/types/current-zoning";
import { DEFAULT_ZOOM, MAX_ZOOM, MAP_STYLE_URL, NYC_CENTER, NYC_MAX_BOUNDS } from "@/lib/map-config";
import { CurrentZoningTheaterPanel } from "@/components/detail/CurrentZoningTheaterPanel";
import styles from "./CurrentZoningMap.module.css";

const EMPTY_FEATURE_COLLECTION: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

const CATEGORY_ORDER: CurrentZoningClassification[] = ["permitted", "restricted", "special", "not_permitted"];

// Turbopack/webpack don't rewrite maplibre-gl's import.meta.url-based worker
// lookup, so it resolves to a chunk that doesn't exist. Point it at a static
// copy of the worker bundle instead. (Safe to call again — same as MapCanvas.)
setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

/**
 * A standalone, timeline-free map: just today's zoning-permission screen and
 * the historical theater sites colored by it. No year scrubber, no historical
 * eras — this is a single present-day snapshot (July 2026).
 */
export function CurrentZoningMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);
  const [openTodayOnly, setOpenTodayOnly] = useState(false);
  const { selectZoningTheater } = useTimeline();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const instance = new MapLibreMap({
      container: containerRef.current,
      style: MAP_STYLE_URL,
      center: NYC_CENTER,
      zoom: DEFAULT_ZOOM,
      // Unlike the historical timeline map, this snapshot has no scrubber to
      // reorient a user who's zoomed out into New Jersey or Long Island, so
      // it never zooms out past its default, NYC-framed view.
      minZoom: DEFAULT_ZOOM,
      maxZoom: MAX_ZOOM,
      maxBounds: NYC_MAX_BOUNDS,
      attributionControl: { compact: true },
    });

    const resizeObserver = new ResizeObserver(() => instance.resize());
    resizeObserver.observe(containerRef.current);

    instance.on("load", () => {
      instance.addSource("current-zoning", { type: "geojson", data: EMPTY_FEATURE_COLLECTION });
      instance.addLayer({
        id: "current-zoning-fill",
        type: "fill",
        source: "current-zoning",
        paint: {
          "fill-color": [
            "match",
            ["get", "classification"],
            "permitted",
            CURRENT_ZONING_COLORS.permitted,
            "restricted",
            CURRENT_ZONING_COLORS.restricted,
            "special",
            CURRENT_ZONING_COLORS.special,
            "not_permitted",
            CURRENT_ZONING_COLORS.not_permitted,
            "#cccccc",
          ],
          "fill-opacity": 0.55,
        },
      });

      instance.addSource("current-zoning-theaters", { type: "geojson", data: EMPTY_FEATURE_COLLECTION });
      instance.addLayer({
        id: "current-zoning-theater-points",
        type: "circle",
        source: "current-zoning-theaters",
        paint: {
          "circle-radius": 5.5,
          "circle-color": [
            "match",
            ["get", "classification"],
            "permitted",
            CURRENT_ZONING_COLORS.permitted,
            "restricted",
            CURRENT_ZONING_COLORS.restricted,
            "special",
            CURRENT_ZONING_COLORS.special,
            "not_permitted",
            CURRENT_ZONING_COLORS.not_permitted,
            "#cccccc",
          ],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1.2,
        },
      });

      instance.on("mouseenter", "current-zoning-theater-points", () => {
        instance.getCanvas().style.cursor = "pointer";
      });
      instance.on("mouseleave", "current-zoning-theater-points", () => {
        instance.getCanvas().style.cursor = "";
      });
      instance.on("click", "current-zoning-theater-points", (e) => {
        const feature = e.features?.[0];
        if (feature) {
          selectZoningTheater(feature.properties as unknown as CurrentZoningTheaterProperties);
        }
      });

      Promise.all([
        fetch("/zoning/current-zoning.geojson").then((r) => r.json()),
        fetch("/zoning/theater-current-zoning.geojson").then((r) => r.json()),
      ]).then(([zoningData, theaterData]) => {
        (instance.getSource("current-zoning") as GeoJSONSource | undefined)?.setData(zoningData);
        (instance.getSource("current-zoning-theaters") as GeoJSONSource | undefined)?.setData(theaterData);
      });

      setReady(true);
    });

    mapRef.current = instance;

    return () => {
      resizeObserver.disconnect();
      instance.remove();
      mapRef.current = null;
      selectZoningTheater(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter the theater dots down to ones actually showing movies today, matching
  // the exact "Open (Showing movies)" status string theaters.ts treats as open.
  useEffect(() => {
    const instance = mapRef.current;
    if (!instance || !ready) return;
    instance.setFilter(
      "current-zoning-theater-points",
      openTodayOnly ? ["==", ["get", "historicalStatus"], "Open (Showing movies)"] : null
    );
  }, [openTodayOnly, ready]);

  return (
    <div className={styles.frame}>
      <div
        ref={containerRef}
        className={styles.mapRoot}
        aria-label="Map of where a movie theater is permitted under New York City's current zoning"
      />

      {ready && (
        <>
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setOpenTodayOnly((prev) => !prev)}
            aria-pressed={openTodayOnly}
          >
            <span className={`${styles.switch} ${openTodayOnly ? styles.switchOn : ""}`}>
              <span className={styles.switchKnob} />
            </span>
            Only show theaters open today
          </button>

          <div className={styles.legend}>
            {CATEGORY_ORDER.map((category) => (
              <span key={category} className={styles.legendItem}>
                <span className={styles.swatch} style={{ background: CURRENT_ZONING_COLORS[category] }} />
                {CURRENT_ZONING_LABELS[category]}
              </span>
            ))}
          </div>
        </>
      )}

      <CurrentZoningTheaterPanel />
    </div>
  );
}
