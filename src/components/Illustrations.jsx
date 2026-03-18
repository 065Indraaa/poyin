// ═══════════════════════════════════════════════════
// SVG ILLUSTRATIONS — Inline React SVG components
// ═══════════════════════════════════════════════════

export function GlobalFeesSVG() {
  return (
    <svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="320" fill="transparent" />
      <text x="350" y="38" textAnchor="middle" fontFamily="Georgia,serif" fontSize="20" fontWeight="700" fill="#18182b">Global Fees — Detektor Transaksi Asli vs Palsu</text>

      {/* Organic Volume */}
      <rect x="50" y="70" width="280" height="200" rx="16" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
      <text x="190" y="105" textAnchor="middle" fontSize="16" fontFamily="sans-serif" fontWeight="700" fill="#065f46">✅ Volume Organik (Nyata)</text>
      <line x1="70" y1="120" x2="310" y2="120" stroke="#86efac" strokeWidth="1" />
      <text x="100" y="150" fontFamily="sans-serif" fontSize="14" fill="#047857">Banyak Pembeli Berbeda  → </text>
      <text x="100" y="180" fontFamily="sans-serif" fontSize="14" fill="#047857">Setiap beli ada potongan fee</text>
      <text x="100" y="210" fontFamily="sans-serif" fontSize="14" fill="#047857">Volume $100k → Fee terkumpul $250</text>

      {/* Wash Trading */}
      <rect x="370" y="70" width="280" height="200" rx="16" fill="#fff1f1" stroke="#fca5a5" strokeWidth="2" />
      <text x="510" y="105" textAnchor="middle" fontSize="16" fontFamily="sans-serif" fontWeight="700" fill="#991b1b">❌ Wash Trading (Palsu)</text>
      <line x1="390" y1="120" x2="630" y2="120" stroke="#fca5a5" strokeWidth="1" />
      <text x="400" y="150" fontFamily="sans-serif" fontSize="14" fill="#b91c1c">Satu Orang / Bot Jual-Beli Sendiri → </text>
      <text x="400" y="180" fontFamily="sans-serif" fontSize="14" fill="#b91c1c">Mengelabui Fee Raydium</text>
      <text x="400" y="210" fontFamily="sans-serif" fontSize="14" fill="#b91c1c">Volume $100k → Fee cuma $10</text>

      <text x="350" y="300" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fill="#b45309" fontWeight="700">Tips: Gunakan DexScreener (Tab Info) untuk cek Total Fee Collected!</text>
    </svg>
  );
}

export function RevokeSVG() {
  return (
    <svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="280" fill="transparent" />
      <text x="350" y="38" textAnchor="middle" fontFamily="Georgia,serif" fontSize="20" fontWeight="700" fill="#18182b">Memahami Bahaya Mint Authority Aktif</text>

      {/* Normal Token */}
      <rect x="80" y="70" width="220" height="150" rx="16" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2" />
      <text x="190" y="105" textAnchor="middle" fontSize="15" fontFamily="sans-serif" fontWeight="700" fill="#1e40af">Token Normal (Aman)</text>
      <circle cx="150" cy="150" r="25" fill="#3b82f6" />
      <circle cx="230" cy="150" r="25" fill="#3b82f6" />
      <text x="190" y="200" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#1d4ed8">Supply Tetap 100 Token</text>

      <text x="350" y="150" textAnchor="middle" fontSize="24">VS</text>

      {/* Mint Enabled */}
      <rect x="400" y="70" width="220" height="150" rx="16" fill="#fff1f1" stroke="#fca5a5" strokeWidth="2" />
      <text x="510" y="105" textAnchor="middle" fontSize="15" fontFamily="sans-serif" fontWeight="700" fill="#991b1b">Mint Aktif (Bahaya)</text>
      <circle cx="450" cy="150" r="15" fill="#ef4444" />
      <circle cx="490" cy="150" r="15" fill="#ef4444" />
      <circle cx="530" cy="150" r="15" fill="#ef4444" />
      <circle cx="570" cy="150" r="15" fill="#ef4444" />
      <text x="510" y="200" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#b91c1c">Dev diam-diam cetak 1 Milyar token baru!</text>

      <text x="350" y="260" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fill="#92400e" fontStyle="italic">Hasilnya = Harga token terjun bebas ke angka nol (Dilusi total).</text>
    </svg>
  );
}

