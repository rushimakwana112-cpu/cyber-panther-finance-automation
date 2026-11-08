import { useEffect, useRef } from "react";
import { Footer } from "./components/Footer";
import { LockCursor } from "./components/LockCursor";
import { Header } from "./components/Header";
import { pageTitles } from "./content/site";
import { useRoute, type Route } from "./lib/route";
import { About } from "./pages/About";
import { AiLab } from "./pages/AiLab";
import { Home } from "./pages/Home";
import { Personal, SecurityApproach, Technology } from "./pages/OtherPages";
import { Projects } from "./pages/Projects";
import { Tools } from "./pages/Tools";
import { AskPanther } from "./sections/AskPanther";
import { Contact } from "./sections/Contact";

function View({ route }: { route: Route }) {
  switch (route.page) {
    case "about":
      return <About />;
    case "projects":
      return <Projects id={route.param} />;
    case "tools":
      return <Tools demo={route.param} />;
    case "ai-lab":
      return <AiLab />;
    case "technology":
      return <Technology />;
    case "security":
      return <SecurityApproach />;
    case "personal":
      return <Personal />;
    case "contact":
      return <Contact path={route.param} topic={route.sub} />;
    default:
      return <Home />;
  }
}

export function App() {
  const route = useRoute();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);
  const viewKey = `${route.page}/${route.page === "projects" ? (route.param ?? "") : ""}`;

  // Each view starts at the top, and focus moves for keyboard and screen-reader users.
  useEffect(() => {
    document.title = route.page === "home" ? `Rushi Makwana | ${pageTitles.home}` : `${pageTitles[route.page]} | Rushi Makwana`;
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [viewKey, route.page]);

  return (
    <>
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <Header page={route.page} />
      <main id="main" ref={main} tabIndex={-1}>
        <div key={viewKey} className="view">
          <View route={route} />
        </div>
      </main>
      <Footer />
      <AskPanther />
      <LockCursor />
    </>
  );
}
