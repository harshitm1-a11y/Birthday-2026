import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore, COMPANIONS, type CompanionId } from '../state/experienceStore';
import { soundManager } from '../utils/audio';
import { robotSpeaker } from '../utils/speech';

interface CreamParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

// 1. Animated Realistic Robot Character
const AnimatedRobot: React.FC<{ isMoving: boolean; isDropped?: boolean }> = ({ isMoving }) => (
  <svg width="74" height="88" viewBox="0 0 74 88" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Antenna with pulsing bulb */}
    <line x1="37" y1="18" x2="37" y2="4" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
    <circle cx="37" cy="4" r="4.5" fill="#38bdf8" className={isMoving ? 'animate-pulse' : ''}>
      <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" />
    </circle>

    {/* Ears / Bolts */}
    <rect x="10" y="26" width="5" height="10" rx="2" fill="#64748b" />
    <rect x="59" y="26" width="5" height="10" rx="2" fill="#64748b" />

    {/* Head */}
    <rect x="14" y="16" width="46" height="30" rx="10" fill="#e2e8f0" stroke="#475569" strokeWidth="2.5" />
    {/* Visor Screen */}
    <rect x="20" y="22" width="34" height="18" rx="6" fill="#0f172a" />
    {/* Visor Eyes (Cyan LED) */}
    <circle cx="28" cy="31" r="3.5" fill="#38bdf8" />
    <circle cx="46" cy="31" r="3.5" fill="#38bdf8" />

    {/* Neck */}
    <rect x="33" y="46" width="8" height="4" fill="#94a3b8" />

    {/* Torso */}
    <rect x="18" y="50" width="38" height="24" rx="8" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
    {/* Heart Battery Gauge */}
    <rect x="25" y="56" width="24" height="8" rx="4" fill="#334155" />
    <rect x="27" y="58" width="16" height="4" rx="2" fill="#ec4899" />

    {/* Animated Arms */}
    <g style={{ transformOrigin: '16px 54px' }}>
      <line x1="18" y1="54" x2="10" y2="68" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-15 18 54; 20 18 54; -15 18 54" dur="0.35s" repeatCount="indefinite" />}
      </line>
      <circle cx="10" cy="68" r="3" fill="#64748b" />
    </g>
    <g style={{ transformOrigin: '56px 54px' }}>
      <line x1="56" y1="54" x2="64" y2="68" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="20 56 54; -15 56 54; 20 56 54" dur="0.35s" repeatCount="indefinite" />}
      </line>
      <circle cx="64" cy="68" r="3" fill="#64748b" />
    </g>

    {/* Animated Walking Legs */}
    <g style={{ transformOrigin: '28px 74px' }}>
      <rect x="24" y="74" width="8" height="12" rx="4" fill="#64748b">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-18 28 74; 18 28 74; -18 28 74" dur="0.35s" repeatCount="indefinite" />}
      </rect>
    </g>
    <g style={{ transformOrigin: '46px 74px' }}>
      <rect x="42" y="74" width="8" height="12" rx="4" fill="#64748b">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="18 46 74; -18 46 74; 18 46 74" dur="0.35s" repeatCount="indefinite" />}
      </rect>
    </g>
  </svg>
);

