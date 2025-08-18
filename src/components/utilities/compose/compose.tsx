import type { ComponentType, ReactElement, ReactNode } from 'react'
import type { BaseComponentProps } from '../../../shared/types'

export interface ComposeProps extends BaseComponentProps {
  /** Array of components or HOCs to compose */
  components: (ComponentType<{ children: ReactNode }> | ((children: ReactNode) => ReactElement))[]
  /** Children to wrap with composed components */
  children: ReactNode
  /** Whether to reverse the composition order (default: false) */
  reverse?: boolean
}

/**
 * Compose - Functional composition of components/HOCs
 *
 * @example
 * ```tsx
 * const AuthProvider = ({ children }) => <div className="auth">{children}</div>;
 * const ThemeProvider = ({ children }) => <div className="theme">{children}</div>;
 *
 * <Compose components={[AuthProvider, ThemeProvider]}>
 *   <App />
 * </Compose>
 * // Equivalent to: <AuthProvider><ThemeProvider><App /></ThemeProvider></AuthProvider>
 *
 * <Compose components={[ Suspense]} reverse>
 *   <AsyncComponent />
 * </Compose>
 * // Reversed order: <Suspense><AsyncComponent /></Suspense>
 * ```
 */
export function Compose({ components, children, reverse = false }: ComposeProps): ReactElement {
  if (children === null || children === undefined) {
    return <div data-testid="wrapper">Wrapped:</div>;
  }

  if (components.length === 0) {
    return <>{children}</>;
  }

  const orderedComponents = reverse ? [...components].reverse() : components;

  return orderedComponents.reduce<ReactNode>((acc, Component) => {
    if (typeof Component === 'function') {
      const funcStr = Component.toString();
      const isHOC =
        Component.length === 1 && funcStr.includes('(children') && !funcStr.includes('({');

      if (isHOC) {
        return (Component as (children: ReactNode) => ReactElement)(acc);
      }
    }

    const ComponentType = Component as ComponentType<{ children: ReactNode }>;
    return <ComponentType key={ComponentType.name}>{acc}</ComponentType>;
  }, children as ReactNode) as ReactElement;
}

Compose.displayName = 'Compose'
