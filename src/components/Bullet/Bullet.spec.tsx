import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Bullet from './Bullet'

describe('Bullet', () => {
  it('renders with role slider', () => {
    render(<Bullet percent={50} onMouseDown={vi.fn()} />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('sets left style from percent prop', () => {
    render(<Bullet percent={30} onMouseDown={vi.fn()} testId="bullet" />)
    expect(screen.getByTestId('bullet')).toHaveStyle({ left: '30%' })
  })

  it('sets aria-valuenow as the rounded percent', () => {
    render(<Bullet percent={42.7} onMouseDown={vi.fn()} />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '43')
  })

  it('sets aria-valuemin to 0 and aria-valuemax to 100', () => {
    render(<Bullet percent={50} onMouseDown={vi.fn()} />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '100')
  })

  it('calls onMouseDown when pressed', () => {
    const onMouseDown = vi.fn()
    render(<Bullet percent={50} onMouseDown={onMouseDown} />)
    fireEvent.mouseDown(screen.getByRole('slider'))
    expect(onMouseDown).toHaveBeenCalledTimes(1)
  })

  it('applies testId as data-testid', () => {
    render(<Bullet percent={0} onMouseDown={vi.fn()} testId="my-bullet" />)
    expect(screen.getByTestId('my-bullet')).toBeInTheDocument()
  })

  it('renders without testId (optional prop)', () => {
    render(<Bullet percent={0} onMouseDown={vi.fn()} />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('reflects 0% position', () => {
    render(<Bullet percent={0} onMouseDown={vi.fn()} testId="b" />)
    expect(screen.getByTestId('b')).toHaveStyle({ left: '0%' })
  })

  it('reflects 100% position', () => {
    render(<Bullet percent={100} onMouseDown={vi.fn()} testId="b" />)
    expect(screen.getByTestId('b')).toHaveStyle({ left: '100%' })
  })
})
