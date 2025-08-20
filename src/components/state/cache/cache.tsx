import type { FC, ReactNode } from 'react'
import { useMemo } from 'react'

export interface CacheProps {
  /**
   * Children to cache
   */
  children: ReactNode
  /**
   * Dependencies array - children will re-render only when these change
   */
  deps: unknown[]
  /**
   * Optional cache key for debugging
   */
  cacheKey?: string
  /**
   * Whether to log cache hits/misses (development only)
   */
  debug?: boolean
}

/**
 * Cache component - memoizes children based on dependencies
 *
 * @example
 * ```tsx
 * <Cache deps={[user.id, theme]}>
 *   <ExpensiveComponent user={user} theme={theme} />
 * </Cache>
 *
 * <Cache deps={[data]} debug={true} key="user-profile">
 *   <UserProfile data={data} />
 * </Cache>
 * ```
 */
export const Cache: FC<CacheProps> = ({ children, deps, cacheKey, debug = false }) => {
  const memoizedChildren = useMemo(() => {
    if (debug) {
      console.log(`🔄 Cache ${cacheKey ? `"${cacheKey}"` : ''} recalculating`, deps)
    }
    return children
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps])

  if (debug) {
    console.log(`✨ Cache ${cacheKey ? `"${cacheKey}"` : ''} hit`, deps)
  }

  return <>{memoizedChildren}</>
}

Cache.displayName = 'Cache'
