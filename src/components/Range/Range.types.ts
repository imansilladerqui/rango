export type NormalProps = {
  mode: 'normal'
  min: number
  max: number
}

export type FixedProps = {
  mode: 'fixed'
  values: number[]
}

export type RangeProps = NormalProps | FixedProps

export type DragTarget = 'min' | 'max' | null
