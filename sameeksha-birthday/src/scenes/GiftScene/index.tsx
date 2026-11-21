import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
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
  color: string;
  ribbonColor: string;
}

const GIFTS: GiftChoice[] = [
  {
    id: 'teddy',
    name: 'Plush Fluffy Honey Teddy Bear',
    emoji: '🧸',
    tag: 'Soft Cuddles',
    description: "Ultra-soft honey plush bear with living breathing warmth, lifelike glass eyes, and a ruby satin bowtie, to remind you of Harshit's hugs every day!",
    color: '#991b1b',
    ribbonColor: '#fbbf24',
  },
  {
    id: 'rose',
    name: '100 Royal Red Velvet Roses',
    emoji: '🌹',
    tag: 'Eternal Romance',
    description: '100 freshly bloomed velvet red roses with multi-whorled petals, delicate morning dew sheen, and swirling petals, just as radiant as Sameeksha!',
    color: '#065f46',
    ribbonColor: '#e11d48',
  },
  {
    id: 'diamond',
    name: 'Diamond & Rose-Gold Eternity Heart',
    emoji: '💎',
    tag: 'Precious Gem',
    description: 'Flawless optical diamond heart with brilliant spectral fire refraction and dual orbital rose-gold rings — a symbol of Harshit\'s timeless devotion.',
    color: '#1e3a8a',
    ribbonColor: '#e2e8f0',
  },
  {
    id: 'chocolates',
    name: 'Belgian Royal Chocolate Truffles',
    emoji: '🍫',
    tag: 'Sweet Moments',
    description: 'Artisanal Belgian chocolate box with 24K gold-leaf truffles, hazelnut pralines, and ruby berry ganache, delightfully sweet just like Sameeksha!',
    color: '#78350f',
    ribbonColor: '#fb7185',
  },
];

// Reusable 3D Individual Gift Box with Realistic Satin Ribbon & Bow
function SingleGiftBox3D({
  position,
  color,
  ribbonColor,
  isOpen,
  onOpen,
}: {
  position: [number, number, number];
  color: string;
  ribbonColor: string;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const boxGroupRef = useRef<THREE.Group>(null);
  const lidGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (boxGroupRef.current && !isOpen) {
      boxGroupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2.2 + position[0]) * 0.035;
    }
    if (lidGroupRef.current) {
      if (isOpen) {
        lidGroupRef.current.position.y = THREE.MathUtils.lerp(lidGroupRef.current.position.y, 1.8, 0.08);
        lidGroupRef.current.position.z = THREE.MathUtils.lerp(lidGroupRef.current.position.z, -0.7, 0.08);
        lidGroupRef.current.rotation.x = THREE.MathUtils.lerp(lidGroupRef.current.rotation.x, -0.85, 0.08);
      } else {
        lidGroupRef.current.position.y = 0.42;
        lidGroupRef.current.position.z = 0;
        lidGroupRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <group
      ref={boxGroupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
    >
      {/* Base Box Outer */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.72, 0.62, 0.72]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.35} />
      </mesh>

      {/* Cross Ribbons */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.14, 0.63, 0.73]} />
        <meshStandardMaterial color={ribbonColor} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.73, 0.63, 0.14]} />
        <meshStandardMaterial color={ribbonColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Lid */}
      <group ref={lidGroupRef} position={[0, 0.42, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.76, 0.16, 0.76]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.35} />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.14, 0.17, 0.77]} />
          <meshStandardMaterial color={ribbonColor} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.77, 0.17, 0.14]} />
          <meshStandardMaterial color={ribbonColor} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Bow */}
        <group position={[0, 0.13, 0]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.1, 0.035, 16, 24]} />
            <meshStandardMaterial color={ribbonColor} metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <torusGeometry args={[0.1, 0.035, 16, 24]} />
            <meshStandardMaterial color={ribbonColor} metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.05, 14, 14]} />
            <meshStandardMaterial color={ribbonColor} metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ==========================================
