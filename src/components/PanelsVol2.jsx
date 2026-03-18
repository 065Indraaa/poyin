import { Callout, IllusBox, CkList, StepFlow } from './PanelComponents';
import { SnipeSVG, WalletPingSVG, MultiWalletSVG } from './Illustrations';

// ═══════ PA0: SNIPE ═══════
export function PanelSnipe() {
  return (
    <>
      {/* Penjelasan Awal */}
      <p className="prose reveal">
        <strong>Apa itu Snipe?</strong> Snipe artinya membeli koin di detik-detik pertama peluncurannya — sebelum orang lain sempat sadar bahwa koin itu ada. Ibaratnya, kamu sudah duduk di baris paling depan bioskop sebelum pintunya dibuka untuk umum.
      </p>
      <p className="prose reveal">
        Untuk melakukan ini, kamu butuh tiga hal: <strong>informasi</strong> (tahu koin apa yang akan diluncurkan dan kapan), <strong>alat</strong> (bot sniper atau kode khusus), dan <strong>kecepatan</strong> (selisih milidetik bisa berarti selisih jutaan dolar). Tanpa ketiganya, kamu cuma "menembak dalam gelap."
      </p>

      <Callout type="info" icon="🗺️" title="Langkah pertama: Mapping (Pemetaan)">
        Sebelum bisa snipe, kamu harus sudah tahu: <strong>akun mana yang akan membuat koin</strong>, koin itu akan diluncurkan oleh siapa, dan di pool (tempat jual-beli) mana launch-nya. Tanpa tiga informasi ini, peluang berhasilmu sangat kecil.
      </Callout>

      {/* Ilustrasi */}
      <IllusBox><div style={{ maxWidth: 680, margin: '0 auto' }}><SnipeSVG /></div></IllusBox>

      {/* Studi kasus */}
      <p className="prose reveal">
        <strong>Contoh nyata:</strong> Naseem berhasil membeli koin $trump hanya 0.05 detik sebelum likuiditas (uang) ditambahkan ke pool. Dia menghabiskan sekitar $100.000 USD hanya untuk biaya gas (biaya transaksi) demi kecepatan. Modalnya $1 juta — hasilnya? Profit $302 juta. Ini bukan keberuntungan, tapi kombinasi informasi yang akurat, alat yang tepat, dan eksekusi yang presisi.
      </p>

      {/* Daftar tools */}
      <p className="prose reveal" style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Tools untuk snipe (dari yang paling canggih):</p>
      <ul className="cklist reveal">
        {[
          '<strong>Mintech</strong> — Bot sniper paling kuat. Cocok untuk peluncuran besar di mana kamu sudah punya semua info: nama koin, dompet Developer, dan waktu penambahan likuiditas. Harga mahal, tapi hasilnya setimpal.',
          '<strong>Flux</strong> — Alternatif premium dengan fitur otomasi canggih untuk snipe dan trading sehari-hari.',
          '<strong>Maestro</strong> — Gratis dan cukup handal untuk snipe standar. Cocok untuk pemula yang mau mulai belajar.',
          '<strong>Trojan</strong> — Gratis, bisa snipe sekaligus trading harian. Tampilan antarmukanya nyaman dipakai.',
          '<strong>Custom Helius Code</strong> — Untuk yang serius. Kamu menulis kode sendiri untuk bertransaksi langsung ke blockchain tanpa perantara (platform fee = $0). Biaya pengembangan: $5 sampai $100k tergantung kerumitan.',
        ].map((item, i) => (
          <li key={i}>
            <span className="ck" style={{ background: i < 2 ? '#7c3aed' : i < 4 ? '#2455d4' : '#059669' }}>{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: item }} />
          </li>
        ))}
      </ul>

      <Callout type="warn" icon="⚡" title="Kapan pakai snipe manual vs bot?">
        Snipe manual (tanpa bot) bisa dilakukan kalau kamu selalu standby depan layar. Tapi untuk peluncuran besar yang sudah diketahui waktunya — gunakan Mintech atau kode khusus. Di level itu, selisih milidetik = selisih jutaan dolar.
      </Callout>
    </>
  );
}

