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

  // Checkpoint 2: Two Options (Option A: 2311, Option B: 198143_)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [cypherDigit, setCypherDigit] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [cypherError, setCypherError] = useState(false);
  const [verifiedMethod, setVerifiedMethod] = useState<'birthday' | 'cypher' | null>(null);

  // Hidden Hints by Default (Shown only when Hint Button is clicked!)
  const [showHintA, setShowHintA] = useState(false);
  const [showHintB, setShowHintB] = useState(false);

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

  // 4. Option A: Birthday OTP Digit Changes (2311)
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
        setVerifiedMethod('birthday');
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

  // 5. Option B: Cypher Guess Change (Missing digit in 198143_ -> 2)
  const handleCypherChange = (value: string) => {
    setCypherDigit(value);
    setCypherError(false);

    const clean = value.trim();
    if (clean === '2' || clean === '1981432') {
      setOtpVerified(true);
      setVerifiedMethod('cypher');
      setCypherError(false);
      soundManager.playPopperCannonSound();
    } else if (clean.length > 0) {
      setCypherError(true);
      soundManager.playTwinkle();
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
        padding: '16px',
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

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '490px', textAlign: 'center' }}>
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
              background: 'rgba(25, 15, 45, 0.94)',
              border: isGateUnlocked
                ? '2px solid rgba(52, 211, 153, 0.8)'
                : '1.5px solid rgba(251, 191, 36, 0.55)',
              borderRadius: '28px',
              padding: '22px 18px',
              boxShadow: isGateUnlocked
                ? '0 0 35px rgba(52, 211, 153, 0.45)'
                : '0 16px 45px rgba(0, 0, 0, 0.75), 0 0 25px rgba(244, 63, 94, 0.3)',
              backdropFilter: 'blur(16px)',
              maxHeight: '92vh',
              overflowY: 'auto',
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
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#fef08a',
                marginBottom: '8px',
              }}
            >
              <span>🔐 Harshit's Heart Security Gate</span>
            </div>

            <h2
              style={{
                fontSize: '1.38rem',
                fontWeight: 800,
                margin: '0 0 4px 0',
                background: 'linear-gradient(135deg, #fff, #ffd1dc, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Sameeksha Baby ki Entry! 💖
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#fda4af', margin: '0 0 16px 0' }}>
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
                borderRadius: '18px',
                padding: '12px 14px',
                marginBottom: '14px',
                textAlign: 'left',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: loveVerified ? '#34d399' : '#fef08a' }}>
                  Step 1: Say or Type "I Love You" ❤️
                </span>
                {loveVerified && (
                  <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>
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
                        padding: '9px 12px',
                        fontSize: '0.8rem',
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
                        padding: '8px 12px',
                        color: '#fff',
                        fontSize: '0.82rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '8px 14px',
                        color: '#fff',
                        fontSize: '0.8rem',
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
                <div style={{ fontSize: '0.82rem', color: '#a7f3d0', fontWeight: 600 }}>
                  Aww, Harshit loves you so much too meri jaan! 💕 🥰
                </div>
              )}
            </div>

            {/* CHECKPOINT 2: SECRET KEY (OPTION A or OPTION B) */}
            <div
              style={{
                background: otpVerified
                  ? 'rgba(52, 211, 153, 0.12)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: otpVerified
                  ? '1.5px solid rgba(52, 211, 153, 0.6)'
                  : (otpError || cypherError)
                  ? '1.5px solid #ef4444'
                  : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '18px',
                padding: '14px',
                marginBottom: '18px',
                textAlign: 'left',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: otpVerified ? '#34d399' : '#fef08a' }}>
                  Step 2: Enter Secret Key (Kisi Ek Se Unlock Karein) 🔐
                </span>
                {otpVerified && (
                  <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>
                    ✅ Key Matched!
                  </span>
                )}
              </div>

              {!otpVerified ? (
                <div>
                  {/* OPTION A: 4-Digit Birthday OTP */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.28)',
                      border: '1px solid rgba(251, 191, 36, 0.25)',
                      borderRadius: '16px',
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fef08a' }}>
                        🎂 Option A: 4-Digit Birthday OTP
                      </span>
                      {/* Hint Button for Option A */}
                      <button
                        type="button"
                        onClick={() => setShowHintA((prev) => !prev)}
                        style={{
                          background: showHintA ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(251, 191, 36, 0.5)',
                          borderRadius: '12px',
                          padding: '2px 8px',
                          color: '#fef08a',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        💡 {showHintA ? 'Hide Hint' : 'Hint'}
                      </button>
                    </div>

                    {/* Hint A (Visible ONLY after clicking hint button) */}
                    {showHintA && (
                      <div
                        style={{
                          background: 'rgba(251, 191, 36, 0.15)',
                          border: '1px solid rgba(251, 191, 36, 0.4)',
                          borderRadius: '10px',
                          padding: '6px 10px',
                          fontSize: '0.72rem',
                          color: '#fef08a',
                          marginBottom: '8px',
                          lineHeight: 1.4,
                        }}
                      >
                        <strong>💡 Hint:</strong> Harshit ke liye sabse special din jo har saal aata hai... Sameeksha Baby ka Birthday! 🎂✨ (Format: <strong>DDMM</strong>)
                      </div>
                    )}

                    {/* 4 Digit Boxes */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '4px 0' }}>
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
                          placeholder="•"
                          style={{
                            width: '40px',
                            height: '44px',
                            textAlign: 'center',
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            color: '#fef08a',
                            background: 'rgba(0, 0, 0, 0.5)',
                            border: otpError
                              ? '1.5px solid #ef4444'
                              : digit
                              ? '1.5px solid rgba(251, 191, 36, 0.8)'
                              : '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            outline: 'none',
                          }}
                        />
                      ))}
                    </div>

                    {otpError && (
                      <div style={{ color: '#fda4af', fontSize: '0.72rem', textAlign: 'center', marginTop: '4px' }}>
                        Oops! Special din socho... 23 November (2311)! 😉❤️
                      </div>
                    )}
                  </div>

                  {/* OR SEPARATOR */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.18)' }} />
                    <span style={{ fontSize: '0.72rem', color: '#fda4af', fontWeight: 800, letterSpacing: '1px' }}>
                      — YA PHIR / OR —
                    </span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.18)' }} />
                  </div>

                  {/* OPTION B: LOVE CYPHER 198143_ */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.28)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      borderRadius: '16px',
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fef08a' }}>
                        💖 Option B: Secret Love Code
                      </span>
                      {/* Hint Button for Option B */}
                      <button
                        type="button"
                        onClick={() => setShowHintB((prev) => !prev)}
                        style={{
                          background: showHintB ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(244, 63, 94, 0.5)',
                          borderRadius: '12px',
                          padding: '2px 8px',
                          color: '#fda4af',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        💡 {showHintB ? 'Hide Hint' : 'Hint'}
                      </button>
                    </div>

                    {/* Hint B (Visible ONLY after clicking hint button) */}
                    {showHintB && (
                      <div
                        style={{
                          background: 'rgba(244, 63, 94, 0.15)',
                          border: '1px solid rgba(244, 63, 94, 0.4)',
                          borderRadius: '10px',
                          padding: '6px 10px',
                          fontSize: '0.72rem',
                          color: '#fef08a',
                          marginBottom: '8px',
                          lineHeight: 1.4,
                        }}
                      >
                        <strong>💡 Hint:</strong> Reply of "I love you" ❤️ (I love you _____?)
                      </div>
                    )}

                    {/* Box showing 198143_ */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', margin: '6px 0' }}>
                      {['1', '9', '8', '1', '4', '3'].map((num, i) => (
                        <div
                          key={i}
                          style={{
                            width: '30px',
                            height: '38px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                            fontWeight: 800,
                            color: '#fef08a',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(251, 191, 36, 0.35)',
                            borderRadius: '10px',
                          }}
                        >
                          {num}
                        </div>
                      ))}

                      {/* The Missing Digit "_" Input */}
                      <input
                        type="text"
                        maxLength={1}
                        value={cypherDigit}
                        onChange={(e) => handleCypherChange(e.target.value)}
                        placeholder="_"
                        style={{
                          width: '34px',
                          height: '38px',
                          textAlign: 'center',
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: '#fff',
                          background: 'rgba(244, 63, 94, 0.35)',
                          border: cypherError
                            ? '2px solid #ef4444'
                            : cypherDigit
                            ? '2px solid #34d399'
                            : '2px dashed #f43f5e',
                          borderRadius: '10px',
                          outline: 'none',
                          boxShadow: '0 0 10px rgba(244, 63, 94, 0.4)',
                        }}
                      />
                    </div>

                    {/* Heart Underneath as requested */}
                    <div style={{ textAlign: 'center', marginTop: '2px' }}>
                      <motion.span
                        animate={{ scale: [1, 1.25, 1] }}
                        transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
                        style={{ display: 'inline-block', fontSize: '1.45rem' }}
                      >
                        ❤️
                      </motion.span>
                      <div style={{ fontSize: '0.7rem', color: '#fda4af' }}>
                        Guess the missing number in <strong>" _ "</strong>!
                      </div>
                    </div>

                    {cypherError && (
                      <div style={{ color: '#fda4af', fontSize: '0.72rem', textAlign: 'center', marginTop: '4px' }}>
                        Think: Reply of "I love you" is "I love you ___" 😉❤️ (Hint: 2)
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.84rem', color: '#a7f3d0', fontWeight: 600 }}>
                  {verifiedMethod === 'cypher'
                    ? '1981432 Accepted! "I Love You Too" ❤️ Harshit\'s Heart Unlocked! 🎉'
                    : '2311 Accepted! Sameeksha\'s Birthday Key Unlocked! 🎉🎂'}
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
                padding: '13px',
                color: isGateUnlocked ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                fontSize: '1rem',
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
