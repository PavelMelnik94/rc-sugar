import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { debounce, throttle } from '../../../shared/utils'

export type ScrollBehavior = 'auto' | 'smooth'
export type ScrollBlockPosition = 'start' | 'center' | 'end' | 'nearest'

export interface ScrollPosition {
  x: number
  y: number
  left: number
  top: number
}

export interface ScrollDimensions {
  scrollWidth: number
  scrollHeight: number
  clientWidth: number
  clientHeight: number
  scrollLeft: number
  scrollTop: number
}

export interface ScrollDirection {
  horizontal: 'left' | 'right' | 'none'
  vertical: 'up' | 'down' | 'none'
  isScrolling: boolean
  lastDirection: ScrollDirection | null
}

export interface ScrollVelocity {
  x: number
  y: number
  magnitude: number
  timestamp: number
}

export interface ScrollBoundaries {
  isAtTop: boolean
  isAtBottom: boolean
  isAtLeft: boolean
  isAtRight: boolean
  nearTop: boolean
  nearBottom: boolean
  nearLeft: boolean
  nearRight: boolean
}

export interface ScrollState {
  position: ScrollPosition
  dimensions: ScrollDimensions
  direction: ScrollDirection
  velocity: ScrollVelocity
  boundaries: ScrollBoundaries
  progress: {
    vertical: number
    horizontal: number
  }
}

export interface ScrollUtils {
  scrollTo: (options: ScrollToOptions) => void
  scrollToTop: (behavior?: ScrollBehavior) => void
  scrollToBottom: (behavior?: ScrollBehavior) => void
  scrollToLeft: (behavior?: ScrollBehavior) => void
  scrollToRight: (behavior?: ScrollBehavior) => void
  isElementInView: (element: Element) => boolean
  getScrollProgress: () => { vertical: number; horizontal: number }
}

export interface ScrollProps {
  children: (state: ScrollState, utils: ScrollUtils) => ReactNode
  element?: HTMLElement | Window | null
  onScroll?: (state: ScrollState) => void
  onScrollStart?: (state: ScrollState) => void
  onScrollEnd?: (state: ScrollState) => void
  onDirectionChange?: (direction: ScrollDirection) => void
  onReachTop?: (state: ScrollState) => void
  onReachBottom?: (state: ScrollState) => void
  onReachLeft?: (state: ScrollState) => void
  onReachRight?: (state: ScrollState) => void
  throttle?: number
  debounce?: number
  threshold?: number
  trackDirection?: boolean
  trackVelocity?: boolean
  trackBoundaries?: boolean
}

const getScrollElement = (element?: HTMLElement | Window | null): HTMLElement | Window => {
  if (element) return element
  if (typeof window !== 'undefined') return window
  throw new Error('No scroll element available')
}

const getScrollDimensions = (element: HTMLElement | Window): ScrollDimensions => {
  if (element === window) {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight,
      scrollLeft: window.scrollX,
      scrollTop: window.scrollY,
    }
  }

  const el = element as HTMLElement
  return {
    scrollWidth: el.scrollWidth,
    scrollHeight: el.scrollHeight,
    clientWidth: el.clientWidth,
    clientHeight: el.clientHeight,
    scrollLeft: el.scrollLeft,
    scrollTop: el.scrollTop,
  }
}

const calculateDirection = (
  current: ScrollPosition,
  previous: ScrollPosition | null
): ScrollDirection => {
  if (!previous) {
    return {
      horizontal: 'none',
      vertical: 'none',
      isScrolling: false,
      lastDirection: null,
    }
  }

  const horizontal = current.x > previous.x ? 'right' : current.x < previous.x ? 'left' : 'none'
  const vertical = current.y > previous.y ? 'down' : current.y < previous.y ? 'up' : 'none'
  const isScrolling = horizontal !== 'none' || vertical !== 'none'

  return {
    horizontal,
    vertical,
    isScrolling,
    lastDirection: isScrolling ? { horizontal, vertical, isScrolling, lastDirection: null } : null,
  }
}

const calculateVelocity = (
  current: ScrollPosition,
  previous: ScrollPosition | null,
  timestamp: number
): ScrollVelocity => {
  if (!previous) {
    return { x: 0, y: 0, magnitude: 0, timestamp }
  }

  const deltaTime =
    timestamp - ((previous as ScrollPosition & { timestamp?: number }).timestamp || Date.now()) ||
    16
  const deltaX = current.x - previous.x
  const deltaY = current.y - previous.y

  const x = deltaX / deltaTime
  const y = deltaY / deltaTime
  const magnitude = Math.sqrt(x * x + y * y)

  return { x, y, magnitude, timestamp }
}

