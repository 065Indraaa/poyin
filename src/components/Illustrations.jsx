// ═══════════════════════════════════════════════════
// SVG ILLUSTRATIONS — Bilingual Inline React SVG
// ═══════════════════════════════════════════════════
import { useLang } from '../context/LanguageContext';

// Helper: bilingual text shorthand
function useIT() {
  const { lang } = useLang();
  return (id, en) => lang === 'en' ? en : id;
}

export function GlobalFeesSVG() {
  const t = useIT();
  return (
    <svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="320" fill="transparent" />
      <text x="350" y="38" textAnchor="middle" fontFamily="Georgia,serif" fontSize="20" fontWeight="700" fill="#18182b">{t('Global Fees — Detektor Transaksi Asli vs Palsu', 'Global Fees — Real vs Fake Transaction Detector')}</text>
      <rect x="50" y="70" width="280" height="200" rx="16" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
      <text x="190" y="105" textAnchor="middle" fontSize="16" fontFamily="sans-serif" fontWeight="700" fill="#065f46">{t('✅ Volume Organik (Nyata)', '✅ Organic Volume (Real)')}</text>
      <line x1="70" y1="120" x2="310" y2="120" stroke="#86efac" strokeWidth="1" />
      <text x="100" y="150" fontFamily="sans-serif" fontSize="14" fill="#047857">{t('Banyak Pembeli Berbeda  →', 'Many Different Buyers  →')}</text>
      <text x="100" y="180" fontFamily="sans-serif" fontSize="14" fill="#047857">{t('Setiap beli ada potongan fee', 'Each purchase has a fee deduction')}</text>
      <text x="100" y="210" fontFamily="sans-serif" fontSize="14" fill="#047857">{t('Volume $100k → Fee terkumpul $250', 'Volume $100k → Fee collected $250')}</text>
      <rect x="370" y="70" width="280" height="200" rx="16" fill="#fff1f1" stroke="#fca5a5" strokeWidth="2" />
      <text x="510" y="105" textAnchor="middle" fontSize="16" fontFamily="sans-serif" fontWeight="700" fill="#991b1b">{t('❌ Wash Trading (Palsu)', '❌ Wash Trading (Fake)')}</text>
      <line x1="390" y1="120" x2="630" y2="120" stroke="#fca5a5" strokeWidth="1" />
      <text x="400" y="150" fontFamily="sans-serif" fontSize="14" fill="#b91c1c">{t('Satu Orang / Bot Jual-Beli Sendiri →', 'One Person / Bot Self-Trading →')}</text>
      <text x="400" y="180" fontFamily="sans-serif" fontSize="14" fill="#b91c1c">{t('Mengelabui Fee Raydium', 'Tricking Raydium Fees')}</text>
      <text x="400" y="210" fontFamily="sans-serif" fontSize="14" fill="#b91c1c">{t('Volume $100k → Fee cuma $10', 'Volume $100k → Fee only $10')}</text>
      <text x="350" y="300" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fill="#b45309" fontWeight="700">{t('Tips: Gunakan DexScreener (Tab Info) untuk cek Total Fee Collected!', 'Tips: Use DexScreener (Info Tab) to check Total Fee Collected!')}</text>
    </svg>
  );
}

export function RevokeSVG() {
  const t = useIT();
  return (
    <svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="280" fill="transparent" />
      <text x="350" y="38" textAnchor="middle" fontFamily="Georgia,serif" fontSize="20" fontWeight="700" fill="#18182b">{t('Memahami Bahaya Mint Authority Aktif', 'Understanding the Danger of Active Mint Authority')}</text>
      <rect x="80" y="70" width="220" height="150" rx="16" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2" />
      <text x="190" y="105" textAnchor="middle" fontSize="15" fontFamily="sans-serif" fontWeight="700" fill="#1e40af">{t('Token Normal (Aman)', 'Normal Token (Safe)')}</text>
      <circle cx="150" cy="150" r="25" fill="#3b82f6" /><circle cx="230" cy="150" r="25" fill="#3b82f6" />
      <text x="190" y="200" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#1d4ed8">{t('Supply Tetap 100 Token', 'Fixed Supply 100 Tokens')}</text>
      <text x="350" y="150" textAnchor="middle" fontSize="24">VS</text>
      <rect x="400" y="70" width="220" height="150" rx="16" fill="#fff1f1" stroke="#fca5a5" strokeWidth="2" />
      <text x="510" y="105" textAnchor="middle" fontSize="15" fontFamily="sans-serif" fontWeight="700" fill="#991b1b">{t('Mint Aktif (Bahaya)', 'Mint Active (Danger)')}</text>
      <circle cx="450" cy="150" r="15" fill="#ef4444" /><circle cx="490" cy="150" r="15" fill="#ef4444" /><circle cx="530" cy="150" r="15" fill="#ef4444" /><circle cx="570" cy="150" r="15" fill="#ef4444" />
      <text x="510" y="200" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#b91c1c">{t('Dev diam-diam cetak 1 Milyar token baru!', 'Dev secretly mints 1 Billion new tokens!')}</text>
      <text x="350" y="260" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fill="#92400e" fontStyle="italic">{t('Hasilnya = Harga token terjun bebas ke angka nol (Dilusi total).', 'Result = Token price freefalls to zero (Total dilution).')}</text>
    </svg>
  );
}

