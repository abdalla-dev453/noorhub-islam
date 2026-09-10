import { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { ProgressProvider } from "./context/ProgressContext";

const Home = lazy(() => import("./pages/Home"));
const Quran = lazy(() => import("./pages/Quran"));
const Hadith = lazy(() => import("./pages/Hadith"));
const Learn = lazy(() => import("./pages/Learn"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Router>
          <div className="app-root-layout text-[var(--text-primary)] min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
              <Suspense
                fallback={
                  <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--text-muted)]">
                    Loading…
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/quran" element={<Quran />} />
                  <Route path="/hadith" element={<Hadith />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
          </div>
        </Router>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
