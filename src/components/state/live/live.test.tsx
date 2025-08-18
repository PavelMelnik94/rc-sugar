import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Live } from './live'

describe('live Component', () => {
  let mockSource: ReturnType<typeof jest.fn>

  beforeEach(() => {
    mockSource = jest.fn()
  })

  afterEach(() => {
    cleanup()
    jest.clearAllTimers()
  })

  it('should render with initial state when autoStart is false', async () => {
    mockSource.mockResolvedValue('test-value')

    render(
      <Live source={mockSource} initial="initial-value" autoStart={false}>
        {({ value, isLoading, isLive, error, updateCount }) => (
          <div>
            <div data-testid="value">{value ?? null}</div>
            <div data-testid="loading">{isLoading.toString()}</div>
            <div data-testid="live">{isLive.toString()}</div>
            <div data-testid="error">{error?.message || 'null'}</div>
            <div data-testid="count">{updateCount}</div>
          </div>
        )}
      </Live>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('initial-value')
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('live')).toHaveTextContent('false')
    expect(screen.getByTestId('error')).toHaveTextContent('null')
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('should not auto-start when autoStart is false', () => {
    mockSource.mockResolvedValue('test-value')

    render(
      <Live source={mockSource} autoStart={false}>
        {({ value, isLive }) => (
          <div>
            <div data-testid="value">{value ? String(value) : 'undefined'}</div>
            <div data-testid="live">{isLive.toString()}</div>
          </div>
        )}
      </Live>
    )

    expect(screen.getByTestId('live')).toHaveTextContent('false')
    expect(mockSource).not.toHaveBeenCalled()
  })

  it('should start live updates manually', async () => {
    mockSource.mockResolvedValue('test-value')

    render(
      <Live source={mockSource} autoStart={false} interval={10}>
        {({ isLive, start, value }) => (
          <div>
            <div data-testid="live">{isLive.toString()}</div>
            <div data-testid="value">{value ? String(value) : 'undefined'}</div>
            <button type="button" onClick={start}>Start</button>
          </div>
        )}
      </Live>
    )

    expect(screen.getByTestId('live')).toHaveTextContent('false')

    fireEvent.click(screen.getByText('Start'))

    await waitFor(() => {
      expect(screen.getByTestId('live')).toHaveTextContent('true')
    })

    await waitFor(() => {
      expect(screen.getByTestId('value')).toHaveTextContent('test-value')
    })
  })
  it('should stop live updates manually', async () => {
    mockSource.mockResolvedValue('test-value')

    render(
      <Live source={mockSource} autoStart={false} interval={10}>
        {({ isLive, start, stop }) => (
          <div>
            <div data-testid="live">{isLive.toString()}</div>
            <button type="button" onClick={start}>Start</button>
            <button type="button" onClick={stop}>Stop</button>
          </div>
        )}
      </Live>
    )

    // Start first
    fireEvent.click(screen.getByText('Start'))

    await waitFor(() => {
      expect(screen.getByTestId('live')).toHaveTextContent('true')
    })

    // Then stop
    fireEvent.click(screen.getByText('Stop'))

    await waitFor(() => {
      expect(screen.getByTestId('live')).toHaveTextContent('false')
    })
  })

  it('should handle manual refresh', async () => {
    let callCount = 0
    mockSource.mockImplementation(() => {
      callCount++
      return Promise.resolve(`refreshed-${callCount}`)
    })

    render(
      <Live source={mockSource} autoStart={false}>
        {({ value, refresh, updateCount }) => (
          <div>
            <div data-testid="value">{value ? String(value) : 'undefined'}</div>
            <div data-testid="count">{updateCount}</div>
            <button type="button" onClick={refresh}>Refresh</button>
          </div>
        )}
      </Live>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('undefined')
    expect(screen.getByTestId('count')).toHaveTextContent('0')

    fireEvent.click(screen.getByText('Refresh'))

    await waitFor(() => {
      expect(screen.getByTestId('value')).toHaveTextContent('refreshed-1')
      expect(screen.getByTestId('count')).toHaveTextContent('1')
    })
  })

  it('should handle source errors', async () => {
    const error = new Error('Source failed')
    mockSource.mockRejectedValue(error)

    render(
      <Live source={mockSource} autoStart={false}>
        {({ error, isLoading, refresh }) => (
          <div>
            <div data-testid="error">{error?.message || 'null'}</div>
            <div data-testid="loading">{isLoading.toString()}</div>
            <button type="button" onClick={refresh}>Refresh</button>
          </div>
        )}
      </Live>
    )

    fireEvent.click(screen.getByText('Refresh'))

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Source failed')
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })
  })

  it('should track previous values', async () => {
    let callCount = 0
    mockSource.mockImplementation(() => {
      callCount++
      return Promise.resolve(callCount)
    })

    render(
      <Live source={mockSource} autoStart={false}>
        {({ value, previousValue, refresh }) => (
          <div>
            <div data-testid="value">{String(value)}</div>
            <div data-testid="previous">{previousValue ? String(previousValue) : 'undefined'}</div>
            <button type="button" onClick={refresh}>Refresh</button>
          </div>
        )}
      </Live>
    )

    // First refresh
    fireEvent.click(screen.getByText('Refresh'))
    await waitFor(() => {
      expect(screen.getByTestId('value')).toHaveTextContent('1')
      expect(screen.getByTestId('previous')).toHaveTextContent('undefined')
    })

    // Second refresh
    fireEvent.click(screen.getByText('Refresh'))
    await waitFor(() => {
      expect(screen.getByTestId('value')).toHaveTextContent('2')
      expect(screen.getByTestId('previous')).toHaveTextContent('1')
    })
  })

  it('should use custom compare function', async () => {
    let callCount = 0
    mockSource.mockImplementation(() => {
      callCount++
      return Promise.resolve({ id: 1, timestamp: callCount })
    })

    // Compare only by id, ignore timestamp changes
    const compare = (prev: any, next: any) => prev?.id !== next?.id

    render(
      <Live source={mockSource} autoStart={false} compare={compare}>
        {({ value, updateCount, refresh }) => (
          <div>
            <div data-testid="timestamp">{value?.timestamp}</div>
            <div data-testid="count">{updateCount}</div>
            <button type="button" onClick={refresh}>Refresh</button>
          </div>
        )}
      </Live>
    )

    // First refresh
    fireEvent.click(screen.getByText('Refresh'))
    await waitFor(() => {
      expect(screen.getByTestId('timestamp')).toHaveTextContent('1')
      expect(screen.getByTestId('count')).toHaveTextContent('1')
    })

    // Second refresh - same id, should not update count
    fireEvent.click(screen.getByText('Refresh'))
    await waitFor(() => {
      // Count should still be 1 since id didn't change
      expect(screen.getByTestId('count')).toHaveTextContent('1')
    })
  })

  it('should prevent double start', async () => {
    mockSource.mockResolvedValue('test')

    render(
      <Live source={mockSource} autoStart={false}>
        {({ isLive, start }) => (
          <div>
            <div data-testid="live">{isLive.toString()}</div>
            <button type="button" onClick={start}>Start</button>
          </div>
        )}
      </Live>
    )

    // Start twice quickly
    fireEvent.click(screen.getByText('Start'))
    fireEvent.click(screen.getByText('Start'))

    await waitFor(() => {
      expect(screen.getByTestId('live')).toHaveTextContent('true')
    })

    // Should only be called once despite double start
    expect(mockSource).toHaveBeenCalledTimes(1)
  })

  it('should have correct displayName', () => {
    expect(Live.displayName).toBe('Live')
  })

  it('should handle loading state correctly', async () => {
    let resolvePromise: (value: string) => void
    let promiseCreated = false
    
    mockSource.mockImplementation(() => {
      if (promiseCreated) {
        return Promise.resolve('loaded-value')
      }
      promiseCreated = true
      return new Promise<string>((resolve) => {
        resolvePromise = resolve
        // Auto-resolve after 100ms to prevent hanging
        setTimeout(() => resolve('loaded-value'), 100)
      })
    })

    render(
      <Live source={mockSource} autoStart={false}>
        {({ isLoading, value, refresh }) => (
          <div>
            <div data-testid="loading">{isLoading.toString()}</div>
            <div data-testid="value">{value ? String(value) : 'undefined'}</div>
            <button type="button" onClick={refresh}>Refresh</button>
          </div>
        )}
      </Live>
    )

    // Trigger loading
    fireEvent.click(screen.getByText('Refresh'))

    // Should be loading
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('true')
    })

    // Resolve the promise immediately
    if (resolvePromise!) {
      act(() => {
        resolvePromise!('loaded-value')
      })
    }

    // Should not be loading after resolution
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
      expect(screen.getByTestId('value')).toHaveTextContent('loaded-value')
    })
  })

  it('should auto-start by default', async () => {
    mockSource.mockResolvedValue('auto-started')

    const { unmount } = render(
      <Live source={mockSource}>
        {({ isLive, value, stop }) => (
          <div>
            <div data-testid="live">{isLive.toString()}</div>
            <div data-testid="value">{value ? String(value) : 'undefined'}</div>
            <button type="button" onClick={stop}>Stop</button>
          </div>
        )}
      </Live>
    )

    // Should auto-start by default
    await waitFor(() => {
      expect(screen.getByTestId('live')).toHaveTextContent('true')
    })

    // Should fetch data
    await waitFor(() => {
      expect(screen.getByTestId('value')).toHaveTextContent('auto-started')
    })

    // Stop the interval to prevent hanging
    fireEvent.click(screen.getByText('Stop'))
    
    await waitFor(() => {
      expect(screen.getByTestId('live')).toHaveTextContent('false')
    })

    unmount()
  })

  it('should handle unmounting gracefully', () => {
    mockSource.mockResolvedValue('test')

    const { unmount } = render(
      <Live source={mockSource} autoStart={false}>
        {({ value }) => <div>{value ? String(value) : null}</div>}
      </Live>
    )

    // Unmount should not cause errors
    expect(() => unmount()).not.toThrow()
  })
})
