import { z } from 'zod'

export type Primitive = string | number | boolean | bigint | symbol | null | undefined

export type AssertionError = Error & { name: 'AssertionError' }

export function createAssertionError(message: string, cause?: unknown): AssertionError {
  const error = new Error(message) as AssertionError
  error.name = 'AssertionError'
  if (cause !== undefined) {
    ;(error as Error & { cause?: unknown }).cause = cause
  }
  return error
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint'
}

export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function'
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value)
}

export function isNonEmptyArray<T = unknown>(value: unknown): value is [T, ...T[]] {
  return Array.isArray(value) && value.length > 0
}

export function isPrimitive(value: unknown): value is Primitive {
  const type = typeof value
  return value === null || (type !== 'object' && type !== 'function')
}

export function isNull(value: unknown): value is null {
  return value === null
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

export function isNotNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return isObject(value) && Object.getPrototypeOf(value) === Object.prototype
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!isObject(value)) return false
  if (Object.getPrototypeOf(value) === null) return true
  if (Object.getPrototypeOf(value) === Object.prototype) return true
  return false
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

export function isError(value: unknown): value is Error {
  return value instanceof Error
}

export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp
}

export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return (
    value instanceof Promise ||
    (isObject(value) && isFunction((value as Record<string, unknown>).then))
  )
}

export function isMap<K = unknown, V = unknown>(value: unknown): value is Map<K, V> {
  return value instanceof Map
}

export function isSet<T = unknown>(value: unknown): value is Set<T> {
  return value instanceof Set
}

export function isWeakMap(value: unknown): value is WeakMap<WeakKey, unknown> {
  return value instanceof WeakMap
}

export function isWeakSet(value: unknown): value is WeakSet<WeakKey> {
  return value instanceof WeakSet
}

export function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer
}

export function isTypedArray(value: unknown): value is ArrayBufferView {
  return ArrayBuffer.isView(value) && !(value instanceof DataView)
}

export function isIterable<T = unknown>(value: unknown): value is Iterable<T> {
  return value != null && isFunction((value as Record<string | symbol, unknown>)[Symbol.iterator])
}

export function isAsyncIterable<T = unknown>(value: unknown): value is AsyncIterable<T> {
  return (
    value != null && isFunction((value as Record<string | symbol, unknown>)[Symbol.asyncIterator])
  )
}

export function isEmpty(value: unknown): boolean {
  if (isNullish(value)) return true
  if (isString(value)) return value.length === 0
  if (isArray(value)) return value.length === 0
  if (isMap(value) || isSet(value)) return value.size === 0
  if (isObject(value)) return Object.keys(value).length === 0
  return false
}

export function isNonEmpty<T>(value: T): value is NonNullable<T> {
  return !isEmpty(value) && isNotNullish(value)
}

export function hasProperty<K extends PropertyKey>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return isObject(obj) && key in obj
}

export function hasMethod<K extends PropertyKey>(
  obj: unknown,
  key: K
): obj is Record<K, (...args: unknown[]) => unknown> {
  return hasProperty(obj, key) && isFunction(obj[key])
}

export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw createAssertionError(message ?? 'Assertion failed')
  }
}

export function assertIsString(value: unknown, message?: string): asserts value is string {
  if (!isString(value)) {
    throw createAssertionError(message ?? `Expected string, got ${typeof value}`, { value })
  }
}

export function assertIsNumber(value: unknown, message?: string): asserts value is number {
  if (!isNumber(value)) {
    throw createAssertionError(message ?? `Expected number, got ${typeof value}`, { value })
  }
}

export function assertIsBoolean(value: unknown, message?: string): asserts value is boolean {
  if (!isBoolean(value)) {
    throw createAssertionError(message ?? `Expected boolean, got ${typeof value}`, { value })
  }
}

export function assertIsObject(
  value: unknown,
  message?: string
): asserts value is Record<string, unknown> {
  if (!isObject(value)) {
    throw createAssertionError(message ?? `Expected object, got ${typeof value}`, { value })
  }
}

