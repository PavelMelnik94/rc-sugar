import { act, render, screen } from '@testing-library/react'
import React from 'react'
import { Focus } from './focus'

describe('focus Component', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render child element', () => {
    render(
      <Focus>
        <input data-testid="input" placeholder="Test input" />
      </Focus>
    )

    expect(screen.getByTestId('input')).toBeInTheDocument()
  })

  it('should focus element on mount when autoFocus is true', () => {
    const mockFocus = jest.fn()

    render(
      <Focus autoFocus>
        <input data-testid="input" ref={(el) => {
          if (el) {
            el.focus = mockFocus
          }
        }} />
      </Focus>
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(mockFocus).toHaveBeenCalled()
  })

  it('should handle focus with delay', () => {
    const mockFocus = jest.fn()

    render(
      <Focus autoFocus delay={500}>
        <input data-testid="input" ref={(el) => {
          if (el) {
            el.focus = mockFocus
          }
        }} />
      </Focus>
    )

    // Should not focus immediately
    expect(mockFocus).not.toHaveBeenCalled()

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(mockFocus).toHaveBeenCalled()
  })

  it('should call onFocus callback when focusing', () => {
    const mockOnFocus = jest.fn()
    const mockFocus = jest.fn()

    render(
      <Focus autoFocus onFocus={mockOnFocus}>
        <input data-testid="input" ref={(el) => {
          if (el) {
            el.focus = mockFocus
          }
        }} />
      </Focus>
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(mockOnFocus).toHaveBeenCalled()
  })

  it('should handle selectText option', () => {
    const mockFocus = jest.fn()
    const mockSelect = jest.fn()

    render(
      <Focus autoFocus selectText>
        <input
          data-testid="input"
          ref={(el) => {
            if (el) {
              el.focus = mockFocus
              el.select = mockSelect
            }
          }}
        />
      </Focus>
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(mockFocus).toHaveBeenCalled()
    expect(mockSelect).toHaveBeenCalled()
  })

  it('should handle preventScroll option', () => {
    const mockFocus = jest.fn()

    render(
      <Focus autoFocus preventScroll>
        <input data-testid="input" ref={(el) => { if (el) el.focus = mockFocus }} />
      </Focus>
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(mockFocus).toHaveBeenCalledWith({ preventScroll: true })
  })

  it('should handle different input types', () => {
    render(
      <Focus>
        <textarea data-testid="textarea" placeholder="Text area" />
      </Focus>
    )

    expect(screen.getByTestId('textarea')).toBeInTheDocument()
  })

  it('should handle button elements', () => {
    render(
      <Focus>
        <button type="button" data-testid="button">Click me</button>
      </Focus>
    )

    expect(screen.getByTestId('button')).toBeInTheDocument()
  })

  it('should not focus when autoFocus is false', () => {
    const mockFocus = jest.fn()

    render(
      <Focus autoFocus={false}>
        <input data-testid="input" ref={(el) => { if (el) el.focus = mockFocus }} />
      </Focus>
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(mockFocus).not.toHaveBeenCalled()
  })

  it('should preserve existing props on child element', () => {
    render(
      <Focus>
        <input
          data-testid="input"
          className="existing-class"
          disabled
          placeholder="Existing placeholder"
        />
      </Focus>
    )

    const input = screen.getByTestId('input')
    expect(input).toHaveClass('existing-class')
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('placeholder', 'Existing placeholder')
  })

  it('should throw error for invalid children', () => {
    class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
      constructor(props: any) {
        super(props)
        this.state = { hasError: false, error: null }
      }

      static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
      }

      render() {
        if ((this.state as any).hasError) {
          return (
            <div>
              Error:
              {(this.state as any).error.message}
            </div>
          )
        }
        return this.props.children
      }
    }

    render(
      <ErrorBoundary>
        <Focus>{'not a valid element' as any}</Focus>
      </ErrorBoundary>
    )

    expect(
      screen.getByText(/Focus component requires a single valid React element as child/)
    ).toBeInTheDocument()
  })

  it('should handle element without select method when selectText is true', () => {
    const mockFocus = jest.fn()

    render(
      <Focus autoFocus selectText>
        <button type="button" data-testid="button" ref={(el) => { if (el) el.focus = mockFocus }}>
          Button without select
        </button>
      </Focus>
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(mockFocus).toHaveBeenCalled()
    // Should not throw error even though select doesn't exist
  })

  it('should handle existing function ref', () => {
    const existingRef = jest.fn()
    const mockFocus = jest.fn()

    render(
      <Focus autoFocus>
        <input
          data-testid="input"
          ref={(el) => {
            existingRef(el)
            if (el) el.focus = mockFocus
          }}
        />
      </Focus>
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(existingRef).toHaveBeenCalled()
    expect(mockFocus).toHaveBeenCalled()
  })

  it('should handle existing object ref', () => {
    const existingRef = { current: null as HTMLInputElement | null }
    const mockFocus = jest.fn()

    render(
      <Focus autoFocus>
        <input
          data-testid="input"
          ref={(el) => {
            existingRef.current = el
            if (el) el.focus = mockFocus
          }}
        />
      </Focus>
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(existingRef.current).toBeTruthy()
    expect(mockFocus).toHaveBeenCalled()
  })

  it('should handle whenVisible with IntersectionObserver', () => {
    // Mock IntersectionObserver
    const mockObserve = jest.fn()
    const mockDisconnect = jest.fn()
    const mockIntersectionObserver = jest.fn(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
    }))

    const originalIntersectionObserver = globalThis.IntersectionObserver
    globalThis.IntersectionObserver = mockIntersectionObserver as any

    render(
      <Focus whenVisible>
        <button type="button" data-testid="button">Focus when visible</button>
      </Focus>
    )

    expect(mockIntersectionObserver).toHaveBeenCalled()
    expect(mockObserve).toHaveBeenCalled()

    // Restore original
    globalThis.IntersectionObserver = originalIntersectionObserver
  })

  it('should focus when element becomes visible', () => {
    let observerCallback: (entries: any[]) => void

    const mockObserve = jest.fn()
    const mockDisconnect = jest.fn()
    const IntersectionObserverMock = jest.fn((callback) => {
      observerCallback = callback
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
      }
    })
      ; (globalThis as any).IntersectionObserver = IntersectionObserverMock

    const mockFocus = jest.fn()

    render(
      <Focus autoFocus whenVisible>
        <input data-testid="input" ref={(el) => { if (el) el.focus = mockFocus }} />
      </Focus>
    )

    // Simulate element becoming visible
    act(() => {
      observerCallback([{ isIntersecting: true }])
    })

    expect(mockFocus).toHaveBeenCalled()
    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('should focus with delay when element becomes visible', () => {
    let observerCallback: (entries: any[]) => void

    const mockObserve = jest.fn()
    const mockDisconnect = jest.fn()
    const IntersectionObserverMock = jest.fn((callback) => {
      observerCallback = callback
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
      }
    })
      ; (globalThis as any).IntersectionObserver = IntersectionObserverMock

    const mockFocus = jest.fn()

    render(
      <Focus autoFocus whenVisible delay={100}>
        <input data-testid="input" ref={(el) => { if (el) el.focus = mockFocus }} />
      </Focus>
    )

    // Simulate element becoming visible
    act(() => {
      observerCallback([{ isIntersecting: true }])
    })

    // Should not focus immediately
    expect(mockFocus).not.toHaveBeenCalled()

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(100)
    })

    expect(mockFocus).toHaveBeenCalled()
    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('should not focus when element is not intersecting', () => {
    let observerCallback: (entries: any[]) => void

    const mockObserve = jest.fn()
    const mockDisconnect = jest.fn()
    const IntersectionObserverMock = jest.fn((callback) => {
      observerCallback = callback
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
      }
    })
      ; (globalThis as any).IntersectionObserver = IntersectionObserverMock

    const mockFocus = jest.fn()

    render(
      <Focus autoFocus whenVisible>
        <input data-testid="input" ref={(el) => { if (el) el.focus = mockFocus }} />
      </Focus>
    )

    // Simulate element not being visible
    act(() => {
      observerCallback([{ isIntersecting: false }])
    })

    expect(mockFocus).not.toHaveBeenCalled()
    expect(mockDisconnect).not.toHaveBeenCalled()
  })

  it('should have correct displayName', () => {
    expect(Focus.displayName).toBe('Focus')
  })

  it('should handle child element with existing object ref', () => {
    const existingRef = { current: null as HTMLInputElement | null }
    const mockFocus = jest.fn()

    const InputWithRef = ({ ref, ...props }: { ref?: React.Ref<HTMLInputElement>; [key: string]: any }) => (
      <input
        {...props}
        data-testid="input"
        ref={(el) => {
          if (ref) {
            if (typeof ref === 'function') {
              ref(el)
            } else {
              ; (ref as any).current = el
            }
          }
          if (el) el.focus = mockFocus
        }}
      />
    )

    render(
      <Focus autoFocus>
        <InputWithRef ref={existingRef} />
      </Focus>
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(existingRef.current).toBeTruthy()
    expect(mockFocus).toHaveBeenCalled()
  })
})
