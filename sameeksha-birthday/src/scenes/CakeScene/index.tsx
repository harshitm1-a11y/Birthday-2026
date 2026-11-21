import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore, CAKE_THEMES, type CakeThemeId } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import Celebration from '../../components/Celebration';
import { soundManager } from '../../utils/audio';
import { robotSpeaker } from '../../utils/speech';

// Realistic 3D Smoke Wisps drifting after blowing out
function CandleSmoke({ position }: { position: [number, number, number] }) {
  const smokeRef = useRef<THREE.Group>(null);
  const count = 12;

  useFrame(({ clock }) => {
    if (!smokeRef.current) return;
    const t = clock.getElapsedTime();
    smokeRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      mesh.position.y += 0.006 + (i % 3) * 0.002;
      mesh.position.x += Math.sin(t * 2 + i) * 0.002;
      mesh.scale.multiplyScalar(1.008);
      if (mesh.material instanceof THREE.Material) {
        mesh.material.opacity = Math.max(0, 0.6 - mesh.position.y * 0.4);
      }
      if (mesh.position.y > 1.4) {
        mesh.position.y = 0;
        mesh.scale.set(0.04, 0.04, 0.04);
      }
    });
  });

  return (
    <group ref={smokeRef} position={[position[0], position[1] + 0.6, position[2]]}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 0.04, Math.random() * 0.4, (Math.random() - 0.5) * 0.04]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#e5e7eb" transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

// Hyper-Realistic 3D Candle with Teardrop Flame & Melting Wax Drips
function RealisticCandle({
  position,
  blown,
}: {
  position: [number, number, number];
  blown: boolean;
}) {
  const flameOuterRef = useRef<THREE.Mesh>(null);
  const flameInnerRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Teardrop flame geometry
  const flameGeometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(0.065, 0.22, 16);
    geom.translate(0, 0.11, 0);
    return geom;
  }, []);

  useFrame(({ clock }) => {
    if (!blown) {
      const t = clock.getElapsedTime() * 18;
      const flicker = 1 + Math.sin(t) * 0.14 + Math.cos(t * 1.7) * 0.09;
      const swayX = Math.sin(t * 0.8) * 0.08;
      const swayZ = Math.cos(t * 0.6) * 0.06;

      if (flameOuterRef.current) {
        flameOuterRef.current.scale.set(flicker, flicker * 1.2, flicker);
        flameOuterRef.current.rotation.x = swayX;
        flameOuterRef.current.rotation.z = swayZ;
      }
      if (flameInnerRef.current) {
        flameInnerRef.current.scale.set(flicker * 0.75, flicker * 1.05, flicker * 0.75);
      }
      if (lightRef.current) {
        lightRef.current.intensity = 1.6 + Math.sin(t * 1.5) * 0.4;
      }
    } else {
      if (flameOuterRef.current) flameOuterRef.current.scale.set(0, 0, 0);
      if (flameInnerRef.current) flameInnerRef.current.scale.set(0, 0, 0);
      if (lightRef.current) lightRef.current.intensity = 0;
    }
  });

  return (
    <group position={position}>
      {/* Translucent Wax Candle Body */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.56, 24]} />
        <meshStandardMaterial
          color="#fffbeb"
          roughness={0.2}
          metalness={0.05}
        />
      </mesh>

      {/* Wax Drips on Side */}
      <mesh position={[0.038, 0.35, 0.02]} scale={[0.02, 0.08, 0.02]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.3} />
      </mesh>
      <mesh position={[-0.035, 0.22, -0.02]} scale={[0.022, 0.09, 0.022]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.3} />
      </mesh>

      {/* Carbonized Twisted Cotton Wick */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.007, 0.009, 0.08, 8]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>

      {/* Realistic Multi-Layer Teardrop Flame */}
      {!blown ? (
        <group position={[0, 0.62, 0]}>
          {/* Outer Warm Amber Flame */}
          <mesh ref={flameOuterRef} geometry={flameGeometry}>
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f97316"
              emissiveIntensity={3.5}
              transparent
              opacity={0.92}
            />
          </mesh>

          {/* Inner Hot Blue/White Core */}
          <mesh ref={flameInnerRef} geometry={flameGeometry} position={[0, -0.02, 0]}>
            <meshStandardMaterial
              color="#ffffff"
              emissive="#60a5fa"
              emissiveIntensity={4.8}
            />
          </mesh>

          <pointLight ref={lightRef} color="#f97316" intensity={1.8} distance={2.8} />
        </group>
      ) : (
        <CandleSmoke position={[0, 0.58, 0]} />
      )}
    </group>
  );
}

