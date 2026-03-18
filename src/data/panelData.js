// ═══════════════════════════════════════════════════
// PANEL DATA — All 17 panels (Vol.1 Basic + Vol.2 Advance)
// ═══════════════════════════════════════════════════

export const PANEL_ORDER = [
  'p0','p1','p2','p3','p4','p5','p6','p7','p8','p9',
  'pa0','pa1','pa2','pa3','pa4','pa5','pa6'
];

export const sidebarItems = [
  { id: 'p0', num: '1', title: 'Bundle Token', sub: 'Monopoli supply tersembunyi', vol: 1 },
  { id: 'p1', num: '2', title: 'Global Fees', sub: 'Detektor transaksi palsu', vol: 1 },
  { id: 'p2', num: '3', title: 'Revoke & Minting', sub: 'Jebakan yang kelihatan aman', vol: 1 },
  { id: 'p3', num: '4', title: 'Meme vs Utility', sub: 'Pilih sesuai style kamu', vol: 1 },
  { id: 'p4', num: '5', title: 'Dex Paid, Ads & Boost', sub: 'Sinyal kepercayaan pasar', vol: 1 },
  { id: 'p5', num: '6', title: '3 Konfirmasi Candle', sub: 'Cara nyari dip yang valid', vol: 1 },
  { id: 'p6', num: '7', title: 'Cabal Play', sub: 'Kelompok terorganisir', vol: 1 },
  { id: 'p7', num: '8', title: 'Membaca Holder', sub: 'Siapa yang sebenarnya pegang', vol: 1 },
  { id: 'p8', num: '9', title: 'Market Cap Tier', sub: 'Micro → CEX, beda strategi', vol: 1 },
  { id: 'p9', num: '★', title: 'Penutup', sub: 'Dari Poyin', vol: 1 },
  { id: 'pa0', num: 'A1', title: 'Cara Snipe Early', sub: 'Mapping + tools sniper', vol: 2 },
  { id: 'pa1', num: 'A2', title: 'First 1K dari $100', sub: 'Dua jalur nyata', vol: 2 },
  { id: 'pa2', num: 'A3', title: 'Wallet Ping', sub: '10 mata lebih baik', vol: 2 },
  { id: 'pa3', num: 'A4', title: 'Money Management', sub: 'Compounding + greedy', vol: 2 },
  { id: 'pa4', num: 'A5', title: 'Transaksi Murah', sub: 'RUST + RPC direct', vol: 2 },
  { id: 'pa5', num: 'A6', title: 'Instant Scalping', sub: '4 step new pair', vol: 2 },
  { id: 'pa6', num: 'A7', title: 'Multi Wallet', sub: 'Keajaiban trading', vol: 2 },
];

