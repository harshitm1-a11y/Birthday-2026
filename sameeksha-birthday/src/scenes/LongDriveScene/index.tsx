import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { soundManager } from '../../utils/audio';

type VehicleType = 'pedal' | 'bike' | 'car';

interface VehicleOption {
  id: VehicleType;
  title: string;
  subtitle: string;
  emoji: string;
  vibe: string;
  badge: string;
  bgGradient: string;
}

const VEHICLES: VehicleOption[] = [
  {
    id: 'bike',
    title: 'Royal Enfield Bullet 350',
    subtitle: 'Bullet ki iconic thump, thandi raat, aur tum Harshit ko peeche se tight pakad ke baithi ho...',
    emoji: '🏍️',
    vibe: 'Iconic Romance & Midnight Thrill ✨',
    badge: 'Harshit\'s Favourite Ride',
    bgGradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.35), rgba(251, 191, 36, 0.25))',
  },
  {
    id: 'car',
    title: 'Luxury BMW Convertible',
    subtitle: 'Khuli chhat, stereos pe bajta "Long Drive" gaana, thandi hawa, aur tumhara haath Harshit ke haath me...',
    emoji: '🚗',
    vibe: 'Dreamy & VIP Luxury Highway Cruise 🌙',
    badge: 'Luxury Royalty',
    bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.35), rgba(168, 85, 247, 0.25))',
  },
  {
    id: 'pedal',
    title: 'Romantic Midnight Walk',
    subtitle: 'Haathon me haath daal ke, thandi hawa me aaram se baatein karte huye, taaron ke neeche chalna...',
    emoji: '🚶‍♂️🚶‍♀️',
    vibe: 'Pyaar, Sukoon Aur Lambi Baatein 💕',
    badge: 'Pure Romantic Bliss',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35), rgba(244, 114, 182, 0.25))',
  },
];

const ROMANTIC_QUOTES = [
  { speaker: 'Harshit', text: 'Haath acche se pakad ke rakhna Sameeksha, thandi hawa chal rahi hai... ❤️' },
  { speaker: 'Sameeksha', text: 'Kabhi nahi chhodungi Harshit... Bas chalate raho, ye safar kabhi khatam na ho ✨' },
  { speaker: 'Harshit', text: 'Tumhare saath har rasta jannat jaisa lagta hai meri jaan... 🌙' },
  { speaker: 'Sameeksha', text: 'Long drive pe tum aur main... isse pyara birthday gift kuch nahi ho sakta 💕' },
  { speaker: 'Harshit', text: 'Chahe pedal ho, Bullet ho ya BMW... meri manzil hamesha tum hi ho 🌹' },
  { speaker: 'Sameeksha', text: 'Tumhare kandhe pe sar rakh kar hawa mehsoos karna duniya ka sabse pyara sukoon hai 🥰' },
];

