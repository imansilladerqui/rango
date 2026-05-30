import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Label from './Label'

describe('Label — display', () => {
  it('renders as a span when not editing', () => {
    render(<Label value={50} editable={false} onCommit={vi.fn()} testId="lbl" />)
    expect(screen.getByTestId('lbl').tagName).toBe('SPAN')
  })

  it('displays integer values without decimals', () => {
    render(<Label value={42} editable={false} onCommit={vi.fn()} testId="lbl" />)
    expect(screen.getByTestId('lbl')).toHaveTextContent('42')
  })

  it('displays decimal values with two decimal places', () => {
    render(<Label value={5.99} editable={false} onCommit={vi.fn()} testId="lbl" />)
    expect(screen.getByTestId('lbl')).toHaveTextContent('5.99')
  })

  it('applies testId as data-testid', () => {
    render(<Label value={1} editable={false} onCommit={vi.fn()} testId="my-label" />)
    expect(screen.getByTestId('my-label')).toBeInTheDocument()
  })
})

describe('Label — editable', () => {
  it('clicking an editable label switches it to an input', async () => {
    const user = userEvent.setup()
    render(<Label value={10} editable={true} onCommit={vi.fn()} testId="lbl" />)
    await user.click(screen.getByTestId('lbl'))
    expect(screen.getByTestId('lbl').tagName).toBe('INPUT')
  })

  it('input is pre-filled with the current display value', async () => {
    const user = userEvent.setup()
    render(<Label value={25} editable={true} onCommit={vi.fn()} testId="lbl" />)
    await user.click(screen.getByTestId('lbl'))
    expect((screen.getByTestId('lbl') as HTMLInputElement).value).toBe('25')
  })

  it('pressing Enter calls onCommit with the typed value', async () => {
    const onCommit = vi.fn()
    const user = userEvent.setup()
    render(<Label value={10} editable={true} onCommit={onCommit} testId="lbl" />)
    await user.click(screen.getByTestId('lbl'))
    const input = screen.getByTestId('lbl') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '77')
    await user.keyboard('{Enter}')
    expect(onCommit).toHaveBeenCalledWith('77')
  })

  it('pressing Enter returns to span mode', async () => {
    const user = userEvent.setup()
    render(<Label value={10} editable={true} onCommit={vi.fn()} testId="lbl" />)
    await user.click(screen.getByTestId('lbl'))
    await user.keyboard('{Enter}')
    expect(screen.getByTestId('lbl').tagName).toBe('SPAN')
  })

  it('pressing Escape cancels without calling onCommit', async () => {
    const onCommit = vi.fn()
    const user = userEvent.setup()
    render(<Label value={10} editable={true} onCommit={onCommit} testId="lbl" />)
    await user.click(screen.getByTestId('lbl'))
    const input = screen.getByTestId('lbl') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '99')
    await user.keyboard('{Escape}')
    expect(onCommit).not.toHaveBeenCalled()
  })

  it('pressing Escape returns to span mode', async () => {
    const user = userEvent.setup()
    render(<Label value={10} editable={true} onCommit={vi.fn()} testId="lbl" />)
    await user.click(screen.getByTestId('lbl'))
    await user.keyboard('{Escape}')
    expect(screen.getByTestId('lbl').tagName).toBe('SPAN')
  })

  it('blurring the input calls onCommit', async () => {
    const onCommit = vi.fn()
    const user = userEvent.setup()
    render(<Label value={10} editable={true} onCommit={onCommit} testId="lbl" />)
    await user.click(screen.getByTestId('lbl'))
    const input = screen.getByTestId('lbl') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '55')
    await act(async () => { fireEvent.blur(input) })
    expect(onCommit).toHaveBeenCalledWith('55')
  })

  it('blurring the input returns to span mode', async () => {
    const user = userEvent.setup()
    render(<Label value={10} editable={true} onCommit={vi.fn()} testId="lbl" />)
    await user.click(screen.getByTestId('lbl'))
    await act(async () => { fireEvent.blur(screen.getByTestId('lbl')) })
    expect(screen.getByTestId('lbl').tagName).toBe('SPAN')
  })
})

describe('Label — non-editable', () => {
  it('clicking a non-editable label does NOT open an input', async () => {
    const user = userEvent.setup()
    render(<Label value={10} editable={false} onCommit={vi.fn()} testId="lbl" />)
    await user.click(screen.getByTestId('lbl'))
    expect(screen.getByTestId('lbl').tagName).toBe('SPAN')
  })

  it('never calls onCommit when not editable', async () => {
    const onCommit = vi.fn()
    const user = userEvent.setup()
    render(<Label value={10} editable={false} onCommit={onCommit} testId="lbl" />)
    await user.click(screen.getByTestId('lbl'))
    expect(onCommit).not.toHaveBeenCalled()
  })
})
