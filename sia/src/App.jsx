export default function App() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Georgia", "Times New Roman", serif',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Subtle grid texture */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Top accent bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #111 0%, #555 50%, #111 100%)',
        zIndex: 10,
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 580 }}>

        {/* Logo / Brand */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 56,
          padding: '10px 20px',
          border: '1px solid #e0e0e0',
          letterSpacing: '0.12em',
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>SI</span>
          <span style={{ width: 1, height: 18, background: '#ccc' }} />
          <span style={{ fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Should I Ape?</span>
        </div>

        {/* Main icon — animated gear */}
        <div style={{ marginBottom: 40 }}>
          <svg
            width="72" height="72" viewBox="0 0 72 72" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: 'spin 12s linear infinite',
              display: 'block',
              margin: '0 auto',
            }}
          >
            <style>{`
              @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
              @keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
              @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
              @keyframes blink { 0%,100% { opacity:1; } 49% { opacity:1; } 50% { opacity:0; } 99% { opacity:0; } }
            `}</style>
            <path
              d="M36 4l4.5 8.2a20 20 0 0 1 5.5 2.2l9.2-1.6 6.3 10.9-6 7.1a20 20 0 0 1 0 6.4l6 7.1-6.3 10.9-9.2-1.6a20 20 0 0 1-5.5 2.2L36 68l-4.5-8.2a20 20 0 0 1-5.5-2.2l-9.2 1.6-6.3-10.9 6-7.1a20 20 0 0 1 0-6.4l-6-7.1 6.3-10.9 9.2 1.6a20 20 0 0 1 5.5-2.2L36 4z"
              fill="none" stroke="#222" strokeWidth="2"
            />
            <circle cx="36" cy="36" r="9" fill="none" stroke="#222" strokeWidth="2" />
            <circle cx="36" cy="36" r="3" fill="#222" />
          </svg>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 400,
          color: '#111',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          margin: '0 0 12px',
          animation: 'slideUp 0.7s ease both',
        }}>
          Server Sedang Maintenance
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 14,
          color: '#888',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          margin: '0 0 40px',
          animation: 'slideUp 0.7s 0.1s ease both',
          opacity: 0,
          animationFillMode: 'forwards',
        }}>
          Ponyin Decision Engine · Akan segera kembali
        </p>

        {/* Divider */}
        <div style={{
          width: 48,
          height: 1,
          background: '#222',
          margin: '0 auto 40px',
          animation: 'fadeIn 1s 0.3s ease both',
          opacity: 0,
          animationFillMode: 'forwards',
        }} />

        {/* Message */}
        <p style={{
          fontSize: 16,
          color: '#444',
          lineHeight: 1.75,
          margin: '0 0 48px',
          animation: 'slideUp 0.7s 0.2s ease both',
          opacity: 0,
          animationFillMode: 'forwards',
        }}>
          Kami sedang melakukan pembaruan sistem untuk memberikan pengalaman scanning
          yang lebih akurat dan cepat. Semua data live, indexer, dan stream transaksi
          akan kembali normal dalam waktu dekat.
        </p>

        {/* Status blocks */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          background: '#e8e8e8',
          border: '1px solid #e8e8e8',
          marginBottom: 48,
          animation: 'fadeIn 0.8s 0.35s ease both',
          opacity: 0,
          animationFillMode: 'forwards',
        }}>
          {[
            { label: 'Feed Live', status: 'Offline' },
            { label: 'Scan Engine', status: 'Updating' },
            { label: 'Stream', status: 'Standby' },
          ].map(({ label, status }) => (
            <div key={label} style={{
              background: '#fff',
              padding: '16px 12px',
              textAlign: 'center',
            }}>
              <div style={{
                display: 'inline-block',
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: status === 'Offline' ? '#e74c3c' : status === 'Updating' ? '#f39c12' : '#95a5a6',
                marginBottom: 8,
                animation: status === 'Updating' ? 'pulse 1.6s ease infinite' : 'none',
              }} />
              <div style={{ fontSize: 11, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
              <div style={{ fontSize: 13, color: '#333', fontFamily: 'monospace', marginTop: 2 }}>{status}</div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{
          fontSize: 12,
          color: '#bbb',
          letterSpacing: '0.08em',
          animation: 'fadeIn 1s 0.5s ease both',
          opacity: 0,
          animationFillMode: 'forwards',
        }}>
          © Should I Ape? · Ponyin Trading
          <span style={{
            display: 'inline-block',
            marginLeft: 4,
            animation: 'blink 1.2s step-end infinite',
          }}>_</span>
        </p>

      </div>

      {/* Bottom accent */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #bbb, transparent)',
        zIndex: 10,
      }} />
    </main>
  );
}