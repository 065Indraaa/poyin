import { useLang } from '../context/LanguageContext';

const SCAMMER_DATA = {
  twitter: [
    { username: '@fadeproXBT', platform: 'X', link: 'https://x.com/fadeproXBT' },
    { username: '@Hopium_papa', platform: 'X', link: 'https://x.com/Hopium_papa' },
    { username: '@fabolousgringo', platform: 'X', link: 'https://x.com/fabolousgringo' },
    { username: '@zeusyxyz', platform: 'X', link: 'https://x.com/zeusyxyz' },
  ],
  tiktok: [
    { username: '@hussainyn2', platform: 'TikTok', link: 'https://www.tiktok.com/@hussainyn2' },
    { username: '@mrpepe.idn', platform: 'TikTok', link: 'https://www.tiktok.com/@mrpepe.idn' },
  ],
};

export default function ScammerList() {
  const { lang } = useLang();

  const titleId = lang === 'id'
    ? 'Daftar Scammer'
    : 'Scammer List';

  const descId = lang === 'id'
    ? 'Akun-akun di bawah ini adalah PENIPU. Jangan percaya klaim mereka.'
    : 'The accounts below are SCAMMERS. Do not believe their claims.';

  const twitterLabel = lang === 'id' ? 'X (Twitter)' : 'X (Twitter)';
  const tiktokLabel = 'TikTok';

  return (
    <div className="scammer-section">
      <div className="scammer-header">
        <span className="scammer-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
            <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <span className="scammer-title">{titleId}</span>
      </div>
      <p className="scammer-desc">{descId}</p>

      <div className="scammer-face-section">
        <div className="scammer-face-container">
          <img
            src="/hopium.jpg"
            alt="Scammer Face"
            className="scammer-face-image"
          />
          <div className="scammer-face-label">
            <span className="scammer-badge">SCAM</span>
            <span className="scammer-face-name">Hopium Papa</span>
          </div>
        </div>
      </div>

      <div className="scammer-lists">
        <div className="scammer-list-group">
          <div className="scammer-platform-label">
            <span className="platform-icon">𝕏</span>
            {twitterLabel}
          </div>
          <div className="scammer-items">
            {SCAMMER_DATA.twitter.map((account) => (
              <a
                href={account.link}
                target="_blank"
                rel="noopener noreferrer"
                key={account.username}
                className="scammer-item"
                style={{ textDecoration: 'none' }}
              >
                <span className="scammer-badge">SCAM</span>
                {account.username}
              </a>
            ))}
          </div>
        </div>

        <div className="scammer-list-group">
          <div className="scammer-platform-label">
            <span className="platform-icon-tiktok">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
              </svg>
            </span>
            {tiktokLabel}
          </div>
          <div className="scammer-items">
            {SCAMMER_DATA.tiktok.map((account) => (
              <a
                href={account.link}
                target="_blank"
                rel="noopener noreferrer"
                key={account.username}
                className="scammer-item"
                style={{ textDecoration: 'none' }}
              >
                <span className="scammer-badge">SCAM</span>
                {account.username}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
