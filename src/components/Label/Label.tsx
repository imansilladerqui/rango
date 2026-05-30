import type { LabelProps } from './Label.types'
import { useLabel } from '@/hooks/useLabel'

const Label = ({ value, editable, onCommit, testId }: LabelProps) => {
  const { editing, inputVal, setInputVal, inputRef, displayValue, startEdit, commit, handleKeyDown } =
    useLabel(value, editable, onCommit)

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="text-base font-semibold text-[#333333] min-w-[3rem] max-w-[5rem] text-center border-0 border-b-2 border-[#e94560] outline-none bg-transparent pb-px"
        type="number"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        data-testid={testId}
      />
    )
  }

  return (
    <span
      className={`text-base font-semibold text-[#333333] min-w-[3rem] text-center whitespace-nowrap${
        editable
          ? ' cursor-pointer border-b-2 border-dashed border-[#cccccc] pb-px transition-colors duration-200 hover:text-[#e94560] hover:border-[#e94560]'
          : ''
      }`}
      onClick={startEdit}
      data-testid={testId}
    >
      {displayValue}
    </span>
  )
}

export default Label
