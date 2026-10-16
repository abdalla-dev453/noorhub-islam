import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "./context/AuthContext";
import { ProgressProvider } from "./context/ProgressContext";
import { MemoryRouter } from "react-router-dom";
import AppShell from "./components/AppShell";

import Home from "./pages/Home";
import Quran from "./pages/Quran";
import Prayer from "./pages/Prayer";
import Hifz from "./pages/Hifz";
import Practice from "./pages/Practice";
import Hadith from "./pages/Hadith";
import Learn from "./pages/Learn";
import Library from "./pages/Library";
import Zakat from "./pages/Zakat";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Ramadan from "./pages/Ramadan";
import Hajj from "./pages/Hajj";
import Halal from "./pages/Halal";
import Kids from "./pages/Kids";
import Community from "./pages/Community";
import Articles from "./pages/Articles";

const PAGES = [
  ["/", Home],
  ["/quran", Quran],
  ["/prayer", Prayer],
  ["/hifz", Hifz],
  ["/practice", Practice],
  ["/hadith", Hadith],
  ["/learn", Learn],
  ["/library", Library],
  ["/zakat", Zakat],
  ["/search", Search],
  ["/settings", Settings],
  ["/login", Login],
  ["/register", Register],
  ["/about", About],
  ["/ramadan", Ramadan],
  ["/hajj", Hajj],
  ["/halal", Halal],
  ["/kids", Kids],
  ["/community", Community],
  ["/articles", Articles],
];

function render(Page, path) {
  return renderToString(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <ProgressProvider>
          <Page />
        </ProgressProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("every route renders", () => {
  PAGES.forEach(([path, Page]) => {
    it(`renders ${path}`, () => {
      const html = render(Page, path);
      expect(html.length).toBeGreaterThan(500);
    });
  });

  it("renders the full app shell around a page", () => {
    const html = renderToString(
      <MemoryRouter>
        <AuthProvider>
          <ProgressProvider>
            <AppShell>
              <p>Child content</p>
            </AppShell>
          </ProgressProvider>
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(html).toContain("NoorHub");
    expect(html).toContain("Child content");
  });
});
