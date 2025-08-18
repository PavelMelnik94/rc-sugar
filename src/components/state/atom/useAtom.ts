import type { AtomState } from './atom'
import { use, useCallback, useEffect, useState } from 'react'
import { AtomContext, atomStore } from './atom-internals'

export function useAtom<T>(key: string, initial?: T): AtomState<T> {
  const context = use(AtomContext)

  // If no context provider, create a minimal fallback
  const { updateAtom, subscribeToAtom } = context || {
    updateAtom: (k: string, newValue: unknown) => {
      const atom = atomStore.get(k)
      if (atom) {
        atom.value = newValue
        for (const callback of atom.subscribers) {
          callback(newValue)
        }
      }
    },
    subscribeToAtom: (k: string, callback: (value: unknown) => void) => {
      const atom = atomStore.get(k)
      if (atom) {
        atom.subscribers.add(callback)
        return () => atom.subscribers.delete(callback)
      }
      return () => {}
    },
  }

  if (!atomStore.has(key)) {
    atomStore.set(key, {
      value: initial,
      subscribers: new Set(),
      initial,
    })
  }

  const atom = atomStore.get(key)
  if (!atom) {
    throw new Error(`Atom "${key}" not found. Make sure to initialize it first.`)
  }

  const [value, setValue] = useState<T>(atom.value as T)

  useEffect(() => {
    const unsubscribe = subscribeToAtom(key, (newValue: unknown) => {
      setValue(newValue as T)
    })
    return unsubscribe
  }, [key, subscribeToAtom])

  const subscribe = useCallback(
    (callback: (value: T) => void) => {
      return subscribeToAtom(key, (value: unknown) => callback(value as T))
    },
    [key, subscribeToAtom]
  )

  const setAtomValue = useCallback(
    (newValue: T | ((previous: T) => T)) => {
      const atom = atomStore.get(key)
      if (atom) {
        const finalValue =
          typeof newValue === 'function'
            ? (newValue as (previous: T) => T)(atom.value as T)
            : newValue
        updateAtom(key, finalValue)
      }
    },
    [key, updateAtom]
  )

  const reset = useCallback(() => {
    const atom = atomStore.get(key)
    if (atom) {
      updateAtom(key, atom.initial as T)
    }
  }, [key, updateAtom])

  return {
    value,
    setValue: setAtomValue,
    reset,
    subscribe,
  }
}
