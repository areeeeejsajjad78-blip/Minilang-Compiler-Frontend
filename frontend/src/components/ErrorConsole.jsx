export default function ErrorConsole({ errors }) {
  return (
    <div style={{
      background: '#1a0a0a',
      borderTop: '1px solid #ff4d4d44',
      padding: '10px 20px',
      maxHeight: 120,
      overflowY: 'auto',
    }}>
      <span style={{
        color: '#ff4d4d', fontWeight: 700, fontSize: 12,
        fontFamily: 'var(--font-ui)', marginRight: 12,
      }}>
        ERRORS
      </span>
      {errors.map((err, i) => (
        <div key={i} style={{
          color: '#ff8080',
          fontFamily: 'var(--font-mono)',
          fontSize: 13, marginTop: 4,
        }}>
          {err}
        </div>
      ))}
    </div>
  )
}
