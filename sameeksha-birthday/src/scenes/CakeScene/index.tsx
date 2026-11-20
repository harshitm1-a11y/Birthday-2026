import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import Celebration from '../../components/Celebration';
import { soundManager } from '../../utils/audio';

// Single 3D Candle with flickering flame
function Candle({ position, blown }: { position: [number, number, number]; blown: boolean }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!blown && flameRef.current) {
      const t = clock.getElapsedTime() * 15;
      const flicker = 1 + Math.sin(t) * 0.15;
      flameRef.current.scale.set(flicker, flicker * 1.2, flicker);
      if (lightRef.current) {
        lightRef.current.intensity = 1.2 + Math.sin(t * 1.5) * 0.3;
      }
    } else if (flameRef.current) {
      flameRef.current.scale.set(0, 0, 0);
      if (lightRef.current) {
        lightRef.current.intensity = 0;
      }
    }
  });

  return (
    <group position={position}>
      {/* Candle Body */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 16]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.53, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>
      {/* Flame */}
      {!blown && (
        <group position={[0, 0.62, 0]}>
          <mesh ref={flameRef}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f97316"
              emissiveIntensity={2.5}
            />
          </mesh>
          <pointLight ref={lightRef} color="#f97316" intensity={1.5} distance={2} />
        </group>
      )}
    </group>
  );
}

// 3D Gourmet Birthday Cake
function BirthdayCake({ blown }: { blown: boolean }) {
  const cakeGroup = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (cakeGroup.current) {
      cakeGroup.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  // Calculate 5 candle positions in a circle on top tier
  const candlePositions = React.useMemo(() => {
    const positions: [number, number, number][] = [];
    const count = 5;
    const r = 0.65;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions.push([Math.cos(angle) * r, 0.95, Math.sin(angle) * r]);
    }
    return positions;
  }, []);

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={cakeGroup} position={[0, -0.6, 0]}>
        {/* Cake Stand */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[2.3, 2.3, 0.1, 32]} />
          <meshStandardMaterial color="#d4a574" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.6, 1.2, 0.4, 32]} />
          <meshStandardMaterial color="#d4a574" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Tier 1 (Bottom) */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[1.9, 1.9, 0.9, 32]} />
          <meshStandardMaterial color="#be185d" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Tier 1 Cream Band */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[1.95, 1.95, 0.1, 32]} />
          <meshStandardMaterial color="#fff0f5" roughness={0.4} />
        </mesh>

        {/* Tier 2 (Top) */}
        <mesh position={[0, 1.15, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.7, 32]} />
          <meshStandardMaterial color="#db2777" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Tier 2 Cream Band */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[1.25, 1.25, 0.08, 32]} />
          <meshStandardMaterial color="#fff0f5" roughness={0.4} />
        </mesh>

        {/* Golden Plaque in front */}
        <group position={[0, 0.4, 1.92]}>
          <mesh>
            <boxGeometry args={[1.8, 0.45, 0.06]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
          </mesh>
          <Text
            position={[0, 0, 0.04]}
            fontSize={0.22}
            color="#4a044e"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff"
          >
            SAMEEKSHA
          </Text>
        </group>

        {/* 5 Candles */}
        {candlePositions.map((pos, idx) => (
          <Candle key={idx} position={pos} blown={blown} />
        ))}
      </group>
    </Float>
  );
}

const CakeScene: React.FC = () => {
  const nextScene = useExperienceStore((s) => s.nextScene);
  const candlesBlown = useExperienceStore((s) => s.candlesBlown);
  const setCandlesBlown = useExperienceStore((s) => s.setCandlesBlown);
  const [blown, setBlown] = useState(candlesBlown);

  const handleBlow = () => {
    if (!blown) {
      setBlown(true);
      setCandlesBlown();
      soundManager.playCelebrationTune();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D Canvas */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 1.2, 5.2], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} />
          <pointLight position={[-4, 2, 2]} intensity={0.8} color="#ff6b9d" />
          <Sparkles count={60} scale={6} size={2.5} speed={0.4} color="#fbbf24" />

          <BirthdayCake blown={blown} />
        </Canvas>
      </div>

      {/* Fullscreen Celebration Canvas */}
      <Celebration active={blown} />

      {/* DOM Overlay */}
      <div className="scene-overlay">
        <motion.div
          className="scene-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="scene-heading">{content.cake.heading}</h2>
          <p className="scene-subtext">{content.cake.subtext}</p>

          <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {!blown ? (
              <motion.button
                className="magic-button"
                onClick={handleBlow}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Blow the birthday candles"
              >
                <span>Blow the Candles 🎂 💨</span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ color: '#fbbf24', fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem' }}>
                  🎉 May all your dreams come true! ✨
                </div>
                <button
                  className="magic-button"
                  onClick={nextScene}
                  aria-label="Read your birthday letter"
                >
                  <span>Read Your Birthday Letter 💌 ✨</span>
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CakeScene;
