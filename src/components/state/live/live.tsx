import type { ReactNode } from 'react'
import type { RenderProp } from '../../../shared/types'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface LiveProps<T = unknown> {
  /** Function that returns current live value */
  source: () => T | Promise<T>
  /** Polling interval in milliseconds (default: 1000) */
  interval?: number
  /** Initial value while loading */
  initial?: T
  /** Whether to start automatically (default: true) */
  autoStart?: boolean
  /** Compare function to determine if value changed */
  compare?: (prev: T, next: T) => boolean
  /** Render prop receiving live state */
  children: RenderProp<LiveState<T>>
}

export interface LiveState<T = unknown> {
  /** Current live value */
  value: T | undefined
  /** Previous value */
  previousValue: T | undefined
  /** Whether currently loading */
  isLoading: boolean
  /** Whether live updates are active */
  isLive: boolean
  /** Error if source function fails */
  error: Error | null
  /** Start live updates */
  start: () => void
  /** Stop live updates */
  stop: () => void
  /** Refresh value immediately */
  refresh: () => Promise<void>
  /** Number of updates received */
  updateCount: number
  /** Timestamp of last update */
  lastUpdate: Date | null
}

/**
 * Live - Real-time reactive data with automatic updates
 *
 * @example
 * ```tsx
 * <Live source={() => fetch('/api/status').then(r => r.json())} interval={5000}>
 *   {({ value, isLive, isLoading, error, start, stop, refresh }) => (
 *     <div>
 *       <h3>System Status {isLive && '🟢'}</h3>
 *       {isLoading && <p>Loading...</p>}
 *       {error && <p>Error: {error.message}</p>}
 *       {value && <pre>{JSON.stringify(value, null, 2)}</pre>}
 *       <button onClick={isLive ? stop : start}>
 *         {isLive ? 'Stop' : 'Start'} Live Updates
 *       </button>
 *       <button onClick={refresh}>Refresh Now</button>
 *     </div>
 *   )}
 * </Live>
 *
 * <Live source={() => Date.now()} interval={1000} compare={(a, b) => a !== b}>
 *   {({ value, updateCount }) => (
 *     <p>Current time: {new Date(value).toLocaleTimeString()} (Updates: {updateCount})</p>
 *   )}
 * </Live>
 * ```
 */
export function Live<T = unknown>({
  source,
  interval = 1000,
  initial,
  autoStart = true,
  compare,
  children,
}: LiveProps<T>): ReactNode {
  const [state, setState] = useState<Omit<LiveState<T>, 'start' | 'stop' | 'refresh'>>({
    value: initial,
    previousValue: undefined,
    isLoading: false,
    isLive: false,
    error: null,
    updateCount: 0,
    lastUpdate: null,
  })

  const intervalRef = useRef<number | null>(null)
  const mountedRef = useRef(true)

  const refresh = useCallback(async (): Promise<void> => {
    if (!mountedRef.current) return

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const newValue = await source()

      if (!mountedRef.current) return

      setState((prev) => {
        const shouldUpdate = compare ? compare(prev.value!, newValue) : true

        if (shouldUpdate) {
          return {
            ...prev,
            value: newValue,
            previousValue: prev.value,
            isLoading: false,
            updateCount: prev.updateCount + 1,
            lastUpdate: new Date(),
          }
        }

        return { ...prev, isLoading: false }
      })
    } catch (error) {
      if (mountedRef.current) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error as Error,
        }))
      }
    }
  }, [source, compare])

  const setLiveState = useCallback((isLive: boolean) => {
    setState((prev) => ({ ...prev, isLive }))
  }, [])

  const start = useCallback((): void => {
    if (intervalRef.current || state.isLive) return

    setLiveState(true)

    refresh()

    intervalRef.current = setInterval(() => {
      refresh()
    }, interval) as unknown as number
  }, [state.isLive, interval, refresh, setLiveState])

  const stop = useCallback((): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setLiveState(false)
  }, [setLiveState])

  useEffect(() => {
    if (autoStart) {
      start()
    }

    return () => {
      mountedRef.current = false
      stop()
    }
  }, [autoStart])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        refresh()
      }, interval) as unknown as number
    }
  }, [interval, refresh])

  return children({
    ...state,
    start,
    stop,
    refresh,
  })
}

Live.displayName = 'Live'
