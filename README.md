# A Universe Made Just For You ✨ — Sameeksha's 3D Birthday Universe

An interactive, responsive 3D birthday experience created specially for **Sameeksha** (23 November 2026).

## 🌟 Live Website
- **Live URL**: [https://harshitm1-a11y.github.io/Birthday-2026/](https://harshitm1-a11y.github.io/Birthday-2026/)
- **Mirror**: [https://sameeksha-birthday.embarko.app](https://sameeksha-birthday.embarko.app)

---

## 🚀 Key Features

### 🌌 7 Connected Interactive 3D Scenes
1. **Galaxy Welcome**:
   - 3D procedural starfield with rotating celestial glowing heart and stardust particles.
   - Cinematic entry into the universe.
   - Hidden Heart collectible #1.

2. **The Magical Gift**:
   - 3D gift box with interactive drag-to-rotate OrbitControls.
   - Ribbon & lid opening animation with particle bursts and golden sparkles.
   - Hidden Heart collectible #2.

3. **Our Little Memories (3D Cylinder & Album Grid)**:
   - **Dual-View Switcher**: Smooth toggle between **3D Floating Rotating Cylinder** and **Responsive Photo Album Grid**.
   - Curated memory gallery featuring 49 authentic memories in floating polaroid styling.
   - Tap-to-expand high-resolution photo modal with zoom and smooth transitions.
   - Hidden Heart collectible #3.

4. **Your Little Companion (Voiced 3D Mascot)**:
   - Original 3D robot/mascot with procedural idle floating bob and bounce animations.
   - Interactive speech bubble with emotional Hinglish dialogues addressed to "Sameeksha baby".
   - Browser Web Speech API text-to-speech with natural Indian Hindi voice cadence.
   - Hidden Heart collectible #4.

5. **Make a Wish (Birthday Cake)**:
   - 2-tier 3D birthday cake with glowing "SAMEEKSHA" plaque.
   - 5 realistic flickering candle flames with dynamic point lights.
   - Interactive "Blow the Candles" button extinguishing flames with celebratory acoustic party poppers & fireworks.

6. **A Letter From The Heart**:
   - Elegant glowing parchment letter with real typewriter animation and blinking cursor.
   - Deeply romantic Hindi poetry & heartfelt letter (*"Tere aane se zindagi me aisi bahaar aayi hai..."*).
   - Instant "Skip Typing" option and fully accessible typography.

7. **Grand Finale & Realistic Party Poppers**:
   - Realistic canvas-driven 3D metallic foil party poppers with acoustic pop sound effect.
   - **Grand Unfurling Banner**: Interactive party popper that bursts and unfurls a glowing 3D celebratory banner:
     > `"🎉 HAPPY BIRTHDAY SAMEEKSHA BABY 💖"`
   - **Compliment Garden**: 6 interactive blooming flowers (🌸, 🌺, 🌻, 🌷, 🌹, 💐) revealing personalized poetic compliments.
   - Hidden Heart collectible #5: Unlocks the **Secret Message Modal** when all 5 hearts are collected!

---

## 🎵 Music & Audio
- **Bollywood Theme Song**: Mohammed Rafi's classic *"Baar Baar Din Ye Aaye (Happy Birthday To You)"*.
- **Vinyl Record Toggle**: Opt-in rotating vinyl badge with volume ramp, mute/unmute, and toast notifications.
- **Acoustic Sound Effects**: Web Audio API synthesized realistic party popper pops and chime sounds.

---

## 🛠 Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations**: Framer Motion, GSAP, Canvas 2D Physics Confetti
- **State Management**: Zustand
- **Audio & Speech**: HTML5 Audio, Web Audio API, Web Speech API
- **Deployment**: GitHub Pages

---

## 💻 Local Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/harshitm1-a11y/Birthday-2026.git
cd Birthday-2026
npm install
```

Start local development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

---

## 📂 Project Structure

```
Birthday-2026/
├── .github/workflows/         # Automated GitHub Pages CI/CD workflow
├── assets/                    # Compiled production assets
├── audio/                     # Bollywood birthday audio
├── images/                    # Memory photographs
├── sameeksha-birthday/        # Main React + Vite + Three.js application
│   ├── public/                # Static assets (images, audio, icons)
│   ├── src/
│   │   ├── components/        # UI components (Popper, Celebration, AudioToggle, etc.)
│   │   ├── content/           # Site content, dialogues, and shayari
│   │   ├── scenes/            # 7 Interactive 3D scenes
│   │   ├── state/             # Zustand state management
│   │   ├── styles/            # CSS styling
│   │   └── utils/             # Audio, Speech, and Asset utilities
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── scripts/                   # Production build sync script
├── .gitignore
├── .nojekyll                  # Bypasses Jekyll for GitHub Pages
├── 404.html                   # SPA router fallback for GitHub Pages
├── index.html                 # Production entry point
├── package.json               # Root workspace scripts
└── README.md
```
