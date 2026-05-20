import { buildSmartWalletRegistry } from './smart-wallets.js';

const HTTP_TIMEOUT_MS = 8000;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const [rpcStatus, smartRegistry] = await Promise.allSettled([
    checkRpcHealth(),
    buildSmartWalletRegistry()
  ]);

  const rpc = rpcStatus.status === 'fulfilled'
    ? rpcStatus.value
    : { ok: false, provider: resolveRpcLabel(), message: rpcStatus.reason?.message || 'RPC gagal dicek' };

  const registry = smartRegistry.status === 'fulfilled'
    ? smartRegistry.value
    : { size: 0, source: 'registry gagal dimuat', warnings: [smartRegistry.reason?.message || 'registry gagal'] };

  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120');
  return res.status(200).json({
    ok: Boolean(rpc.ok),
    timestamp: new Date().toISOString(),
    env: {
      madeOnSolKey: hasAnyEnv(['MADEONSOL_API_KEY', 'VITE_MADEONSOL_API_KEY', 'ONSOL_API_KEY', 'ON_SOL_API_KEY', 'MADE_ON_SOL_API_KEY']),
      smartWalletList: hasAnyEnv(['SMART_WALLETS', 'VITE_SMART_WALLETS']),
      heliusKey: hasAnyEnv(['HELIUS_API_KEY', 'VITE_HELIUS_API_KEY', 'SOLANA_RPC_API_KEY']),
      solanaRpcUrl: Boolean(process.env.SOLANA_RPC_URL)
    },
    rpc,
    smartWallets: {
      ok: registry.size > 0,
      size: registry.size || 0,
      source: registry.source || 'belum dikonfigurasi',
      warnings: registry.warnings || []
    },
    endpoints: {
      smartWallets: '/api/smart-wallets',
      tokenIntel: '/api/token-intel?ca=<contract-address>'
    }
  });
}

async function checkRpcHealth() {
  const response = await fetchWithTimeout(resolveRpcUrl(), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'sia-health',
      method: 'getHealth'
    })
  });

  const payload = await response.json();
  if (payload.error) {
    throw new Error(payload.error.message || 'RPC getHealth gagal');
  }

  return {
    ok: payload.result === 'ok',
    provider: resolveRpcLabel(),
    result: payload.result
  };
}

function resolveRpcUrl() {
  const heliusKey = (
    process.env.HELIUS_API_KEY ||
    process.env.VITE_HELIUS_API_KEY ||
    process.env.SOLANA_RPC_API_KEY ||
    ''
  ).trim();

  if (process.env.SOLANA_RPC_URL) return process.env.SOLANA_RPC_URL;
  if (heliusKey) return `https://mainnet.helius-rpc.com/?api-key=${heliusKey}`;
  return 'https://api.mainnet-beta.solana.com';
}

function resolveRpcLabel() {
  if (process.env.SOLANA_RPC_URL) return 'SOLANA_RPC_URL';
  if (hasAnyEnv(['HELIUS_API_KEY', 'VITE_HELIUS_API_KEY', 'SOLANA_RPC_API_KEY'])) return 'Helius RPC';
  return 'Solana public RPC';
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

function hasAnyEnv(names) {
  return names.some((name) => Boolean(String(process.env[name] || '').trim()));
}
