import { theaters } from "@/data/theaters";

export interface GalleryItem {
  name: string;
  years: string;
  description: string;
  image: string | null;
  /** Set when this entry isn't cleanly represented in the source CSV — see the note for why. */
  dataNote?: string;
}

function findById(id: string) {
  const t = theaters.find((x) => x.id === id);
  if (!t) throw new Error(`Gallery theater id ${id} not found in dataset`);
  return t;
}

// A few named theaters have source-data problems this curation corrects by
// hand, with a visible note rather than silently overriding:
//  - Roxy Theatre (id 556): the CSV's closing_year (2022) is a "most recent
//    stated closing year retained" artifact, contradicted by well-documented
//    film history — the Roxy was demolished in 1960. Corrected here.
//  - "Astor Plaza": the only CSV record matching that name/alias tracks the
//    building's 2005-on incarnation as a live-event venue (Nokia Theatre,
//    Playstation Theater...), not the 1972-97 Loews Astor Plaza movie era
//    the name usually refers to. That era isn't in the dataset at all, so
//    this entry is filled in from public record and flagged.
//  - Paris Theatre: not in the CSV at all. Filled in from public record.
//  - Ziegfeld Theatre: the CSV (and public record) both show it closed
//    permanently in 2016 — it doesn't belong in a "still showing movies"
//    gallery, so it's omitted rather than force-fit.

export const CLOSED_THEATERS_GALLERY: GalleryItem[] = [
  {
    name: "Roxy Theatre",
    years: "1927–1960",
    description:
      "Once billed as the “Cathedral of the Motion Picture” and, at 5,920 seats, the largest movie theater in the world. Demolished in 1960 for an office tower.",
    image: findById("556").image,
    dataNote: "Source CSV lists a closing year of 2022 for this record, which conflicts with the documented 1960 demolition — corrected here.",
  },
  {
    name: "Loew's State Theatre",
    years: "1921–2006",
    description: "Marcus Loew's flagship Times Square house, later subdivided into a twin before finally closing.",
    image: findById("557").image,
  },
  {
    name: "Loews Astor Plaza",
    years: "1972–1997",
    description:
      "A single-screen giant beneath the W.R. Grace Building on 44th Street. Closed as a cinema in the late 1990s and later gutted for a live-event venue (Nokia Theatre, then Playstation Theater).",
    image: null,
    dataNote: "Not accurately represented in the source CSV — the matching record there tracks only the post-2005 live-venue era. Filled in from public record.",
  },
  {
    name: "Astor Theatre",
    years: "1906–1972",
    description: "A Times Square movie palace at Broadway and 45th Street, one of the district's earliest.",
    image: findById("518").image,
  },
  {
    name: "Sunshine Cinema",
    years: "2001–2018",
    description:
      "The building opened in 1916 as a Yiddish vaudeville house and later served as a church for decades before Landmark reopened it as a five-screen art-house cinema in 2001.",
    image: findById("1907").image,
  },
  {
    name: "Lincoln Plaza Cinemas",
    years: "1981–2018",
    description: "An Upper West Side arthouse mainstay for foreign and independent film for nearly four decades.",
    image: findById("7838").image,
  },
];

export const SURVIVING_THEATERS_GALLERY: GalleryItem[] = [
  {
    name: "United Palace",
    years: "1930–present",
    description: "The last and largest of Loew's five “Wonder Theatres,” now a Washington Heights arts and event space.",
    image: findById("44").image,
  },
  {
    name: "Kings Theatre",
    years: "1929–present",
    description: "A Flatbush Avenue Wonder Theatre, dark for decades before a 2015 restoration brought it back as a concert and event venue.",
    image: findById("1360").image,
  },
  {
    name: "Paris Theatre",
    years: "1948–present",
    description: "A single-screen house behind the Plaza Hotel that closed in 2019 and was revived within weeks by Netflix.",
    image: null,
    dataNote: "Not in the source CSV at all. Filled in from public record.",
  },
  {
    name: "Village East by Angelika",
    years: "1926–present",
    description: "A former Yiddish Art Theatre on Second Avenue, now a multiplex under its original ornate ceiling.",
    image: findById("290").image,
  },
  {
    name: "AMC Empire 25",
    years: "1912–present",
    description: "A former burlesque house on 42nd Street, moved and rebuilt as part of Times Square's 1990s redevelopment.",
    image: findById("255").image,
  },
  {
    name: "LeFrak Theater",
    years: "1900–present",
    description: "The domed IMAX theater at the American Museum of Natural History.",
    image: findById("11020").image,
  },
  {
    name: "Regal Concourse",
    years: "1991–present",
    description: "A Bronx multiplex that went dark and reopened again in 2025.",
    image: findById("43139").image,
  },
  {
    name: "Academy of Music (BAM Rose Cinemas)",
    years: "1998–present",
    description: "The Brooklyn Academy of Music's own cinemas, showing first-run independent and repertory film.",
    image: findById("7208").image,
  },
];