const calculateBoundaries = (dimensions: ScrollDimensions, threshold: number): ScrollBoundaries => {
  const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = dimensions

  const maxScrollLeft = scrollWidth - clientWidth
  const maxScrollTop = scrollHeight - clientHeight

  return {
    isAtTop: scrollTop === 0,
    isAtBottom: scrollTop >= maxScrollTop,
    isAtLeft: scrollLeft === 0,
    isAtRight: scrollLeft >= maxScrollLeft,
    nearTop: scrollTop <= threshold,
    nearBottom: scrollTop >= maxScrollTop - threshold,
    nearLeft: scrollLeft <= threshold,
    nearRight: scrollLeft >= maxScrollLeft - threshold,
  }
}

const calculateProgress = (
  dimensions: ScrollDimensions
): { vertical: number; horizontal: number } => {
  const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = dimensions

  const maxScrollLeft = Math.max(0, scrollWidth - clientWidth)
  const maxScrollTop = Math.max(0, scrollHeight - clientHeight)

  return {
    vertical: maxScrollTop > 0 ? scrollTop / maxScrollTop : 0,
    horizontal: maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0,
  }
}

export function Scroll({
  children,
  element,
  onScroll,
  onScrollStart,
  onScrollEnd,
  onDirectionChange,
  onReachTop,
  onReachBottom,
  onReachLeft,
  onReachRight,
  throttle: throttleMs = 16,
  debounce: debounceMs = 150,
  threshold = 100,
  trackDirection = true,
  trackVelocity = true,
  trackBoundaries = true,
}: ScrollProps): ReactNode {
  const scrollElementRef = useRef<HTMLElement | Window | null>(null)
  const previousPositionRef = useRef<ScrollPosition | null>(null)
  const previousDirectionRef = useRef<ScrollDirection | null>(null)
  const isScrollingRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)
  const scrollStateRef = useRef<ScrollState>({} as ScrollState)

  const [scrollState, setScrollState] = useState<ScrollState>(() => {
    const initialElement = getScrollElement(element)
    const dimensions = getScrollDimensions(initialElement)
    const position: ScrollPosition = {
      x: dimensions.scrollLeft,
      y: dimensions.scrollTop,
      left: dimensions.scrollLeft,
      top: dimensions.scrollTop,
    }

    const initialState: ScrollState = {
      position,
      dimensions,
      direction: {
        horizontal: 'none' as const,
        vertical: 'none' as const,
        isScrolling: false,
        lastDirection: null,
      },
      velocity: { x: 0, y: 0, magnitude: 0, timestamp: Date.now() },
      boundaries: calculateBoundaries(dimensions, threshold),
      progress: calculateProgress(dimensions),
    }

    return initialState
  })

  // Update ref when state changes
  scrollStateRef.current = scrollState

  const updateScrollState = useCallback(() => {
    const scrollElement = scrollElementRef.current
    if (!scrollElement) return

    const timestamp = Date.now()
    const dimensions = getScrollDimensions(scrollElement)
    const position: ScrollPosition = {
      x: dimensions.scrollLeft,
      y: dimensions.scrollTop,
      left: dimensions.scrollLeft,
      top: dimensions.scrollTop,
    }

    const direction = trackDirection
      ? calculateDirection(position, previousPositionRef.current)
      : scrollStateRef.current.direction

    const velocity = trackVelocity
      ? calculateVelocity(position, previousPositionRef.current, timestamp)
      : scrollStateRef.current.velocity

    const boundaries = trackBoundaries
      ? calculateBoundaries(dimensions, threshold)
      : scrollStateRef.current.boundaries

    const progress = calculateProgress(dimensions)

    const newState: ScrollState = {
      position,
      dimensions,
      direction,
      velocity,
      boundaries,
      progress,
    }

    scrollStateRef.current = newState
    setScrollState(newState)
    onScroll?.(newState)

    if (trackDirection && previousDirectionRef.current) {
      const directionChanged =
        direction.horizontal !== previousDirectionRef.current.horizontal ||
        direction.vertical !== previousDirectionRef.current.vertical

      if (directionChanged) {
        onDirectionChange?.(direction)
      }
    }

    if (trackBoundaries) {
      if (boundaries.isAtTop) onReachTop?.(newState)
      if (boundaries.isAtBottom) onReachBottom?.(newState)
      if (boundaries.isAtLeft) onReachLeft?.(newState)
      if (boundaries.isAtRight) onReachRight?.(newState)
    }

    if (!isScrollingRef.current && direction.isScrolling) {
      isScrollingRef.current = true
      onScrollStart?.(newState)
    }

    previousPositionRef.current = position
    previousDirectionRef.current = direction
  }, [
    trackDirection,
    trackVelocity,
    trackBoundaries,
    threshold,
    onScroll,
    onDirectionChange,
    onReachTop,
    onReachBottom,
    onReachLeft,
    onReachRight,
    onScrollStart,
  ])

  const throttledUpdateScrollState = useCallback(
    () => throttle(() => updateScrollState(), throttleMs)(),
    [updateScrollState, throttleMs]
  )

  const debouncedScrollEnd = useCallback(() => {
    const debouncedFn = debounce(() => {
      if (isScrollingRef.current) {
        isScrollingRef.current = false
        onScrollEnd?.(scrollStateRef.current)
      }
    }, debounceMs)
    return debouncedFn()
  }, [onScrollEnd, debounceMs])

  const handleScroll = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
    }

    rafIdRef.current = requestAnimationFrame(() => {
      throttledUpdateScrollState()
      debouncedScrollEnd()
    })
  }, [throttledUpdateScrollState, debouncedScrollEnd])

  const scrollUtils: ScrollUtils = {
    scrollTo: useCallback((options: ScrollToOptions) => {
      const scrollElement = scrollElementRef.current
      if (!scrollElement) return

      if (scrollElement === window) {
        window.scrollTo(options)
      } else {
        ;(scrollElement as HTMLElement).scrollTo(options)
      }
    }, []),

    scrollToTop: useCallback((behavior: ScrollBehavior = 'smooth') => {
      const scrollElement = scrollElementRef.current
      if (!scrollElement) return

      if (scrollElement === window) {
        window.scrollTo({ top: 0, behavior })
      } else {
        ;(scrollElement as HTMLElement).scrollTo({ top: 0, behavior })
      }
    }, []),

    scrollToBottom: useCallback((behavior: ScrollBehavior = 'smooth') => {
      const scrollElement = scrollElementRef.current
      if (!scrollElement) return

      const dimensions = getScrollDimensions(scrollElement)
      const maxScrollTop = dimensions.scrollHeight - dimensions.clientHeight

      if (scrollElement === window) {
        window.scrollTo({ top: maxScrollTop, behavior })
      } else {
        ;(scrollElement as HTMLElement).scrollTo({ top: maxScrollTop, behavior })
      }
    }, []),

    scrollToLeft: useCallback((behavior: ScrollBehavior = 'smooth') => {
      const scrollElement = scrollElementRef.current
      if (!scrollElement) return

      if (scrollElement === window) {
        window.scrollTo({ left: 0, behavior })
      } else {
        ;(scrollElement as HTMLElement).scrollTo({ left: 0, behavior })
      }
    }, []),

    scrollToRight: useCallback((behavior: ScrollBehavior = 'smooth') => {
      const scrollElement = scrollElementRef.current
      if (!scrollElement) return

      const dimensions = getScrollDimensions(scrollElement)
      const maxScrollLeft = dimensions.scrollWidth - dimensions.clientWidth

      if (scrollElement === window) {
        window.scrollTo({ left: maxScrollLeft, behavior })
      } else {
        ;(scrollElement as HTMLElement).scrollTo({ left: maxScrollLeft, behavior })
      }
    }, []),

    isElementInView: useCallback((element: Element) => {
      const rect = element.getBoundingClientRect()
      const scrollElement = scrollElementRef.current

      if (scrollElement === window) {
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.right <= window.innerWidth
        )
      }

      const containerRect = (scrollElement as HTMLElement).getBoundingClientRect()
      return (
        rect.top >= containerRect.top &&
        rect.left >= containerRect.left &&
        rect.bottom <= containerRect.bottom &&
        rect.right <= containerRect.right
      )
    }, []),

    getScrollProgress: useCallback(() => {
      return scrollState.progress
    }, [scrollState.progress]),
  }

  useEffect(() => {
    const scrollElement = getScrollElement(element)
    scrollElementRef.current = scrollElement

    scrollElement.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [element, handleScroll])

  return children(scrollState, scrollUtils)
}

Scroll.displayName = 'Scroll'