export function DexPaidSVG() {
  return (
    <svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="280" fill="transparent" />
      <text x="350" y="32" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="#18182b">Dex Paid vs Ads vs Boost</text>
      <text x="350" y="54" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#64748b">Kapan sinyal bagus? Kapan harus hati-hati?</text>

      {/* Timeline Line */}
      <line x1="80" y1="140" x2="620" y2="140" stroke="#e2e8f0" strokeWidth="4" />

      {/* Launch */}
      <circle cx="100" cy="140" r="8" fill="#cbd5e1" />
      <text x="100" y="170" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#64748b">Token</text>
      <text x="100" y="183" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#64748b">Launch</text>

      {/* Dex Paid — positive */}
      <circle cx="250" cy="140" r="12" fill="#3b82f6" />
      <rect x="195" y="72" width="110" height="44" rx="10" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
      <text x="250" y="91" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#1d4ed8">💳 Dex Paid</text>
      <text x="250" y="107" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#3b82f6">Di awal launch</text>
      <rect x="195" y="196" width="110" height="26" rx="6" fill="#d1fae5" />
      <text x="250" y="214" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="600" fill="#065f46">✅ Sinyal Bagus</text>

      {/* Price Pump arc */}
      <path d="M 310 140 Q 375 60 440 140" fill="transparent" stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 4" />
      <text x="375" y="90" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="600" fill="#047857">📈 Harga Naik</text>

      {/* Ads & Boost — negative */}
      <circle cx="500" cy="140" r="12" fill="#ef4444" />
      <rect x="435" y="72" width="130" height="44" rx="10" fill="#fff1f1" stroke="#fca5a5" strokeWidth="1.5" />
      <text x="500" y="91" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#b91c1c">📣 Ads + Boost</text>
      <text x="500" y="107" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#dc2626">Setelah harga puncak</text>
      <rect x="435" y="196" width="130" height="26" rx="6" fill="#fee2e2" />
      <text x="500" y="214" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="600" fill="#991b1b">⚠️ Exit Liquidity!</text>

      {/* Bottom Warning */}
      <rect x="100" y="240" width="500" height="30" rx="8" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
      <text x="350" y="260" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="600" fill="#92400e">Kunci: Perhatikan KAPAN iklan dipasang — awal launch = bagus, setelah pump = bahaya!</text>
    </svg>
  );
}

export function KonfirmasiSVG() {
  return (
    <svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="380" fill="transparent" />
      <text x="350" y="32" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="#18182b">Metode 3 Konfirmasi Candle</text>
      <text x="350" y="52" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#64748b">Cara beli di harga "murah" tanpa rungkad total</text>

      {/* Chart area background */}
      <rect x="30" y="65" width="420" height="280" rx="14" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />

      {/* Chart line */}
      <path d="M 60 100 L 170 235 L 270 175 L 370 265 L 430 130" fill="transparent" stroke="#3b82f6" strokeWidth="3.5" strokeLinejoin="round" />

      {/* Puncak Awal */}
      <circle cx="60" cy="100" r="6" fill="#94a3b8" />
      <text x="60" y="88" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#64748b">Puncak</text>

      {/* Tahap 1: Dip Pertama */}
      <circle cx="170" cy="235" r="9" fill="#ef4444" />
      <rect x="110" y="250" width="120" height="38" rx="6" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1" />
      <text x="170" y="267" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="700" fill="#b91c1c">1. Dip Pertama</text>
      <text x="170" y="282" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#dc2626">❌ JANGAN MASUK!</text>

      {/* Tahap 2: Bounce */}
      <circle cx="270" cy="175" r="9" fill="#f59e0b" />
      <rect x="210" y="122" width="120" height="38" rx="6" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
      <text x="270" y="139" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="700" fill="#b45309">2. Bounce</text>
      <text x="270" y="154" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#d97706">Beli 10% saja (Mark)</text>

      {/* Tahap 3: Konfirmasi */}
      <circle cx="370" cy="265" r="10" fill="#10b981" />
      <rect x="310" y="285" width="120" height="38" rx="6" fill="#d1fae5" stroke="#86efac" strokeWidth="1" />
      <text x="370" y="302" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="700" fill="#047857">3. Konfirmasi</text>
      <text x="370" y="317" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#059669">✅ BELI PENUH!</text>

      {/* Right side explanation */}
      <rect x="470" y="85" width="210" height="230" rx="14" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
      <text x="575" y="115" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fontWeight="700" fill="#1e40af">Kenapa Harus Gini?</text>
      <line x1="490" y1="126" x2="660" y2="126" stroke="#bfdbfe" strokeWidth="1" />
      <text x="490" y="150" fontFamily="sans-serif" fontSize="12" fill="#1d4ed8">Kalau harga terus turun</text>
      <text x="490" y="168" fontFamily="sans-serif" fontSize="12" fill="#1d4ed8">setelah "dip kedua":</text>
      <text x="490" y="200" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#065f46">→ Kamu cuma rugi 10%</text>
      <text x="490" y="220" fontFamily="sans-serif" fontSize="12" fill="#047857">   (dari mark position)</text>
      <text x="490" y="252" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#b91c1c">→ Bukan rugi 100%</text>
      <text x="490" y="272" fontFamily="sans-serif" fontSize="12" fill="#dc2626">   (kalau langsung all-in)</text>
      <text x="575" y="300" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fontWeight="600" fill="#1e40af">Sabar = Selamat 🛡️</text>
    </svg>
  );
}