// ═══════ PA1: FIRST 1K ═══════
export function PanelFirst1K() {
  return (
    <>
      {/* Ilustrasi */}
      <div className="illus-box reveal">
        <svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
          <rect width="700" height="280" fill="transparent" />
          <text x="350" y="34" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="#18182b">Dua Jalur: $100 → $1000</text>
          <rect x="20" y="55" width="310" height="205" rx="18" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
          <text x="175" y="86" textAnchor="middle" fontFamily="Georgia,serif" fontSize="17" fontWeight="700" fill="#1e40af">💬 Jalur Koneksi</text>
          <text x="175" y="104" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#3b82f6">"Mulut Manis"</text>
          <line x1="40" y1="112" x2="310" y2="112" stroke="#bfdbfe" strokeWidth="1" />
          <text x="40" y="132" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">→ Bangun relasi ke grup cabal</text>
          <text x="40" y="152" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">→ Minta diajak masuk bareng</text>
          <text x="40" y="172" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">→ Beli sesuai instruksi (dompet resmi)</text>
          <text x="40" y="192" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">→ Punya dompet pribadi di belakang</text>
          <text x="40" y="212" fontFamily="sans-serif" fontSize="12.5" fill="#1d4ed8">→ Hormati chart saat menjual</text>
          <rect x="40" y="224" width="270" height="26" rx="8" fill="#dbeafe" stroke="#93c5fd" />
          <text x="175" y="241" textAnchor="middle" fontFamily="sans-serif" fontSize="11.5" fill="#1e40af" fontWeight="700">Reputasi bagus → lebih banyak kesempatan</text>
          <rect x="370" y="55" width="310" height="205" rx="18" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="2" />
          <text x="525" y="86" textAnchor="middle" fontFamily="Georgia,serif" fontSize="17" fontWeight="700" fill="#4c1d95">🚀 Jalur Deployer</text>
          <text x="525" y="104" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#7c3aed">"Si Pembuat"</text>
          <line x1="390" y1="112" x2="660" y2="112" stroke="#ddd6fe" strokeWidth="1" />
          <text x="390" y="132" fontFamily="sans-serif" fontSize="12.5" fill="#5b21b6">→ Buat koin sendiri (deploy)</text>
          <text x="390" y="152" fontFamily="sans-serif" fontSize="12.5" fill="#5b21b6">→ Kamu yang kontrol semuanya</text>
          <text x="390" y="172" fontFamily="sans-serif" fontSize="12.5" fill="#5b21b6">→ Tentukan waktu dan strategi</text>
          <text x="390" y="192" fontFamily="sans-serif" fontSize="12.5" fill="#5b21b6">→ Butuh kemampuan lebih tinggi</text>
          <text x="390" y="212" fontFamily="sans-serif" fontSize="12.5" fill="#5b21b6">→ Tutorial akan dibagikan</text>
          <rect x="390" y="224" width="270" height="26" rx="8" fill="#ede9fe" stroke="#c4b5fd" />
          <text x="525" y="241" textAnchor="middle" fontFamily="sans-serif" fontSize="11.5" fill="#4c1d95" fontWeight="700">Potensi lebih besar, risiko lebih tinggi</text>
        </svg>
      </div>

      {/* Penjelasan dua jalur */}
      <div className="two-col reveal" style={{ marginTop: 32 }}>
        <div>
          <p className="prose"><strong>Jalur Koneksi ("Mulut Manis")</strong> — Kamu membangun hubungan baik dengan cabal atau Developer yang sering meluncurkan koin. Minta supaya diajak masuk bareng di proyek mereka. Biasanya mereka akan memintamu membeli sejumlah SOL — ini untuk dompet "resmi" kamu yang mereka ketahui.</p>
          <p className="prose">Tapi kamu juga punya dompet lain yang <em>mereka tidak tahu</em>. Ini bukan kecurangan — di dunia crypto, semua orang bermain untuk dirinya sendiri. Yang penting: <strong>saat menjual, jaga supaya grafik harga tetap sehat</strong> (jangan jual mendadak di saat harga sedang jatuh).</p>
          <Callout type="ok" icon="✅" title="Cara menjual yang baik (menjaga chart)">
            Jangan jual di saat harga sedang merah (turun). Jangan jual di saat harga sedang naik cepat. Gunakan metode <strong>trailing stop</strong> — ikuti harga naik dan otomatis jual saat harga mulai turun dari puncak. Dengan cara ini, grafik harga tetap terlihat sehat dan reputasimu terjaga.
          </Callout>
        </div>
        <div>
          <p className="prose"><strong>Jalur Deployer ("Si Pembuat")</strong> — Kamu membuat koin sendiri. Semua keputusan ada di tanganmu: waktu peluncuran, pembagian suplai, strategi promosi. Jalur ini potensinya lebih besar, tapi butuh kemampuan dan pengetahuan yang lebih dalam.</p>
          <p className="prose">Tutorial lengkap cara membuat dan meluncurkan koin akan dibagikan di materi berikutnya. Yang terpenting dipahami saat ini: <em>reputasi adalah aset jangka panjang.</em> Sekali kamu dikenal bisa dipercaya di komunitas, pintu-pintu kesempatan berikutnya terbuka jauh lebih mudah.</p>
          <Callout type="purple" icon="💡" title="Prinsip penting">
            Jangan berhenti berusaha hanya karena sudah dapat sedikit untung. Bangun reputasi, perluas jaringan, dan terus tingkatkan kemampuan — kombinasi ketiganya yang membuat seorang trader bertahan di jangka panjang.
          </Callout>
        </div>
      </div>
    </>
  );
}

