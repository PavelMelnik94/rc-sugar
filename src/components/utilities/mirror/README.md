# Mirror Component

A powerful utility for cloning and enhancing React elements with new props, enabling dynamic component modification and prop injection.

## Description

The `Mirror` component provides a clean, declarative way to clone existing React elements while adding, modifying, or overriding their props. It leverages React's `cloneElement` API to create enhanced versions of components without directly modifying the original elements. Perfect for component composition, prop injection, dynamic styling, and creating flexible, reusable component patterns.

## When to Use

### Perfect For
- **Prop Injection**: Adding new props to existing elements
- **Dynamic Styling**: Conditionally applying styles or classes
- **Event Handler Enhancement**: Adding or modifying event handlers
- **Component Decoration**: Enhancing components with additional functionality
- **Conditional Props**: Applying props based on runtime conditions
- **Legacy Component Wrapping**: Modernizing older components
- **Theme Application**: Applying theme-related props dynamically
- **A11y Enhancement**: Adding accessibility props to existing elements

### Avoid When
- Creating new components from scratch (use direct JSX)
- Simple prop passing (use standard React patterns)
- Deep component tree modifications (performance concerns)
- Complex state management (use dedicated state solutions)

## Patterns Used
- **Element Cloning Pattern**: Uses React.cloneElement for safe element duplication
- **Prop Injection Pattern**: Dynamically adds or modifies props
- **Composition Pattern**: Enables flexible component composition
- **Enhancement Pattern**: Augments existing components with new capabilities

## TypeScript Interface

```typescript
/**
 * Props for the Mirror component
 */
interface MirrorProps extends Record<string, any> {
  /**
   * The React element to clone and enhance
   */
  element: ReactElement;

  // All other props are passed to the cloned element
}
```

## API Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `element` | `ReactElement` | ✅ | The React element to clone |
| `...props` | `any` | ❌ | Any additional props to merge with the cloned element |

## Examples

### Basic Prop Injection
```tsx
import { Mirror } from 'ui-magic-core';

function EnhancedButton() {
  const originalButton = <button className="base-btn">Click me</button>;

  return (
    <Mirror
      element={originalButton}
      className="base-btn enhanced"
      onClick={() => console.log('Enhanced click!')}
      disabled={false}
    />
  );
}

// Result: <button className="base-btn enhanced" onClick={...} disabled={false}>Click me</button>
```

### Dynamic Styling
```tsx
interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

function StyledButton({ variant, size, children }: StyledButtonProps) {
  const baseButton = <button className="btn">{children}</button>;

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  };

  const sizeClasses = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg'
  };

  return (
    <Mirror
      element={baseButton}
      className={`btn ${variantClasses[variant]} ${sizeClasses[size]}`}
    />
  );
}

// Usage
<StyledButton variant="primary" size="large">
  Submit
</StyledButton>;
```

### Event Handler Enhancement
```tsx
function AnalyticsButton({ originalButton, trackingId, category }) {
  const enhancedClick = originalHandler => (event) => {
    // Track analytics first
    analytics.track('Button Click', {
      trackingId,
      category,
      timestamp: Date.now()
    });

    // Then call original handler if it exists
    if (originalHandler) {
      originalHandler(event);
    }
  };

  return (
    <Mirror
      element={originalButton}
      onClick={enhancedClick(originalButton.props.onClick)}
      data-tracking-id={trackingId}
      data-category={category}
    />
  );
}

// Usage
const myButton = <button onClick={() => handleSubmit()}>Submit</button>;

<AnalyticsButton
  originalButton={myButton}
  trackingId="submit-btn-001"
  category="forms"
/>;
```

### Conditional Prop Application
```tsx
function ConditionalMirror({ element, condition, conditionalProps, ...alwaysProps }) {
  const finalProps = condition ? { ...alwaysProps, ...conditionalProps } : alwaysProps;

  return <Mirror element={element} {...finalProps} />;
}

// Usage
function ResponsiveImage({ src, alt, isMobile }) {
  const baseImage = <img src={src} alt={alt} />;

  return (
    <ConditionalMirror
      element={baseImage}
      condition={isMobile}
      className="responsive-image"
      conditionalProps={{
        loading: 'lazy',
        sizes: '(max-width: 768px) 100vw, 50vw'
      }}
      style={{ maxWidth: '100%' }}
    />
  );
}
```

