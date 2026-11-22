import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import { getAssetUrl } from '../../utils/assets';
import { soundManager } from '../../utils/audio';

type VehicleType = 'bike' | 'car' | 'pedal';
type SpeedSetting = 30 | 60 | 100;

interface RoadSong {
  id: string;
  title: string;
  artist: string;
  startSec: number;
}

// Dedicated Long Drive Road-Trip Playlist! (1st song: Mika Singh's "Long Drive")
const LONG_DRIVE_PLAYLIST: RoadSong[] = [
  { id: 'party-long-drive', title: 'Long Drive (Khiladi 786)', artist: 'Mika Singh', startSec: 0 },
  { id: 'party-desi-boyz', title: 'Make Some Noise For The Desi Boyz', artist: 'KK & Pritam', startSec: 0 },
  { id: 'punjabi-daru-badnaam', title: 'Daru Badnaam', artist: 'Param Singh & Kamal Kahlon', startSec: 0 },
  { id: 'party-hookah-bar', title: 'Hookah Bar', artist: 'Himesh Reshammiya', startSec: 0 },
  { id: 'party-subha-hone-na-de', title: 'Subha Hone Na De (Tu Mera Hero)', artist: 'Mika Singh', startSec: 0 },
  { id: 'punjabi-mauja-hi-mauja', title: 'Mauja Hi Mauja', artist: 'Mika Singh', startSec: 0 },
  { id: 'party-angreji-beat', title: 'Angreji Beat', artist: 'Gippy Grewal & Honey Singh', startSec: 0 },
  { id: 'retro-gulabi-aankhen', title: 'Gulabi Aankhen', artist: 'Mohammed Rafi', startSec: 0 },
  { id: 'retro-o-mere-dil-ke-chain', title: 'O Mere Dil Ke Chain', artist: 'Kishore Kumar', startSec: 0 },
];

const ROMANTIC_QUOTES = [
  { speaker: 'Harshit', text: 'Haath acche se pakad ke rakhna Sameeksha, thandi hawa chal rahi hai... ❤️' },
  { speaker: 'Sameeksha', text: 'Kabhi nahi chhodungi Harshit... Bas gaadi chalate raho, ye safar kabhi khatam na ho ✨' },
  { speaker: 'Harshit', text: 'Tumhare saath har rasta jannat jaisa lagta hai meri jaan... 🌙' },
  { speaker: 'Sameeksha', text: 'Long drive pe tum aur main... isse pyara birthday gift kuch nahi ho sakta 💕' },
  { speaker: 'Harshit', text: 'Chahe Bullet ho, BMW ho ya paidal... meri manzil hamesha tum hi ho 🌹' },
  { speaker: 'Sameeksha', text: 'Tumhare kandhe pe sar rakh kar thandi hawa mehsoos karna sabse pyara sukoon hai 🥰' },
  { speaker: 'Harshit', text: 'Aapki ye pyari si muskaan meri poori duniya roshan kar deti hai Sameeksha 💫' },
];

