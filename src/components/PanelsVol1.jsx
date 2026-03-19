import { Callout, IllusBox, DefCard, StepFlow, CmpCard } from './PanelComponents';
import { MarketCapSVG, DexPaidSVG, KonfirmasiSVG } from './Illustrations';
import avatarSrc from '../assets/avatar.png';
import bundleImg from '../assets/Bundle.jpg';
import globalFeesImg from '../assets/Global fees.jpg';
import revokeImg from '../assets/revoke.jpg';

/* ─── Shared micro-components ─────────────────────────────────── */

/** Label section kecil biru di atas judul sub-bagian */
function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '1.8px',
      textTransform: 'uppercase', color: 'var(--b)',
      marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{
        display: 'inline-block', width: 18, height: 2,
        background: 'var(--b)', borderRadius: 2, flexShrink: 0,
      }} />
      {children}
    </p>
  );
}

/** Divider garis tipis antar section */
function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid var(--c3)', margin: '24px 0' }} />;
}

/** Box highlight — gradient putih-biru ringan */
function HighlightBox({ children, style }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #f4f8ff 0%, #eef3ff 100%)',
      border: '1px solid var(--bp)',
      borderRadius: 14,
      padding: '18px 22px',
      marginBottom: 18,
      ...style,
    }}>
      {children}
    </div>
  );
}

