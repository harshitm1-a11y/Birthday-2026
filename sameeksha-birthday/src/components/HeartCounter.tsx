import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../state/experienceStore';

const TOTAL_HEARTS = 5;

const HeartCounter: React.FC = () => {
  const collectedHearts = useExperienceStore((s) => s.collectedHearts);
  const count = collectedHearts.size;

  return (
    <motion.div
      className="heart-counter"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      aria-label={`Collected ${count} of ${TOTAL_HEARTS} hearts`}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={count}
          className="heart-counter__value"
          initial={{ scale: 1.6, color: '#ff6b9d' }}
          animate={{ scale: 1, color: '#f9a8d4' }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          💖 {count}/{TOTAL_HEARTS}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
};

export default HeartCounter;
