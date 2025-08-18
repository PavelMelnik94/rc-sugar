# Atom Component

The `Atom` component is a lightweight and powerful atomic state management solution for React applications. It provides isolated, shareable state units that can be accessed across components without prop drilling.

## Features

- **Atomic State Management**: Encapsulates state logic in isolated units.
- **Global Store**: Shares state across components using unique keys.
- **Subscription System**: Reactively updates components on state changes.
- **TypeScript Support**: Fully typed API for safe and predictable usage.

## API

### Props

| Prop       | Type                        | Required | Description                                      |
|------------|-----------------------------|----------|--------------------------------------------------|
| `atomKey`  | `string`                    | ✅        | Unique identifier for the atom in the global store. |
| `initial`  | `T`                         | ✅        | Initial value for the atom.                     |
| `children` | `(state: AtomState<T>) => ReactNode` | ✅        | Render prop receiving atom state and actions.   |

### AtomState<T>

```typescript
interface AtomState<T = any> {
  value: T; // Current atom value
  setValue: (value: T | ((prev: T) => T)) => void; // Update atom value
  reset: () => void; // Reset atom to initial value
  subscribe: (callback: (value: T) => void) => () => void; // Subscribe to changes
}
```

## Examples

### Counter Example

```tsx
import { Atom } from 'ui-magic-core';

function Counter() {
  return (
    <Atom atomKey="counter" initial={0}>
      {({ value, setValue, reset }) => (
        <div>
          <p>Count: {value}</p>
          <button onClick={() => setValue(prev => prev + 1)}>Increment</button>
          <button onClick={() => setValue(prev => prev - 1)}>Decrement</button>
          <button onClick={reset}>Reset</button>
        </div>
      )}
    </Atom>
  );
}
```

### Theme Management

```tsx
interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
}

function ThemeProvider({ children }) {
  const defaultTheme: Theme = { mode: 'light', primaryColor: '#007bff' };

  return (
    <Atom atomKey="theme" initial={defaultTheme}>
      {({ value: theme, setValue: setTheme }) => (
        <div style={{ backgroundColor: theme.primaryColor }}>
          <button onClick={() => setTheme(prev => ({ ...prev, mode: prev.mode === 'light' ? 'dark' : 'light' }))}>
            Toggle Theme
          </button>
          {children}
        </div>
      )}
    </Atom>
  );
}
```

## Best Practices

1. Use unique `atomKey` values to avoid conflicts.
2. Keep atom state focused and modular.
3. Leverage TypeScript for type-safe state management.
4. Clean up subscriptions when no longer needed.

## Performance Tips

- Create granular atoms for specific state pieces.
- Avoid frequent updates to high-level atoms.
- Use memoization for derived state or expensive calculations.
