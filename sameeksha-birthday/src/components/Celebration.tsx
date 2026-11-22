import React, { useRef, useEffect, useCallback } from 'react';

interface CelebrationProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  life: number;
  rotation: number;
  rotSpeed: number;
  wobbleX: number;
  wobbleY: number;
  wobbleSpeed: number;
}

const METALLIC_COLORS = [
  '#fbbf24', // Gold
  '#f59e0b', // Deep Amber
  '#ff6b9d', // Rose Gold
  '#f43f5e', // Hot Red/Pink
  '#ec4899', // Bright Pink
  '#a855f7', // Purple Sparkle
  '#38bdf8', // Sky Blue
  '#34d399', // Emerald
  '#ffffff', // Diamond White
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function randomColor() {
  return METALLIC_COLORS[Math.floor(Math.random() * METALLIC_COLORS.length)];
}

function createBurst(x: number, y: number, count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + randomBetween(-0.25, 0.25);
    const speed = randomBetween(4, 12);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - randomBetween(2, 6), // Upward pop bias
      w: randomBetween(6, 14),
      h: randomBetween(12, 22),
      color: randomColor(),
      alpha: 1,
      decay: randomBetween(0.008, 0.018),
      gravity: randomBetween(0.2, 0.35),
      life: 1,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: randomBetween(-0.2, 0.2),
      wobbleX: Math.random() * Math.PI,
      wobbleY: Math.random() * Math.PI,
      wobbleSpeed: randomBetween(0.06, 0.14),
    });
  }
  return particles;
}

const Celebration: React.FC<CelebrationProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const burstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spawnBursts = useCallback((canvas: HTMLCanvasElement) => {
    const { width, height } = canvas;
    const burstCount = Math.floor(randomBetween(3, 5));
    for (let b = 0; b < burstCount; b++) {
      const bx = randomBetween(width * 0.15, width * 0.85);
      const by = randomBetween(height * 0.15, height * 0.55);
      const count = Math.floor(randomBetween(35, 55));
      particlesRef.current.push(...createBurst(bx, by, count));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    if (!active) {
      particlesRef.current = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      window.removeEventListener('resize', resize);
      return;
    }

    spawnBursts(canvas);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        particlesRef.current = [];
        if (burstTimerRef.current) {
          clearTimeout(burstTimerRef.current);
          burstTimerRef.current = null;
        }
      } else if (active && canvasRef.current) {
        scheduleNextBurst();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const scheduleNextBurst = () => {
      if (!active || document.hidden) return;
      const delay = randomBetween(2200, 4000);
      burstTimerRef.current = setTimeout(() => {
        if (active && canvasRef.current && !document.hidden) {
          // Cap total particles to 120 max
          if (particlesRef.current.length < 90) {
            spawnBursts(canvasRef.current);
          }
          scheduleNextBurst();
        }
      }, delay);
    };
    scheduleNextBurst();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const alive: Particle[] = [];
      for (const p of particlesRef.current) {
        p.vy += p.gravity;
        p.vx *= 0.98; // Air resistance
        p.x += p.vx + Math.sin(p.wobbleX) * 0.8;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.wobbleX += p.wobbleSpeed;
        p.wobbleY += p.wobbleSpeed * 0.8;

        p.life -= p.decay;
        p.alpha = Math.max(0, p.life);

        if (p.life > 0 && p.y < canvas.height + 40) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          // Realistic 3D foil flip
          ctx.scale(Math.cos(p.wobbleX), Math.sin(p.wobbleY));

          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);

          ctx.restore();
          alive.push(p);
        }
      }
      particlesRef.current = alive;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [active, spawnBursts]);

  return (
    <canvas
      ref={canvasRef}
      className="celebration-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 150,
      }}
      aria-hidden
    />
  );
};

export default Celebration;
