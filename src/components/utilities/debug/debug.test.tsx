import { render, screen } from '@testing-library/react'
import { Debug } from './debug'

describe('debug Component', () => {
  let originalConsole: typeof console
  let mockConsole: {
    group: ReturnType<typeof jest.fn>
    log: ReturnType<typeof jest.fn>
    groupEnd: ReturnType<typeof jest.fn>
  }

  beforeEach(() => {
    originalConsole = globalThis.console
    mockConsole = {
      group: jest.fn(),
      log: jest.fn(),
      groupEnd: jest.fn(),
    }
    globalThis.console = { ...originalConsole, ...mockConsole }
  })

  afterEach(() => {
    globalThis.console = originalConsole
  })

  it('should render children', () => {
    render(
      <Debug>
        <div data-testid="child">Test content</div>
      </Debug>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByTestId('child')).toHaveTextContent('Test content')
  })

  it('should log to console by default', () => {
    render(
      <Debug>
        <div>Test content</div>
      </Debug>
    )

    expect(mockConsole.group).toHaveBeenCalledWith('🐛 Debug')
    expect(mockConsole.log).toHaveBeenCalled()
    expect(mockConsole.groupEnd).toHaveBeenCalled()
  })

  it('should not log to console when disabled=true', () => {
    render(
      <Debug disabled={true}>
        <div>Test content</div>
      </Debug>
    )

    expect(mockConsole.group).not.toHaveBeenCalled()
    expect(mockConsole.log).not.toHaveBeenCalled()
    expect(mockConsole.groupEnd).not.toHaveBeenCalled()
  })

  it('should use custom label in console output', () => {
    render(
      <Debug label="Custom Label">
        <div>Test content</div>
      </Debug>
    )

    expect(mockConsole.group).toHaveBeenCalledWith('🐛 Custom Label')
  })

  it('should log debug info with timestamp', () => {
    const mockDate = '2023-01-01T00:00:00.000Z'
    const dateSpy = jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate)

    render(
      <Debug label="Test Debug">
        <div>Test content</div>
      </Debug>
    )

    expect(mockConsole.log).toHaveBeenCalledWith(
      'Debug Info:',
      expect.objectContaining({
        label: 'Test Debug',
        timestamp: mockDate,
        data: {},
        children: expect.anything(),
      })
    )

    dateSpy.mockRestore()
  })

  it('should log additional data when provided', () => {
    const testData = { userId: 123, userName: 'John' }

    render(
      <Debug data={testData}>
        <div>Test content</div>
      </Debug>
    )

    expect(mockConsole.log).toHaveBeenCalledWith('Additional Data:', testData)
  })

  it('should not log additional data when data is empty', () => {
    render(
      <Debug data={{}}>
        <div>Test content</div>
      </Debug>
    )

    // Should only call console.log once for debug info, not for additional data
    expect(mockConsole.log).toHaveBeenCalledTimes(1)
    expect(mockConsole.log).not.toHaveBeenCalledWith('Additional Data:', {})
  })

  it('should handle complex children', () => {
    render(
      <Debug>
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
          <button type="button">Click me</button>
        </div>
      </Debug>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Paragraph')).toBeInTheDocument()
    expect(screen.getByText('Click me')).toBeInTheDocument()
    expect(mockConsole.group).toHaveBeenCalled()
  })

  it('should handle multiple children', () => {
    render(
      <Debug>
        <div data-testid="first">First child</div>
        <div data-testid="second">Second child</div>
        <span data-testid="third">Third child</span>
      </Debug>
    )

    expect(screen.getByTestId('first')).toBeInTheDocument()
    expect(screen.getByTestId('second')).toBeInTheDocument()
    expect(screen.getByTestId('third')).toBeInTheDocument()
    expect(mockConsole.group).toHaveBeenCalled()
  })

  it('should handle null children', () => {
    const { container } = render(<Debug>{null}</Debug>)

    expect(container.firstChild).toBeNull()
    expect(mockConsole.group).toHaveBeenCalled()
  })

  it('should handle undefined children', () => {
    const { container } = render(<Debug>{undefined}</Debug>)

    expect(container.firstChild).toBeNull()
    expect(mockConsole.group).toHaveBeenCalled()
  })

  it('should handle function children', () => {
    const FunctionChild = () => <div data-testid="function-child">Function result</div>
    
    render(
      <Debug>
        <FunctionChild />
      </Debug>
    )

    expect(screen.getByTestId('function-child')).toBeInTheDocument()
    expect(mockConsole.group).toHaveBeenCalled()
  })

  it('should re-log when dependencies change', () => {
    const { rerender } = render(
      <Debug label="Initial" data={{ count: 1 }}>
        <div>Content</div>
      </Debug>
    )

    expect(mockConsole.group).toHaveBeenCalledTimes(1)

    rerender(
      <Debug label="Updated" data={{ count: 2 }}>
        <div>Content</div>
      </Debug>
    )

    expect(mockConsole.group).toHaveBeenCalledTimes(2)
    expect(mockConsole.group).toHaveBeenLastCalledWith('🐛 Updated')
  })

  it('should handle complex data objects', () => {
    const complexData = {
      user: { id: 1, name: 'John', preferences: { theme: 'dark' } },
      settings: { notifications: true },
      array: [1, 2, 3],
      nested: {
        deep: {
          value: 'test',
        },
      },
    }

    render(
      <Debug data={complexData}>
        <div>Test</div>
      </Debug>
    )

    expect(mockConsole.log).toHaveBeenCalledWith('Additional Data:', complexData)
  })

  it('should work with React fragments', () => {
    render(
      <Debug>
        <>
          <div data-testid="fragment-1">Fragment child 1</div>
          <div data-testid="fragment-2">Fragment child 2</div>
        </>
      </Debug>
    )

    expect(screen.getByTestId('fragment-1')).toBeInTheDocument()
    expect(screen.getByTestId('fragment-2')).toBeInTheDocument()
    expect(mockConsole.group).toHaveBeenCalled()
  })

  it('should maintain proper console group structure', () => {
    render(
      <Debug label="Test Group">
        <div>Content</div>
      </Debug>
    )

    // Verify the console calls are made in the correct order
    expect(mockConsole.group).toHaveBeenCalled()
    expect(mockConsole.log).toHaveBeenCalled()
    expect(mockConsole.groupEnd).toHaveBeenCalled()
  })
})