export function DexPaidSVG() {
  const t = useIT();
  return (
    <svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="280" fill="transparent" />
      <text x="350" y="32" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="#18182b">Dex Paid vs Ads vs Boost</text>
      <text x="350" y="54" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#64748b">{t('Kapan sinyal bagus? Kapan harus hati-hati?', 'When is it a good signal? When to be careful?')}</text>
      <line x1="80" y1="140" x2="620" y2="140" stroke="#e2e8f0" strokeWidth="4" />
      <circle cx="100" cy="140" r="8" fill="#cbd5e1" />
      <text x="100" y="170" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#64748b">Token</text>
      <text x="100" y="183" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#64748b">Launch</text>
      <circle cx="250" cy="140" r="12" fill="#3b82f6" />
      <rect x="195" y="72" width="110" height="44" rx="10" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
      <text x="250" y="91" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#1d4ed8">💳 Dex Paid</text>
      <text x="250" y="107" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#3b82f6">{t('Di awal launch', 'At initial launch')}</text>
      <rect x="195" y="196" width="110" height="26" rx="6" fill="#d1fae5" />
      <text x="250" y="214" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="600" fill="#065f46">{t('✅ Sinyal Bagus', '✅ Good Signal')}</text>
      <path d="M 310 140 Q 375 60 440 140" fill="transparent" stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 4" />
      <text x="375" y="90" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="600" fill="#047857">{t('📈 Harga Naik', '📈 Price Up')}</text>
      <circle cx="500" cy="140" r="12" fill="#ef4444" />
      <rect x="435" y="72" width="130" height="44" rx="10" fill="#fff1f1" stroke="#fca5a5" strokeWidth="1.5" />
      <text x="500" y="91" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#b91c1c">📣 Ads + Boost</text>
      <text x="500" y="107" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#dc2626">{t('Setelah harga puncak', 'After price peaks')}</text>
      <rect x="435" y="196" width="130" height="26" rx="6" fill="#fee2e2" />
      <text x="500" y="214" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="600" fill="#991b1b">⚠️ Exit Liquidity!</text>
      <rect x="100" y="240" width="500" height="30" rx="8" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
      <text x="350" y="260" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="600" fill="#92400e">{t('Kunci: Perhatikan KAPAN iklan dipasang — awal launch = bagus, setelah pump = bahaya!', 'Key: Watch WHEN ads are placed — early launch = good, after pump = danger!')}</text>
    </svg>
  );
}

