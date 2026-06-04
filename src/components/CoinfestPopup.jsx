import { useState, useEffect } from 'react';

const STORAGE_KEY = 'coinfest_popup_dismissed';
const COINFEST_URL = 'https://coinfest.asia/with/Ponyin';

export default function CoinfestPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Tampilkan setelah delay kecil supaya tidak muncul instant
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, '1');
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) dismiss();
  };

  if (!visible) return null;

  return (
    <div className="coinfest-overlay" onClick={handleBackdrop}>
      <div className="coinfest-popup" role="dialog" aria-modal="true" aria-label="Coinfest Event">
        {/* Close button */}
        <button
          type="button"
          className="coinfest-close"
          onClick={dismiss}
          aria-label="Tutup popup"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="5" y1="5" x2="15" y2="15" />
            <line x1="15" y1="5" x2="5" y2="15" />
          </svg>
        </button>

        {/* Glow orb */}
        <div className="coinfest-glow" />

        {/* Badge */}
        <div className="coinfest-badge">
          <span className="coinfest-pulse" />
          Offline Event Soon
        </div>

        {/* Logo / icon area */}
        <div className="coinfest-icon-wrap">
          <div className="coinfest-icon">
            <span className="coinfest-icon-text">CF</span>
          </div>
        </div>

        {/* Content */}
        <h2 className="coinfest-title">
          Coinfest Asia 2026
        </h2>
        <p className="coinfest-desc">
          Meet <strong>Ponyin</strong> langsung di <strong>Coinfest Asia</strong>!
          Datang dan sambungkan jaringan dengan komunitas trader on-chain terbaik se-Asia.
        </p>

        {/* Info pills */}
        <div className="coinfest-pills">
          <div className="coinfest-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Coming Soon
          </div>
          <div className="coinfest-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Bali / Jakarta
          </div>
        </div>

        {/* CTA */}
        <a
          href={COINFEST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="coinfest-cta"
        >
          Kunjungi coinfest.asia
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>

        <button
          type="button"
          className="coinfest-skip"
          onClick={dismiss}
        >
          Nanti saja
        </button>
      </div>
    </div>
  );
}
