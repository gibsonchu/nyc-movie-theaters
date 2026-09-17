import { LifespanHistogram } from "./LifespanHistogram";
import { RepurposedChart } from "./RepurposedChart";
import section from "@/components/story/section.module.css";

export function LegacySection() {
  return (
    <>
      <section className={section.section} id="how-long-they-lasted" style={{ paddingTop: 24 }}>
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
        <div className={section.wide} style={{ marginTop: 32 }}>
          <LifespanHistogram />
          <p className={`${section.caption} ${section.fullWidth}`}>
            This chart excludes theaters confirmed closed with no recorded closing year, and a handful with a
            same-year open/close (measured in whole years from the source data, so a theater that opened and closed
            within one calendar year shows near zero rather than a true zero).
          </p>
        </div>
      </section>

      <section className={section.section} id="what-replaced-them" style={{ paddingTop: 12, paddingBottom: 16 }}>
        <div className={section.inner}>
          <p className={section.lede}>
            For the theaters that closed, a majority of them were turned into amenity or shops, with most as regular
            buildings for residential or office use.
          </p>
        </div>
        <div className={section.wide}>
          <RepurposedChart />
        </div>
      </section>
    </>
  );
}
