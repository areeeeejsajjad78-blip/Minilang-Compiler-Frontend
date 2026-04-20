import { useState, useEffect } from 'react'
import Editor from './components/Editor'
import OutputPanel from './components/OutputPanel'
import ErrorConsole from './components/ErrorConsole'

const API_URL = import.meta.env.VITE_API_URL || 'https://minilang-compiler-backend-production.up.railway.app'

const SAMPLE_CODE = `int x = 10;
int y = 20;
int sum = x + y;
print(sum);

if (x < y) {
  print(x);
} else {
  print(y);
}
`

export default function App() {
  const [code, setCode] = useState(SAMPLE_CODE)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setTab] = useState('tokens')

  // ✅ Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  async function handleRun() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      setResult(data)
      if (data.errors?.length) setTab('errors')
      else setTab('tokens')
    } catch (err) {
      setResult({ errors: ['Cannot connect to compiler API.'] })
    } finally {
      setLoading(false)
    }
  }

  const TABS = ['tokens', 'ast', 'tac', 'output', 'errors']
  const TAB_COLORS = {
    tokens: 'var(--accent-green)',
    ast: 'var(--accent-blue)',
    tac: 'var(--accent-orange)',
    output: 'var(--accent-purple)',
    errors: '#ff4d4d',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* ── Top Bar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 10px' : '0 20px',
        height: '52px',
        background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontWeight: 700,
          fontSize: isMobile ? 14 : 18,
          color: 'var(--accent-green)',
          letterSpacing: 2
        }}>
          {'<'} MiniLang IDE {'>'}
        </span>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setCode('')}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              padding: isMobile ? '4px 10px' : '6px 16px',
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)'
            }}>
            Clear
          </button>

          <button
            onClick={handleRun}
            disabled={loading}
            style={{
              background: 'var(--accent-green)',
              border: 'none',
              color: '#000',
              padding: isMobile ? '4px 12px' : '6px 20px',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 700,
              fontFamily: 'var(--font-ui)',
              opacity: loading ? 0.6 : 1
            }}>
            {loading ? '...' : '▶ Run'}
          </button>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div style={{
        display: 'flex',
        flex: 1,
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'hidden'
      }}>

        {/* Left: Editor */}
        <div style={{
          flex: isMobile ? '0 0 50%' : '0 0 50%',
          borderRight: isMobile ? 'none' : '1px solid var(--border)',
          borderBottom: isMobile ? '1px solid var(--border)' : 'none',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '8px 16px',
            background: 'var(--bg-card)',
            fontSize: 12,
            color: 'var(--text-muted)',
            borderBottom: '1px solid var(--border)'
          }}>
            source.ml
          </div>

          <div style={{ flex: 1, overflow: 'auto' }}>
            <Editor code={code} onChange={setCode} />
          </div>
        </div>

        {/* Right: Output */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)'
          }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setTab(tab)}
                style={{
                  padding: isMobile ? '8px 10px' : '10px 20px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === tab ? 'var(--bg-panel)' : 'transparent',
                  color: activeTab === tab ? TAB_COLORS[tab] : 'var(--text-muted)',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: activeTab === tab ? 700 : 400,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  borderBottom: activeTab === tab
                    ? `2px solid ${TAB_COLORS[tab]}`
                    : '2px solid transparent'
                }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Output Panel */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: isMobile ? 10 : 16
          }}>
            {!result ? (
              <div style={{
                color: 'var(--text-muted)',
                marginTop: 40,
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 14
              }}>
                Write MiniLang code and click Run ▶
              </div>
            ) : (
              <OutputPanel result={result} activeTab={activeTab} />
            )}
          </div>
        </div>
      </div>

      {/* Error Console */}
      {result?.errors?.length > 0 && <ErrorConsole errors={result.errors} />}
    </div>
  )
}