// ═══════ PA2: WALLET PING ═══════
export function PanelWalletPing() {
  return (
    <>
      {/* Ilustrasi */}
      <IllusBox><div style={{ maxWidth: 680, margin: '0 auto' }}><WalletPingSVG /></div></IllusBox>

      {/* Penjelasan Awal */}
      <p className="prose reveal">
        <strong>Apa itu Wallet Ping?</strong> Wallet ping adalah sistem notifikasi yang mengirim peringatan (alert) setiap kali dompet yang kamu pantau melakukan transaksi. Setiap kali dompet tersebut membeli, menjual, atau menambah likuiditas — kamu langsung dapat pemberitahuan.
      </p>
      <p className="prose reveal">
        <strong>Penting:</strong> Ini <em>bukan</em> sinyal untuk langsung membeli. Ini hanya memberi tahu bahwa "ada sesuatu yang perlu kamu perhatikan di sini." Kamu tetap harus menganalisis sendiri sebelum bertindak.
      </p>

      <Callout type="warn" icon="⚠️" title="Kesalahan paling umum">
        Banyak pemula langsung FOMO (takut ketinggalan) dan membeli setiap kali dapat ping. Jangan lakukan ini! Wallet ping hanya memberi tahu bahwa ada aktivitas menarik. Keputusan beli tetap harus berdasarkan analisis kamu sendiri.
      </Callout>

      {/* Cara menemukan wallet bagus */}
      <p className="prose reveal" style={{ marginTop: 28, fontWeight: 700, color: 'var(--ink)' }}>Cara menemukan dompet bagus yang layak dipantau:</p>
      <ul className="cklist reveal">
        {[
          '<strong>Jangan FOMO saat ketinggalan</strong> — Kalau kamu ketinggalan koin yang sedang naik, jangan langsung beli di harga tertinggi. Justru ini kesempatan terbaik untuk mencari dompet-dompet bagus yang masuk lebih awal.',
          '<strong>Buka DexScreener atau Terminal</strong> — Scroll ke bawah di koin yang sedang naik. Cari dompet-dompet yang masuk sangat awal, sebelum harga naik drastis.',
          '<strong>Cek fitur "Top Trader"</strong> — Di setiap koin ada daftar 20 trader terbaik. Biasanya sekitar 5 di antaranya adalah pemain yang konsisten bagus dan layak dipantau jangka panjang.',
          '<strong>Lacak dari satu dompet ke dompet lain</strong> — Di blockchain, satu dompet bagus sering berinteraksi dengan dompet bagus lainnya. Ikuti rantainya — dari 1 dompet bisa menemukan 10 dompet berkualitas.',
        ].map((item, i) => (
          <li key={i}>
            <span className="ck" style={{ background: ['#7c3aed', '#6d28d9', '#5b21b6', '#2455d4'][i] }}>{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: item }} />
          </li>
        ))}
      </ul>

      <Callout type="ok" icon="📈" title="Manfaat nyata dari wallet ping">
        Dengan sistem wallet ping yang tepat, risiko kamu terkena penipuan (rug pull) turun dari 90% menjadi sekitar 60% — dan bisa turun lagi ke 50% seiring kamu semakin mengenal pola dompet-dompet yang kamu pantau. Ini bukan fitur tambahan, ini adalah peningkatan fundamental cara bermainmu.
      </Callout>
    </>
  );
}

