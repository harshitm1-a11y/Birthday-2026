import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../state/experienceStore';
import { content } from '../content/siteContent';

const SCENE_EMOJIS = ['🌌', '🎁', '📸', '🐾', '🎂', '💌', '🎉'];

const SceneNavigation: React.FC = () => {
  const currentScene = useExperienceStore((s) => s.currentScene);
  const setScene = useExperienceStore((s) => s.setScene);
  const nextScene = useExperienceStore((s) => s.nextScene);
  const prevScene = useExperienceStore((s) => s.prevScene);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalScenes = content.scenes.length;
  const currentTitle = content.scenes[currentScene]?.title || `Scene ${currentScene + 1}`;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentScene > 0) {
      prevScene();
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentScene < totalScenes - 1) {
      nextScene();
    }
  };

  const handleJumpToScene = (idx: number) => {
    setScene(idx);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Quick Jump Scene Menu (Pops up above bottom dock) */}
      <AnimatePresence>
        {isMenuOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 110,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: '76px',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(6px)',
            }}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                width: '92%',
                maxWidth: '420px',
                background: 'rgba(17, 12, 34, 0.96)',
                borderRadius: '24px',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(251, 191, 36, 0.15)',
                padding: '14px',
                color: '#fff',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 10px 10px 10px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fbbf24' }}>
                  Select Birthday Scene (1 - 7)
                </span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {content.scenes.map((scene, idx) => {
                  const isActive = idx === currentScene;
                  return (
                    <motion.button
                      key={scene.id}
                      type="button"
                      onClick={() => handleJumpToScene(idx)}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '14px',
                        background: isActive ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: isActive
                          ? '1px solid rgba(251, 191, 36, 0.6)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        color: isActive ? '#fbbf24' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.85rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.25rem' }}>{SCENE_EMOJIS[idx]}</span>
                        <span>
                          {idx + 1}. {scene.title}
                        </span>
                      </div>
                      {isActive && (
                        <span style={{ color: '#34d399', fontSize: '0.75rem', fontWeight: 600 }}>
                          Current • Viewing
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Navigation Bar Dock */}
      <nav
        aria-label="Scene navigation dock"
        style={{
          position: 'fixed',
          bottom: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(15, 12, 34, 0.88)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(251, 191, 36, 0.35)',
          borderRadius: '9999px',
          padding: '6px 10px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(251, 191, 36, 0.15)',
          userSelect: 'none',
          maxWidth: '96vw',
        }}
      >
        {/* Back / Previous Button */}
        <motion.button
          type="button"
          onClick={handlePrev}
          disabled={currentScene === 0}
          whileHover={{ scale: currentScene === 0 ? 1 : 1.08 }}
          whileTap={{ scale: currentScene === 0 ? 1 : 0.94 }}
          style={{
            background: currentScene === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.12)',
            border: currentScene === 0 ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(251, 191, 36, 0.4)',
            color: currentScene === 0 ? 'rgba(255, 255, 255, 0.3)' : '#fbbf24',
            borderRadius: '9999px',
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: currentScene === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s',
          }}
          aria-label="Go to previous scene"
        >
          <span>‹</span>
          <span>Back</span>
        </motion.button>

        {/* Center Scene Title Pill (Tap to open Quick Jump Menu) */}
        <motion.button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            background: 'rgba(251, 191, 36, 0.14)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '9999px',
            padding: '6px 12px',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          title="Click to jump to any scene"
        >
          <span>{SCENE_EMOJIS[currentScene]}</span>
          <span style={{ color: '#fbbf24' }}>
            {currentScene + 1}/7: {currentTitle}
          </span>
          <span style={{ fontSize: '0.65rem', color: '#fbbf24' }}>▾</span>
        </motion.button>

        {/* Numbered Scene Dots (Clickable) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {content.scenes.map((_, i) => {
            const isCurrent = i === currentScene;
            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => setScene(i)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: isCurrent ? '20px' : '10px',
                  height: '10px',
                  borderRadius: '9999px',
                  background: isCurrent
                    ? 'linear-gradient(135deg, #f59e0b, #ec4899)'
                    : 'rgba(255, 255, 255, 0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 0.25s, background 0.25s',
                  boxShadow: isCurrent ? '0 0 8px rgba(245, 158, 11, 0.7)' : 'none',
                }}
                aria-label={`Go to scene ${i + 1}`}
                title={`Scene ${i + 1}: ${content.scenes[i]?.title}`}
              />
            );
          })}
        </div>

        {/* Next Button */}
        <motion.button
          type="button"
          onClick={handleNext}
          disabled={currentScene === totalScenes - 1}
          whileHover={{ scale: currentScene === totalScenes - 1 ? 1 : 1.08 }}
          whileTap={{ scale: currentScene === totalScenes - 1 ? 1 : 0.94 }}
          style={{
            background:
              currentScene === totalScenes - 1
                ? 'rgba(255, 255, 255, 0.05)'
                : 'linear-gradient(135deg, #f59e0b, #ec4899)',
            border:
              currentScene === totalScenes - 1
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(251, 191, 36, 0.5)',
            color: currentScene === totalScenes - 1 ? 'rgba(255, 255, 255, 0.3)' : '#fff',
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: currentScene === totalScenes - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: currentScene === totalScenes - 1 ? 'none' : '0 2px 10px rgba(245, 158, 11, 0.4)',
            transition: 'all 0.2s',
          }}
          aria-label="Go to next scene"
        >
          <span>Next</span>
          <span>›</span>
        </motion.button>
      </nav>
    </>
  );
};

export default SceneNavigation;
