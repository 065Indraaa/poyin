import { useEffect, useState, useCallback, createContext, useContext } from 'react';
import {
  getSession,
  getProfile,
  subscribeAuth,
  touchLastSeen,
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

  const refreshProfile = useCallback(async (currentSession) => {
    const userId = currentSession?.user?.id;
    if (!userId) {
      setProfile(null);
      return;
    }
    const fetched = await getProfile(userId);
    if (fetched) {
      setProfile(fetched);
    } else {
      setProfile({
        id: userId,
        x_handle: currentSession.user?.user_metadata?.user_name || null,
        x_avatar: currentSession.user?.user_metadata?.avatar_url || null,
        x_user_id: currentSession.user?.user_metadata?.provider_id || null,
        follow_claimed: false,
        banned: false
      });
    }
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
        if (initial) await refreshProfile(initial);
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
        touchLastSeen(nextSession.user?.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [refreshProfile]);

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

  if (profile?.banned) {
    return (
      <div className="auth-loading" style={{ flexDirection: 'column', textAlign: 'center', padding: '0 24px' }}>
        <strong style={{ color: '#ff8a82', marginBottom: 8 }}>Akses dibatasi.</strong>
        <span>{profile.banned_reason || 'Akun ini ditandai melanggar ketentuan komunitas.'}</span>
      </div>
    );
  }

  return (
    <>
      {profile && !profile.follow_claimed && (
        <FollowBanner profile={profile} onClaimed={() => refreshProfile(session)} />
      )}
      <AuthContext.Provider value={{ session, profile, refreshProfile: () => refreshProfile(session) }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}

