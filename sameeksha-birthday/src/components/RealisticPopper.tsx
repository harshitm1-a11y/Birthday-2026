import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/audio';

interface RocketShell {
  id: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  targetY: number;
  exploded: boolean;
  trail: { x: number; y: number; alpha: number; size: number }[];
}

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
  type: 'foil' | 'ribbon' | 'star' | 'heart';
}

interface FlashBurst {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

const FOIL_COLORS = [
  '#fbbf24', // Pure Gold
  '#f59e0b', // Amber Gold
  '#f472b6', // Shimmering Rose
  '#ff2a85', // Electric Pink
  '#ec4899', // Ruby Pink
  '#c084fc', // Lilac Violet
  '#38bdf8', // Sparkle Cyan
  '#34d399', // Emerald Mint
  '#ffffff', // Diamond White
];

export const RealisticPopper: React.FC = () => {
  const [poppedCount, setPoppedCount] = useState(0);
  const [showBanner, setShowBanner] = useState(false);
  const [activeCannon, setActiveCannon] = useState<'none' | 'left' | 'right' | 'both'>('none');
  const [isAutoPopping, setIsAutoPopping] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rocketsRef = useRef<RocketShell[]>([]);
  const confettiRef = useRef<ConfettiPiece[]>([]);
  const flashesRef = useRef<FlashBurst[]>([]);
  const rafRef = useRef<number>(0);
  const autoPopIntervalRef = useRef<any>(null);

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
    return () => {
      window.removeEventListener('resize', handleResize);
      if (autoPopIntervalRef.current) {
        clearInterval(autoPopIntervalRef.current);
      }
    };
  }, []);

  // Explode a rocket shell at its apex into hundreds of 3D metallic foil pieces
  const explodeRocket = (x: number, y: number, color: string) => {
    soundManager.playPopperBurstSound();
    setShowBanner(true);
    setPoppedCount((c) => c + 1);

    // Apex Flash ring
    flashesRef.current.push({
      x,
      y,
      radius: 10,
      maxRadius: 140,
      alpha: 1.0,
      color,
    });

    // 120+ 3D metallic foil particles, curly ribbons, stars, and hearts!
    const newPieces: ConfettiPiece[] = [];
    const count = 130;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 22; // Explosive radial burst
      const isRibbon = Math.random() < 0.22;
      const isStar = Math.random() < 0.15;
      const isHeart = Math.random() < 0.12;

      let type: 'foil' | 'ribbon' | 'star' | 'heart' = 'foil';
      if (isRibbon) type = 'ribbon';
      else if (isStar) type = 'star';
      else if (isHeart) type = 'heart';

      newPieces.push({
        x,
        y,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
        vy: Math.sin(angle) * speed - (Math.random() * 8 + 4), // extra upward momentum
        width: type === 'ribbon' ? 24 : type === 'foil' ? 9 + Math.random() * 9 : 14,
        height: type === 'ribbon' ? 32 : type === 'foil' ? 14 + Math.random() * 16 : 14,
        color: FOIL_COLORS[Math.floor(Math.random() * FOIL_COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        wobbleX: Math.random() * Math.PI * 2,
        wobbleY: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.08 + Math.random() * 0.1,
        alpha: 1,
        type,
      });
    }

    confettiRef.current.push(...newPieces);
  };

  // Launch a realistic popper rocket shooting up from bottom
  const launchRocket = (fromSide: 'left' | 'right' | 'center') => {
    soundManager.playPopperCannonSound();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;

    let startX = w * 0.12;
    let targetX = w * 0.38 + Math.random() * (w * 0.24);
    let vx = (targetX - startX) * 0.035;

    if (fromSide === 'right') {
      startX = w * 0.88;
      targetX = w * 0.4 + Math.random() * (w * 0.24);
      vx = (targetX - startX) * 0.035;
    } else if (fromSide === 'center') {
      startX = w * 0.5;
      vx = (Math.random() - 0.5) * 6;
    }

    const startY = h;
    const targetY = h * 0.25 + Math.random() * (h * 0.2); // Explode near top-center
    const vy = -Math.sqrt(2 * 0.52 * (startY - targetY)); // Ballistic launch velocity

    const shell: RocketShell = {
      id: Date.now() + Math.random(),
      startX,
      startY,
      x: startX,
      y: startY,
      vx,
      vy,
      color: FOIL_COLORS[Math.floor(Math.random() * FOIL_COLORS.length)],
      targetY,
      exploded: false,
      trail: [],
    };

    rocketsRef.current.push(shell);

    // Trigger cannon recoil UI animation
    setActiveCannon(fromSide === 'left' ? 'left' : fromSide === 'right' ? 'right' : 'both');
    setTimeout(() => setActiveCannon('none'), 350);

    // Ensure animation loop is running
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateLoop);
  };

  // Main Canvas Render Loop
  const updateLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. UPDATE & DRAW ROCKET SHELLS SHOOTING UP FROM BOTTOM
    const rockets = rocketsRef.current;
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];

      // Physics
      r.x += r.vx;
      r.y += r.vy;
      r.vy += 0.48; // Gravity slows rocket as it ascends

      // Add smoke/spark trail
      r.trail.push({ x: r.x, y: r.y, alpha: 1.0, size: Math.random() * 6 + 4 });

      // Draw trailing sparkles
      for (let t = r.trail.length - 1; t >= 0; t--) {
        const tr = r.trail[t];
        tr.alpha -= 0.08;
        tr.size *= 0.94;
        if (tr.alpha <= 0) {
          r.trail.splice(t, 1);
        } else {
          ctx.beginPath();
          ctx.arc(tr.x, tr.y, tr.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 191, 36, ${tr.alpha})`;
          ctx.fill();
        }
      }

      // Draw Glowing Rocket Head
      ctx.save();
      ctx.beginPath();
      ctx.arc(r.x, r.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.restore();

      // Check Apex: Explode when rocket reaches target height or velocity reverses!
      if (r.y <= r.targetY || r.vy >= -1) {
        explodeRocket(r.x, r.y, r.color);
        rockets.splice(i, 1);
      }
    }

    // 2. DRAW FLASH RINGS AT APEX
    const flashes = flashesRef.current;
    for (let i = flashes.length - 1; i >= 0; i--) {
      const f = flashes[i];
      f.radius += (f.maxRadius - f.radius) * 0.25;
      f.alpha -= 0.07;
      if (f.alpha <= 0) {
        flashes.splice(i, 1);
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.strokeStyle = f.color;
        ctx.lineWidth = 4 * f.alpha;
        ctx.globalAlpha = f.alpha;
        ctx.shadowColor = f.color;
        ctx.shadowBlur = 25;
        ctx.stroke();
        ctx.restore();
      }
    }

    // 3. UPDATE & DRAW 3D METALLIC FOIL CONFETTI & RIBBONS
    const pieces = confettiRef.current;
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];

      // Physics
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.36; // Gravity
      p.vx *= 0.985; // Air drag
      p.rotation += p.rotationSpeed;
      p.wobbleX += p.wobbleSpeed;
      p.wobbleY += p.wobbleSpeed * 0.75;

      // Lateral wind drift
      p.x += Math.sin(p.wobbleX) * 1.4;

      // 3D Rendering with Metallic Flip Shading
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.cos(p.wobbleX), Math.sin(p.wobbleY)); // 3D tumbling flip!

      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.type === 'ribbon') {
        // Sinuous 3D curly streamer ribbon
        ctx.beginPath();
        ctx.moveTo(-p.width / 2, -p.height / 2);
        ctx.bezierCurveTo(
          p.width * 1.2,
          -p.height / 4,
          -p.width * 1.2,
          p.height / 4,
          p.width / 2,
          p.height / 2
        );
        ctx.lineWidth = 4;
        ctx.strokeStyle = p.color;
        ctx.stroke();
      } else if (p.type === 'star') {
        // Sparkling Star
        ctx.font = `${p.width}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', 0, 0);
      } else if (p.type === 'heart') {
        // Golden Heart
        ctx.font = `${p.width}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♥', 0, 0);
      } else {
        // Rectangular metallic foil with specular shine
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      }

      ctx.restore();

      // Fade out as it settles
      if (p.y > canvas.height * 0.88) {
        p.alpha -= 0.012;
      }

      if (p.alpha <= 0 || p.y > canvas.height + 40) {
        pieces.splice(i, 1);
      }
    }

    if (rockets.length > 0 || flashes.length > 0 || pieces.length > 0) {
      rafRef.current = requestAnimationFrame(updateLoop);
    }
  }, []);

  // Multi-Cannon Triggers
  const handleLaunchLeft = () => launchRocket('left');
  const handleLaunchRight = () => launchRocket('right');
  const handleDoubleBlast = () => {
    launchRocket('left');
    setTimeout(() => launchRocket('right'), 120);
    setTimeout(() => launchRocket('center'), 240);
  };

  const handleToggleAutoPop = () => {
    if (isAutoPopping) {
      clearInterval(autoPopIntervalRef.current);
      autoPopIntervalRef.current = null;
      setIsAutoPopping(false);
    } else {
      setIsAutoPopping(true);
      handleDoubleBlast();
      autoPopIntervalRef.current = setInterval(() => {
        const sides: ('left' | 'right' | 'center')[] = ['left', 'right', 'center'];
        launchRocket(sides[Math.floor(Math.random() * sides.length)]);
      }, 750);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', margin: '1rem 0' }}>
      {/* Fullscreen Realistic Confetti Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 180,
        }}
      />

      {/* Realistic Visual Metallic Cannons at Bottom Corners */}
      {/* Left Cannon */}
      <motion.div
        animate={activeCannon === 'left' || activeCannon === 'both' ? { scale: [1, 0.85, 1.2, 1], rotate: [25, 15, 30, 25] } : { rotate: 25 }}
        style={{
          position: 'fixed',
          bottom: '80px',
          left: '20px',
          zIndex: 80,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '65px',
            background: 'linear-gradient(to right, #475569, #94a3b8, #334155)',
            borderRadius: '14px 14px 4px 4px',
            border: '2px solid #fbbf24',
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
          }}
        />
        <div
          style={{
            width: '42px',
            height: '14px',
            background: '#1e293b',
            borderRadius: '6px',
            marginTop: '-4px',
          }}
        />
      </motion.div>

      {/* Right Cannon */}
      <motion.div
        animate={activeCannon === 'right' || activeCannon === 'both' ? { scale: [1, 0.85, 1.2, 1], rotate: [-25, -15, -30, -25] } : { rotate: -25 }}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          zIndex: 80,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '65px',
            background: 'linear-gradient(to right, #475569, #94a3b8, #334155)',
            borderRadius: '14px 14px 4px 4px',
            border: '2px solid #fbbf24',
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
          }}
        />
        <div
          style={{
            width: '42px',
            height: '14px',
            background: '#1e293b',
            borderRadius: '6px',
            marginTop: '-4px',
          }}
        />
      </motion.div>

      {/* Interactive Cannon Trigger Control Deck */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          margin: '1rem auto',
        }}
      >
        {/* Main Big Double Cannon Blast Button */}
        <motion.button
          type="button"
          onClick={handleDoubleBlast}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          style={{
            background: 'linear-gradient(135deg, #f43f5e, #fbbf24, #a855f7)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '9999px',
            padding: '12px 32px',
            color: '#fff',
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(244, 63, 94, 0.5), 0 0 25px rgba(251, 191, 36, 0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            letterSpacing: '0.5px',
          }}
        >
          <span style={{ fontSize: '1.6rem' }}>🎉</span>
          <span>{poppedCount === 0 ? 'FIRE PARTY CANNONS! 💥✨' : 'FIRE AGAIN! 🚀🎊'}</span>
          <span style={{ fontSize: '1.6rem' }}>🍾</span>
        </motion.button>

        {/* Individual Cannon Triggers */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.button
            type="button"
            onClick={handleLaunchLeft}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              borderRadius: '20px',
              padding: '6px 16px',
              color: '#fbbf24',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            🚀 Left Cannon
          </motion.button>

          <motion.button
            type="button"
            onClick={handleToggleAutoPop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: isAutoPopping
                ? 'linear-gradient(135deg, #ec4899, #f43f5e)'
                : 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              borderRadius: '20px',
              padding: '6px 16px',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isAutoPopping ? '⏹ Stop Shower' : '🎆 Continuous Storm'}
          </motion.button>

          <motion.button
            type="button"
            onClick={handleLaunchRight}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              borderRadius: '20px',
              padding: '6px 16px',
              color: '#fbbf24',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Right Cannon 🚀
          </motion.button>
        </div>

        <div style={{ fontSize: '0.78rem', color: '#fbcfe8', textAlign: 'center' }}>
          ✨ Cannons fire from bottom corners and burst into thousands of metallic foil ribbons!
        </div>
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
              marginTop: '1.2rem',
              background: 'linear-gradient(135deg, rgba(67, 12, 85, 0.95), rgba(26, 9, 58, 0.98))',
              borderRadius: '28px',
              border: '2px solid rgba(251, 191, 36, 0.75)',
              boxShadow:
                '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 45px rgba(251, 191, 36, 0.5), inset 0 0 25px rgba(244, 63, 94, 0.3)',
              padding: '1.8rem 1.4rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Shimmering Top Ribbon Edge */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #f43f5e, #fbbf24, #a855f7, #38bdf8, #f43f5e)',
                backgroundSize: '200% 100%',
              }}
            />

            {/* Glowing Tiara */}
            <motion.div
              animate={{ rotate: [-4, 4, -4], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              style={{ fontSize: '2.5rem', marginBottom: '0.2rem' }}
            >
              👑
            </motion.div>

            {/* The Grand Unfurled Title */}
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 5.2vw, 2.5rem)',
                fontWeight: 900,
                margin: '0.3rem 0',
                background: 'linear-gradient(to right, #fbbf24, #fff, #f472b6, #fbbf24)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '1px',
                textShadow: '0 0 30px rgba(251, 191, 36, 0.6)',
              }}
            >
              🎉 HAPPY BIRTHDAY SAMEEKSHA BABY 💖
            </h2>

            {/* Romantic Poetic Verse */}
            <p
              style={{
                color: '#fed7aa',
                fontSize: 'clamp(0.95rem, 2.8vw, 1.15rem)',
                margin: '0.6rem auto 0',
                maxWidth: '520px',
                lineHeight: 1.5,
                fontStyle: 'italic',
              }}
            >
              "Chaand taaron se sajaya hai ye aalam saara,
              <br />
              Duniya me sabse pyara hai Sameeksha baby ka janamdin hamara!" 🌹✨
            </p>

            <div
              style={{
                marginTop: '0.9rem',
                display: 'inline-block',
                background: 'rgba(251, 191, 36, 0.2)',
                border: '1px solid rgba(251, 191, 36, 0.5)',
                borderRadius: '20px',
                padding: '4px 16px',
                fontSize: '0.82rem',
                color: '#fbbf24',
                fontWeight: 600,
              }}
            >
              ✨ Forever My Queen • 23 November 2026 ✨
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
