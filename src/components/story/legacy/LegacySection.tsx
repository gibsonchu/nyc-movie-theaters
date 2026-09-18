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
        <div className={section.inner} style={{ marginTop: 32 }}>
          <p className={section.articleText}>
            A movie theater is one of the great businesses that give people a reason to visit a neighborhood. A 2023
            study commissioned by the British Film Institute found that 55% of moviegoers typically ate or drank
            somewhere else as part of a trip to the cinema, while 53% also went shopping, bringing some life to a
            local neighborhood.<sup>1</sup>
          </p>
          <p className={section.articleText}>
            Nearly two-thirds of moviegoers surveyed also said their cinema contributed to their sense of pride in
            the area where they lived, with mainstay cinema hubs increasing that up to 70%.
          </p>
          <p className={section.articleText}>
            Researchers estimated that these venues generated at least £600,000 in additional social value per
            cinema each year, beyond the money generated through tickets, concessions, memberships, and other
            sales.<sup>1</sup>
          </p>
          <p className={section.articleText}>
            Other research also points to the same role for cinemas as community spaces. A study of local cinemas
            and multi-arts venues in Scotland found that 85% of respondents considered their cinema a focal point
            for the community, 95% described it as a safe and trusted place, and 81% considered it important for
            young people growing up in the area. More than half said attending made them feel less lonely or
            isolated.<sup>2</sup>
          </p>
          <p className={section.articleText}>
            Now while these studies weren&rsquo;t conducted in NYC, this helps to illustrate what can affect a local
            neighborhood when a movie theater goes away, losing a destination that can bring foot traffic to the
            street, customers to nearby businesses, and provide a natural place for residents to meet up.
          </p>
          <ol className={section.footnotes}>
            <li>
              British Film Institute and Creative Industries Policy and Evidence Centre,{" "}
              <a
                href="https://www.bfi.org.uk/industry-data-insights/reports/measuring-economic-value-cinema-venues"
                target="_blank"
                rel="noreferrer"
              >
                <em>Measuring the Economic Value of Cinema Venues</em>
              </a>{" "}
              (2023).
            </li>
            <li>
              Regional Screen Scotland, <em>The Economic and Social Value of Local Cinema</em> (2016).
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
