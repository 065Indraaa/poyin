import { useEffect, useState } from 'react';
import { ExternalLink, Check, X, Heart, Loader2 } from 'lucide-react';
import { claimFollow, verifyFollowX } from '../../services/auth';
import { useAuth } from './AuthGate';

const TARGET_HANDLE = 'ponyin';
const TARGET_URL = `https://x.com/${TARGET_HANDLE}`;

export default function FollowBanner({ profile, onClaimed }) {
  const { session } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  // Auto-verify follow via X API begitu banner muncul
  useEffect(() => {
    const providerToken = session?.provider_token;
    if (!providerToken || !profile?.id) return;
    if (profile?.follow_claimed) return;

    let cancelled = false;
    setChecking(true);

    verifyFollowX(providerToken, TARGET_HANDLE)
      .then((result) => {
        if (cancelled) return;
        if (result?.ok && result?.isFollowing) {
          // Otomatis claim tanpa user klik apa-apa
          claimFollow(profile.id)
            .then(() => onClaimed?.())
            .catch(() => { /* silent: biarkan user claim manual */ });
        }
      })
      .catch(() => { /* silent: biarkan user claim manual */ })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => { cancelled = true; };
  }, [session?.provider_token, profile?.id, profile?.follow_claimed, onClaimed]);

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
          {checking && (
            <em style={{ color: 'var(--cyan)', marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Loader2 size={12} style={{ animation: 'auth-spin 1s linear infinite' }} />
              Memverifikasi follow...
            </em>
          )}
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
        <button type="button" className="confirm" onClick={handleClaim} disabled={claiming || checking}>
          <Check size={14} />
          {claiming ? 'Menyimpan...' : checking ? 'Memverifikasi...' : 'Saya sudah follow'}
        </button>
        <button type="button" className="skip" onClick={() => setCollapsed(true)} aria-label="Sembunyikan">
          <X size={14} />
          Nanti
        </button>
      </div>
    </div>
  );
}
