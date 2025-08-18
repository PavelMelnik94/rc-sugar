import type { ComponentType, ReactElement, ReactNode } from 'react'
import type { RenderProp } from '../../../shared/types'
import { lazy, Suspense } from 'react'

export type LazyLoader<T extends Record<string, unknown> = Record<string, unknown>> = () => Promise<{ default: ComponentType<T> }>


export interface LazyProps<T extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * Function that returns a promise resolving to a component
   */
  load: LazyLoader<T>
  /**
   * Fallback content to show while loading
   */
  fallback?: ReactNode
  /**
   * Render prop that receives the loaded component
   */
  children?: RenderProp<ComponentType<T>>
  /**
   * Props to pass to the loaded component
   */
  componentProps?: T
  /**
   * Whether to preload the component immediately
   */
  preload?: boolean
}

/**
 * Lazy component - simplified React.lazy + Suspense wrapper
 *
 * @example
 * ```tsx
 * <Lazy
 *   load={() => import('./HeavyComponent')}
 *   fallback={<Spinner />}
 * >
 *   {(Component) => <Component data={data} />}
 * </Lazy>
 *
 * <Lazy
 *   load={() => import('./Chart')}
 *   fallback={<ChartSkeleton />}
 *   componentProps={{ data: chartData }}
 * />
 * ```
 */
export function Lazy<T extends Record<string, unknown> = Record<string, unknown>>({
  load,
  fallback = null,
  children,
  componentProps,
  preload = false,
}: LazyProps<T>): ReactElement {
  const LazyComponent = lazy(load)

  if (preload) {
    load()
  }

  return (
    <Suspense fallback={fallback}>
      {children ? (
        children(LazyComponent)
      ) : (
        <LazyComponent {...(componentProps as T)} />
      )}
    </Suspense>
  )
}

Lazy.displayName = 'Lazy'
