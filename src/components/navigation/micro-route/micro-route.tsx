import type { ReactNode } from 'react'
import { useState } from 'react'


export type RouteParams = Record<string, string>


export interface MicroRouteProps {
  /**
   * Path pattern with optional parameters (e.g., "/user/:id")
   */
  path: string
  /**
   * Current path to match against
   * If not provided, uses internal state
   */
  currentPath?: string
  /**
   * Render function that receives route parameters
   */
  children: (params: RouteParams) => ReactNode
  /**
   * Whether to match exact path or allow partial matches
   * @default true
   */
  exact?: boolean
}


export interface NotFoundProps {
  children: ReactNode
}


function parsePattern(pattern: string): {
  regex: RegExp
  paramNames: string[]
} {
  const paramNames: string[] = []
  const regexPattern = pattern
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) {
        const paramName = segment.slice(1)
        paramNames.push(paramName)
        return '([^/]+)'
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    })
    .join('/')

  return {
    regex: new RegExp(`^${regexPattern}$`),
    paramNames,
  }
}


function extractParams(path: string, pattern: string): RouteParams | null {
  const { regex, paramNames } = parsePattern(pattern)
  const match = path.match(regex)

  if (!match) {
    return null
  }

  const params: RouteParams = {}
  paramNames.forEach((name, index) => {
    params[name] = match[index + 1]
  })

  return params
}


export function NotFound({ children }: NotFoundProps): ReactNode {
  return <>{children}</>
}

/**
 * MicroRoute component - Micro routing within components
 *
 * @example
 * ```tsx
 * <MicroRoute path="/user/:id" currentPath="/user/123">
 *   {({ id }) => <UserProfile userId={id} />}
 *   <MicroRoute.NotFound>
 *     <Error404 />
 *   </MicroRoute.NotFound>
 * </MicroRoute>
 * ```
 */
export function MicroRoute({ path, currentPath, children }: MicroRouteProps): ReactNode {
  const [internalPath] = useState(currentPath || '/')
  const activePath = currentPath ?? internalPath

  const notFoundComponent: ReactNode = null
  const routeRenderFunction = children

  const params = extractParams(activePath, path)

  if (params !== null) {
    if (typeof routeRenderFunction === 'function') {
      return <>{routeRenderFunction(params)}</>
    }
    return <>{children}</>
  }

  if (notFoundComponent) {
    return <>{notFoundComponent}</>
  }

  return null
}

MicroRoute.NotFound = NotFound

MicroRoute.displayName = 'MicroRoute'
NotFound.displayName = 'NotFound'
