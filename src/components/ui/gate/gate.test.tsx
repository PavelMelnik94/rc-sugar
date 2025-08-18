import { render, screen } from '@testing-library/react'
import { Gate } from './gate'

jest.mock('../../../shared/utils', () => ({
  isBrowser: jest.fn(() => true),
}))

describe('gate Component', () => {
  const originalUserAgent = navigator.userAgent

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    })
  })

  it('should render children for bot target when user agent is a bot', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (compatible; Googlebot/2.1)',
      configurable: true,
    })

    render(
      <Gate for="bot">
        <div data-testid="bot-content">Bot content</div>
      </Gate>
    )

    expect(screen.getByTestId('bot-content')).toHaveTextContent('Bot content')
  })

  it('should render fallback for bot target when user agent is not a bot', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      configurable: true,
    })

    render(
      <Gate for="bot" fallback={<div data-testid="fallback">Fallback</div>}>
        <div data-testid="bot-content">Bot content</div>
      </Gate>
    )

    expect(screen.getByTestId('fallback')).toHaveTextContent('Fallback')
    expect(screen.queryByTestId('bot-content')).toBeNull()
  })

  it('should render children for human target when user agent is not a bot', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      configurable: true,
    })

    render(
      <Gate for="human">
        <div data-testid="human-content">Human content</div>
      </Gate>
    )

    expect(screen.getByTestId('human-content')).toHaveTextContent('Human content')
  })

  it('should render fallback for human target when user agent is a bot', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (compatible; Googlebot/2.1)',
      configurable: true,
    })

    render(
      <Gate for="human" fallback={<div data-testid="fallback">Fallback</div>}>
        <div data-testid="human-content">Human content</div>
      </Gate>
    )

    expect(screen.getByTestId('fallback')).toHaveTextContent('Fallback')
    expect(screen.queryByTestId('human-content')).toBeNull()
  })

  it('should render children for mobile target when user agent is mobile', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
      configurable: true,
    })

    render(
      <Gate for="mobile">
        <div data-testid="mobile-content">Mobile content</div>
      </Gate>
    )

    expect(screen.getByTestId('mobile-content')).toHaveTextContent('Mobile content')
  })

  it('should render fallback for mobile target when user agent is not mobile', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      configurable: true,
    })

    render(
      <Gate for="mobile" fallback={<div data-testid="fallback">Fallback</div>}>
        <div data-testid="mobile-content">Mobile content</div>
      </Gate>
    )

    expect(screen.getByTestId('fallback')).toHaveTextContent('Fallback')
    expect(screen.queryByTestId('mobile-content')).toBeNull()
  })

  it('should render children for desktop target when user agent is not mobile', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      configurable: true,
    })

    render(
      <Gate for="desktop">
        <div data-testid="desktop-content">Desktop content</div>
      </Gate>
    )

    expect(screen.getByTestId('desktop-content')).toHaveTextContent('Desktop content')
  })

  it('should render fallback for desktop target when user agent is mobile', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
      configurable: true,
    })

    render(
      <Gate for="desktop" fallback={<div data-testid="fallback">Fallback</div>}>
        <div data-testid="desktop-content">Desktop content</div>
      </Gate>
    )

    expect(screen.getByTestId('fallback')).toHaveTextContent('Fallback')
    expect(screen.queryByTestId('desktop-content')).toBeNull()
  })

  it('should render children when any target matches (multiple targets)', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
      configurable: true,
    })

    render(
      <Gate for={['desktop', 'mobile']}>
        <div data-testid="multi-content">Multi target content</div>
      </Gate>
    )

    expect(screen.getByTestId('multi-content')).toHaveTextContent('Multi target content')
  })

  it('should render fallback when no targets match (multiple targets)', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
      configurable: true,
    })

    render(
      <Gate for={['desktop', 'bot']} fallback={<div data-testid="fallback">Fallback</div>}>
        <div data-testid="multi-content">Multi target content</div>
      </Gate>
    )

    expect(screen.getByTestId('fallback')).toHaveTextContent('Fallback')
    expect(screen.queryByTestId('multi-content')).toBeNull()
  })

  it('should use custom detect function when provided', () => {
    const customDetect = jest.fn(() => true)

    render(
      <Gate for="human" detect={customDetect}>
        <div data-testid="custom-content">Custom content</div>
      </Gate>
    )

    expect(customDetect).toHaveBeenCalled()
    expect(screen.getByTestId('custom-content')).toHaveTextContent('Custom content')
  })

  it('should render fallback when custom detect returns false', () => {
    const customDetect = jest.fn(() => false)

    render(
      <Gate for="human" detect={customDetect} fallback={<div data-testid="fallback">Fallback</div>}>
        <div data-testid="custom-content">Custom content</div>
      </Gate>
    )

    expect(customDetect).toHaveBeenCalled()
    expect(screen.getByTestId('fallback')).toHaveTextContent('Fallback')
    expect(screen.queryByTestId('custom-content')).toBeNull()
  })

  it('should render children for bot target (handles SSR optimization)', () => {
    // Set a bot user agent to ensure bot detection works
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (compatible; Googlebot/2.1)',
      configurable: true,
    })

    render(
      <Gate for="bot">
        <div data-testid="ssr-content">SSR content</div>
      </Gate>
    )

    // Should render content for bot target (whether SSR or hydrated)
    expect(screen.getByTestId('ssr-content')).toHaveTextContent('SSR content')
  })

  it('should render content for human target when not a bot (handles SSR optimization)', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      configurable: true,
    })

    render(
      <Gate for="human" fallback={<div data-testid="ssr-fallback">SSR fallback</div>}>
        <div data-testid="ssr-content">SSR content</div>
      </Gate>
    )

    // Should render content for human target when not a bot
    expect(screen.getByTestId('ssr-content')).toHaveTextContent('SSR content')
  })

  it('should render nothing when no fallback is provided and target does not match', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      configurable: true,
    })

    const { container } = render(
      <Gate for="bot">
        <div data-testid="content">Content</div>
      </Gate>
    )

    expect(screen.queryByTestId('content')).toBeNull()
    expect(container.firstChild?.textContent || '').toBe('')
  })
})
