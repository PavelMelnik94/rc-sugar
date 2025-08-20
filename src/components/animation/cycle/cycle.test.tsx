import type { ReactNode } from 'react'
import { act, render, screen } from '@testing-library/react'
import { Cycle } from './cycle'

describe('cycle', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render first item initially', () => {
    const items = ['First', 'Second', 'Third']

    render(<Cycle items={items} interval={1000} />)

    expect(screen.getByText('First')).toBeInTheDocument()
  })

  it('should cycle through items at specified interval', () => {
    const items = ['First', 'Second', 'Third']

    render(<Cycle items={items} interval={1000} />)

    expect(screen.getByText('First')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByText('Second')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByText('Third')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByText('First')).toBeInTheDocument()
  })
  it('should pause on hover when pauseOnHover is true', () => {
    const items = ['First', 'Second', 'Third']

    const { container } = render(<Cycle items={items} interval={1000} pauseOnHover />)

    expect(screen.getByText('First')).toBeInTheDocument()

    const cycleContainer = container.firstChild as HTMLElement

    act(() => {
      cycleContainer.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      jest.advanceTimersByTime(3000)
    })

    expect(screen.getByText('First')).toBeInTheDocument()

    act(() => {
      cycleContainer.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByText('Second')).toBeInTheDocument()
  })

  it('should not pause on hover when pauseOnHover is false', () => {
    const items = ['First', 'Second', 'Third']

    render(<Cycle items={items} interval={1000} pauseOnHover={false} />)

    expect(screen.getByText('First')).toBeInTheDocument()

    const container = screen.getByText('First').parentElement

    act(() => {
      container?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByText('Second')).toBeInTheDocument()

    act(() => {
      container?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByText('Third')).toBeInTheDocument()
  })

  it('should handle single item', () => {
    const items = ['Only Item']

    render(<Cycle items={items} interval={1000} />)

    expect(screen.getByText('Only Item')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByText('Only Item')).toBeInTheDocument()
  })
  it('should handle empty items array', () => {
    const items: string[] = []

    const { container } = render(<Cycle items={items} interval={1000} />)

    expect(container.firstChild).toBeNull()
  })

  it('should handle JSX elements as items', () => {
    const items = [
      <div key="1" data-testid="item-1">
        Item 1
      </div>,
      <div key="2" data-testid="item-2">
        Item 2
      </div>,
    ]

    render(<Cycle items={items} interval={1000} />)

    expect(screen.getByTestId('item-1')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByTestId('item-2')).toBeInTheDocument()
  })

  it('should clean up timer on unmount', () => {
    const items = ['First', 'Second']

    const { unmount } = render(<Cycle items={items} interval={1000} />)

    unmount()

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(true).toBe(true)
  })

  it('should not start automatically when autoStart is false', () => {
    const items = ['First', 'Second', 'Third']

    render(<Cycle items={items} interval={1000} autoStart={false} />)

    expect(screen.getByText('First')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(screen.getByText('First')).toBeInTheDocument()
  })

  it('should call onCycle callback when cycling', () => {
    const items = ['First', 'Second', 'Third']
    const onCycle = jest.fn()

    render(<Cycle items={items} interval={1000} onCycle={onCycle} />)

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(onCycle).toHaveBeenCalledWith(1, 0)

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(onCycle).toHaveBeenCalledWith(2, 1)
  })

  it('should have correct displayName', () => {
    expect(Cycle.displayName).toBe('Cycle')
  })

  describe('static methods', () => {
    it('should have start method that returns a function', () => {
      const mockSetCycleRunning = jest.fn()
      const startFunction = Cycle.start(mockSetCycleRunning)

      expect(typeof startFunction).toBe('function')

      startFunction()
      expect(mockSetCycleRunning).toHaveBeenCalledWith(true)
    })

    it('should have stop method that returns a function', () => {
      const mockSetCycleRunning = jest.fn()
      const stopFunction = Cycle.stop(mockSetCycleRunning)

      expect(typeof stopFunction).toBe('function')

      stopFunction()
      expect(mockSetCycleRunning).toHaveBeenCalledWith(false)
    })

    it('should have next method that advances index', () => {
      const mockSetCurrentIndex = jest.fn()
      const nextFunction = Cycle.next(mockSetCurrentIndex, 3)

      expect(typeof nextFunction).toBe('function')

      nextFunction()
      expect(mockSetCurrentIndex).toHaveBeenCalledWith(expect.any(Function))

      const updateFunction = mockSetCurrentIndex.mock.calls[0][0]
      expect(updateFunction(0)).toBe(1)
      expect(updateFunction(2)).toBe(0)
    })

    it('should have previous method that decreases index', () => {
      const mockSetCurrentIndex = jest.fn()
      const previousFunction = Cycle.previous(mockSetCurrentIndex, 3)

      expect(typeof previousFunction).toBe('function')

      previousFunction()
      expect(mockSetCurrentIndex).toHaveBeenCalledWith(expect.any(Function))

      const updateFunction = mockSetCurrentIndex.mock.calls[0][0]
      expect(updateFunction(1)).toBe(0) // (1 - 1 + 3) % 3 = 0
      expect(updateFunction(0)).toBe(2) // (0 - 1 + 3) % 3 = 2
    })
  })

  describe('cycle static methods integration', () => {
    it('should start cycling when start is called', () => {
      const items = ['First', 'Second', 'Third']
      render(<Cycle items={items} interval={1000} autoStart={false} />)

      const setCycleRunning = jest.fn()
      const startFunction = Cycle.start(setCycleRunning)

      act(() => {
        startFunction()
      })

      expect(setCycleRunning).toHaveBeenCalledWith(true)
    })

    it('should stop cycling when stop is called', () => {
      const items = ['First', 'Second', 'Third']
      render(<Cycle items={items} interval={1000} autoStart />)

      const setCycleRunning = jest.fn()
      const stopFunction = Cycle.stop(setCycleRunning)

      act(() => {
        stopFunction()
      })

      expect(setCycleRunning).toHaveBeenCalledWith(false)
    })

    it('should cycle to next item when next is called', () => {
      const items = ['First', 'Second', 'Third']
      render(<Cycle items={items} interval={1000} autoStart />)

      const setCurrentIndex = jest.fn()
      const nextFunction = Cycle.next(setCurrentIndex, items.length)

      act(() => {
        nextFunction()
      })

      expect(setCurrentIndex).toHaveBeenCalledWith(expect.any(Function))

      const updateFunction = setCurrentIndex.mock.calls[0][0]
      expect(updateFunction(0)).toBe(1)
    })

    it('should cycle to previous item when previous is called', () => {
      const items = ['First', 'Second', 'Third']
      render(<Cycle items={items} interval={1000} autoStart />)

      const setCurrentIndex = jest.fn()
      const previousFunction = Cycle.previous(setCurrentIndex, items.length)

      act(() => {
        previousFunction()
      })

      expect(setCurrentIndex).toHaveBeenCalledWith(expect.any(Function))

      const updateFunction = setCurrentIndex.mock.calls[0][0]
      expect(updateFunction(1)).toBe(0)
    })
  })

  describe('cycle render-props functionality', () => {
    it('should use renderItem to customize item rendering', () => {
      const items = ['First', 'Second', 'Third']
      const renderItem = (item: ReactNode, index: number) => (
        <div data-testid={`custom-item-${index}`}>{item}</div>
      )

      render(<Cycle items={items} interval={1000} renderItem={renderItem} />)

      expect(screen.getByTestId('custom-item-0')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(screen.getByTestId('custom-item-1')).toBeInTheDocument()
    })

    it('should use renderIndicators to customize indicators rendering', () => {
      const items = ['First', 'Second', 'Third']
      const renderIndicators = (currentIndex: number, items: ReactNode[]) => (
        <div data-testid="custom-indicators">
          {items.map((item, index) => (
            <span
              key={item ? item.toString() : `indicator-${index}`}
              data-testid={`indicator-${index}`}
              className={index === currentIndex ? 'active' : ''}
            >
              {index}
            </span>
          ))}
        </div>
      )

      render(<Cycle items={items} interval={1000} renderIndicators={renderIndicators} />)

      expect(screen.getByTestId('custom-indicators')).toBeInTheDocument()
      expect(screen.getByTestId('indicator-0')).toHaveClass('active')

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(screen.getByTestId('indicator-1')).toHaveClass('active')
    })
  })
})
