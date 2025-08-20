import type { z } from 'zod'
import React from 'react'

type DependencyMap = Record<string, unknown>

export type InferDependencies<T> = T extends Record<string, unknown> ? T : never

export type ExtractDependencyTypes<T extends DependencyMap> = {
  [K in keyof T]: T[K]
}

export const createDependencyContext = <T extends DependencyMap>(options?: {
  schema?: z.ZodSchema<T>
  contextName?: string
}): {
  Provider: React.FC<{ dependencies: T; children: React.ReactNode; isDebug?: boolean }>
  useDependency: {
    (): T
    <K extends keyof T>(key: K): T[K]
  }
  createTestProvider: (dependencies: Partial<T>) => React.FC<{ children: React.ReactNode }>
} => {
  const Context = React.createContext<T | null>(null)

  const ProviderComponent: React.FC<{
    dependencies: T
    children: React.ReactNode
    isDebug?: boolean
  }> = ({ dependencies, children, isDebug = false }) => {
    if (isDebug && options?.schema) {
      try {
        options.schema.parse(dependencies)
      } catch (error) {
        console.error('Dependency validation failed:', error)
      }
    }

    return <Context value={dependencies}>{children}</Context>
  }

  ProviderComponent.displayName = options?.contextName
    ? `${options.contextName}Provider`
    : 'DependencyProvider'

  const Provider = React.memo(ProviderComponent)
  Provider.displayName = ProviderComponent.displayName

  function useDependency(): T
  function useDependency<K extends keyof T>(key: K): T[K]
  function useDependency<K extends keyof T>(key?: K): T | T[K] {
    const context = React.use(Context)
    if (!context) {
      throw new Error(`Dependency context not found. Make sure Provider is used.`)
    }
    if (key === undefined) {
      return context
    }
    if (!(key in context)) {
      const availableKeys = Object.keys(context).join(', ')
      throw new Error(
        `Dependency "${String(key)}" not found. Available dependencies: [${availableKeys}]`
      )
    }
    return context[key]
  }

  const createTestProvider = (
    dependencies: Partial<T>
  ): React.FC<{ children: React.ReactNode }> => {
    const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <Provider dependencies={dependencies as T}>{children}</Provider>
    )
    TestProvider.displayName = 'TestProvider'
    return TestProvider
  }

  return { Provider, useDependency, createTestProvider }
}

export type { DependencyMap }
