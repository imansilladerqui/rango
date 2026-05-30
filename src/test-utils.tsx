/**
 * Shared test utilities — import from here instead of @testing-library/react
 * when rendering components that need the full provider tree.
 */
import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Re-export the full Testing Library surface so tests only need one import.
export * from '@testing-library/react'

// ---------------------------------------------------------------------------
// Default QueryClient used in tests — no retries so errors surface immediately.
// ---------------------------------------------------------------------------
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

// ---------------------------------------------------------------------------
// Provider tree that every page-level test needs.
// ---------------------------------------------------------------------------
type WrapperProps = {
  children: ReactNode
  queryClient?: QueryClient
}

const AllProviders = ({ children, queryClient }: WrapperProps) => (
  <QueryClientProvider client={queryClient ?? createTestQueryClient()}>
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
)

// ---------------------------------------------------------------------------
// renderWithProviders — drop-in replacement for render() with the full tree.
// ---------------------------------------------------------------------------
type CustomRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  queryClient?: QueryClient
}

export const renderWithProviders = (
  ui: ReactElement,
  options?: CustomRenderOptions,
): RenderResult => {
  const { queryClient, ...renderOptions } = options ?? {}
  return render(ui, {
    wrapper: ({ children }) => <AllProviders queryClient={queryClient}>{children}</AllProviders>,
    ...renderOptions,
  })
}
