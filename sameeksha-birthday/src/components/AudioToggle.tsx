import React from 'react';
import { motion } from 'framer-motion';
import { useExperienceStore } from '../state/experienceStore';

const AudioToggle: React.FC = () => {
  const audioEnabled = useExperienceStore((s) => s.audioEnabled);
  const toggleAudio = useExperienceStore((s) => s.toggleAudio);

  return (
    <motion.button
      className="audio-toggle"
      onClick={toggleAudio}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
      title={audioEnabled ? 'Mute' : 'Unmute'}
    >
      <motion.span
        key={audioEnabled ? 'on' : 'off'}
        initial={{ rotateY: 90 }}
        animate={{ rotateY: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ display: 'inline-block' }}
      >
        {audioEnabled ? '🔊' : '🔇'}
      </motion.span>
    </motion.button>
  );
};

export default AudioToggle;