export function BundleSVG() {
  return (
    <svg viewBox="0 0 700 380" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="380" fill="transparent" />
      <text x="350" y="38" textAnchor="middle" fontFamily="Georgia,serif" fontSize="20" fontWeight="700" fill="#18182b">Bundle Token — Ilustrasi Cara Kerja</text>
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
      <text x="430" y="74" fontFamily="sans-serif" fontSize="12" fill="#64748b" fontWeight="600">📊 Tampilan di Explorer</text>
      <text x="430" y="94" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">Holder #1 · 0xAbc...</text>
      <text x="600" y="94" textAnchor="end" fontFamily="sans-serif" fontSize="12.5" fill="#2563eb" fontWeight="700">3.2%</text>
      <text x="430" y="114" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">Holder #2 · 0xDef...</text>
      <text x="600" y="114" textAnchor="end" fontFamily="sans-serif" fontSize="12.5" fill="#2563eb" fontWeight="700">2.8%</text>
      <text x="430" y="134" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">Holder #3 · 0xGhi...</text>
      <text x="600" y="134" textAnchor="end" fontFamily="sans-serif" fontSize="12.5" fill="#2563eb" fontWeight="700">1.9%</text>
      <text x="430" y="156" fontFamily="sans-serif" fontSize="11.5" fill="#94a3b8" fontStyle="italic">Kelihatan seperti 3 holder berbeda...</text>
      <rect x="410" y="184" width="260" height="60" rx="14" fill="#fef3c7" stroke="#fde68a" strokeWidth="2" />
      <text x="540" y="210" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#92400e" fontWeight="700">⚠ Kenyataannya:</text>
      <text x="540" y="230" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fill="#b45309" fontWeight="700">1 orang = 7.9% supply!</text>
      <line x1="30" y1="272" x2="670" y2="272" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="8 4" />
      <rect x="30" y="287" width="200" height="70" rx="12" fill="#f0fdf4" stroke="#a7f3d0" strokeWidth="1.5" />
      <text x="130" y="312" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#065f46" fontWeight="700">New Pair</text>
      <text x="130" y="330" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#047857">7–10% per wallet</text>
      <text x="130" y="347" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#059669">= wajar di hype narasi</text>
      <rect x="250" y="287" width="200" height="70" rx="12" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1.5" />
      <text x="350" y="312" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#9a3412" fontWeight="700">Multi-Wallet</text>
      <text x="350" y="330" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#c2410c">Semua pakai ini</text>
      <text x="350" y="347" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#ea580c">termasuk KOL terbaik</text>
      <rect x="470" y="287" width="200" height="70" rx="12" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
      <text x="570" y="312" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#1e40af" fontWeight="700">Zero Sum</text>
      <text x="570" y="330" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#1d4ed8">Semua main untuk</text>
      <text x="570" y="347" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#2563eb">profit sendiri</text>
    </svg>
  );
}

