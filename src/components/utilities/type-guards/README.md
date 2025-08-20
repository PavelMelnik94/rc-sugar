# Type Guards & Function Assertions

A comprehensive collection of type guards and function assertions with full TypeScript support and Zod schema integration.

## Features

- 🚀 **Complete Type Coverage** - Guards for all JavaScript types including primitives, objects, collections, and more
- 🔒 **Type Safety** - Full TypeScript support with proper type narrowing
- ⚡ **React 19 Ready** - Optimized for modern React development
- 🎯 **Zero Dependencies** - Only React and Zod required (Zod for schema validation)
- 🧪 **Assertion Functions** - Built-in assertion functions that throw on type mismatch
- 🔍 **Zod Integration** - Create type guards and assertions from Zod schemas
- ✅ **Runtime Validation** - Safe runtime type checking with detailed error messages
- 📦 **Tree Shakeable** - Only import what you need

## Installation

```bash
npm install react-utility-kit
```

## Quick Start

### Basic Type Guards

```tsx
import { 
  isString, 
  isNumber, 
  isArray, 
  isNonEmptyArray,
  isObject,
  isNotNullish 
} from 'react-utility-kit/type-guards'

// Primitive type guards
if (isString(value)) {
  // value is now typed as string
  console.log(value.toUpperCase())
}

if (isNumber(value)) {
  // value is now typed as number
  console.log(value.toFixed(2))
}

// Array type guards with type narrowing
if (isArray(value)) {
  // value is now typed as unknown[]
  console.log(value.length)
}

if (isNonEmptyArray(value)) {
  // value is now typed as [unknown, ...unknown[]]
  console.log(value[0]) // Safe access - guaranteed to exist
}

// Nullish checks
if (isNotNullish(value)) {
  // value is now typed as NonNullable<T>
  // Safe to use without null checks
}
```

### Function Assertions

```tsx
import { 
  assert,
  assertIsString, 
  assertIsNumber,
  assertIsArray,
  assertIsNotNullish 
} from 'react-utility-kit/type-guards'

function processUserInput(input: unknown) {
  // Throws AssertionError if input is not a string
  assertIsString(input, 'User input must be a string')
  
  // Now input is safely typed as string
  return input.toUpperCase()
}

function calculateSum(numbers: unknown) {
  assertIsArray(numbers, 'Expected array of numbers')
  
  return numbers.reduce((sum, num) => {
    assertIsNumber(num, 'All elements must be numbers')
    return sum + num
  }, 0)
}

// Generic assertion
function validateCondition(condition: unknown, message: string) {
  assert(condition, message)
  // Continues execution only if condition is truthy
}
```

### Zod Schema Integration

```tsx
import { z } from 'zod'
import { 
  createTypeGuard, 
  createAssertion,
  createValidator,
  validateSchema,
  safeValidateSchema 
} from 'react-utility-kit/type-guards'

// Define your schema
const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().positive()
})

// Create type guard
const isUser = createTypeGuard(UserSchema)

if (isUser(data)) {
  // data is now typed as { name: string; email: string; age: number }
  console.log(data.name)
}

// Create assertion
const assertIsUser = createAssertion(UserSchema, 'User')

function processUser(input: unknown) {
  assertIsUser(input)
  // input is now safely typed as User
  return input.email
}

// Complete validator with all methods
const userValidator = createValidator(UserSchema, 'User')

// Use type guard
if (userValidator.guard(data)) {
  // Safe to use
}

// Use assertion
userValidator.assert(data, 'Invalid user data')

// Use safe validation
const result = userValidator.safe?.(data)
if (result?.success) {
  console.log(result.data)
}
```

### Common Schema Patterns

```tsx
import { CommonSchemas, createTypeGuard } from 'react-utility-kit/type-guards'

const isEmail = createTypeGuard(CommonSchemas.email)
const isPositiveNumber = createTypeGuard(CommonSchemas.positiveNumber)
const isNonEmptyString = createTypeGuard(CommonSchemas.nonEmptyString)
const isUrl = createTypeGuard(CommonSchemas.url)
const isJsonString = createTypeGuard(CommonSchemas.jsonString)

// Usage
if (isEmail(input)) {
  // input is a valid email string
  sendEmail(input)
}

if (isPositiveNumber(value)) {
  // value is a positive number
  processPositiveNumber(value)
}
```

### Advanced Usage

```tsx
import { 
  hasProperty, 
  hasMethod,
  isEmpty,
  isNonEmpty,
  isPlainObject,
  createSafeTypeGuard 
} from 'react-utility-kit/type-guards'

// Property and method checks
const obj: unknown = { name: 'John', greet: () => 'Hello' }

if (hasProperty(obj, 'name')) {
  // obj is now typed as Record<'name', unknown>
  console.log(obj.name)
}

if (hasMethod(obj, 'greet')) {
  // obj is now typed as Record<'greet', Function>
  console.log(obj.greet())
}

// Emptiness checks
if (isEmpty(value)) {
  console.log('Value is empty (null, undefined, "", [], {}, empty Map/Set)')
}

if (isNonEmpty(value)) {
  console.log('Value is not empty and not nullish')
}

// Safe validation with detailed results
const safeIsUser = createSafeTypeGuard(UserSchema)
const result = safeIsUser(data)

if (result.success) {
  console.log('Valid user:', result.data)
} else {
  console.error('Validation error:', result.error)
}
```

## Complete Type Guards Reference

### Primitive Types
- `isString(value)` - String type guard
- `isNumber(value)` - Number type guard (excludes NaN)
- `isBoolean(value)` - Boolean type guard
- `isBigInt(value)` - BigInt type guard
- `isSymbol(value)` - Symbol type guard
- `isFunction(value)` - Function type guard
- `isPrimitive(value)` - Primitive values guard

