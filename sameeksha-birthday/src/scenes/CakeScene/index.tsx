import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore, CAKE_THEMES, type CakeThemeId } from '../../state/experienceStore';
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
      mesh.position.x += Math.sin(t * 2 + i) * 0.002;
      mesh.scale.multiplyScalar(1.006);
      if (mesh.material instanceof THREE.Material) {
        mesh.material.opacity = Math.max(0, 0.5 - mesh.position.y * 0.35);
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
          <meshBasicMaterial color="#e2e8f0" transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

// Hyper-Realistic 3D Candle with Wax Rim, Drips & Teardrop Flame
function RealisticCandle({
  position,
  blown,
}: {
  position: [number, number, number];
  blown: boolean;
}) {
  const flameOuterRef = useRef<THREE.Mesh>(null);
  const flameInnerRef = useRef<THREE.Mesh>(null);
  const flameHaloRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Teardrop flame geometry created with LatheGeometry for authentic candle flame curve
  const flameGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const count = 18;
    for (let i = 0; i <= count; i++) {
      const u = i / count;
      // Flame profile curve: tapered at wick, bulbous belly, sharp tip
      const radius = Math.sin(u * Math.PI) * 0.065 * (1 - u * 0.25);
      const y = u * 0.24;
      points.push(new THREE.Vector2(radius, y));
    }
    return new THREE.LatheGeometry(points, 16);
  }, []);

  useFrame(({ clock }) => {
    if (!blown) {
      const t = clock.getElapsedTime() * 14;
      const flicker = 1 + Math.sin(t) * 0.12 + Math.cos(t * 2.3) * 0.08;
      const swayX = Math.sin(t * 0.8) * 0.07;
      const swayZ = Math.cos(t * 0.6) * 0.05;

      if (flameOuterRef.current) {
        flameOuterRef.current.scale.set(flicker, flicker * 1.15, flicker);
        flameOuterRef.current.rotation.x = swayX;
        flameOuterRef.current.rotation.z = swayZ;
      }
      if (flameInnerRef.current) {
        flameInnerRef.current.scale.set(flicker * 0.7, flicker * 0.95, flicker * 0.7);
        flameInnerRef.current.rotation.x = swayX * 0.8;
      }
      if (flameHaloRef.current) {
        flameHaloRef.current.scale.set(flicker * 1.3, flicker * 1.3, flicker * 1.3);
      }
      if (lightRef.current) {
        lightRef.current.intensity = 1.6 + Math.sin(t * 1.8) * 0.45;
      }
    } else {
      if (flameOuterRef.current) flameOuterRef.current.scale.set(0, 0, 0);
      if (flameInnerRef.current) flameInnerRef.current.scale.set(0, 0, 0);
      if (flameHaloRef.current) flameHaloRef.current.scale.set(0, 0, 0);
      if (lightRef.current) lightRef.current.intensity = 0;
    }
  });

  return (
    <group position={position}>
      {/* Wax Candle Body */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.048, 0.052, 0.52, 24]} />
        <meshStandardMaterial
          color="#fef3c7"
          roughness={0.18}
          metalness={0.02}
        />
      </mesh>

      {/* Melted Wax Rim Lip at Top */}
      <mesh position={[0, 0.52, 0]}>
        <torusGeometry args={[0.046, 0.012, 12, 24]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.25} />
      </mesh>

      {/* Wax Drips running down */}
      <mesh position={[0.042, 0.36, 0.02]} scale={[0.018, 0.08, 0.018]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#fef9c3" roughness={0.3} />
      </mesh>
      <mesh position={[-0.04, 0.24, -0.025]} scale={[0.02, 0.09, 0.02]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color="#fef9c3" roughness={0.3} />
      </mesh>

      {/* Carbonized Cotton Wick with slight natural curve */}
      <mesh position={[0.004, 0.55, 0]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.007, 0.009, 0.07, 8]} />
        <meshStandardMaterial color="#18181b" roughness={0.9} />
      </mesh>

      {/* Realistic Multi-Layer Teardrop Flame */}
      {!blown ? (
        <group position={[0, 0.58, 0]}>
          {/* Outer Warm Amber Flame */}
          <mesh ref={flameOuterRef} geometry={flameGeometry}>
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f97316"
              emissiveIntensity={3.6}
              transparent
              opacity={0.94}
            />
          </mesh>

          {/* Inner Hot Blue/White Core */}
          <mesh ref={flameInnerRef} geometry={flameGeometry} position={[0, -0.015, 0]}>
            <meshStandardMaterial
              color="#ffffff"
              emissive="#38bdf8"
              emissiveIntensity={4.8}
            />
          </mesh>

          {/* Soft outer glow halo */}
          <mesh ref={flameHaloRef} position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.16} />
          </mesh>

          <pointLight ref={lightRef} color="#f97316" intensity={1.8} distance={2.5} />
        </group>
      ) : (
        <CandleSmoke position={[0, 0.55, 0]} />
      )}
    </group>
  );
}

