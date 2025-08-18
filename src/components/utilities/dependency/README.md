# Simple Dependency Injection

A lightweight, type-safe dependency injection system for React 19 applications.

## Features

- 🚀 **Simple API** - Just one function to create context and hook
- 🔒 **Type Safety** - Full TypeScript support with autocompletion
- ⚡ **React 19 Ready** - Uses latest React features (`use` hook, new context syntax)
- 🎯 **Local Scope** - Perfect for small, local dependency containers
- 📦 **Zero Dependencies** - Only React required
- 🧪 **Testing Utilities** - Built-in test helpers for easy mocking
- 🔍 **Debug Support** - Enhanced error messages and React DevTools integration
- ✅ **Runtime Validation** - Optional Zod schema validation in development
- ⚡ **Performance Optimized** - Memoized components to prevent unnecessary re-renders

## Installation

```bash
npm install ui-magic-core
```

## Quick Start

```tsx
import { createDependencyContext } from 'ui-magic-core'

// Define your services interface
interface AppServices {
  api: { get: (url: string) => Promise<unknown> }
  logger: { log: (msg: string) => void }
}

// Create context and hook
const { Provider, useDependency } = createDependencyContext<AppServices>()

// Use in components
function UserProfile() {
  const api = useDependency('api')
  const logger = useDependency('logger')
  
  React.useEffect(() => {
    api.get('/user').then(() => logger.log('User loaded'))
  }, [api, logger])
  
  return <div>User Profile</div>
}

// Provide dependencies
function App() {
  const services: AppServices = {
    api: { get: async (url) => fetch(url).then(r => r.json()) },
    logger: { log: (msg) => console.log(msg) }
  }
  
  return (
    <Provider dependencies={services}>
      <UserProfile />
    </Provider>
  )
}
```

## API Reference

### `createDependencyContext<T>(options?)`

Creates a new dependency injection context.

**Parameters:**
- `options.contextName?: string` - Name for debugging (appears in React DevTools)
- `options.schema?: ZodSchema` - Optional Zod schema for runtime validation in debug mode
- `options.isDebug?: boolean` - Enable debug mode 

**Returns:**
- `Provider` - React component to provide dependencies (memoized)
- `useDependency` - Hook to consume dependencies
- `createTestProvider` - Utility function for testing

**Example:**
```tsx
import { z } from 'zod'

const servicesSchema = z.object({
  api: z.object({ get: z.function() }),
  logger: z.object({ log: z.function() })
})

const { Provider, useDependency, createTestProvider } = createDependencyContext<MyServices>({
  contextName: 'AppServices',
  schema: servicesSchema,
  isDebug: true
})
```

### `Provider`

Provides dependencies to child components. Component is memoized to prevent unnecessary re-renders.

**Props:**
- `dependencies: T` - Object containing all dependencies
- `children: ReactNode` - Child components

**Features:**
- Automatically validates dependencies with Zod schema (if provided and debug mode enabled)
- Has `displayName` set for better React DevTools experience
- Memoized to prevent re-renders when dependencies haven't changed

### `useDependency(key)`

Resolves a specific dependency by key.

**Parameters:**
- `key: keyof T` - Dependency key

**Returns:** The resolved dependency value

**Throws:** Error if dependency not found or used outside Provider. Error messages include available dependency keys for better debugging.

## Multiple Contexts

You can create multiple independent contexts:

```tsx
// API services
const { Provider: ApiProvider, useDependency: useApi } = 
  createDependencyContext<ApiServices>()

// UI services  
const { Provider: UiProvider, useDependency: useUi } = 
  createDependencyContext<UiServices>()

function App() {
  return (
    <ApiProvider dependencies={apiServices}>
      <UiProvider dependencies={uiServices}>
        <MyComponent />
      </UiProvider>
    </ApiProvider>
  )
}
```

## TypeScript Utilities

The library provides utility types for advanced TypeScript usage:

