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

// 1. Ultra-Realistic & Adorable Animated Teddy Bear (Main & Star Companion!)
const RealisticTeddy: React.FC<{ isMoving: boolean; hasKnife?: boolean; isCutting?: boolean }> = ({
  isMoving,
  hasKnife,
  isCutting,
}) => (
  <svg width="84" height="96" viewBox="0 0 84 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="teddyEarGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="70%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </radialGradient>
      <radialGradient id="teddyFurGrad" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="85%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </radialGradient>
      <radialGradient id="teddySnoutGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="80%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fde68a" />
      </radialGradient>
      <filter id="teddyDropShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.35" />
      </filter>
    </defs>

    {/* Ears */}
    <circle cx="20" cy="20" r="12" fill="url(#teddyEarGrad)" stroke="#78350f" strokeWidth="2" />
    <circle cx="20" cy="20" r="6" fill="#fef3c7" opacity="0.9" />
    <circle cx="64" cy="20" r="12" fill="url(#teddyEarGrad)" stroke="#78350f" strokeWidth="2" />
    <circle cx="64" cy="20" r="6" fill="#fef3c7" opacity="0.9" />

    {/* Head */}
    <ellipse cx="42" cy="34" rx="25" ry="23" fill="url(#teddyFurGrad)" stroke="#92400e" strokeWidth="2" filter="url(#teddyDropShadow)" />

    {/* Snout */}
    <ellipse cx="42" cy="41" rx="12" ry="9" fill="url(#teddySnoutGrad)" stroke="#fde68a" strokeWidth="1" />
    {/* Nose with Specular Highlight */}
    <ellipse cx="42" cy="37" rx="4.5" ry="3.5" fill="#1c1917" />
    <ellipse cx="40.5" cy="36" rx="1.2" ry="0.8" fill="#ffffff" />
    {/* Stitched Smile */}
    <path d="M38 42 Q42 46 46 42" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" fill="none" />

    {/* Expressive Glossy Eyes */}
    <circle cx="31" cy="29" r="4" fill="#09090b" />
    <circle cx="32" cy="27.5" r="1.5" fill="#ffffff" />
    <circle cx="29.5" cy="30" r="0.8" fill="#ffffff" />
    <circle cx="53" cy="29" r="4" fill="#09090b" />
    <circle cx="54" cy="27.5" r="1.5" fill="#ffffff" />
    <circle cx="51.5" cy="30" r="0.8" fill="#ffffff" />

    {/* Body */}
    <ellipse cx="42" cy="67" rx="21" ry="19" fill="url(#teddyFurGrad)" stroke="#92400e" strokeWidth="2" />
    {/* Belly Patch */}
    <ellipse cx="42" cy="67" rx="13" ry="12" fill="url(#teddySnoutGrad)" opacity="0.9" />

    {/* Red Ribbon Bow Tie */}
    <polygon points="34,53 50,53 42,57" fill="#ef4444" />
    <polygon points="34,61 50,61 42,57" fill="#ef4444" />
    <circle cx="42" cy="57" r="3.5" fill="#b91c1c" />
    <circle cx="42" cy="57" r="1.5" fill="#fbbf24" />

    {/* Left Arm & Paw */}
    <g style={{ transformOrigin: '21px 60px' }}>
      <ellipse cx="20" cy="62" rx="7" ry="9" fill="url(#teddyFurGrad)" stroke="#92400e" strokeWidth="1.5">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-15 21 60; 15 21 60; -15 21 60" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>

    {/* Right Arm & Paw (Holds Chef Knife if in Cake Scene) */}
    <g style={{ transformOrigin: '63px 60px' }}>
      <ellipse cx="64" cy="62" rx="7" ry="9" fill="url(#teddyFurGrad)" stroke="#92400e" strokeWidth="1.5">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="15 63 60; -15 63 60; 15 63 60" dur="0.32s" repeatCount="indefinite" />}
        {isCutting && <animateTransform attributeName="transform" type="rotate" values="0 63 60; -45 63 60; 30 63 60; 0 63 60" dur="0.4s" repeatCount="3" />}
      </ellipse>

      {/* 3D Chef Knife in Paw */}
      {hasKnife && (
        <g transform="translate(62, 42) rotate(25)">
          {/* Blade */}
          <polygon points="0,0 6,-30 14,-32 14,0" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
          <line x1="4" y1="-28" x2="12" y2="-2" stroke="#e2e8f0" strokeWidth="2" />
          {/* Gold Guard */}
          <rect x="-2" y="0" width="18" height="4" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
          {/* Wooden Handle */}
          <rect x="2" y="4" width="10" height="18" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        </g>
      )}
    </g>

    {/* Walking Paws / Feet */}
    <g style={{ transformOrigin: '30px 84px' }}>
      <ellipse cx="30" cy="87" rx="9" ry="7" fill="url(#teddyEarGrad)" stroke="#78350f" strokeWidth="1.5">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-18 30 84; 18 30 84; -18 30 84" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>
    <g style={{ transformOrigin: '54px 84px' }}>
      <ellipse cx="54" cy="87" rx="9" ry="7" fill="url(#teddyEarGrad)" stroke="#78350f" strokeWidth="1.5">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="18 54 84; -18 54 84; 18 54 84" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>
  </svg>
);

