import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface ZoomProps {
  /**
   * Children to zoom
   */
  children: ReactNode
  /**
   * Maximum scale factor
   */
  maxScale?: number
  /**
   * Minimum scale factor
   */
  minScale?: number
  /**
   * Whether to fit content to container width
   */
  fitWidth?: boolean
  /**
   * Whether to fit content to container height
   */
  fitHeight?: boolean
  /**
   * Whether to center content
   */
  center?: boolean
  /**
   * Custom scale override
   */
  scale?: number
  /**
   * Callback when scale changes
   */
  onScaleChange?: (scale: number) => void
}

/**
 * Zoom component - automatically scales content to fit container
 *
 * @example
 * ```tsx
 * <Zoom maxScale={1.5} minScale={0.8}>
 *   <Chart data={data} />
 * </Zoom>
 *
 * <Zoom fitWidth center onScaleChange={(s) => console.log('Scale:', s)}>
 *   <LargeImage src="huge-image.jpg" />
 * </Zoom>
 * ```
 */
export function Zoom({
  children,
  maxScale = 2,
  minScale = 0.1,
  fitWidth = false,
  fitHeight = false,
  center = true,
  scale: customScale,
  onScaleChange,
}: ZoomProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [calculatedScale, setCalculatedScale] = useState(1)

  const updateScale = useCallback((): void => {
    if (!containerRef.current || !contentRef.current) return

    const container = containerRef.current
    const content = contentRef.current
    const containerRect = container.getBoundingClientRect()
    const contentRect = content.getBoundingClientRect()

    let newScale = 1

    if (fitWidth && fitHeight) {
      // Fit to both width and height (use smaller scale)
      const scaleX = containerRect.width / contentRect.width
      const scaleY = containerRect.height / contentRect.height
      newScale = Math.min(scaleX, scaleY)
    } else if (fitWidth) {
      newScale = containerRect.width / contentRect.width
    } else if (fitHeight) {
      newScale = containerRect.height / contentRect.height
    }

    newScale = Math.max(minScale, Math.min(maxScale, newScale))

    if (newScale !== calculatedScale) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setCalculatedScale(newScale)
      onScaleChange?.(newScale)
    }
  }, [maxScale, minScale, fitWidth, fitHeight, calculatedScale, onScaleChange])

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return

    const container = containerRef.current

    updateScale()

    const resizeObserver = new ResizeObserver(updateScale)
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [updateScale])

  const activeScale = customScale ?? calculatedScale

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  }

  const contentStyle: React.CSSProperties = {
    transform: `scale(${activeScale})`,
    transformOrigin: center ? 'center center' : 'top left',
    transition: 'transform 0.2s ease-out',
    display: 'inline-block',
    ...(center && {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: `translate(-50%, -50%) scale(${activeScale})`,
    }),
  }

  return (
    <div ref={containerRef} style={containerStyle}>
      <div ref={contentRef} style={contentStyle}>
        {children}
      </div>
    </div>
  )
}

Zoom.displayName = 'Zoom'
