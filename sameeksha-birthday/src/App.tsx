import React, { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LoadingScreen,
  SceneNavigation,
  MusicPlaylist,
  RoamingCompanion,
  FloralBloomTransition,
} from './components';
import { useExperienceStore } from './state/experienceStore';
import { soundManager } from './utils/audio';

import GalaxyScene from './scenes/GalaxyScene';
import GiftScene from './scenes/GiftScene';
import MemoriesScene from './scenes/MemoriesScene';
import CakeScene from './scenes/CakeScene';
import LetterScene from './scenes/LetterScene';
import FinaleScene from './scenes/FinaleScene';
import HappyEndingScene from './scenes/HappyEndingScene';

import './styles/global.css';

const scenes = [
  GalaxyScene,
  GiftScene,
  MemoriesScene,
  CakeScene,
  LetterScene,
  FinaleScene,
  HappyEndingScene,
];

export default function App() {
  const [loaded, setLoaded] = React.useState(false);
  const currentScene = useExperienceStore((s) => s.currentScene);
  const [isBloomTransitioning, setIsBloomTransitioning] = React.useState(false);
  const prevSceneRef = React.useRef(currentScene);

  useEffect(() => {
    if (prevSceneRef.current !== currentScene) {
      prevSceneRef.current = currentScene;
      setIsBloomTransitioning(true);
      const timer = setTimeout(() => {
        setIsBloomTransitioning(false);
      }, 950);
      return () => clearTimeout(timer);
    }
  }, [currentScene]);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
    soundManager.initCtx();
    soundManager.playTrack('hindi-tum-hi-ho');
    soundManager.startAmbient();
  }, []);

  // Browser Autoplay Fallback Unlocker:
  // Guarantees audio starts immediately without getting blocked by browser autoplay policies
  useEffect(() => {
    const unlockAudio = () => {
      soundManager.initCtx();
      if (!soundManager.isPlaying()) {
        soundManager.playTrack('hindi-tum-hi-ho');
        soundManager.startAmbient();
      }
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Automatic soundtrack transitions per scene as requested!
  useEffect(() => {
    if (!soundManager.isPlaying()) return;
    switch (currentScene) {
      case 0:
        // Front page: Tum Hi Ho - Arijit Singh original vocals
        soundManager.playTrack('hindi-tum-hi-ho');
        break;
      case 1:
        // Gift scene: Raataan Lambiyan
        soundManager.playTrack('hindi-raataan-lambiyan');
        break;
      case 2:
        // Memories scene: Mundian To Bach Ke Punjabi
        soundManager.playTrack('punjabi-bhangra');
        break;
      case 3:
        // Cake cutting scene: Happy Birthday Pop Celebration
        soundManager.playTrack('birthday-pop');
        break;
      case 4:
        // Letter scene: Dil Diyan Gallan
        soundManager.playTrack('hindi-dil-diyan-gallan');
        break;
      case 5:
        // Finale celebration: Angreji Beat Punjabi party banger
        soundManager.playTrack('party-angreji-beat');
        break;
      case 6:
        // Grand 3D Happy Ending: Channa Mereya (Accha Chalta Hoon, Duaon Mein Yaad Rakhna)
        soundManager.playTrack('hindi-channa-mereya');
        break;
    }
  }, [currentScene]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const store = useExperienceStore.getState();
      if (e.key === 'ArrowRight') {
        store.nextScene();
      } else if (e.key === 'ArrowLeft') {
        store.prevScene();
      }
    },
    []
  );

  if (!loaded) {
    return <LoadingScreen onComplete={handleLoadComplete} />;
  }

  const ActiveScene = scenes[currentScene];

  return (
    <div
      className="experience-container"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Deep Luxury Dark Aesthetic Background as requested */}
      <div
        className="webgl-fallback"
        style={{
          background: '#04030a',
          transition: 'background 1s ease',
        }}
      />

      {/* Mathematical Floral Blooming Transition between scenes */}
      <FloralBloomTransition isTransitioning={isBloomTransitioning} />

      {/* Current Scene with smooth fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'fixed', inset: 0, zIndex: 5 }}
        >
          <ActiveScene />
        </motion.div>
      </AnimatePresence>

      {/* Global UI Overlays: Clean music player, bottom navigation, and funny roaming companion */}
      <MusicPlaylist />
      <RoamingCompanion />
      <SceneNavigation />
    </div>
  );
}
