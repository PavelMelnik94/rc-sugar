import type { ReactElement, ReactNode } from 'react'
import { memo, useMemo } from 'react'


export interface StaticProps {
  /**
   * Children to render statically
   */
  children: ReactNode
  /**
   * Optional dependencies to watch for changes
   * If provided, component will only re-render when these change
   */
  deps?: unknown[]
}

/**
 * Internal component that wraps children with aggressive memoization
 */
const StaticWrapper = memo(
  ({ children }: { children: ReactNode }) => {
    return <>{children}</>
  },
  () => true // Always prevent re-renders
)

StaticWrapper.displayName = 'StaticWrapper'

/**
 * Static component - prevents re-rendering of children unless dependencies change
 *
 * @example
 * ```tsx
 * <Static>
 *   <Footer /> // Won't re-render when parent state changes
 * </Static>
 *
 * <Static deps={[theme]}>
 *   <Header theme={theme} /> // Only re-renders when theme changes
 * </Static>
 * ```
 */
export function Static({ children, deps }: StaticProps): ReactElement {
  const MemoizedComponent = useMemo(
    () => {
      return memo(({ children }: { children: ReactNode }) => <>{children}</>)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps ?? []
  )

  if (deps !== undefined) { 
    return <MemoizedComponent children={children} />
  }

  return <StaticWrapper>{children}</StaticWrapper>
}

Static.displayName = 'Static'
