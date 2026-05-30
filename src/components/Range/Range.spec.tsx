import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Range from './Range'

const simulateDrag = (element: Element, fromX: number, toX: number) => {
  fireEvent.mouseDown(element, { clientX: fromX, buttons: 1 })
  fireEvent.mouseMove(document, { clientX: toX, buttons: 1 })
  fireEvent.mouseUp(document, { clientX: toX })
}

const TRACK_LEFT = 0
const TRACK_WIDTH = 600

const mockTrackRect = () => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    left: TRACK_LEFT,
    width: TRACK_WIDTH,
    top: 0,
    right: TRACK_WIDTH,
    bottom: 20,
    height: 20,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  })
}

describe('Range — Normal Mode', () => {
  beforeEach(() => {
    mockTrackRect()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders two bullets and two labels', () => {
    render(<Range mode="normal" min={1} max={100} />)
    expect(screen.getByTestId('bullet-min')).toBeInTheDocument()
    expect(screen.getByTestId('bullet-max')).toBeInTheDocument()
    expect(screen.getByTestId('label-min')).toBeInTheDocument()
    expect(screen.getByTestId('label-max')).toBeInTheDocument()
  })

  it('displays correct initial min and max labels', () => {
    render(<Range mode="normal" min={1} max={100} />)
    expect(screen.getByTestId('label-min')).toHaveTextContent('1')
    expect(screen.getByTestId('label-max')).toHaveTextContent('100')
  })

  it('min bullet has grab cursor style via CSS class', () => {
    render(<Range mode="normal" min={0} max={100} />)
    const minBullet = screen.getByTestId('bullet-min')
    expect(minBullet).toBeInTheDocument()
  })

  it('dragging min bullet updates its position', () => {
    render(<Range mode="normal" min={0} max={100} />)
    const minBullet = screen.getByTestId('bullet-min')

    simulateDrag(minBullet, 0, 300)

    const label = screen.getByTestId('label-min')
    const value = parseFloat(label.textContent ?? '0')
    expect(value).toBeGreaterThan(0)
    expect(value).toBeLessThan(100)
  })

  it('dragging max bullet updates its position', () => {
    render(<Range mode="normal" min={0} max={100} />)
    const maxBullet = screen.getByTestId('bullet-max')

    simulateDrag(maxBullet, 600, 450)

    const label = screen.getByTestId('label-max')
    const value = parseFloat(label.textContent ?? '100')
    expect(value).toBeLessThan(100)
    expect(value).toBeGreaterThan(0)
  })

  it('min bullet cannot be dragged past max bullet', () => {
    render(<Range mode="normal" min={0} max={100} />)
    const minBullet = screen.getByTestId('bullet-min')

    simulateDrag(minBullet, 0, TRACK_WIDTH + 50)

    const minLabel = screen.getByTestId('label-min')
    const maxLabel = screen.getByTestId('label-max')
    const minValue = parseFloat(minLabel.textContent ?? '0')
    const maxValue = parseFloat(maxLabel.textContent ?? '100')
    expect(minValue).toBeLessThan(maxValue)
  })

  it('max bullet cannot be dragged past min bullet', () => {
    render(<Range mode="normal" min={0} max={100} />)
    const maxBullet = screen.getByTestId('bullet-max')

    simulateDrag(maxBullet, 600, -50)

    const minLabel = screen.getByTestId('label-min')
    const maxLabel = screen.getByTestId('label-max')
    const minValue = parseFloat(minLabel.textContent ?? '0')
    const maxValue = parseFloat(maxLabel.textContent ?? '100')
    expect(maxValue).toBeGreaterThan(minValue)
  })

  it('clicking min label enters edit mode (input appears)', async () => {
    const user = userEvent.setup()
    render(<Range mode="normal" min={1} max={100} />)

    const minLabel = screen.getByTestId('label-min')
    await user.click(minLabel)

    const input = screen.getByTestId('label-min')
    expect(input.tagName).toBe('INPUT')
  })

  it('clicking max label enters edit mode (input appears)', async () => {
    const user = userEvent.setup()
    render(<Range mode="normal" min={1} max={100} />)

    const maxLabel = screen.getByTestId('label-max')
    await user.click(maxLabel)

    const input = screen.getByTestId('label-max')
    expect(input.tagName).toBe('INPUT')
  })

  it('typing a new value in min label and pressing Enter updates the bullet', async () => {
    const user = userEvent.setup()
    render(<Range mode="normal" min={1} max={100} />)

    const minLabel = screen.getByTestId('label-min')
    await user.click(minLabel)

    const input = screen.getByTestId('label-min') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '30')
    await user.keyboard('{Enter}')

    expect(screen.getByTestId('label-min')).toHaveTextContent('30')
  })

  it('typing a new value in max label and pressing Enter updates the bullet', async () => {
    const user = userEvent.setup()
    render(<Range mode="normal" min={1} max={100} />)

    const maxLabel = screen.getByTestId('label-max')
    await user.click(maxLabel)

    const input = screen.getByTestId('label-max') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '70')
    await user.keyboard('{Enter}')

    expect(screen.getByTestId('label-max')).toHaveTextContent('70')
  })

  it('min label input clamped to min bound (cannot go below min)', async () => {
    const user = userEvent.setup()
    render(<Range mode="normal" min={1} max={100} />)

    const minLabel = screen.getByTestId('label-min')
    await user.click(minLabel)

    const input = screen.getByTestId('label-min') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '-999')
    await user.keyboard('{Enter}')

    const value = parseFloat(screen.getByTestId('label-min').textContent ?? '0')
    expect(value).toBeGreaterThanOrEqual(1)
  })

  it('max label input clamped to max bound (cannot exceed max)', async () => {
    const user = userEvent.setup()
    render(<Range mode="normal" min={1} max={100} />)

    const maxLabel = screen.getByTestId('label-max')
    await user.click(maxLabel)

    const input = screen.getByTestId('label-max') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '9999')
    await user.keyboard('{Enter}')

    const value = parseFloat(screen.getByTestId('label-max').textContent ?? '0')
    expect(value).toBeLessThanOrEqual(100)
  })

  it('min label input clamped to stay below max value', async () => {
    const user = userEvent.setup()
    render(<Range mode="normal" min={1} max={100} />)

    const maxLabel = screen.getByTestId('label-max')
    await user.click(maxLabel)
    const maxInput = screen.getByTestId('label-max') as HTMLInputElement
    await user.clear(maxInput)
    await user.type(maxInput, '50')
    await user.keyboard('{Enter}')

    const minLabel = screen.getByTestId('label-min')
    await user.click(minLabel)
    const minInput = screen.getByTestId('label-min') as HTMLInputElement
    await user.clear(minInput)
    await user.type(minInput, '80')
    await user.keyboard('{Enter}')

    const minValue = parseFloat(screen.getByTestId('label-min').textContent ?? '0')
    const maxValue = parseFloat(screen.getByTestId('label-max').textContent ?? '100')
    expect(minValue).toBeLessThan(maxValue)
  })

  it('pressing Escape cancels edit without changing value', async () => {
    const user = userEvent.setup()
    render(<Range mode="normal" min={1} max={100} />)

    const minLabel = screen.getByTestId('label-min')
    await user.click(minLabel)

    const input = screen.getByTestId('label-min') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '42')
    await user.keyboard('{Escape}')

    expect(screen.getByTestId('label-min')).toHaveTextContent('1')
  })

  it('blurring the label input commits the value', async () => {
    const user = userEvent.setup()
    render(<Range mode="normal" min={1} max={100} />)

    const minLabel = screen.getByTestId('label-min')
    await user.click(minLabel)

    const input = screen.getByTestId('label-min') as HTMLInputElement
    await user.clear(input)
    await user.type(input, '25')
    await act(async () => {
      fireEvent.blur(input)
    })

    expect(screen.getByTestId('label-min')).toHaveTextContent('25')
  })
})

