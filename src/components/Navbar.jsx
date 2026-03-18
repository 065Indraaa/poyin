import avatarSrc from '../assets/avatar.png';

export default function Navbar() {
  const scrollToMateri = (e) => {
    e.preventDefault();
    document.getElementById('materi')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <a href="#" className="nav-brand" onClick={scrollToMateri}>
        <img src={avatarSrc} className="nav-av" alt="Poyin" draggable="false" />
        <div className="nav-name">Poyin<b>.</b></div>
      </a>
      <div className="nav-spacer" />
      <div className="nav-links">
        <a href="https://x.com/elpoyin" target="_blank" rel="noopener" className="nav-link">
          𝕏 @elpoyin
        </a>
        <a href="https://trojan.com/@Keusel" target="_blank" rel="noopener" className="nav-link pri">
          ⚡ Trojan
        </a>
      </div>
    </nav>
  );
}
