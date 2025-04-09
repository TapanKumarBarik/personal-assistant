import React from "react";
import Hero from "./Hero";
import About from "./About";
import Portfolio from "./Portfolio";
import Contact from "./Contact";

const LandingPage = () => {
  return (
    <main className="landing-page">
      <Hero />
      <About />
      <Portfolio />
      <Contact />
    </main>
  );
};

export default LandingPage;
