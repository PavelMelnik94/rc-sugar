# Debug Component

A comprehensive development utility for debugging React components with console logging, data inspection, and development-only features.

## Description

The `Debug` component provides a powerful yet simple way to debug React applications during development. It logs component data, props, and custom information to the console with structured formatting and timestamps. The component is designed to be development-friendly with production safety controls, making it easy to add debugging throughout your application without worrying about performance or security in production builds.

## When to Use

### Perfect For
- **Development Debugging**: Logging props, state, and data flow
- **Component Inspection**: Understanding component render cycles
- **Data Flow Analysis**: Tracking how data changes through components
- **Performance Debugging**: Identifying unnecessary re-renders
- **Feature Development**: Temporary debugging during feature implementation
- **Bug Investigation**: Understanding component behavior in specific scenarios
- **Third-party Integration**: Debugging external library interactions
- **State Management**: Tracking state changes in complex applications

### Avoid When
- Production builds (unless explicitly enabled)
- Performance-critical render paths
- Components that render frequently (without performance considerations)
- Sensitive data that shouldn't be logged

## Patterns Used
- **Transparent Wrapper Pattern**: Doesn't affect component tree structure
- **Development Tool Pattern**: Environment-aware debugging
- **Structured Logging Pattern**: Organized console output with grouping
- **Side Effect Pattern**: Uses useEffect for non-rendering side effects

## TypeScript Interface

```typescript
/**
 * Props for the Debug component
 */
interface DebugProps {
  /**
   * Children to render (component acts as transparent wrapper)
   */
  children: ReactNode;

  /**
   * Custom label for debug output identification
   */
  label?: string;

  /**
   * Whether to disable debug logging
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional data to log alongside component information
   */
  data?: Record<string, any>;
}
```

## API Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | ✅ | Children to render (passed through unchanged) |
| `label` | `string` | ❌ | Custom label for debug output (default: 'Debug') |
| `disabled` | `boolean` | ❌ | Disable debug logging (default: false) |
| `data` | `Record<string, any>` | ❌ | Additional data to log |

## Examples

### Basic Component Debugging
```tsx
import { Debug } from 'react-utility-kit';

function UserProfile({ user, settings }) {
  return (
    <Debug label="UserProfile" data={{ user, settings }}>
      <div className="user-profile">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <UserSettings settings={settings} />
      </div>
    </Debug>
  );
}

// Console output:
// 🐛 UserProfile
// Debug Info: {
//   label: "UserProfile",
//   timestamp: "2025-06-13T10:30:45.123Z",
//   data: { user: {...}, settings: {...} },
//   children: [object Object]
// }
// Additional Data: { user: {...}, settings: {...} }
```

### Conditional Debug Control
```tsx
function ProductCard({ product, debugMode = true }) {
  return (
    <Debug
      label="ProductCard"
      disabled={!debugMode}
      data={{
        productId: product.id,
        price: product.price,
        inStock: product.inventory > 0
      }}
    >
      <div className="product-card">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>
$
{product.price}
        </p>
        {product.inventory === 0 && <span>Out of Stock</span>}
      </div>
    </Debug>
  );
}
```

### State Change Debugging
```tsx
function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const addItem = (item) => {
    setItems(prev => [...prev, item]);
    setTotal(prev => prev + item.price);
  };

  return (
    <Debug
      label="ShoppingCart State"
      data={{
        itemCount: items.length,
        items: items.map(item => ({ id: item.id, name: item.name, price: item.price })),
        total,
        lastUpdate: Date.now()
      }}
    >
      <div className="shopping-cart">
        <h2>
Shopping Cart (
{items.length}
{' '}
items)
        </h2>
        <CartItems items={items} />
        <CartTotal total={total} />
        <AddItemForm onAdd={addItem} />
      </div>
    </Debug>
  );
}
```

### API Response Debugging
```tsx
function DataFetcher({ url }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return (
    <Debug
      label="API Data Fetch"
      data={{
        url,
        loading,
        error,
        dataReceived: !!data,
        dataSize: data ? JSON.stringify(data).length : 0,
        responseTime: Date.now() // Could track actual response time
      }}
    >
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {data && <DataDisplay data={data} />}
    </Debug>
  );
}
```

