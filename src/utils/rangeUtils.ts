export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value))

export const snapToNearest = (value: number, values: number[]): number =>
  values.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev))

export const valueToPercent = (value: number, min: number, max: number): number => {
  if (max === min) return 0
  return ((value - min) / (max - min)) * 100
}

export const percentToValue = (percent: number, min: number, max: number): number =>
  min + (percent / 100) * (max - min)

export const roundToTwo = (value: number): number => Math.round(value * 100) / 100

export const computeNewValue = (
  percent: number,
  minBound: number,
  maxBound: number,
  target: 'min' | 'max',
  otherVal: number,
  fixedValues: number[] | null,
): number | null => {
  const raw = percentToValue(percent, minBound, maxBound)
  if (fixedValues) {
    const snapped = snapToNearest(raw, fixedValues)
    return (target === 'min' ? snapped < otherVal : snapped > otherVal) ? snapped : null
  }
  const rounded = roundToTwo(raw)
  return target === 'min'
    ? clamp(rounded, minBound, roundToTwo(otherVal - 0.01))
    : clamp(rounded, roundToTwo(otherVal + 0.01), maxBound)
}