// 3D Stainless Steel & Gold Birthday Chef's Knife
function CakeKnife3D({
  isCutting,
  isCut,
  onCutClick,
}: {
  isCutting: boolean;
  isCut: boolean;
  onCutClick: () => void;
}) {
  const knifeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!knifeRef.current) return;
    const t = clock.getElapsedTime();

    if (isCutting) {
      // Slicing animation: lifts up, angles over cake, and drives down smoothly!
      knifeRef.current.position.x = THREE.MathUtils.lerp(knifeRef.current.position.x, 0.5, 0.1);
      knifeRef.current.position.y = THREE.MathUtils.lerp(knifeRef.current.position.y, 0.25, 0.12);
      knifeRef.current.position.z = THREE.MathUtils.lerp(knifeRef.current.position.z, 0.5, 0.1);
      knifeRef.current.rotation.x = -Math.PI / 4;
      knifeRef.current.rotation.z = Math.PI / 6;
    } else if (isCut) {
      // Resting gracefully on the side of the cake plate
      knifeRef.current.position.x = 2.1;
      knifeRef.current.position.y = -0.3;
      knifeRef.current.position.z = 0.8;
      knifeRef.current.rotation.x = 0;
      knifeRef.current.rotation.y = 0.4;
      knifeRef.current.rotation.z = Math.PI / 2;
    } else {
      // Hovering invitingly beside the cake with gentle bobbing
      knifeRef.current.position.x = 1.85 + Math.sin(t * 1.5) * 0.05;
      knifeRef.current.position.y = 0.8 + Math.cos(t * 1.5) * 0.08;
      knifeRef.current.position.z = 0.6;
      knifeRef.current.rotation.x = -Math.PI / 6;
      knifeRef.current.rotation.y = Math.PI / 8;
      knifeRef.current.rotation.z = Math.sin(t * 1.2) * 0.08;
    }
  });

  return (
    <group
      ref={knifeRef}
      onClick={(e) => {
        e.stopPropagation();
        onCutClick();
      }}
    >
      {/* Knife Blade: Sharp stainless steel with chrome finish */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.035, 1.1, 0.18]} />
        <meshStandardMaterial
          color="#f3f4f6"
          metalness={0.95}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Knife Bolster / Guard (Gold Accent) */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Knife Handle (Rosewood / Premium Velvet Finish) */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.055, 0.048, 0.7, 16]} />
        <meshStandardMaterial color="#3b0764" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Handle End Cap (Gold) */}
      <mesh position={[0, -0.72, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
      </mesh>
    </group>
  );
}

