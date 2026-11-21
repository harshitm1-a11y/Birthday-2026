import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore, CAKE_THEMES, type CakeThemeId } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import Celebration from '../../components/Celebration';
import { soundManager } from '../../utils/audio';

// Realistic 3D Candle with multi-layer flame & melting wax drips
function RealisticCandle({
  position,
  blown,
}: {
  position: [number, number, number];
  blown: boolean;
}) {
  const outerFlameRef = useRef<THREE.Mesh>(null);
  const innerFlameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!blown) {
      const t = clock.getElapsedTime() * 16;
      const flicker = 1 + Math.sin(t) * 0.12 + Math.cos(t * 1.8) * 0.08;
      const sway = Math.sin(t * 0.7) * 0.06;

      if (outerFlameRef.current) {
        outerFlameRef.current.scale.set(flicker, flicker * 1.25, flicker);
        outerFlameRef.current.rotation.z = sway;
      }
      if (innerFlameRef.current) {
        innerFlameRef.current.scale.set(flicker * 0.8, flicker * 1.1, flicker * 0.8);
      }
      if (lightRef.current) {
        lightRef.current.intensity = 1.4 + Math.sin(t * 1.4) * 0.4;
      }
    } else {
      if (outerFlameRef.current) outerFlameRef.current.scale.set(0, 0, 0);
      if (innerFlameRef.current) innerFlameRef.current.scale.set(0, 0, 0);
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

      {/* Carbonized Twisted Wick */}
      <mesh position={[0, 0.59, 0]}>
        <cylinderGeometry args={[0.008, 0.01, 0.09, 8]} />
        <meshStandardMaterial color="#1f2937" roughness={0.9} />
      </mesh>

      {/* Realistic Multi-Layer Flame */}
      {!blown && (
        <group position={[0, 0.69, 0]}>
          {/* Outer Warm Amber Flame */}
          <mesh ref={outerFlameRef}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f97316"
              emissiveIntensity={3.2}
              transparent
              opacity={0.95}
            />
          </mesh>

          {/* Inner Hot Blue/White Core */}
          <mesh ref={innerFlameRef} position={[0, -0.015, 0]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#60a5fa"
              emissiveIntensity={4.5}
            />
          </mesh>

          <pointLight ref={lightRef} color="#f97316" intensity={1.8} distance={2.5} />
        </group>
      )}
    </group>
  );
}

// 3D Gourmet Custom Birthday Cake
function GourmetCake({
  blown,
  themeId,
}: {
  blown: boolean;
  themeId: CakeThemeId;
}) {
  const cakeGroup = useRef<THREE.Group>(null);
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
      ctx.font = 'bold 38px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ SAMEEKSHA BABY ✨', 256, 50);

      ctx.fillStyle = '#fbcfe8';
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText('Happy Birthday • 23 Nov 2026', 256, 95);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  return (
    <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.15}>
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
  const [isShopOpen, setIsShopOpen] = useState(false);

  const handleBlow = () => {
    if (!blown) {
      setBlown(true);
      setCandlesBlown();
      soundManager.playPopperBurstSound();
    }
  };

  const currentCakeTheme = CAKE_THEMES[selectedTheme] || CAKE_THEMES.strawberry;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D Interactive Canvas with Touch/Mouse OrbitControls */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 1.5, 5.2], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.6} />
          <pointLight position={[-4, 2, 2]} intensity={0.9} color="#ff6b9d" />
          <Sparkles count={70} scale={6} size={2.8} speed={0.4} color="#fbbf24" />

          {/* User can freely drag & rotate the cake in 3D 360 degrees! */}
          <OrbitControls
            enableRotate
            enablePan={false}
            enableZoom
            minDistance={3.5}
            maxDistance={7.5}
            autoRotate={!blown}
            autoRotateSpeed={0.6}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />

          <Suspense fallback={null}>
            <GourmetCake blown={blown} themeId={selectedTheme} />
          </Suspense>
        </Canvas>
      </div>

      {/* Fullscreen Celebration Canvas */}
      <Celebration active={blown} />

      {/* Floating 360° Drag Hint & Cake Shop Button */}
      <div
        style={{
          position: 'fixed',
          top: '72px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            background: 'rgba(15, 12, 34, 0.75)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '20px',
            padding: '5px 14px',
            fontSize: '0.75rem',
            color: '#fbbf24',
            userSelect: 'none',
          }}
        >
          👆 Drag to spin cake 360°
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
            padding: '6px 14px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{currentCakeTheme.emoji}</span>
          <span>Cake Shop</span>
        </motion.button>
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
          <h2 className="scene-heading">{content.cake.heading}</h2>
          <p className="scene-subtext">{content.cake.subtext}</p>

          <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {!blown ? (
              <button
                className="magic-button"
                onClick={handleBlow}
                aria-label="Blow the birthday candles"
              >
                <span>Blow the Candles 🎂 💨</span>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ color: '#fbbf24', fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem' }}>
                  🎉 May all your dreams come true Sameeksha baby! ✨
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
