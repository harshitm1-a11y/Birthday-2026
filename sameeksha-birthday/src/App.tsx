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
import CompanionScene from './scenes/CompanionScene';
import CakeScene from './scenes/CakeScene';
import LetterScene from './scenes/LetterScene';
import FinaleScene from './scenes/FinaleScene';

import './styles/global.css';

const scenes = [
  GalaxyScene,
  GiftScene,
  MemoriesScene,
  CompanionScene,
  CakeScene,
  LetterScene,
  FinaleScene,
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
  }, []);

  // Automatic soundtrack transitions per scene as requested!
  useEffect(() => {
    if (!soundManager.isPlaying()) return;
    switch (currentScene) {
      case 0:
        // Front page: Aaja Sanam Madhur Chandni instrumental
        soundManager.playTrack('hindi-romantic');
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
        // Companion scene: Tum Hi Ho
        soundManager.playTrack('hindi-tum-hi-ho');
        break;
      case 4:
        // Cake cutting scene: Happy Birthday Pop Celebration
        soundManager.playTrack('birthday-pop');
        break;
      case 5:
        // Letter scene: Dil Diyan Gallan
        soundManager.playTrack('hindi-dil-diyan-gallan');
        break;
      case 6:
        // Finale celebration: Angreji Beat Punjabi party banger
        soundManager.playTrack('party-angreji-beat');
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
