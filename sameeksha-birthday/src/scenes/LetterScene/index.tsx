import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import { soundManager } from '../../utils/audio';

const LetterScene: React.FC = () => {
  const nextScene = useExperienceStore((s) => s.nextScene);
  const letterSkipped = useExperienceStore((s) => s.letterSkipped);
  const setLetterSkipped = useExperienceStore((s) => s.setLetterSkipped);

  const fullText = content.letter.content;
  const [displayedLength, setDisplayedLength] = useState(letterSkipped ? fullText.length : 0);
  const isComplete = displayedLength >= fullText.length;

  useEffect(() => {
    if (letterSkipped) {
      setDisplayedLength(fullText.length);
      return;
    }

    const timer = setInterval(() => {
      setDisplayedLength((prev) => {
        if (prev >= fullText.length) {
          clearInterval(timer);
          return fullText.length;
        }
        return prev + 2;
      });
    }, 28);

    return () => clearInterval(timer);
  }, [fullText, letterSkipped]);

  const handleSkip = () => {
    setDisplayedLength(fullText.length);
    setLetterSkipped();
    soundManager.playTwinkle();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Overlay Container */}
      <div
        className="scene-overlay"
        style={{
          paddingTop: '3.5rem',
          paddingBottom: '5rem',
          pointerEvents: 'auto',
          overflowY: 'auto',
        }}
      >
        <motion.div
          className="scene-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: '680px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 className="scene-heading" style={{ fontSize: '1.8rem', margin: 0 }}>
              {content.letter.heading}
            </h2>
            {!isComplete && (
              <button
                className="magic-button magic-button-secondary magic-button-small"
                onClick={handleSkip}
                aria-label="Skip typing effect"
              >
                <span>Skip ⏩</span>
              </button>
            )}
          </div>

          {/* Styled Letter Box */}
          <div className="letter-container" tabIndex={0} aria-label="Personal birthday letter">
            <p className="letter-text">
              {fullText.slice(0, displayedLength)}
              {!isComplete && <span className="letter-cursor" />}
            </p>
          </div>

          {/* Continue button */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              className="magic-button"
              onClick={nextScene}
              aria-label="Proceed to the Grand Finale"
            >
              <span>Grand Finale Ahead 🎆 ✨</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LetterScene;
