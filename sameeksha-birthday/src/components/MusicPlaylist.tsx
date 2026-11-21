import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager, PLAYLIST_TRACKS, type PlaylistTrack } from '../utils/audio';

type MusicCategory = 'all' | 'hindi' | 'punjabi' | 'theme' | 'birthday' | 'party';

export const MusicPlaylist: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(soundManager.isPlaying());
  const [currentTrack, setCurrentTrack] = useState<PlaylistTrack>(soundManager.getCurrentTrack());
  const [activeCategory, setActiveCategory] = useState<MusicCategory>('all');
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
    if (activeCategory === 'hindi') return t.category === 'hindi';
    if (activeCategory === 'punjabi') return t.category === 'punjabi';
    if (activeCategory === 'theme') return t.category === 'theme';
    if (activeCategory === 'birthday') return t.category === 'birthday' || t.id === 'bollywood-birthday';
    if (activeCategory === 'party') return t.category === 'party';
    return true;
  });

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'hindi':
        return '🇮🇳';
      case 'punjabi':
        return '🥁';
      case 'theme':
        return '🎹';
      case 'birthday':
        return '🎂';
      case 'party':
        return '🎉';
      default:
        return '🎵';
    }
  };

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
              color: 'rgba(255, 255, 255, 0.65)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>{currentTrack.artist}</span>
            {isPlaying && (
              <span style={{ color: '#34d399', fontSize: '0.6rem' }}>● Playing</span>
            )}
          </div>
        </div>

        {/* Quick Play/Pause Button */}
        <button
          type="button"
          onClick={handleTogglePlay}
          style={{
            background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            border: `1px solid ${isPlaying ? '#ef4444' : '#10b981'}`,
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '0.75rem',
            marginLeft: '4px',
          }}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </motion.div>

      {/* Full Music Playlist Drawer Modal */}
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
                background: 'linear-gradient(135deg, rgba(22, 14, 45, 0.98), rgba(12, 8, 28, 0.98))',
                borderRadius: '24px',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(251, 191, 36, 0.15)',
                overflow: 'hidden',
                color: '#fff',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.6rem' }}>🎵</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fbbf24' }}>
                      Birthday Playlist
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                      Curated Hindi, Punjabi & Theme BGM for Sameeksha Baby 💖
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
                  { id: 'all', label: 'All' },
                  { id: 'hindi', label: '🇮🇳 Real Hindi' },
                  { id: 'punjabi', label: '🥁 Punjabi Hits' },
                  { id: 'theme', label: '🎹 Theme & BGM' },
                  { id: 'birthday', label: '🎂 Birthday' },
                  { id: 'party', label: '🎉 Party' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id as MusicCategory)}
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
                          {getCategoryEmoji(track.category)}
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
                          <div
                            style={{
                              fontSize: '0.72rem',
                              color: 'rgba(255, 255, 255, 0.6)',
                            }}
                          >
                            {track.artist} • {track.description}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                          {track.duration}
                        </span>
                        {isCurrent && isPlaying ? (
                          <span style={{ color: '#fbbf24', fontSize: '1rem' }}>🔊</span>
                        ) : (
                          <span style={{ opacity: 0.4, fontSize: '0.85rem' }}>▶</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Master Volume Slider & Controls */}
              <div
                style={{
                  padding: '16px 20px',
                  background: 'rgba(0, 0, 0, 0.35)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                {/* Previous / Play / Next Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => soundManager.prevTrack()}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
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
                      width: '40px',
                      height: '40px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                    }}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>

                  <button
                    type="button"
                    onClick={() => soundManager.nextTrack()}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                    title="Next Song"
                  >
                    ⏭
                  </button>
                </div>

                {/* Volume Slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '160px' }}>
                  <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>🔈</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    style={{
                      flex: 1,
                      accentColor: '#fbbf24',
                      cursor: 'pointer',
                    }}
                    aria-label="Volume slider"
                  />
                  <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>🔊</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
