import { supabase, isSupabaseConfigured } from './supabase';

const REDIRECT_PATH = '/sia/';

function getRedirectUrl() {
  if (typeof window === 'undefined') return REDIRECT_PATH;
  return `${window.location.origin}${REDIRECT_PATH}`;
}

export async function signInWithX() {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi');
  // Scopes wajib untuk X (Twitter) OAuth 2.0:
  // tweet.read  = baca tweet publik user
  // users.read  = baca profil user (handle, avatar)
  // offline.access = dapat refresh token (opsional tapi direkomendasikan)
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: getRedirectUrl(),
      scopes: 'tweet.read users.read offline.access'
    }
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session || null;
}

export async function getProfile(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, x_handle, x_avatar, x_user_id, follow_claimed, follow_claimed_at, banned')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.warn('[auth] getProfile failed:', error.message);
    return null;
  }
  return data;
}

export async function claimFollow(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .update({
      follow_claimed: true,
      follow_claimed_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function touchLastSeen(userId) {
  if (!supabase || !userId) return;
  await supabase
    .from('profiles')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', userId);
}

export function subscribeAuth(callback) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session, event);
  });
  return () => {
    try {
      data.subscription.unsubscribe();
    } catch {
      // noop
    }
  };
}

export { isSupabaseConfigured };
