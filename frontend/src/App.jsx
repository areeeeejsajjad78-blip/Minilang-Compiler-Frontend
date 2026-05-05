import { useState } from 'react'
import Editor from './components/Editor'
import OutputPanel from './components/OutputPanel'
import ErrorConsole from './components/ErrorConsole'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const SAMPLE_CODE = `int x = 10;
int y = 20;
int sum = x + y;
print(sum);

if (x < y) {
  print(x);
} else {
  print(y);
}`

export default function App() {
  const [code,      setCode]    = useState(SAMPLE_CODE)
  const [result,    setResult]  = useState(null)
  const [loading,   setLoading] = useState(false)
  const [activeTab, setTab]     = useState('tokens')

  async function handleRun() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/compile`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code }),
      })
      const data = await res.json()
      setResult(data)
      if (data.errors && data.errors.length > 0) setTab('errors')
      else setTab('tokens')
    } catch (err) {
      setResult({ errors: ['Cannot connect to compiler API. Is the backend running?'] })
      setTab('errors')
    } finally {
      setLoading(false)
    }
  }

  const TABS = ['tokens', 'ast', 'tac', 'optimized', 'machine', 'output', 'errors']

  const TAB_COLORS = {
    tokens:   'var(--accent-green)',
    ast:      'var(--accent-blue)',
    tac:      'var(--accent-orange)',
    optimized:'#00d4aa',
    machine:  '#ffd700',
    output:   'var(--accent-purple)',
    errors:   '#ff4d4d',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* Top Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '52px',
        background: 'var(--bg-panel)', borderBottom: '1px solid var(--border)',
      }}>
        <span style={{
          fontFamily: 'var(--font-ui)', fontWeight: 700,
          fontSize: 18, color: 'var(--accent-green)', letterSpacing: 2,
        }}>
          {'<'} MiniLang IDE {'>'}
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => { setCode(''); setResult(null) }}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--text-muted)', padding: '6px 16px', borderRadius: 6,
              cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 14,
            }}>
            Clear
          </button>
          <button
            onClick={handleRun}
            disabled={loading}
            style={{
              background: 'var(--accent-green)', border: 'none',
              color: '#000', padding: '6px 20px', borderRadius: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 700, fontFamily: 'var(--font-ui)',
              fontSize: 14, opacity: loading ? 0.6 : 1,
            }}>
            {loading ? 'Compiling...' : '▶  Run'}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left: Editor */}
        <div style={{
          flex: '0 0 50%', borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            padding: '8px 16px', background: 'var(--bg-card)',
            fontSize: 12, color: 'var(--text-muted)',
            borderBottom: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
          }}>
            source.ml
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Editor code={code} onChange={setCode} />
          </div>
        </div>

        {/* Right: Output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Tabs */}
          <div style={{
            display: 'flex', background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            overflowX: 'auto',
          }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setTab(tab)}
                style={{
                  padding: '10px 16px', border: 'none', cursor: 'pointer',
                  background: activeTab === tab ? 'var(--bg-panel)' : 'transparent',
                  color: activeTab === tab ? TAB_COLORS[tab] : 'var(--text-muted)',
                  fontFamily: 'var(--font-ui)', fontSize: 12,
                  fontWeight: activeTab === tab ? 700 : 400,
                  textTransform: 'uppercase', letterSpacing: 1,
                  borderBottom: activeTab === tab
                    ? `2px solid ${TAB_COLORS[tab]}`
                    : '2px solid transparent',
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                {tab}
                {tab === 'errors' && result?.errors?.length > 0 && (
                  <span style={{
                    marginLeft: 6, background: '#ff4d4d', color: '#fff',
                    borderRadius: 10, padding: '1px 7px', fontSize: 10,
                  }}>
                    {result.errors.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
            {!result ? (
              <div style={{
                color: 'var(--text-muted)', marginTop: 40, textAlign: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 14,
              }}>
                Write MiniLang code and click Run ▶
              </div>
            ) : (
              <OutputPanel result={result} activeTab={activeTab} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Error Console */}
      {result?.errors?.length > 0 && (
        <ErrorConsole errors={result.errors} />
      )}

    </div>
  )
}
