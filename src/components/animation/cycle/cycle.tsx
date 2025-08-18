import type { JSX, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

/**
 * Props for the Cycle component
 */
export interface CycleProperties {
  /**
   * Array of items to cycle through
   */
  items: ReactNode[]
  /**
   * Interval in milliseconds between cycles
   */
  interval: number
  /**
   * Whether to automatically start cycling
   * @default true
   */
  autoStart?: boolean
  /**
   * Whether to pause cycling on hover
   * @default false
   */
  pauseOnHover?: boolean
  /**
   * Callback when the active item changes
   */
  onCycle?: (currentIndex: number, previousIndex: number) => void
  /**
   * Render prop to customize item rendering
   */
  renderItem?: (item: ReactNode, index: number) => JSX.Element
  /**
   * Render prop to customize indicators rendering
   */
  renderIndicators?: (currentIndex: number, items: ReactNode[]) => JSX.Element
}

export function Cycle({
  items,
  interval,
  autoStart = true,
  pauseOnHover = false,
  onCycle,
  renderItem,
  renderIndicators,
}: CycleProperties): JSX.Element | null {
  const [currentIndex, setCurrentIndex] = useState(0)
  const isRunningRef = useRef(autoStart)
  const isPausedRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const startTimer = (): void => {
      if (isRunningRef.current && !isPausedRef.current && items.length > 1) {
        timerRef.current = setInterval(
          () => {
            setCurrentIndex((previousIndex) => {
              const newIndex = (previousIndex + 1) % items.length
              onCycle?.(newIndex, previousIndex)
              return newIndex
            })
          },
          prefersReducedMotion ? interval * 2 : interval
        )
      }
    }

    const stopTimer = (): void => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    startTimer()

    return () => stopTimer()
  }, [interval, items.length, onCycle, prefersReducedMotion])

  const handleMouseEnter = (): void => {
    if (pauseOnHover) {
      isPausedRef.current = true
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const handleMouseLeave = (): void => {
    if (pauseOnHover) {
      isPausedRef.current = false
      if (!timerRef.current) {
        timerRef.current = setInterval(
          () => {
            setCurrentIndex((previousIndex) => {
              const newIndex = (previousIndex + 1) % items.length
              onCycle?.(newIndex, previousIndex)
              return newIndex
            })
          },
          prefersReducedMotion ? interval * 2 : interval
        )
      }
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div
      role="region"
      aria-label="Carousel"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'contents' }}
    >
      {renderItem ? renderItem(items[currentIndex], currentIndex) : items[currentIndex]}
      {renderIndicators && renderIndicators(currentIndex, items)}
    </div>
  )
}

Cycle.start = (setCycleRunning: (running: boolean) => void) => () => setCycleRunning(true)
Cycle.stop = (setCycleRunning: (running: boolean) => void) => () => setCycleRunning(false)
Cycle.next =
  (setCurrentIndex: (index: number | ((previous: number) => number)) => void, length: number) =>
  () =>
    setCurrentIndex((previous) => (previous + 1) % length)
Cycle.previous =
  (setCurrentIndex: (index: number | ((previous: number) => number)) => void, length: number) =>
  () =>
    setCurrentIndex((previous) => (previous - 1 + length) % length)

Cycle.displayName = 'Cycle'
