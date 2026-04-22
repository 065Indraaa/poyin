import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Mode terang' : 'Mode gelap'}
    >
      <span className={`theme-icon${!isDark ? ' active' : ''}`}>☀️</span>
      <span className="lang-sep">/</span>
      <span className={`theme-icon${isDark ? ' active' : ''}`}>🌙</span>
    </button>
  );
}