// ═══════ PA3: MODAL / MONEY MGMT ═══════
export function PanelModal() {
  return (
    <>
      {/* Penjelasan Awal */}
      <p className="prose reveal">
        <strong>Berapa modal yang tepat untuk trading?</strong> Jawabannya bergantung pada posisimu: apakah kamu trading dengan uang yang memang "bebas" (uang dingin), atau ada tekanan hutang di belakangnya? Trading sambil dikejar hutang adalah kombinasi yang paling berbahaya — tekanan psikologis akan membuat semua keputusanmu menjadi emosional dan tidak rasional.
      </p>

      {/* Ilustrasi strategi compounding */}
      <div className="illus-box reveal">
        <svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', display: 'block' }}>
          <rect width="700" height="260" fill="transparent" />
          <text x="350" y="32" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="#18182b">Strategi Compounding: 0.5 SOL → 5 SOL</text>
          <rect x="20" y="55" width="100" height="80" rx="12" fill="#fff8ec" stroke="#fde68a" strokeWidth="2" />
          <text x="70" y="85" textAnchor="middle" fontFamily="Georgia,serif" fontSize="20" fontWeight="700" fill="#b45309">0.5</text>
          <text x="70" y="100" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#92400e">SOL awal</text>
          <text x="70" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#b45309" fontWeight="600">Modal awal</text>
          <text x="138" y="100" textAnchor="middle" fontSize="20" fill="#94a3b8">→</text>
          <rect x="155" y="55" width="140" height="80" rx="12" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
          <text x="225" y="80" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#1e40af" fontWeight="700">Strategi 35% TP</text>
          <text x="225" y="97" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">Ambil 35% untung →</text>
          <text x="225" y="113" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#1d4ed8">pindah ke dompet baru</text>
          <text x="225" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="#3b82f6">Efek: bunga berbunga</text>
          <text x="313" y="100" textAnchor="middle" fontSize="20" fill="#94a3b8">→</text>
          <rect x="326" y="55" width="140" height="80" rx="12" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
          <text x="396" y="80" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#065f46" fontWeight="700">Ada peluang bagus</text>
          <text x="396" y="97" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">Masuk 70-80%</text>
          <text x="396" y="113" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="#047857">dari total simpanan</text>
          <text x="396" y="126" textAnchor="middle" fontFamily="sans-serif" fontSize="10.5" fill="#059669">Target: 50% untung</text>
          <text x="484" y="100" textAnchor="middle" fontSize="20" fill="#94a3b8">→</text>
          <rect x="497" y="45" width="183" height="100" rx="12" fill="#1e3a8a" stroke="#2455d4" strokeWidth="2" />
          <text x="588" y="75" textAnchor="middle" fontFamily="Georgia,serif" fontSize="24" fontWeight="700" fill="white">5 SOL</text>
          <text x="588" y="95" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="rgba(255,255,255,.7)">Target tercapai</text>
          <text x="588" y="113" textAnchor="middle" fontFamily="sans-serif" fontSize="11" fill="rgba(255,255,255,.7)">Mulai lebih nyaman</text>
          <text x="588" y="131" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#93c5fd">Dari sini: main lebih serius</text>
          <rect x="20" y="158" width="660" height="82" rx="14" fill="#f5f3ff" stroke="#ddd6fe" strokeWidth="1.5" />
          <text x="350" y="182" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fill="#4c1d95" fontWeight="700">🤖 Fitur Auto Take Profit — Senjata Melawan Keserakahan</text>
          <text x="350" y="202" textAnchor="middle" fontFamily="sans-serif" fontSize="12.5" fill="#5b21b6">Set target untung → sistem otomatis jual → kamu tidak bisa "tahan dikit lagi"</text>
          <text x="350" y="222" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill="#6d28d9">Setelah target kena: JANGAN beli lagi koin yang sama. Cari peluang baru.</text>
        </svg>
      </div>

      {/* Penjelasan detail */}
      <div className="two-col reveal" style={{ marginTop: 32 }}>
        <div>
          <p className="prose"><strong>Strategi 35% Take Profit (Ambil Untung):</strong> Setiap kali kamu untung dari sebuah trade, ambil 35% dari keuntungan itu dan pindahkan ke dompet baru yang terpisah. Dompet ini adalah "tabungan" kamu. Sisanya bisa kamu gunakan untuk trade lanjutan.</p>
          <p className="prose"><strong>Kenapa pindah ke dompet baru?</strong> Karena dengan memisahkan secara fisik, kamu tidak tergoda untuk langsung memasukkan semua keuntungan ke trade berikutnya. <em>Efek bunga berbunga (compounding) hanya bekerja kalau keuntungannya benar-benar diamankan</em>.</p>
        </div>
        <div>
          <p className="prose"><strong>Saat ada peluang bagus:</strong> Dari uang yang sudah terkumpul, masuk dengan 70–80% dari total simpanan. Target untung: cukup <strong>50% per trade</strong>, bukan 10x. Dengan efek compounding, 50% dari simpanan yang terus tumbuh jauh lebih berarti dari 10x dari modal kecil.</p>
          <p className="prose"><strong>Fitur Auto Take Profit:</strong> Ini senjata terbaik melawan keserakahan. Set targetmu, biarkan sistem yang menjual. Setelah target tercapai, <strong>berhenti</strong>. Jangan beli lagi koin yang sama. Disiplin ini yang membedakan trader yang bertahan lama.</p>
        </div>
      </div>

      <Callout type="danger" icon="🚨" title="Tanda-tanda keserakahan yang harus dihindari">
        Merasa "sayang kalau jual sekarang, harusnya tunggu lebih tinggi" — ini serakah. Membeli lagi koin yang sudah kamu jual — ini serakah. Masuk dengan uang lebih besar dari biasanya karena "yakin banget" — ini serakah. Semua keputusan trading yang didasari emosi (bukan rencana) adalah tanda keserakahan sedang menguasaimu.
      </Callout>
    </>
  );
}

