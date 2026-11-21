import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { soundManager } from '../../utils/audio';
import { robotSpeaker } from '../../utils/speech';

// Gift IDs
type GiftChoiceId = 'teddy' | 'rose' | 'diamond' | 'chocolates';

interface GiftChoice {
  id: GiftChoiceId;
  name: string;
  emoji: string;
  tag: string;
  description: string;
}

const GIFTS: GiftChoice[] = [
  {
    id: 'teddy',
    name: 'Plush Fluffy Teddy Bear',
    emoji: '🧸',
    tag: 'Soft Cuddles',
    description: 'Ultra-soft honey plush bear with a ruby satin bowtie, to remind you of Harshit\'s warmth every single day!',
  },
  {
    id: 'rose',
    name: '100 Royal Red Velvet Roses',
    emoji: '🌹',
    tag: 'Eternal Romance',
    description: '100 freshly bloomed velvet red roses radiating elegance and romance, just as radiant as Sameeksha!',
  },
  {
    id: 'diamond',
    name: 'Diamond & Rose-Gold Eternity Heart',
    emoji: '💎',
    tag: 'Precious Gem',
    description: 'Shining brilliant diamond heart with an orbital rose-gold halo ring — a symbol of true love and timeless commitment.',
  },
  {
    id: 'chocolates',
    name: 'Belgian Royal Chocolate Truffles',
    emoji: '🍫',
    tag: 'Sweet Moments',
    description: 'Handcrafted luxury Belgian chocolate truffles dusted with edible gold leaf, just as delightfully sweet as your smile!',
  },
];

// 3D Gift Box Component with animated lid
function GiftBox({ isOpen, onOpen }: { isOpen: boolean; onOpen: () => void }) {
  const boxGroupRef = useRef<THREE.Group>(null);
  const lidGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (boxGroupRef.current && !isOpen) {
      boxGroupRef.current.rotation.y = clock.getElapsedTime() * 0.22;
    }
    if (lidGroupRef.current) {
      if (isOpen) {
        lidGroupRef.current.position.y = THREE.MathUtils.lerp(lidGroupRef.current.position.y, 2.5, 0.08);
        lidGroupRef.current.position.z = THREE.MathUtils.lerp(lidGroupRef.current.position.z, -0.9, 0.08);
        lidGroupRef.current.rotation.x = THREE.MathUtils.lerp(lidGroupRef.current.rotation.x, -0.9, 0.08);
      } else {
        lidGroupRef.current.position.y = 0.6;
        lidGroupRef.current.position.z = 0;
        lidGroupRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.14}>
      <group
        ref={boxGroupRef}
        position={[0, -0.4, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        {/* Base Box Outer */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.0, 1.2]} />
          <meshStandardMaterial color="#9d174d" roughness={0.25} metalness={0.4} />
        </mesh>

        {/* Ribbons */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.22, 1.02, 1.22]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.22, 1.02, 0.22]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Velvet interior cushion */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.1, 0.22, 1.1]} />
          <meshStandardMaterial color="#4c0519" roughness={0.8} />
        </mesh>

        {/* Lid */}
        <group ref={lidGroupRef} position={[0, 0.6, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.28, 0.24, 1.28]} />
            <meshStandardMaterial color="#be185d" roughness={0.2} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.22, 0.26, 1.3]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[1.3, 0.26, 0.22]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Bow */}
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

        {/* Pedestal */}
        <mesh position={[0, -0.6, 0]} receiveShadow>
          <cylinderGeometry args={[1.3, 1.45, 0.16, 32]} />
          <meshStandardMaterial color="#1e1035" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

// 3D Teddy Bear Model
function TeddyBear3D({
  position,
  scale,
  isSolo,
}: {
  position: [number, number, number];
  scale: number;
  isSolo: boolean;
}) {
  const teddyRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!teddyRef.current) return;
    const t = clock.getElapsedTime();
    teddyRef.current.position.y = position[1] + Math.sin(t * 1.8) * 0.06;
    if (isSolo) {
      teddyRef.current.rotation.y = t * 0.8;
    } else {
      teddyRef.current.rotation.y = Math.sin(t * 1.2) * 0.2;
    }
  });

  return (
    <group ref={teddyRef} position={position} scale={[scale, scale, scale]}>
      {/* Body */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.38, 20, 20]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.35, 0.28]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.9} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.82, 0]}>
        <sphereGeometry args={[0.32, 20, 20]} />
        <meshStandardMaterial color="#b45309" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.76, 0.26]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.9} />
      </mesh>
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

