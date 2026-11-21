import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import { soundManager } from '../../utils/audio';
import { robotSpeaker } from '../../utils/speech';

// 3D Gift Box Component with interior velvet cushion and animated lid
function GiftBox({ isOpen, onOpen }: { isOpen: boolean; onOpen: () => void }) {
  const boxGroupRef = useRef<THREE.Group>(null);
  const lidGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (boxGroupRef.current && !isOpen) {
      boxGroupRef.current.rotation.y = clock.getElapsedTime() * 0.25;
    }
    if (lidGroupRef.current) {
      if (isOpen) {
        // Animate lid flying up and tilting backward gracefully
        lidGroupRef.current.position.y = THREE.MathUtils.lerp(lidGroupRef.current.position.y, 2.6, 0.07);
        lidGroupRef.current.position.z = THREE.MathUtils.lerp(lidGroupRef.current.position.z, -0.9, 0.07);
        lidGroupRef.current.rotation.x = THREE.MathUtils.lerp(lidGroupRef.current.rotation.x, -0.85, 0.07);
      } else {
        lidGroupRef.current.position.y = 0.75;
        lidGroupRef.current.position.z = 0;
        lidGroupRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.25}>
      <group
        ref={boxGroupRef}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        {/* Base Box Outer */}
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

        {/* Interior Velvet Display Cushion */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.36, 0.28, 1.36]} />
          <meshStandardMaterial color="#4c0519" roughness={0.8} />
        </mesh>

        {/* Lid Group (Flies off smoothly when opened!) */}
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

// 3D Physical Gift Inside Box: Radiant Diamond & Rose Gold Eternity Heart Pendant
function PhysicalGift({ isOpen }: { isOpen: boolean }) {
  const giftRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Exact parametric heart shape
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const N = 48;
    const scale = 0.032;
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
      depth: 0.16,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!giftRef.current) return;
    const t = clock.getElapsedTime();

    if (isOpen) {
      // Float up smoothly from inside the box (y: 0.2) to prominent hover height (y: 1.35)
      giftRef.current.position.y = THREE.MathUtils.lerp(giftRef.current.position.y, 1.35, 0.06);
      giftRef.current.rotation.y = t * 0.75;
      giftRef.current.position.y += Math.sin(t * 2) * 0.003;
    } else {
      giftRef.current.position.y = 0.2;
      giftRef.current.rotation.y = 0;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.8;
      ringRef.current.rotation.x = Math.PI / 4 + Math.sin(t) * 0.15;
    }
  });

  return (
    <group ref={giftRef} position={[0, 0.2, 0]}>
      {/* Rose Gold / Ruby Crystal Heart Pendant */}
      <mesh position={[0, 0.05, -0.08]}>
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
      <mesh position={[0, 0.08, 0.04]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#fef08a"
          emissiveIntensity={0.8}
          roughness={0.05}
          metalness={0.95}
          clearcoat={1}
        />
      </mesh>

      {/* Golden Bail (Loop for chain) */}
      <mesh position={[0, 0.44, 0]}>
        <torusGeometry args={[0.08, 0.022, 16, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Golden Orbital Halo Ring */}
      <mesh ref={ringRef} position={[0, 0.08, 0]}>
        <torusGeometry args={[0.72, 0.016, 16, 64]} />
        <meshStandardMaterial color="#fcd34d" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Point lights shining from the heart gem */}
      <pointLight color="#ff2d75" intensity={isOpen ? 3.5 : 0} distance={3.8} />
      <pointLight color="#fbbf24" intensity={isOpen ? 2.5 : 0} distance={2.8} position={[0, 0.2, 0.3]} />

      {isOpen && (
        <Sparkles
          count={45}
          scale={2.0}
          size={3.2}
          speed={1.2}
          color="#fda4af"
        />
      )}
    </group>
  );
}

// Particles bursting from the open gift
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
      soundManager.playPopperBurstSound();
      setLocalOpened(true);
      setGiftOpened();
      robotSpeaker.speak('Happy Birthday Sameeksha! Ye khas birthday gift aapke liye hai!');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D Canvas: Center is 100% UNBLOCKED so the user can drag, orbit, and admire the gift in 360°! */}
      <div className="canvas-container" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Canvas camera={{ position: [0, 1.2, 4.2], fov: 48 }} shadows>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.6} castShadow />
          <pointLight position={[-4, 3, -2]} intensity={1.2} color="#ff6b9d" />
          <pointLight position={[3, -2, 2]} intensity={0.9} color="#fbbf24" />

          <Sparkles count={85} scale={6} size={2.5} speed={0.5} color="#fcd34d" />
          <GiftBox isOpen={localOpened} onOpen={handleOpen} />
          <PhysicalGift isOpen={localOpened} />
          {localOpened && <GiftBurst />}

          <OrbitControls
            enableRotate
            enableZoom
            enablePan={false}
            maxPolarAngle={Math.PI / 2 + 0.1}
            minPolarAngle={Math.PI / 6}
            minDistance={2.8}
            maxDistance={6.5}
          />
        </Canvas>
      </div>

      {/* Top Header Bar (Docked to top, non-blocking) */}
      <div
        style={{
          position: 'fixed',
          top: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'none',
          textAlign: 'center',
          maxWidth: '90vw',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            margin: 0,
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
            color: '#fff',
            textShadow: '0 2px 20px rgba(251, 191, 36, 0.6), 0 0 10px rgba(244, 63, 94, 0.4)',
            letterSpacing: '1px',
          }}
        >
          {content.gift.heading}
        </motion.h2>

        <div
          style={{
            background: 'rgba(15, 12, 34, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(251, 191, 36, 0.35)',
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '0.75rem',
            color: '#fbbf24',
            userSelect: 'none',
          }}
        >
          {localOpened ? '👆 Drag in center to rotate 3D jewelry 360°' : '🎁 Tap the gift box or button below to open!'}
        </div>
      </div>

      {/* Bottom Center Trigger (Before opened): Leaves center open! */}
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

      {/* Side Docked Card (After opened): Cleanly docked on the right/bottom-right so the center 3D model is 100% visible! */}
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
              maxWidth: '380px',
              width: 'calc(100vw - 40px)',
              background: 'linear-gradient(135deg, rgba(28, 16, 52, 0.92), rgba(14, 10, 32, 0.95))',
              border: '1px solid rgba(251, 191, 36, 0.45)',
              borderRadius: '20px',
              padding: '1.1rem 1.3rem',
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
              💝 Birthday Surprise 💝
            </div>

            <h3
              style={{
                fontSize: '1.08rem',
                color: '#fff',
                margin: '0 0 0.4rem 0',
                background: 'linear-gradient(135deg, #ffffff, #fcd34d, #fda4af)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              ✨ Diamond & Rose-Gold Eternity Heart ✨
            </h3>

            <p
              style={{
                fontSize: '0.84rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.5,
                margin: '0 0 0.9rem 0',
                fontStyle: 'italic',
              }}
            >
              "Ye sirf ek gift nahi hai Sameeksha Ji, ye mera dil hai jo hamesha aapke paas rahega. Meri har khushi aapki muskaan se shuru hoti hai. Happy Birthday Meri Jaan! 💖"
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
                padding: '0.75rem 1.4rem',
                fontSize: '0.92rem',
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
