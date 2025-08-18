import { render, screen } from '@testing-library/react'
import { Repeat } from './repeat'

describe('repeat Component', () => {
  it('should render content specified number of times', () => {
    render(
      <Repeat times={3}>
        {(index) => (
          <div key={index} data-testid={`item-${index}`}>
            Item
            {index}
          </div>
        )}
      </Repeat>
    )

    expect(screen.getByTestId('item-0')).toBeInTheDocument()
    expect(screen.getByTestId('item-1')).toBeInTheDocument()
    expect(screen.getByTestId('item-2')).toBeInTheDocument()
    expect(screen.queryByTestId('item-3')).not.toBeInTheDocument()

    expect(screen.getByTestId('item-0')).toHaveTextContent('Item0')
    expect(screen.getByTestId('item-1')).toHaveTextContent('Item1')
    expect(screen.getByTestId('item-2')).toHaveTextContent('Item2')
  })

  it('should render nothing when times is 0', () => {
    const { container } = render(
      <Repeat times={0}>
        {(index) => (
          <div key={index} data-testid={`item-${index}`}>
            Item
            {index}
          </div>
        )}
      </Repeat>
    )

    expect(container.firstChild).toBeNull()
  })

  it('should render nothing when times is negative', () => {
    const { container } = render(
      <Repeat times={-5}>
        {(index) => (
          <div key={index} data-testid={`item-${index}`}>
            Item
            {index}
          </div>
        )}
      </Repeat>
    )

    expect(container.firstChild).toBeNull()
  })

  it('should handle single repetition', () => {
    render(
      <Repeat times={1}>
        {(index) => (
          <div key={index} data-testid={`item-${index}`}>
            Single item
          </div>
        )}
      </Repeat>
    )

    expect(screen.getByTestId('item-0')).toBeInTheDocument()
    expect(screen.getByTestId('item-0')).toHaveTextContent('Single item')
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument()
  })

  it('should provide correct index to render function', () => {
    render(
      <Repeat times={5}>
        {(index) => (
          <div key={index} data-testid={`index-${index}`}>
            Index:
            {index}
          </div>
        )}
      </Repeat>
    )

    for (let i = 0; i < 5; i++) {
      expect(screen.getByTestId(`index-${i}`)).toBeInTheDocument()
      expect(screen.getByTestId(`index-${i}`)).toHaveTextContent(`Index:${i}`)
    }
  })

  it('should handle complex content', () => {
    render(
      <Repeat times={3}>
        {(index) => (
          <div key={index} data-testid={`card-${index}`}>
            <h3>
              Card
              {index + 1}
            </h3>
            <p>
              Description for card
              {index + 1}
            </p>
            <button type="button">
              Action
              {index + 1}
            </button>
          </div>
        )}
      </Repeat>
    )

    const card0 = screen.getByTestId('card-0')
    const card1 = screen.getByTestId('card-1')
    const card2 = screen.getByTestId('card-2')

    expect(card0).toBeInTheDocument()
    expect(card1).toBeInTheDocument()
    expect(card2).toBeInTheDocument()

    expect(card0).toHaveTextContent('Card1')
    expect(card0).toHaveTextContent('Description for card1')
    expect(card0).toHaveTextContent('Action1')

    expect(card1).toHaveTextContent('Card2')
    expect(card2).toHaveTextContent('Card3')
  })

  it('should handle large numbers', () => {
    render(
      <Repeat times={100}>
        {(index) => (
          <span key={index} data-testid={`span-${index}`}>
            {index}
          </span>
        )}
      </Repeat>
    )

    // Check first few and last few items
    expect(screen.getByTestId('span-0')).toBeInTheDocument()
    expect(screen.getByTestId('span-1')).toBeInTheDocument()
    expect(screen.getByTestId('span-99')).toBeInTheDocument()

    // Check total count
    const spans = screen.getAllByTestId(/span-\d+/)
    expect(spans).toHaveLength(100)
  })

  it('should handle components with different props based on index', () => {
    render(
      <Repeat times={4}>
        {(index) => (
          <div
            key={index}
            data-testid={`item-${index}`}
            className={index % 2 === 0 ? 'even' : 'odd'}
            data-color={index === 0 ? 'red' : 'blue'}
          >
            Item {index}
          </div>
        )}
      </Repeat>
    )

    const item0 = screen.getByTestId('item-0')
    const item1 = screen.getByTestId('item-1')
    const item2 = screen.getByTestId('item-2')
    const item3 = screen.getByTestId('item-3')

    expect(item0).toHaveClass('even')
    expect(item1).toHaveClass('odd')
    expect(item2).toHaveClass('even')
    expect(item3).toHaveClass('odd')

    // Check text content instead of styles
    expect(item0.textContent).toBe('Item 0')
    expect(item1.textContent).toBe('Item 1')
  })

  it('should handle nested components', () => {
    render(
      <Repeat times={2}>
        {(outerIndex) => (
          <div key={outerIndex} data-testid={`outer-${outerIndex}`}>
            <Repeat times={2}>
              {(innerIndex) => (
                <span key={innerIndex} data-testid={`inner-${outerIndex}-${innerIndex}`}>
                  {outerIndex}-{innerIndex}
                </span>
              )}
            </Repeat>
          </div>
        )}
      </Repeat>
    )

    expect(screen.getByTestId('outer-0')).toBeInTheDocument()
    expect(screen.getByTestId('outer-1')).toBeInTheDocument()

    expect(screen.getByTestId('inner-0-0')).toBeInTheDocument()
    expect(screen.getByTestId('inner-0-1')).toBeInTheDocument()
    expect(screen.getByTestId('inner-1-0')).toBeInTheDocument()
    expect(screen.getByTestId('inner-1-1')).toBeInTheDocument()

    expect(screen.getByTestId('inner-0-0')).toHaveTextContent('0-0')
    expect(screen.getByTestId('inner-1-1')).toHaveTextContent('1-1')
  })

  it('should handle fractional times by flooring', () => {
    render(
      <Repeat times={3.7}>
        {(index) => (
          <div key={index} data-testid={`item-${index}`}>
            Item
            {index}
          </div>
        )}
      </Repeat>
    )

    expect(screen.getByTestId('item-0')).toBeInTheDocument()
    expect(screen.getByTestId('item-1')).toBeInTheDocument()
    expect(screen.getByTestId('item-2')).toBeInTheDocument()
    expect(screen.queryByTestId('item-3')).not.toBeInTheDocument()
  })
})
