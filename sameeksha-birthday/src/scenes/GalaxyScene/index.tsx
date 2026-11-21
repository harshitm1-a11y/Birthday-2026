import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import { soundManager } from '../../utils/audio';

// 3D Glowing Celestial Heart in the distance
function CelestialHeart() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Procedural heart 2D shape extruded
  const heartShape = React.useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.25, y + 0.25);
    shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);
    return shape;
  }, []);

  const extrudeSettings = {
    depth: 0.2,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  };

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.rotation.y = Math.sin(t * 0.4) * 0.3;
      meshRef.current.rotation.z = Math.PI; // flip upright
      const scale = 1 + Math.sin(t * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={[-0.25, -0.3, -3]}>
        <mesh ref={meshRef}>
          <extrudeGeometry args={[heartShape, extrudeSettings]} />
          <meshStandardMaterial
            color="#ff6b9d"
            emissive="#ff1493"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
        <pointLight color="#ff6b9d" intensity={3} distance={10} />
      </group>
    </Float>
  );
}

// Stardust particles
function Stardust() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  const [positions, colors] = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const c1 = new THREE.Color('#ff8fb3');
    const c2 = new THREE.Color('#fbbf24');
    const c3 = new THREE.Color('#93c5fd');

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;

      const pick = Math.random();
      const c = pick < 0.5 ? c1 : pick < 0.8 ? c2 : c3;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const GalaxyScene: React.FC = () => {
  const nextScene = useExperienceStore((s) => s.nextScene);
  const audioEnabled = useExperienceStore((s) => s.audioEnabled);
  const toggleAudio = useExperienceStore((s) => s.toggleAudio);

  const handleEnter = () => {
    soundManager.playTwinkle();
    if (!audioEnabled) {
      toggleAudio();
      soundManager.startAmbient();
    }
    nextScene();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D Canvas Background */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#fbbf24" />
          <Stars radius={100} depth={50} count={3500} factor={4} saturation={0.5} fade speed={1.2} />
          <Stardust />
          <CelestialHeart />
        </Canvas>
      </div>

      {/* DOM Overlay */}
      <div className="scene-overlay">
        <motion.div
          className="scene-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <div style={{ fontSize: '1.2rem', letterSpacing: '4px', textTransform: 'uppercase', color: '#ff8fb3', marginBottom: '0.8rem', fontWeight: 500 }}>
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
            transition={{ delay: 0.8, duration: 1 }}
            style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)' }}
          >
            {content.welcome.subtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, type: 'spring', stiffness: 200 }}
          >
            <button
              className="magic-button"
              onClick={handleEnter}
              autoFocus
              aria-label="Enter Sameeksha's Universe"
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