/** Gambar panel — ukuran wajib konsisten */
function PanelImg({ src, alt }) {
  return (
    <div style={{
      borderRadius: 14,
      overflow: 'hidden',
      border: '1px solid var(--c3)',
      boxShadow: '0 4px 20px rgba(36,85,212,.07)',
      background: 'var(--w)',
    }}>
      <img
        src={src} alt={alt}
        style={{
          width: '100%', display: 'block',
          maxHeight: 280, objectFit: 'contain',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/** Layout dua kolom 60/40 — teks kiri, gambar/visual kanan */
function TwoCol({ left, right, flip = false }) {
  return (
    <div className="reveal" style={{
      display: 'grid',
      gridTemplateColumns: flip ? '40% 60%' : '60% 40%',
      gap: 28,
      alignItems: 'start',
      marginBottom: 20,
    }}>
      {flip ? <>{right}{left}</> : <>{left}{right}</>}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/* P0 · BUNDLE TOKEN                                               */
/* ──────────────────────────────────────────────────────────────── */
export function PanelBundle() {
  return (
    <>
      {/* BAGIAN 1 — Apa itu Bundle? Analogi + Gambar */}
      <TwoCol
        left={
          <div>
            <SectionLabel>Apa itu Bundle Token?</SectionLabel>
            <p className="prose">
              Bayangkan pengusaha yang ingin <strong>menguasai seluruh pasokan ayam</strong> di kota.
              Kalau borong semua stok sendirian, semua orang langsung tahu — harga naik, media ramai,
              pemerintah curiga. Solusi pintarnya? Minta <strong>10 orang kepercayaan</strong> membeli
              di tempat berbeda, waktu berbeda, nama berbeda. Dari luar terlihat organik. Padahal
              <em> satu komando — satu orang di balik layar.</em>
            </p>
            <p className="prose">
              Inilah <strong>bundle token</strong> di dunia Solana. Saat token baru diluncurkan,
              developer sudah menyiapkan puluhan wallet berbeda yang serentak membeli di milidetik
              pertama. Di block explorer kamu melihat banyak pembeli. Padahal satu tangan yang
              menggerakkan semuanya.
            </p>
          </div>
        }
        right={<PanelImg src={bundleImg} alt="Ilustrasi Bundle Token" />}
      />

      {/* Quote */}
      <div className="pull reveal">
        "Bundle bukan soal berapa banyak wallet yang beli — tapi berapa banyak wallet
        yang sebetulnya dikontrol oleh satu orang di balik layar."
      </div>

      <Divider />

      {/* BAGIAN 2 — Kenapa Berbahaya? */}
      <div className="reveal">
        <SectionLabel>Kenapa ini berbahaya?</SectionLabel>
        <Callout type="warn" icon="⚠️" title="Developer sudah punya kendali penuh sejak awal">
          Developer yang bundle di awal otomatis memegang <strong>mayoritas supply</strong> sejak detik pertama.
          Mereka bisa dump kapanpun — dan saat itu terjadi, chart ambruk dalam hitungan detik.
          Kamu yang beli belakangan tidak punya waktu bereaksi sama sekali.
        </Callout>
      </div>

      {/* BAGIAN 3 — Multi Wallet & Zero-sum */}
      <div className="reveal">
        <SectionLabel>Realita di pasar new pair</SectionLabel>
        <p className="prose">
          Di pasar new pair, para pemain besar seperti Cupsey, Cented, Log, Decu membeli agresif
          di detik pertama. Tidak ada yang peduli siapa punya berapa — selama narasi menarik dan
          momentum ada, semua orang langsung masuk. Inilah <em>PvP sesungguhnya — Player vs Player.</em>
        </p>
        <Callout type="info" icon="💡" title='Mengapa patokan "holder di bawah 3%" sudah tidak akurat?'>
          Di era multi-wallet, satu orang bisa punya 5 hingga 20 wallet berbeda. Meskipun setiap wallet
          hanya pegang 2%, kalau orangnya sama, total kepemilikannya bisa mencapai <strong>20–40%</strong>.
          Untuk token narasi besar, holder 7–10% per wallet sudah sangat wajar. Ini permainan — dan
          kamu perlu memahaminya.
        </Callout>
        <Callout type="warn" icon="🧠" title="Memahami zero-sum tanpa jadi sinis">
          Semua pemain di ruang ini bermain untuk kepentingan sendiri — dari retail terkecil sampai
          whale terbesar. Pahami ini bukan untuk paranoid, tapi agar kamu tidak naif dalam membaca
          data dan mengambil keputusan.
        </Callout>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/* P1 · GLOBAL FEES                                                */
/* ──────────────────────────────────────────────────────────────── */
export function PanelGlobalFees() {
  return (
    <>
      {/* BAGIAN 1 — Apa itu + Gambar */}
      <TwoCol
        left={
          <div>
            <SectionLabel>Apa itu Global Fees?</SectionLabel>
            <p className="prose">
              Setiap token di Solana punya <strong>global fees</strong> — biaya transaksi kecil
              yang dikenakan setiap kali ada yang membeli atau menjual melalui pool seperti
              Raydium atau Orca. Besarnya sekitar <strong>0.25% dari nilai transaksi</strong>,
              dan fee ini masuk ke pool sebagai kompensasi bagi liquidity provider.
            </p>
            <p className="prose">
              Angka ini kelihatan sepele. Tapi jika kamu tahu cara membacanya,
              ini adalah <em>alat deteksi volume palsu yang paling akurat saat ini.</em>
            </p>
          </div>
        }
        right={<PanelImg src={globalFeesImg} alt="Ilustrasi Global Fees" />}
      />

      {/* BAGIAN 2 — Analogi */}
      <div className="reveal">
        <SectionLabel>Cara memahaminya</SectionLabel>
        <HighlightBox>
          <p style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 8, fontSize: 15 }}>
            📊 Analoginya seperti struk pajak restoran
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink2)', margin: 0 }}>
            Bayangkan restoran melaporkan penjualan <strong>Rp 100 juta</strong> hari ini.
            Tapi struk pajaknya hanya <strong>Rp 10 ribu</strong>. Ini tidak masuk akal —
            artinya laporannya bohong. Hal yang sama terjadi di crypto: volume tinggi tapi
            fee sangat kecil = volume palsu (<strong>wash trading</strong>). Tujuannya satu:
            memancing pembeli awam agar masuk karena mengira token ini ramai.
          </p>
        </HighlightBox>
      </div>

      <Divider />

      {/* BAGIAN 3 — 3 Tipe Volume */}
      <div className="reveal">
        <SectionLabel>Tiga tipe volume yang perlu kamu kenali</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            {
              icon: '✅', label: 'Volume Organik', color: '#065f46', bg: '#f0fdf4', border: '#a7f3d0',
              desc: 'Fee sebanding dengan volume. Banyak wallet berbeda bertransaksi. Chart naik seiring volume — sehat dan asli.'
            },
            {
              icon: '⚠️', label: 'Wash Trading', color: '#92400e', bg: '#fff8ec', border: '#fde68a',
              desc: 'Volume tinggi tapi fee sangat kecil. Wallet yang sama saling jual-beli. Manipulasi — dibuat agar terlihat ramai.'
            },
            {
              icon: '🚨', label: 'Bot Pump', color: '#991b1b', bg: '#fff1f1', border: '#fecaca',
              desc: 'Volume meledak dalam detik tapi fee tidak sebanding. Biasanya di detik pertama launch. Sangat berbahaya.'
            },
          ].map(c => (
            <div key={c.label} style={{
              background: c.bg, border: `1px solid ${c.border}`,
              borderRadius: 12, padding: '16px 14px',
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.label}</p>
              <p style={{ fontSize: 13.5, lineHeight: 1.75, color: 'var(--ink2)', margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* BAGIAN 4 — Cara cek */}
      <div className="reveal">
        <SectionLabel>Cara mengeceknya</SectionLabel>
        <p className="prose">
          Buka <strong>DexScreener</strong> → tab "Info", atau gunakan <strong>Birdeye</strong> dan
          <strong> Solscan</strong>. Bandingkan angka <em>Total Fee Collected</em> dengan
          <em> Total Volume</em>. Kalau volume besar tapi fee sangat kecil, kamu sudah tahu apa artinya.
        </p>
        <Callout type="ok" icon="💡" title="Sinyal sehat yang perlu kamu cari">
          Token dengan fee yang terkumpul secara konsisten seiring waktu adalah tanda
          volume organik yang nyata. Ini salah satu sinyal terkuat yang ada — jauh lebih
          jujur dari klaim "volume 10x" di Telegram.
        </Callout>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/* P2 · REVOKE & MINTING                                           */
/* ──────────────────────────────────────────────────────────────── */
export function PanelRevoke() {
  return (
    <>
      {/* BAGIAN 1 — Jebakan Revoke + Gambar */}
      <TwoCol
        left={
          <div>
            <SectionLabel>Kesalahpahaman yang paling mahal</SectionLabel>
            <p className="prose">
              <strong>Revoke authority</strong> dan <strong>mint authority</strong> adalah dua hal
              yang paling sering disalahgunakan developer nakal untuk memberi kesan aman palsu.
              Kamu sering melihat klaim seperti ini di Telegram:
            </p>
            <div style={{
              background: 'var(--bt)', border: '1px solid var(--bp)',
              borderRadius: 10, padding: '13px 16px', marginBottom: 16,
              fontSize: 14.5, color: 'var(--b)', fontWeight: 600,
            }}>
              ✅ Revoke sudah dilakukan! 100% aman! Ayo masuk sebelum terlambat!
            </div>
            <p className="prose">
              Terdengar meyakinkan. Tapi faktanya: <em>Revoke sudah dilakukan ≠ Token aman.</em>
              Ini adalah kesalahpahaman paling mahal yang dialami trader baru.
            </p>
          </div>
        }
        right={<PanelImg src={revokeImg} alt="Ilustrasi Revoke dan Minting" />}
      />

      <Divider />

      {/* BAGIAN 2 — Perbandingan Revoke vs Mint */}
      <div className="reveal">
        <SectionLabel>Perbedaan yang wajib kamu pahami</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Revoke — sisi aman */}
          <div style={{
            background: '#f0fdf4', border: '1px solid #a7f3d0',
            borderRadius: 14, padding: '18px 18px',
          }}>
            <p style={{ fontWeight: 700, color: '#065f46', marginBottom: 12, fontSize: 14 }}>
              ✅ Revoke Authority — Sudah Dicabut
            </p>
            {[
              'Developer tidak bisa lagi membekukan akun pemegang',
              'Token tidak bisa dikunci atau diblokir secara paksa',
              'Sering jadi checklist di RugCheck dan tools serupa',
              '⚠️ Tapi: TIDAK mencegah developer dump supply yang sudah mereka pegang',
            ].map((t, i) => (
              <p key={i} style={{ fontSize: 13.5, lineHeight: 1.75, color: '#374151', marginBottom: 6, paddingLeft: 16, borderLeft: '2px solid #a7f3d0' }}>
                {t}
              </p>
            ))}
          </div>
          {/* Mint — sisi berbahaya */}
          <div style={{
            background: '#fff1f1', border: '1px solid #fecaca',
            borderRadius: 14, padding: '18px 18px',
          }}>
            <p style={{ fontWeight: 700, color: '#991b1b', marginBottom: 12, fontSize: 14 }}>
              🚨 Mint Authority — Masih Aktif
            </p>
            {[
              'Developer bisa mencetak token baru kapan saja tanpa batas',
              'Supply token bisa membengkak sewaktu-waktu',
              'Nilai token yang kamu pegang otomatis terdilusi',
              'Ini red flag besar — hindari kecuali ada alasan yang sangat transparan',
            ].map((t, i) => (
              <p key={i} style={{ fontSize: 13.5, lineHeight: 1.75, color: '#374151', marginBottom: 6, paddingLeft: 16, borderLeft: '2px solid #fecaca' }}>
                {t}
              </p>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      {/* BAGIAN 3 — Urutan jebakan + Tools */}
      <div className="reveal">
        <SectionLabel>Pola jebakan yang paling sering terjadi</SectionLabel>
        <Callout type="warn" icon="⚠️" title="Urutan yang harus kamu hafal">
          <strong>1) Bundle supply di awal</strong> → <strong>2) Revoke authority</strong> agar terlihat legit
          → <strong>3) Tunggu harga naik</strong> → <strong>4) Dump semua supply yang sudah dikuasai sejak awal.</strong>
          <br /><br />
          Revoke hanya menghapus kemampuan admin tertentu — tidak menyentuh token yang sudah ada di wallet mereka.
          Kamu wajib cek <em>bundle activity</em> secara terpisah, bukan hanya status revoke-nya.
        </Callout>
        <Callout type="ok" icon="🔍" title="Tools yang bisa kamu gunakan sekarang">
          Gunakan <strong>RugCheck.xyz</strong>, <strong>Token Sniffer</strong>, atau langsung di
          <strong> Solscan</strong>. Cari bagian "Token Extensions" → perhatikan status
          <em> Mint Authority</em> dan <em>Freeze Authority</em>. Kalau tertulis "Active" —
          jangan masuk kecuali kamu benar-benar tahu alasannya.
        </Callout>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/* P3 · MEME VS UTILITY                                            */
/* ──────────────────────────────────────────────────────────────── */
export function PanelMemeVUtil() {
  return (
    <>
      {/* BAGIAN 1 — Konteks perdebatan */}
      <div className="reveal">
        <SectionLabel>Perdebatan yang sering salah arah</SectionLabel>
        <p className="prose">
          Ini adalah perdebatan paling umum di komunitas crypto, dan juga yang paling sering membuat
          pemula salah kaprah. <strong>Kubu utility</strong> bilang: "Meme coin itu judi, cari yang ada
          produk nyatanya." Tapi mereka lupa bahwa meme coin sudah mencetak lebih banyak orang kaya
          dalam 12 bulan terakhir dibanding instrumen investasi manapun.
        </p>
        <p className="prose">
          <strong>Kubu meme</strong> bilang: "Utility itu lambat, ngapain." Tapi mereka lupa bahwa tanpa
          pemahaman, trading meme coin sama saja dengan berjudi tanpa tahu aturan mainnya.
        </p>
      </div>

      <div className="pull reveal">
        "Pertanyaan yang benar bukan 'mana yang lebih baik?' — tapi 'mana yang sesuai dengan
        cara bermainku, dan apakah aku punya skill untuk memainkannya dengan benar?'"
      </div>

      <Divider />

      {/* BAGIAN 2 — Perbandingan */}
      <div className="reveal">
        <SectionLabel>Perbedaan karakteristik keduanya</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            {
              icon: '🎭', label: 'Meme Coin', color: '#1a3a9e', bg: 'var(--bt)', border: 'var(--bp)',
              items: [
                'Digerakkan narasi viral dan komunitas, bukan fundamental',
                'Tidak perlu produk nyata untuk naik 100x',
                'Window profit sangat sempit — bisa hitungan menit',
                'High risk, high reward yang sangat ekstrem',
                'Cocok untuk trader aktif yang terus monitor market',
                'Wajib cek: siapa deployer-nya, ada cabal di belakang?',
              ],
            },
            {
              icon: '🔧', label: 'Utility Token', color: '#065f46', bg: '#f0fdf4', border: '#a7f3d0',
              items: [
                'Punya produk atau layanan nyata sebagai fondasi nilai',
                'Bisa dianalisis dari sisi use-case dan tingkat adopsi',
                'Window profit lebih panjang — berminggu sampai berbulan',
                'Lebih cocok untuk investasi jangka menengah',
                'Cocok untuk investor yang sabar, bukan scalper',
                'Wajib cek: produknya benar-benar exist dan dipakai?',
              ],
            },
          ].map(c => (
            <div key={c.label} style={{
              background: c.bg, border: `1px solid ${c.border}`,
              borderRadius: 14, padding: '18px 18px',
            }}>
              <p style={{ fontWeight: 700, color: c.color, marginBottom: 14, fontSize: 15 }}>
                {c.icon} {c.label}
              </p>
              {c.items.map((t, i) => (
                <p key={i} style={{ fontSize: 13.5, lineHeight: 1.75, color: 'var(--ink2)', marginBottom: 5, display: 'flex', gap: 8 }}>
                  <span style={{ color: c.color, flexShrink: 0, fontWeight: 700 }}>→</span>
                  {t}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* BAGIAN 3 — Rekomendasi */}
      <div className="reveal">
        <Callout type="info" icon="🎯" title="Rekomendasi Ponyin untuk pemula">
          <strong>Mulailah dari meme coin dulu.</strong> Bukan karena lebih aman — justru sebaliknya.
          Tapi karena kecepatannya yang ekstrem akan memaksamu memahami psikologi trading, manajemen
          risiko, dan cara baca pasar jauh lebih cepat dibanding buku manapun.
          <br /><br />
          Kamu akan belajar dengan cara yang paling nyata: uang sungguhan, kesalahan sungguhan,
          pelajaran permanen. Setelah fondasinya solid, baru ekspansi ke utility play jika itu arahmu.
        </Callout>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/* P4 · DEX PAID                                                   */
/* ──────────────────────────────────────────────────────────────── */
export function PanelDexPaid() {
  return (
    <>
      {/* BAGIAN 1 — Apa itu */}
      <div className="reveal">
        <SectionLabel>Alat marketing, bukan bukti kualitas</SectionLabel>
        <p className="prose">
          <strong>Dex Paid</strong>, <strong>Ads</strong>, dan <strong>Boost/Trending</strong> adalah
          fitur yang sering disalahartikan sebagai bukti token layak dibeli. Kenyataannya? Ketiganya
          adalah <strong>alat marketing yang bisa dibeli kapan saja oleh siapapun</strong> — termasuk
          oleh developer yang sedang bersiap dump ke kamu.
        </p>
        <p className="prose">
          Perbedaannya bukan pada <em>apakah</em> mereka dipasang, tapi pada <em>kapan</em> mereka dipasang.
          Satu detail waktu ini bisa membedakan "sinyal positif" dengan "jebakan FOMO."
        </p>
      </div>

      <IllusBox><DexPaidSVG /></IllusBox>

      {/* BAGIAN 2 — Analogi */}
      <div className="reveal">
        <SectionLabel>Analogi yang mudah dipahami</SectionLabel>
        <HighlightBox>
          <p style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 8, fontSize: 15 }}>
            🍜 Warung mie ayam yang sewa antrian palsu
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink2)', margin: 0 }}>
            Warung sepi menyewa belasan orang untuk berdiri mengantri di depan. Kamu lewat,
            melihat antrian panjang, pikir "pasti enak nih," lalu masuk dan pesan. Kamu beli
            dengan harga yang sudah dinaikkan. Keesokan harinya warung tutup, pemiliknya kabur.
            <em> Kamu adalah exit liquidity-nya.</em>
          </p>
        </HighlightBox>
      </div>

      <Divider />

      {/* BAGIAN 3 — 3 Fitur */}
      <div className="reveal">
        <SectionLabel>Tiga fitur dan cara membacanya</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { icon: '💳', label: 'Dex Paid', desc: 'Biaya listing resmi ke DexScreener. Positif jika dipasang di awal launch — menunjukkan dev serius. Meragukan jika muncul setelah pump besar.' },
            { icon: '📣', label: 'Ads (Iklan)', desc: 'Banner berbayar di DexScreener. Positif jika token masih kecil. Berbahaya jika muncul setelah harga di puncak — artinya mereka butuh pembeli baru untuk cuci gudang.' },
            { icon: '🚀', label: 'Boost / Trending', desc: 'Mendorong token ke halaman Trending. Bisa dibeli kapan saja oleh siapapun termasuk scammer. Jangan beli hanya karena trending.' },
          ].map(c => (
            <div key={c.label} style={{
              background: 'var(--w)', border: '1px solid var(--c3)',
              borderRadius: 12, padding: '16px 14px',
              transition: 'box-shadow .2s, border-color .2s',
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>{c.label}</p>
              <p style={{ fontSize: 13.5, lineHeight: 1.75, color: 'var(--ink3)', margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* BAGIAN 4 — Pola berbahaya + sinyal positif */}
      <div className="reveal">
        <SectionLabel>Kapan bahaya, kapan aman?</SectionLabel>
        <Callout type="warn" icon="⚠️" title="Pola berbahaya yang harus kamu hafal">
          <strong>Boost + Ads muncul mendadak setelah token sudah pump besar</strong> = sinyal distribusi.
          Developer dan whale yang sudah untung besar menggunakan visibility untuk menarik pembeli baru
          masuk di harga puncak. Begitu pembeli baru cukup banyak, mereka dump semuanya. Harga jatuh. Pembeli baru nyangkut.
        </Callout>
        <Callout type="ok" icon="✅" title="Kapan Dex Paid jadi sinyal positif?">
          Ketika <strong>muncul di awal launch</strong> — sebelum token punya volume besar —
          bersamaan dengan narasi genuine dan komunitas organik yang aktif. Ini menunjukkan developer
          berkomitmen jangka panjang. Kombinasi ini jarang ada, tapi kalau muncul, itu yang kamu cari.
        </Callout>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/* P5 · 3 KONFIRMASI CANDLE                                        */
/* ──────────────────────────────────────────────────────────────── */
export function PanelKonfirmasi() {
  return (
    <>
      {/* BAGIAN 1 — Masalah + Visual */}
      <TwoCol
        left={
          <div>
            <SectionLabel>Penyakit FOMO yang umum terjadi</SectionLabel>
            <p className="prose">
              Salah satu kesalahan paling umum trader baru adalah refleks FOMO saat melihat
              chart turun tajam: <em>"Harganya lagi murah banget, kalau gue masuk sekarang pasti profit!"</em>
            </p>
            <p className="prose">
              Padahal pertanyaan yang benar adalah: <strong>dari mana kamu tahu ini dip yang
                akan balik naik, bukan awal dari kejatuhan menuju nol?</strong> Satu candle merah
              panjang belum berarti apa-apa. Kamu butuh konfirmasi.
            </p>
            <HighlightBox>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                🌊 Analoginya seperti cek ombak sebelum berenang
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--ink2)', margin: 0 }}>
                Kamu tidak langsung terjun saat melihat ombak surut. Celupkan kaki dulu, rasakan
                tarikan arusnya. Baru kalau aman, masuk. Metode 3 Konfirmasi Candle bekerja persis
                sama — masuk bertahap, bukan sekaligus.
              </p>
            </HighlightBox>
          </div>
        }
        right={
          <div style={{
            borderRadius: 14, overflow: 'hidden',
            border: '1px solid var(--c3)',
            boxShadow: '0 4px 20px rgba(36,85,212,.07)',
          }}>
            <KonfirmasiSVG />
          </div>
        }
      />

      <Divider />

      {/* BAGIAN 2 — 3 Langkah */}
      <div className="reveal">
        <SectionLabel>Tiga langkah metode Ponyin</SectionLabel>
        <StepFlow steps={[
          {
            icon: '1️⃣', color: '#ef4444',
            title: 'Dip Pertama — Jangan Masuk',
            desc: 'Chart turun dari puncak. Banyak trader baru masuk karena "harganya sudah diskon." <strong>Tahan diri kamu.</strong> Data menunjukkan: dip pertama hampir selalu diikuti satu dip lagi di bawahnya sebelum ada pembalikan nyata.',
          },
          {
            icon: '2️⃣', color: '#f59e0b',
            title: 'Bounce — Masuk 10% Saja',
            desc: 'Harga memantul naik dari titik terendah pertama. Masuk di sini — tapi hanya <strong>10% dari total posisi yang direncanakan</strong>. Ini bukan main buy, ini "mark position." Kalau ternyata salah dan harga terus turun, kerugianmu hanya 10% dari rencana, bukan seluruhnya.',
          },
          {
            icon: '3️⃣', color: '#10b981',
            title: 'Dip Kedua (Konfirmasi) — Entry Penuh',
            desc: 'Harga turun lagi ke area yang mirip dip pertama atau sedikit di bawahnya, tapi tidak jauh. Ini tanda <em>area support</em> sedang terbentuk — titik di mana pembeli mulai masuk lebih banyak dari penjual. <strong>Di sinilah kamu masuk dengan sisa posisi.</strong>',
          },
        ]} />
      </div>

      <Divider />

      {/* BAGIAN 3 — Skenario buruk + Dampak nyata */}
      <div className="reveal">
        <SectionLabel>Manajemen risiko yang sesungguhnya</SectionLabel>
        <Callout type="danger" icon="🚨" title="Kalau dip kedua bablas jauh ke bawah?">
          Itu sinyal untuk mundur sepenuhnya. Tapi karena kamu hanya menaruh 10% di langkah kedua,
          kerugianmu sangat kecil — misalnya 0.1 SOL dari rencana 1 SOL. Kamu yang tadinya berpotensi
          rugi total 1 SOL, jadi hanya rugi kecil yang masih bisa ditanggung.
          <br /><br />
          <strong>Inilah inti manajemen risiko</strong> — bukan menghindari kerugian sama sekali,
          tapi memastikan kerugiannya tidak mematikan. Selama masih bisa bertahan, kamu masih bisa
          belajar dan mencoba lagi.
        </Callout>
        <Callout type="ok" icon="📊" title="Dampak nyata dari metode ini">
          Dengan tidak masuk sekaligus di candle pertama yang "terlihat murah," kamu mengubah skenario
          terburuk dari "boncos total" menjadi "boncos yang masih bisa dikendalikan." Secara statistik,
          metode ini menggeser probabilitas rugi besar dari 90% menjadi sekitar 50/50 — bukan karena
          kamu lebih pintar membaca chart, tapi karena kamu jauh lebih sabar dalam eksekusi.
        </Callout>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/* P6 · CABAL PLAY                                                 */
/* ──────────────────────────────────────────────────────────────── */
export function PanelCabal() {
  return (
    <>
      {/* BAGIAN 1 — Definisi */}
      <div className="reveal">
        <SectionLabel>Apa itu Cabal?</SectionLabel>
        <p className="prose">
          Cabal adalah <strong>kelompok tertutup yang merencanakan peluncuran token secara terkoordinasi</strong>.
          Mereka bukan sekadar "grup trader yang kebetulan beli token yang sama." Mereka sudah merencanakan
          jauh sebelumnya — token apa yang di-deploy, kapan timing push-nya, dan di level harga berapa
          mereka mulai exit.
        </p>
        <p className="prose">
          Dari luar, token cabal terlihat naik secara organik karena narasinya bagus. Komunitasnya ramai,
          momentumnya kuat, chart-nya meyakinkan. Padahal ada skenario yang sudah disusun jauh sebelum
          token itu bahkan diluncurkan.
        </p>
      </div>

      {/* BAGIAN 2 — Tipe cabal */}
      <div className="reveal">
        <SectionLabel>Tiga tipe cabal yang ada</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            {
              icon: '👥', label: 'Cabal Kelompok', color: '#1a3a9e', bg: 'var(--bt)', border: 'var(--bp)',
              desc: 'Bergerak kolektif dan terkoordinasi. Kapan beli, kapan push, kapan distribusi ke retail — semua sudah ditetapkan. Contoh di ekosistem Solana: Marcel, Lexapro, Cooker, Wynn.'
            },
            {
              icon: '👤', label: 'Solo Cabal', color: '#4c1d95', bg: '#f5f3ff', border: '#ddd6fe',
              desc: 'Trader individual dengan modal sangat besar dan "will power" yang kuat. Kontrol penuh di satu tangan. Kalau motivasinya cukup, dia bisa menggerakkan chart sendirian. Contoh paling terkenal: Duvel.'
            },
            {
              icon: '⚔️', label: 'Konflik Cabal', color: '#92400e', bg: '#fff8ec', border: '#fde68a',
              desc: 'Dua cabal atau lebih bertabrakan di satu token — satu coba pump, yang lain coba sabotase. Volume bisa meledak luar biasa. Bisa jadi peluang bagi trader yang tahu posisinya.'
            },
          ].map(c => (
            <div key={c.label} style={{
              background: c.bg, border: `1px solid ${c.border}`,
              borderRadius: 12, padding: '16px 14px',
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: c.color, marginBottom: 6 }}>{c.label}</p>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--ink2)', margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* BAGIAN 3 — Case study */}
      <div className="reveal">
        <SectionLabel>Case study nyata: $yaranaika & Duvel</SectionLabel>
        <Callout type="purple" icon="📖" title="">
          Token <strong>$yaranaika</strong> awalnya naik organik. Lalu ada yang melakukan "vamp" —
          aksi menyabotase dengan menjual besar-besaran untuk merusak momentum. Posisi Duvel di token
          itu kena.
          <br /><br />
          Reaksi Duvel? Tidak mundur. Dia mengeluarkan amunisi dalam jumlah besar dan pump chart
          sendirian — sampai menembus level yang tidak ada seorang pun yang mengira mungkin.
          <em> Sendirian.</em> Itulah kekuatan solo cabal yang punya modal besar.
        </Callout>
      </div>

      <Divider />

      {/* BAGIAN 4 — Tips praktis */}
      <div className="reveal">
        <SectionLabel>Cara memanfaatkan dinamika ini</SectionLabel>
        <ul className="cklist">
          <li>
            <span className="ck">1</span>
            <span><strong>Pelajari "range" push mereka</strong> — Setiap cabal punya histori pergerakan yang bisa dipelajari. Dari sana kamu bisa memetakan level entry dan exit yang jauh lebih presisi daripada trading tanpa konteks.</span>
          </li>
          <li>
            <span className="ck">2</span>
            <span><strong>Monitor suhu konflik antar cabal</strong> — Semakin memanas persaingan di satu token, semakin tinggi potensi volume meledak. Konflik = bensin untuk chart. Pahami dinamika ini dan kamu punya edge yang kebanyakan orang tidak punya.</span>
          </li>
          <li>
            <span className="ck">3</span>
            <span><strong>Track wallet, bukan FOMO ke token</strong> — Kalau ada token runner dan kamu sudah ketinggalan, jangan beli di pucuk. Buka tab transaksi, cari wallet yang masuk pertama. Mereka layak di-track untuk peluang berikutnya.</span>
          </li>
        </ul>
        <Callout type="warn" icon="🔧" title="Tools untuk tracking cabal wallet">
          <strong>Helius Orb</strong>, <strong>Solscan</strong>, <strong>DexScreener</strong>,
          <strong> Bun_Scan</strong>, dan <strong>Terminal</strong>. Catatan penting: hampir semua
          indikator teknikal konvensional seperti RSI, MACD, Bollinger Bands —
          <em> tidak berguna di cabal play.</em> Yang berlaku di sini adalah informasi, kecepatan,
          dan pemahaman tentang siapa yang sedang bermain.
        </Callout>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/* P7 · HOLDER                                                     */
/* ──────────────────────────────────────────────────────────────── */
export function PanelHolder() {
  return (
    <>
      {/* BAGIAN 1 — Masalah pemahaman */}
      <div className="reveal">
        <SectionLabel>Kesalahan yang sangat umum terjadi</SectionLabel>
        <p className="prose">
          Data holder — siapa yang memegang berapa persen token — adalah data yang paling sering
          dilihat namun paling jarang dipahami dengan benar. Banyak yang berpikir: "kalau tidak ada
          satu holder pun yang pegang lebih dari 5%, berarti distribusinya sehat dan aman."
        </p>
        <p className="prose">
          Ini pandangan yang <strong>sangat naif di era multi-wallet</strong>. Dan di sinilah banyak
          trader kehilangan uang mereka.
        </p>
      </div>

      {/* BAGIAN 2 — Visual multi-wallet */}
      <div className="reveal">
        <HighlightBox style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 36, flexShrink: 0, lineHeight: 1 }}>👤</div>
          <div>
            <p style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 6, fontSize: 15 }}>
              Satu Orang, Banyak Identitas
            </p>
            <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--ink2)', margin: 0 }}>
              Trader yang terlihat "hanya punya 1 wallet dengan 2% supply" bisa saja mengendalikan
              10 wallet berbeda — total kepemilikannya: <strong>20%</strong>. Dan kamu tidak bisa
              melihatnya di block explorer manapun.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {['💼 2%', '💼 2%', '💼 2%', '💼 2%', '💼 2%', '💼 2%', '💼 2%', '💼 2%', '💼 2%', '💼 2%'].map((w, i) => (
                <span key={i} style={{
                  background: 'var(--w)', border: '1px solid var(--bp)',
                  borderRadius: 8, padding: '4px 10px', fontSize: 12,
                  fontWeight: 700, color: 'var(--b)',
                }}>{w}</span>
              ))}
              <span style={{
                background: 'var(--b)', borderRadius: 8, padding: '4px 10px',
                fontSize: 12, fontWeight: 700, color: '#fff',
              }}>= 20% total</span>
            </div>
          </div>
        </HighlightBox>
      </div>

      <Divider />

      {/* BAGIAN 3 — Konteks PvP + callouts */}
      <div className="reveal">
        <SectionLabel>Realita di pasar new pair</SectionLabel>
        <p className="prose">
          Di pasar new pair, kondisinya berjalan sangat cepat dan chaotic. Para pemain besar seperti
          Cupsey, Cented, Log, Decu membeli dalam jumlah besar secara agresif. Tidak ada yang peduli
          siapa punya berapa — selama narasi menarik dan momentum ada, semua orang langsung masuk.
          Inilah <em>PvP sesungguhnya.</em>
        </p>
        <Callout type="info" icon="💡" title='Mengapa aturan "holder di bawah 3%" sudah tidak relevan?'>
          Untuk token dengan narasi besar — apalagi ada efek viral atau endorsement orang terkenal —
          holder dengan 7–10% per wallet sudah sangat wajar dan bukan red flag.
          Kamu tidak tahu wallet itu milik siapa. Multi-wallet adalah strategi standar di kalangan
          trader serius. <em>Zero-sum mentality berlaku untuk semua orang.</em>
        </Callout>
        <Callout type="warn" icon="🧠" title="Memahami zero-sum tanpa jadi paranoid">
          Semua orang di pasar ini bermain untuk kepentingan diri sendiri. Dari trader retail terkecil
          sampai whale terbesar. Bahkan yang paling "transparan" pun pada akhirnya akan protect
          posisi mereka duluan. Pahami ini agar kamu tidak naif saat membaca data holder.
        </Callout>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/* P8 · MARKET CAP                                                 */
/* ──────────────────────────────────────────────────────────────── */
export function PanelMarketCap() {
  return (
    <>
      {/* BAGIAN 1 — Pengantar */}
      <div className="reveal">
        <SectionLabel>Memahami tingkatan pasar</SectionLabel>
        <p className="prose">
          <strong>Market Cap</strong> = Harga token × Total supply beredar. Angka ini mengukur
          "seberapa besar" sebuah token dinilai oleh pasar saat ini. Setiap rentang market cap
          punya ekosistemnya sendiri — pemain berbeda, risiko berbeda, strategi yang sepenuhnya berbeda.
        </p>
        <p className="prose">
          Kesalahan paling umum dari pemula adalah memakai strategi yang sama di semua level market cap.
          Apa yang bekerja di new pair bisa jadi bencana di mid cap. Kamu perlu tahu medan yang sedang
          kamu masuki sebelum eksekusi.
        </p>
      </div>

      <IllusBox><MarketCapSVG /></IllusBox>

      <Divider />

      {/* BAGIAN 2 — StepFlow tiap tier */}
      <div className="reveal">
        <SectionLabel>Panduan per level market cap</SectionLabel>
        <StepFlow steps={[
          {
            icon: '🌀', color: '#6b7280',
            title: 'New Pair — Pure Chaos',
            desc: 'Dunia yang baru lahir dan belum ada aturannya. Narasi dan momentum adalah segalanya. Bot sniper, cabal, dan whale beradu dalam hitungan menit. Window sangat sempit — tapi kalau timing tepat, reward bisa luar biasa.',
          },
          {
            icon: '🌱', color: '#3b82f6',
            title: 'Micro Cap ($100k – $5M)',
            desc: 'Di tier ini analisis teknikal mulai punya arti. Kamu bisa baca candle, cek holder distribution, lihat volume vs fee. Komunitas mulai terbentuk. Sangat cocok untuk scalp dan cari reversal yang terstruktur.',
          },
          {
            icon: '🐬', color: '#8b5cf6',
            title: 'Mid Cap ($5M – $50M)',
            desc: 'Pemain serius mulai masuk. Pendorong harga sudah masuk ke media lebih mainstream. Bisa bermain dengan size lebih besar, tapi entry harus lebih presisi. Belum waktunya "beli lalu tidur."',
          },
          {
            icon: '🐳', color: '#f59e0b',
            title: 'High Cap ($50M – $200M)',
            desc: 'Pergerakan chart dikontrol whale besar dan narasi media. Begitu outlet mainstream ramai membicarakannya — itu justru sinyal untuk mulai perlahan keluar. Puncak hype biasanya adalah puncak harga juga.',
          },
          {
            icon: '🏦', color: '#ef4444',
            title: 'CEX Listing',
            desc: 'Retail masuk masif, volume meledak — tapi lawanmu bukan lagi sesama retail. Kamu berhadapan langsung dengan <strong>market maker profesional</strong> seperti Wintermute dan hedge fund tier atas. Di sini yang relevan adalah strategi institusional.',
          },
        ]} />
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/* P9 · CLOSING                                                    */
/* ──────────────────────────────────────────────────────────────── */
export function PanelClosing() {
  return (
    <>
      <div className="closing-card reveal">
        <img src={avatarSrc} className="closing-av" alt="Ponyin" draggable="false" />
        <div className="closing-quote">
          "Kejahatan lahir bukan karena mereka terstruktur. Kejahatan lahir karena banyak orang
          baik yang diam dan mendiamkan."
          <br /><br />
          Sampai saat ini, prinsip ini yang terus gue pakai setiap hari. Makanya gue senang banget
          share ilmu yang memang seharusnya gratis dan bisa diakses semua orang.
        </div>
        <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,.82)', marginBottom: 22, textAlign: 'center', lineHeight: 1.8 }}>
          Terlebih kalau ilmu ini bermanfaat dan bisa digunakan sama orang lain untuk mengambil
          keputusan yang lebih baik. Guru melahirkan matahari, dan matahari melahirkan para guru.
        </p>
        <div className="closing-sig">Salam hangat — dari dalam dan luar jaringan,<br />@ELPonyin ✨</div>
      </div>

      <Callout type="ok" icon="🙏" title="Kalau materi ini membantu kamu...">
        Jangan lupa bantu orang lain juga. Share ke teman yang masih belajar, atau setidaknya
        follow @elpoyin di X untuk update materi selanjutnya. Ilmu yang disimpan sendirian
        tidak akan pernah berkembang — dan tidak akan pernah membantu siapapun selain dirimu sendiri.
      </Callout>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 24 }} className="reveal">
        <a href="https://x.com/elpoyin" target="_blank" rel="noopener" className="btn btn-blue">𝕏 Follow @elpoyin</a>
        <a href="https://trojan.com/@Keusel" target="_blank" rel="noopener" className="btn btn-outline">⚡ Mulai Trading di Trojan</a>
      </div>
    </>
  );
}
