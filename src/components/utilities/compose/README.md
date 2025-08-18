# Compose Component

The `Compose` component enables functional composition of multiple React components or higher-order components (HOCs). It wraps children with the specified components in the desired order.

## API

### Props

- **`components`** (required):
  An array of React components or HOCs to compose.
  Type: `(ComponentType<{ children: ReactNode }> | ((children: ReactNode) => ReactElement))[]`

- **`children`** (required):
  The content to be wrapped by the composed components.
  Type: `ReactNode`

- **`reverse`** (optional):
  Whether to reverse the composition order.
  Default: `false`
  Type: `boolean`

---

## Usage

### Example 1: Basic Composition

```tsx
const AuthProvider = ({ children }) => <div className="auth">{children}</div>;
const ThemeProvider = ({ children }) => <div className="theme">{children}</div>;

<Compose components={[AuthProvider, ThemeProvider]}>
  <App />
</Compose>
// Equivalent to: <AuthProvider><ThemeProvider><App /></ThemeProvider></AuthProvider>
```

### Example 2: Reversed Composition

```tsx
const SuspenseWrapper = ({ children }) => <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;

<Compose components={[SuspenseWrapper]} reverse>
  <AsyncComponent />
</Compose>
// Equivalent to: <SuspenseWrapper><AsyncComponent /></SuspenseWrapper>
```

### Example 3: Handling HOCs

```tsx
const withLogger = (children) => <div className="logger">{children}</div>;

<Compose components={[withLogger]}>
  <div>Content</div>
</Compose>
// Equivalent to: <div className="logger"><div>Content</div></div>
```

---

## Notes

- If `components` is an empty array, the `children` are rendered as-is.
- If `children` is `null` or `undefined`, a wrapper `<div data-testid="wrapper">Wrapped:</div>` is rendered.
- The `reverse` prop allows flexibility in the order of composition.

---

