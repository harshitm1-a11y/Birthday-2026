import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
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

// 3D Stardust and Constellation Particles in Deep Space with Rotating Spotlight
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

// 3D Rotating Light Sweeping from the side across the scene
function RotatingSceneLight() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.9;
    if (lightRef.current) {
      lightRef.current.position.x = Math.cos(t) * 6;
      lightRef.current.position.y = Math.sin(t) * 4.5;
      lightRef.current.position.z = 3.5 + Math.sin(t * 0.6) * 1.5;
    }
  });

  return <pointLight ref={lightRef} intensity={2.8} distance={12} color="#fbbf24" />;
}

// Helper to generate centered parametric heart SVG path
function generateHeartPath(scale: number) {
  const N = 180;
  const yCenterOffset = 2.5385 * scale;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3) * scale;
    const rawY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
    const y = rawY - yCenterOffset;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return 'M ' + pts.join(' L ') + ' Z';
}

// 4 Concentric Nested Glowing Neon Hearts with 360° Rotating Light Sweep
function NestedParametricNeonHearts() {
  const path1 = useMemo(() => generateHeartPath(5.8), []); // Inner Core
  const path2 = useMemo(() => generateHeartPath(8.2), []); // Mid-Inner
  const path3 = useMemo(() => generateHeartPath(10.8), []); // Mid-Outer
  const path4 = useMemo(() => generateHeartPath(13.4), []); // Grand Outer

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: [0.98, 1.03, 0.98], opacity: 1 }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 5, // Above canvas-container (zIndex: 2), and directly BEHIND text (scene-overlay is zIndex: 10)
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width="560"
        height="520"
        viewBox="-240 -220 480 440"
        style={{
          width: 'min(94vw, 560px)',
          height: 'min(88vw, 520px)',
          overflow: 'visible',
          filter: 'drop-shadow(0 0 35px rgba(255, 0, 127, 0.75)) drop-shadow(0 0 65px rgba(255, 20, 147, 0.45))',
        }}
      >
        <defs>
          <filter id="neonBlurOuter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="neonBlurMid" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
          <linearGradient id="rotatingBeamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#fbbf24" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#ff007f" stopOpacity="0.45" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Outer Neon Heart (Scale 13.4) */}
        <motion.path
          d={path4}
          fill="none"
          stroke="#ff007f"
          strokeWidth="12"
          strokeOpacity="0.25"
          filter="url(#neonBlurOuter)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
        />
        <motion.path
          d={path4}
          fill="none"
          stroke="#ff007f"
          strokeWidth="2.2"
          strokeOpacity="0.65"
          strokeLinecap="round"
        />

        {/* 2. Mid-Outer Neon Heart (Scale 10.8) */}
        <motion.path
          d={path3}
          fill="none"
          stroke="#ff1493"
          strokeWidth="10"
          strokeOpacity="0.3"
          filter="url(#neonBlurMid)"
        />
        <motion.path
          d={path3}
          fill="none"
          stroke="#ff3399"
          strokeWidth="3.2"
          strokeOpacity="0.85"
          strokeLinecap="round"
        />

        {/* 3. Mid-Inner Neon Heart (Scale 8.2) */}
        <motion.path
          d={path2}
          fill="none"
          stroke="#fb7185"
          strokeWidth="7"
          strokeOpacity="0.4"
          filter="url(#neonBlurMid)"
        />
        <motion.path
          d={path2}
          fill="none"
          stroke="#f43f5e"
          strokeWidth="3.0"
          strokeOpacity="0.9"
          strokeLinecap="round"
        />

        {/* 4. Core Inner Brilliant Heart (Scale 5.8) */}
        <motion.path
          d={path1}
          fill="rgba(255, 0, 127, 0.04)"
          stroke="#ffffff"
          strokeWidth="3.2"
          strokeOpacity="0.98"
          strokeLinecap="round"
          filter="url(#neonBlurMid)"
        />
        <motion.path
          d={path1}
          fill="none"
          stroke="#fef08a"
          strokeWidth="1.8"
          strokeOpacity="1"
          strokeLinecap="round"
        />

        {/* 5. Continuous 360° Rotating Light Beam Sweep Ray across all 4 concentric hearts */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 5.2, ease: 'linear' }}
          style={{ originX: '0px', originY: '0px' }}
        >
          <line
            x1="0"
            y1="0"
            x2="240"
            y2="0"
            stroke="url(#rotatingBeamGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#neonBlurMid)"
          />
          <circle cx="215" cy="0" r="7" fill="#ffffff" filter="url(#neonBlurOuter)" />
          <circle cx="170" cy="0" r="5" fill="#fcd34d" filter="url(#neonBlurMid)" />
          <circle cx="125" cy="0" r="4.5" fill="#ff69b4" />
          <circle cx="85" cy="0" r="3.5" fill="#ffffff" />
        </motion.g>

        {/* Orbiting Starlight Glitter Flares */}
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.circle
            key={i}
            r="2.4"
            fill="#ffffff"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.8, 0.8],
            }}
            transition={{
              duration: 2.2,
              delay: i * 0.12,
              repeat: Infinity,
            }}
            cx={Math.sin((i / 18) * Math.PI * 2) * 165}
            cy={Math.cos((i / 18) * Math.PI * 2) * 145}
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
  const setFrontKissPopped = useExperienceStore((s) => s.setFrontKissPopped);

  // Auto-reveal welcome content immediately on mount
  useEffect(() => {
    setFrontKissPopped(true);
    // Auto-start ambient music if ready
    soundManager.initCtx();
    soundManager.playTrack('hindi-tum-hi-ho');
    soundManager.startAmbient();
  }, [setFrontKissPopped]);

  const handleEnter = () => {
    soundManager.playTwinkle();
    if (!audioEnabled) {
      toggleAudio();
      soundManager.startAmbient();
    }
    nextScene();
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#04030a', // Deep luxury dark midnight background as requested
      }}
    >
      {/* 3D Canvas Background with subtle dark starfield & rotating side spotlight */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 58 }}>
          <ParallaxCamera />
          <ambientLight intensity={0.25} />
          <pointLight position={[5, 5, 5]} intensity={0.9} color="#fbbf24" />
          <pointLight position={[-5, -3, 3]} intensity={0.8} color="#ff007f" />
          <RotatingSceneLight />
          <Stars radius={90} depth={50} count={3500} factor={3.5} saturation={0.4} fade speed={1.0} />
          <Sparkles count={60} scale={7.5} size={2.2} speed={0.4} color="#ff69b4" />
          <Stardust />
        </Canvas>
      </div>

      {/* 4 Concentric Nested Glowing Neon Hearts + 360° Rotating Light Sweep (BEHIND text at zIndex: 1) */}
      <NestedParametricNeonHearts />

      {/* Centered DOM Overlay Content (Directly ON TOP of the glowing hearts at zIndex: 10) */}
      <div className="scene-overlay" style={{ zIndex: 10, pointerEvents: 'none' }}>
        <motion.div
          key="welcome-content"
          className="scene-content"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ pointerEvents: 'auto', textAlign: 'center', maxWidth: '720px' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            <div
              style={{
                fontSize: '1.25rem',
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
                textShadow: '0 0 35px rgba(255, 0, 127, 0.65), 0 2px 10px rgba(0,0,0,0.85)',
              }}
            >
              {content.welcome.heading}
            </h1>
          </motion.div>

          <motion.p
            className="scene-subtext"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            style={{
              fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)',
              color: '#e2e8f0',
              textShadow: '0 2px 10px rgba(0,0,0,0.85)',
              margin: '0 auto 1.8rem auto',
              maxWidth: '560px',
            }}
          >
            {content.welcome.subtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, type: 'spring', stiffness: 220 }}
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
                boxShadow: '0 0 25px rgba(255, 0, 127, 0.6), 0 4px 15px rgba(0, 0, 0, 0.6)',
              }}
            >
              <span>{content.welcome.button}</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default GalaxyScene;
