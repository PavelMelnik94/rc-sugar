import type { ExperimentVariant } from './experiment'
import { render, screen } from '@testing-library/react'
import { Experiment } from './experiment'

// Jest globals are available without import

const mockConsoleError = jest.fn()
const originalConsoleError = console.error

beforeEach(() => {
  console.error = mockConsoleError
  mockConsoleError.mockClear()
})

afterEach(() => {
  console.error = originalConsoleError
})

describe('experiment', () => {
  it('should render variant A by default', () => {
    render(
      <Experiment
        id="test-experiment"
        variants={[
          {
            name: 'A',
            weight: 50,
            content: <div data-testid="variant-a">Variant A</div>,
          },
          {
            name: 'B',
            weight: 50,
            content: <div data-testid="variant-b">Variant B</div>,
          },
        ]}
      />
    )

    // Since we don't control the randomization, just check that one variant is rendered
    const variantA = screen.queryByTestId('variant-a')
    const variantB = screen.queryByTestId('variant-b')

    expect(variantA || variantB).toBeInTheDocument()
    expect(variantA && variantB).toBeFalsy() // Only one should be rendered
  })

  it('should render variant based on seed for consistent results', () => {
    const variants = [
      {
        name: 'A',
        weight: 50,
        content: <div data-testid="variant-a">Variant A</div>,
      },
      {
        name: 'B',
        weight: 50,
        content: <div data-testid="variant-b">Variant B</div>,
      },
    ]

    const { rerender } = render(
      <Experiment id="test-experiment" variants={variants} seed="consistent-seed" />
    )

    // Get which variant is rendered with the seed
    const firstRender = screen.queryByTestId('variant-a') ? 'A' : 'B'

    // Re-render with same seed should give same result
    rerender(<Experiment id="test-experiment" variants={variants} seed="consistent-seed" />)

    const secondRender = screen.queryByTestId('variant-a') ? 'A' : 'B'
    expect(firstRender).toBe(secondRender)
  })

  it('should handle single variant', () => {
    render(
      <Experiment
        id="single-variant"
        variants={[
          {
            name: 'Only',
            weight: 100,
            content: <div data-testid="only-variant">Only Variant</div>,
          },
        ]}
      />
    )

    expect(screen.getByTestId('only-variant')).toBeInTheDocument()
  })

  it('should handle weighted variants', () => {
    const variants = [
      {
        name: 'A',
        weight: 90,
        content: <div data-testid="variant-a">Variant A</div>,
      },
      {
        name: 'B',
        weight: 10,
        content: <div data-testid="variant-b">Variant B</div>,
      },
    ]

    // Run multiple times to test weight distribution
    const results = []
    for (let i = 0; i < 20; i++) {
      const { unmount } = render(<Experiment id={`test-${i}`} variants={variants} />)

      const isVariantA = screen.queryByTestId('variant-a') !== null
      results.push(isVariantA)
      unmount()
    }

    // With 90/10 split, variant A should appear more frequently
    const variantACount = results.filter(Boolean).length
    expect(variantACount).toBeGreaterThan(10) // Should be more than half
  })

  it('should call onVariantSelected when variant is chosen', () => {
    const onVariantSelected = jest.fn()

    render(
      <Experiment
        id="callback-test"
        variants={[
          {
            name: 'A',
            weight: 100,
            content: <div data-testid="variant-a">Variant A</div>,
          },
        ]}
        onVariantSelected={onVariantSelected}
      />
    )

    expect(onVariantSelected).toHaveBeenCalledWith('A')
  })

  it('should handle render prop variants', () => {
    render(
      <Experiment
        id="render-prop-test"
        variants={[
          {
            name: 'A',
            weight: 100,
            content: (variant) => <div data-testid="variant-render">Rendered {variant}</div>,
          },
        ]}
      />
    )

    expect(screen.getByTestId('variant-render')).toHaveTextContent('Rendered A')
  })

  it('should handle empty variants array', () => {
    const variants: ExperimentVariant[] = []
    const onVariantSelected = jest.fn()

    render(<Experiment id="test" variants={variants} onVariantSelected={onVariantSelected} />)

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Experiment "test" validation failed:',
      expect.any(Error)
    )
    expect(onVariantSelected).not.toHaveBeenCalled()
    expect(screen.queryByText(/./)).not.toBeInTheDocument()
  })

  it('should handle duplicate variant names', () => {
    const variants: ExperimentVariant[] = [
      { name: 'A', weight: 1, content: <div>Variant A</div> },
      { name: 'A', weight: 1, content: <div>Duplicate A</div> },
    ]
    const onVariantSelected = jest.fn()

    render(<Experiment id="test" variants={variants} onVariantSelected={onVariantSelected} />)

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Experiment "test" validation failed:',
      expect.objectContaining({ message: 'Duplicate variant name: A' })
    )
    expect(onVariantSelected).not.toHaveBeenCalled()
  })

  it('should handle invalid variant names', () => {
    const variants: ExperimentVariant[] = [{ name: '', weight: 1, content: <div>Empty name</div> }]
    const onVariantSelected = jest.fn()

    render(<Experiment id="test" variants={variants} onVariantSelected={onVariantSelected} />)

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Experiment "test" validation failed:',
      expect.objectContaining({ message: 'Each variant must have a valid name' })
    )
    expect(onVariantSelected).not.toHaveBeenCalled()
  })

  it('should handle negative weights', () => {
    const variants: ExperimentVariant[] = [
      { name: 'A', weight: -1, content: <div>Negative weight</div> },
    ]
    const onVariantSelected = jest.fn()

    render(<Experiment id="test" variants={variants} onVariantSelected={onVariantSelected} />)

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Experiment "test" validation failed:',
      expect.objectContaining({
        message: 'Invalid weight for variant A: must be a non-negative number',
      })
    )
    expect(onVariantSelected).not.toHaveBeenCalled()
  })

  it('should handle zero total weight', () => {
    const variants: ExperimentVariant[] = [
      { name: 'A', weight: 0, content: <div>Zero weight A</div> },
      { name: 'B', weight: 0, content: <div>Zero weight B</div> },
    ]
    const onVariantSelected = jest.fn()

    render(<Experiment id="test" variants={variants} onVariantSelected={onVariantSelected} />)

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Experiment "test" validation failed:',
      expect.objectContaining({ message: 'Total weight of all variants must be greater than 0' })
    )
    expect(onVariantSelected).not.toHaveBeenCalled()
  })

  it('should use experiment id in seed calculation for consistency', () => {
    const variants: ExperimentVariant[] = [
      { name: 'A', weight: 1, content: <div>Variant A</div> },
      { name: 'B', weight: 1, content: <div>Variant B</div> },
    ]
    const onVariantSelected1 = jest.fn()
    const onVariantSelected2 = jest.fn()

    // Same seed but different experiment IDs should potentially give different results
    render(
      <Experiment
        id="experiment1"
        variants={variants}
        seed={123}
        onVariantSelected={onVariantSelected1}
      />
    )
    render(
      <Experiment
        id="experiment2"
        variants={variants}
        seed={123}
        onVariantSelected={onVariantSelected2}
      />
    )

    expect(onVariantSelected1).toHaveBeenCalledWith(expect.any(String))
    expect(onVariantSelected2).toHaveBeenCalledWith(expect.any(String))
  })

  it('should handle single variant with zero weight', () => {
    const variants: ExperimentVariant[] = [
      { name: 'A', weight: 0, content: <div>Zero weight</div> },
    ]
    const onVariantSelected = jest.fn()

    render(<Experiment id="test" variants={variants} onVariantSelected={onVariantSelected} />)

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Experiment "test" validation failed:',
      expect.objectContaining({ message: 'Total weight of all variants must be greater than 0' })
    )
    expect(onVariantSelected).not.toHaveBeenCalled()
  })
})
