import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import HiddenHeart from '../../components/HiddenHeart';
import { soundManager } from '../../utils/audio';

// 3D Cute Robot Mascot
function CuteCompanion({ isBouncing, onClick }: { isBouncing: boolean; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      if (isBouncing) {
        groupRef.current.position.y = Math.sin(t * 8) * 0.25;
        groupRef.current.rotation.y = Math.sin(t * 4) * 0.4;
      } else {
        groupRef.current.position.y = Math.sin(t * 2) * 0.1;
        groupRef.current.rotation.y = Math.sin(t * 1) * 0.15;
      }
    }
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 1.5) * 0.08;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        position={[0, -0.2, 0]}
      >
        {/* Pear Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial
            color="#ff8fb3"
            roughness={0.25}
            metalness={0.2}
          />
        </mesh>

        {/* Tummy Patch */}
        <mesh position={[0, -0.05, 0.72]} scale={[0.65, 0.6, 0.3]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color="#fff0f5" roughness={0.4} />
        </mesh>

        {/* Floating Hands */}
        <mesh position={[-1.1, 0.1, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[1.1, 0.1, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Head Group */}
        <group ref={headRef} position={[0, 1.05, 0]}>
          {/* Head */}
          <mesh castShadow>
            <sphereGeometry args={[0.75, 32, 32]} />
            <meshStandardMaterial
              color="#ff6b9d"
              roughness={0.2}
              metalness={0.2}
            />
          </mesh>

          {/* Rosy Cheeks */}
          <mesh position={[-0.45, -0.15, 0.6]}>
            <circleGeometry args={[0.12, 16]} />
            <meshBasicMaterial color="#ff1493" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.45, -0.15, 0.6]}>
            <circleGeometry args={[0.12, 16]} />
            <meshBasicMaterial color="#ff1493" transparent opacity={0.6} />
          </mesh>

          {/* Left Eye */}
          <mesh ref={eyeLeftRef} position={[-0.25, 0.05, 0.68]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
          {/* Left Eye Highlight */}
          <mesh position={[-0.22, 0.09, 0.76]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Right Eye */}
          <mesh ref={eyeRightRef} position={[0.25, 0.05, 0.68]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
          {/* Right Eye Highlight */}
          <mesh position={[0.28, 0.09, 0.76]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Antenna */}
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Antenna Heart/Star bulb */}
          <mesh position={[0, 1.08, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.5}
            />
          </mesh>
          <pointLight position={[0, 1.08, 0]} color="#fbbf24" intensity={1.5} distance={3} />
        </group>
      </group>
    </Float>
  );
}

const CompanionScene: React.FC = () => {
  const nextScene = useExperienceStore((s) => s.nextScene);
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [bouncing, setBouncing] = useState(false);

  const dialogues = content.companion.dialogues;
  const isLast = dialogueIdx >= dialogues.length - 1;

  const handleNextDialogue = () => {
    soundManager.playTwinkle();
    setBouncing(true);
    setTimeout(() => setBouncing(false), 600);

    if (!isLast) {
      setDialogueIdx((prev) => prev + 1);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D Canvas */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0.6, 4.2], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 6, 4]} intensity={1.5} />
          <pointLight position={[-3, -1, 2]} intensity={1} color="#ff8fb3" />
          <Sparkles count={50} scale={5} size={2} speed={0.4} color="#f472b6" />

          <CuteCompanion isBouncing={bouncing} onClick={handleNextDialogue} />
        </Canvas>
      </div>

      {/* DOM Overlay */}
      <div className="scene-overlay">
        <motion.div
          className="scene-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {/* Dialogue Speech Bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={dialogueIdx}
              className="companion-bubble"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ type: 'spring', damping: 15 }}
              onClick={handleNextDialogue}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              {dialogues[dialogueIdx]}
            </motion.div>
          </AnimatePresence>

          {/* Action buttons */}
          <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {!isLast ? (
              <button
                className="magic-button"
                onClick={handleNextDialogue}
                aria-label="Hear more from companion"
              >
                <span>Continue Talking 💬 ✨</span>
              </button>
            ) : (
              <motion.button
                className="magic-button"
                onClick={nextScene}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                aria-label="Bring out the birthday cake"
              >
                <span>Bring Out The Cake! 🎂 ✨</span>
              </motion.button>
            )}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.8rem' }}>
            Tip: Tap your companion to interact!
          </div>
        </motion.div>
      </div>

      {/* Hidden Heart 3 */}
      <HiddenHeart
        heartId={3}
        style={{
          position: 'fixed',
          top: '20%',
          left: '3rem',
          zIndex: 60,
          background: 'none',
          border: 'none',
          fontSize: '1.8rem',
          cursor: 'pointer',
        }}
      />
    </div>
  );
};

export default CompanionScene;
