
# NoorHub

A frontend web platform for the Muslim community, built with React and 
Tailwind CSS using a modular, feature-based architecture.

## Overview

NoorHub was built with scalability in mind — rather than a flat component 
structure, the codebase is organized by feature, keeping related components, 
logic, and styles together. This makes the app easier to extend and 
maintain as new features are added.

## Features

- 🕌 [Add your platform's actual features here — e.g. prayer times, 
  Quran resources, community content]
- 🧩 Modular, feature-based folder structure
- 🎨 Styled with Tailwind CSS
- ⚛️ Built entirely with React

## Tech Stack

**Frontend:** React, Tailwind CSS  
**Architecture:** Feature-based modular structure
##  Features Matrix

- ** Interactive Quran Hub**: Complete Surah index streaming authentic English translations in parallel with classical Arabic text.
- ** Continuous Audio Streaming**: Seamless autoplay flow between verses alongside an on-the-fly Qari/reciter selection engine.
- ** Hadith Encyclopedia**: Cursor-paginated batch loading for large text collections to optimize browser memory and ensure fluid scrolling.
- ** Persistent Academy Dashboard**: Comprehensive theological learning tracks utilizing React Context bound to browser local storage. Your progress stays safe across refreshes.
- ** Adaptive Theme Architecture**: Native Tailwind CSS variables powering immersive dark mode environments by default, with optimized reading viewports for daylight.

---

##  Mental Model Folder Structure

The application separates state routing layers, dynamic presentation layouts, global data aggregates, and utility data fetchers following strict atomic React design guidelines:

```text
src/
├── components/         # Global layout structures
│   └── ui/
│       ├── Navbar.jsx  # Interactive header containing theme state managers
│       ├── Footer.jsx  # Permanent copyright component baseline
│       └── TrackCard.jsx # Accordion syllabi rendering panel
├── context/            # Global storage engine providers
│   └── ProgressContext.jsx # LocalStorage persistence hooks
├── data/               # Fixed constant strings
│   └── constants.js    # Global mapping configurations
├── pages/              # Isolated operational route view modules
│   ├── About.jsx       # Project open-source manifesto layout
│   ├── Hadith.jsx      # Lazy-loaded text engine
│   ├── Home.jsx        # Landing hero interface
│   ├── Learn.jsx       # Academic filtered overview cards
│   ├── Login.jsx       # Theme-adaptive profile portal
│   ├── Quran.jsx       # Multi-edition popup modal player
│   └── Register.jsx    # Structural account validation portal
├── styles/             # Application visual sheets
│   └── globals.css     # Tailored variable overrides & Islamic grid meshes
├── utils/              # Network state fetch interceptors
│   └── api.js          # Normalized endpoints wrapping AbortControllers
├── App.jsx             # layout wrapper and router registry
└── main.jsx            # Dynamic VDOM entry node mount script
```

---

##  Technology Ecosystem

- **Framework Core**: [React](https://react.dev) (Functional components with custom Hooks)
- **Styling Layer**: [Tailwind CSS](https://tailwindcss.com) (Class-based variables & native light/dark toggle configurations)
- **Routing Engine**: [React Router DOM](https://reactrouter.com) (Client-side decoupled layout mappings)
- **Data Gateways**: Official Alquran Cloud API & FawazAhmed Open-source Hadith API pipelines

---

##  Local Deployment Blueprint

### Production API URL

The deployed frontend uses `https://noorhub-islam.onrender.com` as its API URL.
Set `VITE_API_BASE` in the frontend hosting environment only when overriding that
URL; the variable is embedded at build time. Local development uses
`http://localhost:5000` when it is not set.

Follow these steps to deploy a local development server instance onto your workspace:

### 1. Clone the Source Manifest
```bash
git clone https://github.com
cd noorhub
```

### 2. Provision Dependencies Layers
```bash
npm install
```

### 3. Verify Local Configurations
Ensure your root environment file structures mimic the default properties layout and that your Tailwind engine configuration scanning pointers are intact:
```javascript
// tailwind.config.js
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
}
```

### 4. Execute Compiler Server Pipelines
```bash
npm run dev
```
Open your web browser node to `http://localhost:5173/` to run your environment.

---

##  Open-Source Principles & Vetting Rules

NoorHub is built as a distraction-free repository. The codebase relies entirely on client-side state processing, completely removing heavy corporate analytics trackers, cookie walls, or embedded advertisement streams. Text distributions conform strictly to academic standard indices to ensure integrity.

---

## Contribution Stream

Contributions are welcome! If you find typographical errors in normalization mapping wrappers, layout bugs on responsive viewports, or want to expand reciter arrays, feel free to open a Pull Request.

1. Fork the Project Repository
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Snapshot Changes (`git commit -m 'feat: add amazing capability'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request manifest block
