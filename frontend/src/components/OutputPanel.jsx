export default function OutputPanel({ result, activeTab }) {
  const monoStyle = {
    fontFamily: 'var(--font-mono)', fontSize: 13,
    lineHeight: 1.7, color: 'var(--text-primary)',
  }

  if (activeTab === 'tokens') {
    return (
      <table style={{ width:'100%', borderCollapse:'collapse', ...monoStyle }}>
        <thead>
          <tr style={{ color:'var(--accent-green)', borderBottom:'1px solid var(--border)' }}>
            <th style={{ textAlign:'left', padding:'4px 12px' }}>#</th>
            <th style={{ textAlign:'left', padding:'4px 12px' }}>Type</th>
            <th style={{ textAlign:'left', padding:'4px 12px' }}>Value</th>
            <th style={{ textAlign:'left', padding:'4px 12px' }}>Line</th>
          </tr>
        </thead>
        <tbody>
          {result.tokens?.filter(t => t.type !== 'EOF').map((tok, i) => (
            <tr key={i} style={{ borderBottom:'1px solid #1e1e24' }}>
              <td style={{ padding:'3px 12px', color:'var(--text-muted)' }}>{i+1}</td>
              <td style={{ padding:'3px 12px', color:'var(--accent-green)' }}>{tok.type}</td>
              <td style={{ padding:'3px 12px' }}>{tok.value}</td>
              <td style={{ padding:'3px 12px', color:'var(--text-muted)' }}>{tok.line}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  if (activeTab === 'ast') {
    return (
      <pre style={{ ...monoStyle, color:'var(--accent-blue)', whiteSpace:'pre-wrap' }}>
        {JSON.stringify(result.ast, null, 2)}
      </pre>
    )
  }

  if (activeTab === 'tac') {
    return (
      <div style={monoStyle}>
        {result.tac?.map((line, i) => (
          <div key={i} style={{
            padding: '2px 0',
            color: line.startsWith('#') ? 'var(--text-muted)'
                 : line.endsWith(':')   ? 'var(--accent-orange)'
                 : 'var(--text-primary)',
          }}>
            <span style={{ color:'var(--text-muted)', marginRight:16 }}>
              {String(i+1).padStart(3,'0')}
            </span>
            {line}
          </div>
        ))}
      </div>
    )
  }

  if (activeTab === 'output') {
    return (
      <div>
        <div style={{ color:'var(--text-muted)', fontSize:11,
          marginBottom:12, fontFamily:'var(--font-mono)' }}>
          Generated Python output:
        </div>
        <pre style={{ ...monoStyle, color:'var(--accent-purple)',
          background:'var(--bg-card)', padding:16, borderRadius:8 }}>
          {result.output?.join('\n') || '// No output'}
        </pre>
      </div>
    )
  }

  return null
}