export const panels = {
  p0: {
    eyebrow: '1',
    eyebrowLabel: 'Ilmu Pertama',
    title: 'Bundle Token —\nMonopoli yang Tak Terlihat',
    sub: 'Dev yang cerdas tidak akan beli semua supply atas namanya sendiri. Mereka punya cara yang jauh lebih rapi — dan kamu perlu tahu cara mengenalinya.',
    breadcrumb: ['Vol. 1', 'Bundle Token', '1 dari 9'],
    nav: { prev: null, next: 'p1', counter: '1 / 9', prevLabel: '', nextLabel: 'Global Fees →' },
    type: 'bundle'
  },
  p1: {
    eyebrow: '2',
    eyebrowLabel: 'Ilmu Kedua',
    title: 'Global Fees —\nDetektor Transaksi Palsu',
    sub: 'Ada satu angka kecil yang tersembunyi di setiap transaksi token — dan kalau kamu tahu cara membacanya, kamu bisa langsung tahu apakah volume yang kelihatan "besar" itu nyata atau cuma pura-pura.',
    breadcrumb: ['Vol. 1', 'Global Fees', '2 dari 9'],
    nav: { prev: 'p0', next: 'p2', counter: '2 / 9', prevLabel: '← Bundle Token', nextLabel: 'Revoke & Minting →' },
    type: 'globalfees'
  },
  p2: {
    eyebrow: '3',
    eyebrowLabel: 'Ilmu Ketiga',
    title: 'Revoke & Minting —\nJebakan yang Kelihatan Aman',
    sub: 'Dua fitur teknis yang kedengarannya membosankan — tapi bisa jadi perbedaan antara kamu aman atau kamu yang jadi korban rug.',
    breadcrumb: ['Vol. 1', 'Revoke & Minting', '3 dari 9'],
    nav: { prev: 'p1', next: 'p3', counter: '3 / 9', prevLabel: '← Global Fees', nextLabel: 'Meme vs Utility →' },
    type: 'revoke'
  },
  p3: {
    eyebrow: '4',
    eyebrowLabel: 'Ilmu Keempat',
    title: 'Meme vs Utility —\nPilih Sesuai Style Kamu',
    sub: 'Pertanyaan "mana yang lebih baik — meme coin atau utility token?" adalah pertanyaan yang salah. Pertanyaan yang benar adalah: mana yang sesuai dengan cara bermain kamu?',
    breadcrumb: ['Vol. 1', 'Meme vs Utility', '4 dari 9'],
    nav: { prev: 'p2', next: 'p4', counter: '4 / 9', prevLabel: '← Revoke & Minting', nextLabel: 'Dex Paid →' },
    type: 'memevutil'
  },
  p4: {
    eyebrow: '5',
    eyebrowLabel: 'Ilmu Kelima',
    title: 'Dex Paid, Ads & Boost —\nSinyal atau Sekadar Bayar?',
    sub: 'Tiga sinyal yang kelihatannya sama tapi punya makna yang sangat berbeda. Belajar bedakannya bisa menghindarkan kamu dari FOMO yang tidak berdasar.',
    breadcrumb: ['Vol. 1', 'Dex Paid, Ads & Boost', '5 dari 9'],
    nav: { prev: 'p3', next: 'p5', counter: '5 / 9', prevLabel: '← Meme vs Utility', nextLabel: '3 Konfirmasi →' },
    type: 'dexpaid'
  },
  p5: {
    eyebrow: '6',
    eyebrowLabel: 'Ilmu Kelima (lanjutan)',
    title: '3 Konfirmasi Candle —\nCara Nyari Dip yang Valid',
    sub: 'Dari mana kamu tahu bahwa "dip ini kesempatan beli" bukan "dip ini sinyal jual"? Jawabannya ada di 3 konfirmasi candle.',
    breadcrumb: ['Vol. 1', '3 Konfirmasi Candle', '6 dari 9'],
    nav: { prev: 'p4', next: 'p6', counter: '6 / 9', prevLabel: '← Dex Paid', nextLabel: 'Cabal Play →' },
    type: 'konfirmasi'
  },
  p6: {
    eyebrow: '7',
    eyebrowLabel: 'Ilmu Keenam',
    title: 'Cabal Play —\nKetika Pasar Bergerak Terkoordinasi',
    sub: 'Cabal adalah kelompok trader yang bergerak bersama secara terencana untuk mendorong harga sebuah token. Memahami cara kerja mereka bisa menyelamatkan kamu dari FOMO dan membuka peluang entry yang lebih baik.',
    breadcrumb: ['Vol. 1', 'Cabal Play', '7 dari 9'],
    nav: { prev: 'p5', next: 'p7', counter: '7 / 9', prevLabel: '← 3 Konfirmasi', nextLabel: 'Membaca Holder →' },
    type: 'cabal'
  },
  p7: {
    eyebrow: '8',
    eyebrowLabel: 'Ilmu Ketujuh',
    title: 'Membaca Holder —\nYang Terlihat dan Yang Sebenarnya',
    sub: 'Pertanyaan "berapa persen holder yang bagus?" tidak punya jawaban yang berlaku universal. Setiap fase, setiap jenis play, punya konteks dan interpretasi yang sama sekali berbeda.',
    breadcrumb: ['Vol. 1', 'Membaca Holder', '8 dari 9'],
    nav: { prev: 'p6', next: 'p8', counter: '8 / 9', prevLabel: '← Cabal Play', nextLabel: 'Market Cap →' },
    type: 'holder'
  },
  p8: {
    eyebrow: '9',
    eyebrowLabel: 'Ilmu Kedelapan',
    title: 'Market Cap Tier —\nBeda Level, Beda Lawan, Beda Strategi',
    sub: 'Setiap tier market cap punya ekosistem pemain, level risiko, dan cara baca yang berbeda total. Strategi yang menghasilkan profit di micro cap bisa jadi bencana total kalau diterapkan di CEX play.',
    breadcrumb: ['Vol. 1', 'Market Cap Tier', '9 dari 9'],
    nav: { prev: 'p7', next: 'p9', counter: '9 / 9', prevLabel: '← Membaca Holder', nextLabel: 'Penutup →' },
    type: 'marketcap'
  },
  p9: {
    eyebrow: '★',
    eyebrowLabel: 'Penutup',
    title: 'Dari Poyin,\ndengan Tulus.',
    sub: 'Semua yang ada di sini hanyalah fondasi dasar. Masih banyak ilmu lain yang menunggu untuk dijelajahi — tapi fondasi yang kuat dan kokoh selalu lebih baik dari teknik yang canggih tapi berdiri di atas tanah yang rapuh.',
    breadcrumb: ['Vol. 1', 'Penutup', '★ dari 9'],
    nav: { prev: 'p8', next: 'p0', counter: '9 / 9', prevLabel: '← Market Cap Tier', nextLabel: 'Mulai dari awal →' },
    type: 'closing'
  },
  pa0: {
    eyebrow: 'A1',
    eyebrowLabel: 'Advance — Snipe',
    title: 'Cara Snipe\nEarly Project',
    sub: 'Trading itu seperti perang. Persenjataan lengkap membantu, teknologi canggih membantu — tapi satu hal yang tidak tergantikan adalah informasi. Siapa yang tahu lebih dulu, dia yang menang.',
    breadcrumb: ['Vol. 2 Advance', 'Snipe Early Project', 'A1 dari A7'],
    nav: { prev: null, next: 'pa1', counter: 'A1 / A7', prevLabel: '', nextLabel: 'Cara Dapat $1000 dari $100 →' },
    type: 'snipe',
    vol: 2
  },
  pa1: {
    eyebrow: 'A2',
    eyebrowLabel: 'Advance — Strategy',
    title: 'Cara Dapat\n$1000 dari $100',
    sub: 'Tidak ada jalan pintas yang benar-benar "pintas" — tapi ada dua jalur nyata yang sudah terbukti. Pilih sesuai kemampuan dan posisi kamu saat ini.',
    breadcrumb: ['Vol. 2 Advance', 'First 1K', 'A2 dari A7'],
    nav: { prev: 'pa0', next: 'pa2', counter: 'A2 / A7', prevLabel: '← Snipe Early Project', nextLabel: 'Wallet Ping →' },
    type: 'first1k',
    vol: 2
  },
  pa2: {
    eyebrow: 'A3',
    eyebrowLabel: 'Advance — Tracking',
    title: 'Cara Bikin\nMata Kamu Jadi Banyak',
    sub: '10 mata lebih baik dari 2 mata. Tapi bukan berarti kamu harus pantau 10 layar sekaligus — kamu cukup set wallet ping yang tepat, dan biarkan sistem yang bekerja.',
    breadcrumb: ['Vol. 2 Advance', 'Wallet Ping', 'A3 dari A7'],
    nav: { prev: 'pa1', next: 'pa3', counter: 'A3 / A7', prevLabel: '← First 1K dari $100', nextLabel: 'Modal yang Tepat →' },
    type: 'walletping',
    vol: 2
  },
  pa3: {
    eyebrow: 'A4',
    eyebrowLabel: 'Advance — Money Mgmt',
    title: 'Berapa Modal\nyang Tepat untuk Trade?',
    sub: 'Tidak ada angka yang berlaku untuk semua orang. Tapi ada kerangka yang terbukti bekerja — dan yang lebih penting, ada mental yang harus benar dulu sebelum angka apapun bisa bekerja.',
    breadcrumb: ['Vol. 2 Advance', 'Money Management', 'A4 dari A7'],
    nav: { prev: 'pa2', next: 'pa4', counter: 'A4 / A7', prevLabel: '← Wallet Ping', nextLabel: 'Transaksi Murah & Cepat →' },
    type: 'modal',
    vol: 2
  },
  pa4: {
    eyebrow: 'A5',
    eyebrowLabel: 'Advance — Tech',
    title: 'Transaksi Murah,\nSpeed Tetap Kencang',
    sub: 'Platform trading seperti Trojan, Flux, dan Axiom memberikan kenyamanan UI yang luar biasa — tapi ada harga yang dibayar setiap kali kamu trade di sana: platform fee. Ada cara untuk menghilangkannya.',
    breadcrumb: ['Vol. 2 Advance', 'Transaksi Murah', 'A5 dari A7'],
    nav: { prev: 'pa3', next: 'pa5', counter: 'A5 / A7', prevLabel: '← Money Management', nextLabel: 'Instant Scalping →' },
    type: 'transaksi',
    vol: 2
  },
  pa5: {
    eyebrow: 'A6',
    eyebrowLabel: 'Advance — Scalping',
    title: 'Instant Scalping —\n4 Step di New Pair',
    sub: 'Scalping bukan soal kecepatan semata — ini soal disiplin dalam chaos. Dengan metode 4 langkah ini, kamu mengubah ketidakpastian new pair menjadi kalkulasi yang terstruktur.',
    breadcrumb: ['Vol. 2 Advance', 'Instant Scalping', 'A6 dari A7'],
    nav: { prev: 'pa4', next: 'pa6', counter: 'A6 / A7', prevLabel: '← Transaksi Murah', nextLabel: 'Multi Wallet →' },
    type: 'scalping',
    vol: 2
  },
  pa6: {
    eyebrow: 'A7',
    eyebrowLabel: 'Advance — Multi Wallet',
    title: 'Multi Wallet —\nKeajaiban yang Bukan Keajaiban',
    sub: 'Multi wallet bukan tentang menyembunyikan diri. Ini tentang bermain lebih cerdas di ekosistem yang memang seperti itu adanya.',
    breadcrumb: ['Vol. 2 Advance', 'Multi Wallet', 'A7 dari A7'],
    nav: { prev: 'pa5', next: 'p0', counter: 'A7 / A7', prevLabel: '← Instant Scalping', nextLabel: 'Mulai dari awal ↺' },
    type: 'multiwallet',
    vol: 2
  },
};