// 2. Animated Realistic Teddy Bear Character
const AnimatedTeddy: React.FC<{ isMoving: boolean; isDropped: boolean }> = ({ isMoving }) => (
  <svg width="74" height="88" viewBox="0 0 74 88" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ears */}
    <circle cx="18" cy="18" r="10" fill="#b45309" stroke="#78350f" strokeWidth="2" />
    <circle cx="18" cy="18" r="5" fill="#fef3c7" />
    <circle cx="56" cy="18" r="10" fill="#b45309" stroke="#78350f" strokeWidth="2" />
    <circle cx="56" cy="18" r="5" fill="#fef3c7" />

    {/* Head */}
    <circle cx="37" cy="30" r="22" fill="#d97706" stroke="#92400e" strokeWidth="2" />
    {/* Snout */}
    <ellipse cx="37" cy="36" rx="10" ry="8" fill="#fef3c7" />
    {/* Nose & Smile */}
    <polygon points="34,33 40,33 37,36" fill="#451a03" />
    <path d="M34 38 Q37 41 40 38" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Eyes */}
    <circle cx="28" cy="27" r="3" fill="#18181b" />
    <circle cx="29" cy="26" r="1" fill="#ffffff" />
    <circle cx="46" cy="27" r="3" fill="#18181b" />
    <circle cx="47" cy="26" r="1" fill="#ffffff" />

    {/* Body */}
    <ellipse cx="37" cy="60" rx="18" ry="16" fill="#d97706" stroke="#92400e" strokeWidth="2" />
    <ellipse cx="37" cy="60" rx="11" ry="10" fill="#fef3c7" />

    {/* Red Ribbon Bow */}
    <polygon points="30,48 44,48 37,52" fill="#ef4444" />
    <polygon points="30,56 44,56 37,52" fill="#ef4444" />
    <circle cx="37" cy="52" r="3" fill="#b91c1c" />

    {/* Paws */}
    <ellipse cx="16" cy="55" rx="5" ry="7" fill="#b45309" />
    <ellipse cx="58" cy="55" rx="5" ry="7" fill="#b45309" />

    {/* Walking Feet */}
    <g style={{ transformOrigin: '28px 74px' }}>
      <ellipse cx="26" cy="78" rx="8" ry="6" fill="#b45309">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-16 28 74; 16 28 74; -16 28 74" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>
    <g style={{ transformOrigin: '46px 74px' }}>
      <ellipse cx="48" cy="78" rx="8" ry="6" fill="#b45309">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="16 46 74; -16 46 74; 16 46 74" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>
  </svg>
);

// 3. Animated Realistic Penguin Character
const AnimatedPenguin: React.FC<{ isMoving: boolean; isDropped: boolean }> = ({ isMoving }) => (
  <svg width="74" height="88" viewBox="0 0 74 88" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body / Tuxedo */}
    <ellipse cx="37" cy="46" rx="22" ry="28" fill="#0f172a" stroke="#334155" strokeWidth="2" />
    {/* White Belly */}
    <ellipse cx="37" cy="48" rx="14" ry="22" fill="#ffffff" />

    {/* Eyes */}
    <circle cx="30" cy="30" r="3.5" fill="#0f172a" />
    <circle cx="31" cy="29" r="1.2" fill="#ffffff" />
    <circle cx="44" cy="30" r="3.5" fill="#0f172a" />
    <circle cx="45" cy="29" r="1.2" fill="#ffffff" />

    {/* Orange Beak */}
    <polygon points="33,36 41,36 37,42" fill="#f97316" />

    {/* Red Chef Scarf */}
    <path d="M26 42 Q37 46 48 42 L46 47 Q37 50 28 47 Z" fill="#ef4444" />

    {/* Flippers */}
    <g style={{ transformOrigin: '15px 44px' }}>
      <ellipse cx="14" cy="50" rx="4" ry="12" fill="#0f172a" transform="rotate(-15 14 50)">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-25 15 44; 10 15 44; -25 15 44" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>
    <g style={{ transformOrigin: '59px 44px' }}>
      <ellipse cx="60" cy="50" rx="4" ry="12" fill="#0f172a" transform="rotate(15 60 50)">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="10 59 44; -25 59 44; 10 59 44" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>

    {/* Waddling Orange Webbed Feet */}
    <g style={{ transformOrigin: '28px 72px' }}>
      <ellipse cx="26" cy="76" rx="9" ry="5" fill="#ea580c">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-18 28 72; 18 28 72; -18 28 72" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>
    <g style={{ transformOrigin: '46px 72px' }}>
      <ellipse cx="48" cy="76" rx="9" ry="5" fill="#ea580c">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="18 46 72; -18 46 72; 18 46 72" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>
  </svg>
);

