import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { Cache } from './cache'

describe('cache Component', () => {
  it('should render children', () => {
    render(
      <Cache deps={[1, 2, 3]}>
        <div data-testid="cached-content">Cached Content</div>
      </Cache>
    )

    expect(screen.getByTestId('cached-content')).toHaveTextContent('Cached Content')
  })

  it('should memoize children when dependencies do not change', () => {
    let renderCount = 0

    const ExpensiveComponent = () => {
      renderCount++
      return <div data-testid="expensive">{`Render count: ${renderCount}`}</div>
    }

    const TestWrapper = () => {
      const [otherState, setOtherState] = useState(0)

      return (
        <div>
          <Cache deps={['stable']}>
            <ExpensiveComponent />
          </Cache>
          <button
            type="button"
            data-testid="trigger-rerender"
            onClick={() => setOtherState((prev) => prev + 1)}
          >
            Trigger Re-render
          </button>
          <div data-testid="other-state">{otherState}</div>
        </div>
      )
    }

    render(<TestWrapper />)

    expect(screen.getByTestId('expensive')).toHaveTextContent('Render count: 1')

    // Trigger component re-render but Cache deps stay the same
    fireEvent.click(screen.getByTestId('trigger-rerender'))

    // ExpensiveComponent should not re-render due to memoization
    expect(screen.getByTestId('expensive')).toHaveTextContent('Render count: 1')
    expect(screen.getByTestId('other-state')).toHaveTextContent('1')
  })

  it('should re-render children when dependencies change', () => {
    let renderCount = 0

    const ExpensiveComponent = ({ value }: { value: number }) => {
      renderCount++
      return <div data-testid="expensive">{`Value: ${value}, Renders: ${renderCount}`}</div>
    }

    const TestWrapper = () => {
      const [value, setValue] = useState(1)

      return (
        <div>
          <Cache deps={[value]}>
            <ExpensiveComponent value={value} />
          </Cache>
          <button
            type="button"
            data-testid="change-deps"
            onClick={() => setValue((prev) => prev + 1)}
          >
            Change Dependencies
          </button>
        </div>
      )
    }

    render(<TestWrapper />)

    expect(screen.getByTestId('expensive')).toHaveTextContent('Value: 1, Renders: 1')

    // Change dependencies - should trigger re-render
    fireEvent.click(screen.getByTestId('change-deps'))

    expect(screen.getByTestId('expensive')).toHaveTextContent('Value: 2, Renders: 2')
  })

  it('should handle empty dependencies array', () => {
    render(
      <Cache deps={[]}>
        <div data-testid="empty-deps">Never re-renders</div>
      </Cache>
    )

    expect(screen.getByTestId('empty-deps')).toHaveTextContent('Never re-renders')
  })

  it('should handle complex dependencies', () => {
    const complexDep = { id: 1, name: 'test', nested: { value: 42 } }

    render(
      <Cache deps={[complexDep, 'string', 123, true]}>
        <div data-testid="complex-deps">Complex dependencies</div>
      </Cache>
    )

    expect(screen.getByTestId('complex-deps')).toHaveTextContent('Complex dependencies')
  })

  it('should handle null and undefined dependencies', () => {
    render(
      <Cache deps={[null, undefined, 0, false, '']}>
        <div data-testid="falsy-deps">Falsy dependencies</div>
      </Cache>
    )

    expect(screen.getByTestId('falsy-deps')).toHaveTextContent('Falsy dependencies')
  })

  it('should log debug information when debug is enabled', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    render(
      <Cache deps={[1, 2, 3]} debug={true} key="test-cache">
        <div data-testid="debug-content">Debug Content</div>
      </Cache>
    )

    expect(consoleSpy).toHaveBeenCalledWith('🔄 Cache  recalculating', [1, 2, 3])
    expect(consoleSpy).toHaveBeenCalledWith('✨ Cache  hit', [1, 2, 3])
    expect(screen.getByTestId('debug-content')).toHaveTextContent('Debug Content')

    consoleSpy.mockRestore()
  })

  it('should not log debug information when debug is disabled', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    render(
      <Cache deps={[1, 2, 3]} debug={false}>
        <div data-testid="no-debug-content">No Debug Content</div>
      </Cache>
    )

    expect(consoleSpy).not.toHaveBeenCalled()
    expect(screen.getByTestId('no-debug-content')).toHaveTextContent('No Debug Content')

    consoleSpy.mockRestore()
  })

  it('should handle multiple children', () => {
    render(
      <Cache deps={['multiple']}>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <span data-testid="child3">Child 3</span>
      </Cache>
    )

    expect(screen.getByTestId('child1')).toHaveTextContent('Child 1')
    expect(screen.getByTestId('child2')).toHaveTextContent('Child 2')
    expect(screen.getByTestId('child3')).toHaveTextContent('Child 3')
  })

  it('should handle React fragments as children', () => {
    render(
      <Cache deps={['fragment']}>
        <>
          <div data-testid="fragment-child1">Fragment Child 1</div>
          <div data-testid="fragment-child2">Fragment Child 2</div>
        </>
      </Cache>
    )

    expect(screen.getByTestId('fragment-child1')).toHaveTextContent('Fragment Child 1')
    expect(screen.getByTestId('fragment-child2')).toHaveTextContent('Fragment Child 2')
  })

  it('should handle key without debug mode', () => {
    render(
      <Cache deps={[1]} key="no-debug-key">
        <div data-testid="key-no-debug">Key without debug</div>
      </Cache>
    )

    expect(screen.getByTestId('key-no-debug')).toHaveTextContent('Key without debug')
  })
})
