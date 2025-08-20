import type { CSSProperties, JSX, ReactNode } from 'react'
import { useCallback, useRef } from 'react'


export interface TouchPoint {
  x: number
  y: number
  id: number
}


export interface GestureHandlers {
  swipeLeft?: () => void
  swipeRight?: () => void
  swipeUp?: () => void
  swipeDown?: () => void
  pinchIn?: () => void
  pinchOut?: () => void
  tap?: () => void
  doubleTap?: () => void
  longPress?: () => void
  circle?: () => void
}




export interface GesturePadProps {
  /**
   * Gesture handlers
   */
  gestures: GestureHandlers
  /**
   * Sensitivity for gesture detection (0-1)
   * @default 0.7
   */
  sensitivity?: number
  /**
   * Minimum distance for swipe gestures
   * @default 50
   */
  minSwipeDistance?: number
  /**
   * Maximum time for tap gestures (ms)
   * @default 300
   */
  maxTapTime?: number
  /**
   * Time for long press (ms)
   * @default 500
   */
  longPressTime?: number
  /**
   * Time window for double tap (ms)
   * @default 300
   */
  doubleTapWindow?: number
  /**
   * Children to render
   */
  children: ReactNode
  /**
   * Additional styles
   */
  style?: CSSProperties
  /**
   * Whether to prevent default touch behavior
   * @default true
   */
  preventDefault?: boolean
}

/**
 * Calculate distance between two points
 */
function getDistance(p1: TouchPoint, p2: TouchPoint): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
}

/**
 * Calculate angle between two points
 */
function getAngle(p1: TouchPoint, p2: TouchPoint): number {
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI
}

/**
 * GesturePad component - Touch gesture recognition
 *
 * @example
 * ```tsx
 * <GesturePad
 *   gestures={{
 *     swipeLeft: () => navigateNext(),
 *     pinchIn: () => zoomOut(),
 *     doubleTap: () => openMenu()
 *   }}
 *   sensitivity={0.8}
 * >
 *   <div style={{ width: '100%', height: '300px', background: '#f0f0f0' }}>
 *     Touch area
 *   </div>
 * </GesturePad>
 * ```
 */
export function GesturePad({
  gestures,
  sensitivity = 0.7,
  minSwipeDistance = 50,
  maxTapTime = 300,
  longPressTime = 500,
  doubleTapWindow = 300,
  children,
  style,
  preventDefault = true,
}: GesturePadProps): JSX.Element {
  const touchStartRef = useRef<TouchPoint[]>([])
  const touchStartTimeRef = useRef<number>(0)
  const lastTapTimeRef = useRef<number>(0)
  const longPressTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const initialPinchDistanceRef = useRef<number>(0)
  const cleanupRef = useRef<(() => void) | undefined>(undefined)

  const handleTouchStart = useCallback((e: TouchEvent): void => {
    if (preventDefault) {
      e.preventDefault()
    }

    const touches = Array.from(e.touches).map((touch) => ({
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier,
    }))

    touchStartRef.current = touches
    touchStartTimeRef.current = Date.now()

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }

    if (touches.length === 1 && gestures.longPress) {
      longPressTimerRef.current = setTimeout(() => {
        gestures.longPress?.()
      }, longPressTime)
    }

    if (touches.length === 2) {
      initialPinchDistanceRef.current = getDistance(touches[0], touches[1])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gestures.longPress, longPressTime, preventDefault])

  const handleTouchMove = useCallback((e: TouchEvent): void => {
    if (preventDefault) {
      e.preventDefault()
    }

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = undefined
    }
  }, [preventDefault])

  const handleTouchEnd = useCallback((e: TouchEvent): void => {
    if (preventDefault) {
      e.preventDefault()
    }

    const touchEndTime = Date.now()
    const touchDuration = touchEndTime - touchStartTimeRef.current
    const remainingTouches = Array.from(e.touches)

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = undefined
    }

    if (remainingTouches.length === 0 && touchStartRef.current.length > 0) {
      const startTouch = touchStartRef.current[0]
      const endTouch = Array.from(e.changedTouches)[0]

      if (!endTouch) return

      const endPoint = {
        x: endTouch.clientX,
        y: endTouch.clientY,
        id: endTouch.identifier,
      }

      if (touchStartRef.current.length === 1) {
        const distance = getDistance(startTouch, endPoint)
        const angle = getAngle(startTouch, endPoint)

        if (distance < minSwipeDistance * sensitivity && touchDuration < maxTapTime) {
          const timeSinceLastTap = touchEndTime - lastTapTimeRef.current

          if (timeSinceLastTap < doubleTapWindow && gestures.doubleTap) {
            gestures.doubleTap()
            lastTapTimeRef.current = 0
          } else {
            lastTapTimeRef.current = touchEndTime
            if (gestures.tap) {
              gestures.tap()
            }
          }
        }
        else if (distance >= minSwipeDistance) {
          if (angle >= -45 && angle <= 45 && gestures.swipeRight) {
            gestures.swipeRight()
          } else if ((angle >= 135 || angle <= -135) && gestures.swipeLeft) {
            gestures.swipeLeft()
          } else if (angle >= 45 && angle <= 135 && gestures.swipeDown) {
            gestures.swipeDown()
          } else if (angle >= -135 && angle <= -45 && gestures.swipeUp) {
            gestures.swipeUp()
          }
        }
      }
      else if (touchStartRef.current.length === 2) {
        const endTouches = Array.from(e.changedTouches)
        if (endTouches.length >= 2) {
          const endDistance = getDistance(
            {
              x: endTouches[0].clientX,
              y: endTouches[0].clientY,
              id: endTouches[0].identifier,
            },
            {
              x: endTouches[1].clientX,
              y: endTouches[1].clientY,
              id: endTouches[1].identifier,
            }
          )

          const pinchRatio = endDistance / initialPinchDistanceRef.current

          if (pinchRatio < 0.8 && gestures.pinchIn) {
            gestures.pinchIn()
          } else if (pinchRatio > 1.2 && gestures.pinchOut) {
            gestures.pinchOut()
          }
        }
      }
    }

    touchStartRef.current = []
  }, [
    preventDefault,
    minSwipeDistance,
    sensitivity,
    maxTapTime,
    doubleTapWindow,
    gestures,
  ])

  const containerRef = useCallback((element: HTMLDivElement | null): void => {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = undefined
    }

    if (element) {
      element.addEventListener('touchstart', handleTouchStart, {
        passive: !preventDefault,
      })
      element.addEventListener('touchmove', handleTouchMove, {
        passive: !preventDefault,
      })
      element.addEventListener('touchend', handleTouchEnd, {
        passive: !preventDefault,
      })

      cleanupRef.current = (): void => {
        element.removeEventListener('touchstart', handleTouchStart)
        element.removeEventListener('touchmove', handleTouchMove)
        element.removeEventListener('touchend', handleTouchEnd)

        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current)
        }
      }
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefault])

  return (
    <div
      ref={containerRef}
      style={{
        touchAction: 'none',
        userSelect: 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

GesturePad.displayName = 'GesturePad'
