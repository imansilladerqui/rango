import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRange } from './useRange'

const NORMAL_PROPS = { mode: 'normal' as const, min: 0, max: 100 }
const FIXED_PROPS = { mode: 'fixed' as const, values: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] }

describe('useRange — normal mode', () => {
  it('initialises minVal to min and maxVal to max', () => {
    const { result } = renderHook(() => useRange(NORMAL_PROPS))
    expect(result.current.minVal).toBe(0)
    expect(result.current.maxVal).toBe(100)
  })

  it('isFixed is false in normal mode', () => {
    const { result } = renderHook(() => useRange(NORMAL_PROPS))
    expect(result.current.isFixed).toBe(false)
  })

  it('minPercent is 0 and maxPercent is 100 at initial bounds', () => {
    const { result } = renderHook(() => useRange(NORMAL_PROPS))
    expect(result.current.minPercent).toBe(0)
    expect(result.current.maxPercent).toBe(100)
  })

  it('minPercent is 50 when minVal is at midpoint', () => {
    const { result } = renderHook(() => useRange({ mode: 'normal', min: 0, max: 100 }))
    act(() => {
      result.current.handleLabelCommit('min', '50')
    })
    expect(result.current.minPercent).toBe(50)
  })

  it('handleLabelCommit min updates minVal', () => {
    const { result } = renderHook(() => useRange(NORMAL_PROPS))
    act(() => {
      result.current.handleLabelCommit('min', '30')
    })
    expect(result.current.minVal).toBe(30)
  })

  it('handleLabelCommit max updates maxVal', () => {
    const { result } = renderHook(() => useRange(NORMAL_PROPS))
    act(() => {
      result.current.handleLabelCommit('max', '70')
    })
    expect(result.current.maxVal).toBe(70)
  })

  it('handleLabelCommit clamps min to minBound', () => {
    const { result } = renderHook(() => useRange(NORMAL_PROPS))
    act(() => {
      result.current.handleLabelCommit('min', '-999')
    })
    expect(result.current.minVal).toBeGreaterThanOrEqual(0)
  })

  it('handleLabelCommit clamps max to maxBound', () => {
    const { result } = renderHook(() => useRange(NORMAL_PROPS))
    act(() => {
      result.current.handleLabelCommit('max', '9999')
    })
    expect(result.current.maxVal).toBeLessThanOrEqual(100)
  })

  it('handleLabelCommit min cannot exceed maxVal', () => {
    const { result } = renderHook(() => useRange(NORMAL_PROPS))
    act(() => {
      result.current.handleLabelCommit('max', '40')
    })
    act(() => {
      result.current.handleLabelCommit('min', '80')
    })
    expect(result.current.minVal).toBeLessThan(result.current.maxVal)
  })

  it('handleLabelCommit max cannot go below minVal', () => {
    const { result } = renderHook(() => useRange(NORMAL_PROPS))
    act(() => {
      result.current.handleLabelCommit('min', '60')
    })
    act(() => {
      result.current.handleLabelCommit('max', '10')
    })
    expect(result.current.maxVal).toBeGreaterThan(result.current.minVal)
  })

  it('handleLabelCommit ignores NaN input', () => {
    const { result } = renderHook(() => useRange(NORMAL_PROPS))
    const before = result.current.minVal
    act(() => {
      result.current.handleLabelCommit('min', 'abc')
    })
    expect(result.current.minVal).toBe(before)
  })

  it('exposes trackRef', () => {
    const { result } = renderHook(() => useRange(NORMAL_PROPS))
    expect(result.current.trackRef).toBeDefined()
  })

  it('startDrag returns a function', () => {
    const { result } = renderHook(() => useRange(NORMAL_PROPS))
    expect(typeof result.current.startDrag('min')).toBe('function')
  })

  it('startDrag sets body cursor to grabbing', () => {
    const { result } = renderHook(() => useRange(NORMAL_PROPS))
    act(() => {
      result.current.startDrag('min')({ preventDefault: vi.fn() } as unknown as React.MouseEvent)
    })
    expect(document.body.style.cursor).toBe('grabbing')
    document.body.style.cursor = ''
  })
})

describe('useRange — fixed mode', () => {
  it('isFixed is true in fixed mode', () => {
    const { result } = renderHook(() => useRange(FIXED_PROPS))
    expect(result.current.isFixed).toBe(true)
  })

  it('initialises minVal to first fixed value', () => {
    const { result } = renderHook(() => useRange(FIXED_PROPS))
    expect(result.current.minVal).toBe(1.99)
  })

  it('initialises maxVal to last fixed value', () => {
    const { result } = renderHook(() => useRange(FIXED_PROPS))
    expect(result.current.maxVal).toBe(70.99)
  })

  it('minPercent is 0 and maxPercent is 100 at initial bounds', () => {
    const { result } = renderHook(() => useRange(FIXED_PROPS))
    expect(result.current.minPercent).toBe(0)
    expect(result.current.maxPercent).toBe(100)
  })
})

describe('useRange — prop changes', () => {
  it('resets minVal and maxVal when props change', () => {
    const { result, rerender } = renderHook((props) => useRange(props), {
      initialProps: { mode: 'normal' as const, min: 0, max: 100 },
    })
    act(() => {
      result.current.handleLabelCommit('min', '40')
    })
    expect(result.current.minVal).toBe(40)

    rerender({ mode: 'normal' as const, min: 10, max: 50 })
    expect(result.current.minVal).toBe(10)
    expect(result.current.maxVal).toBe(50)
  })
})
