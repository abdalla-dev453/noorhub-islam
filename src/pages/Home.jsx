import React from "react";
import { StarField, Divider } from "../components/ui/Primitives";
import Hero from "../components/Hero";
import StatsStrip from "../components/StatsStrip";
import Benefits from "../components/Benefits";
import QuranShowcase from "../components/QuranShowcase";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";

const scrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const Home = () => {
  return (
    <div className="home-page">
      <StarField />
      <main className="home-content">
        <Hero scrollTo={scrollTo} />
        <Divider />
        <StatsStrip />
        <Divider />
        <Benefits />
        <Divider />
        <QuranShowcase />
        <Divider />
        <Testimonials />
        <Divider />
        <CTASection scrollTo={scrollTo} />
      </main>
    </div>
  );
};

export default Home;
