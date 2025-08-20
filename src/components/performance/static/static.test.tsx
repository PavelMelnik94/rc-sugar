import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { Static } from './static'

describe('static Component', () => {
  it('should render children', () => {
    render(
      <Static>
        <div data-testid="content">Static Content</div>
      </Static>
    )

    expect(screen.getByTestId('content')).toHaveTextContent('Static Content')
  })

  it('should memoize children', () => {
    let renderCount = 0

    const StaticContent = () => {
      renderCount++
      return <div data-testid="static">Render:{renderCount}</div>
    }

    const TestWrapper = () => {
      const [counter, setCounter] = useState(0)

      return (
        <div>
          <Static>
            <StaticContent />
          </Static>
          <button
            type="button"
            data-testid="increment"
            onClick={() => setCounter((prev) => prev + 1)}
          >
            Count: {counter}
          </button>
        </div>
      )
    }

    render(<TestWrapper />)

    expect(screen.getByTestId('static')).toHaveTextContent('Render:1')

    // Trigger parent re-render
    fireEvent.click(screen.getByTestId('increment'))

    // Should still show same render count due to memoization
    expect(screen.getByTestId('static')).toHaveTextContent('Render:1')
  })

  it('should handle string children', () => {
    render(<Static>Simple text content</Static>)

    expect(screen.getByText('Simple text content')).toBeInTheDocument()
  })

  it('should handle React fragments', () => {
    render(
      <Static>
        <>
          <div data-testid="fragment-1">Fragment 1</div>
          <div data-testid="fragment-2">Fragment 2</div>
        </>
      </Static>
    )

    expect(screen.getByTestId('fragment-1')).toHaveTextContent('Fragment 1')
    expect(screen.getByTestId('fragment-2')).toHaveTextContent('Fragment 2')
  })

  it('should handle null and undefined dependencies', () => {
    render(
      <Static deps={[null, undefined]}>
        <div data-testid="null-deps">Null deps content</div>
      </Static>
    )

    expect(screen.getByTestId('null-deps')).toHaveTextContent('Null deps content')
  })

  it('should handle empty dependencies', () => {
    render(
      <Static deps={[]}>
        <div data-testid="empty-deps">Empty deps content</div>
      </Static>
    )

    expect(screen.getByTestId('empty-deps')).toHaveTextContent('Empty deps content')
  })

  it('should handle complex children', () => {
    render(
      <Static>
        <div>
          <h1 data-testid="title">Title</h1>
          <p data-testid="description">Description</p>
        </div>
      </Static>
    )

    expect(screen.getByTestId('title')).toHaveTextContent('Title')
    expect(screen.getByTestId('description')).toHaveTextContent('Description')
  })
})
