import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { renderWithProviders } from '@/test-utils'
import Exercise1 from './Exercise1'

const server = setupServer(http.get('/api/range', () => HttpResponse.json({ min: 1, max: 100 })))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Exercise1 page', () => {
  it('shows loading state initially', () => {
    renderWithProviders(<Exercise1 />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders the Range component after data loads', async () => {
    renderWithProviders(<Exercise1 />)
    await waitFor(() => expect(screen.getByTestId('range')).toBeInTheDocument())
  })

  it('displays min label with value 1 from API', async () => {
    renderWithProviders(<Exercise1 />)
    await waitFor(() => expect(screen.getByTestId('label-min')).toHaveTextContent('1'))
  })

  it('displays max label with value 100 from API', async () => {
    renderWithProviders(<Exercise1 />)
    await waitFor(() => expect(screen.getByTestId('label-max')).toHaveTextContent('100'))
  })

  it('renders two draggable bullets', async () => {
    renderWithProviders(<Exercise1 />)
    await waitFor(() => {
      expect(screen.getByTestId('bullet-min')).toBeInTheDocument()
      expect(screen.getByTestId('bullet-max')).toBeInTheDocument()
    })
  })

  it('renders min label as editable (exercise 1 requirement)', async () => {
    renderWithProviders(<Exercise1 />)
    await waitFor(() => {
      const label = screen.getByTestId('label-min')
      expect(label.tagName).toBe('SPAN')
      expect(label).toHaveClass('cursor-pointer')
    })
  })

  it('shows error message when API fails', async () => {
    server.use(http.get('/api/range', () => HttpResponse.error()))
    renderWithProviders(<Exercise1 />)
    await waitFor(() => expect(screen.getByText(/failed to load range/i)).toBeInTheDocument())
  })
})
