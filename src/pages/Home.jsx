import Benefits from "../components/Benefits";
import CTASection from "../components/CTASection";
import Hero from "../components/Hero";
import QuranShowcase from "../components/QuranShowcase";
import StatsStrip from "../components/StatsStrip";
import Testimonials from "../components/Testimonials";
import { Divider } from "../components/ui/Primitives";

const scrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export default function Home() {
  return (
    <div className="space-y-4">
      <Hero scrollTo={scrollTo} />
      <StatsStrip />
      <Benefits />
      <Divider />
      <QuranShowcase />
      <Divider />
      <Testimonials />
      <CTASection scrollTo={scrollTo} />
    </div>
  );
}
