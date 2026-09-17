"use client";

import { TimelineProvider } from "@/state/TimelineContext";
import { Masthead } from "@/components/layout/Masthead";
import { TheaterDetailPanel } from "@/components/detail/TheaterDetailPanel";
import { StorySections } from "@/components/story/StorySections";

export function Experience() {
  return (
    <TimelineProvider>
      <Masthead />
      <StorySections />
      <TheaterDetailPanel />
    </TimelineProvider>
  );
}
