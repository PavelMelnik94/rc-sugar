import type { ReactElement, ReactNode } from 'react'
import type { VoidEventHandler } from '../../../shared/types'
import process from 'node:process'
import { useEffect, useRef } from 'react'


export interface TapProps {
  /**
   * Children to render
   */
  children: ReactNode
  /**
   * Callback fired when component mounts
   */
  onMount?: VoidEventHandler
  /**
   * Callback fired when component unmounts
   */
  onUnmount?: VoidEventHandler
  /**
   * Callback fired on every render
   */
  onRender?: VoidEventHandler
  /**
   * Callback fired when children change
   */
  onChildrenChange?: VoidEventHandler
  /**
   * Whether to run callbacks only in development
   */
  devOnly?: boolean
}

/**
 * Tap component - executes side effects without affecting render output
 *
 * @example
 * ```tsx
 * <Tap onMount={() => console.log("Component mounted")}>
 *   <Button>Click me</Button>
 * </Tap>
 *
 * <Tap
 *   onRender={() => analytics.track('component_rendered')}
 *   onMount={() => console.log('Login form shown')}
 * >
 *   <LoginForm />
 * </Tap>
 * ```
 */
export function Tap({
  children,
  onMount,
  onUnmount,
  onRender,
  onChildrenChange,
  devOnly = false,
}: TapProps): ReactElement {
  const prevChildrenRef = useRef<ReactNode>(children)
  const isDev = process.env?.NODE_ENV === 'development'

  const shouldExecute = devOnly ? isDev : true

  useEffect(() => {
    if (!shouldExecute) return

    onMount?.()

    return () => {
      onUnmount?.()
    }
  }, [onMount, onUnmount, shouldExecute])

  useEffect(() => {
    if (!shouldExecute) return
    onRender?.()
  })

  useEffect(() => {
    if (!shouldExecute) return

    if (prevChildrenRef.current !== children) {
      onChildrenChange?.()
      prevChildrenRef.current = children
    }
  }, [children, onChildrenChange, shouldExecute])

  return <>{children}</>
}

Tap.displayName = 'Tap'
