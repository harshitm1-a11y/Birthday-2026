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
import LongDriveScene from './scenes/LongDriveScene';

import './styles/global.css';

const scenes = [
  GalaxyScene,
  GiftScene,
  MemoriesScene,
  CakeScene,
  LetterScene,
  FinaleScene,
  HappyEndingScene,
  LongDriveScene,
];

// Error Boundary to prevent any scene crash from creating a blank screen
class SceneErrorBoundary extends React.Component<
  { children: React.ReactNode; currentScene: number },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; currentScene: number }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('Scene rendering error caught by boundary:', error, info);
  }

  componentDidUpdate(prevProps: { currentScene: number }) {
    if (prevProps.currentScene !== this.props.currentScene && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#070414',
            color: '#fff',
            padding: '20px',
            textAlign: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: 'rgba(25, 18, 48, 0.95)',
              border: '2px solid rgba(251, 191, 36, 0.7)',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '450px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✨ 💖 ✨</div>
            <h3 style={{ color: '#fbbf24', margin: '0 0 10px 0' }}>Sameeksha's Universe</h3>
            <p style={{ color: '#fed7aa', fontSize: '0.9rem', marginBottom: '16px' }}>
              Scene reload ho raha hai... Kripya neeche button daba kar aage ya peeche chalein!
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, error: null })}
                style={{
                  background: 'linear-gradient(135deg, #f43f5e, #fbbf24)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '10px 20px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🔄 Refresh Scene
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  // Guarantees audio starts immediately on any user gesture (tap/click/key)
  useEffect(() => {
    const unlockAudio = () => {
      soundManager.initCtx();
      if (!soundManager.isPlaying()) {
        soundManager.startAmbient();
      }
    };
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Automatic soundtrack transitions per scene with instant vocal hooks!
  useEffect(() => {
    if (!soundManager.isPlaying()) return;
    switch (currentScene) {
      case 0:
        // Front page: Tum Hi Ho - Arijit Singh original vocals
        soundManager.playTrack('hindi-tum-hi-ho', 0);
        break;
      case 1:
        // Gift scene: Raataan Lambiyan (starts at vocal chorus 56s)
        soundManager.playTrack('hindi-raataan-lambiyan', 56);
        break;
      case 2:
        // Memories scene: Mundian To Bach Ke Punjabi (starts at vocal hook 30s)
        soundManager.playTrack('punjabi-bhangra', 30);
        break;
      case 3:
        // Cake cutting scene: Happy Birthday Pop Celebration (vocals from start)
        soundManager.playTrack('birthday-pop', 0);
        break;
      case 4:
        // Letter scene: Dil Diyan Gallan (starts at vocal chorus 52s)
        soundManager.playTrack('hindi-dil-diyan-gallan', 52);
        break;
      case 5:
        // Finale celebration: Angreji Beat Punjabi party banger (starts directly at vocals 34s)
        soundManager.playTrack('party-angreji-beat', 34);
        break;
      case 6:
        // Grand 3D Happy Ending: Channa Mereya ("Accha Chalta Hoon, Duaon Mein Yaad Rakhna" iconic chorus 58s)
        soundManager.playTrack('hindi-channa-mereya', 58);
        break;
      case 7:
        // Handled directly inside LongDriveScene dedicated controller to prevent race conditions
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
      <AnimatePresence>
        <motion.div
          key={currentScene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ position: 'fixed', inset: 0, zIndex: 10 }}
        >
          <SceneErrorBoundary currentScene={currentScene}>
            <ActiveScene />
          </SceneErrorBoundary>
        </motion.div>
      </AnimatePresence>

      {/* Global UI Overlays: Clean music player, bottom navigation, and funny roaming companion */}
      <MusicPlaylist />
      {currentScene !== 7 && <RoamingCompanion />}
      <SceneNavigation />
    </div>
  );
}
