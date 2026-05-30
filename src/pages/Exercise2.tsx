import { useEffect, useState } from 'react'
import Range from '@/components/Range/Range'

type FixedData = { rangeValues: number[] }

const Exercise2 = () => {
  const [data, setData] = useState<FixedData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/range-fixed')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<FixedData>
      })
      .then(setData)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unknown error'))
  }, [])

  return (
    <div className="w-full max-w-[700px] flex flex-col items-center gap-8">
      <h1 className="text-[1.6rem] font-bold text-[#1a1a2e] text-center">
        Exercise 2 — Fixed Values Range
      </h1>
      <p className="text-[0.95rem] text-[#666666] text-center max-w-[480px] leading-relaxed">
        Bullets snap to allowed values only: 1.99, 5.99, 10.99, 30.99, 50.99, 70.99.
        Labels are read-only.
      </p>

      {error && (
        <p className="text-[#c0392b] bg-[#fdecea] py-3 px-5 rounded-lg text-sm">
          Failed to load range: {error}
        </p>
      )}

      {!data && !error && <p className="text-[#999999] italic">Loading…</p>}

      {data && (
        <div className="w-full bg-white rounded-2xl py-12 px-10 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          <Range mode="fixed" values={data.rangeValues} />
        </div>
      )}
    </div>
  )
}

export default Exercise2