// 1. PHOTOREALISTIC PLUSH TEDDY BEAR 3D
// ==========================================
function TeddyBear3D({
  position,
  scale,
  isSolo,
  onClick,
}: {
  position: [number, number, number];
  scale: number;
  isSolo: boolean;
  onClick?: () => void;
}) {
  const teddyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!teddyRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle breathing scale and hover
    const breath = 1 + Math.sin(t * 2.2) * 0.025;
    teddyRef.current.position.y = position[1] + Math.sin(t * 1.8) * 0.045;
    teddyRef.current.scale.set(scale * breath, scale * (1 + Math.sin(t * 2.2) * 0.035), scale * breath);
    if (isSolo) {
      teddyRef.current.rotation.y = t * 0.75;
    } else {
      teddyRef.current.rotation.y = Math.sin(t * 1.2) * 0.22;
    }
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 1.6) * 0.05;
      headRef.current.rotation.x = Math.sin(t * 2.0) * 0.03;
    }
  });

  return (
    <group
      ref={teddyRef}
      position={position}
      scale={[scale, scale, scale]}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {/* Plump Plush Fur Body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.38, 28, 28]} />
        <meshStandardMaterial color="#92400e" roughness={0.92} metalness={0.02} />
      </mesh>
      {/* Soft Honey Belly Felt Patch with Stitch Detail */}
      <mesh position={[0, 0.35, 0.27]}>
        <sphereGeometry args={[0.23, 22, 22]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.96} />
      </mesh>

      {/* Head Group with Micro-Tilts */}
      <group ref={headRef} position={[0, 0.82, 0]}>
        {/* Head Sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.33, 28, 28]} />
          <meshStandardMaterial color="#92400e" roughness={0.92} metalness={0.02} />
        </mesh>
        {/* Soft Muzzle / Snout */}
        <mesh position={[0, -0.06, 0.26]}>
          <sphereGeometry args={[0.135, 20, 20]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.95} />
        </mesh>
        {/* Glossy Black Leather Stitched Nose */}
        <mesh position={[0, 0.01, 0.375]}>
          <sphereGeometry args={[0.046, 16, 16]} />
          <meshStandardMaterial color="#18181b" roughness={0.18} metalness={0.2} />
        </mesh>
        {/* Embroidered Stitched Smile */}
        <mesh position={[0, -0.08, 0.35]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.04, 0.007, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>

        {/* Photorealistic Multi-Layered Glass Eyes with Double Catchlights */}
        {/* Left Eye */}
        <group position={[0.105, 0.06, 0.285]}>
          {/* Amber Iris Outer Ring */}
          <mesh>
            <sphereGeometry args={[0.042, 16, 16]} />
            <meshStandardMaterial color="#78350f" roughness={0.1} />
          </mesh>
          {/* Obsidian Pupil */}
          <mesh position={[0, 0, 0.01]}>
            <sphereGeometry args={[0.034, 16, 16]} />
            <meshStandardMaterial color="#09090b" roughness={0.05} />
          </mesh>
          {/* Primary Crisp White Catchlight */}
          <mesh position={[0.012, 0.014, 0.035]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Secondary Soft Accent Catchlight */}
          <mesh position={[-0.008, -0.006, 0.032]}>
            <sphereGeometry args={[0.005, 6, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Right Eye */}
        <group position={[-0.105, 0.06, 0.285]}>
          {/* Amber Iris Outer Ring */}
          <mesh>
            <sphereGeometry args={[0.042, 16, 16]} />
            <meshStandardMaterial color="#78350f" roughness={0.1} />
          </mesh>
          {/* Obsidian Pupil */}
          <mesh position={[0, 0, 0.01]}>
            <sphereGeometry args={[0.034, 16, 16]} />
            <meshStandardMaterial color="#09090b" roughness={0.05} />
          </mesh>
          {/* Primary Crisp White Catchlight */}
          <mesh position={[0.012, 0.014, 0.035]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Secondary Soft Accent Catchlight */}
          <mesh position={[-0.008, -0.006, 0.032]}>
            <sphereGeometry args={[0.005, 6, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Fluffy Round Ears with Baby Pink Felt Inners */}
        <group position={[0.26, 0.26, -0.02]}>
          <mesh>
            <sphereGeometry args={[0.115, 20, 20]} />
            <meshStandardMaterial color="#78350f" roughness={0.92} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.96} />
          </mesh>
        </group>
        <group position={[-0.26, 0.26, -0.02]}>
          <mesh>
            <sphereGeometry args={[0.115, 20, 20]} />
            <meshStandardMaterial color="#78350f" roughness={0.92} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#fbcfe8" roughness={0.96} />
          </mesh>
        </group>

        {/* Regal Golden Crown Studded with Ruby & Sapphire Gems */}
        <group position={[0, 0.33, 0]}>
          <mesh>
            <cylinderGeometry args={[0.13, 0.11, 0.09, 20]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
          </mesh>
          {[-0.09, -0.045, 0, 0.045, 0.09].map((cx, idx) => (
            <group key={idx} position={[cx, 0.065, 0]}>
              <mesh>
                <coneGeometry args={[0.025, 0.075, 8]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
              </mesh>
              <mesh position={[0, 0.045, 0]}>
                <sphereGeometry args={[0.015, 8, 8]} />
                <meshStandardMaterial
                  color={idx % 2 === 0 ? '#e11d48' : '#3b82f6'}
                  metalness={0.85}
                  roughness={0.1}
                />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* Crimson Red Velvet Bow Tie with Draping Tails */}
      <group position={[0, 0.58, 0.32]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.13, 0.13, 0.045]} />
          <meshPhysicalMaterial color="#be123c" roughness={0.3} sheen={1} sheenColor="#f43f5e" />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <sphereGeometry args={[0.038, 12, 12]} />
          <meshStandardMaterial color="#9f1239" roughness={0.4} />
        </mesh>
      </group>

      {/* Plush Paws with Stitched Felt Heart Pads */}
      <group position={[0.34, 0.38, 0.15]}>
        <mesh>
          <sphereGeometry args={[0.115, 16, 16]} />
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.095]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.95} />
        </mesh>
      </group>
      <group position={[-0.34, 0.38, 0.15]}>
        <mesh>
          <sphereGeometry args={[0.115, 16, 16]} />
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.095]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.95} />
        </mesh>
      </group>

      {/* Feet with Large Heart Paw Pads */}
      <group position={[0.22, 0.06, 0.18]}>
        <mesh>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.02, 0.1]}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.95} />
        </mesh>
      </group>
      <group position={[-0.22, 0.06, 0.18]}>
        <mesh>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.02, 0.1]}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}