export function KonfirmasiSVG() {
  const t = useIT();
  return (
    <svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="380" fill="transparent" />
      <text x="350" y="32" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="#18182b">{t('Metode 3 Konfirmasi Candle', '3 Candle Confirmation Method')}</text>
      <text x="350" y="52" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#64748b">{t('Cara beli di harga "murah" tanpa rungkad total', 'How to buy at "cheap" prices without total wipeout')}</text>
      <rect x="30" y="65" width="420" height="280" rx="14" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <path d="M 60 100 L 170 235 L 270 175 L 370 265 L 430 130" fill="transparent" stroke="#3b82f6" strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="60" cy="100" r="6" fill="#94a3b8" />
      <text x="60" y="88" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#64748b">{t('Puncak', 'Peak')}</text>
      <circle cx="170" cy="235" r="9" fill="#ef4444" />
      <rect x="110" y="250" width="120" height="38" rx="6" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1" />
      <text x="170" y="267" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="700" fill="#b91c1c">{t('1. Dip Pertama', '1. First Dip')}</text>
      <text x="170" y="282" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#dc2626">{t('❌ JANGAN MASUK!', '❌ DON\'T ENTER!')}</text>
      <circle cx="270" cy="175" r="9" fill="#f59e0b" />
      <rect x="210" y="122" width="120" height="38" rx="6" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
      <text x="270" y="139" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="700" fill="#b45309">2. Bounce</text>
      <text x="270" y="154" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#d97706">{t('Beli 10% saja (Mark)', 'Buy only 10% (Mark)')}</text>
      <circle cx="370" cy="265" r="10" fill="#10b981" />
      <rect x="310" y="285" width="120" height="38" rx="6" fill="#d1fae5" stroke="#86efac" strokeWidth="1" />
      <text x="370" y="302" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="700" fill="#047857">{t('3. Konfirmasi', '3. Confirm')}</text>
      <text x="370" y="317" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#059669">{t('✅ BELI PENUH!', '✅ FULL BUY!')}</text>
      <rect x="470" y="85" width="210" height="230" rx="14" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
      <text x="575" y="115" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fontWeight="700" fill="#1e40af">{t('Kenapa Harus Gini?', 'Why This Method?')}</text>
      <line x1="490" y1="126" x2="660" y2="126" stroke="#bfdbfe" strokeWidth="1" />
      <text x="490" y="150" fontFamily="sans-serif" fontSize="12" fill="#1d4ed8">{t('Kalau harga terus turun', 'If price keeps falling')}</text>
      <text x="490" y="168" fontFamily="sans-serif" fontSize="12" fill="#1d4ed8">{t('setelah "dip kedua":', 'after the "second dip":')}</text>
      <text x="490" y="200" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#065f46">{t('→ Kamu cuma rugi 10%', '→ You only lose 10%')}</text>
      <text x="490" y="220" fontFamily="sans-serif" fontSize="12" fill="#047857">   (from mark position)</text>
      <text x="490" y="252" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#b91c1c">{t('→ Bukan rugi 100%', '→ Not losing 100%')}</text>
      <text x="490" y="272" fontFamily="sans-serif" fontSize="12" fill="#dc2626">{t('   (kalau langsung all-in)', '   (if you went all-in)')}</text>
      <text x="575" y="300" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="600" fill="#1e40af">{t('Sabar = Selamat 🛡️', 'Patience = Safety 🛡️')}</text>
    </svg>
  );
}

