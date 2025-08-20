import type { RenderProp } from '../../../shared/types'

export interface RepeatProps {
  /**
   * Number of times to repeat the content
   */
  times: number
  /**
   * Render prop function that receives the current index
   */
  children: RenderProp<number>
}

/**
 * Repeat component - generates N copies of content with index
 *
 * @example
 * ```tsx
 * <Repeat times={5}>
 *   {(index) => <div key={index}>Item {index + 1}</div>}
 * </Repeat>
 *
 * <Repeat times={3}>
 *   {(index) => <SkeletonLoader key={index} />}
 * </Repeat>
 * ```
 */
export function Repeat({ times, children }: RepeatProps): React.JSX.Element | null {
  if (times <= 0) {
    return null
  }

  return <>{Array.from({ length: times }, (_, index) => children(index))}</>
}

Repeat.displayName = 'Repeat'
