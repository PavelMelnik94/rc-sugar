import type { ReactElement } from 'react'
import { cloneElement, isValidElement } from 'react'


export interface MirrorProps extends Record<string, unknown> {
  /**
   * The React element to clone
   */
  element: ReactElement
}

/**
 * Mirror component - Clones a React element with new props
 *
 * @example
 * ```tsx
 * const originalButton = <button className="old">Original</button>;
 *
 * <Mirror element={originalButton} className="new" onClick={handleClick}>
 *   New Content
 * </Mirror>
 * ```
 */
export function Mirror({ element, ...newProps }: MirrorProps): ReactElement | null {
  if (!isValidElement(element)) {
    console.warn('Mirror: element prop must be a valid React element')
    return null
  }

  // eslint-disable-next-line react/no-clone-element
  return cloneElement(element, newProps)
}

Mirror.displayName = 'Mirror'
