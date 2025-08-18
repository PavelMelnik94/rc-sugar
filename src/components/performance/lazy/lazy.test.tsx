import type { ComponentType } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { Lazy } from './lazy'

// Mock components for testing
function MockComponent({ message }: { message: string }) {
  return (
    <div>
      Mock Component:
      {message}
    </div>
  )
}

const MockComponentWithoutProps = () => <div>Mock Component Without Props</div>

// Mock dynamic imports
function createMockLoader<T extends Record<string, unknown> = Record<string, unknown>>(
  component: ComponentType<T>, 
  delay = 0
): () => Promise<{ default: ComponentType<T> }> {
  return () => new Promise((resolve) => 
    setTimeout(() => resolve({ default: component }), delay)
  )
}

// Mock loader that rejects
function createMockLoaderWithError<T extends Record<string, unknown> = Record<string, unknown>>(
  delay = 0
): () => Promise<{ default: ComponentType<T> }> {
  return () => new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Failed to load component')), delay)
  )
}

describe('lazy Component', () => {
  it('should render fallback while loading', async () => {
    render(
      <Lazy<{ message: string }>
        load={createMockLoader(MockComponent, 100)}
        fallback={<div>Loading...</div>}
        componentProps={{ message: 'test' }}
      />
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should handle loading errors gracefully', async () => {
    render(
      <Lazy<Record<string, unknown>>
        load={createMockLoaderWithError(50)}
        fallback={<div>Loading...</div>}
      />
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    // Error boundary should catch the error and keep showing fallback
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should render loaded component after loading completes', async () => {
    render(
      <Lazy<{ message: string }>
        load={createMockLoader(MockComponent)}
        fallback={<div>Loading...</div>}
        componentProps={{ message: 'loaded' }}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(/Mock Component:.*loaded/)).toBeInTheDocument()
    })
  })

  it('should work with render prop pattern', async () => {
    render(
      <Lazy<{ message: string }> load={createMockLoader(MockComponent)} fallback={<div>Loading...</div>}>
        {(Component) => <Component message="render prop test" />}
      </Lazy>
    )

    await waitFor(() => {
      expect(screen.getByText(/Mock Component:.*render prop test/)).toBeInTheDocument()
    })
  })

  it('should render with no fallback by default', async () => {
    render(<Lazy<Record<string, unknown>> load={createMockLoader(MockComponentWithoutProps)} />)

    await waitFor(() => {
      expect(screen.getByText('Mock Component Without Props')).toBeInTheDocument()
    })
  })

  it('should pass componentProps to loaded component', async () => {
    const testProps = { message: 'component props test' }

    render(<Lazy<{ message: string }> load={createMockLoader(MockComponent)} componentProps={testProps} />)

    await waitFor(() => {
      expect(screen.getByText(/Mock Component:.*component props test/)).toBeInTheDocument()
    })
  })

  it('should handle preload option', async () => {
    const mockLoader = jest.fn(createMockLoader(MockComponent))

    render(<Lazy<{ message: string }> load={mockLoader} preload={true} componentProps={{ message: 'preloaded' }} />)

    // Should call the loader twice - once for preload, once for actual render
    expect(mockLoader).toHaveBeenCalledTimes(2)

    await waitFor(() => {
      expect(screen.getByText(/Mock Component:.*preloaded/)).toBeInTheDocument()
    })
  })

  it('should not preload by default', async () => {
    const mockLoader = jest.fn(createMockLoader(MockComponent))

    render(<Lazy<{ message: string }> load={mockLoader} componentProps={{ message: 'not preloaded' }} />)

    // Should only call loader once for actual render
    expect(mockLoader).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(screen.getByText(/Mock Component:.*not preloaded/)).toBeInTheDocument()
    })
  })

  it('should handle render prop with no componentProps', async () => {
    render(
      <Lazy<Record<string, unknown>> load={createMockLoader(MockComponentWithoutProps)}>{(Component) => <Component />}</Lazy>
    )

    await waitFor(() => {
      expect(screen.getByText('Mock Component Without Props')).toBeInTheDocument()
    })
  })

  it('should have correct displayName', () => {
    expect(Lazy.displayName).toBe('Lazy')
  })

  it('should handle complex component props', async () => {
    const ComplexComponent = ({
      data,
      config,
    }: {
      data: string[]
      config: { enabled: boolean }
    }) => (
      <div>
        Complex: {data.join(', ')} - {config.enabled ? 'enabled' : 'disabled'}
      </div>
    )

    const complexProps = {
      data: ['item1', 'item2', 'item3'],
      config: { enabled: true },
    }

    render(<Lazy<{ data: string[]; config: { enabled: boolean } }> load={createMockLoader(ComplexComponent)} componentProps={complexProps} />)

    await waitFor(() => {
      expect(screen.getByText('Complex: item1, item2, item3 - enabled')).toBeInTheDocument()
    })
  })

  it('should work with custom fallback component', async () => {
    const CustomFallback = () => <div>Custom Loading Spinner</div>

    render(
      <Lazy<{ message: string }>
        load={createMockLoader(MockComponent, 50)}
        fallback={<CustomFallback />}
        componentProps={{ message: 'test' }}
      />
    )

    expect(screen.getByText('Custom Loading Spinner')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/Mock Component:.*test/)).toBeInTheDocument()
    })
  })

  it('should handle render prop overriding componentProps', async () => {
    render(
      <Lazy<{ message: string }>
        load={createMockLoader(MockComponent)}
        componentProps={{ message: 'should not appear' }}
      >
        {(Component) => <Component message="render prop wins" />}
      </Lazy>
    )

    await waitFor(() => {
      expect(screen.getByText(/Mock Component:.*render prop wins/)).toBeInTheDocument()
      expect(screen.queryByText(/Mock Component:.*should not appear/)).not.toBeInTheDocument()
    })
  })
})