// 2. Ultra-Realistic & Cute Animated Penguin (Mr. Waddles)
const RealisticPenguin: React.FC<{ isMoving: boolean; hasKnife?: boolean; isCutting?: boolean }> = ({
  isMoving,
  hasKnife,
  isCutting,
}) => (
  <svg width="84" height="96" viewBox="0 0 84 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="penguinBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="50%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="penguinBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="85%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>

    {/* Head & Body Tuxedo Shell */}
    <ellipse cx="42" cy="50" rx="26" ry="32" fill="url(#penguinBodyGrad)" stroke="#334155" strokeWidth="2" />

    {/* Snowy White Belly */}
    <ellipse cx="42" cy="54" rx="17" ry="24" fill="url(#penguinBellyGrad)" />

    {/* Cute Pink Blush Cheeks */}
    <circle cx="28" cy="36" r="4.5" fill="#fda4af" opacity="0.6" />
    <circle cx="56" cy="36" r="4.5" fill="#fda4af" opacity="0.6" />

    {/* Big Expressive Glossy Eyes */}
    <ellipse cx="33" cy="31" rx="4.5" ry="5.5" fill="#09090b" />
    <circle cx="34.5" cy="29" r="1.8" fill="#ffffff" />
    <circle cx="31.5" cy="33" r="0.9" fill="#ffffff" />

    <ellipse cx="51" cy="31" rx="4.5" ry="5.5" fill="#09090b" />
    <circle cx="52.5" cy="29" r="1.8" fill="#ffffff" />
    <circle cx="49.5" cy="33" r="0.9" fill="#ffffff" />

    {/* 3D Curved Orange Beak */}
    <path d="M36 38 Q42 36 48 38 L42 45 Z" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
    <ellipse cx="42" cy="39" rx="3" ry="1.2" fill="#fdba74" />

    {/* Red Chef Bandana / Bow */}
    <path d="M28 47 Q42 52 56 47 L54 53 Q42 57 30 53 Z" fill="#ef4444" />
    <circle cx="42" cy="53" r="3" fill="#b91c1c" />

    {/* Left Flipper Wing */}
    <g style={{ transformOrigin: '16px 48px' }}>
      <ellipse cx="14" cy="55" rx="5" ry="14" fill="url(#penguinBodyGrad)" transform="rotate(-18 14 55)">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-30 16 48; 15 16 48; -30 16 48" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>

    {/* Right Flipper Wing (Can Hold Knife) */}
    <g style={{ transformOrigin: '68px 48px' }}>
      <ellipse cx="70" cy="55" rx="5" ry="14" fill="url(#penguinBodyGrad)" transform="rotate(18 70 55)">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="15 68 48; -30 68 48; 15 68 48" dur="0.32s" repeatCount="indefinite" />}
        {isCutting && <animateTransform attributeName="transform" type="rotate" values="0 68 48; -45 68 48; 30 68 48; 0 68 48" dur="0.4s" repeatCount="3" />}
      </ellipse>

      {hasKnife && (
        <g transform="translate(68, 38) rotate(30)">
          <polygon points="0,0 6,-30 14,-32 14,0" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
          <rect x="-2" y="0" width="18" height="4" rx="2" fill="#fbbf24" />
          <rect x="2" y="4" width="10" height="18" rx="3" fill="#78350f" />
        </g>
      )}
    </g>

    {/* Waddling Orange Webbed Feet */}
    <g style={{ transformOrigin: '32px 80px' }}>
      <ellipse cx="30" cy="85" rx="10" ry="6" fill="#f97316" stroke="#c2410c" strokeWidth="1.5">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-20 32 80; 20 32 80; -20 32 80" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>
    <g style={{ transformOrigin: '52px 80px' }}>
      <ellipse cx="54" cy="85" rx="10" ry="6" fill="#f97316" stroke="#c2410c" strokeWidth="1.5">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="20 52 80; -20 52 80; 20 52 80" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>
  </svg>
);

