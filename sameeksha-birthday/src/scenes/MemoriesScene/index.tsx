import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import HiddenHeart from '../../components/HiddenHeart';
import { soundManager } from '../../utils/audio';

const MemoriesScene: React.FC = () => {
  const nextScene = useExperienceStore((s) => s.nextScene);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const photos = content.photos;

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') {
        setSelectedIdx(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedIdx((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIdx((prev) =>
          prev !== null ? (prev - 1 + photos.length) % photos.length : 0
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIdx, photos.length]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Overlay Container */}
      <div
        className="scene-overlay"
        style={{
          justifyContent: 'flex-start',
          paddingTop: '4.5rem',
          paddingBottom: '5rem',
          overflowY: 'auto',
          pointerEvents: 'auto',
        }}
      >
        <motion.div
          className="scene-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: '850px' }}
        >
          <h2 className="scene-heading" style={{ marginBottom: '0.5rem' }}>
            {content.memories.heading}
          </h2>
          <p className="scene-subtext" style={{ marginBottom: '1.5rem' }}>
            {content.memories.subtext}
          </p>

          {/* Polaroid Photo Grid */}
          <div
            className="gallery-grid"
            style={{
              maxHeight: '52vh',
              margin: '0 auto',
            }}
          >
            {photos.map((item, idx) => (
              <motion.div
                key={idx}
                className="gallery-item"
                onClick={() => {
                  soundManager.playTwinkle();
                  setSelectedIdx(idx);
                }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                role="button"
                tabIndex={0}
                aria-label={`View photo ${idx + 1}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedIdx(idx);
                  }
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '6px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                }}
              >
                <img
                  src={item.src}
                  alt={`Sameeksha memory ${idx + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Continue button */}
          <div style={{ marginTop: '1.8rem' }}>
            <button
              className="magic-button"
              onClick={nextScene}
              aria-label="Meet your little companion"
            >
              <span>Next: Meet Someone Special 🐾 ✨</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Photo Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            className="gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
          >
            <motion.div
              className="gallery-modal-content"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="gallery-modal-close"
                onClick={() => setSelectedIdx(null)}
                aria-label="Close photo preview"
              >
                ✕
              </button>

              <button
                className="gallery-modal-nav prev"
                onClick={() =>
                  setSelectedIdx((prev) =>
                    prev !== null ? (prev - 1 + photos.length) % photos.length : 0
                  )
                }
                aria-label="Previous photo"
              >
                ‹
              </button>

              <img
                src={photos[selectedIdx].src}
                alt={`Sameeksha photo full view ${selectedIdx + 1}`}
                style={{
                  maxHeight: '70vh',
                  maxWidth: '85vw',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />

              <button
                className="gallery-modal-nav next"
                onClick={() =>
                  setSelectedIdx((prev) => (prev !== null ? (prev + 1) % photos.length : 0))
                }
                aria-label="Next photo"
              >
                ›
              </button>

              <div className="gallery-modal-caption">
                Photo {selectedIdx + 1} of {photos.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Heart 2 */}
      <HiddenHeart
        heartId={2}
        style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '2rem',
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

export default MemoriesScene;
