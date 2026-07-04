import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout & Global Components from your ui folder
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Home = lazy(() => import("./pages/Home"));
const Quran = lazy(() => import("./pages/Quran"));
const Hadith = lazy(() => import("./pages/Hadith"));
const Learn = lazy(() => import("./pages/Learn"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
import { ProgressProvider } from "./context/ProgressContext";

function App() {
  return (
    <ProgressProvider>
      <Router>
        {/* Root Layout wrapper inherits styling directly from globals.css */}
        <div className="app-root-layout text-white min-h-screen flex flex-col justify-between selection:bg-teal-500 selection:text-black">
          {/* Navigation bar present across all views */}
          <Navbar />

          {/* Dynamic Inner views container */}
          <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
            <Suspense
              fallback={
                <div className="flex min-h-[40vh] items-center justify-center text-sm font-mono text-slate-400">
                  Loading page...
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

          {/* Global Footer element */}
          <Footer />
        </div>
      </Router>
    </ProgressProvider>
  );
}

export default App;
