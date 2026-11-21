import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import Celebration from '../../components/Celebration';
import HiddenHeart from '../../components/HiddenHeart';
import { soundManager } from '../../utils/audio';
import { RealisticPopper } from '../../components/RealisticPopper';

const flowers = [
  { emoji: '🌸', color: '#ff6b9d' },
  { emoji: '🌺', color: '#f43f5e' },
  { emoji: '🌻', color: '#fbbf24' },
  { emoji: '🌷', color: '#ec4899' },
  { emoji: '🌹', color: '#e11d48' },
  { emoji: '💐', color: '#a855f7' },
];

const FinaleScene: React.FC = () => {
  const setScene = useExperienceStore((s) => s.setScene);
  const [selectedFlower, setSelectedFlower] = useState<number | null>(null);

  const compliments = content.compliments;

  const handleFlowerClick = (idx: number) => {
    soundManager.playTwinkle();
    setSelectedFlower(idx);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Permanent Grand Celebration Fireworks & Confetti */}
      <Celebration active={true} />

      {/* Overlay Container */}
      <div
        className="scene-overlay"
        style={{
          paddingTop: '3.5rem',
          paddingBottom: '5.5rem',
          pointerEvents: 'auto',
          overflowY: 'auto',
        }}
      >
        <motion.div
          className="scene-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ maxWidth: '750px' }}
        >
          {/* Big Name & Finale Heading */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 14 }}
          >
            <div style={{ fontSize: '1.1rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#fbbf24', marginBottom: '0.5rem', fontWeight: 600 }}>
              ✨ FOREVER CELEBRATING YOU ✨
            </div>
            <h1 className="scene-heading" style={{ fontSize: 'clamp(2.4rem, 6.5vw, 4rem)' }}>
              {content.finale.heading}
            </h1>
          </motion.div>

          {/* Subtext */}
          <p className="scene-subtext" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', marginBottom: '1.2rem', whiteSpace: 'pre-line' }}>
            {content.finale.subtext}
          </p>

          {/* Realistic Party Popper with Banner */}
          <RealisticPopper />

          {/* Navigation Action Buttons */}
          <div className="finale-buttons">
            <button
              className="magic-button"
              onClick={() => setScene(0)}
              aria-label="Replay the whole birthday journey"
            >
              <span>{content.finale.buttons.replay}</span>
            </button>
            <button
              className="magic-button magic-button-secondary"
              onClick={() => setScene(2)}
              aria-label="Revisit photo memories"
            >
              <span>{content.finale.buttons.memories}</span>
            </button>
            <button
              className="magic-button magic-button-secondary"
              onClick={() => setScene(1)}
              aria-label="Open the magical gift again"
            >
              <span>{content.finale.buttons.oneMoreLook}</span>
            </button>
          </div>

          {/* Bonus Feature: Interactive Compliment Garden */}
          <div style={{ marginTop: '2.5rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '1.15rem', color: '#fbbf24', fontWeight: 600, marginBottom: '0.3rem' }}>
              🌸 Compliment Garden 🌸
            </div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
              Pick a flower to reveal a message made just for you:
            </div>

            <div className="compliment-garden">
              {flowers.map((f, idx) => (
                <motion.button
                  key={idx}
                  className={`flower-button ${selectedFlower === idx ? 'revealed' : ''}`}
                  onClick={() => handleFlowerClick(idx)}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Pick flower ${idx + 1}`}
                >
                  {f.emoji}
                </motion.button>
              ))}
            </div>

            {/* Revealed Compliment */}
            <div className="compliment-text">
              <AnimatePresence mode="wait">
                {selectedFlower !== null && (
                  <motion.div
                    key={selectedFlower}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    "{compliments[selectedFlower % compliments.length]}"
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hidden Heart 4 (5th and final heart!) */}
      <HiddenHeart
        heartId={4}
        style={{
          position: 'fixed',
          top: '6rem',
          left: '2rem',
          zIndex: 60,
          background: 'none',
          border: 'none',
          fontSize: '1.8rem',
          cursor: 'pointer',
        }}
      />
    </div>
  );
};

export default FinaleScene;
