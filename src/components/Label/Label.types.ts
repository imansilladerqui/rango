export type LabelProps = {
  value: number
  editable: boolean
  onCommit: (raw: string) => void
  testId?: string
}
