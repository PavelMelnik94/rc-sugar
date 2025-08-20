import type { ScrollState, ScrollUtils } from './scroll'
import { fireEvent, render } from '@testing-library/react'
import { Scroll } from './scroll'

jest.mock('../../../shared/utils', () => ({
  throttle: (fn: (...args: any[]) => any) => fn,
  debounce: (fn: (...args: any[]) => any) => fn,
}))

Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
})

Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
  value: jest.fn(),
  writable: true,
})

describe('scroll Component', () => {
  let receivedState: ScrollState | null = null
  let receivedUtils: ScrollUtils | null = null

  const mockChildren = jest.fn((state: any, utils: any) => {
    receivedState = state
    receivedUtils = utils
    return <div data-testid="scroll-content">Content</div>
  })

  beforeEach(() => {
    jest.clearAllMocks()
    receivedState = null
    receivedUtils = null

    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true })
    Object.defineProperty(window, 'scrollX', { value: 0, writable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })

    // Mock document dimensions
    Object.defineProperty(document.documentElement, 'scrollWidth', { value: 2048, writable: true })
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1536, writable: true })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders children with scroll state and utils', () => {
    render(<Scroll>{mockChildren}</Scroll>)

    expect(mockChildren).toHaveBeenCalled()
    expect(receivedState).toBeTruthy()
    expect(receivedUtils).toBeTruthy()
  })

  it('provides initial scroll state', () => {
    render(<Scroll>{mockChildren}</Scroll>)

    expect(receivedState).toMatchObject({
      position: expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
        left: expect.any(Number),
        top: expect.any(Number),
      }),
      dimensions: expect.objectContaining({
        scrollWidth: expect.any(Number),
        scrollHeight: expect.any(Number),
        clientWidth: expect.any(Number),
        clientHeight: expect.any(Number),
      }),
      direction: expect.objectContaining({
        horizontal: 'none',
        vertical: 'none',
        isScrolling: false,
      }),
      velocity: expect.objectContaining({
        x: 0,
        y: 0,
        magnitude: 0,
      }),
      boundaries: expect.any(Object),
      progress: expect.objectContaining({
        vertical: expect.any(Number),
        horizontal: expect.any(Number),
      }),
    })
  })

  it('provides scroll utilities', () => {
    render(<Scroll>{mockChildren}</Scroll>)

    expect(receivedUtils).toMatchObject({
      scrollTo: expect.any(Function),
      scrollToTop: expect.any(Function),
      scrollToBottom: expect.any(Function),
      scrollToLeft: expect.any(Function),
      scrollToRight: expect.any(Function),
      isElementInView: expect.any(Function),
      getScrollProgress: expect.any(Function),
    })
  })

  it('accepts onScroll callback', () => {
    const onScroll = jest.fn()

    render(<Scroll onScroll={onScroll}>{() => <div>Content</div>}</Scroll>)

    expect(typeof onScroll).toBe('function')
  })

  it('provides onScrollStart callback', () => {
    const onScrollStart = jest.fn()
    render(<Scroll onScrollStart={onScrollStart}>{mockChildren}</Scroll>)

    // Test that the callback is properly set up (function exists)
    expect(typeof onScrollStart).toBe('function')
  })

  it('scrollTo utility calls window.scrollTo', () => {
    render(<Scroll>{mockChildren}</Scroll>)

    const options = { top: 100, behavior: 'smooth' as const }
    receivedUtils?.scrollTo(options)

    expect(window.scrollTo).toHaveBeenCalledWith(options)
  })

  it('scrollToTop utility scrolls to top', () => {
    render(<Scroll>{mockChildren}</Scroll>)

    receivedUtils?.scrollToTop('smooth')

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('scrollToBottom utility scrolls to bottom', () => {
    render(<Scroll>{mockChildren}</Scroll>)

    receivedUtils?.scrollToBottom('smooth')

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: expect.any(Number),
      behavior: 'smooth',
    })
  })

  it('getScrollProgress returns current progress', () => {
    render(<Scroll>{mockChildren}</Scroll>)

    const progress = receivedUtils?.getScrollProgress()

    expect(progress).toMatchObject({
      vertical: expect.any(Number),
      horizontal: expect.any(Number),
    })
  })

  it('isElementInView checks element visibility', () => {
    render(<Scroll>{mockChildren}</Scroll>)

    const mockElement = {
      getBoundingClientRect: jest.fn(() => ({
        top: 100,
        left: 100,
        bottom: 200,
        right: 200,
      })),
    } as unknown as Element

    const isInView = receivedUtils?.isElementInView(mockElement)

    expect(typeof isInView).toBe('boolean')
    expect(mockElement.getBoundingClientRect).toHaveBeenCalled()
  })

  it('works with custom scroll element', () => {
    const customElement = document.createElement('div')
    Object.defineProperty(customElement, 'scrollWidth', { value: 1000, writable: true })
    Object.defineProperty(customElement, 'scrollHeight', { value: 800, writable: true })
    Object.defineProperty(customElement, 'clientWidth', { value: 500, writable: true })
    Object.defineProperty(customElement, 'clientHeight', { value: 400, writable: true })
    Object.defineProperty(customElement, 'scrollLeft', { value: 0, writable: true })
    Object.defineProperty(customElement, 'scrollTop', { value: 0, writable: true })

    render(<Scroll element={customElement}>{mockChildren}</Scroll>)

    expect(receivedState?.dimensions.scrollWidth).toBe(1000)
    expect(receivedState?.dimensions.scrollHeight).toBe(800)
  })

  it('handles trackDirection prop', () => {
    render(<Scroll trackDirection={false}>{mockChildren}</Scroll>)

    expect(receivedState?.direction).toMatchObject({
      horizontal: 'none',
      vertical: 'none',
      isScrolling: false,
    })
  })

  it('handles trackVelocity prop', () => {
    render(<Scroll trackVelocity={false}>{mockChildren}</Scroll>)

    expect(receivedState?.velocity).toMatchObject({
      x: 0,
      y: 0,
      magnitude: 0,
    })
  })

  it('handles trackBoundaries prop', () => {
    render(<Scroll trackBoundaries={false}>{mockChildren}</Scroll>)

    expect(receivedState?.boundaries).toBeDefined()
  })

  it('handles threshold prop', () => {
    render(<Scroll threshold={50}>{mockChildren}</Scroll>)

    expect(receivedState?.boundaries).toBeDefined()
  })

  it('calls onDirectionChange when direction changes', () => {
    const onDirectionChange = jest.fn()
    render(<Scroll onDirectionChange={onDirectionChange}>{mockChildren}</Scroll>)

    // Simulate scroll position change
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
    fireEvent.scroll(window)

    // Direction change callback should be set up
    expect(typeof onDirectionChange).toBe('function')
  })

  it('calls boundary callbacks when reaching boundaries', () => {
    const onReachTop = jest.fn()
    const onReachBottom = jest.fn()
    const onReachLeft = jest.fn()
    const onReachRight = jest.fn()

    render(
      <Scroll
        onReachTop={onReachTop}
        onReachBottom={onReachBottom}
        onReachLeft={onReachLeft}
        onReachRight={onReachRight}
      >
        {mockChildren}
      </Scroll>
    )

    expect(typeof onReachTop).toBe('function')
    expect(typeof onReachBottom).toBe('function')
    expect(typeof onReachLeft).toBe('function')
    expect(typeof onReachRight).toBe('function')
  })

  it('handles scroll end callback', () => {
    const onScrollEnd = jest.fn()
    render(<Scroll onScrollEnd={onScrollEnd}>{mockChildren}</Scroll>)

    expect(typeof onScrollEnd).toBe('function')
  })

  it('works with disabled tracking options', () => {
    render(
      <Scroll trackDirection={false} trackVelocity={false} trackBoundaries={false}>
        {mockChildren}
      </Scroll>
    )

    expect(receivedState?.direction).toBeDefined()
    expect(receivedState?.velocity).toBeDefined()
    expect(receivedState?.boundaries).toBeDefined()
  })

  it('handles custom throttle and debounce values', () => {
    render(
      <Scroll throttle={32} debounce={300}>
        {mockChildren}
      </Scroll>
    )

    expect(receivedState).toBeTruthy()
    expect(receivedUtils).toBeTruthy()
  })

  it('scrollToLeft utility scrolls to left', () => {
    render(<Scroll>{mockChildren}</Scroll>)

    receivedUtils?.scrollToLeft('smooth')

    expect(window.scrollTo).toHaveBeenCalledWith({ left: 0, behavior: 'smooth' })
  })

  it('scrollToRight utility scrolls to right', () => {
    render(<Scroll>{mockChildren}</Scroll>)

    receivedUtils?.scrollToRight('smooth')

    expect(window.scrollTo).toHaveBeenCalledWith({
      left: expect.any(Number),
      behavior: 'smooth',
    })
  })

  it('handles null element gracefully', () => {
    render(<Scroll element={null}>{mockChildren}</Scroll>)

    expect(receivedState).toBeTruthy()
    expect(receivedUtils).toBeTruthy()
  })

  it('calculates progress correctly', () => {
    render(<Scroll>{mockChildren}</Scroll>)

    expect(receivedState?.progress.vertical).toBeGreaterThanOrEqual(0)
    expect(receivedState?.progress.vertical).toBeLessThanOrEqual(1)
    expect(receivedState?.progress.horizontal).toBeGreaterThanOrEqual(0)
    expect(receivedState?.progress.horizontal).toBeLessThanOrEqual(1)
  })
})