// ═══════ PA4: TRANSAKSI MURAH ═══════
export function PanelTransaksi() {
  return (
    <>
      {/* Penjelasan Awal */}
      <p className="prose reveal">
        <strong>Bagaimana cara mengurangi biaya trading?</strong> Platform seperti Trojan, Flux, dan Axiom memang nyaman dipakai, tapi setiap kali kamu bertransaksi di sana, ada "biaya layanan" (platform fee) yang dipotong. Kalau dihitung sebulan, jumlahnya bisa sangat besar. Ada dua cara untuk mengurangi atau menghilangkan biaya ini.
      </p>

      {/* Dua metode */}
      <div className="two-col reveal">
        <div>
          <div className="def-card">
            <div className="def-icon">⚙️</div>
            <div className="def-term">RUST untuk Trading</div>
            <div className="def-desc">
              <strong>Apa itu?</strong> RUST adalah bahasa pemrograman yang dipakai oleh jaringan Solana. Kalau kamu bisa menulis kode transaksi sendiri dalam RUST, kamu bisa bertransaksi langsung ke blockchain tanpa perantara — artinya <strong>biaya platform = Rp 0</strong>.<br /><br />
              <strong>Butuh apa?</strong> Kemampuan coding dasar. Investasi waktu belajar cukup besar, tapi sangat sepadan untuk trader yang serius dan bertransaksi setiap hari.
            </div>
          </div>
        </div>
        <div>
          <div className="def-card">
            <div className="def-icon">🌐</div>
            <div className="def-term">RPC Langsung</div>
            <div className="def-desc">
              <strong>Apa itu?</strong> RPC (Remote Procedure Call) adalah "gerbang komunikasi" antara kamu dan blockchain Solana. Platform berbayar menggunakan gerbang mereka sendiri dan menambahkan biaya di atasnya. Dengan berlangganan langsung ke penyedia RPC seperti <strong>Helius</strong>, <strong>QuikNode</strong>, atau <strong>Triton</strong> — kamu dapat kecepatan yang sama, tanpa biaya tambahan dari platform.<br /><br />
              <strong>Biaya langganan?</strong> Jauh lebih murah dibanding total fee platform yang kamu bayar setiap bulan.
            </div>
          </div>
        </div>
      </div>

      <Callout type="info" icon="💡" title="Contoh perhitungan nyata">
        Misalkan kamu trading 10 kali sehari, dengan rata-rata 0.5 SOL per transaksi. Biaya platform rata-rata 1% = 0.05 SOL per transaksi = 0.5 SOL per hari. Dalam sebulan: <strong>15 SOL</strong>. Setahun: <strong>180 SOL</strong>. Dengan RPC langsung + RUST, penghematan itu masuk ke kantongmu sendiri.
      </Callout>

      <Callout type="warn" icon="⚠️" title="Kapan mulai belajar ini?">
        Belajar RUST dan menyiapkan RPC sendiri butuh waktu yang cukup besar. Saran: mulai <strong>setelah simpananmu stabil di atas 5 SOL</strong> dan kamu sudah punya pola trading yang konsisten. Jangan terburu-buru belajar sisi teknis sebelum dasar trading-mu sendiri sudah solid.
      </Callout>
    </>
  );
}

