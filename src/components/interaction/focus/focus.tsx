import type { ReactElement } from 'react'
import { cloneElement, isValidElement, useEffect, useRef } from 'react'

export interface FocusProps {
  /**
   * Single child element to focus
   */
  children: ReactElement
  /**
   * Whether to focus on mount
   */
  autoFocus?: boolean
  /**
   * Whether to select text content when focusing
   */
  selectText?: boolean
  /**
   * Delay before focusing (ms)
   */
  delay?: number
  /**
   * Whether to prevent scroll when focusing
   */
  preventScroll?: boolean
  /**
   * Callback fired when element is focused
   */
  onFocus?: () => void
  /**
   * Whether to focus only when visible
   */
  whenVisible?: boolean
}

/**
 * Focus component - manages focus automatically
 *
 * @example
 * ```tsx
 * <Focus>
 *   <input placeholder="Auto-focused input" />
 * </Focus>
 *
 * <Focus selectText delay={100}>
 *   <input defaultValue="This text will be selected" />
 * </Focus>
 *
 * <Focus whenVisible onFocus={() => console.log('Focused!')}>
 *   <button>Focus me when visible</button>
 * </Focus>
 * ```
 */
export function Focus({
  children,
  autoFocus = true,
  selectText = false,
  delay = 0,
  preventScroll = false,
  onFocus,
  whenVisible = false,
}: FocusProps): ReactElement {
  const elementRef = useRef<HTMLElement>(null)

  useEffect((): (() => void) | void => {
    if (!autoFocus) return

    const focusElement = (): void => {
      const element = elementRef.current
      if (!element) return

      element.focus({ preventScroll })

      if (selectText && 'select' in element && typeof element.select === 'function') {
        ;(element as HTMLInputElement | HTMLTextAreaElement).select()
      }

      onFocus?.()
    }

    if (whenVisible) {
      let timer: NodeJS.Timeout | null = null
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (delay > 0) {
                timer = setTimeout(focusElement, delay)
              } else {
                focusElement()
              }
              observer.disconnect()
            }
          })
        },
        { threshold: 0.1 }
      )

      if (elementRef.current) {
        observer.observe(elementRef.current)
      }

      return () => {
        observer.disconnect()
        if (timer) {
          clearTimeout(timer)
        }
      }
    } else {
      if (delay > 0) {
        const timer = setTimeout(focusElement, delay)
        return () => clearTimeout(timer)
      } else {
        focusElement()
      }
    }
  }, [autoFocus, selectText, delay, preventScroll, onFocus, whenVisible])

  if (!isValidElement(children)) {
    throw new Error('Focus component requires a single valid React element as child')
  }

  const childProps = {
    ref: (node: HTMLElement) => {
      if (elementRef.current !== node) {
        elementRef.current = node
      }

      const existingRef = (children as ReactElement & { ref?: unknown }).ref
      if (typeof existingRef === 'function') {
        existingRef(node)
      } else if (existingRef && typeof existingRef === 'object' && existingRef !== null) {
        ;(existingRef as { current: HTMLElement | null }).current = node
      }
    },
  }

  // eslint-disable-next-line react/no-clone-element
  return cloneElement(children, childProps)
}

Focus.displayName = 'Focus'
