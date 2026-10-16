import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import { AuthProvider } from "./context/AuthContext";
import { ProgressProvider } from "./context/ProgressContext";

const Home = lazy(() => import("./pages/Home"));
const Quran = lazy(() => import("./pages/Quran"));
const Hadith = lazy(() => import("./pages/Hadith"));
const Learn = lazy(() => import("./pages/Learn"));
const Library = lazy(() => import("./pages/Library"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Prayer = lazy(() => import("./pages/Prayer"));
const Practice = lazy(() => import("./pages/Practice"));
const Hifz = lazy(() => import("./pages/Hifz"));
const Zakat = lazy(() => import("./pages/Zakat"));
const Search = lazy(() => import("./pages/Search"));
const Settings = lazy(() => import("./pages/Settings"));
const Ramadan = lazy(() => import("./pages/Ramadan"));
const Hajj = lazy(() => import("./pages/Hajj"));
const Halal = lazy(() => import("./pages/Halal"));
const Kids = lazy(() => import("./pages/Kids"));
const Community = lazy(() => import("./pages/Community"));
const Articles = lazy(() => import("./pages/Articles"));

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Router>
          <AppShell>
            <Suspense
              fallback={
                <div className="page-loader" role="status">
                  Loading…
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quran" element={<Quran />} />
                <Route path="/hadith" element={<Hadith />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/library" element={<Library />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/prayer" element={<Prayer />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/hifz" element={<Hifz />} />
                <Route path="/zakat" element={<Zakat />} />
                <Route path="/search" element={<Search />} />
                 <Route path="/settings" element={<Settings />} />
                 <Route path="/ramadan" element={<Ramadan />} />
                 <Route path="/hajj" element={<Hajj />} />
                 <Route path="/halal" element={<Halal />} />
                 <Route path="/kids" element={<Kids />} />
                 <Route path="/community" element={<Community />} />
                 <Route path="/articles" element={<Articles />} />
               </Routes>
            </Suspense>
          </AppShell>
        </Router>
      </ProgressProvider>
    </AuthProvider>
  );
}
