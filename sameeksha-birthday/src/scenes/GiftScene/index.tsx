import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import HiddenHeart from '../../components/HiddenHeart';
import { soundManager } from '../../utils/audio';

// 3D Gift Box Component
function GiftBox({ isOpen, onOpen }: { isOpen: boolean; onOpen: () => void }) {
  const boxGroupRef = useRef<THREE.Group>(null);
  const lidGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (boxGroupRef.current && !isOpen) {
      boxGroupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
    if (lidGroupRef.current) {
      if (isOpen) {
        // Animate lid flying up and tilting
        lidGroupRef.current.position.y = THREE.MathUtils.lerp(lidGroupRef.current.position.y, 2.2, 0.08);
        lidGroupRef.current.rotation.x = THREE.MathUtils.lerp(lidGroupRef.current.rotation.x, -0.6, 0.08);
      } else {
        lidGroupRef.current.position.y = 0.75;
        lidGroupRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group
        ref={boxGroupRef}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        {/* Base Box */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.3, 1.5]} />
          <meshStandardMaterial
            color="#9d174d"
            roughness={0.25}
            metalness={0.4}
            envMapIntensity={1}
          />
        </mesh>

        {/* Base Ribbon Cross - Vertical X */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.26, 1.32, 1.52]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Base Ribbon Cross - Vertical Z */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.52, 1.32, 0.26]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Lid Group */}
        <group ref={lidGroupRef} position={[0, 0.75, 0]}>
          {/* Lid main */}
          <mesh castShadow>
            <boxGeometry args={[1.6, 0.3, 1.6]} />
            <meshStandardMaterial
              color="#be185d"
              roughness={0.2}
              metalness={0.4}
            />
          </mesh>

          {/* Lid Ribbon Cross */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.26, 0.32, 1.62]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[1.62, 0.32, 0.26]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Golden Bow on top */}
          <group position={[0, 0.25, 0]}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <torusGeometry args={[0.2, 0.07, 16, 32]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}>
              <torusGeometry args={[0.2, 0.07, 16, 32]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#fcd34d" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        </group>

        {/* Platform pedestal */}
        <mesh position={[0, -0.75, 0]} receiveShadow>
          <cylinderGeometry args={[1.6, 1.8, 0.2, 32]} />
          <meshStandardMaterial color="#1e1035" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

// Particles exploding from the open gift
function GiftBurst() {
  const count = 40;
  const meshRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRefs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.position.y += 0.02;
        mesh.rotation.y = t * 2 + i;
        mesh.rotation.x = t + i;
      }
    });
  });

  return (
    <group position={[0, 1, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = 0.5 + Math.random() * 1.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.random() * 2;
        return (
          <mesh
            key={i}
            ref={(el) => {
              if (el) meshRefs.current[i] = el;
            }}
            position={[x, y, z]}
          >
            <sphereGeometry args={[0.06 + Math.random() * 0.04, 8, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#ff6b9d' : '#fbbf24'}
              emissive={i % 2 === 0 ? '#ff1493' : '#f59e0b'}
              emissiveIntensity={1.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

const GiftScene: React.FC = () => {
  const nextScene = useExperienceStore((s) => s.nextScene);
  const giftOpened = useExperienceStore((s) => s.giftOpened);
  const setGiftOpened = useExperienceStore((s) => s.setGiftOpened);
  const [localOpened, setLocalOpened] = useState(giftOpened);

  const handleOpen = () => {
    if (!localOpened) {
      soundManager.playTwinkle();
      setLocalOpened(true);
      setGiftOpened();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D Canvas with drag rotation */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 1.2, 4.2], fov: 50 }} shadows>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
          <pointLight position={[-4, 3, -2]} intensity={1} color="#ff6b9d" />
          <pointLight position={[3, -2, 2]} intensity={0.8} color="#fbbf24" />

          <Sparkles count={80} scale={6} size={2.5} speed={0.5} color="#fcd34d" />
          <GiftBox isOpen={localOpened} onOpen={handleOpen} />
          {localOpened && <GiftBurst />}

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2 + 0.1}
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>
      </div>

      {/* DOM Overlay */}
      <div className="scene-overlay">
        <motion.div
          className="scene-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="scene-heading">{content.gift.heading}</h2>
          <p className="scene-subtext">{content.gift.subtext}</p>

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {!localOpened ? (
              <motion.button
                className="magic-button"
                onClick={handleOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open your birthday gift"
              >
                <span>{content.gift.button}</span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ color: '#fbbf24', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>
                  ✨ Surprises unlocked! ✨
                </div>
                <button
                  className="magic-button"
                  onClick={nextScene}
                  aria-label="Step into memories"
                >
                  <span>Step Inside Your Memories 📸 ✨</span>
                </button>
              </motion.div>
            )}
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
              Tip: Drag to rotate the 3D gift box
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hidden Heart 1 */}
      <HiddenHeart
        heartId={1}
        style={{
          position: 'fixed',
          top: '5.5rem',
          right: '2rem',
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

export default GiftScene;
