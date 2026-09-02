import type { ZoningCategory, ZoningFeature, ZoningFeatureCollection } from "@/types/zoning";

export type ZoneBox = {
  /** [minLng, minLat, maxLng, maxLat] */
  bbox: [number, number, number, number];
  category: ZoningCategory;
  name: string;
  sourceCode?: string;
};

function rectPolygon(bbox: [number, number, number, number]): number[][] {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  return [
    [minLng, minLat],
    [maxLng, minLat],
    [maxLng, maxLat],
    [minLng, maxLat],
    [minLng, minLat],
  ];
}

export function zoneToFeature(zone: ZoneBox): ZoningFeature {
  return {
    type: "Feature",
    properties: {
      category: zone.category,
      name: zone.name,
      sourceCode: zone.sourceCode,
    },
    geometry: {
      type: "Polygon",
      coordinates: [rectPolygon(zone.bbox)],
    },
  };
}

export function zonesToCollection(zones: ZoneBox[]): ZoningFeatureCollection {
  return {
    type: "FeatureCollection",
    features: zones.map(zoneToFeature),
  };
}