// 4. Animated Realistic Kitty Character
const AnimatedKitty: React.FC<{ isMoving: boolean; isDropped: boolean }> = ({ isMoving }) => (
  <svg width="74" height="88" viewBox="0 0 74 88" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tail */}
    <path d="M52 64 Q66 58 64 42" stroke="#ea580c" strokeWidth="5" strokeLinecap="round" fill="none">
      {isMoving && <animate attributeName="d" values="M52 64 Q66 58 64 42; M52 64 Q68 64 62 48; M52 64 Q66 58 64 42" dur="0.5s" repeatCount="indefinite" />}
    </path>

    {/* Ears */}
    <polygon points="18,30 24,10 32,24" fill="#ea580c" />
    <polygon points="21,26 25,14 30,22" fill="#fda4af" />
    <polygon points="56,30 50,10 42,24" fill="#ea580c" />
    <polygon points="53,26 49,14 44,22" fill="#fda4af" />

    {/* Head */}
    <circle cx="37" cy="32" r="18" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
    {/* White muzzle */}
    <ellipse cx="37" cy="38" rx="9" ry="6" fill="#ffffff" />
    <polygon points="35,35 39,35 37,37" fill="#ec4899" />
    {/* Whiskers */}
    <line x1="20" y1="36" x2="30" y2="37" stroke="#475569" strokeWidth="1.2" />
    <line x1="20" y1="40" x2="30" y2="39" stroke="#475569" strokeWidth="1.2" />
    <line x1="44" y1="37" x2="54" y2="36" stroke="#475569" strokeWidth="1.2" />
    <line x1="44" y1="39" x2="54" y2="40" stroke="#475569" strokeWidth="1.2" />

    {/* Green Emerald Eyes */}
    <ellipse cx="29" cy="30" rx="3" ry="4" fill="#10b981" />
    <ellipse cx="29" cy="30" rx="1" ry="3.5" fill="#064e3b" />
    <ellipse cx="45" cy="30" rx="3" ry="4" fill="#10b981" />
    <ellipse cx="45" cy="30" rx="1" ry="3.5" fill="#064e3b" />

    {/* Body */}
    <ellipse cx="37" cy="58" rx="16" ry="14" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
    <ellipse cx="37" cy="58" rx="9" ry="9" fill="#ffffff" />

    {/* Walking Paws */}
    <g style={{ transformOrigin: '28px 72px' }}>
      <ellipse cx="27" cy="74" rx="6" ry="4" fill="#ffffff">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-18 28 72; 18 28 72; -18 28 72" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>
    <g style={{ transformOrigin: '46px 72px' }}>
      <ellipse cx="47" cy="74" rx="6" ry="4" fill="#ffffff">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="18 46 72; -18 46 72; 18 46 72" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>
  </svg>
);

// 5. Animated Realistic Astronaut Character
const AnimatedAstro: React.FC<{ isMoving: boolean; isDropped: boolean }> = ({ isMoving }) => (
  <svg width="74" height="88" viewBox="0 0 74 88" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Oxygen Backpack */}
    <rect x="18" y="34" width="38" height="30" rx="8" fill="#94a3b8" />

    {/* Helmet */}
    <circle cx="37" cy="26" r="20" fill="#f8fafc" stroke="#475569" strokeWidth="2.5" />
    {/* Gold Visor with Star Glow Reflection */}
    <ellipse cx="37" cy="26" rx="13" ry="10" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
    <path d="M30 22 Q37 19 42 21" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Spacesuit Body */}
    <rect x="22" y="46" width="30" height="24" rx="8" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
    {/* Chest Mission Patch */}
    <circle cx="28" cy="53" r="3.5" fill="#3b82f6" />
    <rect x="36" y="52" width="10" height="3" rx="1" fill="#ef4444" />

    {/* Arms */}
    <g style={{ transformOrigin: '20px 48px' }}>
      <rect x="14" y="48" width="8" height="18" rx="4" fill="#e2e8f0">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-15 20 48; 15 20 48; -15 20 48" dur="0.35s" repeatCount="indefinite" />}
      </rect>
    </g>
    <g style={{ transformOrigin: '54px 48px' }}>
      <rect x="52" y="48" width="8" height="18" rx="4" fill="#e2e8f0">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="15 54 48; -15 54 48; 15 54 48" dur="0.35s" repeatCount="indefinite" />}
      </rect>
    </g>

    {/* Walking Boots */}
    <g style={{ transformOrigin: '28px 70px' }}>
      <rect x="23" y="70" width="10" height="14" rx="4" fill="#64748b">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-18 28 70; 18 28 70; -18 28 70" dur="0.35s" repeatCount="indefinite" />}
      </rect>
    </g>
    <g style={{ transformOrigin: '46px 70px' }}>
      <rect x="41" y="70" width="10" height="14" rx="4" fill="#64748b">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="18 46 70; -18 46 70; 18 46 70" dur="0.35s" repeatCount="indefinite" />}
      </rect>
    </g>
  </svg>
);

