import { useState, useCallback, lazy, Suspense } from 'react';
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
import './styles/global.css';

const GalaxyScene = lazy(() => import('./scenes/GalaxyScene'));
const GiftScene = lazy(() => import('./scenes/GiftScene'));
const MemoriesScene = lazy(() => import('./scenes/MemoriesScene'));
const CompanionScene = lazy(() => import('./scenes/CompanionScene'));
const CakeScene = lazy(() => import('./scenes/CakeScene'));
const LetterScene = lazy(() => import('./scenes/LetterScene'));
const FinaleScene = lazy(() => import('./scenes/FinaleScene'));

const scenes = [GalaxyScene, GiftScene, MemoriesScene, CompanionScene, CakeScene, LetterScene, FinaleScene];

function SceneFallback() {
  return (
    <div className="scene-overlay">
      <div className="loading-text">✨ Loading scene...</div>
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const currentScene = useExperienceStore((s) => s.currentScene);
  const [entered, setEntered] = useState(false);

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
      {/* Background gradient that's always there */}
      <div
        className="webgl-fallback"
        style={{
          background: `radial-gradient(ellipse at center, 
            ${currentScene === 6 ? '#1a0a2e' : '#0d0d2b'} 0%, 
            #0a0a1a 70%)`,
          transition: 'background 1s ease',
        }}
      />

      {/* Current Scene */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'fixed', inset: 0, zIndex: 5 }}
        >
          <Suspense fallback={<SceneFallback />}>
            <ActiveScene />
          </Suspense>
        </motion.div>
      </AnimatePresence>

      {/* UI Overlays - always visible after entry */}
      {(entered || currentScene > 0) && (
        <>
          <SceneMenu />
          <HeartCounter />
          <AudioToggle />
          <SceneNavigation />
        </>
      )}

      {/* Track that user has entered */}
      {currentScene > 0 && !entered && (() => { setEntered(true); return null; })()}

      {/* Secret message modal */}
      <SecretMessage />
    </div>
  );
}
