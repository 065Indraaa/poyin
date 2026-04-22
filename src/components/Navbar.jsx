import avatarSrc from '../assets/avatar.png';
import LangToggle from './LangToggle';
import ThemeToggle from './ThemeToggle';
import PriceTicker from './PriceTicker';

export default function Navbar() {
  const scrollToMateri = (e) => {
    e.preventDefault();
    document.getElementById('materi')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <a href="#" className="nav-brand" onClick={scrollToMateri}>
        <img src={avatarSrc} className="nav-av" alt="Ponyin" draggable="false" />
        <div className="nav-name">Ponyin<b>.</b></div>
      </a>
      <PriceTicker />
      <div className="nav-spacer" />
      <div className="nav-links">
        <LangToggle />
        <ThemeToggle />
        <a href="https://x.com/elponyin" target="_blank" rel="noopener" className="nav-link">
          𝕏 @elponyin
        </a>
        <a href="https://trojan.com/@Ponyinnn" target="_blank" rel="noopener" className="nav-link pri">
          ⚡ Trojan
        </a>
      </div>
    </nav>
  );
}
