export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#333',
        textAlign: 'center',
        padding: '2rem'
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 600 }}>
          🛠️ Maintenance
        </h1>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto' }}>
          Server sedang diupgrade. Sabar ya, kembangkan lagi sebentar.
        </p>
        <p style={{ fontSize: '0.875rem', color: '#888', marginTop: '1.5rem' }}>
          SIA akan kembali online segera.
        </p>
      </div>
    </div>
  );
}
