import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/audio';

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  wobbleX: number;
  wobbleY: number;
  wobbleSpeed: number;
  alpha: number;
  isRibbon: boolean;
}

const FOIL_COLORS = [
  '#fbbf24', // Metallic Gold
  '#f59e0b', // Deep Gold
  '#f472b6', // Rose Pink
  '#ff2a85', // Hot Magenta
  '#ec4899', // Shimmering Pink
  '#a855f7', // Electric Violet
  '#38bdf8', // Cyan Foil
  '#ffffff', // Silver Sparkle
];

export const RealisticPopper: React.FC = () => {
  const [poppedCount, setPoppedCount] = useState(0);
  const [showBanner, setShowBanner] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiRef = useRef<ConfettiPiece[]>([]);
  const rafRef = useRef<number>(0);

  // Resize canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation Loop for realistic 3D fluttering confetti
  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pieces = confettiRef.current;
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];

      // Physics
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38; // Gravity
      p.vx *= 0.98; // Air drag
      p.rotation += p.rotationSpeed;
      p.wobbleX += p.wobbleSpeed;
      p.wobbleY += p.wobbleSpeed * 0.7;

      // Wind sway
      p.x += Math.sin(p.wobbleX) * 1.2;

      // Draw 3D fluttering foil
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.cos(p.wobbleX), Math.sin(p.wobbleY)); // 3D flip effect

      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.isRibbon) {
        // Curly ribbon streamer
        ctx.beginPath();
        ctx.moveTo(-p.width / 2, -p.height / 2);
        ctx.bezierCurveTo(
          p.width,
          -p.height / 4,
          -p.width,
          p.height / 4,
          p.width / 2,
          p.height / 2
        );
        ctx.lineWidth = 3;
        ctx.strokeStyle = p.color;
        ctx.stroke();
      } else {
        // Rectangular foil confetti
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      }

      ctx.restore();

      // Fade out near bottom
      if (p.y > canvas.height * 0.85) {
        p.alpha -= 0.015;
      }

      if (p.alpha <= 0 || p.y > canvas.height + 50) {
        pieces.splice(i, 1);
      }
    }

    if (pieces.length > 0) {
      rafRef.current = requestAnimationFrame(updateParticles);
    }
  }, []);

  const triggerPopper = () => {
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 400);

    // Audio pop
    soundManager.playPopperSound();
    setPoppedCount((c) => c + 1);
    setShowBanner(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const startX = canvas.width / 2;
    const startY = canvas.height * 0.65;

    // Spawn 90 realistic metallic confetti strips & ribbons
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 90; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5; // Upward spray
      const speed = 14 + Math.random() * 16;
      const isRibbon = Math.random() < 0.25;

      newPieces.push({
        x: startX + (Math.random() - 0.5) * 40,
        y: startY + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 6,
        vy: Math.sin(angle) * speed,
        width: isRibbon ? 24 : 8 + Math.random() * 10,
        height: isRibbon ? 30 : 14 + Math.random() * 16,
        color: FOIL_COLORS[Math.floor(Math.random() * FOIL_COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        wobbleX: Math.random() * Math.PI,
        wobbleY: Math.random() * Math.PI,
        wobbleSpeed: 0.08 + Math.random() * 0.08,
        alpha: 1,
        isRibbon,
      });
    }

    confettiRef.current.push(...newPieces);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateParticles);
  };

  return (
    <>
      {/* Fullscreen Confetti Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 200,
        }}
      />

      {/* Interactive Popper Trigger Button */}
      <div style={{ margin: '1.8rem auto 1.2rem', textAlign: 'center' }}>
        <motion.button
          className="popper-trigger-btn"
          onClick={triggerPopper}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92, rotate: -8 }}
          animate={isPopping ? { scale: [1, 1.25, 0.95, 1], rotate: [0, -12, 10, 0] } : {}}
          style={{
            background: 'linear-gradient(135deg, #f43f5e, #fbbf24, #a855f7)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '50px',
            padding: '0.85rem 2rem',
            color: '#fff',
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(244, 63, 94, 0.5), 0 0 25px rgba(251, 191, 36, 0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.8rem',
            letterSpacing: '0.5px',
          }}
        >
          <span style={{ fontSize: '1.6rem', display: 'inline-block' }}>🎉</span>
          <span>{poppedCount === 0 ? 'POP THE PARTY POPPER! 🎊' : 'POP AGAIN! 💥✨'}</span>
          <span style={{ fontSize: '1.6rem', display: 'inline-block' }}>🍾</span>
        </motion.button>
      </div>

      {/* The Grand Ribbon Banner: HAPPY BIRTHDAY SAMEEKSHA BABY */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50, rotateX: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            style={{
              position: 'relative',
              maxWidth: '680px',
              margin: '1.2rem auto',
              padding: '1.2rem 1.6rem',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(30, 10, 45, 0.95), rgba(45, 15, 60, 0.92))',
              border: '2px solid rgba(251, 191, 36, 0.8)',
              boxShadow: '0 15px 45px rgba(0,0,0,0.8), 0 0 40px rgba(244, 114, 182, 0.5), inset 0 0 20px rgba(251, 191, 36, 0.2)',
              textAlign: 'center',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Shimmering Top Badge */}
            <div
              style={{
                fontSize: '0.9rem',
                letterSpacing: '3px',
                color: '#fbbf24',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: '0.4rem',
              }}
            >
              ✨ FOREVER & ALWAYS ✨
            </div>

            {/* Glowing Big Text: HAPPY BIRTHDAY SAMEEKSHA BABY */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 5.5vw, 2.8rem)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #fff 0%, #fbbf24 35%, #ff6b9d 70%, #fef08a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0.2rem 0 0.6rem',
                textShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
                letterSpacing: '1px',
                lineHeight: 1.2,
              }}
            >
              🎉 HAPPY BIRTHDAY SAMEEKSHA BABY 💖
            </h2>

            {/* Romantic Poetic Caption */}
            <p
              style={{
                fontFamily: 'var(--font-handwritten)',
                fontSize: 'clamp(1.15rem, 3.5vw, 1.45rem)',
                color: '#fbcfe8',
                lineHeight: 1.6,
                margin: '0.4rem 0 0',
              }}
            >
              "Tum meri zindagi ki sabse khoobsurat shayari ho... May all your dreams come true!" 🌹✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
