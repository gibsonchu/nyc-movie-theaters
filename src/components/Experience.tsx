"use client";

import { TimelineProvider } from "@/state/TimelineContext";
import { MapCanvas } from "@/components/map/MapCanvas";
import { CalloutLayer } from "@/components/callouts/CalloutLayer";
import { Masthead } from "@/components/layout/Masthead";
import { ZoningControl } from "@/components/controls/ZoningControl";
import { TheaterDetailPanel } from "@/components/detail/TheaterDetailPanel";
import { Timeline } from "@/components/timeline/Timeline";

export function Experience() {
  return (
    <TimelineProvider>
      <MapCanvas>
        <CalloutLayer />
      </MapCanvas>
      <Masthead />
      <ZoningControl />
      <TheaterDetailPanel />
      <Timeline />
    </TimelineProvider>
  );
}
