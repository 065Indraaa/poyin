import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  heliusKey: (process.env.HELIUS_API_KEY || process.env.VITE_HELIUS_API_KEY || '').trim(),
  madeOnSolKey: (process.env.MADEONSOL_API_KEY || process.env.VITE_MADEONSOL_API_KEY || '').trim(),
  solanaRpc: process.env.SOLANA_RPC_URL || (process.env.HELIUS_API_KEY ? `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}` : 'https://api.mainnet-beta.solana.com'),
  dexApi: 'https://api.dexscreener.com',
  pumpPortalWs: 'wss://pumpportal.fun/api/data',
  madeOnSolApi: 'https://madeonsol.com/api/v1',

  pollIntervals: {
    dexDiscovery: 10000,
    marketSnapshot: 5000,
    healthCheck: 45000,
    tokenPrune: 30000,
    rugScan: 60000,
  },

  thresholds: {
    newPairMaxAgeMinutes: 30,
    earlyMaxAgeMinutes: 360,
    soonMaxAgeMinutes: 1440,
    maxFeedAgeMinutes: 3 * 24 * 60,
    minLiquidityUsd: 6500,
    minTxns5m: 8,
    rugVolumeDropPct: 90,
    rugHolderDropPct: 40,
    slowRugDevSellWindowMinutes: 30,
    bundleFundingDepth: 2,
    topHolderLimit: 20,
  },

  wsPort: Number(process.env.WS_PORT || 0),
};
