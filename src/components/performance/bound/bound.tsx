import type { FC } from 'react'
import type { RenderProp as RenderProperty } from '../../../shared/types'
import { clamp } from '../../../shared/utils'

export interface BoundProperties {
  /**
   * Value to clamp/bound
   */
  value: number
  /**
   * Minimum value
   */
  min: number
  /**
   * Maximum value
   */
  max: number
  /**
   * Children render prop that receives the bounded value
   */
  children: RenderProperty<number>
  /**
   * Callback fired when value is clamped
   */
  onClamp?: (originalValue: number, clampedValue: number) => void
}

/**
 * Bound component - clamps a value between min and max bounds
 *
 * @example
 * ```tsx
 * <Bound value={scrollY} min={0} max={100}>
 *   {(boundedValue) => (
 *     <ProgressBar value={boundedValue} />
 *   )}
 * </Bound>
 *
 * <Bound
 *   value={userInput}
 *   min={0}
 *   max={999}
 *   onClamp={(original, clamped) =>
 *     console.log(`Clamped ${original} to ${clamped}`)
 *   }
 * >
 *   {(value) => <Display value={value} />}
 * </Bound>
 * ```
 */
export const Bound: FC<BoundProperties> = ({ value, min, max, children, onClamp }) => {
  const clampedValue = clamp(value, min, max)

  if (clampedValue !== value && onClamp) {
    onClamp(value, clampedValue)
  }

  return <>{children(clampedValue)}</>
}

Bound.displayName = 'Bound'