export function BundleSVG() {
  const t = useIT();
  return (
    <svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="380" fill="transparent" />
      <text x="350" y="38" textAnchor="middle" fontFamily="Georgia,serif" fontSize="20" fontWeight="700" fill="#18182b">{t('Bundle Token — Ilustrasi Cara Kerja', 'Bundle Token — How It Works')}</text>
      <rect x="20" y="60" width="150" height="90" rx="16" fill="#dbeafe" stroke="#93c5fd" strokeWidth="2" />
      <text x="95" y="98" textAnchor="middle" fontSize="32">👤</text>
      <text x="95" y="120" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#1e40af" fontWeight="700">Dev / Deployer</text>
      <text x="95" y="140" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#3b82f6">Token creator</text>
      <line x1="170" y1="90" x2="240" y2="70" stroke="#2455d4" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arr1)" />
      <line x1="170" y1="105" x2="240" y2="105" stroke="#2455d4" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arr1)" />
      <line x1="170" y1="120" x2="240" y2="140" stroke="#2455d4" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arr1)" />
      <defs><marker id="arr1" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#2455d4" /></marker></defs>
      <rect x="244" y="48" width="120" height="50" rx="10" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
      <text x="304" y="70" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#1d4ed8" fontWeight="700">💼 Wallet A</text>
      <text x="304" y="88" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#3b82f6">3.2% supply</text>
      <rect x="244" y="82" width="120" height="50" rx="10" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
      <text x="304" y="104" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#1d4ed8" fontWeight="700">💼 Wallet B</text>
      <text x="304" y="122" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#3b82f6">2.8% supply</text>
      <rect x="244" y="116" width="120" height="50" rx="10" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
      <text x="304" y="138" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#1d4ed8" fontWeight="700">💼 Wallet C</text>
      <text x="304" y="156" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#3b82f6">1.9% supply</text>
      <rect x="410" y="48" width="260" height="118" rx="14" fill="#f8faff" stroke="#e2e8f0" strokeWidth="1.5" />
      <text x="430" y="74" fontFamily="sans-serif" fontSize="12" fill="#64748b" fontWeight="600">{t('📊 Tampilan di Explorer', '📊 Explorer View')}</text>
      <text x="430" y="94" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">Holder #1 · 0xAbc...</text>
      <text x="600" y="94" textAnchor="end" fontFamily="sans-serif" fontSize="12.5" fill="#2563eb" fontWeight="700">3.2%</text>
      <text x="430" y="114" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">Holder #2 · 0xDef...</text>
      <text x="600" y="114" textAnchor="end" fontFamily="sans-serif" fontSize="12.5" fill="#2563eb" fontWeight="700">2.8%</text>
      <text x="430" y="134" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">Holder #3 · 0xGhi...</text>
      <text x="600" y="134" textAnchor="end" fontFamily="sans-serif" fontSize="12.5" fill="#2563eb" fontWeight="700">1.9%</text>
      <text x="430" y="156" fontFamily="sans-serif" fontSize="11.5" fill="#94a3b8" fontStyle="italic">{t('Kelihatan seperti 3 holder berbeda...', 'Looks like 3 different holders...')}</text>
      <rect x="410" y="184" width="260" height="60" rx="14" fill="#fef3c7" stroke="#fde68a" strokeWidth="2" />
      <text x="540" y="210" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#92400e" fontWeight="700">{t('⚠ Kenyataannya:', '⚠ Reality:')}</text>
      <text x="540" y="230" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fill="#b45309" fontWeight="700">{t('1 orang = 7.9% supply!', '1 person = 7.9% supply!')}</text>
      <line x1="30" y1="272" x2="670" y2="272" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="8 4" />
      <rect x="30" y="287" width="200" height="70" rx="12" fill="#f0fdf4" stroke="#a7f3d0" strokeWidth="1.5" />
      <text x="130" y="312" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#065f46" fontWeight="700">New Pair</text>
      <text x="130" y="330" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#047857">7–10% per wallet</text>
      <text x="130" y="347" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#059669">{t('= wajar di hype narasi', '= normal in narrative hype')}</text>
      <rect x="250" y="287" width="200" height="70" rx="12" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1.5" />
      <text x="350" y="312" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#9a3412" fontWeight="700">Multi-Wallet</text>
      <text x="350" y="330" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#c2410c">{t('Semua pakai ini', 'Everyone uses this')}</text>
      <text x="350" y="347" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#ea580c">{t('termasuk KOL terbaik', 'including top KOLs')}</text>
      <rect x="470" y="287" width="200" height="70" rx="12" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
      <text x="570" y="312" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#1e40af" fontWeight="700">Zero Sum</text>
      <text x="570" y="330" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#1d4ed8">{t('Semua main untuk', 'Everyone plays for')}</text>
      <text x="570" y="347" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#2563eb">{t('profit sendiri', 'their own profit')}</text>
    </svg>
  );
}

