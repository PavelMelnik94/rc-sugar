import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import { AtomContext, atomStore } from './atom-internals'
import { useAtom } from './useAtom'

export interface AtomProperties<T = unknown> {
  /** Unique atom key */
  atomKey: string
  /** Initial value */
  initial: T
  /** Render prop receiving atom state and actions */
  children: (state: AtomState<T>) => ReactNode
}

export interface AtomState<T = unknown> {
  /** Current atom value */
  value: T
  /** Set new value */
  setValue: (value: T | ((previous: T) => T)) => void
  /** Reset to initial value */
  reset: () => void
  /** Subscribe to changes (returns unsubscribe function) */
  subscribe: (callback: (value: T) => void) => () => void
}

export function AtomProvider({ children }: { children: ReactNode }): React.ReactElement {
  const updateAtom = useCallback((key: string, value: unknown) => {
    const atom = atomStore.get(key)
    if (atom) {
      atom.value = value
      for (const callback of atom.subscribers) callback(value)
    }
  }, [])

  const subscribeToAtom = useCallback((key: string, callback: (value: unknown) => void) => {
    const atom = atomStore.get(key)
    if (atom) {
      atom.subscribers.add(callback)
      return () => atom.subscribers.delete(callback)
    }
    return () => {}
  }, [])

  const contextValue = useMemo(
    () => ({ updateAtom, subscribeToAtom }),
    [updateAtom, subscribeToAtom]
  )
  return <AtomContext value={contextValue}>{children}</AtomContext>
}

AtomProvider.displayName = 'AtomProvider'

/**
 * Atom - Atomic state management with global sharing
 *
 * @example
 * ```tsx
 * // Wrap app with AtomProvider
 * <AtomProvider>
 *   <App />
 * </AtomProvider>
 *
 * // Use Atom component
 * <Atom key="counter" initial={0}>
 *   {({ value, setValue, reset }) => (
 *     <div>
 *       <p>Count: {value}</p>
 *       <button onClick={() => setValue(v => v + 1)}>+</button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   )}
 * </Atom>
 *
 * // Use useAtom hook anywhere
 * function AnyComponent() {
 *   const { value, setValue } = useAtom('counter', 0);
 *   return <button onClick={() => setValue(v => v + 1)}>{value}</button>;
 * ```
 */

export function Atom<T = unknown>({ atomKey, initial, children }: AtomProperties<T>): ReactNode {
  const atomState = useAtom<T>(atomKey, initial)
  return children(atomState)
}

Atom.displayName = 'Atom'
