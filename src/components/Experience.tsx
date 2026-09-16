"use client";

import { TimelineProvider } from "@/state/TimelineContext";
import { MapCanvas } from "@/components/map/MapCanvas";
import { CalloutLayer } from "@/components/callouts/CalloutLayer";
import { Masthead } from "@/components/layout/Masthead";
import { ScrollCue } from "@/components/layout/ScrollCue";
import { ZoningControl } from "@/components/controls/ZoningControl";
import { TheaterDetailPanel } from "@/components/detail/TheaterDetailPanel";
import { Timeline } from "@/components/timeline/Timeline";
import { StorySections } from "@/components/story/StorySections";
import styles from "./Experience.module.css";

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
      <ScrollCue />

      {/* Reserves one viewport of scroll so the fixed map/timeline above are
          the whole show until the reader scrolls — then the story (opaque,
          higher stacking context) rises to cover them. */}
      <div className={styles.openingSpacer} aria-hidden="true" />

      <StorySections />
    </TimelineProvider>
  );
}
