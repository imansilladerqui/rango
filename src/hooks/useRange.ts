import { useState, useRef, useCallback, useEffect } from 'react'
import type { RangeProps, DragTarget } from '@/components/Range/Range.types'
import { clamp, valueToPercent, roundToTwo, computeNewValue } from '@/utils/rangeUtils'

export const useRange = (props: RangeProps) => {
  const { minBound, maxBound, allValues, isFixed } =
    props.mode === 'fixed'
      ? { minBound: props.values[0], maxBound: props.values[props.values.length - 1], allValues: props.values, isFixed: true }
      : { minBound: props.min, maxBound: props.max, allValues: null, isFixed: false }

  const [minVal, setMinVal] = useState<number>(minBound)
  const [maxVal, setMaxVal] = useState<number>(maxBound)

  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<DragTarget>(null)

  useEffect(() => {
    setMinVal(minBound)
    setMaxVal(maxBound)
  }, [minBound, maxBound])

  const getPercentFromEvent = useCallback((clientX: number): number => {
    const track = trackRef.current
    if (!track) return 0
    const rect = track.getBoundingClientRect()
    return clamp(((clientX - rect.left) / rect.width) * 100, 0, 100)
  }, [])

  const applyDrag = useCallback(
    (clientX: number) => {
      const target = dragging.current
      if (!target) return
      const percent = getPercentFromEvent(clientX)
      const otherVal = target === 'min' ? maxVal : minVal
      const newVal = computeNewValue(percent, minBound, maxBound, target, otherVal, allValues)
      if (newVal === null) return
      if (target === 'min') setMinVal(newVal)
      else setMaxVal(newVal)
    },
    [getPercentFromEvent, allValues, minBound, maxBound, minVal, maxVal],
  )

  const applyDragRef = useRef(applyDrag)
  useEffect(() => { applyDragRef.current = applyDrag }, [applyDrag])

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (dragging.current) applyDragRef.current(e.clientX)
  }, [])

  const onMouseUp = useCallback(() => {
    if (!dragging.current) return
    dragging.current = null
    document.body.style.cursor = ''
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }, [onMouseMove])

  const startDrag = useCallback(
    (target: DragTarget) => (e: React.MouseEvent) => {
      e.preventDefault()
      dragging.current = target
      document.body.style.cursor = 'grabbing'
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [onMouseMove, onMouseUp],
  )

  const handleLabelCommit = (target: 'min' | 'max', raw: string) => {
    const parsed = parseFloat(raw)
    if (isNaN(parsed)) return
    if (target === 'min') {
      setMinVal(clamp(roundToTwo(parsed), minBound, maxVal - 0.01))
    } else {
      setMaxVal(clamp(roundToTwo(parsed), minVal + 0.01, maxBound))
    }
  }

  return {
    isFixed,
    trackRef,
    minVal,
    maxVal,
    minPercent: valueToPercent(minVal, minBound, maxBound),
    maxPercent: valueToPercent(maxVal, minBound, maxBound),
    startDrag,
    handleLabelCommit,
  }
}
