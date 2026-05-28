import { useState } from 'react';
import { Activity, Gauge, Microscope, BookOpen } from 'lucide-react';
import { signInWithX, isSupabaseConfigured } from '../../services/auth';

const TARGET_HANDLE = 'ELPonyin';

const TEASERS = [
  {
    icon: Activity,
    title: 'Feed Token Live',
    text: 'Stream real-time dari DexScreener, PumpPortal, dan Pump.fun. Filter pipeline: Runner, New, Early, Soon, Migrated, Dead.'
  },
  {
    icon: Gauge,
    title: 'Ape Meter',
    text: 'Skor 0–100 berbasis 5 lapis analisis Ponyin: contract, holder, volume, marketing, candle. Plus verdict instan.'
  },
  {
    icon: Microscope,
    title: 'Forensic Panel',
    text: 'Deteksi rug, runner, bundle dev, top holder cluster, LP health, wash trading, dan timing exit liquidity.'
  },
  {
    icon: BookOpen,
    title: 'Knowledge Engine',
    text: 'Setiap verdict berakar pada materi Ponyin Trading (Bundle, Global Fees, Authority, Dex Paid, Candle, Holder).'
  }
];

export default function LandingLogin() {
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!isSupabaseConfigured) {
      setError('Auth belum dikonfigurasi. Set VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env.');
      return;
    }
    setError(null);
    setSigningIn(true);
    try {
      await signInWithX();
    } catch (err) {
      setError(err.message || 'Login gagal. Coba lagi.');
      setSigningIn(false);
    }
  };

  return (
    <div className="landing-shell">
      <header className="landing-header">
        <div className="landing-brand">
          <div className="landing-brand-mark">SI</div>
          <div className="landing-brand-text">
            <strong>Should I Ape?</strong>
            <small>Ponyin Decision Engine</small>
          </div>
        </div>
        <span className="landing-status">Live data aktif</span>
      </header>

      <section className="landing-hero">
        <span className="landing-eyebrow">AI Decision Engine · Solana Memecoin</span>
        <h1>
          Scanner real-time untuk trader yang <span>tidak mau jadi exit liquidity</span>.
        </h1>
        <p>
          5 lapis analisis on-chain: keamanan kontrak, deteksi bundle dev, integritas volume,
          timing marketing, dan konfirmasi dip teknis. Data dihimpun dari DexScreener, Solana RPC,
          PumpPortal stream, dan Pump.fun frontend.
        </p>

        <div className="landing-cta">
          <button
            type="button"
            className="x-login-button"
            onClick={handleLogin}
            disabled={signingIn}
          >
            <XLogo />
            {signingIn ? 'Mengarahkan ke X...' : 'Login dengan X untuk masuk'}
          </button>
          <p className="landing-cta-note">
            Akses dibatasi untuk komunitas Ponyin. Setelah login, kamu akan diminta{' '}
            <strong>follow @{TARGET_HANDLE}</strong> di X — itu syarat ringan untuk dukung
            development sia tetap gratis dan jalan.
          </p>
          {error && <div className="landing-error">{error}</div>}
        </div>
      </section>

      <section className="landing-teasers" aria-label="Fitur sia">
        {TEASERS.map(({ icon: Icon, title, text }) => (
          <article className="teaser-card" key={title}>
            <div className="teaser-icon">
              <Icon size={20} />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <footer className="landing-footer">
        <span>© Ponyin · Should I Ape?</span>
        <span>
          Data scan ≠ saran finansial. Selalu validasi manual sebelum entry.
        </span>
      </footer>
    </div>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