// ═══════ PA5: INSTANT SCALPING ═══════
export function PanelScalping() {
  return (
    <>
      {/* Penjelasan Awal */}
      <p className="prose reveal">
        <strong>Apa itu Instant Scalping?</strong> Scalping adalah metode membeli dan menjual koin dalam waktu sangat singkat (hitungan menit), dengan target untung kecil tapi konsisten. Kunci utamanya: <em>rencanamu sudah jadi sebelum kamu membeli, bukan dibuat sambil panik di tengah-tengah.</em>
      </p>

      {/* Langkah terstruktur */}
      <StepFlow steps={[
        {
          num: '1',
          title: 'Identifikasi Koin — Cek Narasi + Momentum',
          desc: 'Sebelum masuk, jawab pertanyaan ini: Apakah ada cerita (narasi) yang kuat di balik koin ini? Siapa pembuatnya? Apakah ada cabal yang terlibat? Seperti apa volume awalnya? Kalau jawabannya tidak meyakinkan, <strong>lewati</strong>. Selalu ada koin lain yang datang setiap jam.',
        },
        {
          num: '2',
          title: 'Masuk dengan Porsi Kecil Dulu (20-30%)',
          desc: 'Jangan langsung masuk dengan seluruh uangmu. Masuk dengan 20–30% dulu sebagai "tes awal" (probe entry). Kalau koin langsung naik cepat, tambah posisi. Kalau langsung turun, kerugianmu sangat kecil karena kamu hanya memasukkan sebagian kecil.',
        },
        {
          num: '3',
          title: 'Set Auto TP & SL Sebelum Menambah Posisi',
          desc: '<strong>TP</strong> (Take Profit) = otomatis jual saat untung mencapai target. <strong>SL</strong> (Stop Loss) = otomatis jual saat rugi mencapai batas yang kamu tentukan. Ini WAJIB di-set sebelum menambah uang lagi. Dengan cara ini, emosi tidak punya kesempatan mengambil alih keputusan.',
        },
        {
          num: '4',
          title: 'Jual di Zona Hijau — Jangan Nunggu "Puncak"',
          desc: 'Scalping yang bagus adalah yang <strong>konsisten</strong>, bukan yang sekali besar. Target keuntungan 30–70% per transaksi, lalu keluar. Jangan nunggu 10x lipat — itu bukan scalping, itu investasi. Scalper disiplin = bertahan lama.',
        },
      ]} />

      <Callout type="info" icon="⚡" title="Waktu ideal untuk scalping koin baru">
        Di koin baru, waktu terbaik untuk scalping biasanya antara <strong>3 sampai 20 menit</strong> dari peluncuran. Setelah itu, pemain awal mulai menjual dan harga menjadi tidak terprediksi. Kalau kamu tidak bisa memantau layar secara aktif dalam jendela waktu itu, lebih baik lewati koin tersebut.
      </Callout>

      <Callout type="danger" icon="🚨" title="Kesalahan fatal dalam scalping">
        Menahan koin karena "yakin pasti balik naik" — ini bukan scalping lagi, ini judi. Scalping punya aturan ketat: kalau target tidak tercapai dalam jendela waktu yang sudah ditentukan, <strong>jual dan keluar</strong>. Tidak ada pengecualian. Disiplin ini yang menjaga uangmu tetap hidup.
      </Callout>
    </>
  );
}