const LongDriveScene: React.FC = () => {
  const setScene = useExperienceStore((s) => s.setScene);

  // Vehicle & Speed states (Speeds: explicitly 30, 60, 100 km/h as requested)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('bike');
  const [speedKm, setSpeedKm] = useState<SpeedSetting>(60);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [isHornActive, setIsHornActive] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  // Dedicated Road Playlist State
  const [currentSongIdx, setCurrentSongIdx] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Get Sameeksha's actual photo
  const sameekshaPhotoUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sameeksha_custom_photos');
        if (saved) {
          const list = JSON.parse(saved);
          if (list.length > 0 && list[0].src) {
            return list[0].src.startsWith('data:') ? list[0].src : getAssetUrl(list[0].src);
          }
        }
      } catch {}
    }
    return getAssetUrl(content.photos[0]?.src || '/images/IMG-20250423-WA0001.jpg');
  }, []);

  // 1. Play 1st Song: Mika Singh's "Long Drive" on mount
  useEffect(() => {
    soundManager.initCtx();
    const song = LONG_DRIVE_PLAYLIST[currentSongIdx];
    soundManager.playTrack(song.id, song.startSec);
    setIsPlayingMusic(true);
  }, [currentSongIdx]);

  // Handle Next Song in dedicated road playlist
  const handleNextSong = () => {
    soundManager.playTwinkle();
    setCurrentSongIdx((prev) => (prev + 1) % LONG_DRIVE_PLAYLIST.length);
  };

  const handlePrevSong = () => {
    soundManager.playTwinkle();
    setCurrentSongIdx((prev) => (prev - 1 + LONG_DRIVE_PLAYLIST.length) % LONG_DRIVE_PLAYLIST.length);
  };

  const handleTogglePlay = () => {
    soundManager.toggleAmbient();
    setIsPlayingMusic((p) => !p);
  };

  // 2. Cycle romantic thoughts ticker
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % ROMANTIC_QUOTES.length);
    }, 6000);
    return () => clearInterval(quoteInterval);
  }, []);

  // 3. Mid-way Vehicle Switcher Handler
  const handleSwitchVehicle = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle);
    soundManager.initCtx();
    if (vehicle === 'bike') {
      soundManager.playEngineRev('bike');
    } else if (vehicle === 'car') {
      soundManager.playEngineRev('car');
    } else {
      soundManager.playTwinkle();
    }
  };

  // 4. Horn sound
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

  // End Driving Trigger
  const handleEndDriving = () => {
    soundManager.playPopperCannonSound();
    setShowEndModal(true);
  };

  // Speed multiplier for canvas parallax
  const speedMultiplier = useMemo(() => {
    if (speedKm === 30) return 4.5;
    if (speedKm === 60) return 9.0;
    return 15.5; // 100 km/h
  }, [speedKm]);

  // 5. 60 FPS Canvas Highway Environment Engine
  useEffect(() => {
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

    // Fixed Stars
    const stars: Array<{ x: number; y: number; r: number; alpha: number }> = [];
    for (let i = 0; i < 110; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.52),
        r: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
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

      // Sky: Deep Midnight Nebula Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, '#04020a');
      skyGrad.addColorStop(0.4, '#0f0822');
      skyGrad.addColorStop(0.8, '#1e1136');
      skyGrad.addColorStop(1, '#2c184d');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizonY);

      // Stars
      stars.forEach((s) => {
        const twinkle = Math.sin(time * 3 + s.x) * 0.25;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.15, s.alpha + twinkle)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Realistic Moon with Lunar Haze
      const moonX = w * 0.84;
      const moonY = h * 0.17;
      const moonRadius = Math.min(w, h) * 0.062;

      const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.3, moonX, moonY, moonRadius * 3.2);
      moonGlow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      moonGlow.addColorStop(0.4, 'rgba(251, 191, 36, 0.15)');
      moonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Moon Body
      ctx.fillStyle = '#fef9c3';
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(moonX - moonRadius * 0.25, moonY - moonRadius * 0.2, moonRadius * 0.24, 0, Math.PI * 2);
      ctx.arc(moonX + moonRadius * 0.32, moonY + moonRadius * 0.25, moonRadius * 0.28, 0, Math.PI * 2);
      ctx.arc(moonX + moonRadius * 0.08, moonY - moonRadius * 0.35, moonRadius * 0.16, 0, Math.PI * 2);
      ctx.fill();

      // Distant Parallax City Skyline & Mountains
      cityOffset = (cityOffset + speedMultiplier * 0.12) % 360;
      ctx.fillStyle = '#170f30';
      const bWidth = 48;
      for (let bx = -bWidth; bx < w + bWidth; bx += bWidth) {
        const heightIdx = Math.abs(Math.sin((bx + cityOffset * 0.6) * 0.02)) * 65 + 35;
        ctx.fillRect(bx - (cityOffset % bWidth), horizonY - heightIdx, bWidth - 4, heightIdx);
        // Illuminated window dots
        ctx.fillStyle = 'rgba(251, 191, 36, 0.55)';
        for (let wy = horizonY - heightIdx + 10; wy < horizonY - 8; wy += 14) {
          if (Math.sin(bx + wy) > 0.05) {
            ctx.fillRect(bx - (cityOffset % bWidth) + 8, wy, 4, 6);
            ctx.fillRect(bx - (cityOffset % bWidth) + 24, wy, 4, 6);
          }
        }
        ctx.fillStyle = '#170f30';
      }

      // Roadside Silhouetted Trees
      treeOffset = (treeOffset + speedMultiplier * 0.38) % 180;
      ctx.fillStyle = '#0c061a';
      for (let tx = -80; tx < w + 80; tx += 90) {
        const xPos = tx - (treeOffset % 90);
        ctx.beginPath();
        ctx.moveTo(xPos, horizonY);
        ctx.lineTo(xPos + 20, horizonY - 48);
        ctx.lineTo(xPos + 40, horizonY);
        ctx.fill();
      }

      // Realistic Dark Asphalt Highway
      const roadGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      roadGrad.addColorStop(0, '#151520');
      roadGrad.addColorStop(0.25, '#181824');
      roadGrad.addColorStop(1, '#0c0c14');
      ctx.fillStyle = roadGrad;
      ctx.fillRect(0, horizonY, w, h - horizonY);

      // Road shoulder & guardrail base
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, horizonY, w, 7);

      // Highway Guardrails & Amber Reflectors (Cat's Eyes)
      const reflectorUnit = 120;
      const refOffset = (roadOffset + speedMultiplier * 2.5) % reflectorUnit;
      for (let rx = -reflectorUnit; rx < w + reflectorUnit; rx += reflectorUnit) {
        const rPos = rx - refOffset;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(rPos, horizonY + 5, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Scrolling Center Highway Lines (Bright Dashed White & Yellow Lines)
      roadOffset = (roadOffset + speedMultiplier * 2.5) % 130;
      const centerY = horizonY + (h - horizonY) * 0.58;

      ctx.save();
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = 'rgba(251, 191, 36, 0.7)';
      ctx.shadowBlur = 10;
      const dashLength = 70;
      const gapLength = 60;
      const totalDashUnit = dashLength + gapLength;

      for (let dx = -totalDashUnit; dx < w + totalDashUnit; dx += totalDashUnit) {
        const currentX = dx - (roadOffset % totalDashUnit);
        ctx.fillRect(currentX, centerY - 2, dashLength, 5);
      }
      ctx.restore();

      // Overhead Curved Highway Streetlamps with Dynamic Amber Light Pools
      lampOffset = (lampOffset + speedMultiplier * 1.8) % 460;
      for (let lx = -460; lx < w + 460; lx += 460) {
        const lampX = lx - (lampOffset % 460);

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(lampX, horizonY + 25);
        ctx.lineTo(lampX, horizonY - 85);
        ctx.quadraticCurveTo(lampX, horizonY - 118, lampX + 40, horizonY - 118);
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(lampX + 40, horizonY - 118, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Warm light cone cast on road
        const coneGrad = ctx.createRadialGradient(
          lampX + 40,
          horizonY + 80,
          10,
          lampX + 40,
          horizonY + 80,
          170
        );
        coneGrad.addColorStop(0, 'rgba(254, 240, 138, 0.25)');
        coneGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.08)');
        coneGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.ellipse(lampX + 40, horizonY + 80, 140, 50, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Forward Headlight Beam from Vehicle
      const vehicleBaseX = w * 0.44;
      const vehicleBaseY = horizonY + (h - horizonY) * 0.48;

      const beamGrad = ctx.createRadialGradient(
        vehicleBaseX + 190,
        vehicleBaseY + 15,
        15,
        vehicleBaseX + 300,
        vehicleBaseY + 15,
        300
      );
      beamGrad.addColorStop(0, isHornActive ? 'rgba(255, 255, 255, 0.85)' : 'rgba(254, 240, 138, 0.5)');
      beamGrad.addColorStop(0.55, 'rgba(251, 191, 36, 0.16)');
      beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(vehicleBaseX + 90, vehicleBaseY);
      ctx.lineTo(vehicleBaseX + 450, vehicleBaseY - 45);
      ctx.lineTo(vehicleBaseX + 470, vehicleBaseY + 75);
      ctx.closePath();
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [speedMultiplier, isHornActive]);

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
      {/* 60 FPS Highway Canvas */}
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

      {/* TOP BAR: Couple Profile Card & Quick Vehicle Switcher (Mid-Way Option!) */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          right: '14px',
          zIndex: 40,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {/* Couple Profile Card with Real Photo of Sameeksha */}
        <div
          style={{
            background: 'rgba(17, 12, 34, 0.92)',
            border: '1.5px solid rgba(251, 191, 36, 0.6)',
            borderRadius: '24px',
            padding: '6px 14px',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
          }}
        >
          {/* Sameeksha's Real Photo Avatar */}
          <div style={{ position: 'relative' }}>
            <img
              src={sameekshaPhotoUrl}
              alt="Sameeksha"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #f43f5e',
                boxShadow: '0 0 10px rgba(244, 63, 94, 0.6)',
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                fontSize: '0.75rem',
              }}
            >
              💖
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#fef08a', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>Harshit 👑</span>
              <span style={{ color: '#f43f5e' }}>&</span>
              <span>Sameeksha 💖</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>
              Speed: {speedKm} km/h • {selectedVehicle === 'bike' ? 'Royal Enfield 350' : selectedVehicle === 'car' ? 'BMW M Convertible' : 'Romantic Stroll'}
            </div>
          </div>
        </div>

        {/* MID-WAY VEHICLE SWITCHER PILLS (Choose anytime while driving!) */}
        <div
          style={{
            background: 'rgba(17, 12, 34, 0.92)',
            border: '1.5px solid rgba(251, 191, 36, 0.5)',
            borderRadius: '25px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
          }}
        >
          <span style={{ fontSize: '0.72rem', color: '#fef08a', fontWeight: 700, paddingLeft: '6px' }}>
            Gaadi Change:
          </span>

          {/* Bullet 350 */}
          <button
            type="button"
            onClick={() => handleSwitchVehicle('bike')}
            style={{
              background: selectedVehicle === 'bike' ? 'linear-gradient(135deg, #f43f5e, #fbbf24)' : 'rgba(255, 255, 255, 0.08)',
              border: selectedVehicle === 'bike' ? '1.5px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              borderRadius: '16px',
              padding: '5px 12px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>🏍️</span>
            <span>Bullet 350</span>
          </button>

          {/* BMW Car */}
          <button
            type="button"
            onClick={() => handleSwitchVehicle('car')}
            style={{
              background: selectedVehicle === 'car' ? 'linear-gradient(135deg, #2563eb, #8b5cf6)' : 'rgba(255, 255, 255, 0.08)',
              border: selectedVehicle === 'car' ? '1.5px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              borderRadius: '16px',
              padding: '5px 12px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>🚗</span>
            <span>BMW Car</span>
          </button>

          {/* Walk / Pedal */}
          <button
            type="button"
            onClick={() => handleSwitchVehicle('pedal')}
            style={{
              background: selectedVehicle === 'pedal' ? 'linear-gradient(135deg, #10b981, #ec4899)' : 'rgba(255, 255, 255, 0.08)',
              border: selectedVehicle === 'pedal' ? '1.5px solid #34d399' : '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              borderRadius: '16px',
              padding: '5px 12px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>🚶‍♂️</span>
            <span>Walk</span>
          </button>
        </div>

        {/* End Driving Button (Triggers Tareef & Grand Birthday Finale) */}
        <motion.button
          type="button"
          onClick={handleEndDriving}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          style={{
            background: 'linear-gradient(135deg, #e11d48, #f59e0b)',
            border: '1.5px solid #fbbf24',
            color: '#fff',
            borderRadius: '20px',
            padding: '7px 16px',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(225, 29, 72, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🏁</span>
          <span>End Driving / Safar Khatam</span>
        </motion.button>
      </div>

      {/* DETAILED REALISTIC VEHICLE & CHARACTERS WITH REAL FACE & NAMES */}
      <div
        style={{
          position: 'absolute',
          bottom: '16vh',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 25,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.85))',
        }}
      >
        {/* 1. ROYAL ENFIELD BULLET 350 */}
        {selectedVehicle === 'bike' && (
          <motion.div
            animate={{
              y: [0, -3.5, 0],
              rotate: [0, 0.35, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: speedKm === 100 ? 0.15 : speedKm === 60 ? 0.24 : 0.36,
              ease: 'easeInOut',
            }}
            style={{ position: 'relative', width: '360px', height: '220px' }}
          >
            {/* Character Name & Portrait Badges floating above bike */}
            <div
              style={{
                position: 'absolute',
                top: '-18px',
                left: '70px',
                display: 'flex',
                gap: '24px',
                zIndex: 35,
              }}
            >
              {/* Sameeksha Badge with Real Photo */}
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.9)',
                  border: '1.5px solid #fef08a',
                  borderRadius: '16px',
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                }}
              >
                <img
                  src={sameekshaPhotoUrl}
                  alt="Sameeksha face"
                  style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span>Sameeksha 💖</span>
              </div>

              {/* Harshit Badge */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.9)',
                  border: '1.5px solid #38bdf8',
                  borderRadius: '16px',
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                }}
              >
                <span>Harshit 👑</span>
              </div>
            </div>

            {/* High-Fidelity Bullet 350 Vector Graphic */}
            <svg viewBox="0 0 380 230" width="360" height="220">
              <defs>
                <linearGradient id="bulletChromeHi" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#cbd5e1" />
                  <stop offset="70%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
                <linearGradient id="tankMetallic" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                <clipPath id="sameekshaFaceClip">
                  <circle cx="152" cy="62" r="14" />
                </clipPath>
              </defs>

              {/* Rear Wheel with Rotating Chrome Spokes */}
              <g>
                <circle cx="75" cy="172" r="44" fill="none" stroke="#0f172a" strokeWidth="13" />
                <circle cx="75" cy="172" r="37" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                <circle cx="75" cy="172" r="11" fill="url(#bulletChromeHi)" />
                {/* Cross Spokes */}
                <line x1="75" y1="135" x2="75" y2="209" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="38" y1="172" x2="112" y2="172" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="49" y1="146" x2="101" y2="198" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="49" y1="198" x2="101" y2="146" stroke="#94a3b8" strokeWidth="1.5" />
              </g>

              {/* Front Wheel with Rotating Chrome Spokes */}
              <g>
                <circle cx="295" cy="172" r="44" fill="none" stroke="#0f172a" strokeWidth="13" />
                <circle cx="295" cy="172" r="37" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                <circle cx="295" cy="172" r="11" fill="url(#bulletChromeHi)" />
                <line x1="295" y1="135" x2="295" y2="209" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="258" y1="172" x2="332" y2="172" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="269" y1="146" x2="321" y2="198" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="269" y1="198" x2="321" y2="146" stroke="#94a3b8" strokeWidth="1.5" />
              </g>

              {/* Long Chrome Upswept Silencer with Heat Shield */}
              <path d="M 145 168 L 28 184 L 24 176 L 145 160 Z" fill="url(#bulletChromeHi)" stroke="#475569" strokeWidth="1.5" />

              {/* Heavy 350cc Engine Block with Cooling Fins */}
              <rect x="130" y="136" width="65" height="46" rx="6" fill="#1e293b" stroke="url(#bulletChromeHi)" strokeWidth="2.5" />
              <line x1="130" y1="144" x2="195" y2="144" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="130" y1="152" x2="195" y2="152" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="130" y1="160" x2="195" y2="160" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="130" y1="168" x2="195" y2="168" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="162" cy="164" r="10" fill="url(#bulletChromeHi)" />

              {/* Classic Teardrop Bullet Fuel Tank with Double Gold Pinstripes */}
              <path d="M 185 120 C 200 95, 255 100, 260 126 C 245 136, 200 136, 185 120 Z" fill="url(#tankMetallic)" stroke="#fbbf24" strokeWidth="2.5" />
              <text x="202" y="122" fill="#fbbf24" fontSize="6.5" fontWeight="900" letterSpacing="0.5">ROYAL ENFIELD</text>

              {/* Front Telescopic Forks & Mudguard */}
              <line x1="295" y1="172" x2="265" y2="98" stroke="url(#bulletChromeHi)" strokeWidth="5.5" />
              <path d="M 270 140 Q 295 125 320 140" fill="none" stroke="#0f172a" strokeWidth="5" />

              {/* Round Chrome Headlamp */}
              <circle cx="278" cy="102" r="12" fill="url(#bulletChromeHi)" />
              <circle cx="282" cy="102" r="8.5" fill="#fef08a" />

              {/* High Chrome Handlebars with Grips & Mirror */}
              <path d="M 262 98 L 240 80 L 230 84" fill="none" stroke="url(#bulletChromeHi)" strokeWidth="4" strokeLinecap="round" />
              <circle cx="238" cy="74" r="4" fill="url(#bulletChromeHi)" />

              {/* Split Touring Seats */}
              <path d="M 105 132 C 125 126, 155 122, 195 128 C 185 140, 110 144, 105 132 Z" fill="#090d16" stroke="#334155" strokeWidth="2" />

              {/* --- SAMEEKSHA (Sitting behind Harshit, hugging him tightly!) --- */}
              <g>
                {/* Legs */}
                <path d="M 125 132 Q 142 155 152 172" fill="none" stroke="#3b82f6" strokeWidth="9" strokeLinecap="round" />
                {/* Torso leaning forward hugging Harshit */}
                <path d="M 122 126 Q 136 90 150 76" fill="none" stroke="#ec4899" strokeWidth="18" strokeLinecap="round" />
                {/* Arms wrapped tightly around Harshit's waist */}
                <path d="M 144 86 Q 165 92 184 98" fill="none" stroke="#ec4899" strokeWidth="8.5" strokeLinecap="round" />

                {/* Long Flowing Hair in the wind */}
                <path d="M 146 54 C 122 50, 85 64, 68 82 C 92 76, 126 68, 144 68 Z" fill="#3b1d11" />

                {/* Sameeksha's Real Face Photo embedded! */}
                <image
                  href={sameekshaPhotoUrl}
                  x="138"
                  y="48"
                  width="28"
                  height="28"
                  clipPath="url(#sameekshaFaceClip)"
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx="152" cy="62" r="14" fill="none" stroke="#f43f5e" strokeWidth="2" />
              </g>

              {/* --- HARSHIT (Driving in front) --- */}
              <g>
                {/* Leather Jacket Torso */}
                <path d="M 172 130 Q 182 92 200 75" fill="none" stroke="#1e293b" strokeWidth="22" strokeLinecap="round" />
                {/* Arms holding the handlebar */}
                <path d="M 194 82 L 236 88" fill="none" stroke="#1e293b" strokeWidth="11" strokeLinecap="round" />
                <circle cx="236" cy="88" r="5" fill="#fed7aa" />

                {/* Head & Hair */}
                <circle cx="206" cy="56" r="15" fill="#fed7aa" />
                <path d="M 194 52 C 200 37, 218 37, 222 52 C 216 47, 200 47, 194 52 Z" fill="#0f172a" />
                <circle cx="212" cy="54" r="1.8" fill="#0f172a" />
                <path d="M 210 61 Q 214 64 218 61" fill="none" stroke="#0f172a" strokeWidth="1.5" />
              </g>
            </svg>
          </motion.div>
        )}

        {/* 2. LUXURY BMW CONVERTIBLE */}
        {selectedVehicle === 'car' && (
          <motion.div
            animate={{
              y: [0, -2.5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: speedKm === 100 ? 0.14 : speedKm === 60 ? 0.22 : 0.32,
              ease: 'easeInOut',
            }}
            style={{ position: 'relative', width: '420px', height: '185px' }}
          >
            {/* Badges floating above BMW */}
            <div
              style={{
                position: 'absolute',
                top: '-16px',
                left: '120px',
                display: 'flex',
                gap: '24px',
                zIndex: 35,
              }}
            >
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.9)',
                  border: '1.5px solid #fef08a',
                  borderRadius: '16px',
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                }}
              >
                <img
                  src={sameekshaPhotoUrl}
                  alt="Sameeksha face"
                  style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span>Sameeksha 💖</span>
              </div>

              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.9)',
                  border: '1.5px solid #38bdf8',
                  borderRadius: '16px',
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                }}
              >
                <span>Harshit 👑</span>
              </div>
            </div>

            {/* High-Fidelity BMW Convertible Vector Graphic */}
            <svg viewBox="0 0 440 195" width="420" height="185">
              <defs>
                <linearGradient id="bmwDeepBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="45%" stopColor="#2563eb" />
                  <stop offset="85%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#172554" />
                </linearGradient>
                <clipPath id="sameekshaCarClip">
                  <circle cx="215" cy="62" r="14" />
                </clipPath>
              </defs>

              {/* Rear Wheel */}
              <circle cx="95" cy="154" r="34" fill="#0f172a" stroke="#334155" strokeWidth="7" />
              <circle cx="95" cy="154" r="24" fill="#94a3b8" />
              <circle cx="95" cy="154" r="7" fill="#2563eb" />

              {/* Front Wheel */}
              <circle cx="345" cy="154" r="34" fill="#0f172a" stroke="#334155" strokeWidth="7" />
              <circle cx="345" cy="154" r="24" fill="#94a3b8" />
              <circle cx="345" cy="154" r="7" fill="#2563eb" />

              {/* Sleek BMW M Roadster Body */}
              <path
                d="M 35 146 L 52 114 Q 85 95 150 95 L 260 95 Q 305 95 348 114 L 415 130 Q 425 140 425 152 L 35 152 Z"
                fill="url(#bmwDeepBlue)"
                stroke="#60a5fa"
                strokeWidth="2"
              />

              {/* Aerodynamic Windshield */}
              <path d="M 260 95 L 315 56 L 328 57 L 292 95 Z" fill="rgba(191, 219, 254, 0.45)" stroke="#93c5fd" strokeWidth="2" />

              {/* Digital Cockpit Dashboard & Steering Wheel */}
              <rect x="155" y="88" width="135" height="16" rx="4" fill="#090d16" />
              <circle cx="286" cy="76" r="12" fill="none" stroke="#cbd5e1" strokeWidth="3" />

              {/* --- SAMEEKSHA (In Passenger Seat) --- */}
              <g>
                <path d="M 205 56 C 182 52, 160 62, 145 78 C 168 72, 195 66, 205 66 Z" fill="#3b1d11" />
                <image
                  href={sameekshaPhotoUrl}
                  x="201"
                  y="48"
                  width="28"
                  height="28"
                  clipPath="url(#sameekshaCarClip)"
                  preserveAspectRatio="xMidYMid slice"
                />
                <circle cx="215" cy="62" r="14" fill="none" stroke="#f43f5e" strokeWidth="2" />
                {/* Outfit */}
                <path d="M 198 78 L 232 78 L 235 95 L 195 95 Z" fill="#ec4899" />
              </g>

              {/* --- HARSHIT (Driving with Hand on Steering) --- */}
              <g>
                <circle cx="264" cy="58" r="15" fill="#fed7aa" />
                <path d="M 252 54 C 258 40, 276 40, 280 54 C 274 50, 258 50, 252 54 Z" fill="#0f172a" />
                <circle cx="270" cy="56" r="1.8" fill="#0f172a" />
                <path d="M 268 63 Q 272 66 276 63" fill="none" stroke="#0f172a" strokeWidth="1.4" />
                {/* Jacket */}
                <path d="M 246 76 L 282 76 L 285 95 L 244 95 Z" fill="#1e293b" />
                <line x1="266" y1="80" x2="284" y2="78" stroke="#fed7aa" strokeWidth="5" strokeLinecap="round" />
              </g>

              {/* Twin BMW Kidney Grille */}
              <rect x="408" y="132" width="8" height="14" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
              <rect x="418" y="132" width="8" height="14" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Angel Eye Headlights */}
              <circle cx="400" cy="126" r="6.5" fill="#38bdf8" />
              <circle cx="400" cy="126" r="3.2" fill="#ffffff" />
            </svg>
          </motion.div>
        )}

        {/* 3. ROMANTIC MIDNIGHT WALK */}
        {selectedVehicle === 'pedal' && (
          <motion.div
            animate={{
              y: [0, -3.5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: speedKm === 100 ? 0.35 : speedKm === 60 ? 0.5 : 0.7,
              ease: 'easeInOut',
            }}
            style={{ position: 'relative', width: '250px', height: '200px' }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-18px',
                left: '28px',
                display: 'flex',
                gap: '24px',
                zIndex: 35,
              }}
            >
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.9)',
                  border: '1.5px solid #38bdf8',
                  borderRadius: '16px',
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#38bdf8',
                }}
              >
                Harshit 👑
              </div>
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.9)',
                  border: '1.5px solid #fef08a',
                  borderRadius: '16px',
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <img
                  src={sameekshaPhotoUrl}
                  alt="Sameeksha"
                  style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }}
                />
                Sameeksha 💖
              </div>
            </div>

            <svg viewBox="0 0 250 210" width="250" height="200">
              <defs>
                <clipPath id="sameekshaWalkClip">
                  <circle cx="155" cy="62" r="14" />
                </clipPath>
              </defs>
              <line x1="20" y1="192" x2="230" y2="192" stroke="#475569" strokeWidth="4" />

              {/* Harshit (Left) */}
              <circle cx="95" cy="56" r="16" fill="#fed7aa" />
              <path d="M 82 50 C 88 35, 108 35, 112 50 Z" fill="#0f172a" />
              <rect x="83" y="74" width="24" height="48" rx="6" fill="#1e293b" />
              <line x1="88" y1="122" x2="84" y2="188" stroke="#334155" strokeWidth="7" strokeLinecap="round" />
              <line x1="102" y1="122" x2="106" y2="188" stroke="#334155" strokeWidth="7" strokeLinecap="round" />

              {/* Sameeksha (Right) */}
              <path d="M 144 54 C 128 50, 115 70, 110 85 C 124 80, 140 72, 150 72 Z" fill="#3b1d11" />
              <image
                href={sameekshaPhotoUrl}
                x="141"
                y="48"
                width="28"
                height="28"
                clipPath="url(#sameekshaWalkClip)"
                preserveAspectRatio="xMidYMid slice"
              />
              <circle cx="155" cy="62" r="14" fill="none" stroke="#f43f5e" strokeWidth="2" />
              <path d="M 146 78 L 164 78 L 172 135 L 138 135 Z" fill="#ec4899" />
              <line x1="148" y1="135" x2="145" y2="188" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
              <line x1="162" y1="135" x2="165" y2="188" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />

              {/* Holding Hands in Center ❤️ */}
              <path d="M 102 90 Q 125 118 148 96" fill="none" stroke="#fed7aa" strokeWidth="6.5" strokeLinecap="round" />
              <circle cx="125" cy="112" r="4.5" fill="#f43f5e" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* BOTTOM CONTROLS: Speed (30, 60, 100 km/h) & Dedicated Music Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '14px',
          right: '14px',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* Dynamic Love Quotes Ticker */}
        <motion.div
          key={quoteIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'rgba(15, 10, 30, 0.92)',
            border: '1.5px solid rgba(251, 191, 36, 0.65)',
            borderRadius: '24px',
            padding: '7px 20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
            textAlign: 'center',
            maxWidth: '92vw',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span style={{ color: '#fef08a', fontWeight: 700, fontSize: '0.86rem' }}>
            {ROMANTIC_QUOTES[quoteIdx].speaker}:
          </span>{' '}
          <span style={{ color: '#fda4af', fontSize: '0.84rem', fontStyle: 'italic' }}>
            "{ROMANTIC_QUOTES[quoteIdx].text}"
          </span>
        </motion.div>

        {/* Driving Control Panel */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            background: 'rgba(17, 12, 34, 0.95)',
            border: '1.5px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '32px',
            padding: '7px 18px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 10px 35px rgba(0,0,0,0.85)',
          }}
        >
          {/* Horn Button */}
          <motion.button
            type="button"
            onClick={handleHorn}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.92 }}
            style={{
              background: isHornActive
                ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                : 'linear-gradient(135deg, #f43f5e, #ec4899)',
              border: 'none',
              borderRadius: '20px',
              padding: '7px 15px',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span>🔊</span>
            <span>{selectedVehicle === 'bike' ? 'Bullet Horn' : 'BMW Horn'}</span>
          </motion.button>

          {/* Explicit Speed Controls: 30, 60, 100 km/h as requested! */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '22px',
              padding: '3px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <span style={{ fontSize: '0.7rem', color: '#fef08a', fontWeight: 700, padding: '0 6px' }}>
              Speed:
            </span>

            {([30, 60, 100] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setSpeedKm(spd)}
                style={{
                  background: speedKm === spd ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '5px 12px',
                  color: speedKm === spd ? '#fff' : 'rgba(255, 255, 255, 0.65)',
                  fontSize: '0.74rem',
                  fontWeight: speedKm === spd ? 800 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {spd === 30 ? '🐢 30' : spd === 60 ? '✨ 60' : '⚡ 100'}
              </button>
            ))}
          </div>

          {/* Dedicated Road Playlist Music Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '20px',
              padding: '3px 10px',
              border: '1px solid rgba(251, 191, 36, 0.3)',
            }}
          >
            <button
              type="button"
              onClick={handlePrevSong}
              style={{ background: 'none', border: 'none', color: '#fef08a', cursor: 'pointer', fontSize: '0.85rem' }}
              title="Previous song"
            >
              ⏮️
            </button>

            <button
              type="button"
              onClick={handleTogglePlay}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}
              title={isPlayingMusic ? 'Pause' : 'Play'}
            >
              {isPlayingMusic ? '⏸️' : '▶️'}
            </button>

            <button
              type="button"
              onClick={handleNextSong}
              style={{ background: 'none', border: 'none', color: '#fef08a', cursor: 'pointer', fontSize: '0.85rem' }}
              title="Next road song"
            >
              ⏭️
            </button>

            <span style={{ fontSize: '0.72rem', color: '#fef08a', fontWeight: 600 }}>
              🎵 {LONG_DRIVE_PLAYLIST[currentSongIdx].title} ({currentSongIdx + 1}/{LONG_DRIVE_PLAYLIST.length})
            </span>
          </div>
        </div>
      </div>

      {/* 6. GRAND END DRIVING MODAL (Tareef, Thank You For Visiting, Happy Birthday & Restart Button) */}
      <AnimatePresence>
        {showEndModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 150,
              background: 'rgba(5, 3, 15, 0.92)',
              backdropFilter: 'blur(18px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              style={{
                width: '100%',
                maxWidth: '560px',
                background: 'linear-gradient(135deg, rgba(28, 16, 52, 0.98), rgba(15, 10, 32, 0.98))',
                border: '2px solid rgba(251, 191, 36, 0.8)',
                borderRadius: '30px',
                padding: '28px 24px',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(244, 63, 94, 0.4)',
                position: 'relative',
              }}
            >
              {/* Top Avatar with Heart Ring */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '14px' }}>
                <img
                  src={sameekshaPhotoUrl}
                  alt="Sameeksha"
                  style={{
                    width: '82px',
                    height: '82px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #fbbf24',
                    boxShadow: '0 0 25px rgba(251, 191, 36, 0.7)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    fontSize: '1.4rem',
                  }}
                >
                  👑
                </span>
              </div>

              {/* Grand Birthday Greeting */}
              <h2
                style={{
                  fontSize: 'clamp(1.4rem, 4vw, 1.85rem)',
                  fontWeight: 900,
                  margin: '0 0 8px 0',
                  background: 'linear-gradient(135deg, #fff, #ffd1dc, #fbbf24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Happy 23rd Birthday Sameeksha! 🎂✨
              </h2>

              <div
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#34d399',
                  marginBottom: '16px',
                  letterSpacing: '0.5px',
                }}
              >
                💖 Thank You So Much For Visiting Your Universe! 💖
              </div>

              {/* Heartfelt Tareef & Love Letter from Harshit */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(251, 191, 36, 0.35)',
                  borderRadius: '18px',
                  padding: '16px',
                  marginBottom: '22px',
                  textAlign: 'left',
                  lineHeight: 1.6,
                  color: '#fef08a',
                  fontSize: '0.86rem',
                }}
              >
                <p style={{ margin: '0 0 8px 0', color: '#fda4af', fontWeight: 600 }}>
                  "Meri sabse pyari Sameeksha ji, ❤️
                </p>
                <p style={{ margin: '0 0 8px 0' }}>
                  Aapke saath ye long drive meri zindagi ka sabse khubsurat lamha tha. Chahe Bullet ki thandi hawa ho ya BMW ki khuli chhat... aapka haath mere haath me hona hi meri sabse badi khushi hai.
                </p>
                <p style={{ margin: '0 0 8px 0' }}>
                  Aapki wo masoom si hansi, aapki pyari baatein aur aapka saath mere liye duniya ki sabse keemti daulat hai. Harshit hamesha aapse beinteha pyaar karta rahega. 🌹✨"
                </p>
                <p style={{ margin: 0, textAlign: 'right', color: '#fda4af', fontStyle: 'italic', fontWeight: 700 }}>
                  — Hamesha Sirf Aapka, Harshit 💕
                </p>
              </div>

              {/* Action Buttons: Go back to Starting */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button
                  type="button"
                  onClick={() => setScene(0)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669, #0284c7)',
                    border: '2px solid rgba(251, 191, 36, 0.8)',
                    borderRadius: '26px',
                    padding: '12px 24px',
                    color: '#fff',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>🔄</span>
                  <span>Restart Universe / Shuru Se Dekhein ✨</span>
                </motion.button>

                <button
                  type="button"
                  onClick={() => setShowEndModal(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '26px',
                    padding: '12px 20px',
                    color: '#fff',
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                  }}
                >
                  Keep Driving 🚗💨
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LongDriveScene;
