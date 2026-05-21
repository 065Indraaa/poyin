export const ponyinPrinciples = [
  {
    id: 'bundle',
    title: 'Bundle Token',
    source: 'Materi Vol.1 p0 + Space 10 Mei 2026',
    rule: 'Dev atau tim bisa pecahin supply ke banyak wallet. Baca top holder, pola funding, sama transaksi awal sebelum percaya chart.'
    checks: ['top10Pct', 'commonFunderWallets', 'firstMinuteHoldingPct', 'cabalSync']
  },
  {
    id: 'globalFees',
    title: 'Global Fees',
    source: 'Materi Vol.1 p1 + Space 26 Maret 2026',
    rule: 'Volume gede harus ada jejak biaya sama aktivitas yang masuk akal. Kalo volume gede tapi biaya, liquidity, atau jumlah transaksi tipis, anggap aja wash risk.'
    checks: ['reportedVolume', 'feeCollected', 'volumeLiquidityRatio', 'txns5m']
  },
  {
    id: 'authority',
    title: 'Revoke & Minting',
    source: 'Materi Vol.1 p2',
    rule: 'Mint authority sama freeze authority itu filter dasar. Mint kebuka atau freeze aktif gak boleh dianggap aman.'
    checks: ['mintRevoked', 'freezeActive']
  },
  {
    id: 'dexPaid',
    title: 'Dex Paid, Ads & Boost',
    source: 'Materi Vol.1 p4',
    rule: 'Dex paid/ads/boost bagus kalo muncul sebelum chart kelaluan tinggi. Kalo baru dibayar setelah pump gede, itu bisa jadi exit-liquidity timing.'
    checks: ['dexPaidTiming', 'activeBoosts', 'pumpFromLowPct']
  },
  {
    id: 'candle',
    title: '3 Candle Confirmation',
    source: 'Materi Vol.1 p5',
    rule: 'Entry dip butuh konfirmasi. Jangan market buy kalo candle masih jatuh dan sell pressure belum mereda.'
    checks: ['candleConfirmation', 'priceChange']
  },
  {
    id: 'holders',
    title: 'Membaca Holder',
    source: 'Materi Vol.1 p7',
    rule: 'Persentase holder gak punya angka universal. Fase token yang nentuin konsentrasi supply masih wajar atau udah red flag.'
    checks: ['phase', 'top10Pct', 'marketCap']
  },
  {
    id: 'scalping',
    title: 'Instant Scalping',
    source: 'Materi Vol.2 A7',
    rule: 'Fresh launch harus lolos filter new-pair: kondisi network, holder baru, balance top holder, sama entry market cap.'
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
    description: 'Mint authority, freeze authority, supply, LP/liquidity, sama data Solana RPC.'
  },
  {
    index: '02',
    title: 'Deteksi Bundle & Cabal',
    description: 'Top holder, funding-source risk, first-minute activity, sama indikasi koordinasi wallet.'
  },
  {
    index: '03',
    title: 'Volume vs Global Fees',
    description: 'Reported volume dibaca bareng liquidity, jumlah transaksi, sama fee data kalo provider nyediain.'
  },
  {
    index: '04',
    title: 'Timing Marketing',
    description: 'Dex paid, ads, boosts, sama timing pembayaran dibanding umur token sama gede pump-nya.'
  },
  {
    index: '05',
    title: 'Konfirmasi Dip Teknis',
    description: 'Konfirmasi candle, buy/sell pressure, sama perubahan harga multi-frame sebelum entry.'
  }
];

export const criticalUnknownCopy = 'Butuh indexer kaya Helius, Bitquery, Solscan Pro, atau PumpPortal metered stream buat bukti penuh.';
