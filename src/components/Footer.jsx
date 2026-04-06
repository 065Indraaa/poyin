import { useLang } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer>
      <div className="ft-inner">
        <div>
          <div className="ft-logo">Ponyin<b>.</b></div>
          <div className="ft-desc">
            {t(
              'Materi trading on-chain yang disampaikan jujur dan simpel. Tidak ada jargon yang sengaja dibikin susah — karena ilmu yang bagus harusnya bisa dipahami semua orang.',
              'On-chain trading materials delivered honestly and simply. No jargon made purposefully complicated — because good knowledge should be understandable by everyone.'
            )}
          </div>
          <a
            href="https://trojan.com/@Ponyinnn"
            target="_blank"
            rel="noopener"
            className="ft-partner"
          >
            <div>
              <div className="ft-partner-label">{t('Partner Resmi', 'Official Partner')}</div>
              <div className="ft-partner-name">⚡ trojan.com/@Ponyinnn</div>
            </div>
          </a>
        </div>
        <div className="ft-right">
          <div className="ft-links-title">{t('Terhubung', 'Connect')}</div>
          <div className="ft-links">
            <a
              href="https://x.com/elponyin"
              target="_blank"
              rel="noopener"
              className="ft-link"
            >
              <span style={{ fontSize: 20 }}>𝕏</span>
              {t('Follow @elponyin di X', 'Follow @elponyin on X')}
            </a>
            <a
              href="https://trojan.com/@Ponyinnn"
              target="_blank"
              rel="noopener"
              className="ft-link"
            >
              <span style={{ fontSize: 20 }}>⚡</span>
              {t('Mulai trading di Trojan', 'Start trading on Trojan')}
            </a>
          </div>
        </div>
      </div>

      <div className="ft-copy">
        {t(
          '© 2025 Ponyin Trading Intel Hub · Semua konten dilindungi · Dilarang menyalin tanpa izin',
          '© 2025 Ponyin Trading Intel Hub · All content protected · No copying without permission'
        )}
      </div>
    </footer>
  );
}
