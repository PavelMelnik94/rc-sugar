# Data Mapper Utility

A flexible, type-safe infrastructure tool for mapping and normalizing data transformations. Designed for maximum performance and composability without business logic dependencies.

## Description

The Data Mapper utility provides a comprehensive set of tools for transforming data from one format to another with full TypeScript support, Zod validation, and performance optimizations. It follows infrastructure patterns with high cohesion and low coupling principles.

## When to Use

- **Data Transformation**: Converting API responses to internal data structures
- **Normalization**: Standardizing data formats across different sources  
- **Pipeline Processing**: Building composable data transformation chains
- **Validation**: Ensuring data integrity during transformations
- **Performance Optimization**: Caching expensive transformations

## Patterns Used

- **Composition Pattern**: Chainable mapper combinations
- **Strategy Pattern**: Conditional mapping based on input characteristics
- **Builder Pattern**: Fluent API for mapper configuration
- **Memoization Pattern**: Automatic caching for performance optimization

## TypeScript Types

```typescript
type MapperConfig<TInput, TOutput> = {
  transform: (input: TInput) => TOutput
  schema?: z.ZodSchema<TInput>
  name?: string
  memoize?: boolean
}

type Mapper<TInput, TOutput> = {
  map: (input: TInput) => TOutput
  mapBatch: (inputs: TInput[]) => TOutput[]
  name: string
  compose: <TNext>(nextMapper: Mapper<TOutput, TNext>) => Mapper<TInput, TNext>
}
```

## API Reference

### `createMapper<TInput, TOutput>(config)`

Creates a new type-safe mapper with optional validation and memoization.

**Parameters:**
- `config.transform`: Function to transform input to output
- `config.schema?`: Optional Zod schema for input validation
- `config.name?`: Optional name for debugging and composition
- `config.memoize?`: Enable memoization for expensive transformations

**Returns:** `Mapper<TInput, TOutput>`

### `composeMappers(firstMapper, secondMapper)`

Composes two mappers into a single transformation pipeline.

### `createConditionalMapper(condition, trueMapper, falseMapper?)`

Creates a mapper that applies different transformations based on input conditions.

### `createBatchMapper(mapper, options?)`

Optimizes mapper for processing large batches with chunking support.

### `createNormalizerMapper(fieldMappings, schema?)`

Creates a mapper for normalizing object fields with flexible field mapping.

### `pipe(...mappers)`

Composes multiple mappers into a sequential transformation pipeline.

### `identity()`

Returns an identity mapper that passes input unchanged.

## Examples

### Basic Data Transformation

```typescript
import { createMapper } from 'react-utility-kit/mapper';

interface ApiUser {
  first_name: string;
  last_name: string;
  email_address: string;
}

interface AppUser {
  fullName: string;
  email: string;
}

const userMapper = createMapper<ApiUser, AppUser>({
  transform: (apiUser) => ({
    fullName: `${apiUser.first_name} ${apiUser.last_name}`,
    email: apiUser.email_address
  }),
  name: 'UserMapper'
});

const appUser = userMapper.map({
  first_name: 'John',
  last_name: 'Doe', 
  email_address: 'john@example.com'
});
// Result: { fullName: 'John Doe', email: 'john@example.com' }
```

### Validation with Zod Schema

```typescript
import { z } from 'zod';
import { createMapper } from 'react-utility-kit/mapper';

const apiResponseSchema = z.object({
  data: z.array(z.object({
    id: z.number(),
    name: z.string(),
    price: z.number().positive()
  })),
  total: z.number()
});

const productMapper = createMapper({
  schema: apiResponseSchema,
  transform: (response) => ({
    products: response.data.map(item => ({
      id: item.id,
      displayName: item.name.toUpperCase(),
      formattedPrice: `$${item.price.toFixed(2)}`
    })),
    count: response.total
  }),
  name: 'ProductResponseMapper'
});
```

### Composition and Pipelines

```typescript
import { createMapper, pipe } from 'react-utility-kit/mapper';

const parseJson = createMapper<string, object>({
  transform: (json) => JSON.parse(json),
  name: 'JsonParser'
});

const extractData = createMapper<{data: any[]}, any[]>({
  transform: (response) => response.data,
  name: 'DataExtractor'
});

const normalizeItems = createMapper<any[], Product[]>({
  transform: (items) => items.map(item => ({
    id: item.id,
    name: item.title || item.name,
    price: Number(item.cost || item.price)
  })),
  name: 'ItemNormalizer'
});

// Method 1: Sequential composition
const jsonToProducts = parseJson
  .compose(extractData)
  .compose(normalizeItems);

// Method 2: Pipe composition  
const jsonToProductsPipe = pipe(
  parseJson,
  extractData,
  normalizeItems
);

const products = jsonToProducts.map('{"data": [{"id": 1, "title": "Product", "cost": 10}]}');
```

