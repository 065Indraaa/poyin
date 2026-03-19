export default function Footer() {
  return (
    <footer>
      <div className="ft-inner">
        <div>
          <div className="ft-logo">Ponyin<b>.</b></div>
          <div className="ft-desc">
            Materi trading on-chain yang disampaikan jujur dan simpel. Tidak ada jargon yang sengaja dibikin susah — karena ilmu yang bagus harusnya bisa dipahami semua orang.
          </div>
          <a
            href="https://trojan.com/@Keusel"
            target="_blank"
            rel="noopener"
            className="ft-partner"
          >
            <div>
              <div className="ft-partner-label">Partner Resmi</div>
              <div className="ft-partner-name">⚡ trojan.com/@Keusel</div>
            </div>
          </a>
        </div>
        <div className="ft-right">
          <div className="ft-links-title">Terhubung</div>
          <div className="ft-links">
            <a
              href="https://x.com/elponyin"
              target="_blank"
              rel="noopener"
              className="ft-link"
            >
              <span style={{ fontSize: 20 }}>𝕏</span>
              Follow @elponyin di X
            </a>
            <a
              href="https://trojan.com/@Keusel"
              target="_blank"
              rel="noopener"
              className="ft-link"
            >
              <span style={{ fontSize: 20 }}>⚡</span>
              Mulai trading di Trojan
            </a>
          </div>
        </div>
      </div>
      <div className="ft-copy">
        © 2025 Ponyin Trading Intel Hub · Semua konten dilindungi · Dilarang menyalin tanpa izin
      </div>
    </footer>
  );
}
