import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import { soundManager } from '../../utils/audio';
import { getAssetUrl } from '../../utils/assets';

interface MemoryPhoto {
  src: string;
  caption?: string;
  id?: string;
  isCustom?: boolean;
}

interface PhotoAnimationVariant {
  badge: string;
  flash: boolean;
  initial: any;
  animate: any;
  exit: any;
  transition: any;
}

// 6 Distinct, exciting animation variants for clicking photos
const PHOTO_ANIMATIONS: PhotoAnimationVariant[] = [
  // 0: Polaroid Flash Snap
  {
    badge: '📸 Polaroid Flash Snap',
    flash: true,
    initial: { scale: 0.15, rotate: -14, opacity: 0, y: 70 },
    animate: { scale: 1, rotate: [-14, 4, 0], opacity: 1, y: 0 },
    exit: { scale: 0.2, rotate: 12, opacity: 0 },
    transition: { type: 'spring', damping: 16, stiffness: 240 },
  },
  // 1: 3D Heart Bloom Unfold
  {
    badge: '💖 Romantic Heart Bloom',
    flash: false,
    initial: { scale: 0.1, rotateY: 90, opacity: 0 },
    animate: { scale: [0.1, 1.12, 1], rotateY: [90, -8, 0], opacity: 1 },
    exit: { scale: 0.2, rotateY: 90, opacity: 0 },
    transition: { type: 'spring', damping: 18, stiffness: 220 },
  },
  // 2: Cosmic Nebula Spiral
  {
    badge: '🌌 Cosmic Portal Swirl',
    flash: false,
    initial: { scale: 0, rotate: 180, opacity: 0, filter: 'blur(16px)' },
    animate: { scale: 1, rotate: [180, -6, 0], opacity: 1, filter: 'blur(0px)' },
    exit: { scale: 0, rotate: -180, opacity: 0 },
    transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
  },
  // 3: Cinematic Shutter Drop
  {
    badge: '🎬 Cinematic Shutter Drop',
    flash: false,
    initial: { y: -180, rotateX: -60, scale: 0.5, opacity: 0 },
    animate: { y: 0, rotateX: 0, scale: 1, opacity: 1 },
    exit: { y: 180, opacity: 0 },
    transition: { type: 'spring', damping: 15, stiffness: 250 },
  },
  // 4: Starlight Angelic Float
  {
    badge: '✨ Starlight Angelic Float',
    flash: false,
    initial: { y: 150, scale: 0.35, opacity: 0, borderRadius: '40px' },
    animate: { y: [150, -10, 0], scale: 1, opacity: 1, borderRadius: '16px' },
    exit: { y: -80, scale: 0.4, opacity: 0 },
    transition: { type: 'spring', damping: 20, stiffness: 200 },
  },
  // 5: Origami Diagonal Unfold
  {
    badge: '💌 Origami Corner Unfold',
    flash: false,
    initial: { x: 140, y: 60, rotateZ: 25, scale: 0.2, opacity: 0 },
    animate: { x: 0, y: 0, rotateZ: 0, scale: 1, opacity: 1 },
    exit: { x: -140, scale: 0.2, opacity: 0 },
    transition: { type: 'spring', damping: 17, stiffness: 230 },
  },
];

