export type RangeData = { min: number; max: number }
export type FixedData = { rangeValues: number[] }

const toJson = <T>(res: Response): Promise<T> => {
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export const fetchRange = (): Promise<RangeData> =>
  fetch('/api/range').then((res) => toJson<RangeData>(res))

export const fetchRangeFixed = (): Promise<FixedData> =>
  fetch('/api/range-fixed').then((res) => toJson<FixedData>(res))
