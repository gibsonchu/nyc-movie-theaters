export const MAP_STYLE_URL = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

export const NYC_CENTER: [number, number] = [-73.935, 40.715];
export const DEFAULT_ZOOM = 10.3;
export const MIN_ZOOM = 9.6;
export const MAX_ZOOM = 17;

/** Keeps the camera on the five boroughs — panning and zooming is free within it, but the map never "flies" elsewhere. */
export const NYC_MAX_BOUNDS: [[number, number], [number, number]] = [
  [-74.35, 40.45],
  [-73.62, 40.98],
];
