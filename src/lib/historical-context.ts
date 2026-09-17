/**
 * National historical context that supplements the theater dataset — none of
 * this is derivable from the CSV, so it's hand-entered here from public
 * historical sources rather than computed. Kept separate from
 * `theater-stats.ts`, which holds only CSV-derived functions.
 */

/**
 * US movie industry at its 1946 peak — the best-documented peak year
 * nationally, a few years after NYC's own theater count (computed from the
 * dataset) peaked around 1940.
 *
 * Sources (the exact citations are rendered as footnotes alongside these
 * figures in StoryboardSection.tsx):
 *  1. Historical Statistics of the United States, Table Dh388-391 (weekly
 *     admissions, ticket price, box office).
 *  2. "Moviegoers Speak Up," Los Angeles Times, Jan 3, 2006 (inflation-
 *     adjusted ticket price).
 *  3. Historical Statistics of the United States, Table Dh388-391
 *     (inflation-adjusted box office).
 */
export const US_MOVIE_INDUSTRY_PEAK_1946 = {
  year: 1946,
  weeklyAdmissionsMillions: 90,
  averageTicketPriceCents: 42,
  averageTicketPriceTodayUsd: 7,
  boxOfficeBillionsUsd: 1.7,
  boxOfficeTodayBillionsUsd: 29,
};
