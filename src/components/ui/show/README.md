# Show Component

A simple and declarative utility component for conditional rendering in React, providing a clean alternative to ternary operators and logical AND expressions for show/hide logic.

## Description

The `Show` component provides a declarative way to render content only if a condition is true, making your JSX cleaner and more readable. It's perfect for simple conditional rendering scenarios where you need to show or hide content based on a boolean condition, with optional fallback content.

The component supports both static content and render prop patterns for lazy evaluation, making it suitable for both simple and performance-critical scenarios.

## When to Use

- **Simple conditional rendering** based on boolean values
- **Show/hide UI elements** without complex logic
- **Avoiding inline ternary operators** that clutter JSX
- **Improving readability** for simple conditional logic
- **Clean fallback content** for false conditions
- **Performance-critical scenarios** with lazy evaluation
- **Simple toggle functionality** (modals, dropdowns, etc.)

## How It Works

The `Show` component:

1. **Evaluates condition**: Checks if the `when` prop is true
2. **Renders children**: If true, renders children or calls render function
3. **Shows fallback**: If false, renders fallback content or calls fallback function
4. **Lazy evaluation**: Supports function children for expensive computations
5. **Returns null**: If condition is false and no fallback provided

## Patterns Used

- **Conditional Rendering**: Simple boolean-based rendering
- **Render Props Pattern**: Support for function children and fallback
- **Guard Pattern**: Protects expensive operations with boolean checks
- **Type Safety**: Full TypeScript support with proper typing
- **Fallback Pattern**: Graceful degradation with optional fallback content

## TypeScript Types

```typescript
/**
 * Props for the Show component
 */
interface ShowProps {
  /**
   * The condition to evaluate
   */
  when: boolean;
  /**
   * Content to render when condition is true
   * Can be ReactNode or render function for lazy evaluation
   */
  children: ReactNode | (() => ReactNode);
  /**
   * Fallback content to render when condition is false
   * Can be ReactNode or render function for lazy evaluation
   */
  fallback?: ReactNode | (() => ReactNode);
}
```

## API

### Show Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `when` | `boolean` | ✅ | Condition to evaluate for showing content |
| `children` | `ReactNode \| (() => ReactNode)` | ✅ | Content to render when condition is true |
| `fallback` | `ReactNode \| (() => ReactNode)` | ❌ | Content to render when condition is false |

## Examples

### Basic Usage

```tsx
import { Show } from 'rc-sugar';

function UserGreeting({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <Show when={isLoggedIn}>
      <div className="welcome-message">
        <h2>Welcome back!</h2>
        <p>Good to see you again.</p>
      </div>
    </Show>
  );
}
```

### With Fallback Content

```tsx
import { Show } from 'rc-sugar';

function AuthSection({ user }: { user: User | null }) {
  return (
    <Show when={!!user} fallback={<LoginForm />}>
      <UserDashboard user={user} />
    </Show>
  );
}
```

### Modal Visibility

```tsx
import { Show } from 'rc-sugar';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="app">
      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      <Show when={isModalOpen}>
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2>Modal Content</h2>
          <p>This is a modal dialog.</p>
        </Modal>
      </Show>
    </div>
  );
}
```

### Loading States

```tsx
import { Show } from 'rc-sugar';

function DataComponent({ isLoading, data }: { isLoading: boolean; data: any[] }) {
  return (
    <div className="data-component">
      <Show when={isLoading} fallback={<DataTable data={data} />}>
        <div className="loading-state">
          <Spinner />
          <p>Loading data...</p>
        </div>
      </Show>
    </div>
  );
}
```

### Error Boundaries

```tsx
import { Show } from 'rc-sugar';

function ApiResponseHandler({
  isError,
  error,
  data
}: {
  isError: boolean;
  error?: string;
  data?: any;
}) {
  return (
    <Show when={isError} fallback={<SuccessContent data={data} />}>
      <div className="error-state">
        <ErrorIcon />
        <h3>Oops! Something went wrong</h3>
        <p>{error || 'An unexpected error occurred'}</p>
        <button onClick={retryRequest}>Try Again</button>
      </div>
    </Show>
  );
}
```

### Lazy Evaluation for Performance

```tsx
import { Show } from 'rc-sugar';

function ExpensiveRenderer({ shouldRender }: { shouldRender: boolean }) {
  return (
    <Show when={shouldRender}>
      {() => {
        // This expensive computation only runs when shouldRender is true
        console.log('Rendering expensive component...');
        return <HeavyComputationComponent />;
      }}
    </Show>
  );
}
```

### Feature Flags

```tsx
import { Show } from 'rc-sugar';

function FeatureToggle({
  isFeatureEnabled,
  children
}: {
  isFeatureEnabled: boolean;
  children: ReactNode;
}) {
  return (
    <Show when={isFeatureEnabled}>
      {children}
    </Show>
  );
}

// Usage
function App() {
  return (
    <div>
      <FeatureToggle isFeatureEnabled={flags.newDashboard}>
        <NewDashboard />
      </FeatureToggle>

      <FeatureToggle isFeatureEnabled={flags.betaFeatures}>
        <BetaFeaturesPanel />
      </FeatureToggle>
    </div>
  );
}
```

