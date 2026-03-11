import React from 'react';

function Home() {
  return (
    <section className="home-page">
      <div className="homeContent">
        <p className="eyebrow">Cricket Insights</p>
        <h1>Welcome to Cricket Hub</h1>
        <p>
          Explore player trends and compare performances quickly. Start with the
          comparison page to evaluate two players side by side.
        </p>
      </div>

      <div className="hero-card" role="img" aria-label="Cricket bat and ball on grass">
        <div className="hero-overlay">
          <h2>Cricket Stats Dashboard</h2>
          <p>
            Dive into the world of cricket analytics with our comprehensive player comparison tool. 
            Analyze batting statistics, strike rates, centuries, and more. Make data-driven insights 
            by comparing your favorite players side-by-side.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Home;

