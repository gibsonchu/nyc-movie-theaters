import { useMemo } from "react";
import { theaters } from "@/data/theaters";
import { currentPlaceCategoryCounts, formerTheaters } from "@/lib/theater-stats";
import { LifespanHistogram } from "./LifespanHistogram";
import { RepurposedChart } from "./RepurposedChart";
import section from "@/components/story/section.module.css";

export function LegacySection() {
  const citeableCount = useMemo(
    () => currentPlaceCategoryCounts(formerTheaters(theaters)).reduce((sum, c) => sum + c.count, 0),
    []
  );

  return (
    <>
      <section className={section.section} id="how-long-they-lasted">
        <div className={section.inner}>
          <p className={section.articleText}>
            Most movie theaters had a good run, with many of them lasting between twenty to forty years.
          </p>
          <p className={section.articleText}>
            One may consider the LeFrak theater at the American Museum of Natural History to be the oldest, as
            it&rsquo;s been showing films in its auditorium for over 137 years, although it was originally built as
            a lecture hall back in 1889. The distinction of the city&rsquo;s oldest surviving purpose-built movie
            theater still in operation belongs to Brooklyn&rsquo;s Alpine Cinema, which opened as a 2,200-seat
            Loew&rsquo;s theater in 1921 and has been showing movies for more than a century.
          </p>
        </div>
        <div className={section.wide}>
          <LifespanHistogram />
          <p className={`${section.caption} ${section.fullWidth}`}>
            This chart excludes theaters confirmed closed with no recorded closing year, and a handful with a
            same-year open/close (measured in whole years from the source data, so a theater that opened and closed
            within one calendar year shows near zero rather than a true zero).
          </p>
        </div>
      </section>

      <section className={section.section} id="what-replaced-them">
        <div className={section.inner}>
          <p className={section.lede}>
            For those that closed, a number of them were turned into other useful places for the city. Based on a
            geocoding audit of their former addresses, {citeableCount.toLocaleString()} closed theaters had a
            citeable present-day occupant worth naming; most others are now just an ordinary building &mdash; that
            is, whatever stands there today wasn&rsquo;t tagged with anything distinctive enough for the geocoder to
            single out, so we can&rsquo;t say from this data alone whether it&rsquo;s residential, office, or
            something else entirely.
          </p>
        </div>
        <div className={section.wide}>
          <RepurposedChart />
        </div>
      </section>
    </>
  );
}