// Interactive 3D Knife with User Drag-to-Cut Support
function CakeKnife3D({
  isCutting,
  isCut,
  cutProgress,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKnifeClick,
}: {
  isCutting: boolean;
  isCut: boolean;
  cutProgress: number; // 0 (top hover) to 1 (full cut through)
  onPointerDown: (e: any) => void;
  onPointerMove: (e: any) => void;
  onPointerUp: (e: any) => void;
  onKnifeClick: () => void;
}) {
  const knifeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!knifeRef.current) return;
    const t = clock.getElapsedTime();

    if (isCut) {
      // Placed resting beside the cake stand
      knifeRef.current.position.set(1.9, -0.4, 0.8);
      knifeRef.current.rotation.set(0, 0.4, Math.PI / 2);
    } else if (isCutting || cutProgress > 0) {
      // Knife follows user's cut progress down through the cake!
      const startY = 1.35;
      const endY = 0.05;
      const curY = THREE.MathUtils.lerp(startY, endY, cutProgress);
      knifeRef.current.position.set(0.45, curY, 0.45);
      knifeRef.current.rotation.set(-Math.PI / 4, 0, Math.PI / 6);
    } else {
      // Hovering beside cake waiting for user touch/drag
      knifeRef.current.position.x = 1.75 + Math.sin(t * 1.5) * 0.05;
      knifeRef.current.position.y = 0.85 + Math.cos(t * 1.5) * 0.06;
      knifeRef.current.position.z = 0.6;
      knifeRef.current.rotation.set(-Math.PI / 6, Math.PI / 8, Math.sin(t * 1.2) * 0.06);
    }
  });

  return (
    <group
      ref={knifeRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={(e) => {
        e.stopPropagation();
        onKnifeClick();
      }}
    >
      {/* Blade - Polished Steel */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.035, 1.1, 0.18]} />
        <meshStandardMaterial
          color="#f8fafc"
          metalness={0.96}
          roughness={0.08}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Golden Guard */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* Premium Velvet Handle */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.055, 0.048, 0.7, 16]} />
        <meshStandardMaterial color="#3b0764" roughness={0.4} metalness={0.25} />
      </mesh>

      {/* Golden Handle End Cap */}
      <mesh position={[0, -0.72, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.12} />
      </mesh>
    </group>
  );
}

