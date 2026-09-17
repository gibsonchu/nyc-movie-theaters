import type { Theater } from "@/types/theater";

/** "1929–1994", "1932–present", or "Unknown Dates". */
export function formatYearRange(theater: Theater): string {
  if (theater.status === "open") return `${theater.openingYear}–present`;
  if (theater.closingYear != null) return `${theater.openingYear}–${theater.closingYear}`;
  return "Unknown Dates";
}