### Nullish Types
- `isNull(value)` - Null check
- `isUndefined(value)` - Undefined check
- `isNullish(value)` - Null or undefined check
- `isNotNullish(value)` - Non-nullish check

### Object Types
- `isObject(value)` - Object type guard
- `isArray(value)` - Array type guard
- `isNonEmptyArray(value)` - Non-empty array guard
- `isRecord(value)` - Plain object guard
- `isPlainObject(value)` - Plain object guard (more strict)
- `isDate(value)` - Valid Date guard
- `isError(value)` - Error instance guard
- `isRegExp(value)` - RegExp guard
- `isPromise(value)` - Promise-like object guard

### Collection Types
- `isMap(value)` - Map instance guard
- `isSet(value)` - Set instance guard
- `isWeakMap(value)` - WeakMap instance guard
- `isWeakSet(value)` - WeakSet instance guard

### Buffer Types
- `isArrayBuffer(value)` - ArrayBuffer guard
- `isTypedArray(value)` - TypedArray guard

### Iterator Types
- `isIterable(value)` - Iterable object guard
- `isAsyncIterable(value)` - AsyncIterable object guard

### Utility Functions
- `isEmpty(value)` - Empty value check
- `isNonEmpty(value)` - Non-empty value check
- `hasProperty(obj, key)` - Property existence check
- `hasMethod(obj, key)` - Method existence check

## Assertion Functions

All type guards have corresponding assertion functions:

- `assert(condition, message?)` - Generic assertion
- `assertIsString(value, message?)` - String assertion
- `assertIsNumber(value, message?)` - Number assertion
- `assertIsBoolean(value, message?)` - Boolean assertion
- `assertIsObject(value, message?)` - Object assertion
- `assertIsArray(value, message?)` - Array assertion
- `assertIsFunction(value, message?)` - Function assertion
- `assertIsNotNullish(value, message?)` - Non-nullish assertion
- `assertIsNonEmptyArray(value, message?)` - Non-empty array assertion
- `assertIsDate(value, message?)` - Date assertion
- `assertIsError(value, message?)` - Error assertion

## Zod Integration Functions

- `createTypeGuard(schema)` - Create type guard from Zod schema
- `createAssertion(schema, name?)` - Create assertion from Zod schema
- `createValidator(schema, name?)` - Create complete validator
- `validateSchema(schema, value)` - Validate and return data (throws on error)
- `safeValidateSchema(schema, value)` - Safe validation (returns null on error)
- `createSafeTypeGuard(schema)` - Create safe type guard with detailed results

## Common Schemas

Pre-built Zod schemas for common patterns:

- `CommonSchemas.nonEmptyString` - Non-empty string
- `CommonSchemas.positiveNumber` - Positive number
- `CommonSchemas.nonNegativeNumber` - Non-negative number
- `CommonSchemas.integer` - Integer number
- `CommonSchemas.url` - Valid URL string
- `CommonSchemas.email` - Valid email string
- `CommonSchemas.uuid` - Valid UUID string
- `CommonSchemas.dateString` - Valid date string
- `CommonSchemas.jsonString` - Valid JSON string
- `CommonSchemas.nonEmptyArray` - Non-empty array
- `CommonSchemas.plainObject` - Plain object

## TypeScript Utilities

```tsx
import type { 
  TypePredicate,
  AssertionFunction,
  TypeValidator,
  TypeGuardResult,
  InferSchema,
  AssertionError 
} from 'react-utility-kit/type-guards'

// Type definitions for custom type guards
type MyTypePredicate = TypePredicate<MyType>
type MyAssertion = AssertionFunction<MyType>
type MyValidator = TypeValidator<MyType>

// Infer schema types
type UserType = InferSchema<typeof UserSchema>
```

## Error Handling

All assertion functions throw `AssertionError` instances with detailed information:

```tsx
import { assertIsString, createAssertionError } from 'react-utility-kit/type-guards'

try {
  assertIsString(123)
} catch (error) {
  if (error instanceof Error && error.name === 'AssertionError') {
    console.log('Assertion failed:', error.message)
    console.log('Caused by:', error.cause)
  }
}

// Create custom assertion errors
const customError = createAssertionError('Custom message', { value: 123 })
```

## Best Practices

1. **Use Type Guards for Control Flow** - Let TypeScript narrow types naturally
2. **Use Assertions for Input Validation** - Throw early on invalid data
3. **Combine with Zod Schemas** - Get runtime and compile-time type safety
4. **Custom Error Messages** - Provide helpful context in assertion messages
5. **Safe Validation** - Use safe variants when you need detailed error information
6. **Tree Shaking** - Import only the functions you need

## Performance Notes

- All type guards are optimized for performance
- Zod integration is lazy-loaded when needed
- Tree shaking ensures minimal bundle size
- No runtime overhead for unused functions

## React Integration

Perfect for validating props, API responses, and user input:

```tsx
import React from 'react'
import { assertIsString, isArray, assertIsNotNullish } from 'react-utility-kit/type-guards'

interface Props {
  data: unknown
}

function MyComponent({ data }: Props) {
  // Validate props at runtime
  assertIsNotNullish(data, 'Data is required')
  
  if (isArray(data)) {
    return (
      <ul>
        {data.map((item, index) => (
          <li key={index}>{String(item)}</li>
        ))}
      </ul>
    )
  }
  
  assertIsString(data, 'Data must be string or array')
  return <p>{data}</p>
}
```

## License

MIT