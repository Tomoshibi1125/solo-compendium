import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DiceRoller from '@/pages/DiceRoller'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

describe('DiceRoller Smoke Test', () => {
  it('renders without crashing', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <DiceRoller />
      </QueryClientProvider>
    )

    // Component should render something (not crash)
    expect(document.body).toBeInTheDocument()
    
    // Should show loading spinner initially
    const loadingSpinner = document.querySelector('.animate-spin')
    expect(loadingSpinner).toBeInTheDocument()
  })
})
