import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLabel } from './useLabel'

describe('useLabel', () => {
  it('returns the initial display value for an integer', () => {
    const { result } = renderHook(() => useLabel(42, true, vi.fn()))
    expect(result.current.displayValue).toBe('42')
  })

  it('returns the display value with two decimals for a float', () => {
    const { result } = renderHook(() => useLabel(5.99, true, vi.fn()))
    expect(result.current.displayValue).toBe('5.99')
  })

  it('starts not editing', () => {
    const { result } = renderHook(() => useLabel(10, true, vi.fn()))
    expect(result.current.editing).toBe(false)
  })

  it('startEdit sets editing to true when editable', () => {
    const { result } = renderHook(() => useLabel(10, true, vi.fn()))
    act(() => { result.current.startEdit() })
    expect(result.current.editing).toBe(true)
  })

  it('startEdit pre-fills inputVal with displayValue', () => {
    const { result } = renderHook(() => useLabel(25, true, vi.fn()))
    act(() => { result.current.startEdit() })
    expect(result.current.inputVal).toBe('25')
  })

  it('startEdit does nothing when not editable', () => {
    const { result } = renderHook(() => useLabel(10, false, vi.fn()))
    act(() => { result.current.startEdit() })
    expect(result.current.editing).toBe(false)
  })

  it('commit calls onCommit with the current inputVal', () => {
    const onCommit = vi.fn()
    const { result } = renderHook(() => useLabel(10, true, onCommit))
    act(() => { result.current.startEdit() })
    act(() => { result.current.setInputVal('77') })
    act(() => { result.current.commit() })
    expect(onCommit).toHaveBeenCalledWith('77')
  })

  it('commit sets editing to false', () => {
    const { result } = renderHook(() => useLabel(10, true, vi.fn()))
    act(() => { result.current.startEdit() })
    act(() => { result.current.commit() })
    expect(result.current.editing).toBe(false)
  })

  it('handleKeyDown Enter calls onCommit and exits editing', () => {
    const onCommit = vi.fn()
    const { result } = renderHook(() => useLabel(10, true, onCommit))
    act(() => { result.current.startEdit() })
    act(() => { result.current.setInputVal('55') })
    act(() => {
      result.current.handleKeyDown({ key: 'Enter' } as React.KeyboardEvent<HTMLInputElement>)
    })
    expect(onCommit).toHaveBeenCalledWith('55')
    expect(result.current.editing).toBe(false)
  })

  it('handleKeyDown Escape exits editing without calling onCommit', () => {
    const onCommit = vi.fn()
    const { result } = renderHook(() => useLabel(10, true, onCommit))
    act(() => { result.current.startEdit() })
    act(() => { result.current.setInputVal('99') })
    act(() => {
      result.current.handleKeyDown({ key: 'Escape' } as React.KeyboardEvent<HTMLInputElement>)
    })
    expect(onCommit).not.toHaveBeenCalled()
    expect(result.current.editing).toBe(false)
  })

  it('handleKeyDown on other keys does nothing', () => {
    const onCommit = vi.fn()
    const { result } = renderHook(() => useLabel(10, true, onCommit))
    act(() => { result.current.startEdit() })
    act(() => {
      result.current.handleKeyDown({ key: 'Tab' } as React.KeyboardEvent<HTMLInputElement>)
    })
    expect(onCommit).not.toHaveBeenCalled()
    expect(result.current.editing).toBe(true)
  })

  it('setInputVal updates inputVal', () => {
    const { result } = renderHook(() => useLabel(10, true, vi.fn()))
    act(() => { result.current.startEdit() })
    act(() => { result.current.setInputVal('33') })
    expect(result.current.inputVal).toBe('33')
  })

  it('exposes inputRef', () => {
    const { result } = renderHook(() => useLabel(10, true, vi.fn()))
    expect(result.current.inputRef).toBeDefined()
  })
})
