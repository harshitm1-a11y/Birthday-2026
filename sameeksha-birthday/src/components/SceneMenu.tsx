import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../state/experienceStore';
import { content } from '../content/siteContent';

const SCENE_EMOJIS = ['🌌', '🎁', '📸', '🐾', '🎂', '💌', '🎉'];

const menuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants: any = {
  hidden: { opacity: 0, x: -30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
  exit: { opacity: 0, x: 20, transition: { duration: 0.15 } },
};

const SceneMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const currentScene = useExperienceStore((s) => s.currentScene);
  const setScene = useExperienceStore((s) => s.setScene);

  const handleSelect = (index: number) => {
    setScene(index);
    setOpen(false);
  };

  const currentTitle = content.scenes[currentScene]?.title ?? '';

  return (
    <>
      {/* Toggle button — always visible at top-center */}
      <motion.button
        className="scene-menu-toggle"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-expanded={open}
        aria-controls="scene-menu-panel"
        aria-label={open ? 'Close scene menu' : 'Open scene menu'}
      >
        <span className="scene-menu-toggle__emoji">
          {SCENE_EMOJIS[currentScene]}
        </span>
        <span className="scene-menu-toggle__title">{currentTitle}</span>
        <motion.span
          className="scene-menu-toggle__chevron"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          aria-hidden
        >
          ▾
        </motion.span>
      </motion.button>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="scene-menu-panel"
            className="scene-menu-overlay"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="menu"
            aria-label="Scene menu"
          >
            <div className="scene-menu-list">
              {content.scenes.map((scene, i) => {
                const isCurrent = i === currentScene;
                return (
                  <motion.button
                    key={scene.id}
                    className={`scene-menu-item ${isCurrent ? 'scene-menu-item--active' : ''}`}
                    variants={itemVariants}
                    onClick={() => handleSelect(i)}
                    whileHover={{ scale: 1.04, x: 8 }}
                    whileTap={{ scale: 0.97 }}
                    role="menuitem"
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    <span className="scene-menu-item__emoji" aria-hidden>
                      {SCENE_EMOJIS[i]}
                    </span>
                    <span className="scene-menu-item__title">
                      {scene.title}
                    </span>
                    {isCurrent && (
                      <motion.span
                        className="scene-menu-item__indicator"
                        layoutId="menu-indicator"
                        transition={{
                          type: 'spring',
                          stiffness: 350,
                          damping: 28,
                        }}
                        aria-hidden
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Tap-outside to close */}
            <div
              className="scene-menu-backdrop"
              onClick={() => setOpen(false)}
              aria-hidden
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SceneMenu;