export function MarketCapSVG() {
  return (
    <svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="400" fill="transparent" />
      <text x="350" y="36" textAnchor="middle" fontFamily="Georgia,serif" fontSize="20" fontWeight="700" fill="#18182b">Dari New Pair ke CEX — Beda Level, Beda Lawan</text>
      <rect x="20" y="60" width="124" height="300" rx="14" fill="#fff1f1" stroke="#fca5a5" strokeWidth="2" />
      <text x="82" y="86" textAnchor="middle" fontSize="26">🌀</text>
      <text x="82" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#991b1b" fontWeight="700">New Pair</text>
      <text x="82" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">Pure Chaos</text>
      <line x1="40" y1="138" x2="124" y2="138" stroke="#fca5a5" strokeWidth="1" />
      <text x="82" y="158" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b91c1c" fontWeight="600">Pemain:</text>
      <text x="82" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">Bot sniper</text>
      <text x="82" y="192" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">Cabal</text>
      <text x="82" y="209" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">Whale awal</text>
      <line x1="40" y1="222" x2="124" y2="222" stroke="#fca5a5" strokeWidth="1" />
      <text x="82" y="242" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b91c1c" fontWeight="600">Strategi:</text>
      <text x="82" y="259" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">Narasi</text>
      <text x="82" y="276" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">entry cepat</text>
      <text x="82" y="293" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">exit lebih cepat</text>
      <text x="82" y="340" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#ef4444" fontWeight="700">⚡ Risiko</text>
      <text x="82" y="356" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#dc2626" fontWeight="700">TERTINGGI</text>
      <rect x="156" y="60" width="124" height="300" rx="14" fill="#fff8ec" stroke="#fde68a" strokeWidth="2" />
      <text x="218" y="86" textAnchor="middle" fontSize="26">🌱</text>
      <text x="218" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#92400e" fontWeight="700">Micro Cap</text>
      <text x="218" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">$100k – $5M</text>
      <line x1="176" y1="138" x2="260" y2="138" stroke="#fde68a" strokeWidth="1" />
      <text x="218" y="158" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#92400e" fontWeight="600">Pemain:</text>
      <text x="218" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">Scalper</text>
      <text x="218" y="192" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">Bot & raider</text>
      <text x="218" y="209" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">Komunitas kecil</text>
      <line x1="176" y1="222" x2="260" y2="222" stroke="#fde68a" strokeWidth="1" />
      <text x="218" y="242" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#92400e" fontWeight="600">Strategi:</text>
      <text x="218" y="259" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">Baca chart</text>
      <text x="218" y="276" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">cari reversal</text>
      <text x="218" y="293" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">scalp entry</text>
      <text x="218" y="340" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#d97706" fontWeight="700">📊 Mulai bisa</text>
      <text x="218" y="356" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#b45309" fontWeight="700">analisis TA</text>
      <rect x="292" y="60" width="124" height="300" rx="14" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
      <text x="354" y="86" textAnchor="middle" fontSize="26">🐬</text>
      <text x="354" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#1e40af" fontWeight="700">Mid Cap</text>
      <text x="354" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">$5M – $50M</text>
      <line x1="312" y1="138" x2="396" y2="138" stroke="#93c5fd" strokeWidth="1" />
      <text x="354" y="158" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1e40af" fontWeight="600">Pemain:</text>
      <text x="354" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">Dolphin</text>
      <text x="354" y="192" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">Whale awal</text>
      <text x="354" y="209" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">Media mulai masuk</text>
      <line x1="312" y1="222" x2="396" y2="222" stroke="#93c5fd" strokeWidth="1" />
      <text x="354" y="242" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1e40af" fontWeight="600">Strategi:</text>
      <text x="354" y="259" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">Main size besar</text>
      <text x="354" y="276" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">perlu entry pas</text>
      <text x="354" y="293" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">belum buy & forget</text>
      <text x="354" y="340" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#2563eb" fontWeight="700">📰 Bensin pump:</text>
      <text x="354" y="356" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#1d4ed8" fontWeight="700">Media</text>
      <rect x="428" y="60" width="124" height="300" rx="14" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="2" />
      <text x="490" y="86" textAnchor="middle" fontSize="26">🐳</text>
      <text x="490" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#4c1d95" fontWeight="700">High Cap</text>
      <text x="490" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#5b21b6">$50M – $200M</text>
      <line x1="448" y1="138" x2="532" y2="138" stroke="#c4b5fd" strokeWidth="1" />
      <text x="490" y="158" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#4c1d95" fontWeight="600">Pemain:</text>
      <text x="490" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#5b21b6">Whale besar</text>
      <text x="490" y="192" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#5b21b6">CNN, NewTalk</text>
      <text x="490" y="209" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#5b21b6">Brand & media</text>
      <line x1="448" y1="222" x2="532" y2="222" stroke="#c4b5fd" strokeWidth="1" />
      <text x="490" y="242" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#4c1d95" fontWeight="600">Strategi:</text>
      <text x="490" y="259" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#5b21b6">DCA tipis</text>
      <text x="490" y="276" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#5b21b6">media goreng =</text>
      <text x="490" y="293" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#7c3aed" fontWeight="700">sinyal KELUAR</text>
      <text x="490" y="340" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#6d28d9" fontWeight="700">📺 Ini puncak</text>
      <text x="490" y="356" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#4c1d95" fontWeight="700">hype-nya</text>
      <rect x="564" y="60" width="116" height="300" rx="14" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
      <text x="622" y="86" textAnchor="middle" fontSize="26">🏦</text>
      <text x="622" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#065f46" fontWeight="700">CEX</text>
      <text x="622" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">Listing besar</text>
      <line x1="584" y1="138" x2="660" y2="138" stroke="#86efac" strokeWidth="1" />
      <text x="622" y="158" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#065f46" fontWeight="600">Lawan:</text>
      <text x="622" y="175" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">Wintermute</text>
      <text x="622" y="192" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">Hedge Fund</text>
      <text x="622" y="209" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">Market Maker</text>
      <line x1="584" y1="222" x2="660" y2="222" stroke="#86efac" strokeWidth="1" />
      <text x="622" y="242" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#065f46" fontWeight="600">Strategi:</text>
      <text x="622" y="259" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">Hati-hati</text>
      <text x="622" y="276" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">posisi kecil</text>
      <text x="622" y="293" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#059669">OTC bukan retail</text>
      <text x="622" y="340" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#059669" fontWeight="700">💪 Lawan beda</text>
      <text x="622" y="356" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#065f46" fontWeight="700">level</text>
    </svg>
  );
}