export function MarketCapSVG() {
  const t = useIT();
  return (
    <svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="400" fill="transparent" />
      <text x="350" y="36" textAnchor="middle" fontFamily="Georgia,serif" fontSize="20" fontWeight="700" fill="#18182b">{t('Dari New Pair ke CEX — Beda Level, Beda Lawan', 'From New Pair to CEX — Different Level, Different Opponent')}</text>
      {/* New Pair */}
      <rect x="20" y="60" width="124" height="300" rx="14" fill="#fff1f1" stroke="#fca5a5" strokeWidth="2" />
      <text x="82" y="86" textAnchor="middle" fontSize="26">🌀</text>
      <text x="82" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#991b1b" fontWeight="700">New Pair</text>
      <text x="82" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">Pure Chaos</text>
      <line x1="40" y1="138" x2="124" y2="138" stroke="#fca5a5" strokeWidth="1" />
      <text x="82" y="158" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b91c1b" fontWeight="600">{t('Pemain:', 'Players:')}</text>
      <text x="82" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">Bot sniper</text>
      <text x="82" y="192" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">Cabal</text>
      <text x="82" y="209" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">{t('Whale awal', 'Early Whale')}</text>
      <line x1="40" y1="222" x2="124" y2="222" stroke="#fca5a5" strokeWidth="1" />
      <text x="82" y="242" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b91c1b" fontWeight="600">{t('Strategi:', 'Strategy:')}</text>
      <text x="82" y="259" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">{t('Narasi', 'Narrative')}</text>
      <text x="82" y="276" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">{t('entry cepat', 'fast entry')}</text>
      <text x="82" y="293" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">{t('exit lebih cepat', 'faster exit')}</text>
      <text x="82" y="340" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#ef4444" fontWeight="700">{t('⚡ Risiko', '⚡ Risk')}</text>
      <text x="82" y="356" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#dc2626" fontWeight="700">{t('TERTINGGI', 'HIGHEST')}</text>
      {/* Micro Cap */}
      <rect x="156" y="60" width="124" height="300" rx="14" fill="#fff8ec" stroke="#fde68a" strokeWidth="2" />
      <text x="218" y="86" textAnchor="middle" fontSize="26">🌱</text>
      <text x="218" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#92400e" fontWeight="700">Micro Cap</text>
      <text x="218" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">$100k – $5M</text>
      <line x1="176" y1="138" x2="260" y2="138" stroke="#fde68a" strokeWidth="1" />
      <text x="218" y="158" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#92400e" fontWeight="600">{t('Pemain:', 'Players:')}</text>
      <text x="218" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">Scalper</text>
      <text x="218" y="192" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">Bot & raider</text>
      <text x="218" y="209" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">{t('Komunitas kecil', 'Small community')}</text>
      <line x1="176" y1="222" x2="260" y2="222" stroke="#fde68a" strokeWidth="1" />
      <text x="218" y="242" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#92400e" fontWeight="600">{t('Strategi:', 'Strategy:')}</text>
      <text x="218" y="259" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">{t('Baca chart', 'Read chart')}</text>
      <text x="218" y="276" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">{t('cari reversal', 'find reversal')}</text>
      <text x="218" y="293" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">scalp entry</text>
      <text x="218" y="340" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#d97706" fontWeight="700">{t('📊 Mulai bisa', '📊 Can start')}</text>
      <text x="218" y="356" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#b45309" fontWeight="700">{t('analisis TA', 'TA analysis')}</text>
      {/* Mid Cap */}
      <rect x="292" y="60" width="124" height="300" rx="14" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
      <text x="354" y="86" textAnchor="middle" fontSize="26">🐬</text>
      <text x="354" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#1e40af" fontWeight="700">Mid Cap</text>
      <text x="354" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">$5M – $50M</text>
      <line x1="312" y1="138" x2="396" y2="138" stroke="#93c5fd" strokeWidth="1" />
      <text x="354" y="158" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1e40af" fontWeight="600">{t('Pemain:', 'Players:')}</text>
      <text x="354" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">Dolphin</text>
      <text x="354" y="192" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">{t('Whale awal', 'Early Whale')}</text>
      <text x="354" y="209" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">{t('Media mulai masuk', 'Media entering')}</text>
      <line x1="312" y1="222" x2="396" y2="222" stroke="#93c5fd" strokeWidth="1" />
      <text x="354" y="242" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1e40af" fontWeight="600">{t('Strategi:', 'Strategy:')}</text>
      <text x="354" y="259" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">{t('Main size besar', 'Play big size')}</text>
      <text x="354" y="276" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">{t('perlu entry pas', 'need precise entry')}</text>
      <text x="354" y="293" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">{t('belum buy & forget', 'not buy & forget yet')}</text>
      <text x="354" y="340" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#2563eb" fontWeight="700">{t('📰 Bensin pump:', '📰 Pump fuel:')}</text>
      <text x="354" y="356" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#1d4ed8" fontWeight="700">Media</text>
      {/* High Cap */}
      <rect x="428" y="60" width="124" height="300" rx="14" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="2" />
      <text x="490" y="86" textAnchor="middle" fontSize="26">🐳</text>
      <text x="490" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#4c1d95" fontWeight="700">High Cap</text>
      <text x="490" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#5b21b6">$50M – $200M</text>
      <line x1="448" y1="138" x2="532" y2="138" stroke="#c4b5fd" strokeWidth="1" />
      <text x="490" y="158" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#4c1d95" fontWeight="600">{t('Pemain:', 'Players:')}</text>
      <text x="490" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#5b21b6">{t('Whale besar', 'Big Whale')}</text>
      <text x="490" y="192" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#5b21b6">CNN, NewTalk</text>
      <text x="490" y="209" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#5b21b6">Brand & media</text>
      <line x1="448" y1="222" x2="532" y2="222" stroke="#c4b5fd" strokeWidth="1" />
      <text x="490" y="242" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#4c1d95" fontWeight="600">{t('Strategi:', 'Strategy:')}</text>
      <text x="490" y="259" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#5b21b6">{t('DCA tipis', 'Small DCA')}</text>
      <text x="490" y="276" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#5b21b6">{t('media goreng =', 'media hype =')}</text>
      <text x="490" y="293" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#7c3aed" fontWeight="700">{t('sinyal KELUAR', 'EXIT signal')}</text>
      <text x="490" y="340" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#6d28d9" fontWeight="700">{t('📺 Ini puncak', '📺 This is peak')}</text>
      <text x="490" y="356" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#4c1d95" fontWeight="700">{t('hype-nya', 'hype')}</text>
      {/* CEX */}
      <rect x="564" y="60" width="116" height="300" rx="14" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
      <text x="622" y="86" textAnchor="middle" fontSize="26">🏦</text>
      <text x="622" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#065f46" fontWeight="700">CEX</text>
      <text x="622" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">{t('Listing besar', 'Big Listing')}</text>
      <line x1="584" y1="138" x2="660" y2="138" stroke="#86efac" strokeWidth="1" />
      <text x="622" y="158" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#065f46" fontWeight="600">{t('Lawan:', 'Opponents:')}</text>
      <text x="622" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">Wintermute</text>
      <text x="622" y="192" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">Hedge Fund</text>
      <text x="622" y="209" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">Market Maker</text>
      <line x1="584" y1="222" x2="660" y2="222" stroke="#86efac" strokeWidth="1" />
      <text x="622" y="242" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#065f46" fontWeight="600">{t('Strategi:', 'Strategy:')}</text>
      <text x="622" y="259" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">{t('Hati-hati', 'Be careful')}</text>
      <text x="622" y="276" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">{t('posisi kecil', 'small position')}</text>
      <text x="622" y="293" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#059669">{t('OTC bukan retail', 'OTC not retail')}</text>
      <text x="622" y="340" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#059669" fontWeight="700">{t('💪 Lawan beda', '💪 Different')}</text>
      <text x="622" y="356" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#065f46" fontWeight="700">level</text>
    </svg>
  );
}

