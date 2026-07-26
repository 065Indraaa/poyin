import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Sparkles, Layers, Users, Eye, Anchor, TrendingUp } from 'lucide-react';

export default function FieldNotes() {
  const { lang, t } = useLang();
  const [activeTab, setActiveTab] = useState('all');

  const notes = [
    {
      id: 'harsh-truth',
      category: 'mindset',
      badge: lang === 'en' ? '💥 Harsh Truth' : '💥 Realita Pahit',
      badgeClass: 'badge-amber',
      icon: TrendingUp,
      title: lang === 'en' ? 'Realistic Daily Profit & Mindset Check' : 'Realitas Target Profit & Renungan Kepala Dingin',
      subtitle: lang === 'en' ? 'A realistic calculation for solo traders in degen micin.' : 'Hitungan jujur untuk trader mandiri di dunia degen micin.',
      content: lang === 'en' ? [
        'Read this carefully with a clear mind. I am saying this out of pure care.',
        'If you trade solo without insider info on both sides, if you are too lazy to track wallets, and you do not study narratives...',
        'Making 0.2 - 0.5 SOL a day is ALREADY MORE THAN ENOUGH.',
        '260k - 550k IDR a day is equivalent to what hard workers earn out there working until their sweat soaks through.',
        '500k IDR x 30 days consistently = 15 Million IDR. That matches the salary of a young corporate executive without corrupting tenders.',
        'Think about it deeply... Are you here chasing narratives, adrenaline, and endorphins... or are you here to build real income? Reflect on it slowly.'
      ] : [
        'Baca baik-baik pake kepala dingin. Beneran bilangin baik-baik ini aku.',
        'Kalo kamu trade sendiri, gapunya info kiri kanan, males track wallet, dan ga belajar narasi...',
        'Profit 0.2 - 0.5 SOL sehari itu udah cukup banget. Lebih dari cukup malah.',
        '260rb - 550rb sehari itu udah kayak harga yang dikasih orang di luar sana kerja sampe keringet nyelip di pantat.',
        '500rb x 30 hari konsisten = 15 Juta IDR. Udah setara gaji eksekutif muda yang ga korupsi tender.',
        'Coba pikirin baik-baik lagi... Kamu di sini ngejar narasi, adrenalin, dan endorfin... Atau nyari rejeki? Coba renungin pelan-pelan.'
      ],
      author: '@elpoyin',
    },
    {
      id: 'bundle',
      category: 'alpha',
      badge: lang === 'en' ? '📦 Bundle Reality' : '📦 Realita Bundle',
      badgeClass: 'badge-blue',
      icon: Layers,
      title: lang === 'en' ? 'Addressing the Bundle Reputation' : 'Membahas Soal Bundle & Reputasi',
      subtitle: lang === 'en' ? 'Why supply bundling is a central reality in Solana.' : 'Kenapa topik bundle melekat dan bagaimana menyikapinya.',
      content: lang === 'en' ? [
        'Before sleep, here is a fact that not everyone is willing to accept in this degen micin ecosystem. This is pure information. Believe it or not, it is up to you.',
        'It feels right for me to address bundles, considering I am primarily "known" for "bundles". And that is completely okay. Truly fine.',
        'Whether in global CT or local CT, supply bundling is a core mechanism that moves early liquidity. Understanding how bundles operate is step zero to not becoming exit liquidity.'
      ] : [
        'Sebelum tidur gw mau ngasih fakta yang ga semua orang nerima di degen micin ini. Ini murni informasi. Percaya atau tidak terserah.',
        'Keknya gw bisa nih bahas bundle berhubung gw "dikenal" nya karena "bundle". Dan tidak apa-apa. Benar-benar baik.',
        'Mau di CT luar atau CT lokal, bundling supply adalah mekanisme inti pergerakan likuiditas awal. Paham cara kerja bundle adalah langkah nol agar kamu tidak jadi exit liquidity.'
      ],
      author: '@elpoyin',
    },
    {
      id: 'circle-politics',
      category: 'alpha',
      badge: lang === 'en' ? '🎭 Circle Politics' : '🎭 Perang Sirkel',
      badgeClass: 'badge-purple',
      icon: Users,
      title: lang === 'en' ? 'Circle A vs Circle B Dynamics' : 'Dinamika Lingkaran A vs Lingkaran B',
      subtitle: lang === 'en' ? 'How to spot circle politics and drama in CT.' : 'Cara membedakan faksi sirkel saat terjadi drama & persaingan.',
      content: lang === 'en' ? [
        'There will even be drama and accusations flying around. It gets intense. Usually because Circle A has a higher supply bundle than Circle B, or vice versa.',
        'How do you tell Circle A and Circle B apart? Just watch when drama unfolds. Look for who is pro and who is contra, then separate them.',
        'Check their followers network; you will see people standing right in plain sight. It is that obvious once you observe calmly.'
      ] : [
        'Bahkan nanti ada sampe drama tuduh-tuduhan. Beuh seru itu. Biasanya karena circle A bundle nya lebih tinggi dari circle B, pun sebaliknya.',
        'Gimana cara bedain lingkaran A dan lingkaran B? Ya liat aja ntr pas ada drama. Cari yang pro dan kontra trus pisahin.',
        'Cek followersnya ntr juga keliatan kok orang plain sight. Beneran keliatan jelas kalau diperhatikan dengan tenang.'
      ],
      author: '@elpoyin',
    },
    {
      id: 'showmanship',
      category: 'strategy',
      badge: lang === 'en' ? '👥 Frontmen vs Backstage' : '👥 Tampil Panggung vs Belakang Layar',
      badgeClass: 'badge-indigo',
      icon: Eye,
      title: lang === 'en' ? 'Frontmen vs Behind-the-Scenes Players' : 'Showmanship vs Eksekutor Belakang Layar',
      subtitle: lang === 'en' ? 'Separating public performers from silent market movers.' : 'Membedakan siapa yang tampil di panggung vs yang bergerak di balik layar.',
      content: lang === 'en' ? [
        'The people involved are specialized. There is a role called "showmanship" (public KOLs/frontmen) and there are those who operate quietly behind the scenes.',
        'The point of knowing this? Expand your information depth. Do not blindly follow the loudest voice on the timeline without checking who holds the actual trigger.'
      ] : [
        'Nah, orang-orangnya juga khusus. Jadi ada yang namanya showmanship dan ada juga yang gerak di belakang layar.',
        'Poinnya apa? Ya perbanyak informasi. Jangan mentang-mentang ada yang teriak di timeline lalu langsung ditelan bulat-bulat tanpa tau siapa yang pegang pemicu sebenarnya.'
      ],
      author: '@elpoyin',
    },
    {
      id: 'lone-wolf',
      category: 'strategy',
      badge: lang === 'en' ? '🐺 Lone Wolf Strategy' : '🐺 Strategi Trader Bebas',
      badgeClass: 'badge-emerald',
      icon: Anchor,
      title: lang === 'en' ? 'The Advantage of Having No Circle' : 'Keuntungan Menjadi Trader Tanpa Sirkel Sekat',
      subtitle: lang === 'en' ? 'Why free agent positioning yields maximum mobility.' : 'Kenapa posisi netral membuat kamu bebas menarik manfaat dari mana saja.',
      content: lang === 'en' ? [
        'Do not join a locked circle if you can avoid it. Why? Because in this ecosystem, it is actually a massive advantage NOT to have a circle.',
        'You remain completely free to move into any circle, extracting value and insights from both the left and the right without being tied down by political loyalties.',
        'Good luck and get a good rest.'
      ] : [
        'Jangan gabung sirkel jika bisa. Kenapa? Soalnya kalo di ekosistem ini justru enak gapunya sirkel.',
        'Kamu jadinya bebas bisa masuk sirkel manapun. Bisa tarik manfaat dari kiri kanan tanpa terikat konflik kepentingan atau politik sirkel.',
        'Semoga beruntung dan Selamat istirahat.'
      ],
      author: '@elpoyin',
    },
  ];

  const filteredNotes = activeTab === 'all' 
    ? notes 
    : notes.filter(n => n.category === activeTab);

  return (
    <section className="field-notes-section" id="field-notes">
      <div className="field-notes-container">
        {/* Section Header */}
        <div className="field-notes-head">
          <div className="field-notes-sup">
            <Sparkles size={14} className="sup-icon" />
            <span>{t('CATATAN LAPANGAN POYIN', 'POYIN\'S FIELD NOTES')}</span>
          </div>
          <h2 className="field-notes-title">
            {t('Catatan Lapangan & Realita Degen', 'Field Notes & Degen Realities')}
          </h2>
          <p className="field-notes-desc">
            {t(
              'Bocoran informasi murni, realita per-bundlean, dinamika sirkel, dan pengingat kepala dingin dari @elpoyin.',
              'Pure information, bundle realities, circle dynamics, and clear-minded reminders from @elpoyin.'
            )}
          </p>

          {/* Filter Tabs */}
          <div className="field-notes-tabs" role="tablist" aria-label="Filter catatan lapangan">
            <button
              role="tab"
              aria-selected={activeTab === 'all'}
              className={`fn-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              {t('Semua Catatan', 'All Notes')} ({notes.length})
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'mindset'}
              className={`fn-tab ${activeTab === 'mindset' ? 'active' : ''}`}
              onClick={() => setActiveTab('mindset')}
            >
              💥 {t('Pikiran & Target Profit', 'Mindset & Profit')}
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'alpha'}
              className={`fn-tab ${activeTab === 'alpha' ? 'active' : ''}`}
              onClick={() => setActiveTab('alpha')}
            >
              📦 {t('Bundle & Sirkel', 'Bundle & Circles')}
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'strategy'}
              className={`fn-tab ${activeTab === 'strategy' ? 'active' : ''}`}
              onClick={() => setActiveTab('strategy')}
            >
              🐺 {t('Strategi Trader Bebas', 'Free Agent Strategy')}
            </button>
          </div>
        </div>

        {/* Grid Cards */}
        <div className="field-notes-grid">
          {filteredNotes.map((note) => {
            const IconComponent = note.icon;
            return (
              <article key={note.id} className={`field-note-card ${note.id === 'harsh-truth' ? 'featured-card' : ''}`}>
                <div className="fn-card-header">
                  <span className={`fn-badge ${note.badgeClass}`}>
                    <IconComponent size={13} className="badge-icon" />
                    {note.badge}
                  </span>
                  <span className="fn-author">{note.author}</span>
                </div>

                <h3 className="fn-card-title">{note.title}</h3>
                <p className="fn-card-subtitle">{note.subtitle}</p>

                <div className="fn-card-body">
                  {note.content.map((paragraph, idx) => (
                    <p key={idx} className="fn-paragraph">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="fn-card-footer">
                  <div className="fn-footer-line" />
                  <span className="fn-tagline">{t('Catatan Intel • @elpoyin', 'Intel Dispatch • @elpoyin')}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
