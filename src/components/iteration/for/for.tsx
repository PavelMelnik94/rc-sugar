import type { ReactElement, ReactNode } from 'react'
import type { RenderProp } from '../../../shared/types'


export interface ForProps<T = unknown> {
  /**
   * Array of items to iterate over
   */
  each: T[] | readonly T[]
  /**
   * Render prop function that receives each item and its index
   */
  children: RenderProp<{ item: T; index: number }>
  /**
   * Fallback content to render when array is empty
   */
  fallback?: ReactNode
}

/**
 * For component - renders a list of items using a render prop
 *
 * @example
 * ```tsx
 * <For each={users} fallback={<EmptyState />}>
 *   {({ item: user, index }) => (
 *     <UserCard key={user.id} user={user} index={index} />
 *   )}
 * </For>
 *
 * <For each={[1, 2, 3]}>
 *   {({ item, index }) => <div key={index}>Item: {item}</div>}
 * </For>
 * ```
 */
export function For<T>({ each, children, fallback = null }: ForProps<T>): ReactElement | null {
  if (!Array.isArray(each) || each.length === 0) {
    return <>{fallback}</>
  }

  return <>{each.map((item, index) => children({ item, index }))}</>
}

For.displayName = 'For'