### Responsive Design

```tsx
import { Show } from 'rc-sugar';

function ResponsiveLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  return (
    <div className="layout">
      <Show when={isMobile} fallback={<DesktopNavigation />}>
        <MobileNavigation />
      </Show>

      <main className="content">
        <Show when={!isMobile}>
          <Sidebar />
        </Show>

        <div className="main-content">
          <ContentArea />
        </div>
      </main>
    </div>
  );
}
```

### Permissions and Access Control

```tsx
import { Show } from 'rc-sugar';

function ProtectedContent({
  userPermissions,
  requiredPermission
}: {
  userPermissions: string[];
  requiredPermission: string;
}) {
  const hasPermission = userPermissions.includes(requiredPermission);

  return (
    <Show when={hasPermission} fallback={<AccessDeniedMessage />}>
      <SensitiveContent />
    </Show>
  );
}
```

### Form Validation Messages

```tsx
import { Show } from 'rc-sugar';

function FormField({
  value,
  error,
  touched
}: {
  value: string;
  error?: string;
  touched: boolean;
}) {
  const showError = touched && !!error;

  return (
    <div className="form-field">
      <input value={value} className={showError ? 'error' : ''} />
      <Show when={showError}>
        <span className="error-message">{error}</span>
      </Show>
    </div>
  );
}
```

### Notification System

```tsx
import { Show } from 'rc-sugar';

function NotificationContainer({ notifications }: { notifications: Notification[] }) {
  const hasNotifications = notifications.length > 0;

  return (
    <Show when={hasNotifications}>
      <div className="notification-container">
        {notifications.map(notification => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </Show>
  );
}
```

### Complex Conditional UI

```tsx
import { Show } from 'rc-sugar';

function ShoppingCart({
  items,
  isCheckingOut,
  isLoggedIn
}: {
  items: CartItem[];
  isCheckingOut: boolean;
  isLoggedIn: boolean;
}) {
  const hasItems = items.length > 0;
  const canCheckout = hasItems && isLoggedIn && !isCheckingOut;

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>

      <Show when={hasItems} fallback={<EmptyCartMessage />}>
        <CartItemsList items={items} />
        <CartSummary items={items} />

        <Show when={canCheckout} fallback={<LoginPrompt />}>
          <CheckoutButton items={items} />
        </Show>
      </Show>
    </div>
  );
}
```

## Performance Considerations

- **Render Functions**: Use function children for expensive computations
- **Boolean Evaluation**: Simple boolean checks are very fast
- **Re-renders**: Component re-renders when `when` prop changes
- **Fallback Functions**: Use function fallback for expensive fallback content

## Best Practices

1. **Use for Simple Conditions**: Perfect for straightforward boolean-based rendering
2. **Provide Meaningful Fallbacks**: Consider what to show when condition is false
3. **Lazy Evaluation**: Use function children for expensive operations
4. **Descriptive Props**: Use descriptive boolean variables instead of complex expressions
5. **Combine with Other Components**: Works well with If, Switch, and Maybe components
6. **Avoid Deep Nesting**: For complex logic, consider using If component instead

## Migration from Ternary Operators

### Before (Inline Ternary)
```tsx
// ❌ Inline ternary operators can be hard to read
return (
  <div>
    {isLoading
? (
      <div className="loading">
        <Spinner />
        <span>Loading...</span>
      </div>
    )
: null}

    {hasError ? <ErrorMessage error={error} /> : null}

    {user ? <UserProfile user={user} /> : <LoginForm />}
  </div>
);
```

### After (Clean and Declarative)
```tsx
// ✅ Clean and readable Show components
return (
  <div>
    <Show when={isLoading}>
      <div className="loading">
        <Spinner />
        <span>Loading...</span>
      </div>
    </Show>

    <Show when={hasError}>
      <ErrorMessage error={error} />
    </Show>

    <Show when={!!user} fallback={<LoginForm />}>
      <UserProfile user={user} />
    </Show>
  </div>
);
```

## Common Patterns

### Toggle States
```tsx
<Show when={isExpanded} fallback={<ExpandButton />}>
  <CollapseButton />
</Show>;
```

### Data Loading
```tsx
<Show when={!isLoading} fallback={<LoadingSkeleton />}>
  <DataDisplay data={data} />
</Show>;
```

### User Authentication
```tsx
<Show when={isAuthenticated} fallback={<LoginRequired />}>
  <AuthenticatedContent />
</Show>;
```

## Related Components

- [`If`](../if/README.md) - Complex conditional rendering with ElseIf/Else
- [`Maybe`](../maybe/README.md) - Null-safe rendering
- [`Switch`](../switch/README.md) - Value-based conditional rendering