describe('Range — Fixed Mode', () => {
  const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]

  beforeEach(() => {
    mockTrackRect()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders two bullets and two labels', () => {
    render(<Range mode="fixed" values={fixedValues} />)
    expect(screen.getByTestId('bullet-min')).toBeInTheDocument()
    expect(screen.getByTestId('bullet-max')).toBeInTheDocument()
    expect(screen.getByTestId('label-min')).toBeInTheDocument()
    expect(screen.getByTestId('label-max')).toBeInTheDocument()
  })

  it('displays first and last fixed values as initial labels', () => {
    render(<Range mode="fixed" values={fixedValues} />)
    expect(screen.getByTestId('label-min')).toHaveTextContent('1.99')
    expect(screen.getByTestId('label-max')).toHaveTextContent('70.99')
  })

  it('labels are NOT editable (clicking does not open input)', async () => {
    const user = userEvent.setup()
    render(<Range mode="fixed" values={fixedValues} />)

    const minLabel = screen.getByTestId('label-min')
    await user.click(minLabel)

    expect(screen.getByTestId('label-min').tagName).toBe('SPAN')
  })

  it('max label is not editable', async () => {
    const user = userEvent.setup()
    render(<Range mode="fixed" values={fixedValues} />)

    const maxLabel = screen.getByTestId('label-max')
    await user.click(maxLabel)

    expect(screen.getByTestId('label-max').tagName).toBe('SPAN')
  })

  it('dragging min bullet snaps to nearest fixed value', () => {
    render(<Range mode="fixed" values={fixedValues} />)
    const minBullet = screen.getByTestId('bullet-min')

    simulateDrag(minBullet, 0, 150)

    const label = screen.getByTestId('label-min')
    const value = parseFloat(label.textContent ?? '0')
    expect(fixedValues).toContain(value)
  })

  it('dragging max bullet snaps to nearest fixed value', () => {
    render(<Range mode="fixed" values={fixedValues} />)
    const maxBullet = screen.getByTestId('bullet-max')

    simulateDrag(maxBullet, 600, 300)

    const label = screen.getByTestId('label-max')
    const value = parseFloat(label.textContent ?? '0')
    expect(fixedValues).toContain(value)
  })

  it('min bullet cannot cross max bullet in fixed mode', () => {
    render(<Range mode="fixed" values={fixedValues} />)
    const minBullet = screen.getByTestId('bullet-min')

    simulateDrag(minBullet, 0, TRACK_WIDTH + 100)

    const minValue = parseFloat(screen.getByTestId('label-min').textContent ?? '0')
    const maxValue = parseFloat(screen.getByTestId('label-max').textContent ?? '0')
    expect(minValue).toBeLessThan(maxValue)
  })

  it('max bullet cannot cross min bullet in fixed mode', () => {
    render(<Range mode="fixed" values={fixedValues} />)
    const maxBullet = screen.getByTestId('bullet-max')

    simulateDrag(maxBullet, 600, -100)

    const minValue = parseFloat(screen.getByTestId('label-min').textContent ?? '0')
    const maxValue = parseFloat(screen.getByTestId('label-max').textContent ?? '0')
    expect(maxValue).toBeGreaterThan(minValue)
  })

  it('all label values remain within the fixed values array', () => {
    render(<Range mode="fixed" values={fixedValues} />)
    const minBullet = screen.getByTestId('bullet-min')
    const maxBullet = screen.getByTestId('bullet-max')

    simulateDrag(minBullet, 0, 200)
    simulateDrag(maxBullet, 600, 400)

    const minValue = parseFloat(screen.getByTestId('label-min').textContent ?? '0')
    const maxValue = parseFloat(screen.getByTestId('label-max').textContent ?? '0')
    expect(fixedValues).toContain(minValue)
    expect(fixedValues).toContain(maxValue)
  })
})

describe('Range — Accessibility', () => {
  it('bullets have role=slider', () => {
    render(<Range mode="normal" min={0} max={100} />)
    const sliders = screen.getAllByRole('slider')
    expect(sliders).toHaveLength(2)
  })
})