// 3D Rose Bouquet Model
function RoseBouquet3D({
  position,
  scale,
  isSolo,
}: {
  position: [number, number, number];
  scale: number;
  isSolo: boolean;
}) {
  const roseRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!roseRef.current) return;
    const t = clock.getElapsedTime();
    roseRef.current.position.y = position[1] + Math.sin(t * 1.6 + 1) * 0.06;
    if (isSolo) {
      roseRef.current.rotation.y = t * 0.8;
    } else {
      roseRef.current.rotation.y = -Math.sin(t * 1.2) * 0.2;
    }
  });

  return (
    <group ref={roseRef} position={position} scale={[scale, scale, scale]}>
      {/* Central Rose Bloom */}
      <group position={[0, 0.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#dc2626" roughness={0.3} />
        </mesh>
        <mesh rotation={[0.4, 0.5, 0]}>
          <cylinderGeometry args={[0.28, 0.2, 0.24, 16, 1, true]} />
          <meshStandardMaterial color="#e11d48" roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-0.3, -0.6, 0.3]}>
          <cylinderGeometry args={[0.34, 0.24, 0.28, 16, 1, true]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Side Roses */}
      <group position={[-0.26, 0.68, 0.1]}>
        <mesh>
          <sphereGeometry args={[0.15, 14, 14]} />
          <meshStandardMaterial color="#fb7185" roughness={0.3} />
        </mesh>
      </group>
      <group position={[0.24, 0.68, 0.12]}>
        <mesh>
          <sphereGeometry args={[0.15, 14, 14]} />
          <meshStandardMaterial color="#fb7185" roughness={0.3} />
        </mesh>
      </group>

      {/* Emerald Stems */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.75, 12]} />
        <meshStandardMaterial color="#15803d" roughness={0.5} />
      </mesh>

      {/* Golden Wrap Ribbon */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.16, 0.1, 0.26, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 3D Diamond Heart Pendant Model
function DiamondHeart3D({
  position,
  scale,
  isSolo,
}: {
  position: [number, number, number];
  scale: number;
  isSolo: boolean;
}) {
  const giftRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const N = 48;
    const s = 0.028;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3) * s;
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * s;
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
    giftRef.current.position.y = position[1] + Math.sin(t * 2) * 0.06;
    if (isSolo) {
      giftRef.current.rotation.y = t * 0.9;
    } else {
      giftRef.current.rotation.y = t * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.8;
      ringRef.current.rotation.x = Math.PI / 4 + Math.sin(t) * 0.15;
    }
  });

  return (
    <group ref={giftRef} position={position} scale={[scale, scale, scale]}>
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
        />
      </mesh>

      {/* Sparkling Brilliant Diamond */}
      <mesh position={[0, 0.06, 0.03]}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#fef08a"
          emissiveIntensity={0.8}
          roughness={0.05}
          metalness={0.95}
          clearcoat={1}
        />
      </mesh>

      {/* Golden Bail & Halo */}
      <mesh position={[0, 0.42, 0]}>
        <torusGeometry args={[0.075, 0.02, 16, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh ref={ringRef} position={[0, 0.06, 0]}>
        <torusGeometry args={[0.66, 0.015, 16, 64]} />
        <meshStandardMaterial color="#fcd34d" metalness={0.95} roughness={0.1} />
      </mesh>
      <pointLight color="#ff2d75" intensity={2.8} distance={3.0} />
    </group>
  );
}

// 3D Belgian Chocolates Box
function Chocolates3D({
  position,
  scale,
  isSolo,
}: {
  position: [number, number, number];
  scale: number;
  isSolo: boolean;
}) {
  const chocoRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!chocoRef.current) return;
    const t = clock.getElapsedTime();
    chocoRef.current.position.y = position[1] + Math.sin(t * 1.9 + 2) * 0.06;
    if (isSolo) {
      chocoRef.current.rotation.y = t * 0.8;
    } else {
      chocoRef.current.rotation.y = Math.sin(t * 1.4) * 0.2;
    }
  });

  return (
    <group ref={chocoRef} position={position} scale={[scale, scale, scale]}>
      {/* Heart-Shaped Gold Box */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.22, 24]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Red Velvet Ribbon */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.04, 24]} />
        <meshStandardMaterial color="#ef4444" roughness={0.4} />
      </mesh>
      {/* 3 Chocolate Truffles */}
      <mesh position={[-0.18, 0.36, -0.1]}>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshStandardMaterial color="#3e2723" roughness={0.3} />
      </mesh>
      <mesh position={[0.18, 0.36, -0.1]}>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshStandardMaterial color="#5d4037" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.36, 0.16]}>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

