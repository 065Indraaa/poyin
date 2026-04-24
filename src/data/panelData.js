// ═══════════════════════════════════════════════════
// PANEL DATA — All 17 panels (Vol.1 Basic + Vol.2 Advance)
// Now bilingual: id (Indonesia) / en (English)
// ═══════════════════════════════════════════════════

export const PANEL_ORDER = [
  'p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9',
  'pa0', 'pa1', 'pa2', 'pa3', 'pa4', 'pa5', 'pa6', 'pa7', 'pa8', 'pa9'
];

export const sidebarItemsData = {
  id: [
    { id: 'p0', num: '1', title: 'Bundle Token', sub: 'Monopoli supply tersembunyi', vol: 1 },
    { id: 'p1', num: '2', title: 'Global Fees', sub: 'Detektor transaksi palsu', vol: 1 },
    { id: 'p2', num: '3', title: 'Revoke & Minting', sub: 'Jebakan yang kelihatan aman', vol: 1 },
    { id: 'p3', num: '4', title: 'Meme vs Utility', sub: 'Pilih sesuai style kamu', vol: 1 },
    { id: 'p4', num: '5', title: 'Dex Paid, Ads & Boost', sub: 'Sinyal kepercayaan pasar', vol: 1 },
    { id: 'p5', num: '6', title: '3 Konfirmasi Candle', sub: 'Cara nyari dip yang valid', vol: 1 },
    { id: 'p6', num: '7', title: 'Cabal Play', sub: 'Kelompok terorganisir', vol: 1 },
    { id: 'p7', num: '8', title: 'Membaca Holder', sub: 'Siapa yang sebenarnya pegang', vol: 1 },
    { id: 'p8', num: '9', title: 'Market Cap Tier', sub: 'Micro → CEX, beda strategi', vol: 1 },
    { id: 'p9', num: '★', title: 'Penutup', sub: 'Dari Ponyin', vol: 1 },
    { id: 'pa0', num: 'A1', title: 'Cara Snipe Early', sub: 'Mapping + tools sniper', vol: 2 },
    { id: 'pa1', num: 'A2', title: 'First 1K dari $100', sub: 'Dua jalur nyata', vol: 2 },
    { id: 'pa2', num: 'A3', title: 'Wallet Ping', sub: '10 mata lebih baik', vol: 2 },
    { id: 'pa3', num: 'A4', title: 'Money Management', sub: 'Compounding + greedy', vol: 2 },
    { id: 'pa4', num: 'A5', title: 'Transaksi Murah', sub: 'RUST + RPC direct', vol: 2 },
    { id: 'pa5', num: 'A6', title: 'Rent Refund', sub: 'Tarik kembali uang sewa', vol: 2 },
    { id: 'pa6', num: 'A7', title: 'Instant Scalping', sub: '4 step new pair', vol: 2 },
    { id: 'pa7', num: 'A8', title: 'Multi Wallet', sub: 'Keajaiban trading', vol: 2 },
    { id: 'pa8', num: 'A9', title: 'Unwritten Rules', sub: 'Etika survival jangka panjang', vol: 2 },
    { id: 'pa9', num: 'A10', title: 'Skema Penipuan', sub: 'Pig butchering & drainer', vol: 2 },
  ],
  en: [
    { id: 'p0', num: '1', title: 'Bundle Token', sub: 'Hidden supply monopoly', vol: 1 },
    { id: 'p1', num: '2', title: 'Global Fees', sub: 'Fake transaction detector', vol: 1 },
    { id: 'p2', num: '3', title: 'Revoke & Minting', sub: 'Traps that look safe', vol: 1 },
    { id: 'p3', num: '4', title: 'Meme vs Utility', sub: 'Pick your trading style', vol: 1 },
    { id: 'p4', num: '5', title: 'Dex Paid, Ads & Boost', sub: 'Market confidence signals', vol: 1 },
    { id: 'p5', num: '6', title: '3 Candle Confirmation', sub: 'Finding valid dips', vol: 1 },
    { id: 'p6', num: '7', title: 'Cabal Play', sub: 'Organized groups', vol: 1 },
    { id: 'p7', num: '8', title: 'Reading Holders', sub: 'Who really holds the bag', vol: 1 },
    { id: 'p8', num: '9', title: 'Market Cap Tier', sub: 'Micro → CEX, different strategies', vol: 1 },
    { id: 'p9', num: '★', title: 'Closing', sub: 'From Ponyin', vol: 1 },
    { id: 'pa0', num: 'A1', title: 'How to Snipe Early', sub: 'Mapping + sniper tools', vol: 2 },
    { id: 'pa1', num: 'A2', title: 'First 1K from $100', sub: 'Two real paths', vol: 2 },
    { id: 'pa2', num: 'A3', title: 'Wallet Ping', sub: '10 eyes are better', vol: 2 },
    { id: 'pa3', num: 'A4', title: 'Money Management', sub: 'Compounding + greed', vol: 2 },
    { id: 'pa4', num: 'A5', title: 'Cheap Transactions', sub: 'RUST + RPC direct', vol: 2 },
    { id: 'pa5', num: 'A6', title: 'Rent Refund', sub: 'Claim back rent deposits', vol: 2 },
    { id: 'pa6', num: 'A7', title: 'Instant Scalping', sub: '4 step new pair', vol: 2 },
    { id: 'pa7', num: 'A8', title: 'Multi Wallet', sub: 'The trading miracle', vol: 2 },
    { id: 'pa8', num: 'A9', title: 'Unwritten Rules', sub: 'Long-term survival ethics', vol: 2 },
    { id: 'pa9', num: 'A10', title: 'Scams & Drainers', sub: 'Pig butchering & airdrops', vol: 2 },
  ],
};