export function SnipeSVG() {
  return (
    <svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="300" fill="transparent" />
      <text x="350" y="34" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="#18182b">Tahapan Snipe Early Project</text>
      <rect x="20" y="60" width="130" height="80" rx="14" fill="#fff1f1" stroke="#fca5a5" strokeWidth="2" />
      <text x="85" y="92" textAnchor="middle" fontSize="22">🗺️</text>
      <text x="85" y="112" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#991b1b" fontWeight="700">1. MAPPING</text>
      <text x="85" y="128" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="#dc2626">Siapa deploy? Di mana?</text>
      <polygon points="155,100 172,92 172,108" fill="#94a3b8" />
      <rect x="175" y="60" width="130" height="80" rx="14" fill="#fff8ec" stroke="#fde68a" strokeWidth="2" />
      <text x="240" y="92" textAnchor="middle" fontSize="22">🛠️</text>
      <text x="240" y="112" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#92400e" fontWeight="700">2. EQUIPMENT</text>
      <text x="240" y="128" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="#b45309">Siapkan bot sniper</text>
      <polygon points="310,100 327,92 327,108" fill="#94a3b8" />
      <rect x="330" y="60" width="130" height="80" rx="14" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
      <text x="395" y="92" textAnchor="middle" fontSize="22">⚡</text>
      <text x="395" y="112" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#1e40af" fontWeight="700">3. SNIPE</text>
      <text x="395" y="128" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="#1d4ed8">Eksekusi di momen launch</text>
      <polygon points="465,100 482,92 482,108" fill="#94a3b8" />
      <rect x="485" y="60" width="195" height="80" rx="14" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
      <text x="582" y="92" textAnchor="middle" fontSize="22">💰</text>
      <text x="582" y="112" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#065f46" fontWeight="700">4. PROFIT</text>
      <text x="582" y="128" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="#047857">Exit sebelum orang sadar</text>
      <rect x="20" y="168" width="660" height="112" rx="16" fill="#1e3a8a" stroke="#2455d4" strokeWidth="2" />
      <text x="350" y="196" textAnchor="middle" fontFamily="Georgia,serif" fontSize="15" fontWeight="700" fill="#fff">🏆 Case Study: Naseem — $trump Launch</text>
      <rect x="44" y="208" width="180" height="56" rx="10" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.2)" strokeWidth="1" />
      <text x="134" y="228" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="rgba(255,255,255,.7)">Masuk sebelum</text>
      <text x="134" y="244" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="white" fontWeight="700">⏱ 0.05 detik</text>
      <text x="134" y="258" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="rgba(255,255,255,.6)">sebelum liquidity add</text>
      <rect x="237" y="208" width="160" height="56" rx="10" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.2)" strokeWidth="1" />
      <text x="317" y="228" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="rgba(255,255,255,.7)">Gas fee dipakai</text>
      <text x="317" y="244" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="white" fontWeight="700">💸 $100k USD</text>
      <text x="317" y="258" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="rgba(255,255,255,.6)">untuk kecepatan</text>
      <rect x="410" y="208" width="148" height="56" rx="10" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.2)" strokeWidth="1" />
      <text x="484" y="228" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="rgba(255,255,255,.7)">Modal masuk</text>
      <text x="484" y="244" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="white" fontWeight="700">🎯 $1 Juta</text>
      <text x="484" y="258" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="rgba(255,255,255,.6)">→ profit $302 Juta</text>
    </svg>
  );
}