export function SnipeSVG() {
  const t = useIT();
  return (
    <svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="300" fill="transparent" />
      <text x="350" y="34" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="#18182b">{t('Tahapan Snipe Early Project', 'Snipe Early Project Steps')}</text>
      <rect x="20" y="60" width="130" height="80" rx="14" fill="#fff1f1" stroke="#fca5a5" strokeWidth="2" />
      <text x="85" y="92" textAnchor="middle" fontSize="22">🗺️</text>
      <text x="85" y="112" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#991b1b" fontWeight="700">1. MAPPING</text>
      <text x="85" y="128" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="#dc2626">{t('Siapa deploy? Di mana?', 'Who deploys? Where?')}</text>
      <polygon points="155,100 172,92 172,108" fill="#94a3b8" />
      <rect x="175" y="60" width="130" height="80" rx="14" fill="#fff8ec" stroke="#fde68a" strokeWidth="2" />
      <text x="240" y="92" textAnchor="middle" fontSize="22">🛠️</text>
      <text x="240" y="112" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#92400e" fontWeight="700">2. EQUIPMENT</text>
      <text x="240" y="128" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="#b45309">{t('Siapkan bot sniper', 'Prepare sniper bot')}</text>
      <polygon points="310,100 327,92 327,108" fill="#94a3b8" />
      <rect x="330" y="60" width="130" height="80" rx="14" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
      <text x="395" y="92" textAnchor="middle" fontSize="22">⚡</text>
      <text x="395" y="112" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#1e40af" fontWeight="700">3. SNIPE</text>
      <text x="395" y="128" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="#1d4ed8">{t('Eksekusi di momen launch', 'Execute at launch moment')}</text>
      <polygon points="465,100 482,92 482,108" fill="#94a3b8" />
      <rect x="485" y="60" width="195" height="80" rx="14" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
      <text x="582" y="92" textAnchor="middle" fontSize="22">💰</text>
      <text x="582" y="112" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#065f46" fontWeight="700">4. PROFIT</text>
      <text x="582" y="128" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="#047857">{t('Exit sebelum orang sadar', 'Exit before others realize')}</text>
      <rect x="20" y="168" width="660" height="112" rx="16" fill="#1e3a8a" stroke="#2455d4" strokeWidth="2" />
      <text x="350" y="196" textAnchor="middle" fontFamily="Georgia,serif" fontSize="15" fontWeight="700" fill="#fff">🏆 Case Study: Naseem — $trump Launch</text>
      <rect x="44" y="208" width="180" height="56" rx="10" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.2)" strokeWidth="1" />
      <text x="134" y="228" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="rgba(255,255,255,.7)">{t('Masuk sebelum', 'Entered before')}</text>
      <text x="134" y="244" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="white" fontWeight="700">{t('⏱ 0.05 detik', '⏱ 0.05 seconds')}</text>
      <text x="134" y="258" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="rgba(255,255,255,.6)">{t('sebelum liquidity add', 'before liquidity add')}</text>
      <rect x="237" y="208" width="160" height="56" rx="10" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.2)" strokeWidth="1" />
      <text x="317" y="228" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="rgba(255,255,255,.7)">{t('Gas fee dipakai', 'Gas fee used')}</text>
      <text x="317" y="244" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="white" fontWeight="700">💸 $100k USD</text>
      <text x="317" y="258" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="rgba(255,255,255,.6)">{t('untuk kecepatan', 'for speed')}</text>
      <rect x="410" y="208" width="148" height="56" rx="10" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.2)" strokeWidth="1" />
      <text x="484" y="228" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="rgba(255,255,255,.7)">{t('Modal masuk', 'Capital in')}</text>
      <text x="484" y="244" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="white" fontWeight="700">{t('🎯 $1 Juta', '🎯 $1 Million')}</text>
      <text x="484" y="258" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="rgba(255,255,255,.6)">{t('→ profit $302 Juta', '→ profit $302 Million')}</text>
    </svg>
  );
}

