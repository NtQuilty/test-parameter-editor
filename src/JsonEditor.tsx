import { useEffect, useState } from "react"

interface JsonEditorProps<T> {
  initialValue: T
  value: T
  onChange: (value: T) => void
}

export const JsonEditor = <T,>({ initialValue, value, onChange }: JsonEditorProps<T>) => {
  const [jsonText, setJsonText] = useState(JSON.stringify(initialValue, null, 2))
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!error) {
      setJsonText(JSON.stringify(value, null, 2))
    }
  }, [value, error])

  const handleChange = (newText: string) => {
    setJsonText(newText)

    try {
      const parsed = JSON.parse(newText)

      setError("")
      onChange(parsed)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div>
      <h3 className="json-editor-title">JsonEditor</h3>
      <textarea
        className={`json-editor-textarea${error ? " error" : ""}`}
        name="json-editor"
        onChange={(e) => handleChange(e.target.value)}
        value={jsonText}
      />
      {error && <div className="json-editor-error">❌ Ошибка JSON: {error}</div>}
    </div>
  )
}
