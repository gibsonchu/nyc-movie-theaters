import type { Theater } from "@/types/theater";
import { longestRunning, getLifespan } from "@/lib/theater-stats";

export interface Profile {
  theater: Theater;
  /** Why this theater was picked — computed from the data, not written by hand. */
  reason: string;
}

const hasImage = (t: Theater) => Boolean(t.image);

/**
 * Picks a handful of theaters for editorial feature treatment, favoring ones
 * with a photo and a genuinely distinctive fact — longest-running, most
 * renamed, a documented comeback, a vivid present-day occupant, the biggest
 * screen count. Every selection reason is computed from the record itself.
 */
export function selectProfiles(theaters: Theater[], count = 6): Profile[] {
  const picked = new Map<string, Profile>();
  const take = (t: Theater | undefined, reason: string) => {
    if (t && !picked.has(t.id)) picked.set(t.id, { theater: t, reason });
  };

  const longest = longestRunning(theaters, 20).find(hasImage);
  if (longest) {
    const lifespan = getLifespan(longest);
    take(longest, `The longest-running theater in this dataset — ${lifespan.years} years and still open.`);
  }

  const mostRenamed = [...theaters]
    .filter((t) => hasImage(t) && t.alternateNames.length >= 3)
    .sort((a, b) => b.alternateNames.length - a.alternateNames.length)[0];
  take(mostRenamed, `Renamed at least ${mostRenamed?.alternateNames.length ?? 0} times over its history.`);

  const comeback = [...theaters]
    .filter((t) => hasImage(t) && t.reopeningYear != null)
    .sort((a, b) => (b.reopeningYear as number) - (a.reopeningYear as number))[0];
  take(comeback, `Went dark, then reopened in ${comeback?.reopeningYear} — a comeback the record captured.`);

  const nowSomethingElse = [...theaters]
    .filter((t) => hasImage(t) && t.currentPlace && t.currentPlace.category === "amenity")
    .sort((a, b) => a.openingYear - b.openingYear)[0];
  take(nowSomethingElse, `Its old address is now home to ${nowSomethingElse?.currentPlace?.name}.`);

  const biggestMultiplex = [...theaters]
    .filter((t) => hasImage(t) && t.status === "open" && t.screens != null)
    .sort((a, b) => (b.screens as number) - (a.screens as number))[0];
  take(biggestMultiplex, `The most screens of any theater still operating: ${biggestMultiplex?.screens}.`);

  const featuredAnchor = theaters.filter((t) => t.featured && hasImage(t) && !picked.has(t.id));
  for (const t of featuredAnchor) {
    if (picked.size >= count) break;
    take(t, "One of the era's landmark theaters.");
  }

  return [...picked.values()].slice(0, count);
}
