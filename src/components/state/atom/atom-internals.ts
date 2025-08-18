import { createContext } from 'react'

export const atomStore = new Map<
  string,
  {
    value: unknown
    subscribers: Set<(value: unknown) => void>
    initial: unknown
  }
>()

export const clearAtomStore = (): void => atomStore.clear()

export function noopSubscribeToAtom(): () => void {
  return () => {}
}

export const AtomContext = createContext<{
  updateAtom: (key: string, value: unknown) => void
  subscribeToAtom: (key: string, callback: (value: unknown) => void) => () => void
}>({
  updateAtom: () => {},
  subscribeToAtom: noopSubscribeToAtom,
})
