# Thank You for Coming to the Movies

**Where movie theaters have come and gone across New York City**

A long-form, data-driven scrollytelling article about the history of
NYC movie theaters — from the first public film screening in 1896,
through the 1940s postwar attendance peak, to the theaters closing
today. Built as a personal essay woven through interactive charts and
two MapLibre maps: one that scrubs through 130 years of openings and
closings, and one that screens every historical theater site against
NYC's current zoning rules to see where a new theater could still be
built.

By [Gibson Chu](https://gibsonchu.com/) · [In Spaces](https://inspacesstudio.com/)

## What's in the article

- A first-person intro essay on moviegoing in NYC today
- An animated, five-borough stacked area chart of operating theaters
  over time, plus a distribution of theater lifespans
- A gallery of notable closed theaters, and what's occupying their
  buildings today
- An interactive present-day zoning map — colored by whether an
  ordinary movie theater would be permitted there under NYC's current
  zoning rules — built from the same "ZoLa" methodology as the NYC
  Department of City Planning's own map
- An interactive historical map with a year scrubber (1896–2026),
  showing every known theater site open or closed at any point in that
  range
- Research on cinemas as neighborhood/community anchors (BFI/Creative
  PEC and Regional Screen Scotland studies)

## Data

Theater records (~910 entries: name, address, years open, borough,
screens/seats, sources) are sourced primarily from
[Cinema Treasures](https://cinematreasures.org/), with hand corrections
and additions documented in code comments where the source data was
incomplete or wrong (see `src/components/story/gallery/curatedGalleries.ts`
and `src/data/theaters.ts`). Zoning geometry comes from NYC's zoning
district shapefiles, processed into GeoJSON under `src/data/zoning/` and
`public/zoning/`.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- CSS Modules for styling (no component-level Tailwind; `@tailwindcss/postcss`
  is present only for its base reset)
- [MapLibre GL JS](https://maplibre.org/) for both interactive maps
- Deployed on [Vercel](https://vercel.com/)

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Project structure

```
src/
  app/                 Next.js App Router entry (layout, page, metadata, favicon)
  components/
    layout/             Masthead
    story/               One component per scrollytelling section, composed
                          in StorySections.tsx, sharing common typographic/
                          layout classes from section.module.css
    map/                 The historical timeline map (MapCanvas) and its
                          hover/detail cards
    zoning/               The present-day zoning-screening map
    detail/               Click-to-open info cards for both maps
    timeline/             The year-scrubber UI
  data/                 Theater records and zoning datasets
  lib/                  Stats/derivation helpers the article's prose cites
  state/                TimelineContext (year, playback, selection state)
```

## Deployment

Auto-deploys to Vercel on push to `main`.
