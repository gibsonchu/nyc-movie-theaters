import { PersonalIntro } from "./intro/PersonalIntro";
import { ScrollDrivenMap } from "./hook/ScrollDrivenMap";
import { StoryboardSection } from "./storyboard/StoryboardSection";
import { ClosedGallerySection } from "./gallery/ClosedGallerySection";
import { LegacySection } from "./legacy/LegacySection";
import { SurvivesTodaySection } from "./gallery/SurvivesTodaySection";
import { ZoningTeaserSection } from "./zoning/ZoningTeaserSection";
import { ExploreSection } from "./explore/ExploreSection";
import { ClosingSection } from "./closing/ClosingSection";
import styles from "./StorySections.module.css";

export function StorySections() {
  return (
    <main className={styles.story}>
      <PersonalIntro />
      <ScrollDrivenMap />
      <StoryboardSection />
      <ClosedGallerySection />
      <LegacySection />
      <SurvivesTodaySection />
      <ZoningTeaserSection />
      <ExploreSection />
      <ClosingSection />
    </main>
  );
}