// ==========================================
// 2. PHOTOREALISTIC VELVET ROSE BOUQUET 3D
// ==========================================
// Single realistic rose blossom with multi-whorled curved petals
function RealisticSingleRose({
  position,
  scale = 1,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* Central Bud Core */}
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhysicalMaterial
          color="#881337"
          roughness={0.28}
          clearcoat={0.35}
          clearcoatRoughness={0.2}
          sheen={1.0}
          sheenColor="#f43f5e"
        />
      </mesh>

      {/* Whorl 1: Tight Inner Curving Petals */}
      {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
        <mesh
          key={`w1_${i}`}
          position={[Math.cos(angle) * 0.045, 0.09, Math.sin(angle) * 0.045]}
          rotation={[0.3, angle + 0.4, 0.2]}
        >
          <cylinderGeometry args={[0.13, 0.09, 0.18, 14, 1, true, 0, Math.PI * 0.9]} />
          <meshPhysicalMaterial
            color="#9f1239"
            roughness={0.26}
            clearcoat={0.35}
            sheen={1.0}
            sheenColor="#fb7185"
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Whorl 2: Unfolding Mid Petals */}
      {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => (
        <mesh
          key={`w2_${i}`}
          position={[Math.cos(angle) * 0.085, 0.065, Math.sin(angle) * 0.085]}
          rotation={[0.45, angle + 0.3, 0.15]}
        >
          <cylinderGeometry args={[0.18, 0.12, 0.21, 14, 1, true, 0, Math.PI * 0.85]} />
          <meshPhysicalMaterial
            color="#be123c"
            roughness={0.28}
            clearcoat={0.3}
            sheen={1.0}
            sheenColor="#f43f5e"
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Whorl 3: Broad Velvet Outer Petals Gently Recurving */}
      {[0, 0.9, 1.8, 2.7, 3.6, 4.5, 5.4].map((angle, i) => (
        <mesh
          key={`w3_${i}`}
          position={[Math.cos(angle) * 0.135, 0.035, Math.sin(angle) * 0.135]}
          rotation={[0.65, angle + 0.25, 0.1]}
        >
          <cylinderGeometry args={[0.24, 0.16, 0.22, 14, 1, true, 0, Math.PI * 0.75]} />
          <meshPhysicalMaterial
            color="#e11d48"
            roughness={0.3}
            clearcoat={0.25}
            sheen={1.0}
            sheenColor="#fda4af"
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Emerald Calyx & Sepals Supporting Blossom */}
      <group position={[0, -0.04, 0]}>
        {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => (
          <mesh
            key={`sep_${i}`}
            position={[Math.cos(angle) * 0.08, -0.02, Math.sin(angle) * 0.08]}
            rotation={[-0.5, angle, 0]}
          >
            <coneGeometry args={[0.035, 0.14, 6]} />
            <meshStandardMaterial color="#166534" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function RoseBouquet3D({
  position,
  scale,
  isSolo,
  onClick,
}: {
  position: [number, number, number];
  scale: number;
  isSolo: boolean;
  onClick?: () => void;
}) {
  const roseRef = useRef<THREE.Group>(null);
  const petalsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!roseRef.current) return;
    const t = clock.getElapsedTime();
    roseRef.current.position.y = position[1] + Math.sin(t * 1.6 + 1) * 0.05;
    if (isSolo) {
      roseRef.current.rotation.y = t * 0.75;
    } else {
      roseRef.current.rotation.y = -Math.sin(t * 1.1) * 0.22;
    }
    if (petalsRef.current) {
      petalsRef.current.rotation.y = t * 0.85;
    }
  });

  return (
    <group
      ref={roseRef}
      position={position}
      scale={[scale, scale, scale]}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {/* Central Grand Red Velvet Rose */}
      <RealisticSingleRose position={[0, 0.84, 0]} scale={1.22} />

      {/* Surrounding Cluster of 6 Lush Blooming Roses */}
      {[
        { pos: [-0.26, 0.76, 0.14] as [number, number, number], rot: [-0.2, -0.4, 0.3] as [number, number, number], s: 0.95 },
        { pos: [0.26, 0.76, 0.14] as [number, number, number], rot: [-0.2, 0.4, -0.3] as [number, number, number], s: 0.95 },
        { pos: [0, 0.78, -0.26] as [number, number, number], rot: [0.35, 0, 0] as [number, number, number], s: 0.98 },
        { pos: [-0.22, 0.71, -0.16] as [number, number, number], rot: [0.25, -0.6, 0.2] as [number, number, number], s: 0.88 },
        { pos: [0.22, 0.71, -0.16] as [number, number, number], rot: [0.25, 0.6, -0.2] as [number, number, number], s: 0.88 },
        { pos: [0, 0.69, 0.28] as [number, number, number], rot: [-0.4, 0, 0] as [number, number, number], s: 0.92 },
      ].map((r, i) => (
        <RealisticSingleRose key={i} position={r.pos} scale={r.s} rotation={r.rot} />
      ))}

      {/* Fresh Green Stems Bundled Together */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.05, 0.78, 16]} />
        <meshStandardMaterial color="#166534" roughness={0.6} />
      </mesh>

      {/* Serrated Emerald Foliage Leaves */}
      <mesh position={[-0.18, 0.42, 0.05]} rotation={[0.2, 0, Math.PI / 3.5]}>
        <boxGeometry args={[0.24, 0.015, 0.1]} />
        <meshStandardMaterial color="#15803d" roughness={0.45} />
      </mesh>
      <mesh position={[0.18, 0.38, -0.05]} rotation={[-0.2, 0, -Math.PI / 3.5]}>
        <boxGeometry args={[0.24, 0.015, 0.1]} />
        <meshStandardMaterial color="#15803d" roughness={0.45} />
      </mesh>

      {/* Luxury Frosted Presentation Paper Wrap & Gold Ribbon */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.28, 0.11, 0.48, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#fdf2f8"
          roughness={0.3}
          transmission={0.4}
          thickness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Metallic Gold Edge Trim */}
      <mesh position={[0, 0.45, 0]}>
        <torusGeometry args={[0.28, 0.012, 16, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Rich Crimson Satin Tie Ribbon Bow */}
      <group position={[0, 0.18, 0.14]}>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.08, 0.025, 16, 24]} />
          <meshStandardMaterial color="#e11d48" metalness={0.4} roughness={0.2} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]}>
          <torusGeometry args={[0.08, 0.025, 16, 24]} />
          <meshStandardMaterial color="#e11d48" metalness={0.4} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <sphereGeometry args={[0.038, 12, 12]} />
          <meshStandardMaterial color="#be123c" roughness={0.3} />
        </mesh>
      </group>

      {/* Swirling Velvet Rose Petals Orbiting Around */}
      <group ref={petalsRef} position={[0, 0.65, 0]}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
          const angle = (idx / 8) * Math.PI * 2;
          const radius = 0.54 + (idx % 2) * 0.14;
          const py = Math.sin(idx * 1.5) * 0.22;
          return (
            <mesh
              key={idx}
              position={[Math.cos(angle) * radius, py, Math.sin(angle) * radius]}
              rotation={[0.4, angle, 0.3]}
            >
              <sphereGeometry args={[0.048, 10, 10]} />
              <meshPhysicalMaterial
                color="#e11d48"
                roughness={0.28}
                sheen={1.0}
                sheenColor="#fda4af"
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// ==========================================
// 3. PHOTOREALISTIC DIAMOND HEART 3D
// ==========================================
function DiamondHeart3D({
  position,
  scale,
  isSolo,
  onClick,
}: {
  position: [number, number, number];
  scale: number;
  isSolo: boolean;
  onClick?: () => void;
}) {
  const giftRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const N = 56;
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
      depth: 0.16,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
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
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = -t * 0.65;
      outerRingRef.current.rotation.z = Math.PI / 3 + Math.cos(t * 0.8) * 0.12;
    }
  });

  return (
    <group
      ref={giftRef}
      position={position}
      scale={[scale, scale, scale]}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {/* High-Refraction Flawless Diamond Heart with IOR 2.417 */}
      <mesh position={[0, 0.05, -0.08]}>
        <extrudeGeometry args={[heartShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#ffe4e6"
          emissiveIntensity={0.25}
          transmission={0.96}
          ior={2.417}
          roughness={0.015}
          metalness={0.04}
          thickness={1.6}
          dispersion={0.12}
          clearcoat={1.0}
          clearcoatRoughness={0.01}
          attenuationColor="#ffe4e6"
          attenuationDistance={0.8}
        />
      </mesh>

      {/* Internal Brilliant-Cut Diamond Core */}
      <mesh position={[0, 0.06, 0.02]}>
        <octahedronGeometry args={[0.22, 1]} />
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#fef08a"
          emissiveIntensity={0.7}
          transmission={0.92}
          ior={2.417}
          roughness={0.02}
          metalness={0.1}
          clearcoat={1}
        />
      </mesh>

      {/* 18K Yellow Gold Pavé Basket Setting */}
      <mesh position={[0, 0.44, 0]}>
        <torusGeometry args={[0.08, 0.022, 16, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.12} />
      </mesh>

      {/* Inner Celestial Gold Halo */}
      <mesh ref={ringRef} position={[0, 0.06, 0]}>
        <torusGeometry args={[0.68, 0.016, 16, 64]} />
        <meshStandardMaterial color="#fcd34d" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Outer Rose Gold Orbital Ring */}
      <mesh ref={outerRingRef} position={[0, 0.06, 0]}>
        <torusGeometry args={[0.84, 0.013, 16, 64]} />
        <meshStandardMaterial color="#f472b6" metalness={0.95} roughness={0.1} />
      </mesh>

      <pointLight color="#ff2d75" intensity={2.8} distance={3.2} />
    </group>
  );
}

// ==========================================
// 4. PHOTOREALISTIC BELGIAN CHOCOLATES 3D
// ==========================================
function Chocolates3D({
  position,
  scale,
  isSolo,
  onClick,
}: {
  position: [number, number, number];
  scale: number;
  isSolo: boolean;
  onClick?: () => void;
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
    <group
      ref={chocoRef}
      position={position}
      scale={[scale, scale, scale]}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {/* Confectionery Presentation Box Base in Warm Gold Foil */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.56, 0.56, 0.22, 32]} />
        <meshStandardMaterial color="#d97706" metalness={0.88} roughness={0.16} />
      </mesh>

      {/* Crimson Quilted Velvet Interior Cushion */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.59, 0.59, 0.045, 32]} />
        <meshStandardMaterial color="#881337" roughness={0.8} />
      </mesh>

      {/* Gold Trim Rim Around Box Interior */}
      <mesh position={[0, 0.34, 0]}>
        <torusGeometry args={[0.585, 0.015, 16, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Pleated Baking Paper Cup Liners for each Truffle */}
      {[
        [-0.2, 0.34, -0.1],
        [0.2, 0.34, -0.1],
        [-0.15, 0.34, 0.17],
        [0.15, 0.34, 0.17],
        [0, 0.34, 0.03],
      ].map((cupPos, i) => (
        <mesh key={`cup_${i}`} position={cupPos as [number, number, number]}>
          <cylinderGeometry args={[0.13, 0.09, 0.04, 18, 1, true]} />
          <meshStandardMaterial color="#3b1d11" roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Truffle 1: Dark Grand Cru Chocolate with Real 24K Edible Gold Leaf */}
      <group position={[-0.2, 0.4, -0.1]}>
        <mesh>
          <sphereGeometry args={[0.105, 18, 18]} />
          <meshPhysicalMaterial
            color="#1c0d06"
            roughness={0.14}
            clearcoat={0.92}
            clearcoatRoughness={0.08}
          />
        </mesh>
        {/* Jagged 24K Gold Leaf Flakes on Top */}
        <mesh position={[0, 0.095, 0]} rotation={[0.2, 0.4, 0]}>
          <boxGeometry args={[0.065, 0.012, 0.055]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.98} roughness={0.12} />
        </mesh>
      </group>

      {/* Truffle 2: Roasted Hazelnut Praline with White Chocolate Zigzag Drizzle */}
      <group position={[0.2, 0.4, -0.1]}>
        <mesh>
          <sphereGeometry args={[0.105, 18, 18]} />
          <meshPhysicalMaterial color="#4a2810" roughness={0.25} clearcoat={0.4} />
        </mesh>
        {/* White Chocolate Drizzle */}
        <mesh position={[0, 0.085, 0]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.13, 0.015, 0.03]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.2} />
        </mesh>
        {/* Whole Roasted Hazelnut Crown */}
        <mesh position={[0, 0.11, 0]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
      </group>

      {/* Truffle 3: Ruby Rose & Wild Berry Ganache Sphere */}
      <mesh position={[-0.15, 0.4, 0.17]}>
        <sphereGeometry args={[0.095, 18, 18]} />
        <meshPhysicalMaterial
          color="#e11d48"
          roughness={0.22}
          clearcoat={0.7}
          clearcoatRoughness={0.15}
          sheen={0.8}
          sheenColor="#fda4af"
        />
      </mesh>

      {/* Truffle 4: 24K Gold Wrapped Artisan Heart Bonbon */}
      <mesh position={[0.15, 0.4, 0.17]} rotation={[-Math.PI / 4, 0, 0]}>
        <octahedronGeometry args={[0.095, 0]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.16} />
      </mesh>

      {/* Truffle 5: Center French Cocoa-Dusted Noir Ganache (Matte Velvet Finish) */}
      <mesh position={[0, 0.41, 0.03]}>
        <sphereGeometry args={[0.115, 20, 20]} />
        <meshStandardMaterial color="#1f140e" roughness={0.95} metalness={0.0} />
      </mesh>
    </group>
  );
}

// 3D Delivery Drop Zone Pedestal with Target Glyphs
function LandingPedestalDropZone({ isDelivered }: { isDelivered: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.6;
    }
    if (beaconRef.current && !isDelivered) {
      const beaconMesh = beaconRef.current as any;
      if (beaconMesh.material) {
        beaconMesh.material.opacity = 0.25 + Math.sin(t * 3.5) * 0.15;
      }
    }
  });

  return (
    <group position={[0, -0.65, 0]}>
      {/* Base Marble Pedestal */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.7, 0.24, 48]} />
        <meshStandardMaterial color="#1a1236" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Golden Outer Rim */}
      <mesh position={[0, 0.13, 0]}>
        <torusGeometry args={[2.5, 0.035, 16, 48]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Rotating Neon Targeting Ring */}
      <mesh ref={ringRef} position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.72, 32]} />
        <meshBasicMaterial color="#ff007f" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner Golden Target Pad */}
      <mesh position={[0, 0.135, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.02, 32]} />
        <meshStandardMaterial color="#3b1d5a" roughness={0.4} />
      </mesh>

      {/* Light Beacon Pillar (Before delivery arrives) */}
      {!isDelivered && (
        <mesh ref={beaconRef} position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 3.5, 32, 1, true]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

const GiftScene: React.FC = () => {
  const nextScene = useExperienceStore((s) => s.nextScene);
  const giftOpened = useExperienceStore((s) => s.giftOpened);
  const setGiftOpened = useExperienceStore((s) => s.setGiftOpened);

  // Delivery Stages: 'approaching' -> 'unloading' -> 'departing' -> 'delivered'
  const [deliveryStage, setDeliveryStage] = useState<'approaching' | 'unloading' | 'departing' | 'delivered'>('approaching');

  // Individual opened gifts set (user opens each gift one by one!)
  const [openedGiftIds, setOpenedGiftIds] = useState<Set<GiftChoiceId>>(new Set(giftOpened ? ['teddy', 'rose', 'diamond', 'chocolates'] : []));
  const [selectedGiftId, setSelectedGiftId] = useState<GiftChoiceId | null>(null);

  // Cinematic Video-like Delivery Kart Sequence
  useEffect(() => {
    soundManager.playTwinkle();
    robotSpeaker.speak('Look Sameeksha! Harshit has sent a magical surprise delivery cart just for you! ✨');

    // Stage 1: Arrive from left to center
    const arriveTimer = setTimeout(() => {
      setDeliveryStage('unloading');
      soundManager.playPopperBurstSound();
      soundManager.playTwinkle();
      robotSpeaker.speak('Here come Harshit\'s surprise gifts landing on your platform! 🎁✨');
    }, 2400);

    // Stage 2: Unload gifts, then depart to right
    const departTimer = setTimeout(() => {
      setDeliveryStage('departing');
      soundManager.playTwinkle();
    }, 4500);

    // Stage 3: Delivery Complete
    const completeTimer = setTimeout(() => {
      setDeliveryStage('delivered');
      robotSpeaker.speak('All gifts delivered with love from Harshit! Open them one by one! 💖');
    }, 6000);

    return () => {
      clearTimeout(arriveTimer);
      clearTimeout(departTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  // Skip video cutscene
  const handleSkipDelivery = () => {
    setDeliveryStage('delivered');
    soundManager.playPopperBurstSound();
    robotSpeaker.speak('Gifts ready from Harshit! Tap each box to open! 🎁');
  };

  // Open an individual gift box
  const handleOpenIndividualGift = (id: GiftChoiceId) => {
    soundManager.playPopperBurstSound();
    soundManager.playTwinkle();
    setOpenedGiftIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setGiftOpened();
    setSelectedGiftId(id);
    const chosen = GIFTS.find((g) => g.id === id);
    if (chosen) {
      robotSpeaker.speak(`Wow! You opened: ${chosen.name}! Tap to choose this special gift from Harshit! 💖`);
    }
  };

  // Select a gift to confirm delivery promise from Harshit
  const handleSelectGift = (id: GiftChoiceId) => {
    soundManager.playTwinkle();
    setSelectedGiftId(id);
    const chosen = GIFTS.find((g) => g.id === id);
    if (chosen) {
      robotSpeaker.speak(`You chose ${chosen.name}! Ye gift aapko jald hi milega Harshit ki taraf se! 💖`);
    }
  };

  const selectedGift = GIFTS.find((g) => g.id === selectedGiftId);
  const isDelivered = deliveryStage === 'delivered';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 🚀 Harshit's Cinematic Flying Surprise Kart Cutscene */}
      <AnimatePresence>
        {!isDelivered && (
          <>
            {/* Delivery Kart flying in an arc */}
            <motion.div
              initial={{ left: '-35vw', top: '12vh', scale: 0.65, rotate: 10, opacity: 0 }}
              animate={
                deliveryStage === 'approaching'
                  ? {
                      left: ['-35vw', '12vw', '50vw'],
                      top: ['12vh', '26vh', '48vh'],
                      scale: [0.65, 1.15, 1.0],
                      rotate: [10, 14, 0],
                      opacity: [0, 1, 1],
                    }
                  : deliveryStage === 'unloading'
                  ? {
                      left: '50vw',
                      top: '48vh',
                      scale: [1, 1.06, 1],
                      rotate: [0, -2, 2, 0],
                      opacity: 1,
                    }
                  : {
                      left: ['50vw', '75vw', '125vw'],
                      top: ['48vh', '28vh', '8vh'],
                      scale: [1, 1.1, 0.6],
                      rotate: [0, -8, -16],
                      opacity: [1, 1, 0],
                    }
              }
              transition={
                deliveryStage === 'approaching'
                  ? { duration: 2.4, ease: 'easeOut' }
                  : deliveryStage === 'unloading'
                  ? { duration: 2.0, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 1.5, ease: 'easeIn' }
              }
              style={{
                position: 'fixed',
                transform: 'translate(-50%, -50%)',
                zIndex: 95,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                filter: 'drop-shadow(0 12px 30px rgba(251, 191, 36, 0.85))',
              }}
            >
              {/* Flying Kart Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '3.6rem', transform: 'scaleX(-1)' }}>✨🛷</span>
                <span style={{ fontSize: '2.8rem' }}>🎁</span>
                <span style={{ fontSize: '2.4rem' }}>🧸</span>
                <span style={{ fontSize: '2.6rem' }}>🌹</span>
              </div>

              {/* Banner on Kart */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.95), rgba(217, 119, 6, 0.95))',
                  color: '#fff',
                  padding: '5px 16px',
                  borderRadius: '20px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  border: '1.5px solid #fde047',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                }}
              >
                💌 Harshit's Surprise Delivery for Sameeksha! ✨
              </div>

              {/* Beaming Gifts Downward during Unloading */}
              {deliveryStage === 'unloading' && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: [0.6, 1, 0.7], scaleY: 1 }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{
                    width: '120px',
                    height: '140px',
                    background: 'linear-gradient(180deg, rgba(251, 191, 36, 0.6), rgba(255, 0, 127, 0.1))',
                    borderRadius: '50%',
                    filter: 'blur(8px)',
                    marginTop: '4px',
                  }}
                />
              )}
            </motion.div>

            {/* Skip Video Cutscene Pill */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleSkipDelivery}
              style={{
                position: 'fixed',
                top: '75px',
                right: '20px',
                zIndex: 100,
                background: 'rgba(15, 12, 34, 0.85)',
                border: '1px solid rgba(251, 191, 36, 0.5)',
                borderRadius: '20px',
                padding: '6px 14px',
                color: '#fbbf24',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}
            >
              Skip Delivery Video ▶
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <div className="canvas-container" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Canvas camera={{ position: [0, 1.2, 4.4], fov: 46 }} shadows>
          <ambientLight intensity={0.75} />
          <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow />
          <pointLight position={[-4, 3, -2]} intensity={1.4} color="#ff6b9d" />
          <pointLight position={[3, -2, 2]} intensity={1.2} color="#fbbf24" />
          <Sparkles count={90} scale={6.0} size={2.5} speed={0.5} color="#fcd34d" />

          {/* Landing Target Drop Zone Platform */}
          <LandingPedestalDropZone isDelivered={isDelivered} />

          {/* ALL 4 SURPRISE GIFTS ALWAYS CO-VISIBLE ON THE PLATFORM TOGETHER (Opening one NEVER hides the others!) */}
          {isDelivered && (
            <group position={[0, 0, 0]}>
              {/* Gift 1: Plush Teddy Bear */}
              <group position={[-1.42, 0.1, 0.05]}>
                {!openedGiftIds.has('teddy') ? (
                  <SingleGiftBox3D
                    position={[0, 0, 0]}
                    color="#991b1b"
                    ribbonColor="#fbbf24"
                    isOpen={false}
                    onOpen={() => handleOpenIndividualGift('teddy')}
                  />
                ) : (
                  <group position={[0, selectedGiftId === 'teddy' ? 0.32 : 0.12, 0]}>
                    {selectedGiftId === 'teddy' && (
                      <>
                        <pointLight position={[0, 1.2, 0]} intensity={3.5} color="#fbbf24" distance={3.2} />
                        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                          <ringGeometry args={[0.42, 0.52, 32]} />
                          <meshBasicMaterial color="#fbbf24" transparent opacity={0.65} side={THREE.DoubleSide} />
                        </mesh>
                      </>
                    )}
                    <TeddyBear3D
                      position={[0, 0.15, 0]}
                      scale={selectedGiftId === 'teddy' ? 0.74 : 0.46}
                      isSolo={selectedGiftId === 'teddy'}
                      onClick={() => handleSelectGift('teddy')}
                    />
                  </group>
                )}
              </group>

              {/* Gift 2: 100 Red Roses Bouquet */}
              <group position={[-0.48, 0.1, 0.35]}>
                {!openedGiftIds.has('rose') ? (
                  <SingleGiftBox3D
                    position={[0, 0, 0]}
                    color="#065f46"
                    ribbonColor="#e11d48"
                    isOpen={false}
                    onOpen={() => handleOpenIndividualGift('rose')}
                  />
                ) : (
                  <group position={[0, selectedGiftId === 'rose' ? 0.32 : 0.12, 0]}>
                    {selectedGiftId === 'rose' && (
                      <>
                        <pointLight position={[0, 1.2, 0]} intensity={3.5} color="#fbbf24" distance={3.2} />
                        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                          <ringGeometry args={[0.42, 0.52, 32]} />
                          <meshBasicMaterial color="#f43f5e" transparent opacity={0.65} side={THREE.DoubleSide} />
                        </mesh>
                      </>
                    )}
                    <RoseBouquet3D
                      position={[0, 0.15, 0]}
                      scale={selectedGiftId === 'rose' ? 0.74 : 0.48}
                      isSolo={selectedGiftId === 'rose'}
                      onClick={() => handleSelectGift('rose')}
                    />
                  </group>
                )}
              </group>

              {/* Gift 3: Diamond Heart Pendant */}
              <group position={[0.48, 0.1, 0.35]}>
                {!openedGiftIds.has('diamond') ? (
                  <SingleGiftBox3D
                    position={[0, 0, 0]}
                    color="#1e3a8a"
                    ribbonColor="#e2e8f0"
                    isOpen={false}
                    onOpen={() => handleOpenIndividualGift('diamond')}
                  />
                ) : (
                  <group position={[0, selectedGiftId === 'diamond' ? 0.32 : 0.12, 0]}>
                    {selectedGiftId === 'diamond' && (
                      <>
                        <pointLight position={[0, 1.2, 0]} intensity={3.5} color="#fbbf24" distance={3.2} />
                        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                          <ringGeometry args={[0.42, 0.52, 32]} />
                          <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} side={THREE.DoubleSide} />
                        </mesh>
                      </>
                    )}
                    <DiamondHeart3D
                      position={[0, 0.22, 0]}
                      scale={selectedGiftId === 'diamond' ? 1.08 : 0.68}
                      isSolo={selectedGiftId === 'diamond'}
                      onClick={() => handleSelectGift('diamond')}
                    />
                  </group>
                )}
              </group>

              {/* Gift 4: Belgian Luxury Chocolates */}
              <group position={[1.42, 0.1, 0.05]}>
                {!openedGiftIds.has('chocolates') ? (
                  <SingleGiftBox3D
                    position={[0, 0, 0]}
                    color="#78350f"
                    ribbonColor="#fb7185"
                    isOpen={false}
                    onOpen={() => handleOpenIndividualGift('chocolates')}
                  />
                ) : (
                  <group position={[0, selectedGiftId === 'chocolates' ? 0.32 : 0.12, 0]}>
                    {selectedGiftId === 'chocolates' && (
                      <>
                        <pointLight position={[0, 1.2, 0]} intensity={3.5} color="#fbbf24" distance={3.2} />
                        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                          <ringGeometry args={[0.42, 0.52, 32]} />
                          <meshBasicMaterial color="#fbbf24" transparent opacity={0.65} side={THREE.DoubleSide} />
                        </mesh>
                      </>
                    )}
                    <Chocolates3D
                      position={[0, 0.18, 0]}
                      scale={selectedGiftId === 'chocolates' ? 0.98 : 0.65}
                      isSolo={selectedGiftId === 'chocolates'}
                      onClick={() => handleSelectGift('chocolates')}
                    />
                  </group>
                )}
              </group>
            </group>
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
          {isDelivered ? "Harshit's Special Surprise Gifts" : "Special Delivery for Sameeksha Baby"}
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
          {!isDelivered
            ? "✨ Harshit's delivery kart is arriving at the landing platform..."
            : selectedGiftId
            ? "✨ Spotlighting your selected gift in 360°!"
            : "🎁 Tap each gift box below to unwrap individually!"}
        </div>
      </div>

      {/* 4 Chooseable / Unwrap Buttons Bar (When delivered and not in modal) */}
      {isDelivered && !selectedGiftId && (
        <div
          style={{
            position: 'fixed',
            bottom: '22px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '96vw',
          }}
        >
          {GIFTS.map((g) => {
            const isOpen = openedGiftIds.has(g.id);
            return (
              <motion.button
                key={g.id}
                onClick={() => {
                  if (!isOpen) {
                    handleOpenIndividualGift(g.id);
                  } else {
                    handleSelectGift(g.id);
                  }
                }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: isOpen
                    ? 'rgba(30, 20, 60, 0.94)'
                    : 'rgba(18, 12, 38, 0.94)',
                  backdropFilter: 'blur(12px)',
                  border: isOpen
                    ? '1.5px solid #fbbf24'
                    : '1.5px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '16px',
                  padding: '8px 14px',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: isOpen
                    ? '0 4px 18px rgba(251, 191, 36, 0.35)'
                    : '0 4px 14px rgba(0,0,0,0.5)',
                }}
              >
                <span style={{ fontSize: '1.35rem' }}>{isOpen ? g.emoji : '🎁'}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isOpen ? '#fbbf24' : '#fff' }}>
                    {g.name}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: isOpen ? '#a7f3d0' : '#fbcfe8' }}>
                    {isOpen ? '✨ Opened (Tap to view)' : '🔒 Tap to unwrap'}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Selected Gift Highlight Card with Harshit's Promise! */}
      <AnimatePresence>
        {selectedGift && (
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
              {selectedGift.emoji} {selectedGift.tag} • Harshit's Gift {selectedGift.emoji}
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

            {/* Quick Switcher Between All 4 Gifts */}
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
              {GIFTS.map((g) => {
                const isCurrent = g.id === selectedGift.id;
                const isOpened = openedGiftIds.has(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      if (!isOpened) {
                        handleOpenIndividualGift(g.id);
                      } else {
                        handleSelectGift(g.id);
                      }
                    }}
                    style={{
                      background: isCurrent ? 'rgba(251, 191, 36, 0.28)' : 'rgba(255, 255, 255, 0.08)',
                      border: isCurrent ? '1.5px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '4px 10px',
                      color: isCurrent ? '#fbbf24' : '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <span>{g.emoji}</span> <span>{g.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

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
                🔄 View All Gifts
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
