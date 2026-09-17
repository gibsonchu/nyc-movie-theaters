"use client";

import { useMemo } from "react";
import { useTimeline } from "@/state/TimelineContext";
import { useMapInstance } from "@/state/MapContext";
import { narrativeEvents } from "@/data/narrativeEvents";
import { theaters } from "@/data/theaters";
import { getActiveNarrativeEvent, resolveEventCoordinates } from "@/lib/narrative";
import { CalloutCard } from "./CalloutCard";

const theaterById = new Map(theaters.map((t) => [t.id, t]));

export function CalloutLayer() {
  const { year, selectTheater } = useTimeline();
  const { map, moveTick } = useMapInstance();

  const event = useMemo(() => getActiveNarrativeEvent(narrativeEvents, year), [year]);

  const anchor = useMemo(() => {
    if (!event || !map) return null;
    const coords = resolveEventCoordinates(event, theaterById);
    if (!coords) return null;
    const point = map.project(coords);
    return { x: point.x, y: point.y };
    // moveTick intentionally forces recomputation on camera movement
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, map, moveTick]);

  if (!event || !anchor) return null;

  const relatedTheater = event.theaterId ? theaterById.get(event.theaterId) ?? null : null;

  return (
    <CalloutCard
      key={event.id}
      event={event}
      anchor={anchor}
      onFocusTheater={relatedTheater ? () => selectTheater(relatedTheater) : undefined}
    />
  );
}
