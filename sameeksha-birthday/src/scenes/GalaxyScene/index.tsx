import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import { soundManager } from '../../utils/audio';

// Interactive Mouse Parallax Camera to give dynamic 3D depth to the front page
function ParallaxCamera() {
  const { camera } = useThree();

  useFrame(({ mouse }) => {
    // Smooth lerp camera towards mouse position
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.8, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.5, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// 3D Glowing Celestial Starlight Heart in the distance
function CelestialHeart() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Exact parametric heart shape
  const heartShape = React.useMemo(() => {
    const shape = new THREE.Shape();
    const N = 48;
    const scale = 0.045;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3) * scale;
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    return shape;
  }, []);

  const extrudeSettings = {
    depth: 0.22,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.35;
      meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
      const pulse = 1 + Math.sin(t * 1.8) * 0.06;
      meshRef.current.scale.set(pulse, pulse, pulse);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.4) * 0.2;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
      <group position={[0, 0.2, -2.5]}>
        {/* Core Glowing Crystal Heart */}
        <mesh ref={meshRef}>
          <extrudeGeometry args={[heartShape, extrudeSettings]} />
          <meshStandardMaterial
            color="#ff4d8d"
            emissive="#ff1493"
            emissiveIntensity={1.2}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>

        {/* Orbiting Starlight Halo Ring */}
        <mesh ref={ringRef} position={[0, 0.1, 0]}>
          <torusGeometry args={[1.2, 0.018, 16, 64]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={1.5}
            metalness={0.9}
          />
        </mesh>

        <pointLight color="#ff4d8d" intensity={3.5} distance={8} />
        <pointLight color="#fbbf24" intensity={2.0} distance={6} position={[0, 1, 1]} />
      </group>
    </Float>
  );
}

// 3D Stardust and Constellation Particles
function Stardust() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 280;

  const [positions, colors] = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const c1 = new THREE.Color('#ff8fb3');
    const c2 = new THREE.Color('#fbbf24');
    const c3 = new THREE.Color('#a78bfa');

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;

      const pick = Math.random();
      const c = pick < 0.45 ? c1 : pick < 0.75 ? c2 : c3;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const GalaxyScene: React.FC = () => {
  const nextScene = useExperienceStore((s) => s.nextScene);
  const audioEnabled = useExperienceStore((s) => s.audioEnabled);
  const toggleAudio = useExperienceStore((s) => s.toggleAudio);
  const frontKissPopped = useExperienceStore((s) => s.frontKissPopped);
  const setFrontKissPopped = useExperienceStore((s) => s.setFrontKissPopped);

  // Safety fallback: if user waits more than 3.5s, reveal content automatically
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
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {/* 3D Canvas Background with interactive mouse parallax & celestial elements */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 58 }}>
          <ParallaxCamera />
          <ambientLight intensity={0.45} />
          <pointLight position={[5, 5, 5]} intensity={1.2} color="#fbbf24" />
          <Stars radius={100} depth={50} count={3800} factor={4} saturation={0.6} fade speed={1.2} />
          <Sparkles count={60} scale={8} size={2.2} speed={0.5} color="#fbbf24" />
          <Stardust />
          <CelestialHeart />
        </Canvas>
      </div>

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
                    fontWeight: 500,
                    textShadow: '0 0 12px rgba(255, 143, 179, 0.5)',
                  }}
                >
                  23 November 2026
                </div>
                <h1 className="scene-heading" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.2rem)' }}>
                  {content.welcome.heading}
                </h1>
              </motion.div>

              <motion.p
                className="scene-subtext"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)' }}
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
                >
                  <span>{content.welcome.button}</span>
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="waiting-kiss"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.85, y: 0 }}
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
                textShadow: '0 0 10px rgba(251, 191, 36, 0.6)',
                userSelect: 'none',
                background: 'rgba(15, 12, 34, 0.7)',
                padding: '6px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(251, 191, 36, 0.3)',
              }}
            >
              ✨ Companion se flying kiss aa rahi hai... (tap to reveal) 💋
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GalaxyScene;
