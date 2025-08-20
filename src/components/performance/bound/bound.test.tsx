import { render, screen } from '@testing-library/react'
import { Bound } from './bound'

describe('bound Component', () => {
  it('should render value within bounds unchanged', () => {
    render(
      <Bound value={50} min={0} max={100}>
        {(boundedValue) => <div data-testid="bounded-value">{boundedValue}</div>}
      </Bound>
    )

    expect(screen.getByTestId('bounded-value')).toHaveTextContent('50')
  })

  it('should clamp value above maximum to maximum', () => {
    render(
      <Bound value={150} min={0} max={100}>
        {(boundedValue) => <div data-testid="bounded-value">{boundedValue}</div>}
      </Bound>
    )

    expect(screen.getByTestId('bounded-value')).toHaveTextContent('100')
  })

  it('should clamp value below minimum to minimum', () => {
    render(
      <Bound value={-10} min={0} max={100}>
        {(boundedValue) => <div data-testid="bounded-value">{boundedValue}</div>}
      </Bound>
    )

    expect(screen.getByTestId('bounded-value')).toHaveTextContent('0')
  })

  it('should handle negative bounds', () => {
    render(
      <Bound value={-50} min={-100} max={-10}>
        {(boundedValue) => <div data-testid="bounded-value">{boundedValue}</div>}
      </Bound>
    )

    expect(screen.getByTestId('bounded-value')).toHaveTextContent('-50')
  })

  it('should clamp to negative maximum', () => {
    render(
      <Bound value={5} min={-100} max={-10}>
        {(boundedValue) => <div data-testid="bounded-value">{boundedValue}</div>}
      </Bound>
    )

    expect(screen.getByTestId('bounded-value')).toHaveTextContent('-10')
  })

  it('should call onClamp callback when value is clamped above max', () => {
    const mockOnClamp = jest.fn()

    render(
      <Bound value={150} min={0} max={100} onClamp={mockOnClamp}>
        {(boundedValue) => <div data-testid="bounded-value">{boundedValue}</div>}
      </Bound>
    )

    expect(mockOnClamp).toHaveBeenCalledWith(150, 100)
    expect(screen.getByTestId('bounded-value')).toHaveTextContent('100')
  })

  it('should call onClamp callback when value is clamped below min', () => {
    const mockOnClamp = jest.fn()

    render(
      <Bound value={-20} min={0} max={100} onClamp={mockOnClamp}>
        {(boundedValue) => <div data-testid="bounded-value">{boundedValue}</div>}
      </Bound>
    )

    expect(mockOnClamp).toHaveBeenCalledWith(-20, 0)
    expect(screen.getByTestId('bounded-value')).toHaveTextContent('0')
  })

  it('should not call onClamp callback when value is within bounds', () => {
    const mockOnClamp = jest.fn()

    render(
      <Bound value={50} min={0} max={100} onClamp={mockOnClamp}>
        {(boundedValue) => <div data-testid="bounded-value">{boundedValue}</div>}
      </Bound>
    )

    expect(mockOnClamp).not.toHaveBeenCalled()
    expect(screen.getByTestId('bounded-value')).toHaveTextContent('50')
  })

  it('should handle floating point values', () => {
    render(
      <Bound value={3.141_59} min={0} max={5}>
        {(boundedValue) => <div data-testid="bounded-value">{boundedValue}</div>}
      </Bound>
    )

    expect(screen.getByTestId('bounded-value')).toHaveTextContent('3.14159')
  })

  it('should handle edge case where value equals min', () => {
    render(
      <Bound value={0} min={0} max={100}>
        {(boundedValue) => <div data-testid="bounded-value">{boundedValue}</div>}
      </Bound>
    )

    expect(screen.getByTestId('bounded-value')).toHaveTextContent('0')
  })

  it('should handle edge case where value equals max', () => {
    render(
      <Bound value={100} min={0} max={100}>
        {(boundedValue) => <div data-testid="bounded-value">{boundedValue}</div>}
      </Bound>
    )

    expect(screen.getByTestId('bounded-value')).toHaveTextContent('100')
  })

  it('should handle render prop with complex content', () => {
    render(
      <Bound value={75} min={0} max={100}>
        {(boundedValue) => (
          <div>
            <span data-testid="label">Progress:</span>
            <span data-testid="value">{boundedValue}%</span>
            <span data-testid="status">{boundedValue >= 50 ? 'Good' : 'Needs work'}</span>
          </div>
        )}
      </Bound>
    )

    expect(screen.getByTestId('label')).toHaveTextContent('Progress:')
    expect(screen.getByTestId('value')).toHaveTextContent('75%')
    expect(screen.getByTestId('status')).toHaveTextContent('Good')
  })
})
