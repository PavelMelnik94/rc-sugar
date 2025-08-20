import type { ReactNode } from 'react'
import { useEffect } from 'react'

export interface DebugProps {
  /**
   * Children to render
   */
  children: ReactNode
  /**
   * Custom label for debug output
   */
  label?: string
  /**
   * Whether to disable debug logging
   */
  disabled?: boolean
  /**
   * Additional data to log
   */
  data?: Record<string, unknown>
}

/**
 * Debug component - logs props and data to console for debugging
 *
 * @example
 * ```tsx
 * <Debug label="User Profile" data={{ userId: 123 }}>
 *   <UserCard user={user} />
 * </Debug>
 *
 * <Debug>
 *   <ComplexComponent {...props} />
 * </Debug>
 * ```
 */
const defaultData: Record<string, unknown> = {}

export function Debug({
  children,
  label = 'Debug',
  disabled = false,
  data = defaultData,
}: DebugProps): ReactNode {
  useEffect(() => {
    if (disabled) {
      return
    }

    const debugInfo = {
      label,
      timestamp: new Date().toISOString(),
      data,
      children,
    }

    console.group(`🐛 ${label}`)
    console.log('Debug Info:', debugInfo)

    if (Object.keys(data).length > 0) {
      console.log('Additional Data:', data)
    }

    console.groupEnd()
  }, [label, disabled, data, children])

  return <>{children}</>
}

Debug.displayName = 'Debug'