export function WalletPingSVG() {
  return (
    <svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="280" fill="transparent" />
      <text x="350" y="32" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="#18182b">Wallet Ping — Cara Kerja "10 Mata"</text>
      <circle cx="350" cy="148" r="40" fill="#2455d4" stroke="#1d4ed8" strokeWidth="2" />
      <text x="350" y="143" textAnchor="middle" fontSize="20">🎯</text>
      <text x="350" y="161" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="white" fontWeight="700">Top Trader</text>
      <text x="350" y="174" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="rgba(255,255,255,.7)">(wallet dipantau)</text>
      <line x1="316" y1="115" x2="188" y2="70" stroke="#2455d4" strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="80" y="44" width="108" height="52" rx="10" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
      <text x="134" y="64" textAnchor="middle" fontSize="16">🔔</text>
      <text x="134" y="80" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1e40af" fontWeight="700">PING!</text>
      <text x="134" y="93" textAnchor="middle" fontFamily="sans-serif" fontSize="9.5" fill="#3b82f6">Wallet beli $TOKEN</text>
      <line x1="310" y1="148" x2="148" y2="148" stroke="#2455d4" strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="40" y="122" width="108" height="52" rx="10" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
      <text x="94" y="142" textAnchor="middle" fontSize="16">🔔</text>
      <text x="94" y="158" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1e40af" fontWeight="700">PING!</text>
      <text x="94" y="171" textAnchor="middle" fontFamily="sans-serif" fontSize="9.5" fill="#3b82f6">Wallet swap SOL→X</text>
      <line x1="320" y1="180" x2="190" y2="226" stroke="#2455d4" strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="80" y="204" width="108" height="52" rx="10" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
      <text x="134" y="224" textAnchor="middle" fontSize="16">🔔</text>
      <text x="134" y="240" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1e40af" fontWeight="700">PING!</text>
      <text x="134" y="253" textAnchor="middle" fontFamily="sans-serif" fontSize="9.5" fill="#3b82f6">Wallet tambah LP</text>
      <rect x="500" y="108" width="180" height="80" rx="14" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
      <text x="590" y="134" textAnchor="middle" fontSize="20">👀</text>
      <text x="590" y="155" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#065f46" fontWeight="700">KAMU</text>
      <text x="590" y="172" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">"Mata tambahan" aktif</text>
      <line x1="500" y1="148" x2="392" y2="148" stroke="#10b981" strokeWidth="2" />
      <rect x="480" y="208" width="200" height="52" rx="10" fill="#fef3c7" stroke="#fde68a" strokeWidth="1.5" />
      <text x="580" y="229" textAnchor="middle" fontFamily="sans-serif" fontSize="11.5" fill="#92400e" fontWeight="700">⚠ Ping = Notifikasi saja</text>
      <text x="580" y="247" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309">Bukan sinyal langsung entry!</text>
    </svg>
  );
}

