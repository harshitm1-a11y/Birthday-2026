import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '../utils/audio';

interface Props {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [isAssetReady, setIsAssetReady] = useState(false);

  // Love Gate Security Checkpoints
  const [loveText, setLoveText] = useState('');
  const [loveVerified, setLoveVerified] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // OTP Checkpoint (DDMM: 2311)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const showHint = true;

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 1. Initial Quick Asset Preloader
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsAssetReady(true);
          return 100;
        }
        return Math.min(p + 25, 100);
      });
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const finishLoading = useCallback(() => {
    setFadeOut(true);
    soundManager.initCtx();
    soundManager.playTrack('hindi-tum-hi-ho');
    soundManager.startAmbient();
    setTimeout(onComplete, 350);
  }, [onComplete]);

  // 2. Love Speech Recognition Handler
  const handleStartSpeech = () => {
    soundManager.initCtx();
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechError('Speech recognition not supported on this browser. Type "I love you" below! ✍️');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setSpeechError(null);

      recognition.onresult = (event: any) => {
        setIsListening(false);
        const transcript = event.results[0][0].transcript.toLowerCase();
        if (transcript.includes('love you') || transcript.includes('love u') || transcript.includes('meri jaan')) {
          setLoveVerified(true);
          soundManager.playPopperBurstSound();
        } else {
          setSpeechError(`Heard: "${transcript}". Please say "I Love You"! ❤️`);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSpeechError('Microphone not detected or permission denied. Please type it below! ❤️');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setSpeechError('Could not start microphone. Please type it below! ❤️');
    }
  };

  // 3. Text Love Input Handler
  const handleVerifyLoveText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    soundManager.initCtx();
    const clean = loveText.trim().toLowerCase();
    if (clean.includes('love you') || clean.includes('love u') || clean.includes('love u harshit') || clean.includes('i love you')) {
      setLoveVerified(true);
      soundManager.playPopperBurstSound();
      setSpeechError(null);
    } else {
      setSpeechError('Please write "I love you" to unlock Harshit\'s heart! ❤️');
    }
  };

  // 4. OTP Digit Changes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1);
    setOtpDigits(newOtp);
    setOtpError(false);

    // Auto focus next box
    if (value && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }

    const fullCode = newOtp.join('');
    if (fullCode.length === 4) {
      if (fullCode === '2311') {
        setOtpVerified(true);
        setOtpError(false);
        soundManager.playPopperCannonSound();
      } else {
        setOtpError(true);
        soundManager.playTwinkle();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const isGateUnlocked = loveVerified && otpVerified;

  return (
    <div
      className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'radial-gradient(circle at center, #1e1136 0%, #0d071a 70%, #05030a 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      {/* Background Animated Floating Hearts */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 19) % 100}vw`,
              y: '105vh',
              opacity: 0.15 + (i % 4) * 0.1,
              scale: 0.6 + (i % 3) * 0.4,
            }}
            animate={{
              y: '-10vh',
              rotate: [0, 45, -45, 0],
            }}
            transition={{
              duration: 8 + (i % 6) * 3,
              repeat: Infinity,
              ease: 'linear',
              delay: (i * 0.8) % 5,
            }}
            style={{
              position: 'absolute',
              color: i % 2 === 0 ? '#f43f5e' : '#fbbf24',
              fontSize: '1.6rem',
              filter: 'blur(0.5px)',
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px', textAlign: 'center' }}>
        {/* Fast Asset Preloader Stage */}
        {!isAssetReady ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '30px 10px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.8rem', animation: 'pulse 1.5s infinite' }}>✨</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fef08a', marginBottom: '1rem' }}>
              Crafting Sameeksha's Universe...
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                overflow: 'hidden',
                margin: '0 auto',
                maxWidth: '300px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #ec4899, #f59e0b)',
                  borderRadius: '10px',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
          </motion.div>
        ) : (
          /* Love Gate Security Authentication Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            style={{
              background: 'rgba(25, 15, 45, 0.92)',
              border: isGateUnlocked
                ? '2px solid rgba(52, 211, 153, 0.8)'
                : '1.5px solid rgba(251, 191, 36, 0.55)',
              borderRadius: '28px',
              padding: '24px 20px',
              boxShadow: isGateUnlocked
                ? '0 0 35px rgba(52, 211, 153, 0.45)'
                : '0 16px 45px rgba(0, 0, 0, 0.75), 0 0 25px rgba(244, 63, 94, 0.3)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Header Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.25), rgba(251, 191, 36, 0.25))',
                border: '1px solid rgba(251, 191, 36, 0.6)',
                borderRadius: '20px',
                padding: '4px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#fef08a',
                marginBottom: '10px',
              }}
            >
              <span>🔐 Harshit's Heart Security Gate</span>
            </div>

            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                margin: '0 0 6px 0',
                background: 'linear-gradient(135deg, #fff, #ffd1dc, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Sameeksha Baby ki Entry! 💖
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#fda4af', margin: '0 0 20px 0' }}>
              Harshit ki universe me enter karne ke liye 2 pyare se checkpoints:
            </p>

            {/* CHECKPOINT 1: VOICE / TEXT LOVE DECLARATION */}
            <div
              style={{
                background: loveVerified
                  ? 'rgba(52, 211, 153, 0.12)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: loveVerified
                  ? '1.5px solid rgba(52, 211, 153, 0.6)'
                  : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '14px',
                marginBottom: '18px',
                textAlign: 'left',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: loveVerified ? '#34d399' : '#fef08a' }}>
                  Step 1: Say or Type "I Love You" ❤️
                </span>
                {loveVerified && (
                  <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>
                    ✅ Verified!
                  </span>
                )}
              </div>

              {!loveVerified ? (
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <motion.button
                      type="button"
                      onClick={handleStartSpeech}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        flex: 1,
                        background: isListening
                          ? 'linear-gradient(135deg, #ef4444, #f59e0b)'
                          : 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '14px',
                        padding: '10px 12px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(236, 72, 153, 0.35)',
                      }}
                    >
                      <span>{isListening ? '🔴' : '🎙️'}</span>
                      <span>{isListening ? 'Listening...' : 'Bol kar bolo'}</span>
                    </motion.button>
                  </div>

                  <form onSubmit={handleVerifyLoveText} style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      value={loveText}
                      onChange={(e) => setLoveText(e.target.value)}
                      placeholder='Or type "I love you" here... ❤️'
                      style={{
                        flex: 1,
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(251, 191, 36, 0.4)',
                        borderRadius: '12px',
                        padding: '9px 12px',
                        color: '#fff',
                        fontSize: '0.84rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '9px 14px',
                        color: '#fff',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Send 💌
                    </button>
                  </form>

                  {speechError && (
                    <div style={{ color: '#fda4af', fontSize: '0.74rem', marginTop: '6px' }}>
                      {speechError}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: '0.84rem', color: '#a7f3d0', fontWeight: 600 }}>
                  Aww, Harshit loves you so much too meri jaan! 💕 🥰
                </div>
              )}
            </div>

            {/* CHECKPOINT 2: SECRET BIRTHDAY OTP (DDMM) */}
            <div
              style={{
                background: otpVerified
                  ? 'rgba(52, 211, 153, 0.12)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: otpVerified
                  ? '1.5px solid rgba(52, 211, 153, 0.6)'
                  : otpError
                  ? '1.5px solid #ef4444'
                  : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '14px',
                marginBottom: '20px',
                textAlign: 'left',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: otpVerified ? '#34d399' : '#fef08a' }}>
                  Step 2: Enter 4-Digit Secret Birthday OTP 🎂
                </span>
                {otpVerified && (
                  <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>
                    ✅ Key Matched!
                  </span>
                )}
              </div>

              {/* Special Hint Displayed Prominently as Requested */}
              {showHint && (
                <div
                  style={{
                    background: 'rgba(251, 191, 36, 0.14)',
                    border: '1px solid rgba(251, 191, 36, 0.45)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    fontSize: '0.78rem',
                    color: '#fef08a',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>💡</span>
                  <span>
                    <strong>Hint:</strong> Harshit ke liye sabse special din jo har saal aata hai... Sameeksha Baby ka Birthday! 🎂✨ (Format: <strong>DDMM</strong>)
                  </span>
                </div>
              )}

              {!otpVerified ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0' }}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        style={{
                          width: '48px',
                          height: '52px',
                          textAlign: 'center',
                          fontSize: '1.4rem',
                          fontWeight: 800,
                          color: '#fef08a',
                          background: 'rgba(0, 0, 0, 0.45)',
                          border: otpError
                            ? '2px solid #ef4444'
                            : digit
                            ? '2px solid rgba(251, 191, 36, 0.8)'
                            : '1.5px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '14px',
                          outline: 'none',
                          boxShadow: digit ? '0 0 10px rgba(251, 191, 36, 0.3)' : 'none',
                        }}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <div style={{ color: '#fda4af', fontSize: '0.76rem', textAlign: 'center', marginTop: '6px' }}>
                      Oops! Harshit ka sabse special din socho... 23 November (2311)! 😉❤️
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: '0.84rem', color: '#a7f3d0', fontWeight: 600 }}>
                  2311 Accepted! Sameeksha's 23rd Birthday Key Unlocked! 🎉🎂
                </div>
              )}
            </div>

            {/* UNLOCK / ENTER BUTTON */}
            <motion.button
              type="button"
              onClick={finishLoading}
              disabled={!isGateUnlocked}
              whileHover={isGateUnlocked ? { scale: 1.05 } : {}}
              whileTap={isGateUnlocked ? { scale: 0.95 } : {}}
              style={{
                width: '100%',
                background: isGateUnlocked
                  ? 'linear-gradient(135deg, #10b981, #059669, #0284c7)'
                  : 'rgba(255, 255, 255, 0.12)',
                border: isGateUnlocked
                  ? '2px solid rgba(251, 191, 36, 0.9)'
                  : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '24px',
                padding: '14px',
                color: isGateUnlocked ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                fontSize: '1.02rem',
                fontWeight: 800,
                cursor: isGateUnlocked ? 'pointer' : 'not-allowed',
                boxShadow: isGateUnlocked
                  ? '0 8px 25px rgba(16, 185, 129, 0.55), 0 0 20px rgba(251, 191, 36, 0.35)'
                  : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
              }}
            >
              <span>{isGateUnlocked ? '✨' : '🔒'}</span>
              <span>{isGateUnlocked ? 'Enter Harshit\'s Universe 💖' : 'Unlock Both Steps Above'}</span>
              <span>{isGateUnlocked ? '✨' : ''}</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
