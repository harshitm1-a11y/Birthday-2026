import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore, COMPANIONS, type CompanionId } from '../state/experienceStore';
import { soundManager } from '../utils/audio';

interface CreamParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

export const RoamingCompanion: React.FC = () => {
  const currentScene = useExperienceStore((s) => s.currentScene);
  const selectedCompanionId = useExperienceStore((s) => s.selectedCompanion);
  const setCompanion = useExperienceStore((s) => s.setCompanion);
  const dropCompanionCake = useExperienceStore((s) => s.dropCompanionCake);
  const cakesDropped = useExperienceStore((s) => s.companionCakesDropped);
  const setCakeDelivered = useExperienceStore((s) => s.setCakeDelivered);

  const companion = COMPANIONS[selectedCompanionId] || COMPANIONS.robo;

  // Position state (percentage across screen width: 8% to 90%, bottom distance: 74px to 180px)
  const [posX, setPosX] = useState(25);
  const [posY, setPosY] = useState(76);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = facing right, -1 = facing left
  const [isMoving, setIsMoving] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [isFetchingNewCake, setIsFetchingNewCake] = useState(false);
  const [speechText, setSpeechText] = useState(companion.intro);
  const [isSpeechOpen, setIsSpeechOpen] = useState(true);
  const [isChooserOpen, setIsChooserOpen] = useState(false);
  const [splatParticles, setSplatParticles] = useState<CreamParticle[]>([]);

  const targetRef = useRef<{ x: number; y: number }>({ x: 25, y: 76 });

  // Mouse & Touch Tracking: Follow the cursor smoothly!
  useEffect(() => {
    let rafId: number;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (isDropped || isFetchingNewCake) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      if (typeof window !== 'undefined') {
        // Clamped target percentage along screen width
        const pctX = Math.max(8, Math.min(88, (clientX / window.innerWidth) * 100));
        // Vertical floating: follow cursor up to 180px above bottom
        const fromBottom = window.innerHeight - clientY;
        const btmY = Math.max(74, Math.min(180, fromBottom - 25));

        targetRef.current = { x: pctX, y: btmY };
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    // Smooth lerp follow loop
    const updatePosition = () => {
      if (!isDropped && !isFetchingNewCake) {
        if (currentScene === 4) {
          // In Cake scene (Scene 4), move proudly to center (50%) to deliver!
          setPosX((prev) => (Math.abs(50 - prev) > 0.5 ? prev + (50 - prev) * 0.1 : 50));
          setPosY((prev) => (Math.abs(76 - prev) > 1 ? prev + (76 - prev) * 0.1 : 76));
          setDirection(1);
          setIsMoving(false);
        } else {
          setPosX((prevX) => {
            const dx = targetRef.current.x - prevX;
            if (Math.abs(dx) > 0.4) {
              setDirection(dx > 0 ? 1 : -1);
              setIsMoving(true);
              return prevX + dx * 0.1; // Smooth follow speed
            } else {
              setIsMoving(false);
              return prevX;
            }
          });

          setPosY((prevY) => {
            const dy = targetRef.current.y - prevY;
            return Math.abs(dy) > 1 ? prevY + dy * 0.1 : prevY;
          });
        }
      }
      rafId = requestAnimationFrame(updatePosition);
    };

    rafId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [isDropped, isFetchingNewCake, currentScene]);

  // Cake Scene dialogue update
  useEffect(() => {
    if (currentScene === 4) {
      setSpeechText('Lo Sameeksha baby, aapka special birthday cake hazir hai! 🎂✨');
      setIsSpeechOpen(true);
      setCakeDelivered(true);
    }
  }, [currentScene, setCakeDelivered]);

  // Click on companion: DROP THE CAKE!
  const handleCompanionClick = () => {
    if (isDropped || isFetchingNewCake) return;

    soundManager.playCakeSplatSound();
    dropCompanionCake();
    setIsDropped(true);
    setSpeechText('Areyyy Baap Re! 😱 Cake gir gaya!');
    setIsSpeechOpen(true);

    // Generate splat cream particles
    const colors = ['#f43f5e', '#fbbf24', '#fff1f2', '#fda4af', '#fef08a'];
    const newParticles: CreamParticle[] = Array.from({ length: 14 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 120,
      vy: -(Math.random() * 80 + 20),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 6,
    }));
    setSplatParticles(newParticles);

    // Mascot panics and runs off to fetch a new cake
    setTimeout(() => {
      setIsFetchingNewCake(true);
      setSpeechText('Rukiye rukiye! Main abhi aapke liye naya fresh cake leke aata hu! 🏃💨');
    }, 1400);

    // Mascot returns with brand new cake
    setTimeout(() => {
      soundManager.playCakeDeliverySound();
      setIsDropped(false);
      setIsFetchingNewCake(false);
      setSpeechText('Ta-da! Naya fresh cake hazir hai aapke liye! 🎂✨');
      setSplatParticles([]);
    }, 3200);

    // Auto close bubble after 6s
    setTimeout(() => {
      setIsSpeechOpen(false);
    }, 6500);
  };

  return (
    <>
      {/* Roaming Companion Container following cursor */}
      <div
        style={{
          position: 'fixed',
          bottom: `${posY}px`,
          left: `${posX}%`,
          transform: `translateX(-50%) scaleX(${direction})`,
          transition: isFetchingNewCake ? 'left 0.8s ease-in-out' : 'transform 0.15s ease',
          zIndex: 85,
          pointerEvents: 'auto',
          cursor: 'pointer',
        }}
        onClick={handleCompanionClick}
      >
        {/* Floating Dialogue Speech Bubble (Un-mirrored for readable text) */}
        <AnimatePresence>
          {isSpeechOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                position: 'absolute',
                bottom: '100px',
                left: '50%',
                transform: `translateX(-50%) scaleX(${direction})`, // Keep text un-flipped
                background: 'rgba(17, 12, 34, 0.92)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(251, 191, 36, 0.45)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 15px rgba(251, 191, 36, 0.2)',
                borderRadius: '16px',
                padding: '8px 14px',
                color: '#fff',
                fontSize: '0.82rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {speechText}
              {/* Pointer triangle */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  width: '12px',
                  height: '12px',
                  background: 'rgba(17, 12, 34, 0.92)',
                  borderRight: '1px solid rgba(251, 191, 36, 0.45)',
                  borderBottom: '1px solid rgba(251, 191, 36, 0.45)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot Avatar Body */}
        <motion.div
          animate={
            isDropped
              ? { rotate: [0, -20, 20, -15, 0], scale: [1, 1.15, 0.95, 1] }
              : isMoving
              ? { y: [0, -8, 0], rotate: [-4, 4, -4] } // Walking bounce
              : { y: [0, -4, 0] } // Idle breathing
          }
          transition={
            isDropped
              ? { duration: 0.6, repeat: 2 }
              : isMoving
              ? { duration: 0.25, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Mascot Head & Face */}
          <div
            style={{
              fontSize: '2.8rem',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))',
              userSelect: 'none',
              lineHeight: 1,
            }}
          >
            {companion.emoji}
          </div>

          {/* Mini Birthday Cake in Hands (Unless dropped) */}
          <AnimatePresence>
            {!isDropped && !isFetchingNewCake && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                style={{
                  marginTop: '-8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  padding: '2px 4px',
                  boxShadow: '0 0 12px rgba(251, 191, 36, 0.5)',
                }}
              >
                <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>🎂</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Splat Cream on Floor when dropped */}
          {isDropped && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              style={{
                position: 'absolute',
                bottom: '-12px',
                fontSize: '1.8rem',
                filter: 'drop-shadow(0 4px 10px rgba(244, 63, 94, 0.6))',
              }}
            >
              💥🍰
            </motion.div>
          )}

          {/* Flying cream particles */}
          {splatParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: p.vx, y: p.vy, opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                background: p.color,
                boxShadow: `0 0 8px ${p.color}`,
                pointerEvents: 'none',
              }}
            />
          ))}
        </motion.div>

        {/* Mascot Name Badge & Drops Counter */}
        <div
          style={{
            marginTop: '4px',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.68rem',
            color: '#fbbf24',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
          }}
        >
          {companion.name} {cakesDropped > 0 ? `(Dropped: ${cakesDropped}x)` : ''}
        </div>
      </div>

      {/* Floating Button to Switch Companion (Bottom-Left) */}
      <motion.button
        type="button"
        onClick={() => setIsChooserOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: '22px',
          left: '16px',
          zIndex: 95,
          background: 'rgba(17, 12, 34, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(251, 191, 36, 0.4)',
          borderRadius: '9999px',
          padding: '8px 14px',
          color: '#fbbf24',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
        }}
        title="Switch Companion Character"
      >
        <span>{companion.emoji}</span>
        <span>Companion</span>
      </motion.button>

      {/* Companion Selector Drawer Modal */}
      <AnimatePresence>
        {isChooserOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              padding: '16px',
            }}
            onClick={() => setIsChooserOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: '440px',
                background: 'linear-gradient(135deg, rgba(28, 16, 52, 0.96), rgba(14, 10, 32, 0.98))',
                borderRadius: '24px',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
                overflow: 'hidden',
                color: '#fff',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.6rem' }}>🐾</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fbbf24' }}>
                      Choose Your Companion
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                      Who should deliver Sameeksha's cake? Tap to select!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChooserOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Companions List */}
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.values(COMPANIONS).map((c) => {
                  const isSelected = selectedCompanionId === c.id;
                  return (
                    <motion.div
                      key={c.id}
                      onClick={() => {
                        soundManager.playTwinkle();
                        setCompanion(c.id as CompanionId);
                        setSpeechText(c.intro);
                        setIsSpeechOpen(true);
                        setIsChooserOpen(false);
                      }}
                      whileHover={{ scale: 1.02, background: 'rgba(255, 255, 255, 0.08)' }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(251, 191, 36, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected
                          ? '1px solid rgba(251, 191, 36, 0.6)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '2rem' }}>{c.emoji}</span>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: isSelected ? '#fbbf24' : '#fff' }}>
                            {c.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                            {c.title} • "{c.intro}"
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <span style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>
                          Active ✔
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
