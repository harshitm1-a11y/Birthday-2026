import React from 'react';
import { motion } from 'framer-motion';
import { useExperienceStore } from '../state/experienceStore';
import { content } from '../content/siteContent';

const TOTAL_SCENES = content.scenes.length;

const SceneNavigation: React.FC = () => {
  const currentScene = useExperienceStore((s) => s.currentScene);
  const visitedScenes = useExperienceStore((s) => s.visitedScenes);
  const setScene = useExperienceStore((s) => s.setScene);
  const nextScene = useExperienceStore((s) => s.nextScene);
  const prevScene = useExperienceStore((s) => s.prevScene);
  const isTransitioning = useExperienceStore((s) => s.isTransitioning);

  return (
    <nav className="scene-navigation" aria-label="Scene navigation">
      {/* Previous arrow */}
      <motion.button
        className="nav-arrow nav-arrow--prev"
        onClick={prevScene}
        disabled={currentScene === 0 || isTransitioning}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Previous scene"
      >
        ‹
      </motion.button>

      {/* Scene dots */}
      <div className="nav-dots" role="tablist" aria-label="Scene selector">
        {content.scenes.map((scene, i) => {
          const isCurrent = i === currentScene;
          const isVisited = visitedScenes.has(i);

          return (
            <motion.button
              key={scene.id}
              className={[
                'nav-dot',
                isCurrent && 'nav-dot--active',
                isVisited && 'nav-dot--visited',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setScene(i)}
              disabled={isTransitioning}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.85 }}
              role="tab"
              aria-selected={isCurrent}
              aria-label={scene.title}
              title={scene.title}
            >
              {isCurrent && (
                <motion.span
                  className="nav-dot__ring"
                  layoutId="scene-ring"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Next arrow */}
      <motion.button
        className="nav-arrow nav-arrow--next"
        onClick={nextScene}
        disabled={currentScene === TOTAL_SCENES - 1 || isTransitioning}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Next scene"
      >
        ›
      </motion.button>
    </nav>
  );
};

export default SceneNavigation;
