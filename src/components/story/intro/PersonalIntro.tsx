import styles from "./PersonalIntro.module.css";

export function PersonalIntro() {
  return (
    <div className={styles.wrap}>
      <blockquote className={styles.quote}>
        <p>
          One of my favorite pastimes in NYC is to catch a film at the movie theater. When I had more free time a
          couple of years ago, I made it my mission to see as many movies as I could in as many different theaters
          across the city.
        </p>
        <p>
          It was absolutely thrilling to be fully engrossed with the crowd, all laughing or crying at what was
          happening on the silver screen, often elevating the movie entirely. The guttural gasp everyone had when
          watching <em>Saltburn</em> is still seared in my mind.
        </p>
        <p>
          As Nicole Kidman says, it&rsquo;s &ldquo;that indescribable feeling we get &hellip; and we go somewhere
          we&rsquo;ve never been before &hellip; somehow reborn. Together.&rdquo;
        </p>
        <p>
          This past year has been incredible for movies, with a rise of ticket sales and movie goers, spurred by so
          many cultural factors including the popularity of{" "}
          <a href="https://letterboxd.com/gibsonchu/" target="_blank" rel="noreferrer">
            Letterboxd
          </a>
          , the star-studded movies and casts of this year (<em>The Odyssey</em> and{" "}
          <em>Spiderman: Brand New Day</em> alone have broken over $3B at the box office worldwide), and the cry for
          more shared spaces to hang out with friends in real life over online social media.
        </p>
        <p>
          I recently got a chance to eat at Phoenix Palace, a new restaurant that took design inspiration from Music
          Palace, Chinatown&rsquo;s last remaining movie theater, installing a ticketing booth out front. Music
          Palace closed in 2000, replaced by a chain hotel. I chatted with one of the hosts and co-owners of the
          space, and he mentioned coming to this theater a lot as a kid, a cultural institution, and he was sad to
          see it go.
        </p>
        <p>
          <a
            href="https://gothamist.com/news/kips-bay-neighbors-rally-to-save-beloved-movie-theater-from-closure"
            target="_blank"
            rel="noreferrer"
          >
            AMC Kips Bay also announced that they would be closing
          </a>{" "}
          at the end of 2026. For me, this theater was always a bit out of the way &mdash; I used to live on the UWS
          and now down in Fort Greene &mdash; but I could always count on grabbing a last minute spot there for films
          nearing the end of their run in the theaters. Community members are trying to rally and save the screens,
          and it will be sad to see it also go.
        </p>
        <p>
          Both of these incidents inspired me to take a look at researching how many movie theaters there currently
          were in the city and how many closed over the years.
        </p>
      </blockquote>
    </div>
  );
}
