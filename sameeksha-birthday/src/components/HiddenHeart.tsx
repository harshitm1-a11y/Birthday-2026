import React, { useState, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../state/experienceStore';

interface HiddenHeartProps {
  heartId: number;
  style?: CSSProperties;
}

const HiddenHeart: React.FC<HiddenHeartProps> = ({ heartId, style }) => {
  const collectHeart = useExperienceStore((s) => s.collectHeart);
  const collectedHearts = useExperienceStore((s) => s.collectedHearts);
  const alreadyCollected = collectedHearts.has(heartId);

  const [animating, setAnimating] = useState(false);

  if (alreadyCollected && !animating) return null;

  const handleClick = () => {
    if (alreadyCollected || animating) return;
    setAnimating(true);
    collectHeart(heartId);
    // Let the exit animation play, then unmount
    setTimeout(() => setAnimating(false), 800);
  };

  return (
    <AnimatePresence>
      {!alreadyCollected && (
        <motion.button
          className="hidden-heart"
          style={style}
          onClick={handleClick}
          initial={{ scale: 0, rotate: -30 }}
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 8, -8, 0],
            transition: {
              scale: { repeat: Infinity, repeatType: 'reverse', duration: 2 },
              rotate: { repeat: Infinity, repeatType: 'reverse', duration: 3 },
            },
          }}
          exit={{
            scale: 2.5,
            opacity: 0,
            y: -60,
            transition: { duration: 0.6, ease: 'easeOut' },
          }}
          whileHover={{ scale: 1.35, filter: 'brightness(1.3)' }}
          whileTap={{ scale: 0.9 }}
          aria-label="Hidden heart — click to collect!"
        >
          <span className="hidden-heart__icon" role="img" aria-hidden>
            💖
          </span>
          <span className="hidden-heart__sparkle" aria-hidden>
            ✨
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default HiddenHeart;
