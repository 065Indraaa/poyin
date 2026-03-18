import avatarSrc from '../assets/avatar.png';

export default function Hero() {
  const scrollToMateri = (e) => {
    e.preventDefault();
    document.getElementById('materi')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-eyebrow">Trading Intel Hub</div>
        <h1>
          Ilmu trading yang<br />
          <em>nyangkut di otak,</em><br />
          bukan cuma lewat.
        </h1>
        <p className="hero-desc">
          Kalau kamu pernah beli token dan tiba-tiba nyangkut tanpa tahu kenapa — materi ini buat kamu.
          Poyin ngemas ilmu trading on-chain Solana jadi{' '}
          <strong>sesimpel ngobrol sama teman</strong>, tapi sekuat analisis yang biasanya cuma dimiliki whale.
        </p>
        <div className="hero-btns">
          <a href="#materi" className="btn btn-blue" onClick={scrollToMateri}>
            Baca Materi ↓
          </a>
          <a href="https://trojan.com/@Keusel" target="_blank" rel="noopener" className="btn btn-outline">
            ⚡ Platform Trading
          </a>
        </div>
      </div>

      <div className="hero-right">
        <div className="hcard">
          <div className="fchip fc1">🔥 Bundle Vol.1</div>
          <div className="fchip fc2">📊 Solana OG</div>
          <div className="fchip fc3">⚡ trojan.com</div>
          <img src={avatarSrc} className="hcard-av" alt="Poyin" draggable="false" />
          <div className="hcard-name">Poyin</div>
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
