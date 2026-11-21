import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import { soundManager } from '../../utils/audio';
import { robotSpeaker } from '../../utils/speech';

// 3D Gift Box Component with scaled-down dimensions & animated lid
function GiftBox({ isOpen, onOpen }: { isOpen: boolean; onOpen: () => void }) {
  const boxGroupRef = useRef<THREE.Group>(null);
  const lidGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (boxGroupRef.current && !isOpen) {
      boxGroupRef.current.rotation.y = clock.getElapsedTime() * 0.22;
    }
    if (lidGroupRef.current) {
      if (isOpen) {
        lidGroupRef.current.position.y = THREE.MathUtils.lerp(lidGroupRef.current.position.y, 2.2, 0.07);
        lidGroupRef.current.position.z = THREE.MathUtils.lerp(lidGroupRef.current.position.z, -0.85, 0.07);
        lidGroupRef.current.rotation.x = THREE.MathUtils.lerp(lidGroupRef.current.rotation.x, -0.85, 0.07);
      } else {
        lidGroupRef.current.position.y = 0.6;
        lidGroupRef.current.position.z = 0;
        lidGroupRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.16}>
      <group
        ref={boxGroupRef}
        position={[0, -0.4, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        {/* Base Box Outer - Scaled down */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial
            color="#9d174d"
            roughness={0.25}
            metalness={0.4}
            envMapIntensity={1}
          />
        </mesh>

        {/* Base Ribbon Cross - Vertical X */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.22, 1.02, 1.22]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Base Ribbon Cross - Vertical Z */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.22, 1.02, 0.22]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Interior Velvet Display Cushion */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.1, 0.22, 1.1]} />
          <meshStandardMaterial color="#4c0519" roughness={0.8} />
        </mesh>

        {/* Lid Group */}
        <group ref={lidGroupRef} position={[0, 0.6, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.28, 0.24, 1.28]} />
            <meshStandardMaterial
              color="#be185d"
              roughness={0.2}
              metalness={0.4}
            />
          </mesh>

          {/* Lid Ribbon Cross */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.22, 0.26, 1.3]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[1.3, 0.26, 0.22]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Golden Bow on top */}
          <group position={[0, 0.2, 0]}>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <torusGeometry args={[0.16, 0.055, 16, 32]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}>
              <torusGeometry args={[0.16, 0.055, 16, 32]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#fcd34d" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        </group>

        {/* Platform pedestal */}
        <mesh position={[0, -0.6, 0]} receiveShadow>
          <cylinderGeometry args={[1.3, 1.45, 0.16, 32]} />
          <meshStandardMaterial color="#1e1035" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

// 3D Cute Plush Teddy Bear inside the gift
function TeddyBear3D({ isOpen }: { isOpen: boolean }) {
  const teddyRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!teddyRef.current) return;
    const t = clock.getElapsedTime();
    if (isOpen) {
      teddyRef.current.position.y = THREE.MathUtils.lerp(teddyRef.current.position.y, 0.85, 0.06);
      teddyRef.current.position.x = THREE.MathUtils.lerp(teddyRef.current.position.x, -0.75, 0.06);
      teddyRef.current.rotation.y = Math.PI / 8 + Math.sin(t * 1.5) * 0.1;
      teddyRef.current.rotation.z = Math.sin(t * 1.8) * 0.04;
    } else {
      teddyRef.current.position.set(0, 0, 0);
    }
  });

  return (
    <group ref={teddyRef} position={[0, 0, 0]} scale={[0.55, 0.55, 0.55]}>
      {/* Body */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.38, 20, 20]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>
      {/* Belly patch */}
      <mesh position={[0, 0.35, 0.28]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.9} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.82, 0]}>
        <sphereGeometry args={[0.32, 20, 20]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.76, 0.26]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.9} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.82, 0.37]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#18181b" roughness={0.3} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.1, 0.88, 0.28]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#09090b" roughness={0.1} />
      </mesh>
      <mesh position={[-0.1, 0.88, 0.28]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#09090b" roughness={0.1} />
      </mesh>
      {/* Ears */}
      <mesh position={[0.26, 1.08, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      <mesh position={[-0.26, 1.08, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      {/* Red Bow Tie */}
      <mesh position={[0, 0.6, 0.32]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.12, 0.12, 0.04]} />
        <meshStandardMaterial color="#ef4444" roughness={0.4} />
      </mesh>
      {/* Paws */}
      <mesh position={[0.34, 0.38, 0.15]}>
        <sphereGeometry args={[0.11, 14, 14]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>
      <mesh position={[-0.34, 0.38, 0.15]}>
        <sphereGeometry args={[0.11, 14, 14]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>
    </group>
  );
}

// 3D Red Rose / Flower Bouquet inside the gift
function RoseBouquet3D({ isOpen }: { isOpen: boolean }) {
  const roseRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!roseRef.current) return;
    const t = clock.getElapsedTime();
    if (isOpen) {
      roseRef.current.position.y = THREE.MathUtils.lerp(roseRef.current.position.y, 0.85, 0.06);
      roseRef.current.position.x = THREE.MathUtils.lerp(roseRef.current.position.x, 0.75, 0.06);
      roseRef.current.rotation.y = -Math.PI / 8 - Math.sin(t * 1.5) * 0.1;
      roseRef.current.rotation.z = Math.cos(t * 1.6) * 0.05;
    } else {
      roseRef.current.position.set(0, 0, 0);
    }
  });

  return (
    <group ref={roseRef} position={[0, 0, 0]} scale={[0.55, 0.55, 0.55]}>
      {/* Central Red Rose Bloom */}
      <group position={[0, 0.8, 0]}>
        {/* Rose core */}
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        {/* Rose Petal Shell 1 */}
        <mesh rotation={[0.4, 0.5, 0]}>
          <cylinderGeometry args={[0.26, 0.18, 0.22, 16, 1, true]} />
          <meshStandardMaterial color="#e11d48" roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* Rose Petal Shell 2 */}
        <mesh rotation={[-0.3, -0.6, 0.3]}>
          <cylinderGeometry args={[0.32, 0.22, 0.26, 16, 1, true]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Side Rosebud 1 */}
      <group position={[-0.24, 0.65, 0.1]}>
        <mesh>
          <sphereGeometry args={[0.13, 14, 14]} />
          <meshStandardMaterial color="#fb7185" roughness={0.3} />
        </mesh>
      </group>

      {/* Side Rosebud 2 */}
      <group position={[0.22, 0.65, 0.12]}>
        <mesh>
          <sphereGeometry args={[0.13, 14, 14]} />
          <meshStandardMaterial color="#fb7185" roughness={0.3} />
        </mesh>
      </group>

      {/* Emerald Stems */}
      <mesh position={[0, 0.25, 0]} rotation={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.035, 0.035, 0.7, 12]} />
        <meshStandardMaterial color="#15803d" roughness={0.5} />
      </mesh>

      {/* Leaves */}
      <mesh position={[0.14, 0.32, 0.08]} rotation={[0.5, 0.2, 0.6]}>
        <coneGeometry args={[0.1, 0.24, 6]} />
        <meshStandardMaterial color="#16a34a" roughness={0.4} />
      </mesh>
      <mesh position={[-0.14, 0.22, -0.05]} rotation={[-0.5, -0.2, -0.6]}>
        <coneGeometry args={[0.1, 0.24, 6]} />
        <meshStandardMaterial color="#16a34a" roughness={0.4} />
      </mesh>

      {/* Golden Floral Wrap Ribbon */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.14, 0.08, 0.25, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 3D Physical Gift Centerpiece: Diamond & Rose Gold Eternity Heart Pendant
function PhysicalGift({ isOpen }: { isOpen: boolean }) {
  const giftRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Exact parametric heart shape
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const N = 48;
    const scale = 0.026;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3) * scale;
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    return shape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.14,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!giftRef.current) return;
    const t = clock.getElapsedTime();

    if (isOpen) {
      giftRef.current.position.y = THREE.MathUtils.lerp(giftRef.current.position.y, 1.15, 0.06);
      giftRef.current.rotation.y = t * 0.75;
      giftRef.current.position.y += Math.sin(t * 2) * 0.003;
    } else {
      giftRef.current.position.y = 0.15;
      giftRef.current.rotation.y = 0;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.8;
      ringRef.current.rotation.x = Math.PI / 4 + Math.sin(t) * 0.15;
    }
  });

  return (
    <group ref={giftRef} position={[0, 0.15, 0]}>
      {/* Rose Gold / Ruby Crystal Heart Pendant */}
      <mesh position={[0, 0.05, -0.07]}>
        <extrudeGeometry args={[heartShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color="#f43f5e"
          emissive="#e11d48"
          emissiveIntensity={0.65}
          roughness={0.12}
          metalness={0.4}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.3}
          reflectivity={0.9}
        />
      </mesh>

      {/* Sparkling Brilliant Diamond at the Center */}
      <mesh position={[0, 0.06, 0.03]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#fef08a"
          emissiveIntensity={0.8}
          roughness={0.05}
          metalness={0.95}
          clearcoat={1}
        />
      </mesh>

      {/* Golden Bail */}
      <mesh position={[0, 0.38, 0]}>
        <torusGeometry args={[0.07, 0.02, 16, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Golden Orbital Halo Ring */}
      <mesh ref={ringRef} position={[0, 0.06, 0]}>
        <torusGeometry args={[0.62, 0.014, 16, 64]} />
        <meshStandardMaterial color="#fcd34d" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Point lights */}
      <pointLight color="#ff2d75" intensity={isOpen ? 3.0 : 0} distance={3.2} />
      <pointLight color="#fbbf24" intensity={isOpen ? 2.2 : 0} distance={2.5} position={[0, 0.2, 0.3]} />

      {isOpen && (
        <Sparkles
          count={40}
          scale={1.8}
          size={3.0}
          speed={1.2}
          color="#fda4af"
        />
      )}
    </group>
  );
}

// Particles bursting from the open gift
function GiftBurst() {
  const count = 36;
  const meshRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRefs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.position.y += 0.018;
        mesh.rotation.y = t * 2 + i;
        mesh.rotation.x = t + i;
      }
    });
  });

  return (
    <group position={[0, 0.8, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = 0.5 + Math.random() * 1.3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.random() * 1.8;
        return (
          <mesh
            key={i}
            ref={(el) => {
              if (el) meshRefs.current[i] = el;
            }}
            position={[x, y, z]}
          >
            <sphereGeometry args={[0.05 + Math.random() * 0.03, 8, 8]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#ff6b9d' : i % 3 === 1 ? '#fbbf24' : '#a855f7'}
              emissive={i % 3 === 0 ? '#ff1493' : '#f59e0b'}
              emissiveIntensity={1.4}
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
      soundManager.playPopperBurstSound();
      setLocalOpened(true);
      setGiftOpened();
      robotSpeaker.speak('Happy Birthday Sameeksha! Ye khas birthday gift hamper aapke liye hai! Teddy, Roses aur Diamond Heart! 🧸🌹💎');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D Canvas: Center view is scaled nicely to fit entire gift + teddy + flowers on screen */}
      <div className="canvas-container" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Canvas camera={{ position: [0, 1.1, 4.2], fov: 45 }} shadows>
          <ambientLight intensity={0.65} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
          <pointLight position={[-4, 3, -2]} intensity={1.1} color="#ff6b9d" />
          <pointLight position={[3, -2, 2]} intensity={0.9} color="#fbbf24" />

          <Sparkles count={80} scale={5.5} size={2.4} speed={0.5} color="#fcd34d" />
          <GiftBox isOpen={localOpened} onOpen={handleOpen} />
          <TeddyBear3D isOpen={localOpened} />
          <RoseBouquet3D isOpen={localOpened} />
          <PhysicalGift isOpen={localOpened} />
          {localOpened && <GiftBurst />}

          <OrbitControls
            enableRotate
            enableZoom
            enablePan={false}
            maxPolarAngle={Math.PI / 2 + 0.1}
            minPolarAngle={Math.PI / 6}
            minDistance={2.6}
            maxDistance={6.0}
          />
        </Canvas>
      </div>

      {/* Top Header Bar */}
      <div
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'none',
          textAlign: 'center',
          maxWidth: '92vw',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            margin: 0,
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.4rem, 4vw, 2.3rem)',
            color: '#fff',
            textShadow: '0 2px 20px rgba(251, 191, 36, 0.6), 0 0 10px rgba(244, 63, 94, 0.4)',
            letterSpacing: '1px',
          }}
        >
          {content.gift.heading}
        </motion.h2>

        <div
          style={{
            background: 'rgba(15, 12, 34, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(251, 191, 36, 0.35)',
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '0.75rem',
            color: '#fbbf24',
            userSelect: 'none',
          }}
        >
          {localOpened ? '👆 Drag to rotate 3D gifts 360° • Teddy, Rose & Diamond' : '🎁 Tap the gift box or button below to open!'}
        </div>
      </div>

      {/* Bottom Center Trigger (Before opened) */}
      {!localOpened && (
        <div
          style={{
            position: 'fixed',
            bottom: '26px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 45,
            pointerEvents: 'none',
          }}
        >
          <motion.button
            className="magic-button"
            onClick={handleOpen}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open your birthday gift"
            style={{
              pointerEvents: 'auto',
              boxShadow: '0 8px 30px rgba(244, 63, 94, 0.5)',
              fontSize: '1.05rem',
              padding: '0.9rem 2.4rem',
            }}
          >
            <span>{content.gift.button} 🎁 ✨</span>
          </motion.button>
        </div>
      )}

      {/* Side Docked Card (After opened) */}
      <AnimatePresence>
        {localOpened && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'spring', damping: 16 }}
            style={{
              position: 'fixed',
              right: '20px',
              bottom: '24px',
              zIndex: 50,
              maxWidth: '360px',
              width: 'calc(100vw - 40px)',
              background: 'linear-gradient(135deg, rgba(28, 16, 52, 0.94), rgba(14, 10, 32, 0.96))',
              border: '1px solid rgba(251, 191, 36, 0.45)',
              borderRadius: '20px',
              padding: '1rem 1.2rem',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(244, 63, 94, 0.25)',
              backdropFilter: 'blur(16px)',
              textAlign: 'left',
              color: '#fff',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, rgba(244,63,94,0.3), rgba(251,191,36,0.3))',
                border: '1px solid rgba(251, 191, 36, 0.6)',
                borderRadius: '16px',
                padding: '3px 10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '1px',
                color: '#fef08a',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
              }}
            >
              💝 Birthday Hamper: Teddy, Roses & Diamond 💝
            </div>

            <h3
              style={{
                fontSize: '1.02rem',
                color: '#fff',
                margin: '0 0 0.35rem 0',
                background: 'linear-gradient(135deg, #ffffff, #fcd34d, #fda4af)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              ✨ For You Sameeksha Baby ✨
            </h3>

            <p
              style={{
                fontSize: '0.82rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.45,
                margin: '0 0 0.8rem 0',
                fontStyle: 'italic',
              }}
            >
              "Ye pyara Teddy, taaza laal gulaab aur ye heere jaisa dil... sab aapki khushi ke liye hai. Aapki muskaan hi meri sabse badi daulat hai. Happy Birthday! 💖"
            </p>

            <motion.button
              className="magic-button"
              onClick={nextScene}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Step into memories"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.7rem 1.2rem',
                fontSize: '0.88rem',
                boxShadow: '0 4px 15px rgba(244, 63, 94, 0.4)',
              }}
            >
              <span>Step Inside Your Memories 📸 ✨</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftScene;
