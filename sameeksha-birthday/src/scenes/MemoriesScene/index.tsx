import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import HiddenHeart from '../../components/HiddenHeart';
import { soundManager } from '../../utils/audio';

const MemoriesScene: React.FC = () => {
  const nextScene = useExperienceStore((s) => s.nextScene);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [direction, setDirection] = useState(1);

  const photos = content.photos;
  const count = photos.length; // 49 photos
  const halfCount = Math.ceil(count / 2); // ~25 per tier

  // Responsive radius based on window width
  const [radius, setRadius] = useState(480);

  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setRadius(320);
      } else if (w < 768) {
        setRadius(400);
      } else {
        setRadius(500);
      }
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // Continuous auto-rotation using requestAnimationFrame
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startRotationRef = useRef(0);
  const velXRef = useRef(0);
  const lastXRef = useRef(0);
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    if (!isPaused && !isDraggingRef.current) {
      setRotation((prev) => (prev + 0.12 * direction) % 360);
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [isPaused, direction]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  // Pointer drag to spin cylinder
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    startRotationRef.current = rotation;
    velXRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    velXRef.current = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    setRotation(startRotationRef.current + deltaX * 0.28);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

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

  const handleCardClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playTwinkle();
    setSelectedIdx(idx);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Background ambient gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(45, 27, 105, 0.4) 0%, rgba(10, 10, 26, 0.95) 75%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Overlay Content */}
      <div
        className="scene-overlay"
        style={{
          justifyContent: 'flex-start',
          paddingTop: '3.8rem',
          paddingBottom: '5.2rem',
          overflowY: 'auto',
          pointerEvents: 'auto',
        }}
      >
        <motion.div
          className="scene-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: '980px', width: '100%' }}
        >
          <h2 className="scene-heading" style={{ marginBottom: '0.3rem', fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>
            {content.memories.heading}
          </h2>
          <p className="scene-subtext" style={{ marginBottom: '0.8rem', fontSize: 'clamp(0.9rem, 2.5vw, 1.15rem)' }}>
            {content.memories.subtext}
          </p>

          {/* Carousel Control Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              marginBottom: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              className="magic-button magic-button-secondary magic-button-small"
              onClick={() => setIsPaused((p) => !p)}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}
            >
              <span>{isPaused ? '▶️ Resume Spin' : '⏸️ Pause Spin'}</span>
            </button>

            <button
              className="magic-button magic-button-secondary magic-button-small"
              onClick={() => setDirection((d) => -d)}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}
            >
              <span>🔄 Reverse</span>
            </button>

            <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              ✨ 49 Memories in 3D Cylinder • Drag left/right to spin!
            </span>
          </div>

          {/* 3D Cylindrical Carousel Viewport */}
          <div
            className="cylinder-stage"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div
              className="cylinder-carousel"
              style={{
                transform: `rotateY(${rotation}deg) rotateX(-4deg)`,
              }}
            >
              {photos.map((item, idx) => {
                const tier = idx % 2 === 0 ? 0 : 1; // 0 = upper row, 1 = lower row
                const itemInTier = Math.floor(idx / 2);
                const angle = (itemInTier / halfCount) * 360;
                const yOffset = tier === 0 ? -75 : 75;

                return (
                  <div
                    key={idx}
                    className="cylinder-card"
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(${radius}px) translateY(${yOffset}px)`,
                    }}
                    onClick={(e) => handleCardClick(idx, e)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open memory ${idx + 1}`}
                  >
                    <img
                      src={item.src}
                      alt={`Memory ${idx + 1}`}
                      loading="eager"
                      draggable={false}
                    />
                    <div className="cylinder-card-caption">
                      {item.caption || `#${idx + 1}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continue button */}
          <div style={{ marginTop: '1.2rem', textAlign: 'center' }}>
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

      {/* Fullscreen Photo Modal with Pop-out Animation */}
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
              initial={{ scale: 0.5, rotateY: 30, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
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
                  boxShadow: '0 10px 40px rgba(0,0,0,0.8), 0 0 30px rgba(255, 107, 157, 0.4)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
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
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>
                  Photo {selectedIdx + 1} of {photos.length}
                </span>
                {photos[selectedIdx].caption && (
                  <div style={{ marginTop: '0.25rem', color: '#ff8fb3', fontStyle: 'italic' }}>
                    "{photos[selectedIdx].caption}"
                  </div>
                )}
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