// 3D Gourmet Custom Birthday Cake with Dynamic Slicing Piece
function GourmetCake({
  blown,
  isCut,
  themeId,
}: {
  blown: boolean;
  isCut: boolean;
  themeId: CakeThemeId;
}) {
  const cakeGroup = useRef<THREE.Group>(null);
  const sliceGroup = useRef<THREE.Group>(null);
  const theme = CAKE_THEMES[themeId] || CAKE_THEMES.strawberry;

  // Calculate 5 candle positions
  const candlePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const count = 5;
    const r = 0.65;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions.push([Math.cos(angle) * r, 0.95, Math.sin(angle) * r]);
    }
    return positions;
  }, []);

  // Personalized Gold Plaque
  const plaqueTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#2a0845';
      ctx.fillRect(0, 0, 512, 140);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 128);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 36px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ SAMEEKSHA BABY ✨', 256, 50);

      ctx.fillStyle = '#fbcfe8';
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText('Happy Birthday • 23 Nov 2026', 256, 95);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Smooth slide out of the cut slice!
  useFrame(() => {
    if (sliceGroup.current) {
      const targetOffset = isCut ? 0.42 : 0;
      sliceGroup.current.position.x = THREE.MathUtils.lerp(sliceGroup.current.position.x, targetOffset, 0.08);
      sliceGroup.current.position.z = THREE.MathUtils.lerp(sliceGroup.current.position.z, targetOffset, 0.08);
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.06} floatIntensity={0.12}>
      <group ref={cakeGroup} position={[0, -0.6, 0]}>
        {/* Ornate Cake Stand */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[2.35, 2.35, 0.1, 36]} />
          <meshStandardMaterial color={theme.plateColor} metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.55, 1.25, 0.4, 36]} />
          <meshStandardMaterial color={theme.plateColor} metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Tier 1 (Bottom Tier) */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[1.9, 1.9, 0.9, 36]} />
          <meshStandardMaterial color={theme.spongeColor} roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Tier 1 Frosting Crown & Drips */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[1.96, 1.96, 0.12, 36]} />
          <meshStandardMaterial color={theme.frostingColor} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[1.92, 1.92, 0.08, 36]} />
          <meshStandardMaterial color={theme.accentColor} roughness={0.3} />
        </mesh>

        {/* Tier 2 (Top Tier) */}
        <mesh position={[0, 1.15, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.7, 36]} />
          <meshStandardMaterial color={theme.spongeColor} roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Tier 2 Frosting Crown */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[1.26, 1.26, 0.1, 36]} />
          <meshStandardMaterial color={theme.frostingColor} roughness={0.35} />
        </mesh>

        {/* Cut Slice Wedge (Slides forward when cut!) */}
        <group ref={sliceGroup} position={[0, 0, 0]}>
          {isCut && (
            <>
              {/* Sliced Piece Cake Stand / Gold Plate */}
              <mesh position={[0.7, -0.1, 0.7]}>
                <cylinderGeometry args={[0.65, 0.65, 0.04, 24]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Sliced Wedge Mesh */}
              <mesh position={[0.7, 0.75, 0.7]} rotation={[0, Math.PI / 4, 0]}>
                <cylinderGeometry args={[0.45, 0.45, 0.7, 16, 1, false, 0, Math.PI / 3]} />
                <meshStandardMaterial color={theme.spongeColor} roughness={0.35} />
              </mesh>
              {/* Slice Frosting */}
              <mesh position={[0.7, 1.12, 0.7]} rotation={[0, Math.PI / 4, 0]}>
                <cylinderGeometry args={[0.48, 0.48, 0.08, 16, 1, false, 0, Math.PI / 3]} />
                <meshStandardMaterial color={theme.frostingColor} roughness={0.3} />
              </mesh>
            </>
          )}
        </group>

        {/* Golden Plaque in front */}
        <mesh position={[0, 0.4, 1.94]}>
          <boxGeometry args={[1.9, 0.5, 0.06]} />
          <meshStandardMaterial map={plaqueTexture} roughness={0.3} metalness={0.4} />
        </mesh>

        {/* 5 Realistic Candles */}
        {candlePositions.map((pos, idx) => (
          <RealisticCandle key={idx} position={pos} blown={blown} />
        ))}
      </group>
    </Float>
  );
}

