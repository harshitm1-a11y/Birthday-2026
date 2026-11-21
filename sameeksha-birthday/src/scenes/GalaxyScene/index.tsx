import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import { soundManager } from '../../utils/audio';

// Interactive Mouse Parallax Camera to give dynamic 3D depth to the front page
function ParallaxCamera() {
  const { camera } = useThree();

  useFrame(({ mouse }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.7, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.45, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// 3D Stardust and Constellation Particles in Deep Space
function Stardust() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 220;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const c1 = new THREE.Color('#ff007f');
    const c2 = new THREE.Color('#fbbf24');
    const c3 = new THREE.Color('#a855f7');

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;

      const pick = Math.random();
      const c = pick < 0.4 ? c1 : pick < 0.7 ? c2 : c3;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.025;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.015) * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Mathematically Drawn Glowing Neon Heart (Parametric Curve centered precisely at (0,0))
function ParametricNeonHeart({ isPopped }: { isPopped: boolean }) {
  const pathData = useMemo(() => {
    const N = 200;
    const scale = 10.5;
    // Exactly center the heart: rawY ranges from -125.19 to +178.5 at scale 10.5.
    // Center offset = (+178.5 - 125.19) / 2 = 26.65.
    // Shifting by -26.65 makes y symmetrically span [-151.84, +151.85].
    const yCenterOffset = 26.65;
    const pts: string[] = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3) * scale;
      const rawY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
      const y = rawY - yCenterOffset;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return 'M ' + pts.join(' L ') + ' Z';
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{
        scale: isPopped ? [1, 1.04, 1] : [0.95, 1.03, 0.95],
        opacity: 1,
      }}
      transition={{
        duration: isPopped ? 2.4 : 1.8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="480"
        height="440"
        viewBox="-200 -180 400 360"
        style={{
          width: 'min(90vw, 480px)',
          height: 'min(84vw, 440px)',
          overflow: 'visible',
          filter: 'drop-shadow(0 0 35px rgba(255, 0, 127, 0.85)) drop-shadow(0 0 65px rgba(255, 20, 147, 0.5))',
        }}
      >
        <defs>
          <filter id="neonBlurOuter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <filter id="neonBlurMid" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* 1. Deep Outer Neon Glow Line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="#ff007f"
          strokeWidth="18"
          strokeOpacity="0.25"
          strokeLinecap="round"
          filter="url(#neonBlurOuter)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />

        {/* 2. Mid Vibrant Neon Layer */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="#ff3399"
          strokeWidth="7"
          strokeOpacity="0.8"
          strokeLinecap="round"
          filter="url(#neonBlurMid)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />

        {/* 3. Core Brilliant White/Pink Neon Line */}
        <motion.path
          d={pathData}
          fill="rgba(255, 0, 127, 0.03)"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeOpacity="0.95"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />

        {/* Floating starlight particles along the centered heart curve */}
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.circle
            key={i}
            r="2.2"
            fill="#ffffff"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.8, 0.8],
            }}
            transition={{
              duration: 2.2,
              delay: i * 0.14,
              repeat: Infinity,
            }}
            cx={Math.sin((i / 16) * Math.PI * 2) * 140}
            cy={Math.cos((i / 16) * Math.PI * 2) * 125}
          />
        ))}
      </svg>
    </motion.div>
  );
}

const GalaxyScene: React.FC = () => {
  const nextScene = useExperienceStore((s) => s.nextScene);
  const audioEnabled = useExperienceStore((s) => s.audioEnabled);
  const toggleAudio = useExperienceStore((s) => s.toggleAudio);
  const frontKissPopped = useExperienceStore((s) => s.frontKissPopped);
  const setFrontKissPopped = useExperienceStore((s) => s.setFrontKissPopped);

  // Safety fallback: auto-reveal if waiting
  useEffect(() => {
    if (!frontKissPopped) {
      const timer = setTimeout(() => {
        setFrontKissPopped(true);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [frontKissPopped, setFrontKissPopped]);

  const handleEnter = () => {
    soundManager.playTwinkle();
    if (!audioEnabled) {
      toggleAudio();
      soundManager.startAmbient();
    }
    nextScene();
  };

  const handleSkipOrPop = () => {
    if (!frontKissPopped) {
      setFrontKissPopped(true);
      soundManager.playPopperBurstSound();
    }
  };

  return (
    <div
      onClick={handleSkipOrPop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#04030a', // Deep luxury dark midnight background as requested
      }}
    >
      {/* 3D Canvas Background with subtle dark starfield & mouse parallax */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 58 }}>
          <ParallaxCamera />
          <ambientLight intensity={0.25} />
          <pointLight position={[5, 5, 5]} intensity={0.9} color="#fbbf24" />
          <pointLight position={[-5, -3, 3]} intensity={0.8} color="#ff007f" />
          <Stars radius={90} depth={50} count={3500} factor={3.5} saturation={0.4} fade speed={1.0} />
          <Sparkles count={50} scale={7} size={2.0} speed={0.4} color="#ff69b4" />
          <Stardust />
        </Canvas>
      </div>

      {/* Parametric Glowing Neon Heart (Inspired by Python neon_heart.py) */}
      <ParametricNeonHeart isPopped={frontKissPopped} />

      {/* DOM Overlay */}
      <div className="scene-overlay">
        <AnimatePresence mode="wait">
          {frontKissPopped ? (
            <motion.div
              key="welcome-content"
              className="scene-content"
              initial={{ opacity: 0, scale: 0.88, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.8 }}
              >
                <div
                  style={{
                    fontSize: '1.2rem',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    color: '#ff8fb3',
                    marginBottom: '0.8rem',
                    fontWeight: 600,
                    textShadow: '0 0 15px rgba(255, 0, 127, 0.7)',
                  }}
                >
                  23 November 2026
                </div>
                <h1
                  className="scene-heading"
                  style={{
                    fontSize: 'clamp(2.5rem, 7vw, 4.2rem)',
                    textShadow: '0 0 30px rgba(255, 0, 127, 0.6), 0 2px 10px rgba(0,0,0,0.8)',
                  }}
                >
                  {content.welcome.heading}
                </h1>
              </motion.div>

              <motion.p
                className="scene-subtext"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                style={{
                  fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)',
                  color: '#e2e8f0',
                  textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                }}
              >
                {content.welcome.subtext}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              >
                <button
                  className="magic-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnter();
                  }}
                  autoFocus
                  aria-label="Enter Sameeksha's Universe"
                  style={{
                    boxShadow: '0 0 25px rgba(255, 0, 127, 0.55), 0 4px 15px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  <span>{content.welcome.button}</span>
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="waiting-kiss"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.9, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'fixed',
                bottom: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#fbcfe8',
                fontSize: '0.92rem',
                letterSpacing: '1.5px',
                textAlign: 'center',
                textShadow: '0 0 12px rgba(255, 0, 127, 0.7)',
                userSelect: 'none',
                background: 'rgba(10, 8, 20, 0.85)',
                padding: '8px 20px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 0, 127, 0.45)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.7)',
              }}
            >
              ✨ A sweet flying kiss is arriving for Sameeksha... (tap anywhere to open) 💋
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GalaxyScene;
