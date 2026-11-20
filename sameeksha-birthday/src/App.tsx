import React, { useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LoadingScreen,
  SceneNavigation,
  HeartCounter,
  AudioToggle,
  SecretMessage,
  SceneMenu,
} from './components';
import { useExperienceStore } from './state/experienceStore';

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

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

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
      {/* Dynamic Background Gradient */}
      <div
        className="webgl-fallback"
        style={{
          background: `radial-gradient(ellipse at center, 
            ${currentScene === 6 ? '#2a0845' : currentScene === 4 ? '#200b3b' : '#0d0d2b'} 0%, 
            #0a0a1a 75%)`,
          transition: 'background 1s ease',
        }}
      />

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

      {/* Global UI Overlays */}
      <SceneMenu />
      <HeartCounter />
      <AudioToggle />
      <SceneNavigation />

      {/* Secret message modal */}
      <SecretMessage />
    </div>
  );
}