// 3D Gourmet Custom Birthday Cake with Slide-Out Cut Wedge
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
    <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.1}>
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

        {/* Cut Slice Wedge */}
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

  const [blown, setBlown] = useState(candlesBlown);
  const [isCut, setIsCut] = useState(false);
  const [isCutting, setIsCutting] = useState(false);
  const [cutProgress, setCutProgress] = useState(0); // 0 to 1
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isDraggingKnife, setIsDraggingKnife] = useState(false);

  // Drag tracking refs
  const dragStartYRef = useRef(0);

  const handleBlow = () => {
    if (!blown) {
      setBlown(true);
      setCandlesBlown();
      soundManager.playPopperBurstSound();
      robotSpeaker.speak('Happy Birthday Sameeksha! Ab cake cut karne ki baari hai! Knife ko cake pr drag kijiye! 🎂🔪');
    }
  };

  const completeCut = () => {
    if (isCut) return;
    setIsCutting(false);
    setIsCut(true);
    setCutProgress(1);
    setIsDraggingKnife(false);
    soundManager.playCakeSliceSound();
    soundManager.playPopperBurstSound();
    robotSpeaker.speak('Wah! Sameeksha baby ka birthday cake cut ho gaya! Happy Birthday Meri Jaan! 🎉🍰');
  };

  // Direct trigger via button or click
  const handleCutClick = () => {
    if (isCut || isCutting) return;
    setIsCutting(true);
    soundManager.playCakeSliceSound();

    let p = 0;
    const interval = setInterval(() => {
      p += 0.12;
      setCutProgress(Math.min(1, p));
      if (p >= 1) {
        clearInterval(interval);
        completeCut();
      }
    }, 60);
  };

  // User Drag to Cut Knife interaction
  const handleKnifePointerDown = (e: any) => {
    e.stopPropagation();
    if (isCut) return;
    setIsDraggingKnife(true);
    dragStartYRef.current = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
    soundManager.playTwinkle();
  };

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent | MouseEvent | TouchEvent) => {
      if (!isDraggingKnife || isCut) return;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const deltaY = clientY - dragStartYRef.current;
      // 180px downward drag completes the cut
      const progress = Math.max(0, Math.min(1, deltaY / 180));
      setCutProgress(progress);

      if (progress >= 0.85) {
        completeCut();
      }
    };

    const handleGlobalPointerUp = () => {
      if (isDraggingKnife && !isCut) {
        if (cutProgress > 0.4) {
          // Finish cut automatically if user dragged past 40%
          handleCutClick();
        } else {
          // Snap back
          setCutProgress(0);
        }
        setIsDraggingKnife(false);
      }
    };

    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('touchmove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('touchend', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('touchmove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('touchend', handleGlobalPointerUp);
    };
  }, [isDraggingKnife, isCut, cutProgress]);

  const currentCakeTheme = CAKE_THEMES[selectedTheme] || CAKE_THEMES.strawberry;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D Interactive Canvas: Stops autoRotate when knife is touched or cake is cut */}
      <div className="canvas-container" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Canvas camera={{ position: [0, 1.4, 5.0], fov: 46 }}>
          <ambientLight intensity={0.75} />
          <directionalLight position={[5, 8, 5]} intensity={1.6} />
          <pointLight position={[-4, 2, 2]} intensity={0.9} color="#ff6b9d" />
          <pointLight position={[3, -2, -2]} intensity={0.8} color="#fbbf24" />
          <Sparkles count={75} scale={6} size={2.8} speed={0.4} color="#fbbf24" />

          {/* User has 360° Drag & Zoom Rotation. Auto-rotate pauses when touching knife or cutting */}
          <OrbitControls
            enableRotate
            enablePan={false}
            enableZoom
            minDistance={3.2}
            maxDistance={7.5}
            autoRotate={!blown && !isCut && !isDraggingKnife && !isCutting}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />

          <Suspense fallback={null}>
            <GourmetCake blown={blown} isCut={isCut} themeId={selectedTheme} />
            <CakeKnife3D
              isCutting={isCutting}
              isCut={isCut}
              cutProgress={cutProgress}
              onPointerDown={handleKnifePointerDown}
              onPointerMove={() => {}}
              onPointerUp={() => setIsDraggingKnife(false)}
              onKnifeClick={handleCutClick}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Fullscreen Celebration Canvas */}
      <Celebration active={blown || isCut} />

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
            {isCut
              ? '✨ Cake is cut! Enjoy the celebration!'
              : blown
              ? '🔪 Drag knife down into cake or tap button to cut!'
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
        ) : !isCut ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <motion.button
              className="magic-button"
              onClick={handleCutClick}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Cut the birthday cake with knife"
              style={{
                background: 'linear-gradient(135deg, #10b981, #6366f1)',
                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.6)',
                fontSize: '1.05rem',
                padding: '0.9rem 2.2rem',
                border: '1.5px solid rgba(52, 211, 153, 0.7)',
              }}
            >
              <span>Cut the Cake 🔪 🎂</span>
            </motion.button>
            <span style={{ fontSize: '0.74rem', color: '#fbbf24', background: 'rgba(0,0,0,0.6)', padding: '2px 10px', borderRadius: '12px' }}>
              💡 Or touch & drag the knife downward directly!
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
