import type { ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { BaseComponentProps, RenderProp } from '../../../shared/types'

export interface ResourceState<T, E = Error> {
  data: T | null
  error: E | null
  loading: boolean
  refetch: () => Promise<void>
}

export interface ResourceProps<T, E = Error> extends BaseComponentProps {
  /** Function that returns a Promise to load the resource */
  loader: () => Promise<T>
  /** Initial data (optional) */
  initialData?: T
  /** Whether to load immediately on mount (default: true) */
  immediate?: boolean
  /** Dependencies that trigger a reload when changed */
  deps?: unknown[]
  /** Custom error handler */
  onError?: (error: E) => void
  /** Success callback */
  onSuccess?: (data: T) => void
  /** Children render function */
  children: RenderProp<ResourceState<T, E>>
}

/**
 * Resource - Async resource management with loading states
 *
 * Perfect for FSD architecture - handles async operations in entities, features, and widgets
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Resource loader={() => fetchUser(userId)}>
 *   {({ data, loading, error, refetch }) => {
 *     if (loading) return <Spinner />;
 *     if (error) return <Error error={error} onRetry={refetch} />;
 *     if (data) return <UserProfile user={data} />;
 *     return null;
 *   }}
 * </Resource>
 *
 * // With dependencies
 * <Resource 
 *   loader={() => fetchUserPosts(userId)}
 *   deps={[userId]}
 * >
 *   {({ data, loading }) => (
 *     loading ? <PostsSkeleton /> : <PostsList posts={data} />
 *   )}
 * </Resource>
 * ```
 */
export function Resource<T, E = Error>({
  loader,
  initialData = null,
  immediate = true,
  deps = [],
  onError,
  onSuccess,
  children
}: ResourceProps<T, E>) {
  const [data, setData] = useState<T | null>(initialData)
  const [error, setError] = useState<E | null>(null)
  const [loading, setLoading] = useState(immediate && !initialData)
  const abortControllerRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  const loadResource = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    const controller = abortControllerRef.current

    setLoading(true)
    setError(null)

    try {
      const result = await loader()
      
      if (controller.signal.aborted || !mountedRef.current) {
        return
      }

      setData(result)
      onSuccess?.(result)
    } catch (err) {
      if (controller.signal.aborted || !mountedRef.current) {
        return
      }

      const error = err as E
      setError(error)
      onError?.(error)
    } finally {
      if (!controller.signal.aborted && mountedRef.current) {
        setLoading(false)
      }
    }
  }, [loader, onError, onSuccess])

  const refetch = useCallback(async () => {
    return loadResource()
  }, [loadResource])

  useEffect(() => {
    if (immediate) {
      loadResource()
    }
  }, [loadResource, immediate, ...deps])

  useEffect(() => {
    return () => {
      mountedRef.current = false
      abortControllerRef.current?.abort()
    }
  }, [])

  const resourceState: ResourceState<T, E> = {
    data,
    error,
    loading,
    refetch
  }

  return children(resourceState)
}

// Compound component patterns
Resource.Loading = function Loading({ children }: { children: ReactNode }) {
  return <>{children}</>
}

Resource.Error = function Error<E>({ 
  error,
  onRetry,
  children 
}: { 
  error: E
  onRetry?: () => void
  children?: RenderProp<{ error: E; retry: () => void }>
}) {
  const retry = onRetry || (() => {})
  
  if (typeof children === 'function') {
    return children({ error, retry })
  }
  
  return <>{children}</>
}

Resource.Success = function Success<T>({ 
  data,
  children 
}: { 
  data: T
  children: RenderProp<T>
}) {
  return children(data)
}

// Type exports for better TypeScript experience
export type { ResourceState }