import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import { soundManager } from '../../utils/audio';

// 3D Gift Box Component with interior velvet cushion
function GiftBox({ isOpen, onOpen }: { isOpen: boolean; onOpen: () => void }) {
  const boxGroupRef = useRef<THREE.Group>(null);
  const lidGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (boxGroupRef.current && !isOpen) {
      boxGroupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
    if (lidGroupRef.current) {
      if (isOpen) {
        // Animate lid flying up and tilting backward
        lidGroupRef.current.position.y = THREE.MathUtils.lerp(lidGroupRef.current.position.y, 2.3, 0.08);
        lidGroupRef.current.position.z = THREE.MathUtils.lerp(lidGroupRef.current.position.z, -0.6, 0.08);
        lidGroupRef.current.rotation.x = THREE.MathUtils.lerp(lidGroupRef.current.rotation.x, -0.7, 0.08);
      } else {
        lidGroupRef.current.position.y = 0.75;
        lidGroupRef.current.position.z = 0;
        lidGroupRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.35}>
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

// 3D Physical Gift Inside Box: Radiant Diamond & Rose Gold Heart Pendant
function PhysicalGift({ isOpen }: { isOpen: boolean }) {
  const giftRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Exact parametric heart shape
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const N = 48;
    const scale = 0.03;
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
      bevelSize: 0.04,
      bevelThickness: 0.04,
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!giftRef.current) return;
    const t = clock.getElapsedTime();

    if (isOpen) {
      // Float up smoothly from inside the box (y: 0.2) to hover height (y: 1.4)
      giftRef.current.position.y = THREE.MathUtils.lerp(giftRef.current.position.y, 1.4, 0.06);
      giftRef.current.rotation.y = t * 0.75;
      giftRef.current.position.y += Math.sin(t * 2) * 0.002;
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
      <mesh position={[0, 0.08, 0.04]}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#fef08a"
          emissiveIntensity={0.7}
          roughness={0.05}
          metalness={0.95}
          clearcoat={1}
        />
      </mesh>

      {/* Golden Bail (Loop for chain) */}
      <mesh position={[0, 0.42, 0]}>
        <torusGeometry args={[0.08, 0.022, 16, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Golden Orbital Halo Ring */}
      <mesh ref={ringRef} position={[0, 0.08, 0]}>
        <torusGeometry args={[0.68, 0.016, 16, 64]} />
        <meshStandardMaterial color="#fcd34d" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Point light shining from the heart gem */}
      <pointLight color="#ff2d75" intensity={isOpen ? 3 : 0} distance={3.5} />
      <pointLight color="#fbbf24" intensity={isOpen ? 2 : 0} distance={2.5} position={[0, 0.2, 0.3]} />

      {isOpen && (
        <Sparkles
          count={35}
          scale={1.8}
          size={3.2}
          speed={1.2}
          color="#fda4af"
        />
      )}
    </group>
  );
}

// Particles exploding from the open gift
function GiftBurst() {
  const count = 35;
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
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 8, 5]} intensity={1.6} castShadow />
          <pointLight position={[-4, 3, -2]} intensity={1.2} color="#ff6b9d" />
          <pointLight position={[3, -2, 2]} intensity={0.9} color="#fbbf24" />

          <Sparkles count={80} scale={6} size={2.5} speed={0.5} color="#fcd34d" />
          <GiftBox isOpen={localOpened} onOpen={handleOpen} />
          <PhysicalGift isOpen={localOpened} />
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
          {!localOpened ? (
            <>
              <h2 className="scene-heading">{content.gift.heading}</h2>
              <p className="scene-subtext">{content.gift.subtext}</p>

              <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.button
                  className="magic-button"
                  onClick={handleOpen}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Open your birthday gift"
                >
                  <span>{content.gift.button}</span>
                </motion.button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 14 }}
              style={{
                background: 'rgba(15, 10, 30, 0.88)',
                border: '1px solid rgba(251, 191, 36, 0.45)',
                borderRadius: '20px',
                padding: '1.25rem 1.6rem',
                maxWidth: '520px',
                margin: '0 auto',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(244, 63, 94, 0.25)',
                backdropFilter: 'blur(16px)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, rgba(244,63,94,0.25), rgba(251,191,36,0.25))',
                  border: '1px solid rgba(251, 191, 36, 0.6)',
                  borderRadius: '20px',
                  padding: '4px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  color: '#fef08a',
                  marginBottom: '0.6rem',
                  textTransform: 'uppercase',
                }}
              >
                💝 Birthday Surprise 💝
              </div>

              <h3
                style={{
                  fontSize: '1.35rem',
                  color: '#fff',
                  margin: '0 0 0.5rem 0',
                  background: 'linear-gradient(135deg, #ffffff, #fcd34d, #fda4af)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                }}
              >
                ✨ The Diamond & Rose-Gold Eternity Heart ✨
              </h3>

              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 1.5,
                  margin: '0 0 1.2rem 0',
                  fontStyle: 'italic',
                }}
              >
                "Ye sirf ek gift nahi hai Sameeksha baby, ye mera dil hai jo hamesha tumhare paas rahega. Meri har khushi tumhari muskaan se shuru hoti hai. Happy Birthday Meri Jaan! 💖"
              </p>

              <button
                className="magic-button"
                onClick={nextScene}
                aria-label="Step into memories"
              >
                <span>Step Inside Your Memories 📸 ✨</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GiftScene;
