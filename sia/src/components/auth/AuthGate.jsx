import { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { LogOut, Users, ShieldAlert } from 'lucide-react';
import {
  getSession,
  getProfile,
  getQuota,
  subscribeAuth,
  touchLastSeen,
  signOut,
  isSupabaseConfigured
} from '../../services/auth';
import LandingLogin from './LandingLogin';
import FollowBanner from './FollowBanner';

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthGate({ children }) {
  const [status, setStatus] = useState('loading');
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [access, setAccess] = useState('loading'); // 'loading' | 'allowed' | 'denied'
  const [quota, setQuota] = useState({ used: 0, limit: 100, remaining: 100, resetAt: '' });

  const refreshProfile = useCallback(async (currentSession) => {
    const userId = currentSession?.user?.id;
    if (!userId) {
      setProfile(null);
      setAccess('loading');
      return;
    }
    const fetched = await getProfile(userId);
    if (fetched) {
      setProfile(fetched);
      setAccess('allowed');
    } else {
      // User exists in auth.users but NOT in profiles table = new user not whitelisted
      setProfile(null);
      setAccess('denied');
    }
  }, []);

  const refreshQuota = useCallback(async (currentSession) => {
    const userId = currentSession?.user?.id;
    if (!userId) {
      setQuota({ used: 0, limit: 100, remaining: 100, resetAt: null });
      return;
    }
    const q = await getQuota(userId);
    setQuota(q);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setStatus('unconfigured');
      return undefined;
    }

    let mounted = true;

    (async () => {
      try {
        const initial = await getSession();
        if (!mounted) return;
        setSession(initial);
        if (initial) {
          await refreshProfile(initial);
          await refreshQuota(initial);
        }
        setStatus('ready');
      } catch (error) {
        console.warn('[AuthGate] init failed:', error);
        if (mounted) setStatus('ready');
      }
    })();

    const unsubscribe = subscribeAuth((nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      if (nextSession) {
        refreshProfile(nextSession);
        refreshQuota(nextSession);
        touchLastSeen(nextSession.user?.id);
      } else {
        setProfile(null);
        setAccess('loading');
        setQuota({ used: 0, limit: 100, remaining: 100, resetAt: null });
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [refreshProfile]);

  // Auto sign-out when access is denied so the token doesn't stay active
  useEffect(() => {
    if (access === 'denied' && session) {
      signOut().catch(() => {});
    }
  }, [access, session]);

  if (status === 'loading') {
    return (
      <div className="auth-loading">
        <div className="auth-loading-orb" />
        Memuat sesi...
      </div>
    );
  }

  if (status === 'unconfigured') {
    return (
      <div className="auth-loading" style={{ flexDirection: 'column', textAlign: 'center', padding: '0 24px' }}>
        <strong style={{ color: '#ffb020', marginBottom: 8 }}>Auth belum dikonfigurasi.</strong>
        <span>Set <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code> di file .env.</span>
      </div>
    );
  }

  if (!session) {
    return <LandingLogin />;
  }

  if (access === 'denied') {
    return <AccessLimitScreen onLogout={() => signOut().catch(() => {})} />;
  }

  if (profile?.banned) {
    return (
      <div className="auth-loading" style={{ flexDirection: 'column', textAlign: 'center', padding: '0 24px' }}>
        <strong style={{ color: '#ff8a82', marginBottom: 8 }}>Akses dibatasi.</strong>
        <span>{profile.banned_reason || 'Akun ini ditandai melanggar ketentuan komunitas.'}</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, profile, quota, refreshProfile: () => refreshProfile(session), refreshQuota: () => refreshQuota(session) }}>
      {profile && !profile.follow_claimed && (
        <FollowBanner profile={profile} onClaimed={() => refreshProfile(session)} />
      )}
      {children}
    </AuthContext.Provider>
  );
}

function AccessLimitScreen({ onLogout }) {
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 22,
            textAlign: 'center',
            maxWidth: 560,
            margin: '0 auto',
            padding: '48px 24px'
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(255, 138, 130, 0.12)',
              border: '1px solid rgba(255, 138, 130, 0.32)',
              display: 'grid',
              placeItems: 'center',
              color: '#ff8a82'
            }}
          >
            <Users size={32} />
          </div>

          <div>
            <h2 style={{ margin: '0 0 10px', fontSize: '1.5rem', fontWeight: 700 }}>
              Pendaftaran Sementara Ditutup
            </h2>
            <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6, fontSize: '1.05rem' }}>
              Maaf, saat ini kami sedang membatasi jumlah anggota untuk menjaga kualitas layanan dan stabilitas server.
              Hanya pengguna yang sudah terdaftar sebelumnya yang dapat mengakses aplikasi.
            </p>
          </div>

          <div
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textAlign: 'left',
              width: '100%'
            }}
          >
            <ShieldAlert size={22} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '0.92rem', display: 'block', marginBottom: 4 }}>
                Status akun kamu: Belum terdaftar
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                Akun X kamu belum ada dalam daftar anggota. Pantau X @ELPonyin untuk info buka pendaftaran berikutnya.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              className="x-login-button"
              onClick={onLogout}
              style={{ background: 'var(--panel)', color: 'var(--text)', border: '1px solid var(--line)' }}
            >
              <LogOut size={18} />
              Keluar dari akun ini
            </button>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 8 }}>
            Butuh bantuan? Hubungi admin melalui X @ELPonyin.
          </p>
        </div>
      </section>

      <footer className="landing-footer">
        <span>© Ponyin · Should I Ape?</span>
        <span>Data scan ≠ saran finansial. Selalu validasi manual sebelum entry.</span>
      </footer>
    </div>
  );
}

