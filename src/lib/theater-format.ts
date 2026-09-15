import type { Theater } from "@/types/theater";

/** "1929–1994", "1932–present", or "1926–? (closing year unknown)". */
export function formatYearRange(theater: Theater): string {
  if (theater.status === "open") return `${theater.openingYear}–present`;
  if (theater.closingYear != null) return `${theater.openingYear}–${theater.closingYear}`;
  return `${theater.openingYear}–? (closing year unknown)`;
}
