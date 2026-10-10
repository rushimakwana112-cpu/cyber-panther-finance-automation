import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { DataCleaning } from "./sections/DataCleaning";
import { FeaturedService } from "./sections/FeaturedService";
import { Hero } from "./sections/Hero";
import { Portfolio } from "./sections/Portfolio";
import { Strengths } from "./sections/Strengths";
import { Workflow } from "./sections/Workflow";

export function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Strengths />
        <Workflow />
        <DataCleaning />
        <FeaturedService />
        <Portfolio />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
