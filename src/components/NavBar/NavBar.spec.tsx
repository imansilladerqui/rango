import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NavBar from './NavBar'

const NAV_ITEMS = [
  { to: '/exercise1', label: 'Exercise 1' },
  { to: '/exercise2', label: 'Exercise 2' },
]

const FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true }

const renderNavBar = (initialEntry = '/') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]} future={FUTURE}>
      <NavBar items={NAV_ITEMS} />
    </MemoryRouter>,
  )

describe('NavBar', () => {
  it('renders a nav element', () => {
    renderNavBar()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders a link for each item', () => {
    renderNavBar()
    expect(screen.getAllByRole('link')).toHaveLength(NAV_ITEMS.length)
  })

  it('renders the correct label text for each item', () => {
    renderNavBar()
    expect(screen.getByText('Exercise 1')).toBeInTheDocument()
    expect(screen.getByText('Exercise 2')).toBeInTheDocument()
  })

  it('each link points to the correct href', () => {
    renderNavBar()
    expect(screen.getByText('Exercise 1').closest('a')).toHaveAttribute('href', '/exercise1')
    expect(screen.getByText('Exercise 2').closest('a')).toHaveAttribute('href', '/exercise2')
  })

  it('active link has the active class when its route is current', () => {
    renderNavBar('/exercise1')
    const activeLink = screen.getByText('Exercise 1').closest('a')
    expect(activeLink?.className).toContain('text-white')
    expect(activeLink?.className).toContain('border-[#e94560]')
  })

  it('inactive link does not have the active class', () => {
    renderNavBar('/exercise1')
    const inactiveLink = screen.getByText('Exercise 2').closest('a')
    expect(inactiveLink?.className).toContain('text-[#aaaaaa]')
    expect(inactiveLink?.className).toContain('border-transparent')
  })

  it('renders nothing when items array is empty', () => {
    render(
      <MemoryRouter future={FUTURE}>
        <NavBar items={[]} />
      </MemoryRouter>,
    )
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('renders correctly with a single item', () => {
    render(
      <MemoryRouter future={FUTURE}>
        <NavBar items={[{ to: '/only', label: 'Only' }]} />
      </MemoryRouter>,
    )
    expect(screen.getAllByRole('link')).toHaveLength(1)
    expect(screen.getByText('Only')).toBeInTheDocument()
  })
})