### Accessibility Enhancement
```tsx
function AccessibilityEnhancer({ element, ariaLabel, ariaDescribedBy, role }) {
  const a11yProps = {};

  if (ariaLabel)
a11yProps['aria-label'] = ariaLabel;
  if (ariaDescribedBy)
a11yProps['aria-describedby'] = ariaDescribedBy;
  if (role)
a11yProps.role = role;

  return <Mirror element={element} {...a11yProps} />;
}

// Usage
function AccessibleCard({ children }) {
  const cardElement = (
    <div className="card">
      {children}
    </div>
  );

  return (
    <AccessibilityEnhancer
      element={cardElement}
      role="article"
      ariaLabel="Product information card"
      ariaDescribedBy="card-description"
    />
  );
}
```

### Theme Application
```tsx
function ThemedElement({ element, theme }) {
  const themeProps = {
    'data-theme': theme.name,
    'style': {
      ...element.props.style,
      '--primary-color': theme.primaryColor,
      '--secondary-color': theme.secondaryColor,
      '--font-family': theme.fontFamily
    },
    'className': `${element.props.className || ''} theme-${theme.name}`
  };

  return <Mirror element={element} {...themeProps} />;
}

// Usage
const darkTheme = {
  name: 'dark',
  primaryColor: '#ffffff',
  secondaryColor: '#cccccc',
  fontFamily: 'Inter, sans-serif'
};

function ThemedApp({ children }) {
  const appElement = <div className="app">{children}</div>;

  return <ThemedElement element={appElement} theme={darkTheme} />;
}
```

### Form Field Enhancement
```tsx
function FormFieldEnhancer({ element, validation, required, helpText }) {
  const validationProps = {};

  if (validation?.error) {
    validationProps['aria-invalid'] = true;
    validationProps['aria-describedby'] = `${element.props.id}-error`;
  }

  if (required) {
    validationProps.required = true;
    validationProps['aria-required'] = true;
  }

  if (helpText) {
    validationProps['aria-describedby'] = `${element.props.id}-help`;
  }

  return (
    <div className="form-field">
      <Mirror element={element} {...validationProps} />

      {helpText && (
        <div id={`${element.props.id}-help`} className="help-text">
          {helpText}
        </div>
      )}

      {validation?.error && (
        <div id={`${element.props.id}-error`} className="error-text" role="alert">
          {validation.error}
        </div>
      )}
    </div>
  );
}

// Usage
function LoginForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const emailInput = (
    <input
      id="email"
      type="email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      placeholder="Enter your email"
    />
  );

  return (
    <form>
      <FormFieldEnhancer
        element={emailInput}
        required
        validation={{ error: emailError }}
        helpText="We'll never share your email address"
      />
    </form>
  );
}
```

### Component Library Wrapper
```tsx
// Wrapping third-party components
function LibraryButtonAdapter({ children, variant, ...props }) {
  // Third-party button component
  const thirdPartyButton = <ThirdPartyButton type="button">{children}</ThirdPartyButton>;

  // Map our API to third-party API
  const mappedProps = {
    ...props,
    variant: variant === 'primary' ? 'contained' : 'outlined',
    color: variant === 'danger' ? 'error' : 'primary'
  };

  return <Mirror element={thirdPartyButton} {...mappedProps} />;
}

// Usage - now third-party component follows our API
<LibraryButtonAdapter variant="primary" onClick={handleClick}>
  Our Button
</LibraryButtonAdapter>;
```

### Responsive Component Enhancement
```tsx
function ResponsiveEnhancer({ element, breakpoints }) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768)
setCurrentBreakpoint('mobile');
      else if (width < 1024)
setCurrentBreakpoint('tablet');
      else setCurrentBreakpoint('desktop');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const responsiveProps = breakpoints[currentBreakpoint] || {};

  return (
    <Mirror
      element={element}
      {...responsiveProps}
      data-breakpoint={currentBreakpoint}
    />
  );
}

// Usage
function ResponsiveImage({ src, alt }) {
  const baseImage = <img src={src} alt={alt} />;

  const breakpoints = {
    mobile: {
      style: { width: '100%', height: 'auto' },
      loading: 'lazy'
    },
    tablet: {
      style: { width: '50%', height: 'auto' },
      loading: 'lazy'
    },
    desktop: {
      style: { width: '25%', height: 'auto' },
      loading: 'eager'
    }
  };

  return (
    <ResponsiveEnhancer element={baseImage} breakpoints={breakpoints} />
  );
}
```

