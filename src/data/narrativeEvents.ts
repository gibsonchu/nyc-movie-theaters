import type { NarrativeEvent } from "@/types/narrative";

/**
 * Editorial callouts, kept separate from the theater dataset so either can
 * be replaced independently. `theaterId` links a callout to a real theater
 * record (by Cinema Treasures id) for the connector line; where the source
 * record's dates don't cleanly support a specific callout's claim (or no
 * matching record survived import — e.g. missing an opening year), the
 * callout uses an explicit `coordinates` anchor instead rather than link to
 * a theater whose logged history would contradict the callout text.
 */
export const narrativeEvents: NarrativeEvent[] = [
  {
    id: "birth-of-cinema-nyc",
    year: 1896,
    title: "Cinema Arrives in New York",
    text: "On April 23, 1896, Edison's Vitascope projected moving pictures for a paying New York audience for the first time, at Koster & Bial's Music Hall on Herald Square.",
    image: null,
    theaterId: null,
    coordinates: [-73.9878, 40.7502],
    placement: "right",
  },
  {
    id: "nickelodeon-boom",
    year: 1905,
    title: "The Nickelodeon Boom",
    text: "Storefront theaters charging a nickel admission spread rapidly through immigrant neighborhoods — by 1908 the city had several hundred, more per capita than almost anywhere in the country.",
    image: null,
    theaterId: null,
    coordinates: [-73.9911, 40.7359],
    placement: "right",
  },
  {
    id: "birth-of-the-palace",
    year: 1914,
    title: "The Movie Palace Is Born",
    text: "The Strand's opening on Broadway established a new scale for exhibition — orchestras, uniformed ushers, thousands of seats — and set off a building race up and down Times Square. It would go on to operate for decades under a string of later names: Warner, Cinerama, Penthouse.",
    image: null,
    theaterId: "2975",
    placement: "left",
  },
  {
    id: "wonder-theatres",
    year: 1929,
    title: "Loew's 'Wonder Theatres'",
    text: "In a single push, Loew's opened five monumental atmospheric theaters across four boroughs — Paradise, Kings, Valencia and 175th Street among them — each seating well over three thousand.",
    image: null,
    theaterId: "900",
    placement: "top",
  },
  {
    id: "radio-city-opens",
    year: 1932,
    title: "Radio City Music Hall Opens",
    text: "At the depth of the Depression, Rockefeller Center bet on spectacle: the largest indoor theater ever built, and still the largest today.",
    image: null,
    theaterId: "55",
    placement: "right",
  },
  {
    id: "grindhouse-era",
    year: 1970,
    title: "42nd Street Turns Grindhouse",
    text: "As downtown exhibition declined, many of Times Square's grand houses were reprogrammed for exploitation, horror and kung-fu triple features running around the clock.",
    image: null,
    theaterId: null,
    coordinates: [-73.989, 40.7563],
    placement: "left",
  },
  {
    id: "repertory-counterculture",
    year: 1970,
    title: "Repertory Cinema's Counterculture",
    text: "Film Forum opened as a folding-chair screening room the same era, part of a wave of nonprofit and repertory houses built around film as art rather than spectacle. It's still running today, after a 2018 renovation.",
    image: null,
    theaterId: "5957",
    placement: "bottom",
  },
  {
    id: "wonder-theatres-go-dark",
    year: 1977,
    title: "The Wonder Theatres Go Dark",
    text: "Within months of each other, Kings, Valencia and St. George all closed as single-screen cinemas — a citywide reckoning as multiplexes and suburban flight hollowed out the grand houses. Kings sat dark for decades before reopening as a performance venue in 2015.",
    image: null,
    theaterId: "1360",
    placement: "left",
  },
  {
    id: "times-square-cleanup",
    year: 1995,
    title: "Times Square Redevelopment",
    text: "A city- and state-led redevelopment push closed most of 42nd Street's remaining grindhouses, clearing the way for chain retail and Broadway restoration.",
    image: null,
    theaterId: null,
    coordinates: [-73.9857, 40.7566],
    placement: "top",
  },
  {
    id: "multiplex-returns-uptown",
    year: 2000,
    title: "Multiplexes Return Uptown",
    text: "AMC's nine-screen Harlem multiplex opened as part of a broader investment push into neighborhoods that had gone without a commercial movie theater for two decades or more.",
    image: null,
    theaterId: "24816",
    placement: "right",
  },
  {
    id: "pandemic-shutdown",
    year: 2020,
    title: "The Pandemic Shutdown",
    text: "In March 2020, every movie theater in New York City closed at once — the first citywide exhibition blackout since the format began in 1896.",
    image: null,
    theaterId: null,
    coordinates: [-73.9857, 40.758],
    placement: "top",
  },
];
