import { render, screen } from '@testing-library/react'
import { Lock } from './lock'
import '@testing-library/jest-dom'

describe('lock Component', () => {
  let originalOverflow: string

  beforeEach(() => {
    originalOverflow = document.body.style.overflow
  })

  afterEach(() => {
    document.body.style.overflow = originalOverflow
  })

  it('should render children when not locked', () => {
    render(
      <Lock when={false}>
        <div>Test Content</div>
      </Lock>
    )

    const content = screen.getByText('Test Content')
    expect(content).toBeInTheDocument()
    expect(content.parentElement).not.toHaveStyle({ pointerEvents: 'none' })
  })

  it('should lock children when when=true', () => {
    render(
      <Lock when={true}>
        <div>Test Content</div>
      </Lock>
    )

    const content = screen.getByText('Test Content')
    expect(content).toBeInTheDocument()
    expect(content.parentElement).toHaveStyle({
      pointerEvents: 'none',
      userSelect: 'none',
      opacity: '0.6',
    })
  })

  it('should show overlay when locked and overlay is provided', () => {
    render(
      <Lock when={true} overlay={<div>Loading...</div>}>
        <div>Test Content</div>
      </Lock>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should not show overlay when not locked', () => {
    render(
      <Lock when={false} overlay={<div>Loading...</div>}>
        <div>Test Content</div>
      </Lock>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('should not show overlay when locked but overlay is not provided', () => {
    render(
      <Lock when={true}>
        <div>Test Content</div>
      </Lock>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
    // Should only have the main content, no overlay
    expect(screen.getByText('Test Content').closest('div')?.parentElement?.children).toHaveLength(1)
  })

  it('should prevent scroll when locked and preventScroll=true', () => {
    const { rerender } = render(
      <Lock when={true} preventScroll={true}>
        <div>Test Content</div>
      </Lock>
    )

    expect(document.body.style.overflow).toBe('hidden')

    // Unlock - should restore scroll
    rerender(
      <Lock when={false} preventScroll={true}>
        <div>Test Content</div>
      </Lock>
    )

    expect(document.body.style.overflow).toBe(originalOverflow)
  })

  it('should not prevent scroll when locked but preventScroll=false', () => {
    render(
      <Lock when={true} preventScroll={false}>
        <div>Test Content</div>
      </Lock>
    )

    expect(document.body.style.overflow).toBe(originalOverflow)
  })

  it('should not prevent scroll when not locked even if preventScroll=true', () => {
    render(
      <Lock when={false} preventScroll={true}>
        <div>Test Content</div>
      </Lock>
    )

    expect(document.body.style.overflow).toBe(originalOverflow)
  })

  it('should apply blur when locked and blur=true', () => {
    render(
      <Lock when={true} blur={true}>
        <div>Test Content</div>
      </Lock>
    )

    // The blur is applied to the outermost container
    const outerContainer = screen.getByText('Test Content').closest('div')
      ?.parentElement?.parentElement
    expect(outerContainer).toHaveStyle({ filter: 'blur(2px)' })
  })

  it('should not apply blur when not locked', () => {
    render(
      <Lock when={false} blur={true}>
        <div>Test Content</div>
      </Lock>
    )

    const container = screen.getByText('Test Content').closest('div')?.parentElement
    expect(container).not.toHaveStyle({ filter: 'blur(2px)' })
  })

  it('should not apply blur when locked but blur=false', () => {
    render(
      <Lock when={true} blur={false}>
        <div>Test Content</div>
      </Lock>
    )

    const container = screen.getByText('Test Content').closest('div')?.parentElement
    expect(container).not.toHaveStyle({ filter: 'blur(2px)' })
  })
  it('should apply custom overlay styles', () => {
    const customStyle = { backgroundColor: 'rgb(255, 0, 0)', opacity: '0.5' }

    render(
      <Lock when={true} overlay={<div>Loading...</div>} overlayStyle={customStyle}>
        <div>Test Content</div>
      </Lock>
    )

    const overlay = screen.getByText('Loading...').parentElement
    // Check individual styles as browser might not compute them all together
    expect(overlay).toHaveStyle('background-color: rgb(255, 0, 0)')
    expect(overlay).toHaveStyle('opacity: 0.5')
    // Check that default overlay styles are still applied
    expect(overlay).toHaveStyle('position: absolute')
    expect(overlay).toHaveStyle('z-index: 1000')
  })

  it('should apply overlay className', () => {
    render(
      <Lock when={true} overlay={<div>Loading...</div>} overlayClassName="custom-overlay">
        <div>Test Content</div>
      </Lock>
    )

    const overlay = screen.getByText('Loading...').parentElement
    expect(overlay).toHaveClass('custom-overlay')
  })

  it('should have correct displayName', () => {
    expect(Lock.displayName).toBe('Lock')
  })

  it('should handle complex overlay content', () => {
    const complexOverlay = (
      <div>
        <span>Loading</span>
        <button type="button">Cancel</button>
      </div>
    )

    render(
      <Lock when={true} overlay={complexOverlay}>
        <div>Test Content</div>
      </Lock>
    )

    expect(screen.getByText('Loading')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should handle scroll restoration on unmount', () => {
    const { unmount } = render(
      <Lock when={true} preventScroll={true}>
        <div>Test Content</div>
      </Lock>
    )

    expect(document.body.style.overflow).toBe('hidden')

    unmount()

    expect(document.body.style.overflow).toBe(originalOverflow)
  })

  it('should handle multiple children', () => {
    render(
      <Lock when={true}>
        <div>First Child</div>
        <span>Second Child</span>
        <button type="button">Third Child</button>
      </Lock>
    )

    expect(screen.getByText('First Child')).toBeInTheDocument()
    expect(screen.getByText('Second Child')).toBeInTheDocument()
    expect(screen.getByText('Third Child')).toBeInTheDocument()

    // All should be in the locked container
    const lockedContainer = screen.getByText('First Child').parentElement
    expect(lockedContainer).toHaveStyle({ pointerEvents: 'none' })
  })

  it('should handle transitions properly', () => {
    render(
      <Lock when={true} blur={true}>
        <div>Test Content</div>
      </Lock>
    )

    const outerContainer = screen.getByText('Test Content').closest('div')
      ?.parentElement?.parentElement
    const lockedDiv = screen.getByText('Test Content').parentElement

    expect(outerContainer).toHaveStyle({ transition: 'filter 0.2s ease-out' })
    expect(lockedDiv).toHaveStyle({ transition: 'opacity 0.2s ease-out' })
  })

  it('should handle overlay cursor styles', () => {
    render(
      <Lock when={true} overlay={<div>Loading...</div>}>
        <div>Test Content</div>
      </Lock>
    )

    const overlay = screen.getByText('Loading...').parentElement
    expect(overlay).toHaveStyle({ cursor: 'wait' })
  })
})
