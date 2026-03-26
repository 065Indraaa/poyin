import avatarSrc from '../assets/avatar.png';
import { useLang } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLang();

  const scrollToMateri = (e) => {
    e.preventDefault();
    document.getElementById('materi')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">

      {/* ── Partnership Bar ── */}
      <a
        href="https://t.me/ponyinnn"
        target="_blank"
        rel="noopener noreferrer"
        className="hero-partner-bar"
      >
        <span className="partner-dot" />
        <span className="partner-text">
          {t(
            <>💼 Partnership & Endorsement? Hubungi kami di&nbsp;<strong>@ponyinnn</strong>&nbsp;di Telegram ✉️</>,
            <>💼 Partnership & Endorsement? Reach us at&nbsp;<strong>@ponyinnn</strong>&nbsp;on Telegram ✉️</>
          )}
        </span>
        <span className="partner-arrow">→</span>
      </a>

      <div className="hero-left">
        <div className="hero-eyebrow">Trading Intel Hub</div>
        <h1>
          {t(
            <>Ilmu trading yang<br /><em>nyangkut di otak,</em><br />bukan cuma lewat.</>,
            <>Trading knowledge that<br /><em>sticks in your brain,</em><br />not just passing through.</>
          )}
        </h1>
        <p className="hero-desc">
          {t(
            <>Kalau kamu pernah beli token dan tiba-tiba nyangkut tanpa tahu kenapa — materi ini buat kamu. Ponyin ngemas ilmu trading on-chain Solana jadi{' '}<strong>sesimpel ngobrol sama teman</strong>, tapi sekuat analisis yang biasanya cuma dimiliki whale.</>,
            <>If you've ever bought a token and suddenly got stuck without knowing why — this material is for you. Ponyin packages on-chain Solana trading knowledge to be{' '}<strong>as simple as chatting with a friend</strong>, yet as powerful as analysis usually reserved for whales.</>
          )}
        </p>
        <div className="hero-btns">
          <a href="#materi" className="btn btn-blue" onClick={scrollToMateri}>
            {t('Baca Materi ↓', 'Read Materials ↓')}
          </a>
          <a href="https://trojan.com/@Keusel" target="_blank" rel="noopener" className="btn btn-outline">
            ⚡ {t('Platform Trading', 'Trading Platform')}
          </a>
        </div>
      </div>

      <div className="hero-right">
        <div className="hcard">
          <div className="fchip fc1">🔥 Bundle Vol.1</div>
          <div className="fchip fc2">📊 Solana OG</div>
          <div className="fchip fc3">⚡ trojan.com</div>
          <img src={avatarSrc} className="hcard-av" alt="Ponyin" draggable="false" />
          <div className="hcard-name">Ponyin</div>
          <div className="hcard-role">Trader · Educator</div>
          <div className="hcard-tags">
            <span className="htag">On-chain</span>
            <span className="htag">Solana</span>
            <span className="htag">New Pair</span>
          </div>
        </div>
      </div>

      <div className="scroll-hint">
        <span>Scroll</span>
        <div className="scroll-circle" />
      </div>
    </section>
  );
}
