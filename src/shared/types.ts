import type { ReactElement, ReactNode } from 'react'

/**
 * Base props that all UI Magic components should extend
 */
export interface BaseComponentProps {
  /**
   * Children to render
   */
  children?: ReactNode
}

/**
 * Utility type for render prop components
 */
export type RenderProp<T = unknown> = (value: T) => ReactNode

/**
 * Utility type for conditional rendering
 */
export type ConditionalRenderProp<T = unknown> = ReactNode | RenderProp<T>

/**
 * Type guard to check if a value is a function (render prop)
 */
export function isFunction<T>(value: unknown): value is RenderProp<T> {
  return typeof value === 'function'
}

/**
 * Utility to render content based on whether it's a render prop or static content
 */
export function renderContent<T>(content: ConditionalRenderProp<T>, value?: T): ReactNode {
  return isFunction(content) ? content(value as T) : (content as ReactNode)
}

/**
 * Type for React elements that can be cloned
 */
export type CloneableElement = ReactElement

/**
 * Utility type for components that accept a fallback
 */
export interface WithFallback {
  fallback?: ReactNode
}

/**
 * Common event handler types
 */
export type EventHandler<T = unknown, E = unknown> = (event: E, data: T) => void
export type VoidEventHandler = () => void

/**
 * Utility type for array of any type
 */
export type AnyArray<T = unknown> = T[]
