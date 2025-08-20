# Resource Component

A powerful async resource management component for React applications that handles loading states, error handling, and data fetching with cancellation support. Perfect for Feature-Sliced Design (FSD) architecture.

## Description

The Resource component provides a declarative way to handle async operations in React applications. It manages loading states, error handling, request cancellation, and provides a clean render props interface for displaying different UI states based on the async operation status.

## When to Use

- 🔄 **Async Data Loading**: Loading data from APIs, databases, or any async source
- 📊 **Entity Management**: Managing entities in FSD architecture (users, products, orders)
- 🎯 **Feature Data**: Loading feature-specific data in features layer
- 🧩 **Widget Data**: Managing widget-level async operations
- 🔍 **Search & Filtering**: Handling search results and filtered data
- 📄 **Page Data**: Loading page-level resources
- 🔄 **Data Refreshing**: Providing refetch capabilities with loading states
- 🚫 **Request Cancellation**: Automatic cleanup of pending requests

## Used Patterns

- **Render Props Pattern**: Flexible rendering based on resource state
- **Request Cancellation**: Automatic cancellation of stale requests
- **Effect-Free Design**: Minimal side effects with proper cleanup
- **Compound Components**: Additional helper components for common patterns
- **TypeScript Safety**: Full type safety with generic resource types
- **Dependency Tracking**: Automatic reloading when dependencies change
- **Resource Management**: Proper cleanup and memory management

## TypeScript Types

```typescript
interface ResourceState<T, E = Error> {
  data: T | null
  error: E | null
  loading: boolean
  refetch: () => Promise<void>
}

interface ResourceProps<T, E = Error> {
  loader: () => Promise<T>
  initialData?: T
  immediate?: boolean
  deps?: unknown[]
  onError?: (error: E) => void
  onSuccess?: (data: T) => void
  children: RenderProp<ResourceState<T, E>>
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loader` | `() => Promise<T>` | required | Function that returns a Promise to load the resource |
| `initialData` | `T` | `null` | Initial data to display before loading |
| `immediate` | `boolean` | `true` | Whether to load immediately on mount |
| `deps` | `unknown[]` | `[]` | Dependencies that trigger a reload when changed |
| `onError` | `(error: E) => void` | - | Callback when an error occurs |
| `onSuccess` | `(data: T) => void` | - | Callback when data loads successfully |
| `children` | `RenderProp<ResourceState<T, E>>` | required | Render function receiving resource state |

### Resource State

The children render function receives a `ResourceState` object with:

- `data`: The loaded data or null
- `error`: Any error that occurred or null
- `loading`: Boolean indicating if a request is in progress
- `refetch`: Function to manually reload the resource

## Examples

### Basic Usage

```tsx
interface User {
  id: number
  name: string
  email: string
}

function UserProfile({ userId }: { userId: number }) {
  return (
    <Resource<User> loader={() => fetchUser(userId)}>
      {({ data, loading, error, refetch }) => {
        if (loading && !data) return <UserSkeleton />
        if (error) return <ErrorMessage error={error} onRetry={refetch} />
        if (data) return <UserCard user={data} />
        return null
      }}
    </Resource>
  )
}
```

### With Dependencies

```tsx
function UserPosts({ userId, category }: { userId: number; category: string }) {
  return (
    <Resource<Post[]> 
      loader={() => fetchUserPosts(userId, category)}
      deps={[userId, category]}
    >
      {({ data, loading, error, refetch }) => (
        <div>
          {loading && <div className="spinner">Loading posts...</div>}
          {error && <ErrorBanner error={error} onRetry={refetch} />}
          {data && <PostList posts={data} />}
        </div>
      )}
    </Resource>
  )
}
```

### With Initial Data

```tsx
function ProductDetails({ productId, cachedProduct }: Props) {
  return (
    <Resource<Product>
      loader={() => fetchProduct(productId)}
      initialData={cachedProduct}
      deps={[productId]}
    >
      {({ data, loading, error, refetch }) => (
        <div>
          {data && <ProductCard product={data} />}
          {loading && <div className="refresh-indicator">Updating...</div>}
          {error && <div className="error">Failed to update</div>}
        </div>
      )}
    </Resource>
  )
}
```

