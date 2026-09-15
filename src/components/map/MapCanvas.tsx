"use client";

import { useEffect, useRef, useState } from "react";
import { Map as MapLibreMap, setWorkerUrl, type GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { theaters } from "@/data/theaters";
import type { Theater } from "@/types/theater";
import { getActiveZoningDataset } from "@/data/zoning";
import { useTimeline } from "@/state/TimelineContext";
import { MapContext } from "@/state/MapContext";
import { theatersToFeatureCollection } from "@/lib/theater-geo";
import { circleOpacityExpression, circleRadiusExpression } from "@/lib/map-expressions";
import { buildTheaterFilter } from "@/lib/theater-filter";
import { DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM, MAP_STYLE_URL, NYC_CENTER, NYC_MAX_BOUNDS } from "@/lib/map-config";
import { ZONING_CATEGORY_COLORS } from "@/types/zoning";
import { TheaterHoverCard } from "./TheaterHoverCard";
import styles from "./MapCanvas.module.css";

const EMPTY_FEATURE_COLLECTION: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

const theaterFeatureCollection = theatersToFeatureCollection(theaters);
const theaterById = new Map(theaters.map((t) => [t.id, t]));

// Turbopack/webpack don't rewrite maplibre-gl's import.meta.url-based worker
// lookup, so it resolves to a chunk that doesn't exist. Point it at a static
// copy of the worker bundle instead.
setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

export function MapCanvas({ children }: { children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [moveTick, setMoveTick] = useState(0);
  const [hover, setHover] = useState<{ theater: Theater; point: { x: number; y: number } } | null>(null);

  const { year, zoningVisible, selectTheater, selectedTheater } = useTimeline();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const instance = new MapLibreMap({
      container: containerRef.current,
      style: MAP_STYLE_URL,
      center: NYC_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      maxBounds: NYC_MAX_BOUNDS,
      attributionControl: { compact: true },
    });

    const resizeObserver = new ResizeObserver(() => instance.resize());
    resizeObserver.observe(containerRef.current);

    instance.on("load", () => {
      instance.addSource("zoning", { type: "geojson", data: EMPTY_FEATURE_COLLECTION });
      instance.addLayer({
        id: "zoning-fill",
        type: "fill",
        source: "zoning",
        layout: { visibility: "none" },
        paint: {
          "fill-color": [
            "match",
            ["get", "category"],
            "permitted",
            ZONING_CATEGORY_COLORS.permitted,
            "conditional",
            ZONING_CATEGORY_COLORS.conditional,
            "special-permit",
            ZONING_CATEGORY_COLORS["special-permit"],
            "not-permitted",
            ZONING_CATEGORY_COLORS["not-permitted"],
            "#cccccc",
          ],
          "fill-opacity": 0.24,
          "fill-opacity-transition": { duration: 500 },
        },
      });
      instance.addLayer({
        id: "zoning-outline",
        type: "line",
        source: "zoning",
        layout: { visibility: "none" },
        paint: {
          "line-color": "#2a2a28",
          "line-opacity": 0.18,
          "line-width": 0.6,
        },
      });

      instance.addSource("theaters", { type: "geojson", data: theaterFeatureCollection });
      instance.addLayer({
        id: "theater-points",
        type: "circle",
        source: "theaters",
        filter: buildTheaterFilter(year),
        paint: {
          "circle-color": "#a4283c",
          "circle-radius": circleRadiusExpression(year),
          "circle-opacity": circleOpacityExpression(year),
          "circle-stroke-color": "#fbf7f0",
          "circle-stroke-width": 1.2,
          "circle-stroke-opacity": circleOpacityExpression(year),
          "circle-radius-transition": { duration: 260 },
          "circle-opacity-transition": { duration: 400 },
          "circle-stroke-opacity-transition": { duration: 400 },
        },
      });

      instance.addLayer({
        id: "theater-selected-ring",
        type: "circle",
        source: "theaters",
        filter: ["==", ["get", "id"], "__none__"],
        paint: {
          "circle-radius": 13,
          "circle-color": "transparent",
          "circle-stroke-color": "#1a1a18",
          "circle-stroke-width": 1.4,
        },
      });

      instance.on("mouseenter", "theater-points", () => {
        instance.getCanvas().style.cursor = "pointer";
      });
      instance.on("mousemove", "theater-points", (e) => {
        const feature = e.features?.[0];
        const id = feature?.properties?.id as string | undefined;
        const theater = id ? theaterById.get(id) : undefined;
        if (theater) {
          setHover({ theater, point: { x: e.point.x, y: e.point.y } });
        }
      });
      instance.on("mouseleave", "theater-points", () => {
        instance.getCanvas().style.cursor = "";
        setHover(null);
      });
      instance.on("click", "theater-points", (e) => {
        const feature = e.features?.[0];
        const id = feature?.properties?.id as string | undefined;
        if (id) {
          const theater = theaterById.get(id) ?? null;
          selectTheater(theater);
          setHover(null);
        }
      });

      const bumpMoveTick = () => setMoveTick((t) => t + 1);
      instance.on("move", bumpMoveTick);
      instance.on("resize", bumpMoveTick);
      instance.on("movestart", () => setHover(null));

      setReady(true);
      setMap(instance);
    });

    mapRef.current = instance;

    return () => {
      resizeObserver.disconnect();
      instance.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep theater fade/size/hit-testing in sync with the selected year.
  useEffect(() => {
    const instance = mapRef.current;
    if (!instance || !ready) return;
    instance.setPaintProperty("theater-points", "circle-radius", circleRadiusExpression(year));
    instance.setPaintProperty("theater-points", "circle-opacity", circleOpacityExpression(year));
    instance.setPaintProperty("theater-points", "circle-stroke-opacity", circleOpacityExpression(year));
    instance.setFilter("theater-points", buildTheaterFilter(year));
    setHover(null);
  }, [year, ready]);

  // Swap in the zoning dataset that applies to the selected year, and toggle visibility.
  useEffect(() => {
    const instance = mapRef.current;
    if (!instance || !ready) return;
    const dataset = getActiveZoningDataset(year);
    const source = instance.getSource("zoning") as GeoJSONSource | undefined;
    source?.setData(dataset?.geojson ?? EMPTY_FEATURE_COLLECTION);
    const visibility = zoningVisible && dataset ? "visible" : "none";
    instance.setLayoutProperty("zoning-fill", "visibility", visibility);
    instance.setLayoutProperty("zoning-outline", "visibility", visibility);
  }, [year, zoningVisible, ready]);

  useEffect(() => {
    const instance = mapRef.current;
    if (!instance || !ready) return;
    instance.setFilter("theater-selected-ring", [
      "==",
      ["get", "id"],
      selectedTheater?.id ?? "__none__",
    ]);
  }, [selectedTheater, ready]);

  return (
    <MapContext.Provider value={{ map, moveTick }}>
      <div ref={containerRef} className={styles.mapRoot} aria-label="Map of New York City movie theaters" />
      {ready && children}
      {hover && <TheaterHoverCard theater={hover.theater} point={hover.point} />}
    </MapContext.Provider>
  );
}
