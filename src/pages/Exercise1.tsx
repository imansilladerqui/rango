import { useEffect, useState } from 'react'
import Range from '@/components/Range/Range'

type RangeData = { min: number; max: number }

const Exercise1 = () => {
  const [data, setData] = useState<RangeData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/range')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<RangeData>
      })
      .then(setData)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unknown error'))
  }, [])

  return (
    <div className="w-full max-w-[700px] flex flex-col items-center gap-8">
      <h1 className="text-[1.6rem] font-bold text-[#1a1a2e] text-center">
        Exercise 1 — Normal Range
      </h1>
      <p className="text-[0.95rem] text-[#666666] text-center max-w-[480px] leading-relaxed">
        Drag the bullets or click the currency labels to set a custom value.
      </p>

      {error && (
        <p className="text-[#c0392b] bg-[#fdecea] py-3 px-5 rounded-lg text-sm">
          Failed to load range: {error}
        </p>
      )}

      {!data && !error && <p className="text-[#999999] italic">Loading…</p>}

      {data && (
        <div className="w-full bg-white rounded-2xl py-12 px-10 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          <Range mode="normal" min={data.min} max={data.max} />
        </div>
      )}
    </div>
  )
}

export default Exercise1
