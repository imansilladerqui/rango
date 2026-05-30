/**
 * Shared test utilities — import from here instead of @testing-library/react
 * when rendering components that need the full provider tree.
 */
import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export * from '@testing-library/react'

export const createTestQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  })

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  queryClient?: QueryClient
}

export const renderWithProviders = (
  ui: ReactElement,
  options?: CustomRenderOptions,
): RenderResult => {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options ?? {}

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  )

  return render(ui, { wrapper, ...renderOptions })
}