export function WalletPingSVG() {
  const t = useIT();
  return (
    <svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="280" fill="transparent" />
      <text x="350" y="32" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="#18182b">{t('Wallet Ping — Cara Kerja "10 Mata"', 'Wallet Ping — How "10 Eyes" Works')}</text>
      <circle cx="350" cy="148" r="40" fill="#2455d4" stroke="#1d4ed8" strokeWidth="2" />
      <text x="350" y="143" textAnchor="middle" fontSize="20">🎯</text>
      <text x="350" y="161" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="white" fontWeight="700">Top Trader</text>
      <text x="350" y="174" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="rgba(255,255,255,.7)">{t('(wallet dipantau)', '(monitored wallet)')}</text>
      <line x1="316" y1="115" x2="188" y2="70" stroke="#2455d4" strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="80" y="44" width="108" height="52" rx="10" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
      <text x="134" y="64" textAnchor="middle" fontSize="16">🔔</text>
      <text x="134" y="80" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1e40af" fontWeight="700">PING!</text>
      <text x="134" y="93" textAnchor="middle" fontFamily="sans-serif" fontSize="9.5" fill="#3b82f6">{t('Wallet beli $TOKEN', 'Wallet buys $TOKEN')}</text>
      <line x1="310" y1="148" x2="148" y2="148" stroke="#2455d4" strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="40" y="122" width="108" height="52" rx="10" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
      <text x="94" y="142" textAnchor="middle" fontSize="16">🔔</text>
      <text x="94" y="158" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1e40af" fontWeight="700">PING!</text>
      <text x="94" y="171" textAnchor="middle" fontFamily="sans-serif" fontSize="9.5" fill="#3b82f6">{t('Wallet swap SOL→X', 'Wallet swaps SOL→X')}</text>
      <line x1="320" y1="180" x2="190" y2="226" stroke="#2455d4" strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="80" y="204" width="108" height="52" rx="10" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
      <text x="134" y="224" textAnchor="middle" fontSize="16">🔔</text>
      <text x="134" y="240" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1e40af" fontWeight="700">PING!</text>
      <text x="134" y="253" textAnchor="middle" fontFamily="sans-serif" fontSize="9.5" fill="#3b82f6">{t('Wallet tambah LP', 'Wallet adds LP')}</text>
      <rect x="500" y="108" width="180" height="80" rx="14" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
      <text x="590" y="134" textAnchor="middle" fontSize="20">👀</text>
      <text x="590" y="155" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#065f46" fontWeight="700">{t('KAMU', 'YOU')}</text>
      <text x="590" y="172" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">{t('"Mata tambahan" aktif', '"Extra eyes" active')}</text>
      <line x1="500" y1="148" x2="392" y2="148" stroke="#10b981" strokeWidth="2" />
      <rect x="480" y="208" width="200" height="52" rx="10" fill="#fef3c7" stroke="#fde68a" strokeWidth="1.5" />
      <text x="580" y="229" textAnchor="middle" fontFamily="sans-serif" fontSize="11.5" fill="#92400e" fontWeight="700">{t('⚠ Ping = Notifikasi saja', '⚠ Ping = Notification only')}</text>
      <text x="580" y="247" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">{t('Bukan sinyal langsung entry!', 'Not a direct entry signal!')}</text>
    </svg>
  );
}

