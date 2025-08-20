import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Ticker } from './ticker'

describe('ticker', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render with children render prop', () => {
    render(
      <Ticker interval={1000}>
        {({ count, isRunning }) => (
          <div>
            <span data-testid="count">
              Count:
              {count}
            </span>
            <span data-testid="running">
              Running:
              {isRunning.toString()}
            </span>
          </div>
        )}
      </Ticker>
    )

    expect(screen.getByTestId('count')).toHaveTextContent('Count:0')
    expect(screen.getByTestId('running')).toHaveTextContent('Running:true')
  })

  it('should return null when no children provided', () => {
    const { container } = render(<Ticker interval={1000} />)
    expect(container.firstChild).toBeNull()
  })

  it('should start with autoStart enabled by default', () => {
    render(
      <Ticker interval={1000}>
        {({ isRunning }) => <span data-testid="running">{isRunning.toString()}</span>}
      </Ticker>
    )

    expect(screen.getByTestId('running')).toHaveTextContent('true')
  })

  it('should not start when autoStart is false', () => {
    render(
      <Ticker interval={1000} autoStart={false}>
        {({ isRunning }) => <span data-testid="running">{isRunning.toString()}</span>}
      </Ticker>
    )

    expect(screen.getByTestId('running')).toHaveTextContent('false')
  })

  it('should increment count at specified intervals', async () => {
    render(
      <Ticker interval={100}>{({ count }) => <span data-testid="count">{count}</span>}</Ticker>
    )

    expect(screen.getByTestId('count')).toHaveTextContent('0')

    // Wait for first tick
    await waitFor(
      () => {
        expect(screen.getByTestId('count')).toHaveTextContent('1')
      },
      { timeout: 200 }
    )

    // Wait for second tick
    await waitFor(
      () => {
        expect(screen.getByTestId('count')).toHaveTextContent('2')
      },
      { timeout: 200 }
    )
  })

  it('should call onTick callback on each tick', async () => {
    const onTick = jest.fn()

    const { unmount } = render(<Ticker interval={100} onTick={onTick} />)

    // Wait for first tick
    await waitFor(
      () => {
        expect(onTick).toHaveBeenCalledWith(1)
      },
      { timeout: 200 }
    )

    // Wait for second tick
    await waitFor(
      () => {
        expect(onTick).toHaveBeenCalledWith(2)
      },
      { timeout: 200 }
    )
    
    // Verify we got at least 2 calls (could be more due to timing)
    expect(onTick.mock.calls.length).toBeGreaterThanOrEqual(2)
    
    unmount()
  })

  it('should stop ticking when stop is called', async () => {
    const onTick = jest.fn()

    render(
      <Ticker interval={50} onTick={onTick}>
        {({ stop, isRunning }) => (
          <div>
            <button type="button" data-testid="stop" onClick={stop}>
              Stop
            </button>
            <span data-testid="running">{isRunning.toString()}</span>
          </div>
        )}
      </Ticker>
    )

    // Let it tick once
    await waitFor(
      () => {
        expect(onTick).toHaveBeenCalledWith(1)
      },
      { timeout: 100 }
    )

    // Stop the ticker
    fireEvent.click(screen.getByTestId('stop'))

    await waitFor(() => {
      expect(screen.getByTestId('running')).toHaveTextContent('false')
    })

    // Wait and ensure it doesn't tick again
    const callCountAfterStop = onTick.mock.calls.length
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Should not have called onTick again
    expect(onTick).toHaveBeenCalledTimes(callCountAfterStop)
  })

  it('should call onStop callback when stopped', async () => {
    const onStop = jest.fn()

    render(
      <Ticker interval={50} onStop={onStop}>
        {({ stop, count }) => (
          <div>
            <button type="button" data-testid="stop" onClick={stop}>
              Stop
            </button>
            <span data-testid="count">{count}</span>
          </div>
        )}
      </Ticker>
    )

    // Let it tick a couple times
    await waitFor(
      () => {
        expect(screen.getByTestId('count')).toHaveTextContent('2')
      },
      { timeout: 150 }
    )

    // Stop the ticker
    fireEvent.click(screen.getByTestId('stop'))

    await waitFor(() => {
      expect(onStop).toHaveBeenCalledWith(2)
    })
  })
  it('should restart from zero when restart is called', async () => {
    render(
      <Ticker interval={100}>
        {({ restart, count, isRunning }) => (
          <div>
            <button type="button" data-testid="restart" onClick={restart}>
              Restart
            </button>
            <span data-testid="count">{count}</span>
            <span data-testid="running">{isRunning.toString()}</span>
          </div>
        )}
      </Ticker>
    )

    // Let it tick a few times
    await waitFor(
      () => {
        expect(screen.getByTestId('count')).toHaveTextContent('2')
      },
      { timeout: 300 }
    )

    // Restart the ticker
    fireEvent.click(screen.getByTestId('restart'))

    // Should reset to 0 and be running
    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('0')
      expect(screen.getByTestId('running')).toHaveTextContent('true')
    })

    // The restart functionality resets the count and sets running to true
    // This validates the core restart behavior
    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('running')).toHaveTextContent('true')
  })

  it('should stop automatically when maxTicks is reached', async () => {
    const onStop = jest.fn()
    const onTick = jest.fn()

    render(
      <Ticker interval={50} maxTicks={3} onTick={onTick} onStop={onStop}>
        {({ count, isRunning }) => (
          <div>
            <span data-testid="count">{count}</span>
            <span data-testid="running">{isRunning.toString()}</span>
          </div>
        )}
      </Ticker>
    )

    // Wait for it to reach maxTicks and stop
    await waitFor(
      () => {
        expect(screen.getByTestId('count')).toHaveTextContent('3')
        expect(screen.getByTestId('running')).toHaveTextContent('false')
      },
      { timeout: 200 }
    )

    // Should have called onTick for the first 2 ticks (not the final stopping tick)
    expect(onTick).toHaveBeenCalledWith(1)
    expect(onTick).toHaveBeenCalledWith(2)
    expect(onTick).toHaveBeenCalledTimes(2)

    // Should have called onStop with final count
    expect(onStop).toHaveBeenCalledWith(3)
  })

  it('should handle maxTicks of 1', async () => {
    const onStop = jest.fn()
    const onTick = jest.fn()

    render(
      <Ticker interval={50} maxTicks={1} onTick={onTick} onStop={onStop}>
        {({ count, isRunning }) => (
          <div>
            <span data-testid="count">{count}</span>
            <span data-testid="running">{isRunning.toString()}</span>
          </div>
        )}
      </Ticker>
    )

    await waitFor(
      () => {
        expect(screen.getByTestId('count')).toHaveTextContent('1')
        expect(screen.getByTestId('running')).toHaveTextContent('false')
      },
      { timeout: 100 }
    )

    expect(onTick).not.toHaveBeenCalled() // Should not call onTick when reaching maxTicks
    expect(onStop).toHaveBeenCalledWith(1)
  })

  it('should cleanup interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(globalThis, 'clearInterval')

    const { unmount } = render(
      <Ticker interval={1000}>{({ count }) => <span>{count}</span>}</Ticker>
    )

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockRestore()
  })

  it('should restart interval when interval prop changes', async () => {
    const { rerender } = render(
      <Ticker interval={100}>{({ count }) => <span data-testid="count">{count}</span>}</Ticker>
    )

    // Wait for a tick with original interval
    await waitFor(
      () => {
        expect(screen.getByTestId('count')).toHaveTextContent('1')
      },
      { timeout: 150 }
    )

    // Change interval to a much faster one
    rerender(
      <Ticker interval={25}>{({ count }) => <span data-testid="count">{count}</span>}</Ticker>
    )

    // Should continue with new interval (faster ticking)
    await waitFor(
      () => {
        expect(screen.getByTestId('count')).toHaveTextContent('2')
      },
      { timeout: 50 }
    )
  })

  it('should handle multiple stop calls gracefully', async () => {
    const onStop = jest.fn()

    render(
      <Ticker interval={50} onStop={onStop}>
        {({ stop, count, isRunning }) => (
          <div>
            <button type="button" data-testid="stop" onClick={stop}>
              Stop
            </button>
            <span data-testid="count">{count}</span>
            <span data-testid="running">{isRunning.toString()}</span>
          </div>
        )}
      </Ticker>
    )

    // Let it tick once
    await waitFor(
      () => {
        expect(screen.getByTestId('count')).toHaveTextContent('1')
      },
      { timeout: 100 }
    )

    // Stop the ticker once
    fireEvent.click(screen.getByTestId('stop'))

    // Wait for it to stop
    await waitFor(() => {
      expect(screen.getByTestId('running')).toHaveTextContent('false')
    })

    // Multiple stop calls after it's already stopped should not crash
    fireEvent.click(screen.getByTestId('stop'))
    fireEvent.click(screen.getByTestId('stop'))

    // Should have stopped and onStop should have been called (at least once)
    expect(onStop).toHaveBeenCalled()
    expect(screen.getByTestId('running')).toHaveTextContent('false')
  })

  it('should work without onTick callback', async () => {
    render(<Ticker interval={50}>{({ count }) => <span data-testid="count">{count}</span>}</Ticker>)

    await waitFor(
      () => {
        expect(screen.getByTestId('count')).toHaveTextContent('2')
      },
      { timeout: 150 }
    )
  })

  it('should work without onStop callback', async () => {
    render(
      <Ticker interval={50} maxTicks={2}>
        {({ count, isRunning }) => (
          <div>
            <span data-testid="count">{count}</span>
            <span data-testid="running">{isRunning.toString()}</span>
          </div>
        )}
      </Ticker>
    )

    await waitFor(
      () => {
        expect(screen.getByTestId('count')).toHaveTextContent('2')
        expect(screen.getByTestId('running')).toHaveTextContent('false')
      },
      { timeout: 150 }
    )
  })

  it('should have correct displayName', () => {
    expect(Ticker.displayName).toBe('Ticker')
  })

  it('should provide all state properties correctly', () => {
    let capturedState: any = null

    render(
      <Ticker interval={1000}>
        {(state) => {
          capturedState = state
          return <div>State captured</div>
        }}
      </Ticker>
    )

    expect(capturedState).toMatchObject({
      count: expect.any(Number),
      stop: expect.any(Function),
      restart: expect.any(Function),
      isRunning: expect.any(Boolean),
    })

    expect(capturedState.count).toBe(0)
    expect(capturedState.isRunning).toBe(true)
  })

  it('should maintain state consistency across renders', async () => {
    const states: any[] = []

    render(
      <Ticker interval={50}>
        {(state) => {
          states.push({ ...state })
          return <span data-testid="count">{state.count}</span>
        }}
      </Ticker>
    )

    await waitFor(
      () => {
        expect(screen.getByTestId('count')).toHaveTextContent('1')
      },
      { timeout: 100 }
    )

    // Check that we have multiple renders with expected progression
    expect(states.length).toBeGreaterThan(1)
    expect(states[0].count).toBe(0)
    expect(states[states.length - 1].count).toBe(1)
  })

  it('should handle zero interval', async () => {
    const onTick = jest.fn()

    const { unmount } = render(<Ticker interval={0} onTick={onTick} />)

    // Should tick very frequently with 0 interval
    await waitFor(
      () => {
        expect(onTick).toHaveBeenCalled()
      },
      { timeout: 100 }
    )

    unmount()
  })

  it('should handle maxTicks of 0', async () => {
    const onStop = jest.fn()

    render(
      <Ticker interval={50} maxTicks={0} onStop={onStop}>
        {({ count, isRunning }) => (
          <div>
            <span data-testid="count">{count}</span>
            <span data-testid="running">{isRunning.toString()}</span>
          </div>
        )}
      </Ticker>
    )

    // With maxTicks=0, it should never stop because 0 is falsy in the condition
    // Let it run for a bit and verify it continues running
    await waitFor(
      () => {
        expect(screen.getByTestId('count')).toHaveTextContent('2')
      },
      { timeout: 150 }
    )

    expect(screen.getByTestId('running')).toHaveTextContent('true')
    expect(onStop).not.toHaveBeenCalled()
  })
})
