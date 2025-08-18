# Lazy Component

A powerful utility for lazy loading components, content, and resources in React applications, designed to improve performance and reduce initial bundle size through intelligent code splitting.

## Description

The `Lazy` component provides a declarative approach to lazy loading in React applications. It defers the loading and rendering of components or content until they are actually needed, such as when they enter the viewport, on user interaction, or based on custom triggers. This component is essential for performance optimization, especially in large applications where not all components need to be loaded immediately.

## When to Use

- **Code Splitting**: Breaking large bundles into smaller chunks that load on demand
- **Route-based Splitting**: Loading page components only when navigating to specific routes
- **Viewport-based Loading**: Loading content when it becomes visible (intersection-based lazy loading)
- **Feature Flags**: Conditionally loading features based on user permissions or environment
- **Heavy Components**: Deferring expensive components like charts, editors, or complex visualizations
- **Third-party Libraries**: Loading large external libraries only when needed
- **Progressive Enhancement**: Adding advanced functionality progressively

## How It Works

The `Lazy` component uses dynamic imports and React's built-in lazy loading capabilities to:

1. **Dynamic Import**: Loads components using ES6 dynamic imports
2. **Suspense Integration**: Works seamlessly with React Suspense for fallback UI
3. **Error Boundaries**: Provides error handling for failed loads
4. **Intersection Observer**: Optional viewport-based loading
5. **Preloading**: Smart preloading strategies for better UX

## Patterns Used

- **Lazy Loading Pattern**: Defers resource loading until needed
- **Code Splitting Pattern**: Breaks bundles into smaller, loadable chunks
- **Intersection Observer Pattern**: Loads content when entering viewport
- **Render Props Pattern**: Exposes loading state and control methods
- **Error Boundary Pattern**: Graceful handling of loading failures
- **Preloading Pattern**: Strategic resource preloading for performance

## TypeScript Types

```typescript
/**
 * Props for the Lazy component
 * @template T - Type of the lazy-loaded component props
 */
interface LazyProps<T = any> {
  /** Dynamic import function that returns a component */
  loader: () => Promise<{ default: React.ComponentType<T> }>;
  /** Fallback content while loading */
  fallback?: React.ReactNode;
  /** Props to pass to the loaded component */
  componentProps?: T;
  /** Load when component enters viewport */
  intersectionBased?: boolean;
  /** Intersection observer options */
  intersectionOptions?: IntersectionObserverInit;
  /** Preload the component */
  preload?: boolean;
  /** Error fallback component */
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  /** Retry attempts on failure */
  retryAttempts?: number;
  /** Delay before loading (ms) */
  delay?: number;
  /** Callback when component loads successfully */
  onLoad?: (component: React.ComponentType<T>) => void;
  /** Callback when loading fails */
  onError?: (error: Error) => void;
}

/**
 * Options for creating lazy components
 */
interface LazyOptions {
  /** Custom loading component */
  loading?: React.ComponentType;
  /** Custom error component */
  error?: React.ComponentType<{ error: Error; retry: () => void }>;
  /** Preload strategy */
  preloadStrategy?: 'hover' | 'visible' | 'immediate' | 'idle';
  /** Cache loaded components */
  cache?: boolean;
}

/**
 * Lazy component factory
 */
interface LazyFactory {
  <T = any>(
    loader: () => Promise<{ default: React.ComponentType<T> }>,
    options?: LazyOptions
  ): React.ComponentType<T>;
}
```

## API Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `loader` | `() => Promise<{ default: ComponentType }>` | ✅ | - | Dynamic import function |
| `fallback` | `ReactNode` | | `<div>Loading...</div>` | Loading fallback UI |
| `componentProps` | `T` | | `{}` | Props for loaded component |
| `intersectionBased` | `boolean` | | `false` | Load when entering viewport |
| `intersectionOptions` | `IntersectionObserverInit` | | `{}` | Intersection observer config |
| `preload` | `boolean` | | `false` | Preload component immediately |
| `errorFallback` | `ComponentType<{error, retry}>` | | Built-in error | Custom error component |
| `retryAttempts` | `number` | | `3` | Number of retry attempts |
| `delay` | `number` | | `0` | Delay before loading (ms) |
| `onLoad` | `(component) => void` | | - | Success callback |
| `onError` | `(error) => void` | | - | Error callback |

