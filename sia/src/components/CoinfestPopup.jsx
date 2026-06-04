import { useState, useEffect } from 'react';

const COINFEST_URL = 'https://coinfest.asia/with/Ponyin';
const MAPS_URL = 'https://maps.app.goo.gl/C6TpG4u5eEZMZgvk7';
const LOGO_SRC = `${import.meta.env.BASE_URL}coinfest.png`;

export default function CoinfestPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 200);
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) dismiss();
  };

  if (!visible) return null;

  return (
    <div className={`coinfest-overlay${closing ? ' coinfest-out' : ''}`} onClick={handleBackdrop}>
      <div className={`coinfest-popup${closing ? ' coinfest-popout' : ''}`} role="dialog" aria-modal="true" aria-label="Coinfest Asia 2026">

        <button type="button" className="coinfest-close" onClick={dismiss} aria-label="Tutup">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="4" y1="4" x2="14" y2="14" />
            <line x1="14" y1="4" x2="4" y2="14" />
          </svg>
        </button>

        <img
          src={LOGO_SRC}
          alt="Coinfest Asia"
          className="coinfest-logo"
          draggable="false"
        />

        <div className="coinfest-divider" />

        <p className="coinfest-kicker">Ponyin akan hadir di</p>
        <h2 className="coinfest-title">Coinfest Asia 2026</h2>

        <div className="coinfest-date-badge">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          20 – 21 Agustus 2026
        </div>

        <p className="coinfest-location">
          Pantai Melasti, Bali{' '}
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">(lihat peta ↗)</a>
        </p>

        <a
          href={COINFEST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="coinfest-cta"
        >
          Info & Tiket → coinfest.asia
        </a>

        <button type="button" className="coinfest-skip" onClick={dismiss}>
          Tutup
        </button>
      </div>
    </div>
  );
}