export function MultiWalletSVG() {
  return (
    <svg viewBox="0 0 700 290" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
      <rect width="700" height="290" fill="transparent" />
      <text x="350" y="32" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="#18182b">Multi Wallet — Perbandingan Supply Control</text>
      <rect x="20" y="52" width="360" height="120" rx="14" fill="#fff1f1" stroke="#fca5a5" strokeWidth="1.5" />
      <text x="200" y="76" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#991b1b" fontWeight="700">❌ Tanpa Multi Wallet</text>
      <rect x="40" y="88" width="320" height="70" rx="10" fill="rgba(220,38,38,.06)" stroke="#fca5a5" strokeWidth="1" />
      <text x="200" y="114" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b91c1c">1 wallet = 3 SOL → 1 holder besar</text>
      <text x="200" y="132" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#dc2626">Terlihat terkonsentrasi di explorer</text>
      <text x="200" y="150" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#ef4444">Bot tidak masuk → volume flat</text>
      <rect x="400" y="52" width="280" height="120" rx="14" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
      <text x="540" y="76" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#065f46" fontWeight="700">✅ Dengan Multi Wallet</text>
      <rect x="416" y="88" width="72" height="40" rx="8" fill="rgba(16,185,129,.12)" stroke="#86efac" />
      <text x="452" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#065f46" fontWeight="700">Wallet 1</text>
      <text x="452" y="122" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">1 SOL</text>
      <rect x="500" y="88" width="72" height="40" rx="8" fill="rgba(16,185,129,.12)" stroke="#86efac" />
      <text x="536" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#065f46" fontWeight="700">Wallet 2</text>
      <text x="536" y="122" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">1 SOL</text>
      <rect x="584" y="88" width="72" height="40" rx="8" fill="rgba(16,185,129,.12)" stroke="#86efac" />
      <text x="620" y="108" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#065f46" fontWeight="700">Wallet 3</text>
      <text x="620" y="122" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">1 SOL</text>
      <text x="416" y="150" fontFamily="sans-serif" fontSize="11.5" fill="#059669">→ Terlihat merata = pasar lebih sehat</text>
      <text x="416" y="166" fontFamily="sans-serif" fontSize="11.5" fill="#059669">→ Bot terpancing beli → volume naik</text>
      <circle cx="362" cy="113" r="22" fill="#1e3a8a" />
      <text x="362" y="120" textAnchor="middle" fontFamily="Georgia,serif" fontSize="14" fill="white" fontWeight="700">VS</text>
      <rect x="20" y="188" width="660" height="86" rx="14" fill="transparent" stroke="#e2e8f0" strokeWidth="1.5" />
      <text x="350" y="210" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#18182b" fontWeight="700">📐 Strategi DCA Multi Wallet yang Benar</text>
      <line x1="40" y1="218" x2="660" y2="218" stroke="#e2e8f0" strokeWidth="1" />
      <text x="40" y="238" fontFamily="sans-serif" fontSize="12.5" fill="#3a3a55">Wallet 1 beli di MC $10k (entry awal)</text>
      <text x="40" y="256" fontFamily="sans-serif" fontSize="12.5" fill="#3a3a55">Token dip → jangan DCA pakai Wallet 1 lagi → pakai Wallet 2 untuk DCA</text>
      <text x="40" y="270" fontFamily="sans-serif" fontSize="12" fill="#6b6b88">Dengan begini, loss di Wallet 1 bisa ditutup lebih efisien tanpa double down membabi buta</text>
    </svg>
  );
}