const MemoriesScene: React.FC = () => {
  const nextScene = useExperienceStore((s) => s.nextScene);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'cylinder' | 'grid'>('cylinder');
  const [isPaused, setIsPaused] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [direction, setDirection] = useState(1);
  const [speedMultiplier, setSpeedMultiplier] = useState(0.035); // 4x slower and elegant!

  // Custom uploaded photos state persisted in localStorage
  const [customPhotos, setCustomPhotos] = useState<MemoryPhoto[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sameeksha_custom_photos');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combine custom uploaded photos with pre-loaded photos
  const allPhotos: MemoryPhoto[] = useMemo(() => {
    const formattedBuiltin: MemoryPhoto[] = content.photos.map((p, idx) => ({
      ...p,
      id: `builtin_${idx}`,
      isCustom: false,
    }));
    return [...customPhotos, ...formattedBuiltin];
  }, [customPhotos]);

  const count = allPhotos.length;
  const halfCount = Math.ceil(count / 2);

  // Responsive radius based on window width
  const [radius, setRadius] = useState(480);

  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setRadius(300);
      } else if (w < 768) {
        setRadius(380);
      } else {
        setRadius(460);
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
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    if (!isPaused && !isDraggingRef.current && viewMode === 'cylinder') {
      setRotation((prev) => (prev + speedMultiplier * direction) % 360);
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [isPaused, direction, viewMode, speedMultiplier]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  // Pointer drag to spin cylinder
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startRotationRef.current = rotation;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
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
        setSelectedIdx((prev) => (prev !== null ? (prev + 1) % allPhotos.length : 0));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIdx((prev) =>
          prev !== null ? (prev - 1 + allPhotos.length) % allPhotos.length : 0
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIdx, allPhotos.length]);

  const handleCardClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playTwinkle();
    setSelectedIdx(idx);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, originalSrc: string) => {
    const target = e.currentTarget;
    if (!target.dataset.retried) {
      target.dataset.retried = 'relative';
      const relative = originalSrc.startsWith('/') ? '.' + originalSrc : originalSrc;
      target.src = relative;
    } else if (target.dataset.retried === 'relative') {
      target.dataset.retried = 'fallback';
      target.src = getAssetUrl('/images/IMG-20250423-WA0001.jpg');
    }
  };

  // Upload user photos from local device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const newPhoto: MemoryPhoto = {
            src: result,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            id: 'custom_' + Date.now() + '_' + Math.random(),
            isCustom: true,
          };
          setCustomPhotos((prev) => {
            const updated = [newPhoto, ...prev];
            try {
              localStorage.setItem('sameeksha_custom_photos', JSON.stringify(updated));
            } catch (err) {
              console.warn('LocalStorage quota limit reached:', err);
            }
            return updated;
          });
          soundManager.playTwinkle();
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same file can be re-uploaded if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Delete a custom uploaded photo
  const handleDeleteCustomPhoto = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const photo = allPhotos[idx];
    if (!photo || !photo.isCustom) return;

    setCustomPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== photo.id);
      try {
        localStorage.setItem('sameeksha_custom_photos', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not update storage:', err);
      }
      return updated;
    });
    setSelectedIdx(null);
  };

  const currentPhoto = selectedIdx !== null ? allPhotos[selectedIdx] : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Background ambient gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(45, 27, 105, 0.45) 0%, rgba(10, 10, 26, 0.95) 75%)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating Corner Upload Button */}
      <motion.button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          top: '72px',
          right: '20px',
          zIndex: 80,
          background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
          border: '1px solid rgba(251, 191, 36, 0.5)',
          borderRadius: '24px',
          padding: '7px 16px',
          color: '#fff',
          fontSize: '0.82rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
        }}
        title="Upload photos from device to memory album"
      >
        <span>📸</span>
        <span>+ Upload Photos</span>
      </motion.button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* Main Overlay Content */}
      <div
        className="scene-overlay"
        style={{
          justifyContent: 'flex-start',
          paddingTop: '3.6rem',
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
          style={{ maxWidth: '1000px', width: '100%' }}
        >
          <h2 className="scene-heading" style={{ marginBottom: '0.2rem', fontSize: 'clamp(1.8rem, 5vw, 2.7rem)' }}>
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
              gap: '0.6rem',
              marginBottom: '0.8rem',
              flexWrap: 'wrap',
            }}
          >
            {/* View Mode Toggle */}
            <button
              className="magic-button magic-button-secondary magic-button-small"
              onClick={() => setViewMode((m) => (m === 'cylinder' ? 'grid' : 'cylinder'))}
              style={{
                fontSize: '0.82rem',
                padding: '0.35rem 0.9rem',
                border: '1.5px solid rgba(251, 191, 36, 0.6)',
                background: 'rgba(251, 191, 36, 0.15)',
              }}
            >
              <span>{viewMode === 'cylinder' ? '🖼️ Switch to Grid Album' : '🎡 Switch to 3D Cylinder'}</span>
            </button>

            {viewMode === 'cylinder' && (
              <>
                <button
                  className="magic-button magic-button-secondary magic-button-small"
                  onClick={() => setIsPaused((p) => !p)}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
                >
                  <span>{isPaused ? '▶️ Resume Spin' : '⏸️ Pause Spin'}</span>
                </button>

                <button
                  className="magic-button magic-button-secondary magic-button-small"
                  onClick={() => setDirection((d) => -d)}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
                >
                  <span>🔄 Reverse</span>
                </button>

                <button
                  className="magic-button magic-button-secondary magic-button-small"
                  onClick={() => setSpeedMultiplier((s) => (s <= 0.035 ? 0.08 : 0.035))}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
                >
                  <span>{speedMultiplier <= 0.035 ? '🐇 Faster' : '🐢 Slow Drift'}</span>
                </button>
              </>
            )}

            {/* Clean Hint without numbers or counters */}
            <span style={{ fontSize: '0.82rem', color: '#fbcfe8', fontWeight: 500 }}>
              ✨ Tap any photo to open & enjoy!
            </span>
          </div>

          {/* View Mode 1: 3D Cylindrical Carousel */}
          {viewMode === 'cylinder' ? (
            <div
              className="cylinder-stage"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerEnter={() => setIsPaused(true)}
              onPointerLeave={() => setIsPaused(false)}
            >
              <div
                className="cylinder-carousel"
                style={{
                  transform: `rotateY(${rotation}deg) rotateX(-3deg)`,
                }}
              >
                {allPhotos.map((item, idx) => {
                  const tier = idx % 2;
                  const tierIdx = Math.floor(idx / 2);
                  const angle = (tierIdx / halfCount) * 360;
                  const yOffset = tier === 0 ? -110 : 110;
                  const resolvedSrc = item.src.startsWith('data:') ? item.src : getAssetUrl(item.src);

                  return (
                    <div
                      key={item.id || idx}
                      style={{
                        position: 'absolute',
                        width: '125px',
                        height: '155px',
                        left: 0,
                        top: 0,
                        transform: `rotateY(${angle}deg) translateZ(${radius}px) translateY(${yOffset}px)`,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <motion.div
                        className="cylinder-card"
                        whileHover={{
                          scale: 1.22,
                          z: 50,
                          boxShadow: '0 20px 45px rgba(244, 63, 94, 0.75), 0 0 30px rgba(251, 191, 36, 0.65)',
                          borderColor: '#fbbf24',
                        }}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: 'spring', damping: 14, stiffness: 300 }}
                        onClick={(e) => handleCardClick(idx, e)}
                        role="button"
                        tabIndex={0}
                        aria-label="Open memory photo"
                        style={{ width: '100%', height: '100%', cursor: 'pointer' }}
                      >
                        <img
                          src={resolvedSrc}
                          alt="Sameeksha memory"
                          loading="lazy"
                          draggable={false}
                          onError={(e) => handleImageError(e, item.src)}
                        />
                        <div className="cylinder-card-caption">
                          {item.caption || '❤️'}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* View Mode 2: Responsive Photo Grid Album */
            <div className="gallery-grid" style={{ maxHeight: '55vh', margin: '0.5rem auto' }}>
              {allPhotos.map((item, idx) => {
                const resolvedSrc = item.src.startsWith('data:') ? item.src : getAssetUrl(item.src);
                return (
                  <motion.div
                    key={item.id || idx}
                    className="gallery-item"
                    onClick={(e) => handleCardClick(idx, e)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.4) }}
                  >
                    <img
                      src={resolvedSrc}
                      alt="Sameeksha photo"
                      loading="lazy"
                      onError={(e) => handleImageError(e, item.src)}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        insetInline: 0,
                        padding: '0.2rem 0.4rem',
                        background: 'linear-gradient(transparent, rgba(10, 10, 26, 0.9))',
                        fontSize: '0.72rem',
                        color: '#fff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.caption || '❤️'}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

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

      {/* Fullscreen Photo Modal with Dynamic Unique Animations per Photo */}
      <AnimatePresence mode="wait">
        {selectedIdx !== null && currentPhoto && (() => {
          const anim = PHOTO_ANIMATIONS[selectedIdx % PHOTO_ANIMATIONS.length];
          return (
            <motion.div
              key="gallery-modal-backdrop"
              className="gallery-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedIdx(null)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(5, 5, 18, 0.9)',
                backdropFilter: 'blur(18px)',
                padding: '16px',
              }}
            >
              {/* Simulated camera flash on Polaroid animation variant */}
              {anim.flash && (
                <motion.div
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    background: '#ffffff',
                    pointerEvents: 'none',
                    zIndex: 220,
                  }}
                />
              )}

              <motion.div
                key={`modal-card-${selectedIdx}`}
                className="gallery-modal-content"
                initial={anim.initial}
                animate={anim.animate}
                exit={anim.exit}
                transition={anim.transition}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  willChange: 'transform, opacity',
                  maxWidth: '92vw',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Animation Type Pill */}
                <div
                  style={{
                    marginBottom: '8px',
                    background: 'rgba(251, 191, 36, 0.16)',
                    border: '1px solid rgba(251, 191, 36, 0.45)',
                    color: '#fef08a',
                    borderRadius: '20px',
                    padding: '3px 12px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  }}
                >
                  <span>{anim.badge}</span>
                </div>

                <button
                  className="gallery-modal-close"
                  onClick={() => setSelectedIdx(null)}
                  aria-label="Close photo preview"
                >
                  ✕
                </button>

                <button
                  className="gallery-modal-nav prev"
                  onClick={() => {
                    soundManager.playTwinkle();
                    setSelectedIdx((prev) =>
                      prev !== null ? (prev - 1 + allPhotos.length) % allPhotos.length : 0
                    );
                  }}
                  aria-label="Previous photo"
                >
                  ‹
                </button>

                <img
                  src={
                    currentPhoto.src.startsWith('data:')
                      ? currentPhoto.src
                      : getAssetUrl(currentPhoto.src)
                  }
                  alt="Sameeksha photo full view"
                  onError={(e) => handleImageError(e, currentPhoto.src)}
                  style={{
                    maxHeight: '68vh',
                    maxWidth: '85vw',
                    objectFit: 'contain',
                    borderRadius: '14px',
                    boxShadow: '0 12px 45px rgba(0,0,0,0.85), 0 0 35px rgba(255, 107, 157, 0.45)',
                    border: '2px solid rgba(255, 255, 255, 0.35)',
                  }}
                />

                <button
                  className="gallery-modal-nav next"
                  onClick={() => {
                    soundManager.playTwinkle();
                    setSelectedIdx((prev) => (prev !== null ? (prev + 1) % allPhotos.length : 0));
                  }}
                  aria-label="Next photo"
                >
                  ›
                </button>

                <div className="gallery-modal-caption">
                  {currentPhoto.isCustom && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <span
                        style={{
                          color: '#34d399',
                          fontSize: '0.76rem',
                          background: 'rgba(52, 211, 153, 0.15)',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          border: '1px solid rgba(52, 211, 153, 0.3)',
                        }}
                      >
                        ✨ Uploaded Memory
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCustomPhoto(selectedIdx, e)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid #ef4444',
                          color: '#f87171',
                          borderRadius: '8px',
                          padding: '2px 8px',
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                        }}
                        title="Delete this uploaded photo"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                  {currentPhoto.caption && (
                    <div style={{ color: '#ff8fb3', fontStyle: 'italic', fontSize: '0.96rem', fontWeight: 500 }}>
                      "{currentPhoto.caption}"
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default MemoriesScene;