export function assertIsArray<T = unknown>(value: unknown, message?: string): asserts value is T[] {
  if (!isArray(value)) {
    throw createAssertionError(message ?? `Expected array, got ${typeof value}`, { value })
  }
}

export function assertIsFunction(
  value: unknown,
  message?: string
): asserts value is (...args: unknown[]) => unknown {
  if (!isFunction(value)) {
    throw createAssertionError(message ?? `Expected function, got ${typeof value}`, { value })
  }
}

export function assertIsNotNullish<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T {
  if (isNullish(value)) {
    throw createAssertionError(message ?? 'Expected non-nullish value', { value })
  }
}

export function assertIsNonEmptyArray<T = unknown>(
  value: unknown,
  message?: string
): asserts value is [T, ...T[]] {
  if (!isNonEmptyArray(value)) {
    throw createAssertionError(message ?? 'Expected non-empty array', { value })
  }
}

export function assertIsDate(value: unknown, message?: string): asserts value is Date {
  if (!isDate(value)) {
    throw createAssertionError(message ?? `Expected Date, got ${typeof value}`, { value })
  }
}

export function assertIsError(value: unknown, message?: string): asserts value is Error {
  if (!isError(value)) {
    throw createAssertionError(message ?? `Expected Error, got ${typeof value}`, { value })
  }
}

export function createTypeGuard<T>(schema: z.ZodType<T>) {
  return function isType(value: unknown): value is T {
    return schema.safeParse(value).success
  }
}

export function createAssertion<T>(schema: z.ZodType<T>, name?: string) {
  return function assertType(value: unknown, message?: string): asserts value is T {
    const result = schema.safeParse(value)
    if (!result.success) {
      const typeName =
        name ??
        (schema as z.ZodSchema & { _def?: { typeName?: string } })._def?.typeName ??
        'unknown'
      const errorMessage = message ?? `Expected ${typeName}, validation failed`
      throw createAssertionError(errorMessage, {
        value,
        zodErrors: result.error.issues,
      })
    }
  }
}

export function validateSchema<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.parse(value)
  return result
}

export function safeValidateSchema<T>(schema: z.ZodType<T>, value: unknown): T | null {
  const result = schema.safeParse(value)
  return result.success ? result.data : null
}

export interface TypeGuardResult<T> {
  success: boolean
  data?: T
  error?: string
}

export function createSafeTypeGuard<T>(schema: z.ZodType<T>) {
  return function safeIsType(value: unknown): TypeGuardResult<T> {
    const result = schema.safeParse(value)
    return result.success
      ? { success: true, data: result.data }
      : { success: false, error: result.error.message }
  }
}

export const CommonSchemas = {
  nonEmptyString: z.string().min(1),
  positiveNumber: z.number().positive(),
  nonNegativeNumber: z.number().nonnegative(),
  integer: z.number().int(),
  url: z.string().url(),
  email: z.string().email(),
  uuid: z.string().uuid(),
  dateString: z.string().datetime(),
  jsonString: z.string().refine((val) => {
    try {
      JSON.parse(val)
      return true
    } catch {
      return false
    }
  }, 'Invalid JSON string'),
  nonEmptyArray: z.array(z.unknown()).nonempty(),
  plainObject: z.record(z.string(), z.unknown()),
} as const

export type InferSchema<T> = T extends z.ZodType<infer U> ? U : never

export type TypePredicate<T> = (value: unknown) => value is T
export type AssertionFunction<T> = (value: unknown, message?: string) => asserts value is T

export interface TypeValidator<T> {
  guard: TypePredicate<T>
  assert: AssertionFunction<T>
  schema?: z.ZodType<T>
  safe?: (value: unknown) => TypeGuardResult<T>
}

export function createValidator<T>(schema: z.ZodType<T>, name?: string): TypeValidator<T> {
  const guard = createTypeGuard(schema)
  const assert = createAssertion(schema, name)
  const safe = createSafeTypeGuard(schema)

  return { guard, assert, schema, safe }
}