// ═══════ PA6: MULTI WALLET ═══════
export function PanelMultiWallet() {
  return (
    <>
      {/* Penjelasan Awal */}
      <p className="prose reveal">
        <strong>Apa itu Multi Wallet?</strong> Multi wallet artinya menggunakan beberapa dompet digital berbeda (bukan hanya satu) untuk beroperasi di pasar koin. Setiap dompet adalah "identitas terpisah" di blockchain. Dengan beberapa dompet, kamu bisa:
      </p>
      <ul className="cklist reveal">
        {[
          '<strong>Menyebar kepemilikan</strong> — Supaya tidak terlihat seperti satu orang yang menguasai banyak koin',
          '<strong>Memancing bot otomatis</strong> — Bot melihat distribusi pemegang yang sehat, lalu ikut membeli → harga otomatis naik',
          '<strong>Proteksi keamanan</strong> — Kalau satu dompet diretas, uangmu di dompet lain tetap aman',
          '<strong>DCA lebih efisien</strong> — Bisa membeli di harga berbeda-beda dengan dompet yang berbeda',
        ].map((item, i) => (
          <li key={i}>
            <span className="ck" style={{ background: '#7c3aed' }}>{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: item }} />
          </li>
        ))}
      </ul>

      {/* Ilustrasi */}
      <IllusBox><div style={{ maxWidth: 680, margin: '0 auto' }}><MultiWalletSVG /></div></IllusBox>

      {/* Penjelasan detail */}
      <div className="two-col reveal" style={{ marginTop: 36 }}>
        <div>
          <p className="prose"><strong>Cara kerjanya:</strong> Misalkan kamu ingin membeli 3 SOL di sebuah koin kecil. Alih-alih beli 3 SOL dari 1 dompet (yang langsung kelihatan di sistem sebagai pemegang besar), kamu memecahnya ke 3 dompet berbeda, masing-masing 1 SOL. Di sistem pelacak, kepemilikan terlihat merata — seperti 3 orang berbeda.</p>
          <p className="prose"><strong>Efeknya:</strong> Bot otomatis melihat distribusi pemegang yang sehat dan ikut membeli. Volume perdagangan naik, harga ikut naik. Ini yang disebut "instant profit setelah kamu beli" — padahal kamu yang mengendalikan semua dompet itu.</p>
        </div>
        <div>
          <p className="prose"><strong>Kelebihannya:</strong> Potensi keuntungan maksimal dari setiap posisi. Koin yang seharusnya "mati" bisa punya peluang hidup lagi karena bot terpancing masuk. Ditambah perlindungan dari risiko peretasan — kalau satu dompet kena, yang lain tetap aman.</p>
          <p className="prose"><strong>Kekurangannya:</strong> Kamu bisa dicap sebagai "tukang jual murah" — ini risiko reputasi yang nyata. Selain itu, kamu harus pintar menghitung: keuntungan 10% dari dompetmu sendiri bisa jadi nol kalau kamu menjual ke dompetmu sendiri tanpa sadar.</p>
        </div>
      </div>

      <Callout type="info" icon="📐" title="Strategi DCA Multi Wallet yang Benar">
        Kalau Dompet 1 beli di harga Rp 10.000 dan harganya turun — <strong>jangan beli lagi pakai Dompet 1.</strong> Gunakan Dompet 2 untuk membeli di harga lebih rendah. Kenapa? Karena dengan cara ini, kerugian di Dompet 1 bisa ditutup lebih efisien. Rata-rata harga beli keseluruhanmu turun tanpa terlihat seperti satu orang yang terus menumpuk pembelian.
      </Callout>

      <Callout type="warn" icon="⚠️" title="Cocok untuk simpanan 5 SOL ke atas">
        Strategi ini butuh modal yang cukup untuk dipecah ke 2–3 dompet aktif. Di bawah 5 SOL, pembagiannya terlalu kecil dan kurang efektif. Mulai pelajari dari sekarang — saat simpananmu sudah cukup, tinggal langsung dijalankan.
      </Callout>
    </>
  );
}
