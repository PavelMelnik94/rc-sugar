import type { ReactNode } from 'react'
import { useEffect } from 'react'

export interface LockProps {
  /**
   * Children to lock/unlock
   */
  children: ReactNode
  /**
   * Whether to lock interaction
   */
  when: boolean
  /**
   * Overlay content to show when locked
   */
  overlay?: ReactNode
  /**
   * Whether to prevent scrolling when locked
   */
  preventScroll?: boolean
  /**
   * Whether to blur content when locked
   */
  blur?: boolean
  /**
   * Custom overlay styles
   */
  overlayStyle?: React.CSSProperties
  /**
   * Overlay className
   */
  overlayClassName?: string
}

const defaultOverlayStyleProp: React.CSSProperties = {}

/**
 * Lock component - disables interaction and optionally shows overlay
 *
 * @example
 * ```tsx
 * <Lock when={isLoading}>
 *   <Form />
 * </Lock>
 *
 * <Lock
 *   when={isProcessing}
 *   overlay={<Spinner />}
 *   preventScroll
 *   blur
 * >
 *   <UserInterface />
 * </Lock>
 * ```
 */
export function Lock({
  children,
  when,
  overlay,
  preventScroll = false,
  blur = false,
  overlayStyle = defaultOverlayStyleProp,
  overlayClassName = '',
}: LockProps): React.JSX.Element {
  useEffect(() => {
    if (!when || !preventScroll) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [when, preventScroll])

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    ...(blur && when && { filter: 'blur(2px)' }),
    transition: 'filter 0.2s ease-out',
  }

  const defaultOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
    cursor: when ? 'wait' : 'default',
    ...overlayStyle,
  }

  const lockStyle: React.CSSProperties = when
    ? {
        pointerEvents: 'none',
        userSelect: 'none',
        opacity: 0.6,
        transition: 'opacity 0.2s ease-out',
      }
    : {
        transition: 'opacity 0.2s ease-out',
      }

  return (
    <div style={containerStyle}>
      <div style={lockStyle}>{children}</div>
      {when && overlay && (
        <div style={defaultOverlayStyle} className={overlayClassName}>
          {overlay}
        </div>
      )}
    </div>
  )
}

Lock.displayName = 'Lock'
