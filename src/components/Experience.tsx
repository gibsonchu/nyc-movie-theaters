"use client";

import { TimelineProvider } from "@/state/TimelineContext";
import { Masthead } from "@/components/layout/Masthead";
import { StorySections } from "@/components/story/StorySections";

export function Experience() {
  return (
    <TimelineProvider>
      <Masthead />
      <StorySections />
    </TimelineProvider>
  );
}