// Legacy export for components that haven't migrated yet
export const sidebarItems = sidebarItemsData.id;

export const panelsData = {
  id: {
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
      title: 'Dari Ponyin,\ndengan Tulus.',
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
      breadcrumb: ['Vol. 2 Advance', 'Snipe Early Project', 'A1 dari A8'],
      nav: { prev: null, next: 'pa1', counter: 'A1 / A8', prevLabel: '', nextLabel: 'Cara Dapat $1000 dari $100 →' },
      type: 'snipe',
      vol: 2
    },
    pa1: {
      eyebrow: 'A2',
      eyebrowLabel: 'Advance — Strategy',
      title: 'Cara Dapat\n$1000 dari $100',
      sub: 'Tidak ada jalan pintas yang benar-benar "pintas" — tapi ada dua jalur nyata yang sudah terbukti. Pilih sesuai kemampuan dan posisi kamu saat ini.',
      breadcrumb: ['Vol. 2 Advance', 'First 1K', 'A2 dari A8'],
      nav: { prev: 'pa0', next: 'pa2', counter: 'A2 / A8', prevLabel: '← Snipe Early Project', nextLabel: 'Wallet Ping →' },
      type: 'first1k',
      vol: 2
    },
    pa2: {
      eyebrow: 'A3',
      eyebrowLabel: 'Advance — Tracking',
      title: 'Cara Bikin\nMata Kamu Jadi Banyak',
      sub: '10 mata lebih baik dari 2 mata. Tapi bukan berarti kamu harus pantau 10 layar sekaligus — kamu cukup set wallet ping yang tepat, dan biarkan sistem yang bekerja.',
      breadcrumb: ['Vol. 2 Advance', 'Wallet Ping', 'A3 dari A8'],
      nav: { prev: 'pa1', next: 'pa3', counter: 'A3 / A8', prevLabel: '← First 1K dari $100', nextLabel: 'Modal yang Tepat →' },
      type: 'walletping',
      vol: 2
    },
    pa3: {
      eyebrow: 'A4',
      eyebrowLabel: 'Advance — Money Mgmt',
      title: 'Berapa Modal\nyang Tepat untuk Trade?',
      sub: 'Tidak ada angka yang berlaku untuk semua orang. Tapi ada kerangka yang terbukti bekerja — dan yang lebih penting, ada mental yang harus benar dulu sebelum angka apapun bisa bekerja.',
      breadcrumb: ['Vol. 2 Advance', 'Money Management', 'A4 dari A8'],
      nav: { prev: 'pa2', next: 'pa4', counter: 'A4 / A8', prevLabel: '← Wallet Ping', nextLabel: 'Transaksi Murah & Cepat →' },
      type: 'modal',
      vol: 2
    },
    pa4: {
      eyebrow: 'A5',
      eyebrowLabel: 'Advance — Tech',
      title: 'Transaksi Murah,\nSpeed Tetap Kencang',
      sub: 'Platform trading seperti Trojan, Flux, dan Axiom memberikan kenyamanan UI yang luar biasa — tapi ada harga yang dibayar setiap kali kamu trade di sana: platform fee. Ada cara untuk menghilangkannya.',
      breadcrumb: ['Vol. 2 Advance', 'Transaksi Murah', 'A5 dari A8'],
      nav: { prev: 'pa3', next: 'pa5', counter: 'A5 / A8', prevLabel: '← Money Management', nextLabel: 'Rent Refund →' },
      type: 'transaksi',
      vol: 2
    },
    pa5: {
      eyebrow: 'A6',
      eyebrowLabel: 'Advance — Tools',
      title: 'Rent Refund —\nTarik Kembali Uang Sewa',
      sub: 'Setiap kali kamu beli koin baru di Solana, ada saldo kecil yang tertahan sebagai uang sewa akun. Bayangkan kalau kamu sudah transaksi ratusan kali — berapa banyak uang kamu yang mengendap?',
      breadcrumb: ['Vol. 2 Advance', 'Rent Refund', 'A6 dari A8'],
      nav: { prev: 'pa4', next: 'pa6', counter: 'A6 / A8', prevLabel: '← Transaksi Murah', nextLabel: 'Instant Scalping →' },
      type: 'refund',
      vol: 2
    },
    pa6: {
      eyebrow: 'A7',
      eyebrowLabel: 'Advance — Scalping',
      title: 'Instant Scalping —\nCara Filter New Pair',
      sub: 'Ini rahasia dapur yang sebenernya. 4 langkah sederhana yang bisa menghindarkan kamu dari rug — dan membuka peluang scalp 60–70% di fresh launch.',
      breadcrumb: ['Vol. 2 Advance', 'Instant Scalping', 'A7 dari A8'],
      nav: { prev: 'pa5', next: 'pa7', counter: 'A7 / A8', prevLabel: '← Rent Refund', nextLabel: 'Multi Wallet →' },
      type: 'scalping',
      vol: 2
    },
    pa7: {
      eyebrow: 'A8',
      eyebrowLabel: 'Advance — Multi Wallet',
      title: 'Multi Wallet —\nKeajaiban yang Bukan Keajaiban',
      sub: 'Multi wallet bukan tentang menyembunyikan diri. Ini tentang bermain lebih cerdas di ekosistem yang memang seperti itu adanya.',
      breadcrumb: ['Vol. 2 Advance', 'Multi Wallet', 'A8 dari A9'],
      nav: { prev: 'pa6', next: 'pa8', counter: 'A8 / A9', prevLabel: '← Instant Scalping', nextLabel: 'Unwritten Rules →' },
      type: 'multiwallet',
      vol: 2
    },
    pa8: {
      eyebrow: 'A9',
      eyebrowLabel: 'Advance — Etika',
      title: 'Unwritten Rules —\nJangan Makan Orang Sendiri',
      sub: 'Ada aturan tak tertulis yang menentukan siapa yang bertahan sampai akhir cycle. Ini bukan soal banyak-banyakan porto — tapi siapa yang bisa survive.',
      breadcrumb: ['Vol. 2 Advance', 'Unwritten Rules', 'A9 dari A10'],
      nav: { prev: 'pa7', next: 'pa9', counter: 'A9 / A10', prevLabel: '← Multi Wallet', nextLabel: 'Skema Penipuan →' },
      type: 'unwritten',
      vol: 2
    },
    pa9: {
      eyebrow: 'A10',
      eyebrowLabel: 'Advance — Security',
      title: 'Skema Penipuan —\nPig Butchering & Drainer',
      sub: 'Di dunia kripto, uangmu bisa hilang bukan cuma karena market turun, tapi karena jebakan manipulasi psikologis dan smart contract.',
      breadcrumb: ['Vol. 2 Advance', 'Skema Penipuan', 'A10 dari A10'],
      nav: { prev: 'pa8', next: 'p0', counter: 'A10 / A10', prevLabel: '← Unwritten Rules', nextLabel: 'Mulai dari awal ↺' },
      type: 'scam',
      vol: 2
    },
  },
  en: {
    p0: {
      eyebrow: '1',
      eyebrowLabel: 'Lesson One',
      title: 'Bundle Token —\nThe Invisible Monopoly',
      sub: 'Smart devs won\'t buy the entire supply under their own name. They have much neater methods — and you need to know how to spot them.',
      breadcrumb: ['Vol. 1', 'Bundle Token', '1 of 9'],
      nav: { prev: null, next: 'p1', counter: '1 / 9', prevLabel: '', nextLabel: 'Global Fees →' },
      type: 'bundle'
    },
    p1: {
      eyebrow: '2',
      eyebrowLabel: 'Lesson Two',
      title: 'Global Fees —\nFake Transaction Detector',
      sub: 'There\'s a tiny number hidden in every token transaction — and if you know how to read it, you can instantly tell whether that "massive" volume is real or just faked.',
      breadcrumb: ['Vol. 1', 'Global Fees', '2 of 9'],
      nav: { prev: 'p0', next: 'p2', counter: '2 / 9', prevLabel: '← Bundle Token', nextLabel: 'Revoke & Minting →' },
      type: 'globalfees'
    },
    p2: {
      eyebrow: '3',
      eyebrowLabel: 'Lesson Three',
      title: 'Revoke & Minting —\nTraps That Look Safe',
      sub: 'Two technical features that sound boring — but they can be the difference between you staying safe or becoming a rug victim.',
      breadcrumb: ['Vol. 1', 'Revoke & Minting', '3 of 9'],
      nav: { prev: 'p1', next: 'p3', counter: '3 / 9', prevLabel: '← Global Fees', nextLabel: 'Meme vs Utility →' },
      type: 'revoke'
    },
    p3: {
      eyebrow: '4',
      eyebrowLabel: 'Lesson Four',
      title: 'Meme vs Utility —\nPick Your Trading Style',
      sub: 'The question "which is better — meme coin or utility token?" is the wrong question. The right one is: which fits your playstyle, and do you have the skill to play it correctly?',
      breadcrumb: ['Vol. 1', 'Meme vs Utility', '4 of 9'],
      nav: { prev: 'p2', next: 'p4', counter: '4 / 9', prevLabel: '← Revoke & Minting', nextLabel: 'Dex Paid →' },
      type: 'memevutil'
    },
    p4: {
      eyebrow: '5',
      eyebrowLabel: 'Lesson Five',
      title: 'Dex Paid, Ads & Boost —\nSignal or Just Paid Promotion?',
      sub: 'Three signals that look the same but carry very different meanings. Learning to tell them apart can save you from baseless FOMO.',
      breadcrumb: ['Vol. 1', 'Dex Paid, Ads & Boost', '5 of 9'],
      nav: { prev: 'p3', next: 'p5', counter: '5 / 9', prevLabel: '← Meme vs Utility', nextLabel: '3 Confirmations →' },
      type: 'dexpaid'
    },
    p5: {
      eyebrow: '6',
      eyebrowLabel: 'Lesson Five (continued)',
      title: '3 Candle Confirmation —\nHow to Find Valid Dips',
      sub: 'How do you know if "this dip is a buying opportunity" versus "this dip is a sell signal"? The answer lies in the 3 candle confirmation method.',
      breadcrumb: ['Vol. 1', '3 Candle Confirmation', '6 of 9'],
      nav: { prev: 'p4', next: 'p6', counter: '6 / 9', prevLabel: '← Dex Paid', nextLabel: 'Cabal Play →' },
      type: 'konfirmasi'
    },
    p6: {
      eyebrow: '7',
      eyebrowLabel: 'Lesson Six',
      title: 'Cabal Play —\nWhen the Market Moves in Coordination',
      sub: 'A cabal is a group of traders who move together in a planned fashion to push a token\'s price. Understanding how they operate can save you from FOMO and open better entry opportunities.',
      breadcrumb: ['Vol. 1', 'Cabal Play', '7 of 9'],
      nav: { prev: 'p5', next: 'p7', counter: '7 / 9', prevLabel: '← 3 Confirmations', nextLabel: 'Reading Holders →' },
      type: 'cabal'
    },
    p7: {
      eyebrow: '8',
      eyebrowLabel: 'Lesson Seven',
      title: 'Reading Holders —\nWhat You See vs What\'s Real',
      sub: 'The question "what\'s a good holder percentage?" has no universal answer. Each phase, each type of play, has a completely different context and interpretation.',
      breadcrumb: ['Vol. 1', 'Reading Holders', '8 of 9'],
      nav: { prev: 'p6', next: 'p8', counter: '8 / 9', prevLabel: '← Cabal Play', nextLabel: 'Market Cap →' },
      type: 'holder'
    },
    p8: {
      eyebrow: '9',
      eyebrowLabel: 'Lesson Eight',
      title: 'Market Cap Tier —\nDifferent Level, Different Opponent, Different Strategy',
      sub: 'Each market cap tier has its own ecosystem of players, risk levels, and reading methods. A strategy that profits in micro cap can be a total disaster when applied to CEX plays.',
      breadcrumb: ['Vol. 1', 'Market Cap Tier', '9 of 9'],
      nav: { prev: 'p7', next: 'p9', counter: '9 / 9', prevLabel: '← Reading Holders', nextLabel: 'Closing →' },
      type: 'marketcap'
    },
    p9: {
      eyebrow: '★',
      eyebrowLabel: 'Closing',
      title: 'From Ponyin,\nwith Sincerity.',
      sub: 'Everything here is just the basic foundation. There\'s still so much more to explore — but a strong, solid foundation is always better than advanced techniques built on shaky ground.',
      breadcrumb: ['Vol. 1', 'Closing', '★ of 9'],
      nav: { prev: 'p8', next: 'p0', counter: '9 / 9', prevLabel: '← Market Cap Tier', nextLabel: 'Start from beginning →' },
      type: 'closing'
    },
    pa0: {
      eyebrow: 'A1',
      eyebrowLabel: 'Advance — Snipe',
      title: 'How to Snipe\nEarly Projects',
      sub: 'Trading is like war. Full armament helps, advanced technology helps — but the one irreplaceable thing is information. Whoever knows first, wins.',
      breadcrumb: ['Vol. 2 Advance', 'Snipe Early Project', 'A1 of A8'],
      nav: { prev: null, next: 'pa1', counter: 'A1 / A8', prevLabel: '', nextLabel: 'How to Get $1000 from $100 →' },
      type: 'snipe',
      vol: 2
    },
    pa1: {
      eyebrow: 'A2',
      eyebrowLabel: 'Advance — Strategy',
      title: 'How to Get\n$1000 from $100',
      sub: 'There are no true "shortcuts" — but there are two proven paths. Choose based on your current ability and position.',
      breadcrumb: ['Vol. 2 Advance', 'First 1K', 'A2 of A8'],
      nav: { prev: 'pa0', next: 'pa2', counter: 'A2 / A8', prevLabel: '← Snipe Early Project', nextLabel: 'Wallet Ping →' },
      type: 'first1k',
      vol: 2
    },
    pa2: {
      eyebrow: 'A3',
      eyebrowLabel: 'Advance — Tracking',
      title: 'How to Multiply\nYour Eyes',
      sub: '10 eyes are better than 2. But that doesn\'t mean you need to watch 10 screens at once — just set up the right wallet pings and let the system work for you.',
      breadcrumb: ['Vol. 2 Advance', 'Wallet Ping', 'A3 of A8'],
      nav: { prev: 'pa1', next: 'pa3', counter: 'A3 / A8', prevLabel: '← First 1K from $100', nextLabel: 'Right Capital →' },
      type: 'walletping',
      vol: 2
    },
    pa3: {
      eyebrow: 'A4',
      eyebrowLabel: 'Advance — Money Mgmt',
      title: 'How Much Capital\nis Right for Trading?',
      sub: 'There\'s no one-size-fits-all number. But there\'s a proven framework — and more importantly, there\'s a mindset that needs to be right before any number can work.',
      breadcrumb: ['Vol. 2 Advance', 'Money Management', 'A4 of A8'],
      nav: { prev: 'pa2', next: 'pa4', counter: 'A4 / A8', prevLabel: '← Wallet Ping', nextLabel: 'Cheap & Fast Transactions →' },
      type: 'modal',
      vol: 2
    },
    pa4: {
      eyebrow: 'A5',
      eyebrowLabel: 'Advance — Tech',
      title: 'Cheap Transactions,\nSpeed Still Fast',
      sub: 'Trading platforms like Trojan, Flux, and Axiom offer amazing UI convenience — but there\'s a price you pay every time you trade there: platform fees. There\'s a way to eliminate them.',
      breadcrumb: ['Vol. 2 Advance', 'Cheap Transactions', 'A5 of A8'],
      nav: { prev: 'pa3', next: 'pa5', counter: 'A5 / A8', prevLabel: '← Money Management', nextLabel: 'Rent Refund →' },
      type: 'transaksi',
      vol: 2
    },
    pa5: {
      eyebrow: 'A6',
      eyebrowLabel: 'Advance — Tools',
      title: 'Rent Refund —\nClaim Back Your Rent Deposits',
      sub: 'Every time you buy a new coin on Solana, a small balance is withheld as account rent. Imagine if you\'ve traded hundreds of times — how much of your money is just sitting there?',
      breadcrumb: ['Vol. 2 Advance', 'Rent Refund', 'A6 of A8'],
      nav: { prev: 'pa4', next: 'pa6', counter: 'A6 / A8', prevLabel: '← Cheap Transactions', nextLabel: 'Instant Scalping →' },
      type: 'refund',
      vol: 2
    },
    pa6: {
      eyebrow: 'A7',
      eyebrowLabel: 'Advance — Scalping',
      title: 'Instant Scalping —\nHow to Filter New Pairs',
      sub: 'This is the real kitchen secret. 4 simple steps that can save you from rugs — and open up 60–70% scalp opportunities on fresh launches.',
      breadcrumb: ['Vol. 2 Advance', 'Instant Scalping', 'A7 of A8'],
      nav: { prev: 'pa5', next: 'pa7', counter: 'A7 / A8', prevLabel: '← Rent Refund', nextLabel: 'Multi Wallet →' },
      type: 'scalping',
      vol: 2
    },
    pa7: {
      eyebrow: 'A8',
      eyebrowLabel: 'Advance — Multi Wallet',
      title: 'Multi Wallet —\nThe Miracle That Isn\'t a Miracle',
      sub: 'Multi wallet isn\'t about hiding yourself. It\'s about playing smarter in an ecosystem that naturally works this way.',
      breadcrumb: ['Vol. 2 Advance', 'Multi Wallet', 'A8 of A8'],
      nav: { prev: 'pa6', next: 'pa8', counter: 'A8 / A8', prevLabel: '← Instant Scalping', nextLabel: 'Unwritten Rules →' },
      type: 'multiwallet',
      vol: 2
    },
    pa8: {
      eyebrow: 'A9',
      eyebrowLabel: 'Advance — Ethics',
      title: 'Unwritten Rules —\nDon\'t Eat Your Own',
      sub: 'There are unwritten rules that determine who survives until the end of the cycle. This isn\'t about having the biggest portfolio — it\'s about who can survive.',
      breadcrumb: ['Vol. 2 Advance', 'Unwritten Rules', 'A9 of A10'],
      nav: { prev: 'pa7', next: 'pa9', counter: 'A9 / A10', prevLabel: '← Multi Wallet', nextLabel: 'Scams & Drainers →' },
      type: 'unwritten',
      vol: 2
    },
    pa9: {
      eyebrow: 'A10',
      eyebrowLabel: 'Advance — Security',
      title: 'Scams & Drainers —\nPig Butchering & Traps',
      sub: 'In crypto, your money can be lost not just because the market goes down, but through psychological manipulation and smart contract traps.',
      breadcrumb: ['Vol. 2 Advance', 'Scams & Drainers', 'A10 of A10'],
      nav: { prev: 'pa8', next: 'p0', counter: 'A10 / A10', prevLabel: '← Unwritten Rules', nextLabel: 'Start from beginning ↺' },
      type: 'scam',
      vol: 2
    },
  },
};

// Legacy export
export const panels = panelsData.id;
