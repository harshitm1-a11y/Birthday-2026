import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager, PLAYLIST_TRACKS, type PlaylistTrack } from '../utils/audio';

export const MusicPlaylist: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(soundManager.isPlaying());
  const [currentTrack, setCurrentTrack] = useState<PlaylistTrack>(soundManager.getCurrentTrack());
  const [activeCategory, setActiveCategory] = useState<'all' | 'birthday' | 'party' | 'romantic' | 'soft'>('all');
  const [volume, setVolume] = useState(soundManager.getVolume());

  useEffect(() => {
    const unsubscribe = soundManager.subscribe(() => {
      setIsPlaying(soundManager.isPlaying());
      setCurrentTrack(soundManager.getCurrentTrack());
      setVolume(soundManager.getVolume());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.toggleAmbient();
  };

  const handleSelectTrack = (trackId: string) => {
    soundManager.playTrack(trackId);
    if (!soundManager.isPlaying()) {
      soundManager.startAmbient();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundManager.setVolume(val);
  };

  const filteredTracks = PLAYLIST_TRACKS.filter((t) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'romantic' || activeCategory === 'soft') {
      return t.category === 'romantic' || t.category === 'soft';
    }
    return t.category === activeCategory;
  });

  return (
    <>
      {/* Floating Music Mini Player Pill at Top-Right */}
      <motion.div
        className="music-floating-pill"
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(15, 12, 34, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(251, 191, 36, 0.35)',
          boxShadow: isPlaying ? '0 0 20px rgba(251, 191, 36, 0.25)' : '0 4px 12px rgba(0,0,0,0.4)',
          borderRadius: '9999px',
          padding: '6px 14px 6px 8px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        {/* Rotating Vinyl Icon */}
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{
            repeat: isPlaying ? Infinity : 0,
            duration: 3,
            ease: 'linear',
          }}
          style={{
            fontSize: '1.4rem',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          💿
        </motion.div>

        {/* Current Song Title & Wave Indicator */}
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '170px' }}>
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#fbbf24',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentTrack.title}
          </div>
          <div
            style={{
              fontSize: '0.68rem',
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {isPlaying ? (
              <span style={{ color: '#34d399', letterSpacing: '1px' }}>ılıılı Playing</span>
            ) : (
              <span style={{ color: '#9ca3af' }}>Paused • Tap for Playlist</span>
            )}
          </div>
        </div>

        {/* Quick Play/Pause Button */}
        <button
          type="button"
          onClick={handleTogglePlay}
          style={{
            background: isPlaying ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            color: '#fbbf24',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '0.85rem',
            marginLeft: '4px',
          }}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </motion.div>

      {/* Playlist Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              padding: '16px',
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                width: '100%',
                maxWidth: '460px',
                background: 'linear-gradient(135deg, rgba(26, 16, 50, 0.95), rgba(13, 10, 31, 0.98))',
                borderRadius: '24px',
                border: '1px solid rgba(251, 191, 36, 0.35)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(251, 191, 36, 0.15)',
                overflow: 'hidden',
                color: '#fff',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎵</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fbbf24' }}>
                      Birthday Playlist
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                      Special songs curated for Sameeksha Baby 💖
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Category Filter Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  padding: '12px 18px',
                  overflowX: 'auto',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {[
                  { id: 'all', label: 'All Songs' },
                  { id: 'birthday', label: '🎂 Birthday' },
                  { id: 'party', label: '🎉 Party Beats' },
                  { id: 'romantic', label: '💖 Romantic / Soft' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id as any)}
                    style={{
                      background:
                        activeCategory === tab.id
                          ? 'linear-gradient(135deg, #f59e0b, #ec4899)'
                          : 'rgba(255, 255, 255, 0.08)',
                      color: activeCategory === tab.id ? '#fff' : 'rgba(255, 255, 255, 0.75)',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '5px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Track List */}
              <div
                style={{
                  maxHeight: '260px',
                  overflowY: 'auto',
                  padding: '8px 12px',
                }}
              >
                {filteredTracks.map((track) => {
                  const isCurrent = currentTrack.id === track.id;
                  return (
                    <motion.div
                      key={track.id}
                      onClick={() => handleSelectTrack(track.id)}
                      whileHover={{ scale: 1.01, background: 'rgba(255, 255, 255, 0.08)' }}
                      whileTap={{ scale: 0.99 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '14px',
                        marginBottom: '6px',
                        cursor: 'pointer',
                        background: isCurrent ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: isCurrent
                          ? '1px solid rgba(251, 191, 36, 0.5)'
                          : '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.25rem' }}>
                          {track.category === 'birthday' ? '🎂' : track.category === 'party' ? '💃' : '💖'}
                        </span>
                        <div>
                          <div
                            style={{
                              fontSize: '0.88rem',
                              fontWeight: 600,
                              color: isCurrent ? '#fbbf24' : '#fff',
                            }}
                          >
                            {track.title}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                            {track.artist} • {track.description}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isCurrent && isPlaying ? (
                          <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                            Playing
                          </span>
                        ) : null}
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'rgba(255, 255, 255, 0.5)',
                            padding: '2px 6px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            borderRadius: '6px',
                          }}
                        >
                          {track.duration}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom Player Controls & Volume */}
              <div
                style={{
                  padding: '16px 20px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {/* Control Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                  <button
                    type="button"
                    onClick={() => soundManager.prevTrack()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fbbf24',
                      fontSize: '1.3rem',
                      cursor: 'pointer',
                    }}
                    title="Previous Song"
                  >
                    ⏮
                  </button>

                  <button
                    type="button"
                    onClick={() => soundManager.toggleAmbient()}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '46px',
                      height: '46px',
                      color: '#fff',
                      fontSize: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                    }}
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>

                  <button
                    type="button"
                    onClick={() => soundManager.nextTrack()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fbbf24',
                      fontSize: '1.3rem',
                      cursor: 'pointer',
                    }}
                    title="Next Song"
                  >
                    ⏭
                  </button>
                </div>

                {/* Volume Slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#fbbf24' }}>
                    {volume === 0 ? '🔇' : volume < 0.4 ? '🔉' : '🔊'}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={volume}
                    onChange={handleVolumeChange}
                    style={{
                      flex: 1,
                      accentColor: '#fbbf24',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', width: '32px' }}>
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
