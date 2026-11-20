import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../state/experienceStore';
import { soundManager } from '../utils/audio';

const AudioToggle: React.FC = () => {
  const audioEnabled = useExperienceStore((s) => s.audioEnabled);
  const toggleAudio = useExperienceStore((s) => s.toggleAudio);
  const [showToast, setShowToast] = React.useState(false);

  const handleToggle = () => {
    const nextState = !audioEnabled;
    toggleAudio();
    if (nextState) {
      soundManager.startAmbient();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } else {
      soundManager.stopAmbient();
    }
  };

  return (
    <>
      <motion.button
        className={`audio-toggle ${audioEnabled ? 'playing' : ''}`}
        onClick={handleToggle}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        aria-label={audioEnabled ? 'Pause music' : 'Play Bollywood music'}
        title={audioEnabled ? 'Pause Theme Song' : 'Play Theme Song (Baar Baar Din Ye Aaye)'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.5rem 0.9rem',
          borderRadius: '25px',
          background: audioEnabled
            ? 'linear-gradient(135deg, rgba(244, 114, 182, 0.35), rgba(139, 92, 246, 0.45))'
            : 'var(--glass)',
          border: audioEnabled
            ? '1.5px solid rgba(251, 191, 36, 0.6)'
            : '1px solid var(--glass-border)',
          boxShadow: audioEnabled ? '0 0 16px rgba(244, 114, 182, 0.4)' : 'none',
          cursor: 'pointer',
        }}
      >
        <motion.span
          animate={audioEnabled ? { rotate: 360 } : { rotate: 0 }}
          transition={audioEnabled ? { repeat: Infinity, duration: 4, ease: 'linear' } : {}}
          style={{ display: 'inline-block', fontSize: '1.15rem' }}
        >
          {audioEnabled ? '💿' : '🔇'}
        </motion.span>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 500,
            color: audioEnabled ? '#fef08a' : 'var(--white-muted)',
            whiteSpace: 'nowrap',
          }}
        >
          {audioEnabled ? 'Baar Baar Din Ye Aaye 🎶' : 'Play Song 🎵'}
        </span>
      </motion.button>

      {/* Floating Music Toast when started */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            style={{
              position: 'fixed',
              top: '4.8rem',
              right: '1.5rem',
              zIndex: 1000,
              background: 'rgba(15, 10, 30, 0.92)',
              border: '1px solid rgba(251, 191, 36, 0.5)',
              borderRadius: '12px',
              padding: '0.6rem 1rem',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6), 0 0 15px rgba(244, 114, 182, 0.3)',
              color: '#fff',
              fontSize: '0.85rem',
              pointerEvents: 'none',
              maxWidth: '280px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#fbbf24', fontWeight: 600 }}>🎵 Bollywood Special</div>
            <div style={{ fontSize: '0.78rem', color: '#fbcfe8', marginTop: '2px' }}>
              Baar Baar Din Ye Aaye (Happy Birthday Sameeksha!)
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AudioToggle;
