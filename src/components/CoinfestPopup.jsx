import { useState, useEffect } from 'react';

const WA_NUMBER = '6281776411255';
const WA_MESSAGE = 'Halo, saya mau tanya soal cairin kripto instant';
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
const LOGO_SRC = '/coinfest.png';

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
      <div className={`coinfest-popup${closing ? ' coinfest-popout' : ''}`} role="dialog" aria-modal="true" aria-label="Cairin Kripto Instant">

        <button type="button" className="coinfest-close" onClick={dismiss} aria-label="Tutup">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="4" y1="4" x2="14" y2="14" />
            <line x1="14" y1="4" x2="4" y2="14" />
          </svg>
        </button>

        <img
          src={LOGO_SRC}
          alt="Admin"
          className="coinfest-logo"
          draggable="false"
        />

        <div className="coinfest-divider" />

        <p className="coinfest-kicker">Mau cairin kripto instant?</p>
        <h2 className="coinfest-title">Wa Admin</h2>

        <div className="coinfest-date-badge">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          +62 817-7641-1255
        </div>

        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="coinfest-cta"
        >
          Chat via WhatsApp
        </a>

        <button type="button" className="coinfest-skip" onClick={dismiss}>
          Tutup
        </button>
      </div>
    </div>
  );
}
