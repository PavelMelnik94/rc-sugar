# Tap Component

A utility component for executing side effects during component lifecycle events without affecting render output. Perfect for debugging, analytics, logging, and development monitoring.

## Description

The `Tap` component provides a declarative way to "tap into" component lifecycle events (mount, unmount, render, children changes) without modifying the rendered output. It acts as a transparent wrapper that allows you to execute side effects at specific lifecycle moments.

## When to Use
- 🔍 **Development Debugging**: Log component lifecycle events during development
- 📊 **Analytics Tracking**: Track component renders and state changes
- 🐛 **Performance Monitoring**: Monitor component behavior and performance
- 🔄 **Side Effect Management**: Execute code without affecting component rendering
- 📝 **Development Logging**: Add temporary logging without cluttering component logic
- ⚡ **Hot Reload Debugging**: Track component updates during development

## Patterns Used
- **Lifecycle Hooks**: Taps into React component lifecycle
- **Side Effect Management**: Executes code without affecting render
- **Transparent Wrapper**: Renders children without modification
- **Environment Awareness**: Can be restricted to development mode
- **Type Safety**: Full TypeScript support with proper event handlers

## TypeScript Types
```typescript
import { ReactNode } from 'react';
import { VoidEventHandler } from '../shared/types';

/**
 * Props for the Tap component
 */
interface TapProps {
  /** Children to render (passed through unchanged) */
  children: ReactNode;

  /** Callback fired when component mounts */
  onMount?: VoidEventHandler;

  /** Callback fired when component unmounts */
  onUnmount?: VoidEventHandler;

  /** Callback fired on every render */
  onRender?: VoidEventHandler;

  /** Callback fired when children change */
  onChildrenChange?: VoidEventHandler;

  /** Whether to run callbacks only in development mode */
  devOnly?: boolean;
}

/** Void event handler type */
type VoidEventHandler = () => void;
```

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | **Required.** Content to render (passed through unchanged) |
| `onMount` | `VoidEventHandler` | `undefined` | Callback executed when component mounts |
| `onUnmount` | `VoidEventHandler` | `undefined` | Callback executed when component unmounts |
| `onRender` | `VoidEventHandler` | `undefined` | Callback executed on every render |
| `onChildrenChange` | `VoidEventHandler` | `undefined` | Callback executed when children prop changes |
| `devOnly` | `boolean` | `false` | If true, callbacks only execute in development mode |

## Examples

### Basic Lifecycle Monitoring
```tsx
import { Tap } from 'react-utility-kit';

function App() {
  return (
    <Tap
      onMount={() => console.log('App component mounted')}
      onUnmount={() => console.log('App component unmounted')}
      onRender={() => console.log('App component rendered')}
    >
      <div>My Application</div>
    </Tap>
  );
}
```

### Analytics Integration
```tsx
import { Tap } from 'react-utility-kit';
import { analytics } from './analytics';

function ProductCard({ product }) {
  return (
    <Tap
      onMount={() => analytics.track('product_card_viewed', {
        productId: product.id,
        productName: product.name
      })}
      onUnmount={() => analytics.track('product_card_hidden', {
        productId: product.id
      })}
    >
      <div className="product-card">
        <h3>{product.name}</h3>
        <p>
$
{product.price}
        </p>
      </div>
    </Tap>
  );
}
```

### Development-Only Debugging
```tsx
import { Tap } from 'react-utility-kit';

function UserProfile({ user }) {
  return (
    <Tap
      devOnly={true}
      onMount={() => console.log('UserProfile mounted with user:', user)}
      onRender={() => console.log('UserProfile rendered at:', new Date())}
      onChildrenChange={() => console.log('User data changed:', user)}
    >
      <div className="user-profile">
        <img src={user.avatar} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </Tap>
  );
}
```

### Performance Monitoring
```tsx
import { Tap } from 'react-utility-kit';

function ExpensiveComponent({ data }) {
  const startTime = useRef<number>();

  return (
    <Tap
      onMount={() => {
        startTime.current = performance.now();
        console.log('ExpensiveComponent: Mount started');
      }}
      onRender={() => {
        if (startTime.current) {
          const renderTime = performance.now() - startTime.current;
          console.log(`ExpensiveComponent: Rendered in ${renderTime}ms`);
        }
      }}
    >
      <ComplexVisualization data={data} />
    </Tap>
  );
}
```

