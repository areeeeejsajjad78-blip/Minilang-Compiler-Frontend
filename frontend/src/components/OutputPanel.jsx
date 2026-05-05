// src/components/OutputPanel.jsx

export default function OutputPanel({ result, activeTab }) {
  const monoStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    lineHeight: 1.7,
    color: 'var(--text-primary)',
  }

  // ── TOKENS ───────────────────────────────────────────────────
  if (activeTab === 'tokens') {
    return (
      <div>
        {/* Phases completed badge */}
        {result.phases_completed?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {result.phases_completed.map((phase, i) => (
              <span key={i} style={{
                display: 'inline-block', marginRight: 8, marginBottom: 6,
                background: '#0a2a1a', border: '1px solid var(--accent-green)',
                color: 'var(--accent-green)', borderRadius: 4,
                padding: '2px 10px', fontSize: 11,
                fontFamily: 'var(--font-mono)',
              }}>
                ✓ {phase}
              </span>
            ))}
          </div>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse', ...monoStyle }}>
          <thead>
            <tr style={{ color: 'var(--accent-green)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ textAlign: 'left', padding: '4px 12px' }}>#</th>
              <th style={{ textAlign: 'left', padding: '4px 12px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '4px 12px' }}>Value</th>
              <th style={{ textAlign: 'left', padding: '4px 12px' }}>Line</th>
            </tr>
          </thead>
          <tbody>
            {result.tokens?.filter(t => t.type !== 'EOF').map((tok, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1e1e24' }}>
                <td style={{ padding: '3px 12px', color: 'var(--text-muted)' }}>{i + 1}</td>
                <td style={{ padding: '3px 12px', color: 'var(--accent-green)' }}>{tok.type}</td>
                <td style={{ padding: '3px 12px' }}>{tok.value}</td>
                <td style={{ padding: '3px 12px', color: 'var(--text-muted)' }}>{tok.line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // ── AST ──────────────────────────────────────────────────────
  if (activeTab === 'ast') {
    return (
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
          Abstract Syntax Tree — Top-Down Recursive Descent Parser output:
        </div>
        <pre style={{ ...monoStyle, color: 'var(--accent-blue)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {JSON.stringify(result.ast, null, 2)}
        </pre>
        {result.bottom_up_ast && (
          <div style={{ marginTop: 24 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
              Bottom-Up Shift-Reduce Parser output (first expression):
            </div>
            <pre style={{ ...monoStyle, color: '#00d4aa', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(result.bottom_up_ast, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )
  }

  // ── TAC ──────────────────────────────────────────────────────
  if (activeTab === 'tac') {
    return (
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
          Phase 4 — Three-Address Code (before optimization):
        </div>
        <div style={monoStyle}>
          {result.tac?.map((line, i) => (
            <div key={i} style={{
              padding: '2px 0',
              color: line.startsWith('#') ? 'var(--text-muted)'
                   : line.endsWith(':')   ? 'var(--accent-orange)'
                   : line.startsWith('goto') ? '#ffd700'
                   : line.startsWith('if')   ? '#ffd700'
                   : 'var(--text-primary)',
            }}>
              <span style={{ color: 'var(--text-muted)', marginRight: 16, userSelect: 'none' }}>
                {String(i + 1).padStart(3, '0')}
              </span>
              {line}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── OPTIMIZED TAC ─────────────────────────────────────────────
  if (activeTab === 'optimized') {
    return (
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
          Phase 5 — Optimized TAC (Constant Folding + Propagation + Dead Code Elimination):
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { color: '#ffd700', label: '[FOLD] Constant Folding' },
            { color: '#00d4aa', label: '[PROP] Constant Propagation' },
            { color: '#ff6b6b', label: '[DCE] Dead Code Eliminated' },
          ].map(({ color, label }) => (
            <span key={label} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color }}>
              ● {label}
            </span>
          ))}
        </div>

        <div style={monoStyle}>
          {result.optimized_tac?.map((line, i) => (
            <div key={i} style={{
              padding: '2px 0',
              color: line.startsWith('# [FOLD]') ? '#ffd700'
                   : line.startsWith('# [PROP]') ? '#00d4aa'
                   : line.startsWith('# [DCE]')  ? '#ff6b6b'
                   : line.startsWith('#')         ? 'var(--text-muted)'
                   : line.endsWith(':')           ? '#00d4aa'
                   : line.startsWith('goto')      ? '#ffd700'
                   : line.startsWith('if')        ? '#ffd700'
                   : 'var(--text-primary)',
            }}>
              <span style={{ color: 'var(--text-muted)', marginRight: 16, userSelect: 'none' }}>
                {String(i + 1).padStart(3, '0')}
              </span>
              {line}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── MACHINE CODE ──────────────────────────────────────────────
  if (activeTab === 'machine') {
    return (
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
          Phase 6 — Stack Machine Instructions (Final Code Generation):
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { color: '#4d9fff', label: 'PUSH / LOAD (operands)' },
            { color: '#b06aff', label: 'STORE (assignment)' },
            { color: 'var(--accent-orange)', label: 'Arithmetic (ADD/SUB/MUL/DIV)' },
            { color: '#ffd700', label: 'JUMP / JUMPF (control flow)' },
            { color: 'var(--accent-green)', label: 'LABEL / FUNC' },
          ].map(({ color, label }) => (
            <span key={label} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color }}>
              ● {label}
            </span>
          ))}
        </div>

        <div style={monoStyle}>
          {result.machine_code?.map((instr, i) => (
            <div key={i} style={{
              padding: '2px 0',
              color: instr.startsWith('PUSH') || instr.startsWith('LOAD') ? '#4d9fff'
                   : instr.startsWith('STORE')  ? '#b06aff'
                   : instr === 'ADD' || instr === 'SUB' ||
                     instr === 'MUL' || instr === 'DIV' ? 'var(--accent-orange)'
                   : instr.startsWith('CMP')    ? 'var(--accent-orange)'
                   : instr.startsWith('JUMP')   ? '#ffd700'
                   : instr === 'PRINT'          ? 'var(--accent-green)'
                   : instr === 'RETURN'         ? 'var(--accent-green)'
                   : instr.startsWith('LABEL')  ? 'var(--accent-green)'
                   : instr.startsWith('FUNC')   ? 'var(--accent-green)'
                   : instr.startsWith(';')      ? '#333'
                   : 'var(--text-primary)',
            }}>
              <span style={{ color: 'var(--text-muted)', marginRight: 16, userSelect: 'none' }}>
                {String(i + 1).padStart(3, '0')}
              </span>
              {instr}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── OUTPUT ────────────────────────────────────────────────────
  if (activeTab === 'output') {
    return (
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
          Generated Python output (runnable code):
        </div>
        <pre style={{
          ...monoStyle,
          color: 'var(--accent-purple)',
          background: 'var(--bg-card)',
          padding: 16,
          borderRadius: 8,
          whiteSpace: 'pre-wrap',
        }}>
          {result.output?.join('\n') || '// No output generated'}
        </pre>
      </div>
    )
  }

  // ── ERRORS ────────────────────────────────────────────────────
  if (activeTab === 'errors') {
    if (!result.errors?.length && !result.warnings?.length) {
      return (
        <div style={{ ...monoStyle, color: 'var(--accent-green)', marginTop: 20 }}>
          ✓ No errors. Compilation successful.
        </div>
      )
    }
    return (
      <div style={monoStyle}>
        {result.errors?.map((err, i) => (
          <div key={i} style={{
            color: '#ff8080', padding: '4px 0',
            borderBottom: '1px solid #2a1a1a',
          }}>
            <span style={{ color: '#ff4d4d', marginRight: 8 }}>✗</span>
            {err}
          </div>
        ))}
        {result.warnings?.map((w, i) => (
          <div key={i} style={{
            color: '#ffd700', padding: '4px 0',
            borderBottom: '1px solid #2a2a1a',
          }}>
            <span style={{ marginRight: 8 }}>⚠</span>
            {w}
          </div>
        ))}
      </div>
    )
  }

  return null
}
