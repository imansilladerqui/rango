import Range from '@/components/Range/Range'
import { useRangeQuery } from '@/hooks/useRangeQuery'

const Exercise1 = () => {
  const { data, error, isLoading } = useRangeQuery()

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
          Failed to load range: {error.message}
        </p>
      )}

      {isLoading && <p className="text-[#999999] italic">Loading…</p>}

      {data && (
        <div className="w-full bg-white rounded-2xl py-12 px-10 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          <Range mode="normal" min={data.min} max={data.max} />
        </div>
      )}
    </div>
  )
}

export default Exercise1