### Conditional Mapping

```typescript
import { createMapper, createConditionalMapper } from 'react-utility-kit/mapper';

interface ApiResponse {
  status: 'success' | 'error';
  data?: any;
  error?: string;
}

const successMapper = createMapper<ApiResponse, any>({
  transform: (response) => response.data,
  name: 'SuccessMapper'
});

const errorMapper = createMapper<ApiResponse, Error>({
  transform: (response) => new Error(response.error || 'Unknown error'),
  name: 'ErrorMapper'
});

const responseMapper = createConditionalMapper(
  (response: ApiResponse) => response.status === 'success',
  successMapper,
  errorMapper
);
```

### Batch Processing

```typescript
import { createMapper, createBatchMapper } from 'react-utility-kit/mapper';

const expensiveTransform = createMapper({
  transform: (data: RawData) => processComplexCalculation(data),
  memoize: true, // Cache results for repeated inputs
  name: 'ExpensiveProcessor'
});

const batchProcessor = createBatchMapper(expensiveTransform, {
  chunkSize: 100,
  parallel: true
});

const results = batchProcessor.map(largeDataArray);
```

### Field Normalization

```typescript
import { createNormalizerMapper } from 'react-utility-kit/mapper';

interface LegacyUser {
  user_id: number;
  first_name: string;
  last_name: string;
  email_addr: string;
  created_at: string;
}

interface ModernUser {
  id: number;
  fullName: string;
  email: string;
  createdDate: Date;
  initials: string;
}

const userNormalizer = createNormalizerMapper<LegacyUser, ModernUser>({
  id: 'user_id',
  fullName: (user) => `${user.first_name} ${user.last_name}`,
  email: 'email_addr',
  createdDate: (user) => new Date(user.created_at),
  initials: (user) => `${user.first_name[0]}${user.last_name[0]}`
});
```

## Performance Considerations

### Memoization for Expensive Operations

```typescript
const heavyMapper = createMapper({
  transform: (data) => performExpensiveCalculation(data),
  memoize: true, // Automatically caches results
  name: 'HeavyCalculation'
});
```

### Batch Processing Optimization

```typescript
// Process large datasets efficiently
const optimizedBatch = createBatchMapper(mapper, {
  chunkSize: 1000,  // Process in chunks
  parallel: true    // Enable parallel processing
});
```

### Memory Management

- Use memoization judiciously for frequently repeated inputs
- Clear cache periodically for long-running applications
- Consider memory usage vs. computation trade-offs

## Best Practices

### ✅ **Recommended**

- Use descriptive names for mappers to aid in debugging
- Enable validation with Zod schemas during development
- Compose simple mappers rather than creating complex single transformations
- Use memoization for expensive, pure transformations
- Leverage TypeScript generics for full type safety

### ❌ **Avoid**

- Creating overly complex single-step transformations
- Mixing business logic with data transformation
- Using memoization for non-pure functions
- Ignoring validation in critical data pipelines
- Creating circular dependencies in mapper composition

## Migration Guide

### From Manual Transformations

**Before:**
```typescript
function transformUser(apiUser: ApiUser): AppUser {
  return {
    fullName: `${apiUser.first_name} ${apiUser.last_name}`,
    email: apiUser.email_address
  };
}

const users = apiUsers.map(transformUser);
```

**After:**
```typescript
const userMapper = createMapper<ApiUser, AppUser>({
  transform: (apiUser) => ({
    fullName: `${apiUser.first_name} ${apiUser.last_name}`,
    email: apiUser.email_address
  }),
  name: 'UserMapper'
});

const users = userMapper.mapBatch(apiUsers);
```

### From Lodash Transformations

**Before:**
```typescript
import { map, compose } from 'lodash/fp';

const transformPipeline = compose(
  map(normalize),
  map(validate),
  map(transform)
);
```

**After:**
```typescript
const transformPipeline = pipe(
  transformMapper,
  validateMapper, 
  normalizeMapper
);
```

## Related Components

- **[`dependency`](../dependency/README.md)** - Dependency injection for infrastructure services
- **[`debug`](../debug/README.md)** - Development debugging utilities

## Environment Considerations

The mapper utility is environment-agnostic and works in both browser and Node.js environments. Zod validation can be conditionally enabled for development environments:

```typescript
const mapper = createMapper({
  transform: myTransform,
  schema: process.env.NODE_ENV === 'development' ? mySchema : undefined
});
```

## License

MIT