### Error Boundary Integration
```tsx
import { Tap } from 'react-utility-kit';

function ComponentWithErrorTracking({ children }) {
  return (
    <Tap
      onMount={() => console.log('Component mounted successfully')}
      onUnmount={() => console.log('Component unmounted')}
      onRender={() => {
        // Track successful renders
        metrics.increment('component.render.success');
      }}
    >
      <ErrorBoundary
        onError={(error) => {
          console.error('Component error:', error);
          metrics.increment('component.render.error');
        }}
      >
        {children}
      </ErrorBoundary>
    </Tap>
  );
}
```

### A/B Testing Integration
```tsx
import { Tap } from 'react-utility-kit';

function FeatureFlag({ variant, children }) {
  return (
    <Tap
      onMount={() => {
        analytics.track('feature_flag_shown', {
          variant,
          timestamp: Date.now()
        });
      }}
      onUnmount={() => {
        analytics.track('feature_flag_hidden', {
          variant,
          timestamp: Date.now()
        });
      }}
    >
      {children}
    </Tap>
  );
}

// Usage
<FeatureFlag variant="new_checkout">
  <NewCheckoutFlow />
</FeatureFlag>;
```

### Form Tracking
```tsx
import { Tap } from 'react-utility-kit';

function FormSection({ sectionName, children }) {
  return (
    <Tap
      onMount={() => {
        analytics.track('form_section_viewed', {
          section: sectionName,
          timestamp: Date.now()
        });
      }}
      onChildrenChange={() => {
        analytics.track('form_section_updated', {
          section: sectionName
        });
      }}
    >
      <div className="form-section">
        <h3>{sectionName}</h3>
        {children}
      </div>
    </Tap>
  );
}
```

## Performance Considerations

### 🚀 **Optimizations**
- **Zero Render Impact**: Tap component doesn't affect rendering performance
- **Conditional Execution**: Use `devOnly` to avoid production overhead
- **Minimal Memory**: Component maintains minimal internal state
- **Effect Cleanup**: Properly cleans up effects on unmount

### ⚠️ **Considerations**
- **Render Frequency**: `onRender` fires on every render - use sparingly
- **Memory Leaks**: Ensure callback functions don't create memory leaks
- **Development Mode**: Be mindful of `devOnly` setting in different environments

```tsx
// Good: Lightweight logging
<Tap
  devOnly={true}
  onMount={() => console.log('Component mounted')}
>
  <MyComponent />
</Tap>

// Avoid: Heavy operations on every render
<Tap
  onRender={() => {
    // This runs on EVERY render - avoid heavy operations
    heavyAnalyticsOperation();
  }}
>
  <MyComponent />
</Tap>
```

## Best Practices

### ✅ **Recommended**
- Use `devOnly={true}` for development-specific logging
- Keep callback functions lightweight and fast
- Use for analytics and monitoring without affecting UX
- Combine with error boundaries for comprehensive tracking
- Use descriptive names in logging for easier debugging

### ❌ **Avoid**
- Heavy operations in `onRender` callback
- Storing large objects in callback closures
- Using without `devOnly` for debug-only features
- Modifying external state in lifecycle callbacks

## Migration Guide

### From Manual Lifecycle Management
```tsx
// Before: Manual useEffect hooks
function MyComponent() {
  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  useEffect(() => {
    console.log('Component rendered');
  });

  return <div>Content</div>;
}

// After: Using Tap component
function MyComponent() {
  return (
    <Tap
      onMount={() => console.log('Component mounted')}
      onUnmount={() => console.log('Component unmounted')}
      onRender={() => console.log('Component rendered')}
    >
      <div>Content</div>
    </Tap>
  );
}
```

### From Analytics HOCs
```tsx
// Before: Higher-Order Component
function withAnalytics(WrappedComponent) {
  return function AnalyticsWrapper(props) {
    useEffect(() => {
      analytics.track('component_viewed');
    }, []);

    return <WrappedComponent {...props} />;
  };
}

// After: Using Tap component
function MyComponent(props) {
  return (
    <Tap onMount={() => analytics.track('component_viewed')}>
      <OriginalComponent {...props} />
    </Tap>
  );
}
```

## Related Components

- **[`track`](../track/README.md)** - Analytics tracking with event management
- **[`debug`](../debug/README.md)** - Development debugging utilities
- **[`memo`](../memo/README.md)** - Performance optimization with memoization

## Accessibility

The `Tap` component is accessibility-neutral as it doesn't render any UI elements or interfere with the accessibility tree. It purely provides lifecycle monitoring capabilities.

## Environment Considerations

### Development vs Production
```tsx
// Development-only monitoring
<Tap
  devOnly={true}
  onMount={() => console.log('Dev: Component mounted')}
>
  <MyComponent />
</Tap>

// Production analytics
<Tap
  onMount={() => analytics.track('component_viewed')}
>
  <MyComponent />
</Tap>
```