const CakeScene: React.FC = () => {
  const nextScene = useExperienceStore((s) => s.nextScene);
  const candlesBlown = useExperienceStore((s) => s.candlesBlown);
  const setCandlesBlown = useExperienceStore((s) => s.setCandlesBlown);
  const selectedTheme = useExperienceStore((s) => s.selectedCakeTheme);
  const setCakeTheme = useExperienceStore((s) => s.setCakeTheme);

  const [blown, setBlown] = useState(candlesBlown);
  const [isCut, setIsCut] = useState(false);
  const [isCutting, setIsCutting] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  const handleBlow = () => {
    if (!blown) {
      setBlown(true);
      setCandlesBlown();
      soundManager.playPopperBurstSound();
      robotSpeaker.speak('Happy Birthday Sameeksha! Ab cake cut karne ki baari hai! 🎂🔪');
    }
  };

  const handleCutCake = () => {
    if (isCutting || isCut) return;
    setIsCutting(true);
    soundManager.playCakeSliceSound();

    setTimeout(() => {
      setIsCutting(false);
      setIsCut(true);
      soundManager.playPopperBurstSound();
      robotSpeaker.speak('Wah! Sameeksha baby ka birthday cake cut ho gaya! Happy Birthday Meri Jaan! 🎉🍰');
    }, 1200);
  };

  const currentCakeTheme = CAKE_THEMES[selectedTheme] || CAKE_THEMES.strawberry;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D Interactive Canvas: User has UNHINDERED 360° Drag & Zoom Rotation! */}
      <div className="canvas-container" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Canvas camera={{ position: [0, 1.4, 5.0], fov: 46 }}>
          <ambientLight intensity={0.75} />
          <directionalLight position={[5, 8, 5]} intensity={1.6} />
          <pointLight position={[-4, 2, 2]} intensity={0.9} color="#ff6b9d" />
          <pointLight position={[3, -2, -2]} intensity={0.8} color="#fbbf24" />
          <Sparkles count={75} scale={6} size={2.8} speed={0.4} color="#fbbf24" />

          {/* User can freely drag & rotate the cake in 3D 360 degrees without any DOM interception! */}
          <OrbitControls
            enableRotate
            enablePan={false}
            enableZoom
            minDistance={3.2}
            maxDistance={7.5}
            autoRotate={!blown && !isCut}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />

          <Suspense fallback={null}>
            <GourmetCake blown={blown} isCut={isCut} themeId={selectedTheme} />
            <CakeKnife3D isCutting={isCutting} isCut={isCut} onCutClick={handleCutCake} />
          </Suspense>
        </Canvas>
      </div>

      {/* Fullscreen Celebration Canvas */}
      <Celebration active={blown || isCut} />

      {/* Top Header Bar (Non-blocking, docked to top) */}
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
          {content.cake.heading}
        </motion.h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            👆 Drag anywhere to spin cake 360° • Zoom in/out
          </div>

          {/* 🎂 Cake Shop Button */}
          <motion.button
            type="button"
            onClick={() => setIsShopOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
              border: 'none',
              borderRadius: '20px',
              padding: '5px 14px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              pointerEvents: 'auto',
            }}
          >
            <span>{currentCakeTheme.emoji}</span>
            <span>Cake Shop</span>
          </motion.button>
        </div>
      </div>

      {/* Floating Action Controls Docked at Bottom: Completely leaves center open for 360° cake inspection! */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 45,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          {!blown ? (
            <motion.button
              className="magic-button"
              onClick={handleBlow}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Blow the birthday candles"
              style={{
                boxShadow: '0 8px 30px rgba(245, 158, 11, 0.5)',
                fontSize: '1.05rem',
                padding: '0.9rem 2.2rem',
              }}
            >
              <span>Blow the Candles 🎂 💨</span>
            </motion.button>
          ) : !isCut ? (
            <motion.button
              className="magic-button"
              onClick={handleCutCake}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Cut the birthday cake with knife"
              style={{
                background: 'linear-gradient(135deg, #10b981, #6366f1)',
                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.5)',
                fontSize: '1.05rem',
                padding: '0.9rem 2.2rem',
              }}
            >
              <span>Cut the Cake 🔪 🎂</span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 14 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <div
                style={{
                  background: 'rgba(15, 12, 34, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(251, 191, 36, 0.5)',
                  borderRadius: '20px',
                  padding: '6px 18px',
                  color: '#fbbf24',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                }}
              >
                🎉 Cake is Cut! Happy Birthday Sameeksha Baby! 🍰 ✨
              </div>
              <motion.button
                className="magic-button"
                onClick={nextScene}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Read your birthday letter"
              >
                <span>Read Your Birthday Letter 💌 ✨</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* 🎂 Cake Shop Modal */}
      <AnimatePresence>
        {isShopOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              padding: '16px',
            }}
            onClick={() => setIsShopOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: '460px',
                background: 'linear-gradient(135deg, rgba(28, 16, 52, 0.96), rgba(14, 10, 32, 0.98))',
                borderRadius: '24px',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
                overflow: 'hidden',
                color: '#fff',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.6rem' }}>🎂</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fbbf24' }}>
                      Birthday Cake Shop
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                      Choose your favorite cake style for Sameeksha Baby!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShopOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Cakes List */}
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.values(CAKE_THEMES).map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <motion.div
                      key={theme.id}
                      onClick={() => {
                        soundManager.playTwinkle();
                        setCakeTheme(theme.id as CakeThemeId);
                        setIsShopOpen(false);
                      }}
                      whileHover={{ scale: 1.02, background: 'rgba(255, 255, 255, 0.08)' }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(251, 191, 36, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected
                          ? '1px solid rgba(251, 191, 36, 0.6)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '2rem' }}>{theme.emoji}</span>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: isSelected ? '#fbbf24' : '#fff' }}>
                            {theme.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                            {theme.description}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <span style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>
                          Selected ✔
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CakeScene;
