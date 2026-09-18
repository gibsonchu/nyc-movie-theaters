import section from "@/components/story/section.module.css";
import styles from "./RepurposedChart.module.css";

// Hand-researched, not derived from the geocoder audit in theater-stats.ts —
// see LegacySection's lede for the count of theaters with no documented use.
const CLOSED_THEATER_CURRENT_USES = [
  { category: "Retail / commercial shop", count: 164 },
  { category: "Religious use", count: 92 },
  { category: "Mixed use", count: 51 },
  { category: "Food, drink, nightlife or events", count: 35 },
  { category: "Storage, industrial or automotive", count: 20 },
  { category: "Health or fitness", count: 18 },
  { category: "Education, childcare or community use", count: 17 },
  { category: "Office or professional services", count: 12 },
  { category: "Residential or hotel", count: 10 },
  { category: "Parking or other infrastructure", count: 1 },
];

const DOCUMENTED_TOTAL = 420;
const UNDOCUMENTED_COUNT = 131;

export function RepurposedChart() {
  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Current building use</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {CLOSED_THEATER_CURRENT_USES.map((c) => (
            <tr key={c.category}>
              <td className={styles.category}>{c.category}</td>
              <td className={styles.count}>{c.count}</td>
            </tr>
          ))}
          <tr className={styles.totalRow}>
            <td className={styles.category}>Total with documented alternative use</td>
            <td className={styles.count}>{DOCUMENTED_TOTAL}</td>
          </tr>
        </tbody>
      </table>
      <p className={`${section.caption} ${section.fullWidth}`}>
        Another {UNDOCUMENTED_COUNT} closed theaters don&rsquo;t have a documented alternative use.
      </p>
    </>
  );
}
