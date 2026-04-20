import CodeMirror from '@uiw/react-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { javascript } from '@codemirror/lang-javascript'

export default function Editor({ code, onChange }) {
  return (
    <CodeMirror
      value={code}
      theme={oneDark}
      extensions={[javascript()]}
      onChange={onChange}
      style={{ fontSize: 14, height: '100%' }}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        foldGutter: false,
      }}
    />
  )
}
