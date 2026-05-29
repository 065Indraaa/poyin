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
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'x',
    options: {
      redirectTo: getRedirectUrl(),
      scopes: 'tweet.read users.read',
      // skipBrowserRedirect: true supaya kita bisa inspect URL & error detail
      skipBrowserRedirect: true
    }
  });
  if (error) {
    console.error('[auth] signInWithOAuth error:', error);
    throw error;
  }
  if (!data?.url) {
    throw new Error('Supabase tidak mengembalikan authorize URL. Periksa konfigurasi provider Twitter di dashboard.');
  }
  // Redirect manual ke X authorize URL
  window.location.href = data.url;
  return data;
}

export async function verifyFollowX(providerToken, targetHandle = 'ELPonyin') {
  const res = await fetch('/api/verify-follow', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ providerToken, targetHandle })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Verify follow failed: ${res.status} ${text}`);
  }
  return res.json();
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

const QUOTA_LIMIT = 100;

function startOfDayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function defaultQuota() {
  return {
    scanUsed: 0,
    scanLimit: QUOTA_LIMIT,
    meterUsed: 0,
    meterLimit: QUOTA_LIMIT,
    remainingScan: QUOTA_LIMIT,
    remainingMeter: QUOTA_LIMIT,
    resetAt: null
  };
}

export async function getQuota(userId) {
  if (!supabase || !userId) return defaultQuota();
  const { data, error } = await supabase
    .from('user_quotas')
    .select('scan_used, meter_used, reset_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[auth] getQuota failed:', error.message);
    return defaultQuota();
  }

  const sod = startOfDayUtc();
  if (!data || !data.reset_at || new Date(data.reset_at) < sod) {
    return { ...defaultQuota(), resetAt: sod.toISOString() };
  }

  const scanUsed = data.scan_used || 0;
  const meterUsed = data.meter_used || 0;
  return {
    scanUsed,
    scanLimit: QUOTA_LIMIT,
    meterUsed,
    meterLimit: QUOTA_LIMIT,
    remainingScan: Math.max(0, QUOTA_LIMIT - scanUsed),
    remainingMeter: Math.max(0, QUOTA_LIMIT - meterUsed),
    resetAt: data.reset_at
  };
}

export async function consumeQuota(userId, type = 'scan') {
  if (!supabase || !userId) return { ok: true, remaining: QUOTA_LIMIT };
  const sod = startOfDayUtc();

  const { data: existing } = await supabase
    .from('user_quotas')
    .select('scan_used, meter_used, reset_at')
    .eq('user_id', userId)
    .maybeSingle();

  let scanUsed = existing?.scan_used || 0;
  let meterUsed = existing?.meter_used || 0;

  if (!existing || !existing.reset_at || new Date(existing.reset_at) < sod) {
    scanUsed = 0;
    meterUsed = 0;
    await supabase.from('user_quotas').upsert(
      {
        user_id: userId,
        scan_used: 0,
        meter_used: 0,
        reset_at: new Date().toISOString()
      },
      { onConflict: 'user_id' }
    );
  }

  const used = type === 'scan' ? scanUsed : meterUsed;
  if (used >= QUOTA_LIMIT) {
    return { ok: false, remaining: 0, type };
  }

  const updates = type === 'scan' ? { scan_used: scanUsed + 1 } : { meter_used: meterUsed + 1 };
  const { error } = await supabase.from('user_quotas').update(updates).eq('user_id', userId);
  if (error) {
    console.warn('[auth] consumeQuota update failed:', error.message);
    return { ok: false, remaining: QUOTA_LIMIT - used, type };
  }

  return { ok: true, remaining: QUOTA_LIMIT - used - 1, type };
}

export { isSupabaseConfigured };
