import { buildSmartWalletRegistry } from './smart-wallets.js';

const HTTP_TIMEOUT_MS = 5000;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const [rpcStatus, smartRegistry, providerProbes] = await Promise.allSettled([
    checkRpcHealth(),
    buildSmartWalletRegistry().catch((e) => ({ size: 0, source: 'registry gagal', warnings: [e.message] })),
    probeMarketProviders()
  ]);

  const rpc = rpcStatus.status === 'fulfilled'
    ? rpcStatus.value
    : { ok: false, provider: resolveRpcLabel(), message: rpcStatus.reason?.message || 'RPC gagal dicek' };

  const registry = smartRegistry.status === 'fulfilled'
    ? smartRegistry.value
    : { size: 0, source: 'registry gagal dimuat', warnings: [smartRegistry.reason?.message || 'registry gagal'] };

  const providers = providerProbes.status === 'fulfilled'
    ? providerProbes.value
    : { birdeye: { ok: false }, jupiter: { ok: false }, pumpfun: { ok: false } };

  const heliusKey = getEnv('HELIUS_API_KEY') || getEnv('VITE_HELIUS_API_KEY');
  const madeOnSolKey = getEnv('MADEONSOL_API_KEY') || getEnv('VITE_MADEONSOL_API_KEY');
  const birdeyeKey = getEnv('BIRDEYE_API_KEY') || getEnv('VITE_BIRDEYE_API_KEY');

  const tips = [];
  if (!heliusKey) tips.push('Tambahkan HELIUS_API_KEY di env Vercel supaya authority & holder data bisa kebaca. Daftar gratis di helius.dev');
  if (!madeOnSolKey) tips.push('Tambahkan MADEONSOL_API_KEY di env Vercel supaya blacklist & deployer tier aktif.');
  if (!birdeyeKey) tips.push('Tambahkan BIRDEYE_API_KEY (opsional) untuk rate limit lebih longgar pada cross-validation harga.');
  if (!registry.size && !getEnv('SMART_WALLETS')) tips.push('Tambahkan SMART_WALLETS (wallet:nama:tipe) di env Vercel supaya registry wallet pintar aktif.');
  if (!rpc.ok) tips.push('RPC gagal. Kalau pakai Helius key, cek apakah key masih valid dan belum expired.');
  if (!providers.birdeye?.ok) tips.push('Birdeye proxy belum balas. Cek koneksi atau quota free tier.');
  if (!providers.pumpfun?.ok) tips.push('Pump.fun frontend API belum balas. Discovery bonding curve sementara fallback ke PumpPortal WS.');

  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120');
  return res.status(200).json({
    ok: Boolean(rpc.ok),
    timestamp: new Date().toISOString(),
    env: {
      madeOnSolKey: Boolean(madeOnSolKey),
      smartWalletList: Boolean(getEnv('SMART_WALLETS') || getEnv('VITE_SMART_WALLETS')),
      heliusKey: Boolean(heliusKey),
      birdeyeKey: Boolean(birdeyeKey),
      solanaRpcUrl: Boolean(getEnv('SOLANA_RPC_URL'))
    },
    rpc,
    smartWallets: {
      ok: registry.size > 0,
      size: registry.size || 0,
      source: registry.source || 'belum dikonfigurasi',
      warnings: registry.warnings || []
    },
    providers,
    tips,
    endpoints: {
      smartWallets: '/api/smart-wallets',
      tokenIntel: '/api/token-intel?ca=<contract-address>',
      birdeye: '/api/birdeye?ca=<contract-address>',
      jupiter: '/api/jupiter?action=price&ids=<address-list>',
      pumpfun: '/api/pumpfun?sort=created_timestamp&order=DESC'
    }
  });
}

async function probeMarketProviders() {
  const [birdeye, jupiter, pumpfun] = await Promise.allSettled([
    probeBirdeye(),
    probeJupiter(),
    probePumpfun()
  ]);

  return {
    birdeye: birdeye.status === 'fulfilled' ? birdeye.value : { ok: false, error: birdeye.reason?.message },
    jupiter: jupiter.status === 'fulfilled' ? jupiter.value : { ok: false, error: jupiter.reason?.message },
    pumpfun: pumpfun.status === 'fulfilled' ? pumpfun.value : { ok: false, error: pumpfun.reason?.message }
  };
}

async function probeBirdeye() {
  const key = (process.env.BIRDEYE_API_KEY || process.env.VITE_BIRDEYE_API_KEY || '').trim();
  const headers = { accept: 'application/json', 'x-chain': 'solana' };
  if (key) headers['x-api-key'] = key;
  const response = await fetchWithTimeout('https://public-api.birdeye.so/defi/networks', { headers });
  return { ok: response.ok, hasKey: Boolean(key) };
}

async function probeJupiter() {
  const response = await fetchWithTimeout('https://price.jup.ag/v6/price?ids=So11111111111111111111111111111111111111112');
  if (!response.ok) return { ok: false };
  const data = await response.json().catch(() => null);
  return { ok: Boolean(data?.data) };
}

async function probePumpfun() {
  const response = await fetchWithTimeout('https://frontend-api.pump.fun/coins?offset=0&limit=1', {
    headers: { accept: 'application/json', 'user-agent': 'Mozilla/5.0 SIA-Engine' }
  });
  return { ok: response.ok };
}

async function checkRpcHealth() {
  const response = await fetchWithTimeout(resolveRpcUrl(), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 'sia-health', method: 'getHealth' })
  });

  const payload = await response.json();
  if (payload.error) throw new Error(payload.error.message || 'RPC getHealth gagal');

  return {
    ok: payload.result === 'ok',
    provider: resolveRpcLabel(),
    result: payload.result
  };
}

function resolveRpcUrl() {
  const heliusKey = getEnv('HELIUS_API_KEY') || getEnv('VITE_HELIUS_API_KEY') || getEnv('SOLANA_RPC_API_KEY');
  if (getEnv('SOLANA_RPC_URL')) return process.env.SOLANA_RPC_URL;
  if (heliusKey) return `https://mainnet.helius-rpc.com/?api-key=${heliusKey}`;
  return 'https://api.mainnet-beta.solana.com';
}

function resolveRpcLabel() {
  if (getEnv('SOLANA_RPC_URL')) return 'SOLANA_RPC_URL';
  if (getEnv('HELIUS_API_KEY') || getEnv('VITE_HELIUS_API_KEY')) return 'Helius RPC';
  return 'Solana public RPC (limited)';
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function getEnv(name) {
  return String(process.env[name] || '').trim();
}
