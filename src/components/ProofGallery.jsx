import { useLang } from '../context/LanguageContext';
import journey1 from '../assets/Journey/photo_2026-03-29_21-40-02.jpg';
import journey2 from '../assets/Journey/photo_2026-03-30_09-58-00.jpg';
import journey3 from '../assets/Journey/photo_2026-03-30_12-20-14.jpg';

export default function ProofGallery() {
  const { lang, t } = useLang();

  const items = lang === 'en' ? [
    {
      tag: 'PnL Snapshot',
      title: 'Real PnL screenshot evidence',
      note: 'These images are first-layer proof: actual PnL results from members who applied the lessons.',
      result: 'Use this as the first proof set before adding chart context later.',
      image: journey1,
    },
    {
      tag: 'Trade Result',
      title: 'PnL outcome after practice',
      note: 'The gallery currently shows real profit/loss screenshots as proof of execution.',
      result: 'A real result that supports the lesson, even if the chart story is next.',
      image: journey2,
    },
    {
      tag: 'Proof First',
      title: 'Shown as PnL evidence',
      note: 'For now, the proof is based on PnL screenshots — later we can expand to full trade screenshots.',
      result: 'This keeps the gallery honest and grounded in real numbers.',
      image: journey3,
    },
    {
      tag: 'Community wins',
      title: 'More screenshots, more trust',
      note: 'The gallery is built to scale as more success journeys arrive.',
      result: 'This is the place for proof that grows over time.',
      image: journey1,
    },
  ] : [
    {
      tag: 'Snapshot PnL',
      title: 'Bukti PnL perjalanan teman-teman',
      note: 'Untuk sekarang, semua screenshot di sini adalah bukti PnL nyata dari yang sudah pakai materinya.',
      result: 'Nanti bisa dikembangkan jadi chart + konteks trade.',
      image: journey1,
    },
    {
      tag: 'Hasil trading',
      title: 'Screenshot PnL hasil practice',
      note: 'Galeri ini menampilkan bukti PnL sebagai bukti eksekusi nyata.',
      result: 'Hasil nyata ini mendukung bahwa materinya bukan sekadar teori.',
      image: journey2,
    },
    {
      tag: 'Bukti pertama',
      title: 'Ditampilkan sebagai bukti PnL',
      note: 'Saat ini bukti utama berbentuk screenshot PnL — nanti bisa ditambah dengan screenshot chart.',
      result: 'Biar galeri tetap jujur dan grounded pada angka nyata.',
      image: journey3,
    },
    {
      tag: 'Kemenangan komunitas',
      title: 'Semakin banyak screenshot, semakin meyakinkan',
      note: 'Galeri ini siap berkembang ketika semakin banyak cerita sukses masuk.',
      result: 'Tempat bukti yang tumbuh seiring waktu.',
      image: journey1,
    },
  ];

  return (
    <section className="proof-section" id="proof-gallery">
      <div className="proof-head">
        <div className="proof-sup">
          {t('Jejak PnL Nyata', 'Proof PnL')}
        </div>
        <h2 className="proof-title">
          {t(
            'Screenshot PnL perjalanan teman-teman yang berhasil praktekkan materi.',
            'PnL screenshots from friends who already applied the lessons.'
          )}
        </h2>
        <p className="proof-desc">
          {t(
            'Untuk sekarang, semua bukti di sini ditampilkan sebagai screenshot PnL — hasil nyata dari yang sudah jalanin materinya.',
            'For now, this section shows PnL screenshots first — real results from people who already applied the material.'
          )}
        </p>
      </div>

      <div className="proof-grid">
        {items.map((item, index) => (
          <div className="proof-card" key={index}>
            <div className="proof-thumb">
              {item.image ? (
                <img src={item.image} alt={item.title} className="proof-img" />
              ) : (
                <span>{item.tag}</span>
              )}
            </div>
            <div className="proof-meta">
              <div className="proof-title-sm">{item.title}</div>
              <div className="proof-note">{item.note}</div>
              <div className="proof-result">{item.result}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