export const RoamingCompanion: React.FC = () => {
  const currentScene = useExperienceStore((s) => s.currentScene);
  const selectedCompanionId = useExperienceStore((s) => s.selectedCompanion);
  const setCompanion = useExperienceStore((s) => s.setCompanion);
  const dropCompanionCake = useExperienceStore((s) => s.dropCompanionCake);
  const cakesDropped = useExperienceStore((s) => s.companionCakesDropped);
  const setCakeDelivered = useExperienceStore((s) => s.setCakeDelivered);

  const companion = COMPANIONS[selectedCompanionId] || COMPANIONS.robo;

  // Grounded position state (fixed at bottom 74px, moves naturally along X)
  const [posX, setPosX] = useState(20);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isMoving, setIsMoving] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [isFetchingNewCake, setIsFetchingNewCake] = useState(false);
  const [speechText, setSpeechText] = useState(companion.intro);
  const [isSpeechOpen, setIsSpeechOpen] = useState(true);
  const [isChooserOpen, setIsChooserOpen] = useState(false);
  const [splatParticles, setSplatParticles] = useState<CreamParticle[]>([]);

  const targetXRef = useRef<number>(20);

  // Natural Distance Cursor Following (Stays ~80px-120px away from cursor, never sits right under cursor)
  useEffect(() => {
    let rafId: number;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (isDropped || isFetchingNewCake) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;

      if (typeof window !== 'undefined') {
        const rawPct = (clientX / window.innerWidth) * 100;
        // Keep companion ~8-12% distance away from the pointer
        const offsetPct = clientX > (window.innerWidth * posX) / 100 ? -9 : 9;
        const clampedPct = Math.max(6, Math.min(88, rawPct + offsetPct));
        targetXRef.current = clampedPct;
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    // Smooth easing follow loop
    const updatePosition = () => {
      if (!isDropped && !isFetchingNewCake) {
        if (currentScene === 4) {
          // In Cake scene (Scene 4), move proudly to bottom-center (50%) to present the cake
          setPosX((prev) => (Math.abs(50 - prev) > 0.4 ? prev + (50 - prev) * 0.08 : 50));
          setDirection(1);
          setIsMoving(false);
        } else {
          setPosX((prevX) => {
            const dx = targetXRef.current - prevX;
            if (Math.abs(dx) > 0.3) {
              setDirection(dx > 0 ? 1 : -1);
              setIsMoving(true);
              return prevX + dx * 0.07; // Natural trailing walking pace
            } else {
              setIsMoving(false);
              return prevX;
            }
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
  }, [isDropped, isFetchingNewCake, currentScene, posX]);

  // Cake Scene dialogue update
  useEffect(() => {
    if (currentScene === 4) {
      const text = 'Lo Sameeksha baby, aapka special birthday cake hazir hai! 🎂✨';
      setSpeechText(text);
      setIsSpeechOpen(true);
      setCakeDelivered(true);
      robotSpeaker.speak(text);
    }
  }, [currentScene, setCakeDelivered]);

  // Click on companion: DROP THE CAKE!
  const handleCompanionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDropped || isFetchingNewCake) return;

    soundManager.playCakeSplatSound();
    dropCompanionCake();
    setIsDropped(true);
    const dropText = 'Arey Baap Re! 😱 Cake gir gaya!';
    setSpeechText(dropText);
    setIsSpeechOpen(true);
    robotSpeaker.speak(dropText);

    // Splat cream particles
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
      const rushText = 'Rukiye rukiye! Main abhi aapke liye naya fresh cake leke aata hu! 🏃💨';
      setSpeechText(rushText);
      robotSpeaker.speak(rushText);
    }, 1400);

    // Mascot returns with brand new cake
    setTimeout(() => {
      soundManager.playCakeDeliverySound();
      setIsDropped(false);
      setIsFetchingNewCake(false);
      const returnText = 'Ta-da! Naya fresh cake hazir hai aapke liye! 🎂✨';
      setSpeechText(returnText);
      robotSpeaker.speak(returnText);
      setSplatParticles([]);
    }, 3400);

    setTimeout(() => {
      setIsSpeechOpen(false);
    }, 6500);
  };

  const renderAnimatedMascot = () => {
    switch (selectedCompanionId) {
      case 'teddy':
        return <AnimatedTeddy isMoving={isMoving} isDropped={isDropped} />;
      case 'penguin':
        return <AnimatedPenguin isMoving={isMoving} isDropped={isDropped} />;
      case 'kitty':
        return <AnimatedKitty isMoving={isMoving} isDropped={isDropped} />;
      case 'astro':
        return <AnimatedAstro isMoving={isMoving} isDropped={isDropped} />;
      case 'robo':
      default:
        return <AnimatedRobot isMoving={isMoving} isDropped={isDropped} />;
    }
  };

  return (
    <>
      {/* Grounded Roaming Companion Container: POINTER EVENTS NONE on container so it NEVER intercepts clicks! */}
      <div
        style={{
          position: 'fixed',
          bottom: '74px',
          left: `${posX}%`,
          transform: `translateX(-50%) scaleX(${direction})`,
          transition: isFetchingNewCake ? 'left 0.8s ease-in-out' : 'transform 0.15s ease',
          zIndex: 85,
          pointerEvents: 'none',
        }}
      >
        {/* Floating Dialogue Speech Bubble */}
        <AnimatePresence>
          {isSpeechOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                position: 'absolute',
                bottom: '105px',
                left: '50%',
                transform: `translateX(-50%) scaleX(${direction})`,
                background: 'rgba(17, 12, 34, 0.94)',
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
              <div
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  width: '12px',
                  height: '12px',
                  background: 'rgba(17, 12, 34, 0.94)',
                  borderRight: '1px solid rgba(251, 191, 36, 0.45)',
                  borderBottom: '1px solid rgba(251, 191, 36, 0.45)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot Avatar Body */}
        <motion.div
          onClick={handleCompanionClick}
          animate={
            isDropped
              ? { rotate: [0, -20, 20, -15, 0], scale: [1, 1.15, 0.95, 1] }
              : isMoving
              ? { y: [0, -6, 0], rotate: [-2, 2, -2] }
              : { y: [0, -3, 0] }
          }
          transition={
            isDropped
              ? { duration: 0.6, repeat: 2 }
              : isMoving
              ? { duration: 0.28, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            pointerEvents: 'auto',
            cursor: 'pointer',
          }}
        >
          {/* Animated SVG Character */}
          <div
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))',
              userSelect: 'none',
            }}
          >
            {renderAnimatedMascot()}
          </div>

          {/* Mini Birthday Cake in Hands */}
          <AnimatePresence>
            {!isDropped && !isFetchingNewCake && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                style={{
                  marginTop: '-12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.18)',
                  borderRadius: '50%',
                  padding: '2px 5px',
                  boxShadow: '0 0 12px rgba(251, 191, 36, 0.55)',
                }}
              >
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🎂</span>
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
            background: 'rgba(0, 0, 0, 0.75)',
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
          background: 'rgba(17, 12, 34, 0.88)',
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
