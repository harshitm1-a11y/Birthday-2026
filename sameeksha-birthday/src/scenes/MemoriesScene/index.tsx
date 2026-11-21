import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import HiddenHeart from '../../components/HiddenHeart';
import { soundManager } from '../../utils/audio';
import { getAssetUrl } from '../../utils/assets';

interface MemoryPhoto {
  src: string;
  caption?: string;
  id?: string;
  isCustom?: boolean;
}

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
      target.dataset.retried = 'true';
      const relative = originalSrc.startsWith('/') ? '.' + originalSrc : originalSrc;
      target.src = relative;
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
                      className="cylinder-card"
                      style={{
                        transform: `rotateY(${angle}deg) translateZ(${radius}px) translateY(${yOffset}px)`,
                      }}
                      onClick={(e) => handleCardClick(idx, e)}
                      role="button"
                      tabIndex={0}
                      aria-label="Open memory photo"
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

      {/* Fullscreen Photo Modal with Silky Smooth Animation (No Numbers/Counter) */}
      <AnimatePresence>
        {selectedIdx !== null && currentPhoto && (
          <motion.div
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
              background: 'rgba(5, 5, 18, 0.88)',
              backdropFilter: 'blur(16px)',
              padding: '16px',
            }}
          >
            <motion.div
              className="gallery-modal-content"
              initial={{ scale: 0.88, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                willChange: 'transform, opacity',
              }}
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
                    prev !== null ? (prev - 1 + allPhotos.length) % allPhotos.length : 0
                  )
                }
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
                  setSelectedIdx((prev) => (prev !== null ? (prev + 1) % allPhotos.length : 0))
                }
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
                  <div style={{ color: '#ff8fb3', fontStyle: 'italic', fontSize: '0.95rem' }}>
                    "{currentPhoto.caption}"
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