const GiftScene: React.FC = () => {
  const nextScene = useExperienceStore((s) => s.nextScene);
  const giftOpened = useExperienceStore((s) => s.giftOpened);
  const setGiftOpened = useExperienceStore((s) => s.setGiftOpened);

  const [localOpened, setLocalOpened] = useState(giftOpened);
  const [selectedGiftId, setSelectedGiftId] = useState<GiftChoiceId | null>(null);
  const [sleighDelivered, setSleighDelivered] = useState(false);

  // Santa Flying Sleigh Arrival Animation on Scene Load
  useEffect(() => {
    soundManager.playTwinkle();
    const timer = setTimeout(() => {
      setSleighDelivered(true);
      soundManager.playPopperBurstSound();
      robotSpeaker.speak('Ho Ho Ho! Santa ki magical delivery Sameeksha baby ke liye aayi hai! 🎅✨');
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    if (!localOpened) {
      soundManager.playTwinkle();
      soundManager.playPopperBurstSound();
      setLocalOpened(true);
      setGiftOpened();
      soundManager.playTrack('theme-starlight');
      robotSpeaker.speak('Happy Birthday Sameeksha! Gift box khul gaya! Apna manpasand gift choose kijiye! 🎁💖');
    }
  };

  const handleSelectGift = (id: GiftChoiceId) => {
    soundManager.playTwinkle();
    setSelectedGiftId(id);
    const chosen = GIFTS.find((g) => g.id === id);
    if (chosen) {
      robotSpeaker.speak(`Aapne choose kiya hai: ${chosen.name}! Ye gift aapko jald hi milega Harshit ki taraf se! 💖`);
    }
  };

  const selectedGift = GIFTS.find((g) => g.id === selectedGiftId);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 🎅 Magical Flying Santa Sleigh across the Sky before delivery */}
      <AnimatePresence>
        {!sleighDelivered && (
          <motion.div
            initial={{ x: '110vw', y: '10vh', scale: 0.7, opacity: 0 }}
            animate={{
              x: ['110vw', '50vw', '48vw'],
              y: ['10vh', '35vh', '48vh'],
              scale: [0.7, 1.1, 1],
              opacity: [0, 1, 1],
            }}
            exit={{ x: '-120vw', y: '5vh', scale: 0.6, opacity: 0 }}
            transition={{ duration: 2.3, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              zIndex: 90,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              filter: 'drop-shadow(0 10px 25px rgba(251, 191, 36, 0.7))',
            }}
          >
            <span style={{ fontSize: '3.6rem', transform: 'scaleX(-1)' }}>🦌🦌🛷</span>
            <span style={{ fontSize: '2.8rem' }}>🎁</span>
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.9)',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: '1px solid #fbbf24',
              }}
            >
              🎅 Santa's Special Delivery for Sameeksha! ✨
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <div className="canvas-container" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Canvas camera={{ position: [0, 1.1, 4.4], fov: 45 }} shadows>
          <ambientLight intensity={0.65} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
          <pointLight position={[-4, 3, -2]} intensity={1.1} color="#ff6b9d" />
          <pointLight position={[3, -2, 2]} intensity={0.9} color="#fbbf24" />
          <Sparkles count={80} scale={5.5} size={2.4} speed={0.5} color="#fcd34d" />

          {/* Sealed present box shown before opening */}
          {!localOpened && <GiftBox isOpen={false} onOpen={handleOpen} />}

          {/* When opened and a specific gift is chosen: SOLO SPOTLIGHT in Center! */}
          {localOpened && selectedGiftId && (
            <>
              {selectedGiftId === 'teddy' && <TeddyBear3D position={[0, 0.4, 0]} scale={0.75} isSolo={true} />}
              {selectedGiftId === 'rose' && <RoseBouquet3D position={[0, 0.3, 0]} scale={0.8} isSolo={true} />}
              {selectedGiftId === 'diamond' && <DiamondHeart3D position={[0, 0.5, 0]} scale={1.25} isSolo={true} />}
              {selectedGiftId === 'chocolates' && <Chocolates3D position={[0, 0.4, 0]} scale={1.1} isSolo={true} />}
            </>
          )}

          {/* When opened and NO specific gift chosen yet: Show ALL 4 gifts cleanly arrayed! */}
          {localOpened && !selectedGiftId && (
            <>
              <TeddyBear3D position={[-1.3, 0.5, 0]} scale={0.48} isSolo={false} />
              <RoseBouquet3D position={[-0.45, 0.45, 0.2]} scale={0.52} isSolo={false} />
              <DiamondHeart3D position={[0.45, 0.55, 0.2]} scale={0.75} isSolo={false} />
              <Chocolates3D position={[1.3, 0.45, 0]} scale={0.7} isSolo={false} />
            </>
          )}

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
          {localOpened ? 'Choose Your Birthday Gift' : 'Special Delivery for Sameeksha Baby'}
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
          {selectedGiftId
            ? '✨ Spotlighting your selected gift in center 360°!'
            : localOpened
            ? '🎁 Tap any gift below to choose your favorite!'
            : '🎁 Tap the gift box or button below to open!'}
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
            <span>Open Your Surprise Gift 🎁 ✨</span>
          </motion.button>
        </div>
      )}

      {/* 4 Chooseable Gifts Bar (When opened and no gift selected yet) */}
      {localOpened && !selectedGiftId && (
        <div
          style={{
            position: 'fixed',
            bottom: '22px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '94vw',
          }}
        >
          {GIFTS.map((g) => (
            <motion.button
              key={g.id}
              onClick={() => handleSelectGift(g.id)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'rgba(28, 16, 52, 0.92)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(251, 191, 36, 0.5)',
                borderRadius: '18px',
                padding: '8px 14px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(0,0,0,0.6)',
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{g.emoji}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24' }}>{g.name}</div>
                <div style={{ fontSize: '0.68rem', color: '#fbcfe8' }}>Tap to select</div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Selected Gift Highlight Card with Harshit's Promise! */}
      <AnimatePresence>
        {localOpened && selectedGift && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 16 }}
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 60,
              maxWidth: '480px',
              width: 'calc(100vw - 32px)',
              background: 'linear-gradient(135deg, rgba(28, 16, 52, 0.96), rgba(14, 10, 32, 0.98))',
              border: '2px solid rgba(251, 191, 36, 0.65)',
              borderRadius: '24px',
              padding: '1.1rem 1.4rem',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(251, 191, 36, 0.3)',
              backdropFilter: 'blur(20px)',
              textAlign: 'center',
              color: '#fff',
            }}
          >
            {/* Tag */}
            <div
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, rgba(244,63,94,0.35), rgba(251,191,36,0.35))',
                border: '1px solid rgba(251, 191, 36, 0.7)',
                borderRadius: '16px',
                padding: '3px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '1px',
                color: '#fef08a',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
              }}
            >
              {selectedGift.emoji} {selectedGift.tag} • Selected Gift {selectedGift.emoji}
            </div>

            <h3
              style={{
                fontSize: '1.15rem',
                margin: '0 0 0.35rem 0',
                color: '#fff',
                background: 'linear-gradient(135deg, #ffffff, #fcd34d, #fda4af)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              {selectedGift.name}
            </h3>

            <p style={{ fontSize: '0.82rem', color: '#e2e8f0', margin: '0 0 0.6rem 0', lineHeight: 1.4 }}>
              {selectedGift.description}
            </p>

            {/* Harshit's Promised Gift Delivery Announcement! */}
            <div
              style={{
                background: 'rgba(251, 191, 36, 0.15)',
                border: '1px solid rgba(251, 191, 36, 0.5)',
                borderRadius: '14px',
                padding: '8px 12px',
                color: '#fef08a',
                fontSize: '0.88rem',
                fontWeight: 700,
                margin: '0 0 0.9rem 0',
                textShadow: '0 1px 8px rgba(0,0,0,0.6)',
              }}
            >
              ✨ "This special gift will be delivered to you very soon by Harshit! 💖" ✨
              <div style={{ fontSize: '0.74rem', opacity: 0.85, marginTop: '2px', fontWeight: 500 }}>
                (Ye gift aapko jald hi milega Harshit ki taraf se! 💖)
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setSelectedGiftId(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '14px',
                  padding: '7px 14px',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🔄 Choose Another Gift
              </button>

              <motion.button
                className="magic-button"
                onClick={nextScene}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Step into memories"
                style={{
                  padding: '0.7rem 1.3rem',
                  fontSize: '0.86rem',
                  boxShadow: '0 4px 15px rgba(244, 63, 94, 0.4)',
                }}
              >
                <span>Step Inside Your Memories 📸 ✨</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftScene;
