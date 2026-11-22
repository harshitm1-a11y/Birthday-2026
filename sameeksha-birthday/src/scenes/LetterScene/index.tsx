import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../state/experienceStore';
import { content } from '../../content/siteContent';
import { soundManager } from '../../utils/audio';
import { robotSpeaker } from '../../utils/speech';

const LetterScene: React.FC = () => {
  const nextScene = useExperienceStore((s) => s.nextScene);
  const letterSkipped = useExperienceStore((s) => s.letterSkipped);
  const setLetterSkipped = useExperienceStore((s) => s.setLetterSkipped);

  const [language, setLanguage] = useState<'hindi' | 'english'>('english');
  const [isReadingVoice, setIsReadingVoice] = useState(false);

  const fullText = language === 'english' ? content.letter.english : content.letter.hindi;
  const [displayedLength, setDisplayedLength] = useState(letterSkipped ? fullText.length : 0);
  const isComplete = displayedLength >= fullText.length;

  // Typewriter effect
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
    }, 24);

    return () => clearInterval(timer);
  }, [fullText, letterSkipped]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      robotSpeaker.stop();
    };
  }, []);

  const handleSkip = () => {
    setDisplayedLength(fullText.length);
    setLetterSkipped();
    soundManager.playTwinkle();
  };

  const handleSwitchLanguage = (lang: 'hindi' | 'english') => {
    if (lang === language) return;
    soundManager.playTwinkle();
    setLanguage(lang);
    const targetText = lang === 'english' ? content.letter.english : content.letter.hindi;
    setDisplayedLength(targetText.length); // instant show when user switches language
    setLetterSkipped();

    // If reading voice was active, switch speech
    if (isReadingVoice) {
      robotSpeaker.speak(targetText);
    }
  };

  const handleToggleVoiceRead = () => {
    if (isReadingVoice) {
      robotSpeaker.stop();
      setIsReadingVoice(false);
    } else {
      setIsReadingVoice(true);
      robotSpeaker.speak(fullText, language === 'english' ? content.letter.english : content.letter.hindi);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Overlay Container */}
      <div
        className="scene-overlay"
        style={{
          paddingTop: '3.5rem',
          paddingBottom: '5.5rem',
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
          {/* Header & Controls Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <h2 className="scene-heading" style={{ fontSize: '1.8rem', margin: 0 }}>
              {content.letter.heading}
            </h2>

            {/* Language Switcher Buttons (Hindi / English) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '4px',
                borderRadius: '24px',
                border: '1px solid rgba(251, 191, 36, 0.35)',
              }}
            >
              <button
                type="button"
                onClick={() => handleSwitchLanguage('hindi')}
                style={{
                  background:
                    language === 'hindi'
                      ? 'linear-gradient(135deg, #f59e0b, #ec4899)'
                      : 'transparent',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '5px 14px',
                  color: language === 'hindi' ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Hindi
              </button>

              <button
                type="button"
                onClick={() => handleSwitchLanguage('english')}
                style={{
                  background:
                    language === 'english'
                      ? 'linear-gradient(135deg, #f59e0b, #ec4899)'
                      : 'transparent',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '5px 14px',
                  color: language === 'english' ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                English
              </button>
            </div>
          </div>

          {/* Quick Voice Read & Skip Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '8px',
              marginBottom: '0.6rem',
            }}
          >
            <button
              type="button"
              className="magic-button magic-button-secondary magic-button-small"
              onClick={handleToggleVoiceRead}
              style={{ fontSize: '0.78rem', padding: '0.3rem 0.8rem' }}
              title="Voice narration of letter"
            >
              <span>{isReadingVoice ? '⏹ Stop Voice' : '🗣️ Listen to Letter'}</span>
            </button>

            {!isComplete && (
              <button
                type="button"
                className="magic-button magic-button-secondary magic-button-small"
                onClick={handleSkip}
                style={{ fontSize: '0.78rem', padding: '0.3rem 0.8rem' }}
                aria-label="Skip typing effect"
              >
                <span>Skip ⏩</span>
              </button>
            )}
          </div>

          {/* Styled Letter Box */}
          <AnimatePresence mode="wait">
            <motion.div
              key={language}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="letter-container"
              tabIndex={0}
              aria-label="Personal birthday letter"
            >
              <p className="letter-text" style={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                {fullText.slice(0, displayedLength)}
                {!isComplete && <span className="letter-cursor" />}
              </p>
            </motion.div>
          </AnimatePresence>

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
