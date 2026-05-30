import { describe, it, expect } from 'vitest'
import {
  clamp,
  snapToNearest,
  valueToPercent,
  percentToValue,
  roundToTwo,
  computeNewValue,
} from './rangeUtils'

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(50, 0, 100)).toBe(50)
  })

  it('returns min when value is below min', () => {
    expect(clamp(-10, 0, 100)).toBe(0)
  })

  it('returns max when value is above max', () => {
    expect(clamp(200, 0, 100)).toBe(100)
  })

  it('returns min when value equals min', () => {
    expect(clamp(0, 0, 100)).toBe(0)
  })

  it('returns max when value equals max', () => {
    expect(clamp(100, 0, 100)).toBe(100)
  })

  it('works with decimal values', () => {
    expect(clamp(1.5, 1.0, 2.0)).toBe(1.5)
  })

  it('works with negative ranges', () => {
    expect(clamp(-5, -10, -1)).toBe(-5)
    expect(clamp(0, -10, -1)).toBe(-1)
    expect(clamp(-20, -10, -1)).toBe(-10)
  })
})

describe('snapToNearest', () => {
  const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]

  it('snaps exactly to a present value', () => {
    expect(snapToNearest(5.99, fixedValues)).toBe(5.99)
  })

  it('snaps to nearest lower value', () => {
    expect(snapToNearest(3.0, fixedValues)).toBe(1.99)
  })

  it('snaps to nearest upper value', () => {
    expect(snapToNearest(4.5, fixedValues)).toBe(5.99)
  })

  it('snaps to first value when below range', () => {
    expect(snapToNearest(0, fixedValues)).toBe(1.99)
  })

  it('snaps to last value when above range', () => {
    expect(snapToNearest(100, fixedValues)).toBe(70.99)
  })

  it('snaps to midpoint: ties go to the first (lower) value', () => {
    // exactly equidistant between 1.99 and 5.99 (3.99) → first element wins (strict <)
    expect(snapToNearest(3.99, fixedValues)).toBe(1.99)
    // just above midpoint → closer to 5.99
    expect(snapToNearest(4.0, fixedValues)).toBe(5.99)
  })

  it('works with a single-element array', () => {
    expect(snapToNearest(42, [7])).toBe(7)
  })
})

describe('valueToPercent', () => {
  it('returns 0 for min value', () => {
    expect(valueToPercent(0, 0, 100)).toBe(0)
  })

  it('returns 100 for max value', () => {
    expect(valueToPercent(100, 0, 100)).toBe(100)
  })

  it('returns 50 for midpoint', () => {
    expect(valueToPercent(50, 0, 100)).toBe(50)
  })

  it('returns 0 when min equals max (no division by zero)', () => {
    expect(valueToPercent(5, 5, 5)).toBe(0)
  })

  it('works with non-zero min', () => {
    expect(valueToPercent(30, 10, 110)).toBe(20)
  })

  it('works with decimal bounds', () => {
    expect(valueToPercent(1.99, 1.99, 70.99)).toBeCloseTo(0, 5)
    expect(valueToPercent(70.99, 1.99, 70.99)).toBeCloseTo(100, 5)
  })
})

describe('percentToValue', () => {
  it('returns min for 0%', () => {
    expect(percentToValue(0, 0, 100)).toBe(0)
  })

  it('returns max for 100%', () => {
    expect(percentToValue(100, 0, 100)).toBe(100)
  })

  it('returns midpoint for 50%', () => {
    expect(percentToValue(50, 0, 100)).toBe(50)
  })

  it('works with non-zero min', () => {
    expect(percentToValue(50, 10, 110)).toBe(60)
  })

  it('is the inverse of valueToPercent', () => {
    const value = 37.5
    const percent = valueToPercent(value, 0, 100)
    expect(percentToValue(percent, 0, 100)).toBeCloseTo(value, 10)
  })
})

describe('roundToTwo', () => {
  it('rounds to 2 decimal places', () => {
    expect(roundToTwo(1.234)).toBe(1.23)
  })

  it('rounds up correctly', () => {
    expect(roundToTwo(1.235)).toBe(1.24)
  })

  it('leaves integers unchanged', () => {
    expect(roundToTwo(42)).toBe(42)
  })

  it('handles already-rounded values', () => {
    expect(roundToTwo(3.14)).toBe(3.14)
  })

  it('handles negative values', () => {
    expect(roundToTwo(-1.567)).toBe(-1.57)
  })
})

describe('computeNewValue — normal mode (fixedValues = null)', () => {
  it('returns clamped min value for target=min', () => {
    const result = computeNewValue(50, 0, 100, 'min', 80, null)
    expect(result).toBe(50)
  })

  it('returns clamped max value for target=max', () => {
    const result = computeNewValue(50, 0, 100, 'max', 20, null)
    expect(result).toBe(50)
  })

  it('clamps min to minBound', () => {
    const result = computeNewValue(0, 0, 100, 'min', 80, null)
    expect(result).toBe(0)
  })

  it('clamps max to maxBound', () => {
    const result = computeNewValue(100, 0, 100, 'max', 20, null)
    expect(result).toBe(100)
  })

  it('prevents min from reaching or crossing max (gap 0.01)', () => {
    const result = computeNewValue(100, 0, 100, 'min', 60, null)
    expect(result).toBeLessThan(60)
    expect(result).toBeCloseTo(59.99, 2)
  })

  it('prevents max from reaching or crossing min (gap 0.01)', () => {
    const result = computeNewValue(0, 0, 100, 'max', 40, null)
    expect(result).toBeGreaterThan(40)
    expect(result).toBeCloseTo(40.01, 2)
  })

  it('returns correct value for arbitrary percent', () => {
    // 25% of 0-100 = 25
    const result = computeNewValue(25, 0, 100, 'min', 80, null)
    expect(result).toBe(25)
  })
})

describe('computeNewValue — fixed mode', () => {
  const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]

  it('snaps to nearest fixed value for min', () => {
    // 0% of 1.99-70.99 ≈ 1.99 → snapped is 1.99
    const result = computeNewValue(0, 1.99, 70.99, 'min', 70.99, fixedValues)
    expect(result).toBe(1.99)
  })

  it('snaps to nearest fixed value for max', () => {
    // 100% of 1.99-70.99 ≈ 70.99 → snapped is 70.99
    const result = computeNewValue(100, 1.99, 70.99, 'max', 1.99, fixedValues)
    expect(result).toBe(70.99)
  })

  it('returns null if min would cross max (snapped >= otherVal)', () => {
    // drag min toward max (otherVal = 10.99), snap lands at 10.99 → null (not less than)
    const result = computeNewValue(20, 1.99, 70.99, 'min', 10.99, fixedValues)
    expect(result).toBeNull()
  })

  it('returns null if max would cross min (snapped <= otherVal)', () => {
    // drag max far left toward min (otherVal = 10.99), snap lands at 10.99 → null (not greater than)
    const result = computeNewValue(13, 1.99, 70.99, 'max', 10.99, fixedValues)
    expect(result).toBeNull()
  })

  it('returns valid snapped value when no crossing', () => {
    // ~20% of 1.99-70.99 ≈ 16.78 → snapped to 10.99 (nearest), otherVal = 30.99
    const result = computeNewValue(20, 1.99, 70.99, 'min', 30.99, fixedValues)
    expect(result).toBe(10.99)
  })
})
