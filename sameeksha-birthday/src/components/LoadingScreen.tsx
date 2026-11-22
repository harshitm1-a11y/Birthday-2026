import { useEffect, useState, useCallback } from 'react';
import { content } from '../content/siteContent';
import { soundManager } from '../utils/audio';

interface Props {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const finishLoading = useCallback(() => {
    setFadeOut(true);
    soundManager.initCtx();
    soundManager.playTrack('hindi-tum-hi-ho');
    soundManager.startAmbient();
    setTimeout(onComplete, 180);
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          finishLoading();
          return 100;
        }
        return Math.min(p + 18, 100);
      });
    }, 28);
    return () => clearInterval(interval);
  }, [finishLoading]);

  return (
    <div
      className={`loading-screen ${fadeOut ? "fade-out" : ""}`}
      onClick={finishLoading}
      style={{ cursor: 'pointer' }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
      <div className="loading-text">{content.loading.text}</div>
      <div className="loading-bar-container">
        <div className="loading-bar" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <div
        style={{
          marginTop: '1.2rem',
          fontSize: '0.88rem',
          color: 'rgba(251, 191, 36, 0.85)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}
      >
        ✨ Tap anywhere to enter ✨
      </div>
    </div>
  );
}
