import { useState, useEffect } from 'react';

const WA_NUMBER = '6281776411255'; // format internasional tanpa "+"
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

        <div className="coinfes