### Error Boundary Integration
```tsx
function ErrorBoundaryElement({ element, fallback, onError }) {
  const [hasError, setHasError] = useState(false);

  const errorBoundaryProps = {
    onError: (error, errorInfo) => {
      setHasError(true);
      onError?.(error, errorInfo);
      console.error('Element error:', error);
    }
  };

  if (hasError) {
    return fallback || <div>Something went wrong</div>;
  }

  try {
    return <Mirror element={element} {...errorBoundaryProps} />;
  }
 catch (error) {
    setHasError(true);
    return fallback || <div>Something went wrong</div>;
  }
}

// Usage
function SafeComponent() {
  const riskyElement = <RiskyComponent data={complexData} />;

  return (
    <ErrorBoundaryElement
      element={riskyElement}
      fallback={<div>Component failed to load</div>}
      onError={error => reportError(error)}
    />
  );
}
```

## Performance Considerations

### Optimization Strategies
```typescript
// Memoize mirrored components to prevent unnecessary re-renders
const MemoizedMirror = React.memo(Mirror);

// Use useMemo for expensive prop calculations
function OptimizedMirror({ element, computeProps, dependencies }) {
  const computedProps = useMemo(() => computeProps(), dependencies);

  return <Mirror element={element} {...computedProps} />;
}

// Avoid creating new elements in render
function EfficientMirror({ children, ...props }) {
  // Good: element is created once
  const baseElement = useMemo(() => (
    <div className="base">{children}</div>
  ), [children]);

  return <Mirror element={baseElement} {...props} />;
}
```

### Memory Management
```typescript
// Clean up event listeners and refs
function ManagedMirror({ element, onMount, onUnmount }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current && onMount) {
      onMount(ref.current);
    }

    return () => {
      if (ref.current && onUnmount) {
        onUnmount(ref.current);
      }
    };
  }, [onMount, onUnmount]);

  return <Mirror element={element} ref={ref} />;
}
```

## Best Practices

### Do ✅
```typescript
// Use meaningful prop names
<Mirror
  element={button}
  variant="primary"
  size="large"
  isLoading={loading}
/>

// Provide fallbacks for missing elements
function SafeMirror({ element, ...props }) {
  if (!element) {
    console.warn('Mirror: No element provided');
    return null;
  }

  return <Mirror element={element} {...props} />;
}

// Preserve original element structure
const originalElement = <Button primary>Original</Button>;
<Mirror element={originalElement} disabled={isDisabled} />

// Use TypeScript for type safety
interface MirrorButtonProps {
  element: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>;
  variant?: 'primary' | 'secondary';
}

function MirrorButton({ element, variant, ...props }: MirrorButtonProps) {
  return <Mirror element={element} data-variant={variant} {...props} />;
}
```

### Don't ❌
```typescript
// Don't pass invalid elements
<Mirror element="not an element" /> // ❌ Will log warning and return null

// Don't mutate the original element
function BadMirror({ element }) {
  element.props.className = 'modified'; // ❌ Mutates original
  return <Mirror element={element} />;
}

// Don't create elements inside render without memoization
function BadPractice({ data }) {
  return (
    <Mirror
      element={<ExpensiveComponent data={data} />} // ❌ Creates new element every render
      additionalProp="value"
    />
  );
}

// Don't ignore TypeScript warnings
<Mirror element={42} /> // ❌ TypeScript will warn about invalid element
```

## Migration Guide

### From Manual cloneElement
```typescript
// Before: Manual cloneElement usage
function EnhancedComponent({ originalElement, newProps }) {
  return React.cloneElement(originalElement, {
    ...originalElement.props,
    ...newProps
  });
}

// After: Mirror component
function EnhancedComponent({ originalElement, newProps }) {
  return <Mirror element={originalElement} {...newProps} />;
}
```

### From Wrapper Components
```typescript
// Before: Wrapper component pattern
function ButtonWrapper({ children, additionalProps }) {
  return (
    <button {...additionalProps}>
      {children}
    </button>
  );
}

// After: Element enhancement with Mirror
function ButtonEnhancer({ originalButton, ...additionalProps }) {
  return <Mirror element={originalButton} {...additionalProps} />;
}
```

## Related Components
- [`compose`](../compose/README.md) - For composing multiple components
- [`if`](../if/README.md) - For conditional element rendering
- [`when`](../when/README.md) - For complex conditional logic

## Accessibility

The `Mirror` component preserves and can enhance accessibility properties:

```typescript
// Preserve existing accessibility props
const accessibleButton = (
  <button
    aria-label="Close dialog"
    aria-expanded={isOpen}
    role="button"
  >
    Close
  </button>
);

// Mirror preserves all accessibility props
<Mirror element={accessibleButton} className="enhanced-close-btn" />

// Add accessibility enhancements
<Mirror
  element={accessibleButton}
  aria-describedby="close-help-text"
  aria-keyshortcuts="Escape"
/>
```

The `Mirror` component is a powerful tool for component composition and enhancement, enabling flexible and maintainable React applications.