### Form Validation Debugging
```tsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim())
newErrors.name = 'Name is required';
    if (!formData.email.includes('@'))
newErrors.email = 'Valid email required';
    if (formData.message.length < 10)
newErrors.message = 'Message too short';

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Debug
      label="Form Validation"
      data={{
        formData,
        errors,
        isValid,
        fieldsFilled: Object.values(formData).filter(v => v.trim()).length,
        totalFields: Object.keys(formData).length
      }}
    >
      <form onSubmit={(e) => { e.preventDefault(); validateForm(); }}>
        <FormField
          label="Name"
          value={formData.name}
          onChange={value => setFormData(prev => ({ ...prev, name: value }))}
          error={errors.name}
        />
        <FormField
          label="Email"
          value={formData.email}
          onChange={value => setFormData(prev => ({ ...prev, email: value }))}
          error={errors.email}
        />
        <TextArea
          label="Message"
          value={formData.message}
          onChange={value => setFormData(prev => ({ ...prev, message: value }))}
          error={errors.message}
        />
        <button type="submit" disabled={!isValid}>Submit</button>
      </form>
    </Debug>
  );
}
```

### Performance Debugging
```tsx
function ExpensiveComponent({ data }) {
  const renderStart = performance.now();

  // Expensive computation
  const processedData = useMemo(() => {
    const start = performance.now();
    const result = data.map(item => ({
      ...item,
      computed: heavyComputation(item)
    }));
    const end = performance.now();

    return {
      result,
      computationTime: end - start
    };
  }, [data]);

  const renderEnd = performance.now();

  return (
    <Debug
      label="Performance Metrics"
      data={{
        dataSize: data.length,
        computationTime: processedData.computationTime,
        totalRenderTime: renderEnd - renderStart,
        memoryUsage: performance.memory
? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
        }
: 'Not available'
      }}
    >
      <div className="expensive-component">
        {processedData.result.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </Debug>
  );
}
```

### Conditional Debugging
```tsx
function ConditionalDebugExample({ user, debugMode }) {
  const shouldDebug = debugMode || user?.role === 'developer';

  if (shouldDebug) {
    return (
      <Debug
        label="Developer Mode"
        production={true} // Force logging even in production for developers
        data={{
          user: {
            id: user.id,
            role: user.role,
            permissions: user.permissions
          },
          debugMode,
          environment: process.env.NODE_ENV,
          buildTime: process.env.REACT_APP_BUILD_TIME
        }}
      >
        <AdminPanel user={user} />
      </Debug>
    );
  }

  return <AdminPanel user={user} />;
}
```

### Error Boundary Integration
```tsx
class DebugErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.group('🚨 Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();
  }

  render() {
    if (this.state.hasError) {
      return (
        <Debug
          label="Error Boundary"
          production={true}
          data={{
            error: this.state.error.message,
            stack: this.state.error.stack,
            timestamp: new Date().toISOString()
          }}
        >
          <ErrorFallback error={this.state.error} />
        </Debug>
      );
    }

    return this.props.children;
  }
}

function SafeComponent() {
  return (
    <DebugErrorBoundary>
      <Debug label="Safe Component">
        <RiskyComponent />
      </Debug>
    </DebugErrorBoundary>
  );
}
```

### Custom Debug Hook
```tsx
// Custom hook for debugging
function useDebug(label: string, data: any, enabled = true) {
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV === 'production')
return;

    console.group(`🔍 Hook Debug: ${label}`);
    console.log('Data:', data);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }, [label, data, enabled]);
}

function HookDebugExample() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Debug custom hook
  useDebug('Counter State', { count, name });

  return (
    <Debug label="Hook Component" data={{ count, name }}>
      <div>
        <p>
Count:
{count}
        </p>
        <button onClick={() => setCount(c => c + 1)}>Increment</button>

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter name"
        />
      </div>
    </Debug>
  );
}
```

## Performance Considerations

### Optimization Strategies
```typescript
// Memoize debug data to prevent unnecessary logging
const DebugMemo = React.memo(Debug);

// Use useMemo for expensive debug data
function OptimizedDebug({ children, ...props }) {
  const debugData = useMemo(() => ({
    timestamp: Date.now(),
    ...props.data
  }), [props.data]);

  return (
    <Debug {...props} data={debugData}>
      {children}
    </Debug>
  );
}

// Conditional rendering for performance
function ConditionalDebug({ children, condition, ...props }) {
  if (!condition && process.env.NODE_ENV === 'production') {
    return <>{children}</>;
  }

  return <Debug {...props}>{children}</Debug>;
}
```

