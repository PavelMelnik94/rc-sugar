import { cleanup, render, screen } from '@testing-library/react'
import { Tap } from './tap'

describe('tap Component', () => {
  let originalEnv: string | undefined

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV
  })

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.NODE_ENV = originalEnv
    }
    cleanup()
  })

  it('should render children without affecting them', () => {
    render(
      <Tap>
        <div data-testid="child">Test content</div>
      </Tap>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByTestId('child')).toHaveTextContent('Test content')
  })

  it('should call onMount when component mounts', () => {
    const onMount = jest.fn()

    render(
      <Tap onMount={onMount}>
        <div>Content</div>
      </Tap>
    )

    expect(onMount).toHaveBeenCalledTimes(1)
  })

  it('should call onUnmount when component unmounts', () => {
    const onUnmount = jest.fn()

    const { unmount } = render(
      <Tap onUnmount={onUnmount}>
        <div>Content</div>
      </Tap>
    )

    expect(onUnmount).not.toHaveBeenCalled()

    unmount()

    expect(onUnmount).toHaveBeenCalledTimes(1)
  })

  it('should call onRender on every render', () => {
    const onRender = jest.fn()

    const { rerender } = render(
      <Tap onRender={onRender}>
        <div>Initial content</div>
      </Tap>
    )

    expect(onRender).toHaveBeenCalledTimes(1)

    rerender(
      <Tap onRender={onRender}>
        <div>Updated content</div>
      </Tap>
    )

    expect(onRender).toHaveBeenCalledTimes(2)
  })

  it('should call onChildrenChange when children change', () => {
    const onChildrenChange = jest.fn()

    const { rerender } = render(
      <Tap onChildrenChange={onChildrenChange}>
        <div>Initial content</div>
      </Tap>
    )

    // Should not be called on initial render
    expect(onChildrenChange).not.toHaveBeenCalled()

    rerender(
      <Tap onChildrenChange={onChildrenChange}>
        <div>Updated content</div>
      </Tap>
    )

    expect(onChildrenChange).toHaveBeenCalledTimes(1)
  })

  it('should not call onChildrenChange when children stay the same', () => {
    const onChildrenChange = jest.fn()
    const staticContent = <div>Static content</div>

    const { rerender } = render(<Tap onChildrenChange={onChildrenChange}>{staticContent}</Tap>)

    expect(onChildrenChange).not.toHaveBeenCalled()

    rerender(<Tap onChildrenChange={onChildrenChange}>{staticContent}</Tap>)

    expect(onChildrenChange).not.toHaveBeenCalled()
  })

  it('should call all callbacks appropriately', () => {
    const onMount = jest.fn()
    const onUnmount = jest.fn()
    const onRender = jest.fn()
    const onChildrenChange = jest.fn()

    const { rerender, unmount } = render(
      <Tap
        onMount={onMount}
        onUnmount={onUnmount}
        onRender={onRender}
        onChildrenChange={onChildrenChange}
      >
        <div>Initial</div>
      </Tap>
    )

    expect(onMount).toHaveBeenCalledTimes(1)
    expect(onRender).toHaveBeenCalledTimes(1)
    expect(onChildrenChange).not.toHaveBeenCalled()
    expect(onUnmount).not.toHaveBeenCalled()

    rerender(
      <Tap
        onMount={onMount}
        onUnmount={onUnmount}
        onRender={onRender}
        onChildrenChange={onChildrenChange}
      >
        <div>Updated</div>
      </Tap>
    )

    expect(onMount).toHaveBeenCalledTimes(1) // Should not be called again
    expect(onRender).toHaveBeenCalledTimes(2)
    expect(onChildrenChange).toHaveBeenCalledTimes(1)
    expect(onUnmount).not.toHaveBeenCalled()

    unmount()

    expect(onUnmount).toHaveBeenCalledTimes(1)
  })

  it('should work with devOnly=false by default', () => {
    const onMount = jest.fn()
    process.env.NODE_ENV = 'production'

    render(
      <Tap onMount={onMount}>
        <div>Content</div>
      </Tap>
    )

    expect(onMount).toHaveBeenCalledTimes(1)
  })

  it('should respect devOnly=true in development', () => {
    const onMount = jest.fn()
    process.env.NODE_ENV = 'development'

    render(
      <Tap onMount={onMount} devOnly={true}>
        <div>Content</div>
      </Tap>
    )

    expect(onMount).toHaveBeenCalledTimes(1)
  })

  it('should not execute callbacks when devOnly=true in production', () => {
    const onMount = jest.fn()
    const onRender = jest.fn()
    const onChildrenChange = jest.fn()
    process.env.NODE_ENV = 'production'

    const { rerender } = render(
      <Tap onMount={onMount} onRender={onRender} onChildrenChange={onChildrenChange} devOnly={true}>
        <div>Initial</div>
      </Tap>
    )

    expect(onMount).not.toHaveBeenCalled()
    expect(onRender).not.toHaveBeenCalled()

    rerender(
      <Tap onMount={onMount} onRender={onRender} onChildrenChange={onChildrenChange} devOnly={true}>
        <div>Updated</div>
      </Tap>
    )

    expect(onChildrenChange).not.toHaveBeenCalled()
  })

  it('should handle multiple children', () => {
    const onMount = jest.fn()

    render(
      <Tap onMount={onMount}>
        <div data-testid="first">First</div>
        <div data-testid="second">Second</div>
        <span data-testid="third">Third</span>
      </Tap>
    )

    expect(screen.getByTestId('first')).toBeInTheDocument()
    expect(screen.getByTestId('second')).toBeInTheDocument()
    expect(screen.getByTestId('third')).toBeInTheDocument()
    expect(onMount).toHaveBeenCalledTimes(1)
  })

  it('should handle null/undefined children', () => {
    const onMount = jest.fn()

    const { rerender } = render(<Tap onMount={onMount}>{null}</Tap>)

    expect(onMount).toHaveBeenCalledTimes(1)

    rerender(<Tap onMount={onMount}>{undefined}</Tap>)

    expect(onMount).toHaveBeenCalledTimes(1) // Should not remount
  })

  it('should handle complex children structures', () => {
    const onMount = jest.fn()
    const onChildrenChange = jest.fn()

    const { rerender } = render(
      <Tap onMount={onMount} onChildrenChange={onChildrenChange}>
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      </Tap>
    )

    expect(onMount).toHaveBeenCalledTimes(1)
    expect(onChildrenChange).not.toHaveBeenCalled()

    rerender(
      <Tap onMount={onMount} onChildrenChange={onChildrenChange}>
        <div>
          <h1>Updated Title</h1>
          <p>Updated Paragraph</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </div>
      </Tap>
    )

    expect(onChildrenChange).toHaveBeenCalledTimes(1)
  })

  it('should handle function components as children', () => {
    const onMount = jest.fn()

    function ChildComponent() {
      return <div data-testid="function-child">Function component</div>
    }

    render(
      <Tap onMount={onMount}>
        <ChildComponent />
      </Tap>
    )

    expect(screen.getByTestId('function-child')).toBeInTheDocument()
    expect(onMount).toHaveBeenCalledTimes(1)
  })

  it('should handle React fragments', () => {
    const onMount = jest.fn()

    render(
      <Tap onMount={onMount}>
        <>
          <div data-testid="fragment-1">Fragment 1</div>
          <div data-testid="fragment-2">Fragment 2</div>
        </>
      </Tap>
    )

    expect(screen.getByTestId('fragment-1')).toBeInTheDocument()
    expect(screen.getByTestId('fragment-2')).toBeInTheDocument()
    expect(onMount).toHaveBeenCalledTimes(1)
  })

  it('should not interfere with event handling in children', () => {
    const onClick = jest.fn()
    const onMount = jest.fn()

    render(
      <Tap onMount={onMount}>
        <button type="button" data-testid="button" onClick={onClick}>
          Click me
        </button>
      </Tap>
    )

    expect(onMount).toHaveBeenCalledTimes(1)

    const button = screen.getByTestId('button')
    button.click()

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
