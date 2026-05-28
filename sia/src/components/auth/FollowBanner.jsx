import { useState } from 'react';
import { ExternalLink, Check, X, Heart } from 'lucide-react';
import { claimFollow } from '../../services/auth';

const TARGET_HANDLE = 'ELPonyin';
const TARGET_URL = `https://x.com/${TARGET_HANDLE}`;

export default function FollowBanner({ profile, onClaimed }) {
  const [collapsed, setCollapsed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState(null);

  const handleClaim = async () => {
    if (!profile?.id) return;
    setClaiming(true);
    setError(null);
    try {
      await claimFollow(profile.id);
      onClaimed?.();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan. Coba lagi.');
      setClaiming(false);
    }
  };

  if (collapsed) {
    return (
      <button
        type="button"
        className="follow-banner-pill"
        onClick={() => setCollapsed(false)}
        title={`Follow @${TARGET_HANDLE} di X`}
      >
        <Heart size={14} />
        Follow @{TARGET_HANDLE}
      </button>
    );
  }

  return (
    <div className="follow-banner" role="region" aria-label="Ajak follow Ponyin di X">
      <div className="follow-banner-text">
        <Heart size={16} />
        <span>
          <strong>Dukung Ponyin:</strong> follow{' '}
          <span className="follow-banner-handle">@{TARGET_HANDLE}</span> di X agar sia tetap gratis.
          {error && <em style={{ color: '#ffb4ad', marginLeft: 8 }}>{error}</em>}
        </span>
      </div>
      <div className="follow-banner-actions">
        <a
          href={TARGET_URL}
          target="_blank"
          rel="noreferrer"
          className="primary"
        >
          <ExternalLink size={14} />
          Buka X
        </a>
        <button type="button" className="confirm" onClick={handleClaim} disabled={claiming}>
          <Check size={14} />
          {claiming ? 'Menyimpan...' : 'Saya sudah follow'}
        </button>
        <button type="button" className="skip" onClick={() => setCollapsed(true)} aria-label="Sembunyikan">
          <X size={14} />
          Nanti
        </button>
      </div>
    </div>
  );
}
