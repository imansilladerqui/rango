import { useState, useRef, useEffect } from 'react'

export const useLabel = (
  value: number,
  editable: boolean,
  onCommit: (raw: string) => void,
) => {
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const displayValue = Number.isInteger(value) ? String(value) : value.toFixed(2)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const startEdit = () => {
    if (!editable) return
    setInputVal(displayValue)
    setEditing(true)
  }

  const commit = () => {
    onCommit(inputVal)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') setEditing(false)
  }

  return { editing, inputVal, setInputVal, inputRef, displayValue, startEdit, commit, handleKeyDown }
}
