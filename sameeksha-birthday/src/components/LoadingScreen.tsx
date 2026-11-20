import { useEffect, useState } from 'react';
import { content } from '../content/siteContent';

interface Props {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(onComplete, 800);
          return 100;
        }
        return Math.min(p + Math.random() * 15 + 5, 100);
      });
    }, 200);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`loading-screen ${fadeOut ? "fade-out" : ""}`}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
      <div className="loading-text">{content.loading.text}</div>
      <div className="loading-bar-container">
        <div className="loading-bar" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
    </div>
  );
}