### Manual Loading

```tsx
function SearchResults() {
  const [query, setQuery] = useState('')
  
  return (
    <div>
      <SearchInput 
        value={query} 
        onChange={setQuery}
      />
      
      <Resource<SearchResult[]>
        loader={() => searchAPI(query)}
        immediate={false}
        deps={[query]}
      >
        {({ data, loading, error, refetch }) => (
          <div>
            <button onClick={refetch} disabled={loading || !query}>
              {loading ? 'Searching...' : 'Search'}
            </button>
            
            {error && <ErrorMessage error={error} />}
            {data && <SearchResultList results={data} />}
          </div>
        )}
      </Resource>
    </div>
  )
}
```

### FSD Architecture Integration

```tsx
// entities/user/api/userApi.ts
export const fetchUser = (id: number): Promise<User> => {
  return api.get(`/users/${id}`)
}

// features/user-profile/ui/UserProfile.tsx
export function UserProfile({ userId }: UserProfileProps) {
  return (
    <Resource<User>
      loader={() => fetchUser(userId)}
      deps={[userId]}
      onError={(error) => {
        analytics.track('user_profile_load_error', { userId, error: error.message })
      }}
    >
      {({ data, loading, error, refetch }) => {
        if (loading && !data) return <UserProfileSkeleton />
        if (error) return <UserProfileError error={error} onRetry={refetch} />
        if (data) return <UserProfileCard user={data} onRefresh={refetch} />
        return null
      }}
    </Resource>
  )
}

// widgets/user-dashboard/ui/UserDashboard.tsx
export function UserDashboard() {
  return (
    <div className="dashboard">
      <Resource<DashboardData>
        loader={() => fetchDashboardData()}
        onSuccess={(data) => {
          analytics.track('dashboard_loaded', { itemCount: data.items.length })
        }}
      >
        {({ data, loading, error, refetch }) => (
          <DashboardLayout>
            {loading && <DashboardSkeleton />}
            {error && <DashboardError error={error} onRetry={refetch} />}
            {data && <DashboardContent data={data} onRefresh={refetch} />}
          </DashboardLayout>
        )}
      </Resource>
    </div>
  )
}
```

### Error Handling Patterns

```tsx
function RobustResourceLoader() {
  return (
    <Resource<ApiData>
      loader={async () => {
        const response = await fetch('/api/data')
        if (!response.ok) {
          throw new ApiError(response.status, response.statusText)
        }
        return response.json()
      }}
      onError={(error) => {
        if (error instanceof ApiError) {
          // Handle API errors
          logger.error('API Error:', error.status, error.message)
        } else {
          // Handle network errors
          logger.error('Network Error:', error.message)
        }
      }}
    >
      {({ data, loading, error, refetch }) => {
        if (loading) return <LoadingSpinner />
        
        if (error) {
          if (error instanceof ApiError && error.status === 404) {
            return <NotFoundMessage />
          }
          return <GenericError error={error} onRetry={refetch} />
        }
        
        return data ? <DataView data={data} /> : <EmptyState />
      }}
    </Resource>
  )
}
```

## Performance Considerations

### Request Cancellation
- Automatically cancels previous requests when dependencies change
- Prevents memory leaks and race conditions
- No additional configuration required

### Memory Management
- Cleans up resources on component unmount
- Prevents state updates on unmounted components
- AbortController automatically handles cleanup

### Optimization Tips

```tsx
// Memoize expensive loaders
const memoizedLoader = useCallback(() => {
  return expensiveDataFetch(complexParams)
}, [complexParams])

<Resource loader={memoizedLoader}>
  {/* ... */}
</Resource>

// Use stable dependency arrays
const stableDeps = useMemo(() => [userId, filters], [userId, filters])

<Resource 
  loader={() => fetchData(userId, filters)}
  deps={stableDeps}
>
  {/* ... */}
</Resource>
```

## Best Practices

### Do ✅

