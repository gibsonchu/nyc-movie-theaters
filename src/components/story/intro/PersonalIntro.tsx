import styles from "./PersonalIntro.module.css";

export function PersonalIntro() {
  return (
    <div className={styles.wrap}>
      <blockquote className={styles.quote}>
        <p>
          One of my favorite pastimes in NYC is to catch a film at the movie theater. A few years ago, when I had
          more free time, I saw as many movies as I could in as many theaters across the city as I could.
        </p>
        <p>
          There&rsquo;s nothing like being fully engrossed with a crowd of people, all laughing at the same thing,
          bleeding into this rambunctious and infectious fever dream, or hearing a collective release of tension
          when the air is let out.
        </p>
        <p>
          As Nicole Kidman says, it&rsquo;s &ldquo;that indescribable feeling we get &hellip; and we go somewhere
          we&rsquo;ve never been before &hellip; somehow reborn. Together.&rdquo;
        </p>
        <p>
          This past year has been no different, with a rise of ticket sales and movie goers, spurred by so many
          cultural factors including the popularity of Letterboxd (feel free to{" "}
          <a href="https://letterboxd.com/gibsonchu/" target="_blank" rel="noreferrer">
            follow me
          </a>
          ), the star-studded movies and casts of this year (<em>The Odyssey</em> and{" "}
          <em>Spiderman: Brand New Day</em> alone have broken over $3B at the box office worldwide), and the cry for
          more shared spaces to hang out with friends in real life over online digital and AI websites.
        </p>
        <p>
          Recently,{" "}
          <a
            href="https://gothamist.com/news/kips-bay-neighbors-rally-to-save-beloved-movie-theater-from-closure"
            target="_blank"
            rel="noreferrer"
          >
            AMC Kips Bay announced that they would be closing at the end of 2026
          </a>
          . There are a number of rumored reasons why, but this was a bit disheartening to hear. While for me, this
          theater was always a bit out of the way &mdash; I used to live on the UWS and now down in Fort Greene
          &mdash; I could always count on getting a spot there for films nearing the end of their run in the
          theaters.
        </p>
        <p>
          In addition, I recently got a chance to eat at Phoenix Palace, which took inspiration in its design from
          Music Palace, Chinatown&rsquo;s last remaining movie theater before closing in 2000 and was replaced by a
          chain hotel. I chatted with one of the hosts and co-owners of the space, and he mentioned coming to this
          theater a lot as a kid, a cultural institution, and he was sad to see it go.
        </p>
        <p>
          Both of these inspired me to take a look at researching how many movie theaters there currently were in
          the city and how many closed over the years.
        </p>
        <p>
          I started digging through Cinema Treasures, a treasure trove of community knowledge about movie theaters,
          to understand where in NYC theaters came and went, and what takes their place today.
        </p>
      </blockquote>
    </div>
  );
}
