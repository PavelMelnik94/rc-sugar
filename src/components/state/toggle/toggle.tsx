import type { ReactElement } from 'react'
import type { RenderProp } from '../../../shared/types'
import { useState } from 'react'


export interface ToggleState {
  /**
   * Current toggle state
   */
  on: boolean
  /**
   * Function to toggle state
   */
  toggle: () => void
  /**
   * Function to set state to true
   */
  setOn: () => void
  /**
   * Function to set state to false
   */
  setOff: () => void
  /**
   * Function to set state to specific value
   */
  setState: (state: boolean) => void
}


export interface ToggleProps {
  /**
   * Initial toggle state
   */
  initial?: boolean
  /**
   * Children render prop that receives toggle state
   */
  children: RenderProp<ToggleState>
  /**
   * Callback fired when state changes
   */
  onChange?: (state: boolean) => void
}

/**
 * Toggle component - simplified boolean state management
 *
 * @example
 * ```tsx
 * <Toggle initial={false}>
 *   {({ on, toggle }) => (
 *     <button onClick={toggle}>
 *       {on ? 'ON' : 'OFF'}
 *     </button>
 *   )}
 * </Toggle>
 *
 * <Toggle onChange={(state) => console.log('Toggle:', state)}>
 *   {({ on, setOn, setOff }) => (
 *     <div>
 *       <button onClick={setOn}>Turn On</button>
 *       <button onClick={setOff}>Turn Off</button>
 *       <div>Status: {on ? 'Active' : 'Inactive'}</div>
 *     </div>
 *   )}
 * </Toggle>
 * ```
 */
export function Toggle({ initial = false, children, onChange }: ToggleProps): ReactElement {
  const [on, setOnState] = useState(initial)

  const toggle = (): void => {
    const newState = !on
    setOnState(newState)
    onChange?.(newState)
  }

  const setOn = (): void => {
    if (!on) {
      setOnState(true)
      onChange?.(true)
    }
  }

  const setOff = (): void => {
    if (on) {
      setOnState(false)
      onChange?.(false)
    }
  }

  const setState = (state: boolean): void => {
    if (state !== on) {
      setOnState(state)
      onChange?.(state)
    }
  }

  const toggleState: ToggleState = {
    on,
    toggle,
    setOn,
    setOff,
    setState,
  }

  return <>{children(toggleState)}</>
}

Toggle.displayName = 'Toggle'
