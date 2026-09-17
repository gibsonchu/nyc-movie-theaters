"use client";

import { useEffect, useRef, useState } from "react";
import { Map as MapLibreMap, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { theaters } from "@/data/theaters";
import { theatersToFeatureCollection } from "@/lib/theater-geo";
import { circleColorExpression, circleOpacityExpression, circleRadiusExpression } from "@/lib/map-expressions";
import { buildTheaterFilter } from "@/lib/theater-filter";
import { MAP_STYLE_URL, NYC_CENTER, NYC_MAX_BOUNDS, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM } from "@/lib/map-config";
import { MIN_YEAR, MAX_YEAR, clampYear } from "@/lib/timeline";
import styles from "./ScrollDrivenMap.module.css";

setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

const theaterFeatures = theatersToFeatureCollection(theaters);

export function ScrollDrivenMap() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const readyRef = useRef(false);
  const [year, setYear] = useState(MIN_YEAR);

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = new MapLibreMap({
      container: containerRef.current,
      style: MAP_STYLE_URL,
      center: NYC_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      maxBounds: NYC_MAX_BOUNDS,
      interactive: false,
      attributionControl: { compact: true },
    });

    const resizeObserver = new ResizeObserver(() => instance.resize());
    resizeObserver.observe(containerRef.current);

    instance.on("load", () => {
      instance.addSource("theaters", { type: "geojson", data: theaterFeatures });
      instance.addLayer({
        id: "theater-points",
        type: "circle",
        source: "theaters",
        filter: buildTheaterFilter(MIN_YEAR),
        paint: {
          "circle-color": circleColorExpression(MIN_YEAR),
          "circle-radius": circleRadiusExpression(MIN_YEAR),
          "circle-opacity": circleOpacityExpression(MIN_YEAR),
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1,
          "circle-stroke-opacity": circleOpacityExpression(MIN_YEAR),
          "circle-radius-transition": { duration: 200 },
          "circle-opacity-transition": { duration: 300 },
          "circle-stroke-opacity-transition": { duration: 300 },
        },
      });
      readyRef.current = true;
      mapRef.current = instance;
    });

    return () => {
      resizeObserver.disconnect();
      instance.remove();
      mapRef.current = null;
      readyRef.current = false;
    };
  }, []);

  useEffect(() => {
    const instance = mapRef.current;
    if (!instance || !readyRef.current) return;
    instance.setPaintProperty("theater-points", "circle-color", circleColorExpression(year));
    instance.setPaintProperty("theater-points", "circle-radius", circleRadiusExpression(year));
    instance.setPaintProperty("theater-points", "circle-opacity", circleOpacityExpression(year));
    instance.setPaintProperty("theater-points", "circle-stroke-opacity", circleOpacityExpression(year));
    instance.setFilter("theater-points", buildTheaterFilter(year));
  }, [year]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        setYear(clampYear(MIN_YEAR + progress * (MAX_YEAR - MIN_YEAR)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div className={styles.sticky}>
        <div ref={containerRef} className={styles.map} aria-hidden="true" />
        <div className={styles.overlay}>
          <span className={styles.year}>{year}</span>
        </div>
      </div>
    </div>
  );
}
