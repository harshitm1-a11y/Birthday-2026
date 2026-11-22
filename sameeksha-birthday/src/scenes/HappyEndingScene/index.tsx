import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import { soundManager } from '../../utils/audio';

// Interactive Mouse Parallax Camera for Realistic 3D Depth
function ParallaxCamera() {
  const { camera } = useThree();

  useFrame(({ mouse }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.9, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.2 + mouse.y * 0.6, 0.04);
    camera.lookAt(0, 2.5, 0);
  });

  return null;
}

// Individual 3D Realistic Sky Lantern with Warm Glowing Paper Shader
interface LanternProps {
  initialPos: [number, number, number];
  speed: number;
  swaySpeed: number;
  swayOffset: number;
  scale?: number;
  glowColor?: string;
}

function SkyLantern({
  initialPos,
  speed,
  swaySpeed,
  swayOffset,
  scale = 1,
  glowColor = '#f59e0b',
}: LanternProps) {
  const groupRef = useRef<THREE.Group>(null);
  const posYRef = useRef(initialPos[1]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const dt = Math.min(delta, 0.04); // Cap delta so background tab / scene switch does not jump

    // Constant slow upward ascension
    posYRef.current += speed * dt * 1.35;
    if (posYRef.current > 24) {
      posYRef.current = -8; // Loop back from below
    }

    groupRef.current.position.y = posYRef.current;
    // Gentle floating sway
    groupRef.current.position.x = initialPos[0] + Math.sin(t * swaySpeed + swayOffset) * 0.55;
    groupRef.current.position.z = initialPos[2] + Math.cos(t * swaySpeed * 0.8 + swayOffset) * 0.4;

    // Subtle gentle tilt
    groupRef.current.rotation.z = Math.sin(t * swaySpeed + swayOffset) * 0.08;
    groupRef.current.rotation.x = Math.cos(t * swaySpeed * 0.7 + swayOffset) * 0.06;
  });

  return (
    <group ref={groupRef} position={initialPos} scale={[scale, scale, scale]}>
      {/* Outer Glowing Paper Lantern Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.42, 0.95, 12, 1, true]} />
        <meshStandardMaterial
          color="#ffedd5"
          emissive={glowColor}
          emissiveIntensity={2.8}
          roughness={0.4}
          side={THREE.DoubleSide}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Top Paper Dome */}
      <mesh position={[0, 0.47, 0]}>
        <sphereGeometry args={[0.32, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#ffedd5"
          emissive={glowColor}
          emissiveIntensity={3.0}
          roughness={0.3}
          side={THREE.DoubleSide}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Bottom Bamboo Ring Rim */}
      <mesh position={[0, -0.48, 0]}>
        <torusGeometry args={[0.42, 0.025, 6, 14]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>

      {/* Cross Bamboo Struts */}
      <mesh position={[0, -0.48, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.84, 4]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, -0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.84, 4]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>

      {/* Internal Candle Flame */}
      <mesh position={[0, -0.4, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// 3D Ascending Lantern Cloud (Tangled Lantern Sky)
function SkyLanternField({ extraLanterns }: { extraLanterns: Array<{ id: number; x: number; z: number; color: string }> }) {
  const baseLanterns = useMemo(() => {
    const list = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.5 + Math.random() * 8.5;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 3;
      const z = Math.sin(angle) * radius - 2 - Math.random() * 7;
      const y = -6 + Math.random() * 26;
      const speed = 0.5 + Math.random() * 0.8;
      const swaySpeed = 0.8 + Math.random() * 0.9;
      const swayOffset = Math.random() * Math.PI * 2;
      const scale = 0.55 + Math.random() * 0.5;
      const colors = ['#f59e0b', '#fbbf24', '#f97316', '#fb7185', '#f43f5e'];
      const glowColor = colors[Math.floor(Math.random() * colors.length)];
      list.push({ id: i, pos: [x, y, z] as [number, number, number], speed, swaySpeed, swayOffset, scale, glowColor });
    }
    return list;
  }, []);

  return (
    <group>
      {baseLanterns.map((l) => (
        <SkyLantern
          key={l.id}
          initialPos={l.pos}
          speed={l.speed}
          swaySpeed={l.swaySpeed}
          swayOffset={l.swayOffset}
          scale={l.scale}
          glowColor={l.glowColor}
        />
      ))}

      {extraLanterns.map((l) => (
        <SkyLantern
          key={l.id}
          initialPos={[l.x, -5, l.z]}
          speed={1.2}
          swaySpeed={1.4}
          swayOffset={l.id}
          scale={0.9}
          glowColor={l.color}
        />
      ))}
    </group>
  );
}

// 3D Royal Teddy Bear Mascot Standing on Celestial Starlight Pedestal Holding a Glowing Heart
function Royal3DTeddy() {
  const groupRef = useRef<THREE.Group>(null);
  const heartLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle floating bob
    groupRef.current.position.y = 0.15 + Math.sin(t * 1.8) * 0.1;
    groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.12;

    if (heartLightRef.current) {
      heartLightRef.current.intensity = 2.4 + Math.sin(t * 4) * 0.6;
    }
  });

  return (
    <group position={[0, -0.6, 2.8]}>
      {/* Floating Celestial Platform */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[1.35, 1.55, 0.25, 32]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.2}
          metalness={0.8}
          emissive="#3b82f6"
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Golden Glowing Inscribed Ring on Platform */}
      <mesh position={[0, -0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.25, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={1.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating Teddy Character Group */}
      <group ref={groupRef}>
        {/* Fur Material */}
        {/* Body */}
        <mesh position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial color="#b45309" roughness={0.9} />
        </mesh>
        {/* White Belly Patch */}
        <mesh position={[0, 0.42, 0.34]} scale={[0.75, 0.85, 0.35]}>
          <sphereGeometry args={[0.42, 20, 20]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.85} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 1.15, 0]}>
          <sphereGeometry args={[0.52, 24, 24]} />
          <meshStandardMaterial color="#b45309" roughness={0.9} />
        </mesh>

        {/* Snout */}
        <mesh position={[0, 1.05, 0.42]} scale={[1, 0.75, 0.65]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.85} />
        </mesh>
        {/* Nose */}
        <mesh position={[0, 1.12, 0.54]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#1c1917" roughness={0.3} />
        </mesh>

        {/* Glossy Black Eyes */}
        <mesh position={[-0.18, 1.25, 0.42]}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial color="#09090b" roughness={0.1} />
        </mesh>
        <mesh position={[0.18, 1.25, 0.42]}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial color="#09090b" roughness={0.1} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.38, 1.55, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </mesh>
        <mesh position={[0.38, 1.55, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </mesh>

        {/* Golden Royal Tiara / Crown on Teddy's Head */}
        <mesh position={[0, 1.68, 0]}>
          <cylinderGeometry args={[0.22, 0.16, 0.18, 6]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.9}
            roughness={0.2}
            emissive="#f59e0b"
            emissiveIntensity={0.6}
          />
        </mesh>
        {/* Tiara Jewels */}
        <mesh position={[0, 1.78, 0.12]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={1.8} />
        </mesh>

        {/* Royal Red Bow Tie */}
        <mesh position={[0, 0.85, 0.46]}>
          <boxGeometry args={[0.24, 0.12, 0.08]} />
          <meshStandardMaterial color="#ef4444" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.85, 0.5]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>

        {/* Arms holding the glowing heart */}
        <mesh position={[-0.42, 0.52, 0.22]} rotation={[0.4, 0.5, -0.6]}>
          <capsuleGeometry args={[0.12, 0.34, 8, 12]} />
          <meshStandardMaterial color="#b45309" roughness={0.9} />
        </mesh>
        <mesh position={[0.42, 0.52, 0.22]} rotation={[0.4, -0.5, 0.6]}>
          <capsuleGeometry args={[0.12, 0.34, 8, 12]} />
          <meshStandardMaterial color="#b45309" roughness={0.9} />
        </mesh>

        {/* Glowing Heart Lantern held in Teddy's Paws */}
        <group position={[0, 0.48, 0.54]}>
          <mesh scale={[0.24, 0.24, 0.24]}>
            <sphereGeometry args={[0.7, 18, 18]} />
            <meshStandardMaterial
              color="#ff007f"
              emissive="#ff007f"
              emissiveIntensity={3.2}
              roughness={0.2}
            />
          </mesh>
          <pointLight
            ref={heartLightRef}
            position={[0, 0, 0.1]}
            intensity={2.8}
            distance={5.0}
            color="#ff1493"
          />
        </group>
      </group>
    </group>
  );
}

// Romantic Song List for the Grand Happy Ending with instant iconic vocal chorus hooks
const ROMANTIC_HITS = [
  { id: 'hindi-channa-mereya', name: 'Channa Mereya (Accha Chalta Hoon)', artist: 'Arijit Singh', emoji: '🌟', vocalStart: 58 },
  { id: 'hindi-tujh-mein-rab', name: 'Tujh Mein Rab Dikhta Hai', artist: 'Roop Kumar Rathod', emoji: '✨', vocalStart: 42 },
  { id: 'hindi-dil-diyan-gallan', name: 'Dil Diyan Gallan', artist: 'Atif Aslam', emoji: '💖', vocalStart: 52 },
  { id: 'hindi-raataan-lambiyan', name: 'Raataan Lambiyan', artist: 'Jubin Nautiyal & Asees', emoji: '🌙', vocalStart: 56 },
  { id: 'hindi-tera-ban-jaunga', name: 'Tera Ban Jaunga', artist: 'Akhil Sachdeva & Tulsi', emoji: '🌹', vocalStart: 35 },
];

const HappyEndingScene: React.FC = () => {
  const setScene = useExperienceStore((s) => s.setScene);
  const [releasedCount, setReleasedCount] = useState(1);
  const [extraLanterns, setExtraLanterns] = useState<Array<{ id: number; x: number; z: number; color: string }>>([]);
  const [currentTrackId, setCurrentTrackId] = useState('hindi-channa-mereya');

  // Sameeksha's Reply / Feedback note state
  const [replyText, setReplyText] = useState(() => {
    return localStorage.getItem('sameeksha_birthday_reply_2026') || '';
  });
  const [isReplySubmitted, setIsReplySubmitted] = useState(() => {
    return !!localStorage.getItem('sameeksha_birthday_reply_2026');
  });
  const [isEditingReply, setIsEditingReply] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // Play romantic anthem on mount: Channa Mereya ("Accha chalta hoon, duaon mein yaad rakhna" at 58s)
  useEffect(() => {
    soundManager.playTrack('hindi-channa-mereya', 58);
    if (!soundManager.isPlaying()) {
      soundManager.startAmbient();
    }

    const unsub = soundManager.subscribe(() => {
      setCurrentTrackId(soundManager.getCurrentTrack().id);
    });
    return () => {
      unsub();
    };
  }, []);

  const handleReleaseLantern = () => {
    soundManager.playTwinkle();
    setReleasedCount((prev) => prev + 1);

    const colors = ['#fbbf24', '#f59e0b', '#f43f5e', '#ff007f', '#a855f7'];
    const newLantern = {
      id: Date.now() + Math.random(),
      x: (Math.random() - 0.5) * 6,
      z: 1 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    // Cap extra lanterns to 8 to guarantee smooth 60fps
    setExtraLanterns((prev) => [...prev.slice(-7), newLantern]);
  };

  const handleSelectTrack = (trackId: string, vocalStart: number = 0) => {
    soundManager.playTrack(trackId, vocalStart);
    if (!soundManager.isPlaying()) {
      soundManager.startAmbient();
    }
  };

  const handleSaveReply = () => {
    if (!replyText.trim()) return;
    localStorage.setItem('sameeksha_birthday_reply_2026', replyText.trim());
    setIsReplySubmitted(true);
    setIsEditingReply(false);
    soundManager.playTwinkle();
  };

  const handleShareOrCopy = async () => {
    const textToShare = `💖 Sameeksha's Birthday Reply to Harshit 💖\n\n"${replyText.trim()}"\n\n✨ 23 November 2026 • Celestial Birthday Universe ✨`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Sameeksha's Birthday Reply for Harshit",
          text: textToShare,
        });
        setCopyStatus('Shared successfully! 💖');
        setTimeout(() => setCopyStatus(null), 3500);
        return;
      } catch {
        // User cancelled share dialog
      }
    }

    try {
      await navigator.clipboard.writeText(textToShare);
      setCopyStatus('Copied! Take a screenshot of this card or send on WhatsApp! 📸✨');
      setTimeout(() => setCopyStatus(null), 4000);
    } catch {
      setCopyStatus('Take a screenshot of this card to share with Harshit! 📸✨');
      setTimeout(() => setCopyStatus(null), 4000);
    }
  };

  const handleWhatsAppDirect = () => {
    const textToShare = `💖 Sameeksha's Birthday Reply to Harshit 💖\n\n"${replyText.trim()}"\n\n✨ 23 November 2026 ✨`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#030208',
      }}
    >
      {/* 3D React Three Fiber Canvas with Floating Sky Lanterns & Royal 3D Teddy Bear */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 2.2, 7.5], fov: 50 }}>
          <ParallaxCamera />
          <ambientLight intensity={0.45} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} color="#fef08a" />
          <pointLight position={[-4, 3, 2]} intensity={1.5} color="#ec4899" />
          <pointLight position={[4, 5, -2]} intensity={2.0} color="#fbbf24" />

          {/* Deep Space Stars */}
          <Stars radius={100} depth={60} count={4000} factor={4} saturation={0.5} fade speed={1.2} />
          <Sparkles count={75} scale={12} size={2.5} speed={0.5} color="#fbbf24" />

          {/* Ascending Tangled Lanterns Sky */}
          <SkyLanternField extraLanterns={extraLanterns} />

          {/* Central 3D Royal Teddy Bear with Tiara & Glowing Heart */}
          <Royal3DTeddy />
        </Canvas>
      </div>

      {/* HTML / Framer Motion Overlay */}
      <div
        className="scene-overlay"
        style={{
          zIndex: 10,
          pointerEvents: 'auto',
          overflowY: 'auto',
          paddingTop: '2.5rem',
          paddingBottom: '5.5rem',
        }}
      >
        <motion.div
          className="scene-content"
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: '680px' }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-block',
              background: 'rgba(251, 191, 36, 0.15)',
              border: '1px solid rgba(251, 191, 36, 0.45)',
              borderRadius: '9999px',
              padding: '6px 18px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#fbbf24',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '0.8rem',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
            }}
          >
            {content.happyEnding.badge}
          </motion.div>

          {/* Heading */}
          <h1
            className="scene-heading"
            style={{
              fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
              textShadow: '0 0 35px rgba(255, 0, 127, 0.7), 0 2px 10px rgba(0,0,0,0.85)',
              marginBottom: '0.8rem',
            }}
          >
            {content.happyEnding.heading}
          </h1>

          {/* Subtext */}
          <p
            className="scene-subtext"
            style={{
              fontSize: 'clamp(0.98rem, 2.8vw, 1.15rem)',
              color: '#f1f5f9',
              lineHeight: 1.7,
              marginBottom: '1.4rem',
              whiteSpace: 'pre-line',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            {content.happyEnding.subtext}
          </p>

          {/* Interactive Wish Lantern Action Button */}
          <div style={{ marginBottom: '1.6rem' }}>
            <motion.button
              type="button"
              className="magic-button"
              onClick={handleReleaseLantern}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ec4899, #8b5cf6)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 0 30px rgba(245, 158, 11, 0.6), 0 4px 15px rgba(0,0,0,0.6)',
                padding: '14px 28px',
                fontSize: '1.05rem',
                fontWeight: 700,
              }}
            >
              <span>{content.happyEnding.buttons.releaseLantern}</span>
            </motion.button>
            <div
              style={{
                fontSize: '0.82rem',
                color: '#fef08a',
                marginTop: '8px',
                textShadow: '0 0 8px rgba(251, 191, 36, 0.7)',
              }}
            >
              🏮 Sky Lanterns Floating in Space: <strong>{releasedCount + 38}</strong>
            </div>
          </div>

          {/* Glassmorphic Emotional Letter Card from Harshit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            style={{
              background: 'rgba(17, 12, 34, 0.85)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              borderRadius: '24px',
              padding: '1.6rem 1.8rem',
              marginBottom: '1.6rem',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.8), 0 0 25px rgba(251, 191, 36, 0.2)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '1.05rem',
                color: '#fbbf24',
                fontWeight: 700,
                marginBottom: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>💌</span>
              <span>A Personal Note For You, Sameeksha</span>
              <span>✨</span>
            </div>
            <p
              style={{
                fontSize: 'clamp(0.95rem, 2.6vw, 1.05rem)',
                color: '#fed7aa',
                lineHeight: 1.8,
                margin: 0,
                whiteSpace: 'pre-line',
                fontStyle: 'italic',
              }}
            >
              {content.happyEnding.personalNote}
            </p>
          </motion.div>

          {/* Interactive Birthday Reply / Feedback Card for Sameeksha */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            style={{
              background: 'linear-gradient(135deg, rgba(28, 16, 52, 0.95), rgba(17, 12, 34, 0.98))',
              border: '2px solid rgba(251, 191, 36, 0.65)',
              borderRadius: '24px',
              padding: '1.6rem',
              marginBottom: '1.8rem',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(251, 191, 36, 0.25)',
              backdropFilter: 'blur(16px)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(251, 191, 36, 0.2)',
                border: '1px solid rgba(251, 191, 36, 0.7)',
                borderRadius: '9999px',
                padding: '4px 16px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#fef08a',
                letterSpacing: '1.5px',
                marginBottom: '0.6rem',
                textTransform: 'uppercase',
              }}
            >
              💌 Sameeksha's Birthday Reply 💌
            </div>

            <h3
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 0.5rem 0',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              }}
            >
              Leave a Note or Feedback for Harshit ✨
            </h3>

            <p style={{ fontSize: '0.86rem', color: '#fed7aa', margin: '0 0 1.1rem 0', lineHeight: 1.5 }}>
              Sameeksha, write your thoughts, sweet words, or birthday reply below. Harshit will read and keep this close to his heart forever!
            </p>

            {/* If submitted & not currently editing: Show Celebration Card */}
            {isReplySubmitted && !isEditingReply ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: 'rgba(251, 191, 36, 0.12)',
                  border: '1.5px solid rgba(251, 191, 36, 0.6)',
                  borderRadius: '18px',
                  padding: '1.4rem',
                  marginBottom: '1rem',
                  textAlign: 'left',
                }}
              >
                {/* Thank You Banner */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#34d399',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    marginBottom: '0.8rem',
                  }}
                >
                  <span>🎉</span>
                  <span>Thank you so much Sameeksha! ❤️</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#fef08a', marginBottom: '0.9rem' }}>
                  Harshit will treasure your reply forever and ever! Here is your saved note:
                </div>

                {/* Formatted Keepsake Postcard for Screenshot */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.45)',
                    border: '1px dashed rgba(251, 191, 36, 0.5)',
                    borderRadius: '14px',
                    padding: '1rem 1.2rem',
                    color: '#fff',
                    fontStyle: 'italic',
                    fontSize: '0.98rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    marginBottom: '1rem',
                  }}
                >
                  "{replyText}"
                  <div
                    style={{
                      textAlign: 'right',
                      marginTop: '0.8rem',
                      fontStyle: 'normal',
                      fontSize: '0.82rem',
                      color: '#fb7185',
                      fontWeight: 600,
                    }}
                  >
                    — Sameeksha 🌸 (23 Nov 2026)
                  </div>
                </div>

                {/* Share / Screenshot Instructions & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <motion.button
                      type="button"
                      onClick={handleShareOrCopy}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '24px',
                        padding: '9px 18px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                      }}
                    >
                      <span>📸</span>
                      <span>Share / Send to Harshit</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        background: 'linear-gradient(135deg, #25D366, #128C7E)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '24px',
                        padding: '9px 18px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
                      }}
                    >
                      <span>💬</span>
                      <span>Open WhatsApp</span>
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => setIsEditingReply(true)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: '#fff',
                        borderRadius: '24px',
                        padding: '9px 16px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ✏️ Edit Note
                    </button>
                  </div>

                  {/* Screenshot hint */}
                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: '#fed7aa',
                      textAlign: 'center',
                      marginTop: '6px',
                    }}
                  >
                    ✨ <strong>Tip:</strong> Is card ka screenshot lekar aap WhatsApp ya Instagram par Harshit ke saath share kar sakte hain! 📸❤️
                  </div>

                  {/* Copy status toast */}
                  {copyStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: 'rgba(251, 191, 36, 0.25)',
                        border: '1px solid #fbbf24',
                        color: '#fef08a',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textAlign: 'center',
                      }}
                    >
                      {copyStatus}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Input Form */
              <div style={{ textAlign: 'left' }}>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Harshit, your surprise was so special... Here is my birthday reply to you! 💖✨"
                  rows={4}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.55)',
                    border: '1.5px solid rgba(251, 191, 36, 0.5)',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    lineHeight: 1.5,
                    resize: 'vertical',
                    outline: 'none',
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.6)',
                    marginBottom: '0.8rem',
                    fontFamily: 'inherit',
                  }}
                />

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <motion.button
                    type="button"
                    onClick={handleSaveReply}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    disabled={!replyText.trim()}
                    style={{
                      background: replyText.trim()
                        ? 'linear-gradient(135deg, #f59e0b, #ec4899)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: replyText.trim() ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                      border: 'none',
                      borderRadius: '24px',
                      padding: '10px 24px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                      boxShadow: replyText.trim()
                        ? '0 6px 20px rgba(245, 158, 11, 0.5)'
                        : 'none',
                    }}
                  >
                    💌 Save & Send Birthday Reply to Harshit
                  </motion.button>

                  {isReplySubmitted && (
                    <button
                      type="button"
                      onClick={() => setIsEditingReply(false)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '24px',
                        padding: '10px 18px',
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Romantic Soundtrack Switcher */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '20px',
              padding: '12px 16px',
              marginBottom: '1.6rem',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ fontSize: '0.88rem', color: '#fbbf24', fontWeight: 700, marginBottom: '6px' }}>
              🎵 Romantic Bollywood Soundtrack
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {ROMANTIC_HITS.map((hit) => {
                const isActive = currentTrackId === hit.id;
                return (
                  <motion.button
                    key={hit.id}
                    type="button"
                    onClick={() => handleSelectTrack(hit.id, hit.vocalStart)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.4), rgba(244, 63, 94, 0.4))'
                        : 'rgba(255, 255, 255, 0.08)',
                      border: isActive
                        ? '1px solid rgba(251, 191, 36, 0.7)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '6px 12px',
                      color: isActive ? '#fef08a' : 'rgba(255, 255, 255, 0.85)',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span>{hit.emoji}</span>
                    <span>{hit.name}</span>
                    {isActive && <span style={{ fontSize: '0.65rem' }}>🔊</span>}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Long Drive Grand Adventure Button */}
          <div style={{ marginTop: '1rem', marginBottom: '1.2rem', textAlign: 'center' }}>
            <motion.button
              type="button"
              className="magic-button"
              onClick={() => {
                soundManager.playTwinkle();
                setScene(7);
              }}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.94 }}
              style={{
                background: 'linear-gradient(135deg, #f43f5e, #fbbf24, #a855f7)',
                color: '#fff',
                border: '2px solid rgba(251, 191, 36, 0.9)',
                borderRadius: '35px',
                padding: '14px 34px',
                fontSize: '1.05rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 0 25px rgba(244, 63, 94, 0.7), 0 0 40px rgba(251, 191, 36, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>🚗</span>
              <span>Long Drive Pe Chalein, Sameeksha? 🏍️ 🌙</span>
              <span style={{ fontSize: '1.4rem' }}>✨</span>
            </motion.button>
          </div>

          {/* Bottom Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="magic-button"
              onClick={() => setScene(0)}
              style={{ padding: '10px 22px', fontSize: '0.92rem' }}
            >
              <span>{content.happyEnding.buttons.replay}</span>
            </button>
            <button
              className="magic-button magic-button-secondary"
              onClick={() => setScene(2)}
              style={{ padding: '10px 22px', fontSize: '0.92rem' }}
            >
              <span>{content.happyEnding.buttons.memories}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HappyEndingScene;
