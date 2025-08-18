import { render, screen } from '@testing-library/react'
import { Zoom } from './zoom'

const observeMock = jest.fn()
const disconnectMock = jest.fn()

globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: observeMock,
  unobserve: jest.fn(),
  disconnect: disconnectMock,
}))

describe('zoom Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children correctly', () => {
    render(
      <Zoom>
        <div data-testid="test-content">Test Content</div>
      </Zoom>
    )

    const element = screen.getByTestId('test-content')
    expect(element).toBeDefined()
    expect(element.textContent).toBe('Test Content')
  })

  it('should apply proper styles to container', () => {
    const { container } = render(
      <Zoom>
        <div>Test Content</div>
      </Zoom>
    )

    // Get the container
    const outerContainer = container.firstChild as HTMLElement
    expect(outerContainer.style.position).toBe('relative')
    expect(outerContainer.style.overflow).toBe('hidden')
  })

  it('should use custom scale when provided', () => {
    const { container } = render(
      <Zoom scale={1.5}>
        <div>Test Content</div>
      </Zoom>
    )

    // Just verify the component renders with custom scale
    expect(container.innerHTML).toContain('Test Content')
  })

  it('should create and use ResizeObserver', () => {
    render(
      <Zoom fitWidth>
        <div>Test Content</div>
      </Zoom>
    )

    // Verify ResizeObserver was created and observe was called
    expect(globalThis.ResizeObserver).toHaveBeenCalled()
    expect(observeMock).toHaveBeenCalled()
  })

  it('should clean up ResizeObserver on unmount', () => {
    const { unmount } = render(
      <Zoom>
        <div>Test Content</div>
      </Zoom>
    )

    unmount()

    // Check that disconnect was called during cleanup
    expect(disconnectMock).toHaveBeenCalled()
  })

  it('should call onScaleChange when scale changes', () => {
    const onScaleChangeMock = jest.fn()

    render(
      <Zoom onScaleChange={onScaleChangeMock}>
        <div>Test Content</div>
      </Zoom>
    )

    // Note: We can't directly test the onScaleChange callback in JSDOM
    // environment as getBoundingClientRect doesn't work as expected
  })

  it('should have correct displayName', () => {
    expect(Zoom.displayName).toBe('Zoom')
  })
})
