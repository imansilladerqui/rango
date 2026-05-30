import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import Exercise2 from './Exercise2'

const FIXED_VALUES = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99]

const server = setupServer(
  http.get('/api/range-fixed', () => HttpResponse.json({ rangeValues: FIXED_VALUES })),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderExercise2 = () =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Exercise2 />
    </MemoryRouter>,
  )

describe('Exercise2 page', () => {
  it('shows loading state initially', () => {
    renderExercise2()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders the Range component after data loads', async () => {
    renderExercise2()
    await waitFor(() => expect(screen.getByTestId('range')).toBeInTheDocument())
  })

  it('displays first fixed value (1.99) as min label from API', async () => {
    renderExercise2()
    await waitFor(() => expect(screen.getByTestId('label-min')).toHaveTextContent('1.99'))
  })

  it('displays last fixed value (70.99) as max label from API', async () => {
    renderExercise2()
    await waitFor(() => expect(screen.getByTestId('label-max')).toHaveTextContent('70.99'))
  })

  it('renders two draggable bullets', async () => {
    renderExercise2()
    await waitFor(() => {
      expect(screen.getByTestId('bullet-min')).toBeInTheDocument()
      expect(screen.getByTestId('bullet-max')).toBeInTheDocument()
    })
  })

  it('labels are NOT editable in fixed mode (exercise 2 requirement)', async () => {
    const user = userEvent.setup()
    renderExercise2()

    await waitFor(() => expect(screen.getByTestId('label-min')).toBeInTheDocument())

    const minLabel = screen.getByTestId('label-min')
    await user.click(minLabel)

    // Should remain a SPAN (not turn into an INPUT)
    expect(screen.getByTestId('label-min').tagName).toBe('SPAN')
  })

  it('max label is also NOT editable in fixed mode', async () => {
    const user = userEvent.setup()
    renderExercise2()

    await waitFor(() => expect(screen.getByTestId('label-max')).toBeInTheDocument())

    const maxLabel = screen.getByTestId('label-max')
    await user.click(maxLabel)

    expect(screen.getByTestId('label-max').tagName).toBe('SPAN')
  })

  it('shows error message when API fails', async () => {
    server.use(http.get('/api/range-fixed', () => HttpResponse.error()))
    renderExercise2()
    await waitFor(() =>
      expect(screen.getByText(/failed to load range/i)).toBeInTheDocument(),
    )
  })
})