```tsx
import { InferDependencies, ExtractDependencyTypes } from 'ui-magic-core'

// Infer dependency types from a context
type MyDeps = InferDependencies<typeof myContext>

// Extract specific dependency types
type ApiType = ExtractDependencyTypes<MyServices, 'api'>
type LoggerType = ExtractDependencyTypes<MyServices, 'logger'>
```

## Advanced Examples

### With Runtime Validation

```tsx
import { z } from 'zod'
import { createDependencyContext } from 'ui-magic-core'

interface Services {
  api: { get: (url: string) => Promise<any> }
  config: { apiUrl: string }
}

const servicesSchema = z.object({
  api: z.object({ get: z.function() }),
  config: z.object({ apiUrl: z.string().url() })
})

const { Provider, useDependency } = createDependencyContext<Services>({
  contextName: 'AppServices',
  schema: servicesSchema,
  isDebug: process.env.NODE_ENV === 'development'
})
```

### Performance Optimized Setup

```tsx
// Provider is automatically memoized, but you can optimize dependencies too
const services = useMemo(() => ({
  api: { get: (url: string) => fetch(url).then(r => r.json()) },
  logger: { log: (msg: string) => console.log(msg) }
}), [])

return (
  <Provider dependencies={services}>
    <App />
  </Provider>
)
```

## Best Practices

1. **Define interfaces** - Always type your dependencies
2. **Keep it local** - Use for component-level dependencies
3. **Avoid global state** - This is not a state management solution
4. **Use factories** - Create services with factory functions
5. **Test isolation** - Easy to mock dependencies in tests
6. **Use contextName** - Set meaningful names for better debugging
7. **Enable validation** - Use Zod schemas in development for early error detection
8. **Memoize dependencies** - Prevent unnecessary re-renders by memoizing dependency objects

## Testing

### Basic Testing

```tsx
// Easy to test with mock dependencies
const mockServices = {
  api: { get: jest.fn() },
  logger: { log: jest.fn() }
}

render(
  <Provider dependencies={mockServices}>
    <ComponentUnderTest />
  </Provider>
)
```

### Using `createTestProvider`

The `createTestProvider` utility makes testing even easier:

```tsx
const { createTestProvider } = createDependencyContext<MyServices>()

// Create test provider with partial mocks
const TestProvider = createTestProvider({
  api: { get: jest.fn().mockResolvedValue({ data: 'test' }) },
  logger: { log: jest.fn() }
})

render(
  <TestProvider>
    <ComponentUnderTest />
  </TestProvider>
)
```

### Testing with Schema Validation

```tsx
import { z } from 'zod'

const testSchema = z.object({
  api: z.any(),
  logger: z.any()
})

const { createTestProvider } = createDependencyContext<MyServices>({
  schema: testSchema,
  isDebug: true
})

// This will validate your test dependencies
const TestProvider = createTestProvider(mockServices)
```

## Troubleshooting

### Common Issues

**Error: "Dependency 'xyz' not found"**
- Check that the dependency key exists in your dependencies object
- The error message will show available keys for debugging
- Ensure you're using the hook inside a Provider

**Performance Issues**
- Use `useMemo` to memoize your dependencies object
- The Provider is already memoized, but dependencies should be stable
- Avoid creating new objects on every render

**TypeScript Errors**
- Ensure your interface matches the actual dependencies structure
- Use the provided utility types for complex scenarios
- Check that Zod schema matches your TypeScript interface

**Validation Errors**
- Zod validation only runs in debug mode
- Check that your dependencies match the provided schema
- Use `z.any()` for complex objects that can't be easily validated

### Debug Mode

Debug mode is automatically enabled in development (`NODE_ENV !== 'production'`) and provides:
- Enhanced error messages with available dependency keys
- Runtime validation with Zod schemas
- Better React DevTools integration with component names

## Migration Guide

### From v1.x to v2.x

The new version is backward compatible, but you can opt into new features:

```tsx
// Old way (still works)
const { Provider, useDependency } = createDependencyContext<Services>()

// New way with enhanced features
const { Provider, useDependency, createTestProvider } = createDependencyContext<Services>({
  contextName: 'MyServices',
  schema: mySchema,
  isDebug: true
})
```

## License

MIT