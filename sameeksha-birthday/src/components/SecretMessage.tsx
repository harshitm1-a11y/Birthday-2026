import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../state/experienceStore';
import { content } from '../content/siteContent';

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modal: any = {
  hidden: { opacity: 0, scale: 0.75, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24, delay: 0.1 },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 30,
    transition: { duration: 0.25 },
  },
};

const SecretMessage: React.FC = () => {
  const showSecretMessage = useExperienceStore((s) => s.showSecretMessage);
  const setShowSecretMessage = useExperienceStore(
    (s) => s.setShowSecretMessage,
  );

  const handleClose = () => setShowSecretMessage(false);

  return (
    <AnimatePresence>
      {showSecretMessage && (
        <motion.div
          className="secret-overlay"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label="Secret message"
        >
          <motion.div
            className="secret-modal"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="secret-modal__sparkle" aria-hidden>
              ✨💖✨
            </div>

            <p className="secret-modal__text">{content.secretMessage}</p>

            <motion.button
              className="secret-modal__close"
              onClick={handleClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Close 💫
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SecretMessage;
