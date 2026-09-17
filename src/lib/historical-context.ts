/**
 * National historical context that supplements the theater dataset — none of
 * this is derivable from the CSV, so it's hand-entered here from public
 * historical sources rather than computed. Kept separate from
 * `theater-stats.ts`, which holds only CSV-derived functions.
 */

/** US movie industry at its 1946 peak — the best-documented peak year nationally, a few years after NYC's own theater count (computed from the dataset) peaked around 1940. */
export const US_MOVIE_INDUSTRY_PEAK_1946 = {
  year: 1946,
  weeklyAdmissionsMillions: 90,
  averageTicketPriceCents: 42,
  averageTicketPriceTodayUsd: 5.65,
  boxOfficeBillionsUsd: 1.7,
  boxOfficeTodayBillionsUsd: 27,
  moviesReleasedPerYear: 400,
  source: "Historical Statistics of the United States; contemporary trade press (Variety, Motion Picture Herald)",
};

/** Share of US households owning a television, by year — the fastest mass-medium adoption in US history. */
export const TV_OWNERSHIP_BY_YEAR: { year: number; percentOfHomes: number }[] = [
  { year: 1946, percentOfHomes: 0 },
  { year: 1950, percentOfHomes: 9 },
  { year: 1955, percentOfHomes: 64.5 },
  { year: 1960, percentOfHomes: 87.1 },
];