```tsx
// Use TypeScript generics for type safety
<Resource<User[]> loader={() => fetchUsers()}>
  {({ data }) => data && <UserList users={data} />}
</Resource>

// Handle all resource states
<Resource loader={loader}>
  {({ data, loading, error, refetch }) => {
    if (loading && !data) return <Skeleton />
    if (error) return <Error error={error} onRetry={refetch} />
    if (data) return <Content data={data} />
    return <EmptyState />
  }}
</Resource>

// Provide meaningful error handling
<Resource 
  loader={loader}
  onError={(error) => {
    analytics.track('resource_error', { error: error.message })
    toast.error('Failed to load data')
  }}
>
  {/* ... */}
</Resource>
```

### Don't ❌

```tsx
// Don't ignore error states
<Resource loader={loader}>
  {({ data, loading }) => {
    if (loading) return <Spinner />
    return <Content data={data} /> // What if there's an error?
  }}
</Resource>

// Don't create loaders inside render
<Resource loader={() => fetch('/api/data')}> // Creates new function every render
  {/* ... */}
</Resource>

// Don't forget to handle empty states
<Resource loader={loader}>
  {({ data, loading, error }) => {
    if (loading) return <Spinner />
    if (error) return <Error />
    return <Content data={data} /> // What if data is null/empty?
  }}
</Resource>
```

## Migration Guide

### From useEffect + useState

```tsx
// Before: Manual state management
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    
    fetchUser(userId)
      .then(data => {
        if (!cancelled) {
          setUser(data)
          setError(null)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [userId])

  if (loading) return <Spinner />
  if (error) return <Error />
  return user ? <UserCard user={user} /> : null
}

// After: Declarative resource management
function UserProfile({ userId }) {
  return (
    <Resource<User>
      loader={() => fetchUser(userId)}
      deps={[userId]}
    >
      {({ data, loading, error, refetch }) => {
        if (loading) return <Spinner />
        if (error) return <Error error={error} onRetry={refetch} />
        return data ? <UserCard user={data} /> : null
      }}
    </Resource>
  )
}
```

### From Custom Hooks

```tsx
// Before: Custom hook
function useUser(userId) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  
  useEffect(() => {
    fetchUser(userId)
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({ data: null, loading: false, error }))
  }, [userId])
  
  return state
}

// After: Resource component
function UserProfile({ userId }) {
  return (
    <Resource<User>
      loader={() => fetchUser(userId)}
      deps={[userId]}
    >
      {({ data, loading, error }) => {
        // Same render logic
      }}
    </Resource>
  )
}
```

## Related Components

- [`cache`](../cache/README.md) - For caching resource data
- [`lazy`](../../performance/lazy/README.md) - For lazy loading components with data
- [`compose`](../compose/README.md) - For composing resource providers
- [`debug`](../debug/README.md) - For debugging resource states

## Accessibility

The Resource component is accessibility-neutral as it doesn't render UI elements directly. However, ensure that your resource states provide proper accessibility:

### Loading States
```tsx
<Resource loader={loader}>
  {({ loading, data, error }) => {
    if (loading) {
      return (
        <div 
          role="status" 
          aria-live="polite"
          aria-label="Loading content"
        >
          <Spinner />
          <span className="sr-only">Loading...</span>
        </div>
      )
    }
    // ... other states
  }}
</Resource>
```

### Error States
```tsx
<Resource loader={loader}>
  {({ error, refetch }) => {
    if (error) {
      return (
        <div role="alert" aria-live="assertive">
          <p>Failed to load content: {error.message}</p>
          <button onClick={refetch}>Try Again</button>
        </div>
      )
    }
    // ... other states
  }}
</Resource>
```

## Integration with Analytics

```tsx
function AnalyticsResource<T>({ resourceName, ...props }: Props & { resourceName: string }) {
  return (
    <Resource<T>
      {...props}
      onSuccess={(data) => {
        analytics.track('resource_loaded', {
          resource: resourceName,
          size: Array.isArray(data) ? data.length : 1
        })
        props.onSuccess?.(data)
      }}
      onError={(error) => {
        analytics.track('resource_error', {
          resource: resourceName,
          error: error.message
        })
        props.onError?.(error)
      }}
    >
      {props.children}
    </Resource>
  )
}
```