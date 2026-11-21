import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import Celebration from '../../components/Celebration';
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

const PARTY_HITS = [
  { id: 'party-angreji-beat', name: 'Angreji Beat', emoji: '🎉', artist: 'Honey Singh & Gippy' },
  { id: 'punjabi-bhangra', name: 'Mundian To Bach Ke', emoji: '🥁', artist: 'Panjabi MC' },
  { id: 'party-brown-rang', name: 'Brown Rang', emoji: '🔥', artist: 'Honey Singh' },
  { id: 'punjabi-blue-eyes', name: 'Blue Eyes', emoji: '💙', artist: 'Honey Singh' },
  { id: 'party-dope-shope', name: 'Dope Shope', emoji: '💃', artist: 'Deep Money' },
];

const FinaleScene: React.FC = () => {
  const setScene = useExperienceStore((s) => s.setScene);
  const [selectedFlower, setSelectedFlower] = useState<number | null>(null);
  const [currentPartyTrackId, setCurrentPartyTrackId] = useState<string>(soundManager.getCurrentTrack().id);

  // Automatically start high-energy party Punjabi soundtrack when entering finale poppers scene!
  useEffect(() => {
    soundManager.playTrack('party-angreji-beat');
    if (!soundManager.isPlaying()) {
      soundManager.startAmbient();
    }

    const unsub = soundManager.subscribe(() => {
      setCurrentPartyTrackId(soundManager.getCurrentTrack().id);
    });
    return () => {
      unsub();
    };
  }, []);

  const handleSelectPartyTrack = (trackId: string) => {
    soundManager.playTrack(trackId);
    if (!soundManager.isPlaying()) {
      soundManager.startAmbient();
    }
  };

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

          {/* Party & Punjabi Celebration Soundtrack Chips */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              borderRadius: '20px',
              padding: '14px 18px',
              margin: '1.2rem auto',
              maxWidth: '650px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ fontSize: '0.92rem', color: '#fbbf24', fontWeight: 700, marginBottom: '4px' }}>
              🎉 Party & Punjabi Celebration Soundtrack 🥁
            </div>
            <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '10px' }}>
              Tap any song to blast your favorite Punjabi dance party anthem while popping poppers!
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {PARTY_HITS.map((hit) => {
                const isActive = currentPartyTrackId === hit.id;
                return (
                  <motion.button
                    key={hit.id}
                    type="button"
                    onClick={() => handleSelectPartyTrack(hit.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, #f59e0b, #ec4899)'
                        : 'rgba(255, 255, 255, 0.08)',
                      border: isActive
                        ? '1px solid #fbbf24'
                        : '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '16px',
                      padding: '7px 12px',
                      color: '#fff',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: isActive ? '0 4px 14px rgba(245, 158, 11, 0.4)' : 'none',
                    }}
                  >
                    <span>{hit.emoji}</span>
                    <span>{hit.name}</span>
                    {isActive && <span style={{ fontSize: '0.68rem', color: '#fef08a' }}>🔊</span>}
                  </motion.button>
                );
              })}
            </div>
          </div>

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
    </div>
  );
};

export default FinaleScene;
