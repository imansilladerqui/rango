import type { RangeProps } from './Range.types'
import { useRange } from '@/hooks/useRange'
import Bullet from '@/components/Bullet/Bullet'
import Label from '@/components/Label/Label'

const Range = (props: RangeProps) => {
  const {
    isFixed,
    trackRef,
    minVal,
    maxVal,
    minPercent,
    maxPercent,
    startDrag,
    handleLabelCommit,
  } = useRange(props)

  return (
    <div className="flex items-center gap-6 w-full max-w-[600px] select-none" data-testid="range">
      <Label
        value={minVal}
        editable={!isFixed}
        onCommit={(v) => handleLabelCommit('min', v)}
        testId="label-min"
      />

      <div
        className="relative flex-1 h-1 bg-[#dddddd] rounded-sm"
        ref={trackRef}
        data-testid="track"
      >
        <div
          className="absolute top-0 h-full bg-[#e94560] rounded-sm pointer-events-none"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        <Bullet percent={minPercent} onMouseDown={startDrag('min')} testId="bullet-min" />
        <Bullet percent={maxPercent} onMouseDown={startDrag('max')} testId="bullet-max" />
      </div>

      <Label
        value={maxVal}
        editable={!isFixed}
        onCommit={(v) => handleLabelCommit('max', v)}
        testId="label-max"
      />
    </div>
  )
}

export default Range