## Examples

### Basic Code Splitting
```tsx
import { Lazy } from 'ui-magic-core';

// Basic lazy loading
function App() {
  return (
    <div>
      <h1>My App</h1>
      <Lazy
        loader={() => import('./components/Dashboard')}
        fallback={<div>Loading dashboard...</div>}
      />
    </div>
  );
}
```

### Route-based Code Splitting
```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Lazy } from 'ui-magic-core';

// Lazy load route components
function LazyHome() {
  return (
<Lazy
  loader={() => import('./pages/HomePage')}
  fallback={<PageSkeleton />}
/>
);
}

function LazyDashboard() {
  return (
<Lazy
  loader={() => import('./pages/DashboardPage')}
  fallback={<PageSkeleton />}
  preload // Preload for better UX
/>
);
}

function LazyAdmin() {
  return (
<Lazy
  loader={() => import('./pages/AdminPage')}
  fallback={<PageSkeleton />}
  errorFallback={({ error, retry }) => (
      <div>
        <h3>Failed to load admin panel</h3>
        <p>{error.message}</p>
        <button onClick={retry}>Retry</button>
      </div>
    )}
/>
);
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LazyHome />} />
        <Route path="/dashboard" element={<LazyDashboard />} />
        <Route path="/admin" element={<LazyAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Viewport-based Lazy Loading
```tsx
function BlogPost({ content }) {
  return (
    <article>
      <h1>{content.title}</h1>
      <p>{content.excerpt}</p>

      {/* Load heavy comment component only when scrolled into view */}
      <Lazy
        loader={() => import('./CommentsSection')}
        componentProps={{ postId: content.id }}
        intersectionBased
        intersectionOptions={{
          threshold: 0.1,
          rootMargin: '100px 0px' // Load 100px before entering viewport
        }}
        fallback={(
          <div className="comments-placeholder">
            <div className="skeleton" />
            <p>Comments loading...</p>
          </div>
        )}
      />
    </article>
  );
}
```

### Feature Flag Based Loading
```tsx
function ProductPage({ productId, user }) {
  return (
    <div>
      <ProductInfo productId={productId} />

      {/* Load advanced features only for premium users */}
      {user.isPremium && (
        <Lazy
          loader={() => import('./PremiumFeatures')}
          componentProps={{ productId, user }}
          fallback={<FeatureSkeleton />}
          onLoad={() => analytics.track('premium_features_loaded')}
        />
      )}

      {/* Load analytics dashboard for admin users */}
      {user.isAdmin && (
        <Lazy
          loader={() => import('./AnalyticsDashboard')}
          intersectionBased
          fallback={<div>Loading analytics...</div>}
        />
      )}
    </div>
  );
}
```

### Heavy Third-party Library Loading
```tsx
function DataVisualization({ data }) {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <h2>Data Analysis</h2>
      <div className="data-summary">
        {/* Show summary without heavy chart library */}
        <DataSummary data={data} />
      </div>

      <button onClick={() => setShowChart(true)}>
        Show Interactive Chart
      </button>

      {showChart && (
        <Lazy
          loader={() => import('./ChartComponent')} // Loads Chart.js/D3/etc
          componentProps={{ data }}
          fallback={(
            <div className="chart-loading">
              <div className="spinner" />
              <p>Loading chart library...</p>
            </div>
          )}
          onLoad={() => console.log('Chart library loaded')}
          retryAttempts={2}
        />
      )}
    </div>
  );
}
```

### Advanced Modal Loading
```tsx
function UserProfile({ userId }) {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div>
      <UserInfo userId={userId} />

      <button onClick={() => setShowEditModal(true)}>
        Edit Profile
      </button>

      {showEditModal && (
        <Lazy
          loader={() => import('./EditProfileModal')}
          componentProps={{
            userId,
            isOpen: showEditModal,
            onClose: () => setShowEditModal(false)
          }}
          fallback={(
            <div className="modal-backdrop">
              <div className="modal-loading">
                Loading editor...
              </div>
            </div>
          )}
          delay={100} // Small delay to prevent flash
        />
      )}
    </div>
  );
}
```

### Progressive Image Gallery
```tsx
function ImageGallery({ images }) {
  return (
    <div className="gallery">
      {images.map((image, index) => (
        <Lazy
          key={image.id}
          loader={() => import('./HighResImage')}
          componentProps={{ src: image.highRes, alt: image.alt }}
          intersectionBased
          intersectionOptions={{ threshold: 0.1 }}
          fallback={(
            <img
              src={image.thumbnail}
              alt={image.alt}
              className="thumbnail"
            />
          )}
          delay={index * 50} // Stagger loading
        />
      ))}
    </div>
  );
}
```

### Smart Preloading Strategy
```tsx
function NavigationMenu({ currentPage }) {
  const [hoveredLink, setHoveredLink] = useState(null);

  // Preload on hover for better UX
  const preloadPage = (pageId) => {
    if (pageId !== currentPage) {
      // Trigger preload
      import(`./pages/${pageId}Page`);
    }
  };

  return (
    <nav>
      <Link
        to="/dashboard"
        onMouseEnter={() => preloadPage('Dashboard')}
      >
        Dashboard
      </Link>
      <Link
        to="/analytics"
        onMouseEnter={() => preloadPage('Analytics')}
      >
        Analytics
      </Link>
      <Link
        to="/settings"
        onMouseEnter={() => preloadPage('Settings')}
      >
        Settings
      </Link>
    </nav>
  );
}
```

## Performance Considerations

- **Bundle Analysis**: Use webpack-bundle-analyzer to identify splitting opportunities
- **Preloading Strategy**: Balance between performance and resource usage
- **Network Conditions**: Consider slow connections when setting delays and fallbacks
- **Cache Strategy**: Implement proper caching for loaded components
- **Error Recovery**: Provide meaningful error states and retry mechanisms

```tsx
// Performance optimized lazy loading
function OptimizedLazy({ loader, ...props }) {
  const memoizedLoader = useCallback(loader, []);

  return (
    <Lazy
      loader={memoizedLoader}
      intersectionOptions={{ threshold: 0.1 }}
      preload={false}
      {...props}
    />
  );
}
```

## Best Practices

1. **Strategic Splitting**: Split at route boundaries and feature boundaries
2. **Meaningful Fallbacks**: Provide skeleton UI that matches final content
3. **Error Handling**: Always provide error boundaries and retry mechanisms
4. **Preloading**: Use hover/focus states to preload likely-needed content
5. **Progressive Enhancement**: Start with basic functionality, enhance progressively
6. **Performance Monitoring**: Track loading times and success rates

## Migration Guide

### From React.lazy

**Before:**
```tsx
const LazyComponent = React.lazy(() => import('./Component'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

**After:**
```tsx
function App() {
  return (
    <Lazy
      loader={() => import('./Component')}
      fallback={<div>Loading...</div>}
    />
  );
}
```

### From Dynamic Imports

**Before:**
```tsx
function Component() {
  const [Module, setModule] = useState(null);

  useEffect(() => {
    import('./HeavyModule').then(setModule);
  }, []);

  if (!Module)
return <div>Loading...</div>;
  return <Module.default />;
}
```

**After:**
```tsx
function Component() {
  return (
    <Lazy
      loader={() => import('./HeavyModule')}
      fallback={<div>Loading...</div>}
    />
  );
}
```

## Related Components

- [`Async`](../async/README.md) - For async state management
- [`Show`](../show/README.md) - For conditional rendering
- [`Maybe`](../maybe/README.md) - For null-safe rendering
- [`Gate`](../gate/README.md) - For permission-based loading
- [`Memo`](../memo/README.md) - For performance optimization
