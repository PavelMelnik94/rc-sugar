import { render, screen } from '@testing-library/react'
import { Mirror } from './mirror'

describe('mirror', () => {
  it('should render cloned element with original props', () => {
    const originalElement = <div data-testid="original">Hello World</div>

    render(<Mirror element={originalElement} />)

    expect(screen.getByTestId('original')).toBeInTheDocument()
    expect(screen.getByTestId('original')).toHaveTextContent('Hello World')
  })

  it('should merge new props with original props', () => {
    const originalElement = (
      <div data-testid="element" className="original">
        Content
      </div>
    )

    render(<Mirror element={originalElement} className="added" id="new-id" />)

    const element = screen.getByTestId('element')
    expect(element).toHaveClass('added')
    expect(element).toHaveAttribute('id', 'new-id')
    expect(element).toHaveTextContent('Content')
  })

  it('should override original props with new props', () => {
    const originalElement = (
      <div data-testid="element" className="original" id="old-id">
        Content
      </div>
    )

    render(<Mirror element={originalElement} className="new-class" id="new-id" />)

    const element = screen.getByTestId('element')
    expect(element).toHaveClass('new-class')
    expect(element).not.toHaveClass('original')
    expect(element).toHaveAttribute('id', 'new-id')
  })

  it('should handle elements with children', () => {
    const originalElement = (
      <div data-testid="parent">
        <span>Child 1</span>
        <span>Child 2</span>
      </div>
    )

    render(<Mirror element={originalElement} className="parent-class" />)

    const parent = screen.getByTestId('parent')
    expect(parent).toHaveClass('parent-class')
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  it('should work with functional components', () => {
    const CustomComponent = ({ message, className }: { message: string; className?: string }) => (
      <div data-testid="custom" className={className}>
        {message}
      </div>
    )

    const originalElement = <CustomComponent message="Original Message" />

    render(<Mirror element={originalElement} className="mirrored" />)

    const element = screen.getByTestId('custom')
    expect(element).toHaveTextContent('Original Message')
    expect(element).toHaveClass('mirrored')
  })

  it('should return null and warn when element is not a valid React element', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    const { container } = render(<Mirror element={'not an element' as any} />)

    expect(container.firstChild).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith('Mirror: element prop must be a valid React element')

    consoleSpy.mockRestore()
  })

  it('should return null and warn when element is null', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    const { container } = render(<Mirror element={null as any} />)

    expect(container.firstChild).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith('Mirror: element prop must be a valid React element')

    consoleSpy.mockRestore()
  })

  it('should return null and warn when element is undefined', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

    const { container } = render(<Mirror element={undefined as any} />)

    expect(container.firstChild).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith('Mirror: element prop must be a valid React element')

    consoleSpy.mockRestore()
  })

  it('should have correct displayName', () => {
    expect(Mirror.displayName).toBe('Mirror')
  })
})
