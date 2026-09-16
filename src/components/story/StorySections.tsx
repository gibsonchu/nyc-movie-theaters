import { DisappearanceSection } from "./disappearance/DisappearanceSection";
import { LifespanSection } from "./lifespan/LifespanSection";
import { ProfilesSection } from "./profiles/ProfilesSection";
import { TodaySection } from "./today/TodaySection";
import styles from "./StorySections.module.css";

export function StorySections() {
  return (
    <main className={styles.story}>
      <DisappearanceSection />
      <LifespanSection />
      <ProfilesSection />
      <TodaySection />
    </main>
  );
}
