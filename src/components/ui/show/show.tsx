import type { ReactElement, ReactNode } from 'react'


export interface ShowProps {
  /**
   * The condition to evaluate
   */
  when: boolean
  /**
   * Content to render when condition is true
   */
  children: ReactNode | (() => ReactNode)
  /**
   * Fallback content to render when condition is false
   */
  fallback?: ReactNode | (() => ReactNode)
}

/**
 * Show component - conditionally renders children based on a boolean condition
 *
 * @example
 * ```tsx
 * <Show when={isLoading}>
 *   <Spinner />
 * </Show>
 *
 * <Show when={user} fallback={<LoginForm />}>
 *   <UserProfile user={user} />
 * </Show>
 *
 * <Show when={hasData}>
 *   {() => <ExpensiveComponent />}
 * </Show>
 * ```
 */
export function Show({ when, children, fallback = null }: ShowProps): ReactElement {
  if (when) {
    return <>{typeof children === 'function' ? children() : children}</>
  }

  return <>{typeof fallback === 'function' ? fallback() : fallback}</>
}

Show.displayName = 'Show'