export function MultiWalletSVG() {
  const t = useIT();
  return (
    <svg viewBox="0 0 700 290" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="290" fill="transparent" />
      <text x="350" y="32" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="#18182b">{t('Multi Wallet — Perbandingan Supply Control', 'Multi Wallet — Supply Control Comparison')}</text>
      <rect x="20" y="52" width="360" height="120" rx="14" fill="#fff1f1" stroke="#fca5a5" strokeWidth="1.5" />
      <text x="200" y="76" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#991b1b" fontWeight="700">{t('❌ Tanpa Multi Wallet', '❌ Without Multi Wallet')}</text>
      <rect x="40" y="88" width="320" height="70" rx="10" fill="rgba(220,38,38,.06)" stroke="#fca5a5" strokeWidth="1" />
      <text x="200" y="114" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b91c1c">{t('1 wallet = 3 SOL → 1 holder besar', '1 wallet = 3 SOL → 1 big holder')}</text>
      <text x="200" y="132" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">{t('Terlihat terkonsentrasi di explorer', 'Looks concentrated on explorer')}</text>
      <text x="200" y="150" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#ef4444">{t('Bot tidak masuk → volume flat', 'Bots don\'t enter → volume flat')}</text>
      <rect x="400" y="52" width="280" height="120" rx="14" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
      <text x="540" y="76" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#065f46" fontWeight="700">{t('✅ Dengan Multi Wallet', '✅ With Multi Wallet')}</text>
      <rect x="416" y="88" width="72" height="40" rx="8" fill="rgba(16,185,129,.12)" stroke="#86efac" />
      <text x="452" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#065f46" fontWeight="700">Wallet 1</text>
      <text x="452" y="122" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">1 SOL</text>
      <rect x="500" y="88" width="72" height="40" rx="8" fill="rgba(16,185,129,.12)" stroke="#86efac" />
      <text x="536" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#065f46" fontWeight="700">Wallet 2</text>
      <text x="536" y="122" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">1 SOL</text>
      <rect x="584" y="88" width="72" height="40" rx="8" fill="rgba(16,185,129,.12)" stroke="#86efac" />
      <text x="620" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#065f46" fontWeight="700">Wallet 3</text>
      <text x="620" y="122" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">1 SOL</text>
      <text x="416" y="150" fontFamily="sans-serif" fontSize="11.5" fill="#059669">{t('→ Terlihat merata = pasar lebih sehat', '→ Looks distributed = healthier market')}</text>
      <text x="416" y="166" fontFamily="sans-serif" fontSize="11.5" fill="#059669">{t('→ Bot terpancing beli → volume naik', '→ Bots get baited → volume rises')}</text>
      <circle cx="362" cy="113" r="22" fill="#1e3a8a" />
      <text x="362" y="120" textAnchor="middle" fontFamily="Georgia,serif" fontSize="14" fill="white" fontWeight="700">VS</text>
      <rect x="20" y="188" width="660" height="86" rx="14" fill="transparent" stroke="#e2e8f0" strokeWidth="1.5" />
      <text x="350" y="210" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#18182b" fontWeight="700">{t('📐 Strategi DCA Multi Wallet yang Benar', '📐 Correct Multi Wallet DCA Strategy')}</text>
      <line x1="40" y1="218" x2="660" y2="218" stroke="#e2e8f0" strokeWidth="1" />
      <text x="40" y="238" fontFamily="sans-serif" fontSize="12.5" fill="#3a3a55">{t('Wallet 1 beli di MC $10k (entry awal)', 'Wallet 1 buys at MC $10k (initial entry)')}</text>
      <text x="40" y="256" fontFamily="sans-serif" fontSize="12.5" fill="#3a3a55">{t('Token dip → jangan DCA pakai Wallet 1 lagi → pakai Wallet 2 untuk DCA', 'Token dips → don\'t DCA with Wallet 1 again → use Wallet 2 for DCA')}</text>
      <text x="40" y="270" fontFamily="sans-serif" fontSize="12" fill="#6b6b88">{t('Dengan begini, loss di Wallet 1 bisa ditutup lebih efisien tanpa double down membabi buta', 'This way, loss in Wallet 1 can be covered more efficiently without blind double-down')}</text>
    </svg>
  );
}