// 3. Realistic Animated Robot (Robo-Bunny)
const RealisticRobot: React.FC<{ isMoving: boolean; hasKnife?: boolean; isCutting?: boolean }> = ({
  isMoving,
  hasKnife,
  isCutting,
}) => (
  <svg width="84" height="96" viewBox="0 0 84 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pulsing LED Antenna */}
    <line x1="42" y1="20" x2="42" y2="5" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="42" cy="5" r="5" fill="#38bdf8">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
    </circle>

    {/* Head */}
    <rect x="18" y="18" width="48" height="32" rx="10" fill="#e2e8f0" stroke="#475569" strokeWidth="2.5" />
    {/* Visor Screen */}
    <rect x="24" y="24" width="36" height="20" rx="6" fill="#0f172a" />
    {/* Glowing Eyes */}
    <circle cx="33" cy="34" r="4" fill="#38bdf8" />
    <circle cx="51" cy="34" r="4" fill="#38bdf8" />

    {/* Torso */}
    <rect x="22" y="54" width="40" height="26" rx="8" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
    {/* Battery Indicator */}
    <rect x="30" y="62" width="24" height="10" rx="4" fill="#334155" />
    <rect x="32" y="64" width="18" height="6" rx="2" fill="#ec4899" />

    {/* Arms */}
    <g style={{ transformOrigin: '22px 58px' }}>
      <line x1="22" y1="58" x2="12" y2="72" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-15 22 58; 20 22 58; -15 22 58" dur="0.35s" repeatCount="indefinite" />}
      </line>
    </g>
    <g style={{ transformOrigin: '62px 58px' }}>
      <line x1="62" y1="58" x2="72" y2="72" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="20 62 58; -15 62 58; 20 62 58" dur="0.35s" repeatCount="indefinite" />}
        {isCutting && <animateTransform attributeName="transform" type="rotate" values="0 62 58; -45 62 58; 30 62 58; 0 62 58" dur="0.4s" repeatCount="3" />}
      </line>
      {hasKnife && (
        <g transform="translate(68, 50) rotate(25)">
          <polygon points="0,0 6,-30 14,-32 14,0" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
          <rect x="-2" y="0" width="18" height="4" rx="2" fill="#fbbf24" />
          <rect x="2" y="4" width="10" height="18" rx="3" fill="#78350f" />
        </g>
      )}
    </g>

    {/* Moving Track Feet */}
    <g style={{ transformOrigin: '32px 80px' }}>
      <rect x="26" y="80" width="12" height="14" rx="5" fill="#64748b">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-18 32 80; 18 32 80; -18 32 80" dur="0.35s" repeatCount="indefinite" />}
      </rect>
    </g>
    <g style={{ transformOrigin: '52px 80px' }}>
      <rect x="46" y="80" width="12" height="14" rx="5" fill="#64748b">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="18 52 80; -18 52 80; 18 52 80" dur="0.35s" repeatCount="indefinite" />}
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
  const isCompanionCuttingCake = useExperienceStore((s) => s.isCompanionCuttingCake);
  const finishCompanionCakeCut = useExperienceStore((s) => s.finishCompanionCakeCut);
  const cakeCutDone = useExperienceStore((s) => s.cakeCutDone);

  const companion = COMPANIONS[selectedCompanionId] || COMPANIONS.teddy;

  // 2D Full-Screen position state (% of viewport)
  const [posX, setPosX] = useState(25);
  const [posY, setPosY] = useState(72);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isMoving, setIsMoving] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [isFetchingNewCake, setIsFetchingNewCake] = useState(false);
  const [speechText, setSpeechText] = useState(companion.intro);
  const [isSpeechOpen, setIsSpeechOpen] = useState(true);
  const [isChooserOpen, setIsChooserOpen] = useState(false);
  const [splatParticles, setSplatParticles] = useState<CreamParticle[]>([]);

  const targetXRef = useRef<number>(25);
  const targetYRef = useRef<number>(72);
  const lastMouseMoveRef = useRef<number>(Date.now());

  // Full Screen 2D Cursor Following & Mobile Wandering Engine
  useEffect(() => {
    let rafId: number;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (isDropped || isFetchingNewCake || isCompanionCuttingCake) return;
      lastMouseMoveRef.current = Date.now();

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      if (typeof window !== 'undefined') {
        const rawPctX = (clientX / window.innerWidth) * 100;
        const rawPctY = (clientY / window.innerHeight) * 100;

        // Polite distance offset (~8-10% away so it never covers what user is clicking)
        const offsetX = clientX > (window.innerWidth * posX) / 100 ? -9 : 9;
        const clampedX = Math.max(6, Math.min(88, rawPctX + offsetX));
        const clampedY = Math.max(16, Math.min(82, rawPctY + 4));

        targetXRef.current = clampedX;
        targetYRef.current = clampedY;
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    // Mobile / Idle Wandering Timer: Roams naturally across screen when untouched!
    const idleInterval = setInterval(() => {
      const now = Date.now();
      if (now - lastMouseMoveRef.current > 3000 && !isCompanionCuttingCake && currentScene !== 4) {
        // Pick friendly roaming coordinate on screen
        targetXRef.current = 15 + Math.random() * 70;
        targetYRef.current = 35 + Math.random() * 45;
      }
    }, 4500);

    // Smooth physics loop
    const updatePosition = () => {
      if (!isDropped && !isFetchingNewCake) {
        if (isCompanionCuttingCake || currentScene === 4) {
          // In Cake Scene cutting mode: Companion steps proudly to cake center
          const targetCakeX = 50;
          const targetCakeY = 68;
          setPosX((prev) => (Math.abs(targetCakeX - prev) > 0.3 ? prev + (targetCakeX - prev) * 0.1 : targetCakeX));
          setPosY((prev) => (Math.abs(targetCakeY - prev) > 0.3 ? prev + (targetCakeY - prev) * 0.1 : targetCakeY));
          setDirection(1);
          setIsMoving(false);
        } else {
          setPosX((prevX) => {
            const dx = targetXRef.current - prevX;
            if (Math.abs(dx) > 0.35) {
              setDirection(dx > 0 ? 1 : -1);
              setIsMoving(true);
              return prevX + dx * 0.07;
            } else {
              setIsMoving(false);
              return prevX;
            }
          });

          setPosY((prevY) => {
            const dy = targetYRef.current - prevY;
            if (Math.abs(dy) > 0.35) {
              return prevY + dy * 0.07;
            }
            return prevY;
          });
        }
      }
      rafId = requestAnimationFrame(updatePosition);
    };

    rafId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      clearInterval(idleInterval);
      cancelAnimationFrame(rafId);
    };
  }, [isDropped, isFetchingNewCake, isCompanionCuttingCake, currentScene, posX, posY]);

  // Cake Scene companion knife cut trigger!
  useEffect(() => {
    if (isCompanionCuttingCake && !cakeCutDone) {
      soundManager.playTwinkle();
      const cutAnnounce = `Hatto sabhi! ${companion.name} cake cut karne laga hai! 🔪🎂`;
      setSpeechText(cutAnnounce);
      setIsSpeechOpen(true);

      // Companion swings the knife and cuts cake
      setTimeout(() => {
        soundManager.playCakeSliceSound();
        soundManager.playPopperBurstSound();
        finishCompanionCakeCut();
        const successText = `Wah! Cake cut ho gaya! Happy Birthday Meri Jaan Sameeksha! 🎉🍰💖`;
        setSpeechText(successText);
        robotSpeaker.speak(successText);
      }, 1200);
    }
  }, [isCompanionCuttingCake, cakeCutDone, finishCompanionCakeCut, companion.name]);

  // Cake Scene entry dialogue
  useEffect(() => {
    if (currentScene === 4 && !cakeCutDone) {
      const text = `Lo Sameeksha baby, knife mere pass hai! Cake par tap kijiye main cut karta hu! 🎂🔪`;
      setSpeechText(text);
      setIsSpeechOpen(true);
      robotSpeaker.speak(text);
    }
  }, [currentScene, cakeCutDone]);

  // Click on companion: DROP THE CAKE!
  const handleCompanionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDropped || isFetchingNewCake || isCompanionCuttingCake) return;

    soundManager.playCakeSplatSound();
    dropCompanionCake();
    setIsDropped(true);
    const dropText = 'Arey Baap Re! 😱 Cake gir gaya!';
    setSpeechText(dropText);
    setIsSpeechOpen(true);
    robotSpeaker.speak(dropText);

    // Cream particles
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

    setTimeout(() => {
      setIsFetchingNewCake(true);
      const rushText = 'Rukiye! Main abhi aapke liye naya fresh cake leke aata hu! 🏃💨';
      setSpeechText(rushText);
      robotSpeaker.speak(rushText);
    }, 1400);

    setTimeout(() => {
      soundManager.playCakeDeliverySound();
      setIsDropped(false);
      setIsFetchingNewCake(false);
      const returnText = 'Ta-da! Naya fresh cake hazir hai! 🎂✨';
      setSpeechText(returnText);
      robotSpeaker.speak(returnText);
      setSplatParticles([]);
    }, 3400);

    setTimeout(() => {
      setIsSpeechOpen(false);
    }, 6500);
  };

  const renderAnimatedMascot = () => {
    const hasKnife = currentScene === 4 && !cakeCutDone;
    switch (selectedCompanionId) {
      case 'penguin':
        return <RealisticPenguin isMoving={isMoving} hasKnife={hasKnife} isCutting={isCompanionCuttingCake} />;
      case 'robo':
        return <RealisticRobot isMoving={isMoving} hasKnife={hasKnife} isCutting={isCompanionCuttingCake} />;
      case 'teddy':
      default:
        return <RealisticTeddy isMoving={isMoving} hasKnife={hasKnife} isCutting={isCompanionCuttingCake} />;
    }
  };

  return (
    <>
      {/* 2D Full Screen Roaming Companion Container: POINTER EVENTS NONE on container so screen clicks pass through! */}
      <div
        style={{
          position: 'fixed',
          top: `${posY}%`,
          left: `${posX}%`,
          transform: `translate(-50%, -50%) scaleX(${direction})`,
          transition: isFetchingNewCake ? 'left 0.8s ease, top 0.8s ease' : 'transform 0.15s ease',
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
              : isCompanionCuttingCake
              ? { y: [0, -14, 10, 0], scale: [1, 1.1, 1] }
              : isMoving
              ? { y: [0, -6, 0], rotate: [-2, 2, -2] }
              : { y: [0, -3, 0] }
          }
          transition={
            isDropped
              ? { duration: 0.6, repeat: 2 }
              : isCompanionCuttingCake
              ? { duration: 0.35, repeat: 3 }
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

          {/* Mini Birthday Cake in Hands (Unless dropped or in Cake scene where holding knife) */}
          <AnimatePresence>
            {!isDropped && !isFetchingNewCake && currentScene !== 4 && (
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
          {companion.name} {currentScene === 4 && !cakeCutDone ? '🔪 Chef Knife' : ''} {cakesDropped > 0 ? `(Dropped: ${cakesDropped}x)` : ''}
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
                      Teddy Bear is your main friend! Tap to switch companions!
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
                            {c.name} {c.id === 'teddy' ? '⭐ (Main)' : ''}
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
