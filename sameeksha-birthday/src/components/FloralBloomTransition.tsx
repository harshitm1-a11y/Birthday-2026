import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloralBloomTransitionProps {
  isTransitioning: boolean;
  onComplete?: () => void;
}

// Mathematical Sacred Geometry Blooming Flower (Inspired by Python Turtle Flower Animation)
export const MathematicalFlower: React.FC<{ size?: number; progress?: number }> = ({
  size = 400,
}) => {
  const petalCount = 28;
  const petals = Array.from({ length: petalCount }, (_, i) => i);

  return (
    <svg
      width={size}
      height={size}
      viewBox="-200 -200 400 400"
      style={{ overflow: 'visible', filter: 'drop-shadow(0 0 25px rgba(255, 20, 147, 0.8))' }}
    >
      <defs>
        <radialGradient id="centerGoldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fde047" />
          <stop offset="80%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="neonPetalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#ff007f" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#a855f7" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="neonPetalGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#f43f5e" stopOpacity="0.8" />
          <stop offset="85%" stopColor="#be185d" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#312e81" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Layer 1: Outer blooming spiral petals */}
      <g>
        {petals.map((idx) => {
          const angle = (idx * 360) / petalCount;
          return (
            <motion.path
              key={`outer-${idx}`}
              d="M0,0 C35,-75 110,-125 0,-185 C-110,-125 -35,-75 0,0 Z"
              fill="url(#neonPetalGrad1)"
              stroke="#ff007f"
              strokeWidth="1.2"
              transform={`rotate(${angle})`}
              initial={{ scale: 0, opacity: 0, rotate: angle - 30 }}
              animate={{ scale: [0, 1.05, 1], opacity: 1, rotate: angle }}
              transition={{
                duration: 1.1,
                delay: idx * 0.02,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}
      </g>

      {/* Layer 2: Mid-tier golden/magenta counter-spiraling petals */}
      <g>
        {petals.slice(0, 20).map((idx) => {
          const angle = (idx * 360) / 20 + 9;
          return (
            <motion.path
              key={`mid-${idx}`}
              d="M0,0 C25,-55 80,-95 0,-135 C-80,-95 -25,-55 0,0 Z"
              fill="url(#neonPetalGrad2)"
              stroke="#fcd34d"
              strokeWidth="1.4"
              transform={`rotate(${angle})`}
              initial={{ scale: 0, opacity: 0, rotate: angle + 25 }}
              animate={{ scale: [0, 1.1, 1], opacity: 1, rotate: angle }}
              transition={{
                duration: 0.95,
                delay: 0.15 + idx * 0.025,
                ease: 'easeOut',
              }}
            />
          );
        })}
      </g>

      {/* Layer 3: Inner delicate heart/core petals */}
      <g>
        {petals.slice(0, 12).map((idx) => {
          const angle = (idx * 360) / 12 + 15;
          return (
            <motion.path
              key={`inner-${idx}`}
              d="M0,0 C16,-35 48,-60 0,-85 C-48,-60 -16,-35 0,0 Z"
              fill="url(#neonPetalGrad1)"
              stroke="#ffffff"
              strokeWidth="1.8"
              transform={`rotate(${angle})`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.3 + idx * 0.03,
                ease: 'backOut',
              }}
            />
          );
        })}
      </g>

      {/* Center glowing pollen starlight core */}
      <motion.circle
        cx="0"
        cy="0"
        r="28"
        fill="url(#centerGoldGlow)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.4, 1], opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.7 }}
      />
      <circle cx="0" cy="0" r="12" fill="#ffffff" />
    </svg>
  );
};

// Full-Screen Floral Bloom Transition for Scene Switching
export const FloralBloomTransition: React.FC<FloralBloomTransitionProps> = ({
  isTransitioning,
}) => {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="floral-bloom-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 120,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, rgba(11, 7, 24, 0.85) 0%, rgba(3, 2, 8, 0.96) 80%)',
            backdropFilter: 'blur(8px)',
            overflow: 'hidden',
          }}
        >
          {/* Central Blooming Mathematical Sacred Flower */}
          <motion.div
            initial={{ scale: 0.2, rotate: -45, opacity: 0 }}
            animate={{ scale: [0.2, 1.3, 1.8], rotate: 45, opacity: [0, 1, 0.95] }}
            exit={{ scale: 2.6, opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <MathematicalFlower size={520} />
          </motion.div>

          {/* Floating starlight petals drifting outwards */}
          {Array.from({ length: 18 }).map((_, i) => {
            const angle = (i * 360) / 18;
            const distance = 260 + (i % 3) * 60;
            const rad = (angle * Math.PI) / 180;
            const targetX = Math.cos(rad) * distance;
            const targetY = Math.sin(rad) * distance;

            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{
                  x: targetX,
                  y: targetY,
                  scale: [0, 1.2, 0.6],
                  opacity: [1, 1, 0],
                  rotate: angle * 2,
                }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 + (i % 4) * 0.05 }}
                style={{
                  position: 'absolute',
                  fontSize: i % 2 === 0 ? '1.8rem' : '1.3rem',
                  filter: 'drop-shadow(0 0 12px rgba(255, 105, 180, 0.9))',
                }}
              >
                {i % 3 === 0 ? '🌸' : i % 3 === 1 ? '✨' : '💖'}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloralBloomTransition;
