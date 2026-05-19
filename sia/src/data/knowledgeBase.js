export const ponyinPrinciples = [
  {
    id: 'bundle',
    title: 'Bundle Token',
    source: 'Materi Vol.1 p0 + Space 10 Mei 2026',
    rule: 'Dev atau tim bisa memecah supply ke banyak wallet. Baca top holder, pola funding, dan transaksi awal sebelum percaya chart.',
    checks: ['top10Pct', 'commonFunderWallets', 'firstMinuteHoldingPct', 'cabalSync']
  },
  {
    id: 'globalFees',
    title: 'Global Fees',
    source: 'Materi Vol.1 p1 + Space 26 Maret 2026',
    rule: 'Volume besar harus punya jejak biaya dan aktivitas yang masuk akal. Kalau volume besar tapi biaya, liquidity, atau jumlah transaksi tipis, anggap wash risk.',
    checks: ['reportedVolume', 'feeCollected', 'volumeLiquidityRatio', 'txns5m']
  },
  {
    id: 'authority',
    title: 'Revoke & Minting',
    source: 'Materi Vol.1 p2',
    rule: 'Mint authority dan freeze authority adalah filter dasar. Mint terbuka atau freeze aktif tidak boleh dianggap aman.',
    checks: ['mintRevoked', 'freezeActive']
  },
  {
    id: 'dexPaid',
    title: 'Dex Paid, Ads & Boost',
    source: 'Materi Vol.1 p4',
    rule: 'Dex paid/ads/boost bagus kalau muncul sebelum chart terlalu tinggi. Kalau baru dibayar setelah pump besar, itu bisa jadi exit-liquidity timing.',
    checks: ['dexPaidTiming', 'activeBoosts', 'pumpFromLowPct']
  },
  {
    id: 'candle',
    title: '3 Candle Confirmation',
    source: 'Materi Vol.1 p5',
    rule: 'Entry dip perlu konfirmasi. Jangan market buy saat candle masih jatuh dan sell pressure belum mereda.',
    checks: ['candleConfirmation', 'priceChange']
  },
  {
    id: 'holders',
    title: 'Membaca Holder',
    source: 'Materi Vol.1 p7',
    rule: 'Persentase holder tidak punya angka universal. Fase token menentukan apakah konsentrasi supply masih wajar atau sudah red flag.',
    checks: ['phase', 'top10Pct', 'marketCap']
  },
  {
    id: 'scalping',
    title: 'Instant Scalping',
    source: 'Materi Vol.2 A7',
    rule: 'Fresh launch harus lolos filter new-pair: kondisi network, holder baru, balance top holder, dan entry market cap.',
    checks: ['ageMinutes', 'marketCap', 'txns5m', 'liquidityUsd']
  },
  {
    id: 'walletPing',
    title: 'Wallet Ping',
    source: 'Materi Vol.2 A3 + Space recordings',
    rule: 'Wallet ping bukan sinyal auto-buy. Aktivitas wallet hanya alasan untuk analisis lanjutan.',
    checks: ['smartWalletActivity', 'devTx']
  }
];

export const analysisLayers = [
  {
    index: '01',
    title: 'Keamanan Contract & Fundamental',
    description: 'Mint authority, freeze authority, supply, LP/liquidity, dan data Solana RPC.'
  },
  {
    index: '02',
    title: 'Deteksi Bundle & Cabal',
    description: 'Top holder, funding-source risk, first-minute activity, dan indikasi koordinasi wallet.'
  },
  {
    index: '03',
    title: 'Volume vs Global Fees',
    description: 'Reported volume dibaca bersama liquidity, jumlah transaksi, dan fee data kalau provider menyediakannya.'
  },
  {
    index: '04',
    title: 'Timing Marketing',
    description: 'Dex paid, ads, boosts, dan timing pembayaran dibanding umur token serta besar pump.'
  },
  {
    index: '05',
    title: 'Konfirmasi Dip Teknis',
    description: 'Konfirmasi candle, buy/sell pressure, dan perubahan harga multi-frame sebelum entry.'
  }
];

export const criticalUnknownCopy = 'Butuh indexer seperti Helius, Bitquery, Solscan Pro, atau PumpPortal metered stream untuk bukti penuh.';
