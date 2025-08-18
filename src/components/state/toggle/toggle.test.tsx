import { fireEvent, render, screen } from '@testing-library/react'
import { Toggle } from './toggle'

describe('toggle Component', () => {
  it('should render with initial state', () => {
    render(
      <Toggle initial={false}>
        {({ on, toggle }) => (
          <div>
            <span data-testid="value">{on ? 'ON' : 'OFF'}</span>
            <button type="button" data-testid="toggle" onClick={toggle}>
              Toggle
            </button>
          </div>
        )}
      </Toggle>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('OFF')
  })

  it('should toggle state when toggle function is called', () => {
    render(
      <Toggle initial={false}>
        {({ on, toggle }) => (
          <div>
            <span data-testid="value">{on ? 'ON' : 'OFF'}</span>
            <button type="button" data-testid="toggle" onClick={toggle}>
              Toggle
            </button>
          </div>
        )}
      </Toggle>
    )

    const toggleButton = screen.getByTestId('toggle')

    expect(screen.getByTestId('value')).toHaveTextContent('OFF')

    fireEvent.click(toggleButton)
    expect(screen.getByTestId('value')).toHaveTextContent('ON')

    fireEvent.click(toggleButton)
    expect(screen.getByTestId('value')).toHaveTextContent('OFF')
  })

  it('should call onChange when state changes', () => {
    const onChange = jest.fn()

    render(
      <Toggle initial={false} onChange={onChange}>
        {({ on, toggle }) => (
          <button type="button" data-testid="toggle" onClick={toggle}>
            {on ? 'ON' : 'OFF'}
          </button>
        )}
      </Toggle>
    )

    const toggleButton = screen.getByTestId('toggle')

    fireEvent.click(toggleButton)
    expect(onChange).toHaveBeenCalledWith(true)

    fireEvent.click(toggleButton)
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('should provide setOn and setOff functions', () => {
    render(
      <Toggle initial={false}>
        {({ on, setOn, setOff }) => (
          <div>
            <span data-testid="value">{on ? 'ON' : 'OFF'}</span>
            <button type="button" data-testid="set-on" onClick={setOn}>
              Set ON
            </button>
            <button type="button" data-testid="set-off" onClick={setOff}>
              Set OFF
            </button>
          </div>
        )}
      </Toggle>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('OFF')

    fireEvent.click(screen.getByTestId('set-on'))
    expect(screen.getByTestId('value')).toHaveTextContent('ON')

    fireEvent.click(screen.getByTestId('set-off'))
    expect(screen.getByTestId('value')).toHaveTextContent('OFF')
  })

  it('should work with true initial state', () => {
    render(
      <Toggle initial={true}>
        {({ on }) => <span data-testid="value">{on ? 'ON' : 'OFF'}</span>}
      </Toggle>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('ON')
  })

  it('should provide setState function', () => {
    const onChange = jest.fn()

    render(
      <Toggle initial={false} onChange={onChange}>
        {({ on, setState }) => (
          <div>
            <span data-testid="value">{on ? 'ON' : 'OFF'}</span>
            <button type="button" data-testid="set-true" onClick={() => setState(true)}>
              Set True
            </button>
            <button type="button" data-testid="set-false" onClick={() => setState(false)}>
              Set False
            </button>
          </div>
        )}
      </Toggle>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('OFF')

    fireEvent.click(screen.getByTestId('set-true'))
    expect(screen.getByTestId('value')).toHaveTextContent('ON')
    expect(onChange).toHaveBeenCalledWith(true)

    fireEvent.click(screen.getByTestId('set-false'))
    expect(screen.getByTestId('value')).toHaveTextContent('OFF')
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('should not call onChange when setOn is called and state is already true', () => {
    const onChange = jest.fn()

    render(
      <Toggle initial={true} onChange={onChange}>
        {({ on, setOn }) => (
          <div>
            <span data-testid="value">{on ? 'ON' : 'OFF'}</span>
            <button type="button" data-testid="set-on" onClick={setOn}>
              Set ON
            </button>
          </div>
        )}
      </Toggle>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('ON')

    fireEvent.click(screen.getByTestId('set-on'))
    expect(screen.getByTestId('value')).toHaveTextContent('ON')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('should not call onChange when setOff is called and state is already false', () => {
    const onChange = jest.fn()

    render(
      <Toggle initial={false} onChange={onChange}>
        {({ on, setOff }) => (
          <div>
            <span data-testid="value">{on ? 'ON' : 'OFF'}</span>
            <button type="button" data-testid="set-off" onClick={setOff}>
              Set OFF
            </button>
          </div>
        )}
      </Toggle>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('OFF')

    fireEvent.click(screen.getByTestId('set-off'))
    expect(screen.getByTestId('value')).toHaveTextContent('OFF')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('should not call onChange when setState is called with same value', () => {
    const onChange = jest.fn()

    render(
      <Toggle initial={true} onChange={onChange}>
        {({ on, setState }) => (
          <div>
            <span data-testid="value">{on ? 'ON' : 'OFF'}</span>
            <button type="button" data-testid="set-true" onClick={() => setState(true)}>
              Set True
            </button>
          </div>
        )}
      </Toggle>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('ON')

    fireEvent.click(screen.getByTestId('set-true'))
    expect(screen.getByTestId('value')).toHaveTextContent('ON')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('should work without onChange callback', () => {
    render(
      <Toggle initial={false}>
        {({ on, toggle }) => (
          <div>
            <span data-testid="value">{on ? 'ON' : 'OFF'}</span>
            <button type="button" data-testid="toggle" onClick={toggle}>
              Toggle
            </button>
          </div>
        )}
      </Toggle>
    )

    expect(screen.getByTestId('value')).toHaveTextContent('OFF')

    fireEvent.click(screen.getByTestId('toggle'))
    expect(screen.getByTestId('value')).toHaveTextContent('ON')
  })

  it('should have correct display name', () => {
    expect(Toggle.displayName).toBe('Toggle')
  })

  it('should provide all toggle state properties', () => {
    let capturedState: any = null

    render(
      <Toggle initial={false}>
        {(state) => {
          capturedState = state
          return <div data-testid="toggle">{state.on ? 'ON' : 'OFF'}</div>
        }}
      </Toggle>
    )

    expect(capturedState).toHaveProperty('on', false)
    expect(capturedState).toHaveProperty('toggle')
    expect(capturedState).toHaveProperty('setOn')
    expect(capturedState).toHaveProperty('setOff')
    expect(capturedState).toHaveProperty('setState')
    expect(typeof capturedState.toggle).toBe('function')
    expect(typeof capturedState.setOn).toBe('function')
    expect(typeof capturedState.setOff).toBe('function')
    expect(typeof capturedState.setState).toBe('function')
  })

  it('should handle default initial value', () => {
    render(<Toggle>{({ on }) => <span data-testid="value">{on ? 'ON' : 'OFF'}</span>}</Toggle>)

    expect(screen.getByTestId('value')).toHaveTextContent('OFF')
  })
})
