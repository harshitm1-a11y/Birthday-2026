import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore, CAKE_THEMES, type CakeThemeId, COMPANIONS } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import Celebration from '../../components/Celebration';
import { soundManager } from '../../utils/audio';
import { robotSpeaker } from '../../utils/speech';

// Realistic 3D Smoke Wisps drifting gently after blowing out
function CandleSmoke({ position }: { position: [number, number, number] }) {
  const smokeRef = useRef<THREE.Group>(null);
  const count = 10;

  useFrame(({ clock }) => {
    if (!smokeRef.current) return;
    const t = clock.getElapsedTime();
    smokeRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      mesh.position.y += 0.007 + (i % 3) * 0.002;
      mesh.position.x += Math.sin(t * 1.5 + i) * 0.002;
      mesh.scale.multiplyScalar(1.006);
      if (mesh.material instanceof THREE.Material) {
        mesh.material.opacity = Math.max(0, 0.45 - mesh.position.y * 0.35);
      }
      if (mesh.position.y > 1.2) {
        mesh.position.y = 0;
        mesh.scale.set(0.04, 0.04, 0.04);
      }
    });
  });

  return (
    <group ref={smokeRef} position={[position[0], position[1] + 0.6, position[2]]}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 0.04, Math.random() * 0.35, (Math.random() - 0.5) * 0.04]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#e2e8f0" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// REALISTIC Authentic Wax Candle with Natural Flame (No cartoon erratic animation)
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

  // Elegant natural teardrop flame profile
  const flameGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const count = 20;
    for (let i = 0; i <= count; i++) {
      const u = i / count;
      // Authentic flame curve
      const r = Math.sin(u * Math.PI) * 0.058 * (1 - u * 0.22);
      const y = u * 0.22;
      points.push(new THREE.Vector2(r, y));
    }
    return new THREE.LatheGeometry(points, 20);
  }, []);

  useFrame(({ clock }) => {
    if (!blown) {
      const t = clock.getElapsedTime();
      // Calm, realistic, gentle flame breathing (NOT exaggerated cartoon wobbling)
      const calmFlicker = 1.0 + Math.sin(t * 3.5) * 0.03 + Math.cos(t * 5.0) * 0.02;
      const microSway = Math.sin(t * 1.8) * 0.025;

      if (flameOuterRef.current) {
        flameOuterRef.current.scale.set(calmFlicker, calmFlicker * 1.05, calmFlicker);
        flameOuterRef.current.rotation.z = microSway;
      }
      if (flameInnerRef.current) {
        flameInnerRef.current.scale.set(calmFlicker * 0.65, calmFlicker * 0.85, calmFlicker * 0.65);
      }
      if (lightRef.current) {
        lightRef.current.intensity = 1.5 + Math.sin(t * 4.0) * 0.15;
      }
    } else {
      if (flameOuterRef.current) flameOuterRef.current.scale.set(0, 0, 0);
      if (flameInnerRef.current) flameInnerRef.current.scale.set(0, 0, 0);
      if (lightRef.current) lightRef.current.intensity = 0;
    }
  });

  return (
    <group position={position}>
      {/* Real Translucent Wax Candle Cylinder */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.046, 0.049, 0.52, 24]} />
        <meshStandardMaterial
          color="#fffbeb"
          roughness={0.22}
          metalness={0.03}
        />
      </mesh>

      {/* Melted Top Wax Pool Rim */}
      <mesh position={[0, 0.52, 0]}>
        <torusGeometry args={[0.044, 0.01, 12, 24]} />
        <meshStandardMaterial color="#fef08a" roughness={0.3} />
      </mesh>

      {/* Subtle Natural Wax Drips */}
      <mesh position={[0.04, 0.38, 0.02]} scale={[0.016, 0.07, 0.016]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial color="#fef9c3" roughness={0.25} />
      </mesh>

      {/* Carbonized Cotton Wick with Glowing Ember Tip */}
      <mesh position={[0, 0.54, 0]}>
        <cylinderGeometry args={[0.007, 0.008, 0.07, 8]} />
        <meshStandardMaterial color="#1c1917" roughness={0.9} />
      </mesh>
      {!blown && (
        <mesh position={[0, 0.575, 0]}>
          <sphereGeometry args={[0.009, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      )}

      {/* Real Multi-Layer Teardrop Candle Flame */}
      {!blown ? (
        <group position={[0, 0.575, 0]}>
          {/* Outer Warm Golden Amber Flame */}
          <mesh ref={flameOuterRef} geometry={flameGeometry}>
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f97316"
              emissiveIntensity={2.8}
              transparent
              opacity={0.92}
            />
          </mesh>

          {/* Inner Deep Blue Base / Bright Core */}
          <mesh ref={flameInnerRef} geometry={flameGeometry} position={[0, -0.01, 0]}>
            <meshStandardMaterial
              color="#ffffff"
              emissive="#38bdf8"
              emissiveIntensity={4.2}
            />
          </mesh>

          {/* Warm Luminescent Candlelight */}
          <pointLight ref={lightRef} color="#fbbf24" intensity={1.5} distance={2.5} />
        </group>
      ) : (
        <CandleSmoke position={[0, 0.54, 0]} />
      )}
    </group>
  );
}

// 3D Gourmet Custom Birthday Cake with Slide-Out Cut Slice & Click Interaction
function GourmetCake({
  blown,
  isCut,
  themeId,
  onCakeClick,
}: {
  blown: boolean;
  isCut: boolean;
  themeId: CakeThemeId;
  onCakeClick: () => void;
}) {
  const cakeGroup = useRef<THREE.Group>(null);
  const sliceGroup = useRef<THREE.Group>(null);
  const theme = CAKE_THEMES[themeId] || CAKE_THEMES.strawberry;

  // 5 candle positions
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
      const targetOffset = isCut ? 0.44 : 0;
      sliceGroup.current.position.x = THREE.MathUtils.lerp(sliceGroup.current.position.x, targetOffset, 0.08);
      sliceGroup.current.position.z = THREE.MathUtils.lerp(sliceGroup.current.position.z, targetOffset, 0.08);
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.04} floatIntensity={0.08}>
      <group
        ref={cakeGroup}
        position={[0, -0.6, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onCakeClick();
        }}
      >
        {/* Cake Stand */}
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
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[1.26, 1.26, 0.1, 36]} />
          <meshStandardMaterial color={theme.frostingColor} roughness={0.35} />
        </mesh>

        {/* Cut Slice Wedge (Slides out when companion cuts cake!) */}
        <group ref={sliceGroup} position={[0, 0, 0]}>
          {isCut && (
            <>
              <mesh position={[0.7, -0.1, 0.7]}>
                <cylinderGeometry args={[0.65, 0.65, 0.04, 24]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh position={[0.7, 0.75, 0.7]} rotation={[0, Math.PI / 4, 0]}>
                <cylinderGeometry args={[0.45, 0.45, 0.7, 16, 1, false, 0, Math.PI / 3]} />
                <meshStandardMaterial color={theme.spongeColor} roughness={0.35} />
              </mesh>
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
  const selectedCompanionId = useExperienceStore((s) => s.selectedCompanion);
  const triggerCompanionCakeCut = useExperienceStore((s) => s.triggerCompanionCakeCut);
  const isCompanionCuttingCake = useExperienceStore((s) => s.isCompanionCuttingCake);
  const cakeCutDone = useExperienceStore((s) => s.cakeCutDone);

  const [blown, setBlown] = useState(candlesBlown);
  const [isShopOpen, setIsShopOpen] = useState(false);

  const companion = COMPANIONS[selectedCompanionId] || COMPANIONS.teddy;

  // Blow candles
  const handleBlow = () => {
    if (!blown) {
      setBlown(true);
      setCandlesBlown();
      soundManager.playPopperBurstSound();
      robotSpeaker.speak(`Happy Birthday Sameeksha! Ab ${companion.name} knife se cake cut karega! Cake par click kijiye! 🎂🔪`);
    }
  };

  // User clicks cake: Companion holding the knife cuts the cake!
  const handleCakeClick = () => {
    if (!blown) {
      handleBlow();
      return;
    }
    if (cakeCutDone || isCompanionCuttingCake) return;

    // Trigger companion cake cutting!
    triggerCompanionCakeCut();
    robotSpeaker.speak(`${companion.name} is coming to slice the cake with you! 🔪🎂`);
  };

  const currentCakeTheme = CAKE_THEMES[selectedTheme] || CAKE_THEMES.strawberry;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D Interactive Canvas: User has 360° rotation */}
      <div className="canvas-container" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Canvas camera={{ position: [0, 1.4, 5.0], fov: 46 }}>
          <ambientLight intensity={0.75} />
          <directionalLight position={[5, 8, 5]} intensity={1.6} />
          <pointLight position={[-4, 2, 2]} intensity={0.9} color="#ff6b9d" />
          <pointLight position={[3, -2, -2]} intensity={0.8} color="#fbbf24" />
          <Sparkles count={75} scale={6} size={2.8} speed={0.4} color="#fbbf24" />

          {/* User has 360° Drag & Zoom Rotation */}
          <OrbitControls
            enableRotate
            enablePan={false}
            enableZoom
            minDistance={3.2}
            maxDistance={7.5}
            autoRotate={!blown && !cakeCutDone && !isCompanionCuttingCake}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />

          <Suspense fallback={null}>
            <GourmetCake
              blown={blown}
              isCut={cakeCutDone}
              themeId={selectedTheme}
              onCakeClick={handleCakeClick}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Fullscreen Celebration Canvas */}
      <Celebration active={blown || cakeCutDone} />

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
          {content.cake.heading}
        </motion.h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
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
            {cakeCutDone
              ? '✨ Cake is sliced! Enjoy the sweet celebration!'
              : blown
              ? `🔪 Tap the cake or button below: ${companion.name} will slice it with the knife!`
              : '👆 Drag to spin cake 360° • Zoom in/out'}
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

      {/* Prominently Positioned Floating Action Controls at Bottom */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          pointerEvents: 'auto',
          width: 'max-content',
          maxWidth: '92vw',
        }}
      >
        {!blown ? (
          <motion.button
            className="magic-button"
            onClick={handleBlow}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Blow the birthday candles"
            style={{
              boxShadow: '0 8px 30px rgba(245, 158, 11, 0.6), 0 0 20px rgba(251, 191, 36, 0.4)',
              fontSize: '1.05rem',
              padding: '0.9rem 2.2rem',
              border: '1.5px solid rgba(251, 191, 36, 0.7)',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            }}
          >
            <span>Blow the Candles 🎂 💨</span>
          </motion.button>
        ) : !cakeCutDone ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <motion.button
              className="magic-button"
              onClick={handleCakeClick}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              disabled={isCompanionCuttingCake}
              aria-label="Cut the birthday cake with knife"
              style={{
                background: 'linear-gradient(135deg, #10b981, #6366f1)',
                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.6)',
                fontSize: '1.05rem',
                padding: '0.9rem 2.2rem',
                border: '1.5px solid rgba(52, 211, 153, 0.7)',
                opacity: isCompanionCuttingCake ? 0.7 : 1,
              }}
            >
              <span>{isCompanionCuttingCake ? 'Cutting the Cake... 🔪' : `Cut Cake with ${companion.name} 🔪 🎂`}</span>
            </motion.button>
            <span style={{ fontSize: '0.74rem', color: '#fbbf24', background: 'rgba(0,0,0,0.6)', padding: '2px 10px', borderRadius: '12px' }}>
              💡 Or click directly on the cake!
            </span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 14 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
          >
            <div
              style={{
                background: 'rgba(15, 12, 34, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(251, 191, 36, 0.6)',
                borderRadius: '20px',
                padding: '6px 18px',
                color: '#fbbf24',
                fontSize: '0.92rem',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
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
              style={{
                boxShadow: '0 8px 30px rgba(236, 72, 153, 0.6)',
                padding: '0.85rem 2rem',
              }}
            >
              <span>Read Your Birthday Letter 💌 ✨</span>
            </motion.button>
          </motion.div>
        )}
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
