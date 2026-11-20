import React, { useRef, useEffect, useCallback } from 'react';

interface CelebrationProps {
  active: boolean;
}

// ---- Particle system types ----
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  life: number;
}

const COLORS = [
  '#ff6b9d',
  '#fbbf24',
  '#f472b6',
  '#a855f7',
  '#6366f1',
  '#38bdf8',
  '#34d399',
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createBurst(
  x: number,
  y: number,
  count: number,
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + randomBetween(-0.15, 0.15);
    const speed = randomBetween(2, 7);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: randomBetween(2, 5),
      color: randomColor(),
      alpha: 1,
      decay: randomBetween(0.012, 0.025),
      gravity: randomBetween(0.03, 0.07),
      life: 1,
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
    // Spawn 3-5 bursts at random positions
    const burstCount = Math.floor(randomBetween(3, 6));
    for (let b = 0; b < burstCount; b++) {
      const bx = randomBetween(width * 0.1, width * 0.9);
      const by = randomBetween(height * 0.1, height * 0.6);
      const count = Math.floor(randomBetween(30, 60));
      particlesRef.current.push(...createBurst(bx, by, count));
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size to viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    if (!active) {
      // Clear everything when deactivated
      particlesRef.current = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      window.removeEventListener('resize', resize);
      return;
    }

    // Initial burst
    spawnBursts(canvas);

    // Periodic bursts while active
    const scheduleBurst = () => {
      burstTimerRef.current = setTimeout(() => {
        spawnBursts(canvas);
        scheduleBurst();
      }, randomBetween(600, 1400));
    };
    scheduleBurst();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const alive: Particle[] = [];
      for (const p of particlesRef.current) {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        p.alpha = Math.max(0, p.life);

        if (p.life > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
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
        zIndex: 9999,
      }}
      aria-hidden
    />
  );
};

export default Celebration;