### Memory Management
```typescript
// Be careful with large objects
function MemoryAwareDebug({ largeData, children }) {
  const debugData = useMemo(() => ({
    // Only log essential information from large objects
    size: largeData.length,
    sample: largeData.slice(0, 3), // First 3 items only
    summary: {
      total: largeData.length,
      types: [...new Set(largeData.map(item => typeof item))]
    }
  }), [largeData]);

  return (
    <Debug label="Large Data" data={debugData}>
      {children}
    </Debug>
  );
}
```

## Best Practices

### Do ✅
```typescript
// Use meaningful labels
<Debug label="User Authentication Flow" data={{ userId, isAuthenticated }}>
  <AuthenticatedRoute />
</Debug>

// Include relevant context
<Debug
  label="Payment Processing"
  data={{
    amount,
    currency,
    paymentMethod,
    userId,
    orderId,
    timestamp: Date.now()
  }}
>
  <PaymentForm />
</Debug>

// Use environment checks
const isDebugEnabled = process.env.NODE_ENV === 'development' ||
                      process.env.REACT_APP_DEBUG === 'true';

<Debug production={isDebugEnabled}>
  <Component />
</Debug>

// Structure debug data meaningfully
<Debug
  label="Component State"
  data={{
    state: { count, name },
    props: { initialValue },
    computed: { isValid, hasErrors },
    meta: { renderCount: renderCountRef.current++ }
  }}
>
  <FormComponent />
</Debug>
```

### Don't ❌
```typescript
// Don't log sensitive information
<Debug data={{ password, creditCard, ssn }}> // ❌ Security risk
  <Component />
</Debug>

// Don't leave production debugging enabled without good reason
<Debug production={true} data={sensitiveData}> // ❌ Could expose data
  <Component />
</Debug>

// Don't debug every single component
function App() {
  return (
    <Debug label="App">
      <Debug label="Header">
        <Debug label="Nav">
          <Debug label="MenuItem"> // ❌ Too much debugging
            <MenuItem />
          </Debug>
        </Debug>
      </Debug>
    </Debug>
  );
}

// Don't log massive objects without filtering
<Debug data={{
  hugeDatabaseDump: allRecords // ❌ Could crash browser
}}>
  <Component />
</Debug>
```

## Migration Guide

### From Console.log Statements
```typescript
// Before: Manual console logging
function Component({ data }) {
  console.log('Component data:', data);

  return <div>{data.name}</div>;
}

// After: Debug component
function Component({ data }) {
  return (
    <Debug label="Component" data={{ data }}>
      <div>{data.name}</div>
    </Debug>
  );
}
```

### From Custom Debug Components
```typescript
// Before: Custom debug wrapper
function MyDebugWrapper({ children, info }) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Debug:', info);
  }
  return children;
}

// After: Standard Debug component
<Debug label="My Component" data={info}>
  {children}
</Debug>
```

## Related Components
- [`if`](../if/README.md) - For conditional debugging based on conditions
- [`when`](../when/README.md) - For complex conditional debugging logic
- [`gate`](../gate/README.md) - For feature flag-based debugging

## Development Tips

### Browser Console Integration
```typescript
// Set up global debug helpers
window.debugComponent = (label: string, data: any) => {
  console.group(`🔧 Manual Debug: ${label}`);
  console.log(data);
  console.groupEnd();
};

// Use in components
function Component() {
  const handleDebug = () => {
    window.debugComponent('Manual Debug', { state, props });
  };

  return (
    <Debug label="Component">
      <button onClick={handleDebug}>Manual Debug</button>
    </Debug>
  );
}
```

### Integration with DevTools
```typescript
// React DevTools integration
function DevToolsDebug({ children, label, data }) {
  // This will show up in React DevTools profiler
  React.Profiler.onRender?.(label, 'mount', 0, 0, 0, 0);

  return (
    <Debug label={label} data={data}>
      {children}
    </Debug>
  );
}
```

The `Debug` component is an essential development tool that helps maintain code quality and accelerates debugging workflows while maintaining production safety.
