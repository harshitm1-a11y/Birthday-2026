import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  <svg width="88" height="100" viewBox="0 0 88 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <filter id="teddyDropShadow" x="-15%" y="-10%" width="130%" height="135%">
        <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodOpacity="0.4" />
      </filter>
    </defs>

    {/* Ground Shadow */}
    <ellipse cx="44" cy="94" rx="24" ry="5" fill="#000000" opacity="0.35">
      <animate attributeName="rx" values="24; 22; 24" dur="2.4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.35; 0.45; 0.35" dur="2.4s" repeatCount="indefinite" />
    </ellipse>

    {/* Left Ear with Natural Wiggle */}
    <g style={{ transformOrigin: '22px 22px' }}>
      <circle cx="22" cy="20" r="12" fill="url(#teddyEarGrad)" stroke="#78350f" strokeWidth="2" />
      <circle cx="22" cy="20" r="6" fill="#fef3c7" opacity="0.9" />
      <animateTransform attributeName="transform" type="rotate" values="0 22 22; -7 22 22; 5 22 22; 0 22 22" keyTimes="0; 0.9; 0.94; 0.98; 1" dur="4.2s" repeatCount="indefinite" />
    </g>

    {/* Right Ear with Natural Wiggle */}
    <g style={{ transformOrigin: '66px 22px' }}>
      <circle cx="66" cy="20" r="12" fill="url(#teddyEarGrad)" stroke="#78350f" strokeWidth="2" />
      <circle cx="66" cy="20" r="6" fill="#fef3c7" opacity="0.9" />
      <animateTransform attributeName="transform" type="rotate" values="0 66 22; 7 66 22; -5 66 22; 0 66 22" keyTimes="0; 0.9; 0.94; 0.98; 1" dur="4.2s" repeatCount="indefinite" />
    </g>

    {/* Rhythmic Breathing Body & Head Group */}
    <g style={{ transformOrigin: '44px 70px' }}>
      <animateTransform attributeName="transform" type="scale" values="1 1; 1.025 1.035; 1 1" dur="2.5s" repeatCount="indefinite" />

      {/* Body */}
      <ellipse cx="44" cy="67" rx="22" ry="20" fill="url(#teddyFurGrad)" stroke="#92400e" strokeWidth="2" />
      {/* Belly Patch */}
      <ellipse cx="44" cy="67" rx="14" ry="13" fill="url(#teddySnoutGrad)" opacity="0.92" />

      {/* Red Ribbon Bow Tie */}
      <polygon points="36,53 52,53 44,57" fill="#ef4444" />
      <polygon points="36,61 52,61 44,57" fill="#ef4444" />
      <circle cx="44" cy="57" r="3.5" fill="#b91c1c" />
      <circle cx="44" cy="57" r="1.5" fill="#fbbf24" />

      {/* Head with Soft Tilting Bob */}
      <g style={{ transformOrigin: '44px 50px' }}>
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -1.5; 0 0" dur="2.5s" repeatCount="indefinite" />

        <ellipse cx="44" cy="34" rx="26" ry="23" fill="url(#teddyFurGrad)" stroke="#92400e" strokeWidth="2" filter="url(#teddyDropShadow)" />

        {/* Snout */}
        <ellipse cx="44" cy="41" rx="13" ry="9" fill="url(#teddySnoutGrad)" stroke="#fde68a" strokeWidth="1" />
        {/* Nose with Specular Highlight */}
        <ellipse cx="44" cy="37" rx="4.8" ry="3.6" fill="#1c1917" />
        <ellipse cx="42.5" cy="36" rx="1.3" ry="0.8" fill="#ffffff" />
        {/* Stitched Happy Smile */}
        <path d="M40 42 Q44 46 48 42" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Rosy Glowing Blushing Cheeks */}
        <ellipse cx="25" cy="38" rx="5" ry="3.5" fill="#f43f5e" opacity="0.5" />
        <ellipse cx="63" cy="38" rx="5" ry="3.5" fill="#f43f5e" opacity="0.5" />

        {/* Left Eye with Natural Blinking */}
        <g>
          <circle cx="33" cy="29" r="4.2" fill="#09090b" />
          <circle cx="34.2" cy="27.5" r="1.6" fill="#ffffff" />
          <circle cx="31.8" cy="30" r="0.8" fill="#ffffff" />
          {/* Animated Eyelid */}
          <ellipse cx="33" cy="29" rx="4.6" ry="0" fill="#b45309">
            <animate attributeName="ry" values="0; 0; 0; 4.6; 0; 0" keyTimes="0; 0.88; 0.92; 0.95; 0.98; 1" dur="3.5s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Right Eye with Natural Blinking */}
        <g>
          <circle cx="55" cy="29" r="4.2" fill="#09090b" />
          <circle cx="56.2" cy="27.5" r="1.6" fill="#ffffff" />
          <circle cx="53.8" cy="30" r="0.8" fill="#ffffff" />
          {/* Animated Eyelid */}
          <ellipse cx="55" cy="29" rx="4.6" ry="0" fill="#b45309">
            <animate attributeName="ry" values="0; 0; 0; 4.6; 0; 0" keyTimes="0; 0.88; 0.92; 0.95; 0.98; 1" dur="3.5s" repeatCount="indefinite" />
          </ellipse>
        </g>
      </g>

      {/* Left Arm & Paw with Waving Animation when idle */}
      <g style={{ transformOrigin: '22px 60px' }}>
        <ellipse cx="21" cy="62" rx="7.5" ry="9.5" fill="url(#teddyFurGrad)" stroke="#92400e" strokeWidth="1.5">
          {isMoving ? (
            <animateTransform attributeName="transform" type="rotate" values="-15 22 60; 15 22 60; -15 22 60" dur="0.32s" repeatCount="indefinite" />
          ) : (
            <animateTransform attributeName="transform" type="rotate" values="0 22 60; -18 22 60; 5 22 60; -18 22 60; 0 22 60" keyTimes="0; 0.8; 0.85; 0.92; 1" dur="4.2s" repeatCount="indefinite" />
          )}
        </ellipse>
        {/* Paw Pad */}
        <circle cx="18" cy="64" r="2.2" fill="#fde68a" opacity="0.85" />
      </g>

      {/* Right Arm & Paw (Holds Chef Knife if in Cake Scene) */}
      <g style={{ transformOrigin: '65px 60px' }}>
        <ellipse cx="66" cy="62" rx="7.5" ry="9.5" fill="url(#teddyFurGrad)" stroke="#92400e" strokeWidth="1.5">
          {isMoving && <animateTransform attributeName="transform" type="rotate" values="15 65 60; -15 65 60; 15 65 60" dur="0.32s" repeatCount="indefinite" />}
          {isCutting && <animateTransform attributeName="transform" type="rotate" values="0 65 60; -45 65 60; 30 65 60; 0 65 60" dur="0.4s" repeatCount="3" />}
        </ellipse>
        {/* Paw Pad */}
        <circle cx="69" cy="64" r="2.2" fill="#fde68a" opacity="0.85" />

        {/* 3D Chef Knife in Paw */}
        {hasKnife && (
          <g transform="translate(64, 42) rotate(25)">
            <polygon points="0,0 6,-30 14,-32 14,0" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
            <line x1="4" y1="-28" x2="12" y2="-2" stroke="#e2e8f0" strokeWidth="2" />
            <rect x="-2" y="0" width="18" height="4" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
            <rect x="2" y="4" width="10" height="18" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
          </g>
        )}
      </g>
    </g>

    {/* Walking Paws / Feet */}
    <g style={{ transformOrigin: '32px 86px' }}>
      <ellipse cx="32" cy="88" rx="9.5" ry="7.5" fill="url(#teddyEarGrad)" stroke="#78350f" strokeWidth="1.5">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-18 32 86; 18 32 86; -18 32 86" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>
    <g style={{ transformOrigin: '56px 86px' }}>
      <ellipse cx="56" cy="88" rx="9.5" ry="7.5" fill="url(#teddyEarGrad)" stroke="#78350f" strokeWidth="1.5">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="18 56 86; -18 56 86; 18 56 86" dur="0.32s" repeatCount="indefinite" />}
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
  <svg width="88" height="100" viewBox="0 0 88 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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

    {/* Ground Shadow */}
    <ellipse cx="44" cy="94" rx="22" ry="5" fill="#000000" opacity="0.35" />

    {/* Rhythmic Breathing Body */}
    <g style={{ transformOrigin: '44px 70px' }}>
      <animateTransform attributeName="transform" type="scale" values="1 1; 1.02 1.03; 1 1" dur="2.4s" repeatCount="indefinite" />

      {/* Head & Body Tuxedo Shell */}
      <ellipse cx="44" cy="50" rx="26" ry="32" fill="url(#penguinBodyGrad)" stroke="#334155" strokeWidth="2" />

      {/* Snowy White Belly */}
      <ellipse cx="44" cy="54" rx="17" ry="24" fill="url(#penguinBellyGrad)" />

      {/* Cute Pink Blush Cheeks */}
      <circle cx="29" cy="36" r="4.5" fill="#fda4af" opacity="0.65" />
      <circle cx="59" cy="36" r="4.5" fill="#fda4af" opacity="0.65" />

      {/* Big Expressive Glossy Eyes with Blinking */}
      <g>
        <ellipse cx="34" cy="31" rx="4.5" ry="5.5" fill="#09090b" />
        <circle cx="35.5" cy="29" r="1.8" fill="#ffffff" />
        <circle cx="32.5" cy="33" r="0.9" fill="#ffffff" />
        <ellipse cx="34" cy="31" rx="4.8" ry="0" fill="#1e293b">
          <animate attributeName="ry" values="0; 0; 0; 5.5; 0; 0" keyTimes="0; 0.88; 0.92; 0.95; 0.98; 1" dur="3.5s" repeatCount="indefinite" />
        </ellipse>
      </g>

      <g>
        <ellipse cx="54" cy="31" rx="4.5" ry="5.5" fill="#09090b" />
        <circle cx="55.5" cy="29" r="1.8" fill="#ffffff" />
        <circle cx="52.5" cy="33" r="0.9" fill="#ffffff" />
        <ellipse cx="54" cy="31" rx="4.8" ry="0" fill="#1e293b">
          <animate attributeName="ry" values="0; 0; 0; 5.5; 0; 0" keyTimes="0; 0.88; 0.92; 0.95; 0.98; 1" dur="3.5s" repeatCount="indefinite" />
        </ellipse>
      </g>

      {/* 3D Curved Orange Beak */}
      <path d="M38 38 Q44 36 50 38 L44 45 Z" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
      <ellipse cx="44" cy="39" rx="3" ry="1.2" fill="#fdba74" />

      {/* Red Chef Bandana / Bow */}
      <path d="M30 47 Q44 52 58 47 L56 53 Q44 57 32 53 Z" fill="#ef4444" />
      <circle cx="44" cy="53" r="3" fill="#b91c1c" />

      {/* Left Flipper Wing */}
      <g style={{ transformOrigin: '18px 48px' }}>
        <ellipse cx="16" cy="55" rx="5" ry="14" fill="url(#penguinBodyGrad)" transform="rotate(-18 16 55)">
          {isMoving && <animateTransform attributeName="transform" type="rotate" values="-30 18 48; 15 18 48; -30 18 48" dur="0.32s" repeatCount="indefinite" />}
        </ellipse>
      </g>

      {/* Right Flipper Wing (Can Hold Knife) */}
      <g style={{ transformOrigin: '70px 48px' }}>
        <ellipse cx="72" cy="55" rx="5" ry="14" fill="url(#penguinBodyGrad)" transform="rotate(18 72 55)">
          {isMoving && <animateTransform attributeName="transform" type="rotate" values="15 70 48; -30 70 48; 15 70 48" dur="0.32s" repeatCount="indefinite" />}
          {isCutting && <animateTransform attributeName="transform" type="rotate" values="0 70 48; -45 70 48; 30 70 48; 0 70 48" dur="0.4s" repeatCount="3" />}
        </ellipse>

        {hasKnife && (
          <g transform="translate(70, 38) rotate(30)">
            <polygon points="0,0 6,-30 14,-32 14,0" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
            <rect x="-2" y="0" width="18" height="4" rx="2" fill="#fbbf24" />
            <rect x="2" y="4" width="10" height="18" rx="3" fill="#78350f" />
          </g>
        )}
      </g>
    </g>

    {/* Waddling Orange Webbed Feet */}
    <g style={{ transformOrigin: '33px 80px' }}>
      <ellipse cx="32" cy="85" rx="10" ry="6" fill="#f97316" stroke="#c2410c" strokeWidth="1.5">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-20 33 80; 20 33 80; -20 33 80" dur="0.32s" repeatCount="indefinite" />}
      </ellipse>
    </g>
    <g style={{ transformOrigin: '55px 80px' }}>
      <ellipse cx="56" cy="85" rx="10" ry="6" fill="#f97316" stroke="#c2410c" strokeWidth="1.5">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="20 55 80; -20 55 80; 20 55 80" dur="0.32s" repeatCount="indefinite" />}
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
  <svg width="88" height="100" viewBox="0 0 88 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ground Shadow */}
    <ellipse cx="44" cy="94" rx="20" ry="4.5" fill="#000000" opacity="0.35" />

    {/* Pulsing LED Antenna */}
    <line x1="44" y1="20" x2="44" y2="5" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="44" cy="5" r="5" fill="#38bdf8">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
    </circle>

    {/* Head */}
    <rect x="20" y="18" width="48" height="32" rx="10" fill="#e2e8f0" stroke="#475569" strokeWidth="2.5" />
    {/* Visor Screen */}
    <rect x="26" y="24" width="36" height="20" rx="6" fill="#0f172a" />
    {/* Glowing Eyes */}
    <circle cx="35" cy="34" r="4.2" fill="#38bdf8">
      <animate attributeName="r" values="4.2; 4.8; 4.2" dur="1.8s" repeatCount="indefinite" />
    </circle>
    <circle cx="53" cy="34" r="4.2" fill="#38bdf8">
      <animate attributeName="r" values="4.2; 4.8; 4.2" dur="1.8s" repeatCount="indefinite" />
    </circle>

    {/* Torso */}
    <rect x="24" y="54" width="40" height="26" rx="8" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
    {/* Battery Indicator */}
    <rect x="32" y="62" width="24" height="10" rx="4" fill="#334155" />
    <rect x="34" y="64" width="18" height="6" rx="2" fill="#ec4899" />

    {/* Arms */}
    <g style={{ transformOrigin: '24px 58px' }}>
      <line x1="24" y1="58" x2="14" y2="72" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-15 24 58; 20 24 58; -15 24 58" dur="0.35s" repeatCount="indefinite" />}
      </line>
    </g>
    <g style={{ transformOrigin: '64px 58px' }}>
      <line x1="64" y1="58" x2="74" y2="72" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="20 64 58; -15 64 58; 20 64 58" dur="0.35s" repeatCount="indefinite" />}
        {isCutting && <animateTransform attributeName="transform" type="rotate" values="0 64 58; -45 64 58; 30 64 58; 0 64 58" dur="0.4s" repeatCount="3" />}
      </line>
      {hasKnife && (
        <g transform="translate(70, 50) rotate(25)">
          <polygon points="0,0 6,-30 14,-32 14,0" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
          <rect x="-2" y="0" width="18" height="4" rx="2" fill="#fbbf24" />
          <rect x="2" y="4" width="10" height="18" rx="3" fill="#78350f" />
        </g>
      )}
    </g>

    {/* Moving Track Feet */}
    <g style={{ transformOrigin: '33px 80px' }}>
      <rect x="27" y="80" width="12" height="14" rx="5" fill="#64748b">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="-18 33 80; 18 33 80; -18 33 80" dur="0.35s" repeatCount="indefinite" />}
      </rect>
    </g>
    <g style={{ transformOrigin: '55px 80px' }}>
      <rect x="49" y="80" width="12" height="14" rx="5" fill="#64748b">
        {isMoving && <animateTransform attributeName="transform" type="rotate" values="18 55 80; -18 55 80; 18 55 80" dur="0.35s" repeatCount="indefinite" />}
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
  const frontKissPopped = useExperienceStore((s) => s.frontKissPopped);
  const setFrontKissPopped = useExperienceStore((s) => s.setFrontKissPopped);

  const companion = COMPANIONS[selectedCompanionId] || COMPANIONS.teddy;

  // Sweet Romantic Praises & Compliments for Sameeksha in English as requested
  const COMPLIMENTS = useMemo(
    () => [
      'Sameeksha, your smile is truly the most radiant thing in the entire universe! 💖',
      'Harshit always says you are the most precious blessing of his life! ✨',
      'Your grace, kindness, and beauty light up every room you enter! 🌸',
      'Happy 23rd Birthday to the sweetest, most wonderful girl in the world! 👑',
      'Your eyes carry a magical glow and such innocent charm, Sameeksha! 🌟',
      'In every thought and every dream, you are always the brightest star! 💫',
      'Keep smiling like this forever, Sameeksha — your happiness means the world! 🥰',
      'You are not just special, you are truly one in a billion! 🌹',
      'Harshit loves and cherishes you more with every passing heartbeat! ❤️',
      'May all the stars, joy, and beauty in the universe shine upon you! 🎂✨',
    ],
    []
  );

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
  const [complimentIndex, setComplimentIndex] = useState(0);
  const [isKissFlying, setIsKissFlying] = useState(false);
  const [kissBurst, setKissBurst] = useState(false);
  const [clickSparks, setClickSparks] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  const targetXRef = useRef<number>(25);
  const targetYRef = useRef<number>(72);
  const lastMouseMoveRef = useRef<number>(Date.now());

  // Full Screen 2D Cursor Following & Mobile Wandering Engine
  useEffect(() => {
    let rafId: number;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (isDropped || isFetchingNewCake || isCompanionCuttingCake || (currentScene === 0 && !frontKissPopped)) return;
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
      if (
        now - lastMouseMoveRef.current > 3000 &&
        !isCompanionCuttingCake &&
        currentScene !== 4 &&
        (currentScene !== 0 || frontKissPopped)
      ) {
        // Pick friendly roaming coordinate on screen
        targetXRef.current = 15 + Math.random() * 70;
        targetYRef.current = 35 + Math.random() * 45;
      }
    }, 4500);

    // Smooth physics loop
    const updatePosition = () => {
      if (currentScene === 0 && !frontKissPopped) {
        // Firmly locked in intro position during flying kiss sequence - Never follows cursor!
        setPosX(76);
        setPosY(70);
        setDirection(-1);
        setIsMoving(false);
      } else if (!isDropped && !isFetchingNewCake) {
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
      const cutAnnounce = `Make way everyone! ${companion.name} is slicing the birthday cake! 🔪🎂`;
      setSpeechText(cutAnnounce);
      setIsSpeechOpen(true);

      // Companion swings the knife and cuts cake
      setTimeout(() => {
        soundManager.playCakeSliceSound();
        soundManager.playPopperBurstSound();
        finishCompanionCakeCut();
        const successText = `Yay! The cake is sliced! Happy 23rd Birthday Sameeksha! 🎉🍰💖`;
        setSpeechText(successText);
        robotSpeaker.speak(successText);
      }, 1200);
    }
  }, [isCompanionCuttingCake, cakeCutDone, finishCompanionCakeCut, companion.name]);

  // Cake Scene entry dialogue
  useEffect(() => {
    if (currentScene === 4 && !cakeCutDone) {
      const text = `The chef knife is ready! Tap on the cake to make your birthday wish and slice it! 🎂🔪`;
      setSpeechText(text);
      setIsSpeechOpen(true);
      robotSpeaker.speak(text);
    }
  }, [currentScene, cakeCutDone]);

  // Scene 0: Flying kiss to welcome Sameeksha into the glowing neon heart!
  useEffect(() => {
    if (currentScene === 0 && !frontKissPopped) {
      setPosX(76);
      setPosY(70);
      setDirection(-1);
      const greeting = 'Happy 23rd Birthday Sameeksha! Here is a flying kiss just for you! 💋✨';
      setSpeechText(greeting);
      setIsSpeechOpen(true);
      robotSpeaker.speak(greeting);
      setIsKissFlying(true);

      const arriveTimer = setTimeout(() => {
        setIsKissFlying(false);
        setKissBurst(true);
        soundManager.playPopperBurstSound();
        soundManager.playTwinkle();
        setFrontKissPopped(true);
        const welcome = 'Welcome to your magical celestial universe, Sameeksha! 👑✨';
        setSpeechText(welcome);
        robotSpeaker.speak(welcome);
      }, 1900);

      const burstCleanTimer = setTimeout(() => {
        setKissBurst(false);
      }, 3200);

      return () => {
        clearTimeout(arriveTimer);
        clearTimeout(burstCleanTimer);
      };
    }
  }, [currentScene, frontKissPopped, setFrontKissPopped]);

  // Click on companion: Sweet romantic praises & compliments for Sameeksha!
  const handleCompanionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDropped || isFetchingNewCake || isCompanionCuttingCake) return;

    soundManager.playTwinkle();

    // Advance to next compliment
    const nextIdx = (complimentIndex + 1) % COMPLIMENTS.length;
    setComplimentIndex(nextIdx);
    const compliment = COMPLIMENTS[nextIdx];

    setSpeechText(compliment);
    setIsSpeechOpen(true);
    robotSpeaker.speak(compliment);

    // Burst sweet heart & sparkle particles
    const emojis = ['💖', '✨', '🌸', '🥰', '💫', '🌹', '❤️', '💋'];
    const newSparks = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 80,
      y: -(Math.random() * 70 + 20),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setClickSparks(newSparks);
    setTimeout(() => setClickSparks([]), 1400);
  };

  // Double click: Playful mini cake drop easter egg!
  const handleCompanionDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDropped || isFetchingNewCake || isCompanionCuttingCake) return;

    soundManager.playCakeSplatSound();
    dropCompanionCake();
    setIsDropped(true);
    const dropText = 'Oops! 😱 The birthday cake slipped!';
    setSpeechText(dropText);
    setIsSpeechOpen(true);
    robotSpeaker.speak(dropText);

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
      const rushText = 'Hold on! I am getting a fresh royal cake for you right now! 🏃💨';
      setSpeechText(rushText);
      robotSpeaker.speak(rushText);
    }, 1400);

    setTimeout(() => {
      soundManager.playCakeDeliverySound();
      setIsDropped(false);
      setIsFetchingNewCake(false);
      const returnText = 'Ta-da! Fresh delicious cake is here for you! 🎂✨';
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
      {/* Flying Kiss on Front Page */}
      <AnimatePresence>
        {isKissFlying && (
          <motion.div
            initial={{ left: '76vw', top: '70vh', scale: 0.6, opacity: 0 }}
            animate={{
              left: ['76vw', '63vw', '50vw'],
              top: ['70vh', '55vh', '44vh'],
              scale: [0.6, 1.3, 1.8],
              opacity: [0, 1, 1],
              rotate: [0, -12, 12, 0],
            }}
            exit={{ scale: 2.6, opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              transform: 'translate(-50%, -50%)',
              zIndex: 99,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              filter: 'drop-shadow(0 0 25px rgba(244, 63, 94, 0.9))',
            }}
          >
            <span style={{ fontSize: '3.8rem' }}>💋</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ fontSize: '1.4rem' }}>💖</span>
              <span style={{ fontSize: '1.4rem' }}>✨</span>
              <span style={{ fontSize: '1.4rem' }}>💫</span>
            </div>
          </motion.div>
        )}

        {kissBurst && (
          <motion.div
            initial={{ scale: 0.7, opacity: 1 }}
            animate={{ scale: [1, 2.5, 3.2], opacity: [1, 0.95, 0] }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: '50vw',
              top: '44vh',
              transform: 'translate(-50%, -50%)',
              zIndex: 99,
              pointerEvents: 'none',
              fontSize: '4.5rem',
              filter: 'drop-shadow(0 0 35px rgba(251, 191, 36, 1))',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span>💥</span>
            <span>💖</span>
            <span>✨</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2D Full Screen Roaming Companion Container: POINTER EVENTS NONE on container so screen clicks pass through! */}
      <div
        style={{
          position: 'fixed',
          top: `${posY}%`,
          left: `${posX}%`,
          transform: 'translate(-50%, -50%)',
          transition: isFetchingNewCake ? 'left 0.8s ease, top 0.8s ease' : 'none',
          zIndex: 85,
          pointerEvents: 'none',
        }}
      >
        {/* Floating Dialogue Speech Bubble - NEVER MIRRORED! */}
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
                transform: 'translateX(-50%)',
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
          onDoubleClick={handleCompanionDoubleClick}
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
          {/* Animated SVG Character with horizontal flip on direction */}
          <div
            style={{
              transform: `scaleX(${direction})`,
              transition: 'transform 0.15s ease',
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

          {/* Sparkles on Click (Compliment heart burst!) */}
          {clickSparks.map((s) => (
            <motion.div
              key={s.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
              animate={{ x: s.x, y: s.y, opacity: 0, scale: 1.4 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                fontSize: '1.4rem',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {s.emoji}
            </motion.div>
          ))}

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

        {/* Mascot Name Badge & Drops Counter - NEVER MIRRORED! */}
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
