import type { RenderProp } from '../../../shared/types'
import { useEffect, useRef, useState } from 'react'

/**
 * Ticker state interface
 */
export interface TickerState {
  /**
   * Current tick count
   */
  count: number
  /**
   * Function to stop the ticker
   */
  stop: () => void
  /**
   * Function to restart the ticker
   */
  restart: () => void
  /**
   * Whether ticker is currently running
   */
  isRunning: boolean
}

export interface TickerProps {
  /**
   * Interval in milliseconds
   */
  interval: number
  /**
   * Callback fired on each tick
   */
  onTick?: (count: number) => void
  /**
   * Whether to start immediately
   */
  autoStart?: boolean
  /**
   * Maximum number of ticks (infinite if not provided)
   */
  maxTicks?: number
  /**
   * Callback fired when ticker stops
   */
  onStop?: (finalCount: number) => void
  /**
   * Children render prop that receives ticker state
   */
  children?: RenderProp<TickerState>
}

/**
 * Ticker component - executes actions at intervals with automatic cleanup
 *
 * @example
 * ```tsx
 * <Ticker interval={1000} onTick={() => console.log("Tick!")}>
 *   {({ count, stop, isRunning }) => (
 *     <div>
 *       Count: {count}
 *       <button onClick={stop}>Stop</button>
 *     </div>
 *   )}
 * </Ticker>
 *
 * <Ticker
 *   interval={5000}
 *   maxTicks={10}
 *   onTick={(count) => fetchData(count)}
 *   onStop={(count) => console.log(`Finished ${count} ticks`)}
 * />
 * ```
 */
export function Ticker({
  interval,
  onTick,
  autoStart = true,
  maxTicks,
  onStop,
  children,
}: TickerProps): React.JSX.Element | null {
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    onStop?.(count)
  }

  const restart = (): void => {
    stop()
    setCount(0)
    setIsRunning(true) 
  } 

  useEffect((): (() => void) | void => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setCount((prevCount) => {
        const newCount = prevCount + 1

        if (maxTicks && newCount >= maxTicks) {
          setIsRunning(false)
          onStop?.(newCount)
          return newCount
        }

        onTick?.(newCount)
        return newCount
      })
    }, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, interval, onTick, maxTicks, onStop])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const tickerState: TickerState = {
    count,
    stop,
    restart,
    isRunning,
  }

  return children ? <>{children(tickerState)}</> : null
}

Ticker.displayName = 'Ticker'