const LongDriveScene: React.FC = () => {
  const setScene = useExperienceStore((s) => s.setScene);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [speedMode, setSpeedMode] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [isHornActive, setIsHornActive] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-cycle sweet romantic subtitles
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % ROMANTIC_QUOTES.length);
    }, 6500);
    return () => clearInterval(quoteInterval);
  }, []);

  // When a vehicle is chosen or scene opens, automatically play Mika Singh's "Long Drive"
  const handleSelectVehicle = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle);
    soundManager.initCtx();
    soundManager.playTrack('party-long-drive', 0);
    if (vehicle === 'bike') {
      soundManager.playEngineRev('bike');
    } else if (vehicle === 'car') {
      soundManager.playEngineRev('car');
    } else {
      soundManager.playTwinkle();
    }
  };

  const handleHorn = () => {
    soundManager.initCtx();
    setIsHornActive(true);
    if (selectedVehicle === 'bike') {
      soundManager.playBikeHorn();
    } else if (selectedVehicle === 'car') {
      soundManager.playCarHorn();
    } else {
      soundManager.playTwinkle();
    }
    setTimeout(() => setIsHornActive(false), 380);
  };

  // Speed configuration (km/h and pixel speed multipliers)
  const currentSpeedKm = useMemo(() => {
    if (selectedVehicle === 'pedal') {
      return speedMode === 'slow' ? 5 : speedMode === 'medium' ? 8 : 12;
    }
    if (speedMode === 'slow') return 45;
    if (speedMode === 'medium') return 75;
    return 115;
  }, [selectedVehicle, speedMode]);

  const speedMultiplier = useMemo(() => {
    if (selectedVehicle === 'pedal') {
      return speedMode === 'slow' ? 1.2 : speedMode === 'medium' ? 2.0 : 3.2;
    }
    return speedMode === 'slow' ? 5.5 : speedMode === 'medium' ? 10.0 : 16.5;
  }, [selectedVehicle, speedMode]);

  // 60 FPS HTML5 Canvas Highway Engine
  useEffect(() => {
    if (!selectedVehicle) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let roadOffset = 0;
    let cityOffset = 0;
    let lampOffset = 0;
    let treeOffset = 0;
    let time = 0;

    // Generate static stars once
    const stars: Array<{ x: number; y: number; r: number; alpha: number; speed: number }> = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.55),
        r: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.05 + 0.02,
      });
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.016;
      const w = canvas.width;
      const h = canvas.height;
      const horizonY = h * 0.52;

      // 1. Deep Midnight Gradient Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, '#060312');
      skyGrad.addColorStop(0.55, '#120b29');
      skyGrad.addColorStop(1, '#241445');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizonY);

      // 2. Stars & Twinkle
      stars.forEach((s) => {
        const twinkle = Math.sin(time * 3 + s.x) * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, s.alpha + twinkle)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Glowing Full Moon with Haze
      const moonX = w * 0.82;
      const moonY = h * 0.18;
      const moonRadius = Math.min(w, h) * 0.065;

      // Lunar Outer Glow
      const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.2, moonX, moonY, moonRadius * 2.8);
      moonGlow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      moonGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.15)');
      moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Moon Disc
      ctx.fillStyle = '#fef9c3';
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();

      // Moon craters / details
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(moonX - moonRadius * 0.3, moonY - moonRadius * 0.2, moonRadius * 0.25, 0, Math.PI * 2);
      ctx.arc(moonX + moonRadius * 0.35, moonY + moonRadius * 0.25, moonRadius * 0.3, 0, Math.PI * 2);
      ctx.arc(moonX + moonRadius * 0.1, moonY - moonRadius * 0.4, moonRadius * 0.18, 0, Math.PI * 2);
      ctx.fill();

      // 4. Distant Parallax City Skyline & Mountains
      cityOffset = (cityOffset + speedMultiplier * 0.12) % 360;
      ctx.fillStyle = '#170f30';
      const buildingWidth = 45;
      for (let bx = -buildingWidth; bx < w + buildingWidth; bx += buildingWidth) {
        const heightIdx = Math.abs(Math.sin((bx + cityOffset * 0.5) * 0.02)) * 60 + 35;
        ctx.fillRect(bx - (cityOffset % buildingWidth), horizonY - heightIdx, buildingWidth - 4, heightIdx);
        // Small glowing windows
        ctx.fillStyle = 'rgba(251, 191, 36, 0.5)';
        for (let wy = horizonY - heightIdx + 8; wy < horizonY - 10; wy += 14) {
          if (Math.sin(bx + wy) > 0.1) {
            ctx.fillRect(bx - (cityOffset % buildingWidth) + 8, wy, 4, 6);
            ctx.fillRect(bx - (cityOffset % buildingWidth) + 20, wy, 4, 6);
          }
        }
        ctx.fillStyle = '#170f30';
      }

      // 5. Roadside Tree Silhouettes
      treeOffset = (treeOffset + speedMultiplier * 0.4) % 180;
      ctx.fillStyle = '#0f0822';
      for (let tx = -80; tx < w + 80; tx += 90) {
        const xPos = tx - (treeOffset % 90);
        ctx.beginPath();
        ctx.moveTo(xPos, horizonY);
        ctx.lineTo(xPos + 18, horizonY - 45);
        ctx.lineTo(xPos + 36, horizonY);
        ctx.fill();
      }

      // 6. Realistic Dark Asphalt Highway Road
      const roadGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      roadGrad.addColorStop(0, '#151520');
      roadGrad.addColorStop(0.3, '#1a1a26');
      roadGrad.addColorStop(1, '#0e0e17');
      ctx.fillStyle = roadGrad;
      ctx.fillRect(0, horizonY, w, h - horizonY);

      // Road shoulder & guardrails
      ctx.fillStyle = '#2d2d3f';
      ctx.fillRect(0, horizonY, w, 6); // distant curb

      // 7. Dynamic Scrolling Center Dashed Lines (Yellow / White Road Markings)
      roadOffset = (roadOffset + speedMultiplier * 2.5) % 120;
      const centerY = horizonY + (h - horizonY) * 0.58;

      ctx.save();
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
      ctx.shadowBlur = 8;
      const dashLength = 65;
      const gapLength = 55;
      const totalDashUnit = dashLength + gapLength;

      for (let dx = -totalDashUnit; dx < w + totalDashUnit; dx += totalDashUnit) {
        const currentX = dx - (roadOffset % totalDashUnit);
        ctx.fillRect(currentX, centerY - 2, dashLength, 5);
      }
      ctx.restore();

      // 8. Overhead Highway Streetlamps (Passing by with warm light pool)
      lampOffset = (lampOffset + speedMultiplier * 1.8) % 450;
      for (let lx = -450; lx < w + 450; lx += 450) {
        const lampX = lx - (lampOffset % 450);

        // Curved steel lamp pole
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(lampX, horizonY + 20);
        ctx.lineTo(lampX, horizonY - 80);
        ctx.quadraticCurveTo(lampX, horizonY - 110, lampX + 35, horizonY - 110);
        ctx.stroke();

        // Glowing lamp head
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(lampX + 35, horizonY - 110, 5, 0, Math.PI * 2);
        ctx.fill();

        // Streetlight Light Cone cast down onto the road
        const coneGrad = ctx.createRadialGradient(
          lampX + 35,
          horizonY + 80,
          10,
          lampX + 35,
          horizonY + 80,
          160
        );
        coneGrad.addColorStop(0, 'rgba(254, 240, 138, 0.22)');
        coneGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.08)');
        coneGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.ellipse(lampX + 35, horizonY + 80, 130, 45, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // 9. Forward Headlight Beam from the Vehicle
      const vehicleBaseX = w * 0.42;
      const vehicleBaseY = horizonY + (h - horizonY) * 0.48;

      const beamGrad = ctx.createRadialGradient(
        vehicleBaseX + 180,
        vehicleBaseY + 15,
        15,
        vehicleBaseX + 280,
        vehicleBaseY + 15,
        280
      );
      beamGrad.addColorStop(0, isHornActive ? 'rgba(255, 255, 255, 0.75)' : 'rgba(254, 240, 138, 0.45)');
      beamGrad.addColorStop(0.6, 'rgba(251, 191, 36, 0.15)');
      beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(vehicleBaseX + 80, vehicleBaseY);
      ctx.lineTo(vehicleBaseX + 420, vehicleBaseY - 40);
      ctx.lineTo(vehicleBaseX + 440, vehicleBaseY + 70);
      ctx.closePath();
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [selectedVehicle, speedMultiplier, isHornActive]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#070414',
        color: '#fff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* STAGE 1: VEHICLE SELECTION ("Kese jaana chahte ho?") */}
      <AnimatePresence>
        {!selectedVehicle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 120,
              background: 'radial-gradient(circle at center, #1e1136 0%, #0d071a 75%, #05030a 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              overflowY: 'auto',
            }}
          >
            {/* Top Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.25), rgba(251, 191, 36, 0.25))',
                border: '1.5px solid rgba(251, 191, 36, 0.6)',
                borderRadius: '25px',
                padding: '6px 18px',
                color: '#fef08a',
                fontSize: '0.88rem',
                fontWeight: 700,
                marginBottom: '14px',
              }}
            >
              <span>🌙 Midnight Special Feature</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                fontWeight: 800,
                textAlign: 'center',
                margin: '0 0 10px 0',
                background: 'linear-gradient(135deg, #fff, #ffd1dc, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Sameeksha, Chalo Long Drive Pe Chalein! 🚗 🏍️ ✨
            </h1>

            <p
              style={{
                fontSize: '1rem',
                color: '#fda4af',
                maxWidth: '560px',
                textAlign: 'center',
                lineHeight: 1.5,
                marginBottom: '26px',
              }}
            >
              Pehle batao, Harshit ke saath aaj raat ka safar kisse tai karna chahti ho?
            </p>

            {/* 3 Interactive Realistic Vehicle Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '18px',
                width: '100%',
                maxWidth: '960px',
                marginBottom: '28px',
              }}
            >
              {VEHICLES.map((v) => (
                <motion.div
                  key={v.id}
                  whileHover={{ scale: 1.04, y: -6 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelectVehicle(v.id)}
                  style={{
                    background: v.bgGradient,
                    border: '1.5px solid rgba(251, 191, 36, 0.5)',
                    borderRadius: '24px',
                    padding: '24px 20px',
                    cursor: 'pointer',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(251, 191, 36, 0.2)',
                    backdropFilter: 'blur(12px)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(251, 191, 36, 0.2)',
                      border: '1px solid rgba(251, 191, 36, 0.5)',
                      color: '#fef08a',
                      borderRadius: '12px',
                      padding: '2px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    {v.badge}
                  </div>

                  <div style={{ fontSize: '3.6rem', marginBottom: '10px' }}>{v.emoji}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fef08a', margin: '0 0 6px 0' }}>
                    {v.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, marginBottom: '10px' }}>
                    {v.vibe}
                  </div>
                  <p style={{ fontSize: '0.86rem', color: '#ffd1dc', lineHeight: 1.45, margin: '0 0 18px 0' }}>
                    "{v.subtitle}"
                  </p>

                  <button
                    type="button"
                    style={{
                      marginTop: 'auto',
                      background: 'linear-gradient(135deg, #f43f5e, #fbbf24)',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '10px 22px',
                      color: '#fff',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(244, 63, 94, 0.4)',
                    }}
                  >
                    Yeh Ride Choose Karo 💖
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Back to Ending Scene */}
            <button
              type="button"
              onClick={() => setScene(6)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'rgba(255, 255, 255, 0.75)',
                borderRadius: '20px',
                padding: '8px 20px',
                fontSize: '0.86rem',
                cursor: 'pointer',
              }}
            >
              ← Back to Finale Universe
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2: LIVE SIMULATION - CANVAS ROAD & DYNAMIC VEHICLE GRAPHICS */}
      {selectedVehicle && (
        <>
          {/* Parallax Highway Canvas */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          />

          {/* TOP HUD: Header & Quick Actions */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              right: '16px',
              zIndex: 30,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              pointerEvents: 'none',
            }}
          >
            {/* Title & Speed Display */}
            <div
              style={{
                pointerEvents: 'auto',
                background: 'rgba(17, 12, 34, 0.88)',
                border: '1.5px solid rgba(251, 191, 36, 0.55)',
                borderRadius: '20px',
                padding: '6px 16px',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>
                {selectedVehicle === 'bike' ? '🏍️' : selectedVehicle === 'car' ? '🚗' : '🚶‍♂️🚶‍♀️'}
              </span>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#fef08a' }}>
                  {selectedVehicle === 'bike'
                    ? 'Royal Enfield Bullet 350'
                    : selectedVehicle === 'car'
                    ? 'BMW M Convertible'
                    : 'Midnight Romantic Walk'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
                  ⚡ Speed: {currentSpeedKm} km/h • Harshit & Sameeksha
                </div>
              </div>
            </div>

            {/* Right Buttons: Change Ride & Exit */}
            <div style={{ pointerEvents: 'auto', display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSelectedVehicle(null)}
                style={{
                  background: 'rgba(251, 191, 36, 0.2)',
                  border: '1.5px solid rgba(251, 191, 36, 0.65)',
                  color: '#fef08a',
                  borderRadius: '18px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                }}
              >
                🔄 Switch Ride
              </button>
              <button
                type="button"
                onClick={() => setScene(6)}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  borderRadius: '18px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                }}
              >
                ✕ Exit
              </button>
            </div>
          </div>

          {/* VEHICLE & CHARACTERS GRAPHIC (Harshit & Sameeksha Together!) */}
          <div
            style={{
              position: 'absolute',
              bottom: '15vh',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.85))',
            }}
          >
            {/* 1. ROYAL ENFIELD BULLET (Harshit driving, Sameeksha holding tightly from behind!) */}
            {selectedVehicle === 'bike' && (
              <motion.div
                animate={{
                  y: [0, -3, 0],
                  rotate: [0, 0.4, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: speedMode === 'fast' ? 0.18 : 0.28,
                  ease: 'easeInOut',
                }}
                style={{ position: 'relative', width: '320px', height: '210px' }}
              >
                {/* SVG Royal Enfield Bullet with Couple */}
                <svg viewBox="0 0 340 220" width="320" height="210">
                  <defs>
                    <linearGradient id="bulletChrome" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="50%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                    <linearGradient id="tankBlack" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="60%" stopColor="#0f172a" />
                      <stop offset="100%" stopColor="#020617" />
                    </linearGradient>
                  </defs>

                  {/* Rear Wheel & Chrome Spokes */}
                  <g className="bike-wheel-rear">
                    <circle cx="65" cy="165" r="42" fill="none" stroke="#1e293b" strokeWidth="12" />
                    <circle cx="65" cy="165" r="36" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle cx="65" cy="165" r="10" fill="url(#bulletChrome)" />
                    {/* Spokes */}
                    <line x1="65" y1="129" x2="65" y2="201" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="29" y1="165" x2="101" y2="165" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="40" y1="140" x2="90" y2="190" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="40" y1="190" x2="90" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                  </g>

                  {/* Front Wheel & Chrome Spokes */}
                  <g className="bike-wheel-front">
                    <circle cx="265" cy="165" r="42" fill="none" stroke="#1e293b" strokeWidth="12" />
                    <circle cx="265" cy="165" r="36" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle cx="265" cy="165" r="10" fill="url(#bulletChrome)" />
                    {/* Spokes */}
                    <line x1="265" y1="129" x2="265" y2="201" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="229" y1="165" x2="301" y2="165" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="240" y1="140" x2="290" y2="190" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="240" y1="190" x2="290" y2="140" stroke="#94a3b8" strokeWidth="1.5" />
                  </g>

                  {/* Chrome Exhaust Silencer */}
                  <path d="M 125 160 L 22 174 L 18 168 L 125 152 Z" fill="url(#bulletChrome)" stroke="#475569" strokeWidth="1.5" />

                  {/* Bullet Heavy Engine Block & Cooling Fins */}
                  <rect x="110" y="130" width="58" height="42" rx="6" fill="#1e293b" stroke="url(#bulletChrome)" strokeWidth="2" />
                  <line x1="110" y1="138" x2="168" y2="138" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="110" y1="146" x2="168" y2="146" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="110" y1="154" x2="168" y2="154" stroke="#94a3b8" strokeWidth="1.5" />
                  <circle cx="138" cy="158" r="9" fill="url(#bulletChrome)" />

                  {/* Classic Bullet Teardrop Fuel Tank with Gold Pin */}
                  <path d="M 160 115 C 175 92, 225 96, 230 120 C 215 130, 175 130, 160 115 Z" fill="url(#tankBlack)" stroke="#fbbf24" strokeWidth="2" />
                  <text x="180" y="116" fill="#fbbf24" fontSize="6" fontWeight="bold">ENFIELD</text>

                  {/* Front Telescopic Forks */}
                  <line x1="265" y1="165" x2="238" y2="95" stroke="url(#bulletChrome)" strokeWidth="5" />

                  {/* Chrome Round Headlight */}
                  <circle cx="250" cy="98" r="11" fill="url(#bulletChrome)" />
                  <circle cx="253" cy="98" r="8" fill="#fef08a" />

                  {/* Chrome Handlebar */}
                  <path d="M 235 94 L 215 78 L 205 82" fill="none" stroke="url(#bulletChrome)" strokeWidth="4" strokeLinecap="round" />

                  {/* Dual Stepped Touring Seat */}
                  <path d="M 85 125 C 105 120, 130 116, 170 122 C 160 134, 90 138, 85 125 Z" fill="#0f172a" stroke="#334155" strokeWidth="2" />

                  {/* --- SAMEEKSHA SITTING ON PILLION (Back Rider) --- */}
                  <g className="sameeksha-rider">
                    {/* Legs wrapped alongside bike */}
                    <path d="M 105 124 Q 120 145 130 162" fill="none" stroke="#3b82f6" strokeWidth="9" strokeLinecap="round" />
                    {/* Torso leaning forward hugging Harshit */}
                    <path d="M 100 118 Q 112 85 125 72" fill="none" stroke="#ec4899" strokeWidth="16" strokeLinecap="round" />
                    {/* Arms wrapping around Harshit's waist */}
                    <path d="M 120 80 Q 140 85 158 92" fill="none" stroke="#ec4899" strokeWidth="8" strokeLinecap="round" />
                    {/* Sameeksha Head & Cute Hair flowing in wind */}
                    <circle cx="126" cy="58" r="14" fill="#fed7aa" />
                    {/* Flowing Long Hair in the wind */}
                    <path d="M 120 52 C 100 50, 70 60, 55 75 C 75 70, 105 64, 118 64 Z" fill="#451a03" />
                    {/* Red Bindi / Sweet Smile */}
                    <circle cx="132" cy="56" r="1.5" fill="#f43f5e" />
                    <path d="M 130 63 Q 134 66 137 63" fill="none" stroke="#e11d48" strokeWidth="1.2" />
                  </g>

                  {/* --- HARSHIT DRIVING IN FRONT --- */}
                  <g className="harshit-driver">
                    {/* Torso & Jacket */}
                    <path d="M 145 122 Q 155 86 172 70" fill="none" stroke="#1e293b" strokeWidth="20" strokeLinecap="round" />
                    {/* Arms holding the handlebar */}
                    <path d="M 166 76 L 210 82" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
                    {/* Hands on handlebar */}
                    <circle cx="210" cy="82" r="5" fill="#fed7aa" />
                    {/* Harshit Head & Hair */}
                    <circle cx="178" cy="52" r="15" fill="#fed7aa" />
                    <path d="M 166 48 C 172 35, 190 35, 194 48 C 188 44, 172 44, 166 48 Z" fill="#1e1b4b" />
                    {/* Confident Smile & Eyes */}
                    <circle cx="184" cy="50" r="1.8" fill="#0f172a" />
                    <path d="M 182 57 Q 186 60 190 57" fill="none" stroke="#0f172a" strokeWidth="1.4" />
                  </g>
                </svg>
              </motion.div>
            )}

            {/* 2. LUXURY BMW CONVERTIBLE (Harshit & Sameeksha Sitting Together Inside!) */}
            {selectedVehicle === 'car' && (
              <motion.div
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: speedMode === 'fast' ? 0.16 : 0.24,
                  ease: 'easeInOut',
                }}
                style={{ position: 'relative', width: '370px', height: '175px' }}
              >
                <svg viewBox="0 0 400 190" width="370" height="175">
                  <defs>
                    <linearGradient id="bmwBody" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1e3a8a" />
                      <stop offset="50%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient id="bmwRim" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="50%" stopColor="#64748b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                  </defs>

                  {/* Rear Wheel */}
                  <g className="car-wheel-rear">
                    <circle cx="85" cy="148" r="32" fill="#0f172a" stroke="#334155" strokeWidth="6" />
                    <circle cx="85" cy="148" r="23" fill="url(#bmwRim)" />
                    <circle cx="85" cy="148" r="7" fill="#38bdf8" />
                  </g>

                  {/* Front Wheel */}
                  <g className="car-wheel-front">
                    <circle cx="315" cy="148" r="32" fill="#0f172a" stroke="#334155" strokeWidth="6" />
                    <circle cx="315" cy="148" r="23" fill="url(#bmwRim)" />
                    <circle cx="315" cy="148" r="7" fill="#38bdf8" />
                  </g>

                  {/* Sleek Aerodynamic BMW Body */}
                  <path
                    d="M 30 140 L 45 110 Q 75 92 135 92 L 235 92 Q 275 92 315 110 L 375 125 Q 385 135 385 145 L 30 145 Z"
                    fill="url(#bmwBody)"
                    stroke="#60a5fa"
                    strokeWidth="2"
                  />

                  {/* BMW Sleek Windshield */}
                  <path d="M 235 92 L 285 55 L 298 56 L 265 92 Z" fill="rgba(191, 219, 254, 0.45)" stroke="#93c5fd" strokeWidth="2" />

                  {/* Interior Dashboard & Steering Wheel */}
                  <rect x="140" y="86" width="115" height="15" rx="4" fill="#090d16" />
                  {/* Steering wheel */}
                  <circle cx="260" cy="74" r="11" fill="none" stroke="#cbd5e1" strokeWidth="3" />

                  {/* --- SAMEEKSHA SITTING IN PASSENGER SEAT --- */}
                  <g className="sameeksha-car">
                    <circle cx="190" cy="62" r="14" fill="#fed7aa" />
                    {/* Hair flowing back */}
                    <path d="M 185 55 C 165 52, 145 60, 130 75 C 150 70, 175 64, 185 64 Z" fill="#451a03" />
                    <circle cx="195" cy="60" r="1.5" fill="#f43f5e" />
                    <path d="M 193 66 Q 197 69 200 66" fill="none" stroke="#e11d48" strokeWidth="1.2" />
                    {/* Pink outfit */}
                    <path d="M 175 76 L 205 76 L 208 92 L 172 92 Z" fill="#ec4899" />
                  </g>

                  {/* --- HARSHIT SITTING IN DRIVER SEAT --- */}
                  <g className="harshit-car">
                    <circle cx="238" cy="58" r="15" fill="#fed7aa" />
                    <path d="M 226 54 C 232 40, 250 40, 254 54 C 248 50, 232 50, 226 54 Z" fill="#1e1b4b" />
                    <circle cx="244" cy="56" r="1.8" fill="#0f172a" />
                    <path d="M 242 63 Q 246 66 250 63" fill="none" stroke="#0f172a" strokeWidth="1.4" />
                    {/* Blue jacket */}
                    <path d="M 220 74 L 255 74 L 258 92 L 218 92 Z" fill="#1e293b" />
                    {/* Hand on steering wheel */}
                    <line x1="240" y1="78" x2="258" y2="76" stroke="#fed7aa" strokeWidth="5" strokeLinecap="round" />
                  </g>

                  {/* Iconic BMW Twin Kidney Grille */}
                  <rect x="368" y="128" width="8" height="12" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
                  <rect x="378" y="128" width="8" height="12" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />

                  {/* Angel-eye Headlights */}
                  <circle cx="360" cy="122" r="6" fill="#38bdf8" />
                  <circle cx="360" cy="122" r="3" fill="#ffffff" />
                </svg>
              </motion.div>
            )}

            {/* 3. ROMANTIC MIDNIGHT WALK (Holding Hands Under The Stars) */}
            {selectedVehicle === 'pedal' && (
              <motion.div
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.65,
                  ease: 'easeInOut',
                }}
                style={{ position: 'relative', width: '220px', height: '190px' }}
              >
                <svg viewBox="0 0 220 200" width="220" height="190">
                  {/* Pavement walk line */}
                  <line x1="10" y1="185" x2="210" y2="185" stroke="#475569" strokeWidth="4" />

                  {/* Harshit (Left) */}
                  <g>
                    {/* Head */}
                    <circle cx="85" cy="55" r="16" fill="#fed7aa" />
                    <path d="M 72 50 C 78 35, 98 35, 102 50 Z" fill="#1e1b4b" />
                    {/* Torso */}
                    <rect x="73" y="72" width="24" height="48" rx="6" fill="#1e293b" />
                    {/* Legs */}
                    <line x1="78" y1="120" x2="74" y2="182" stroke="#334155" strokeWidth="7" strokeLinecap="round" />
                    <line x1="92" y1="120" x2="96" y2="182" stroke="#334155" strokeWidth="7" strokeLinecap="round" />
                  </g>

                  {/* Sameeksha (Right) */}
                  <g>
                    {/* Head & Long Hair */}
                    <circle cx="135" cy="62" r="15" fill="#fed7aa" />
                    <path d="M 124 56 C 110 50, 100 70, 95 85 C 108 80, 120 72, 130 72 Z" fill="#451a03" />
                    <circle cx="140" cy="60" r="1.5" fill="#f43f5e" />
                    {/* Dress */}
                    <path d="M 126 78 L 144 78 L 152 135 L 118 135 Z" fill="#ec4899" />
                    {/* Legs */}
                    <line x1="128" y1="135" x2="125" y2="182" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
                    <line x1="142" y1="135" x2="145" y2="182" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
                  </g>

                  {/* Holding Hands in the Center! ❤️ */}
                  <path d="M 92 88 Q 110 115 128 94" fill="none" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="110" cy="108" r="4" fill="#f43f5e" />
                </svg>
              </motion.div>
            )}
          </div>

          {/* BOTTOM CONTROLS & ROMANTIC DIALOGUES */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {/* Dynamic Love Dialogue Ticker */}
            <motion.div
              key={quoteIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'rgba(15, 10, 30, 0.9)',
                border: '1.5px solid rgba(251, 191, 36, 0.65)',
                borderRadius: '24px',
                padding: '8px 22px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
                textAlign: 'center',
                maxWidth: '92vw',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span style={{ color: '#fef08a', fontWeight: 700, fontSize: '0.88rem' }}>
                {ROMANTIC_QUOTES[quoteIdx].speaker}:
              </span>{' '}
              <span style={{ color: '#fda4af', fontSize: '0.86rem', fontStyle: 'italic' }}>
                "{ROMANTIC_QUOTES[quoteIdx].text}"
              </span>
            </motion.div>

            {/* Interactive Driving Toolbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                background: 'rgba(17, 12, 34, 0.94)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '30px',
                padding: '6px 16px',
                backdropFilter: 'blur(14px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              }}
            >
              {/* Horn Button */}
              <motion.button
                type="button"
                onClick={handleHorn}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  background: isHornActive
                    ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                    : 'linear-gradient(135deg, #f43f5e, #ec4899)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  color: '#fff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(244, 63, 94, 0.4)',
                }}
              >
                <span>🔊</span>
                <span>{selectedVehicle === 'bike' ? 'Pip-Pip Horn!' : 'Honk Horn!'}</span>
              </motion.button>

              {/* Speed Mode Selectors */}
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(0, 0, 0, 0.45)',
                  borderRadius: '20px',
                  padding: '3px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {(['slow', 'medium', 'fast'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSpeedMode(m)}
                    style={{
                      background: speedMode === m ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                      border: 'none',
                      borderRadius: '16px',
                      padding: '5px 12px',
                      color: speedMode === m ? '#fff' : 'rgba(255, 255, 255, 0.65)',
                      fontSize: '0.74rem',
                      fontWeight: speedMode === m ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {m === 'slow' ? 'Chill 40' : m === 'medium' ? 'Cruise 75' : 'Speed 115'}
                  </button>
                ))}
              </div>

              {/* Music indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#fef08a',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                }}
              >
                <span>🎵 Playing: Mika Singh - "Long Drive"</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LongDriveScene;
