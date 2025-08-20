import { z } from 'zod'
import {
  assert,
  assertIsArray,
  assertIsBoolean,
  assertIsDate,
  assertIsError,
  assertIsFunction,
  assertIsNonEmptyArray,
  assertIsNotNullish,
  assertIsNumber,
  assertIsObject,
  assertIsString,
  CommonSchemas,
  createAssertion,
  createAssertionError,
  createSafeTypeGuard,
  createTypeGuard,
  createValidator,
  hasMethod,
  hasProperty,
  isArray,
  isArrayBuffer,
  isAsyncIterable,
  isBigInt,
  isBoolean,
  isDate,
  isEmpty,
  isError,
  isFunction,
  isIterable,
  isMap,
  isNonEmpty,
  isNonEmptyArray,
  isNotNullish,
  isNull,
  isNullish,
  isNumber,
  isObject,
  isPlainObject,
  isPrimitive,
  isPromise,
  isRecord,
  isRegExp,
  isSet,
  isString,
  isSymbol,
  isTypedArray,
  isUndefined,
  isWeakMap,
  isWeakSet,
  safeValidateSchema,
  validateSchema,
} from './type-guards'

describe('type Guards', () => {
  describe('primitive Type Guards', () => {
    describe('isString', () => {
      it('should return true for strings', () => {
        expect(isString('')).toBe(true)
        expect(isString('hello')).toBe(true)
        expect(isString('123')).toBe(true)
      })

      it('should return false for non-strings', () => {
        expect(isString(123)).toBe(false)
        expect(isString(true)).toBe(false)
        expect(isString(null)).toBe(false)
        expect(isString(undefined)).toBe(false)
        expect(isString({})).toBe(false)
        expect(isString([])).toBe(false)
      })
    })

    describe('isNumber', () => {
      it('should return true for valid numbers', () => {
        expect(isNumber(0)).toBe(true)
        expect(isNumber(123)).toBe(true)
        expect(isNumber(-456)).toBe(true)
        expect(isNumber(3.14)).toBe(true)
        expect(isNumber(Number.POSITIVE_INFINITY)).toBe(true)
        expect(isNumber(Number.NEGATIVE_INFINITY)).toBe(true)
      })

      it('should return false for invalid numbers and non-numbers', () => {
        expect(isNumber(Number.NaN)).toBe(false)
        expect(isNumber('123')).toBe(false)
        expect(isNumber(true)).toBe(false)
        expect(isNumber(null)).toBe(false)
        expect(isNumber(undefined)).toBe(false)
      })
    })

    describe('isBoolean', () => {
      it('should return true for booleans', () => {
        expect(isBoolean(true)).toBe(true)
        expect(isBoolean(false)).toBe(true)
      })

      it('should return false for non-booleans', () => {
        expect(isBoolean(0)).toBe(false)
        expect(isBoolean(1)).toBe(false)
        expect(isBoolean('true')).toBe(false)
        expect(isBoolean(null)).toBe(false)
        expect(isBoolean(undefined)).toBe(false)
      })
    })

    describe('isBigInt', () => {
      it('should return true for bigints', () => {
        expect(isBigInt(123n)).toBe(true)
        expect(isBigInt(BigInt(456))).toBe(true)
      })

      it('should return false for non-bigints', () => {
        expect(isBigInt(123)).toBe(false)
        expect(isBigInt('123n')).toBe(false)
        expect(isBigInt(null)).toBe(false)
      })
    })

    describe('isSymbol', () => {
      it('should return true for symbols', () => {
        expect(isSymbol(Symbol('test1'))).toBe(true)
        expect(isSymbol(Symbol('test'))).toBe(true)
        expect(isSymbol(Symbol.iterator)).toBe(true)
      })

      it('should return false for non-symbols', () => {
        expect(isSymbol('symbol')).toBe(false)
        expect(isSymbol(null)).toBe(false)
        expect(isSymbol(undefined)).toBe(false)
      })
    })

    describe('isFunction', () => {
      it('should return true for functions', () => {
        expect(isFunction(() => {})).toBe(true)
        expect(isFunction(() => {})).toBe(true)
        expect(isFunction(async () => {})).toBe(true)
        expect(isFunction(class TestClass {})).toBe(true)
        expect(isFunction(Math.abs)).toBe(true)
      })

      it('should return false for non-functions', () => {
        expect(isFunction(null)).toBe(false)
        expect(isFunction({})).toBe(false)
        expect(isFunction('function')).toBe(false)
      })
    })

    describe('isPrimitive', () => {
      it('should return true for primitive values', () => {
        expect(isPrimitive(null)).toBe(true)
        expect(isPrimitive(undefined)).toBe(true)
        expect(isPrimitive(123)).toBe(true)
        expect(isPrimitive('string')).toBe(true)
        expect(isPrimitive(true)).toBe(true)
        expect(isPrimitive(123n)).toBe(true)
        expect(isPrimitive(Symbol('test2'))).toBe(true)
      })

      it('should return false for non-primitive values', () => {
        expect(isPrimitive({})).toBe(false)
        expect(isPrimitive([])).toBe(false)
        expect(isPrimitive(() => {})).toBe(false)
        expect(isPrimitive(new Date())).toBe(false)
      })
    })
  })

  describe('nullish Type Guards', () => {
    describe('isNull', () => {
      it('should return true only for null', () => {
        expect(isNull(null)).toBe(true)
        expect(isNull(undefined)).toBe(false)
        expect(isNull(0)).toBe(false)
        expect(isNull('')).toBe(false)
      })
    })

    describe('isUndefined', () => {
      it('should return true only for undefined', () => {
        expect(isUndefined(undefined)).toBe(true)
        expect(isUndefined(null)).toBe(false)
        expect(isUndefined(0)).toBe(false)
        expect(isUndefined('')).toBe(false)
      })
    })

    describe('isNullish', () => {
      it('should return true for null and undefined', () => {
        expect(isNullish(null)).toBe(true)
        expect(isNullish(undefined)).toBe(true)
      })

      it('should return false for non-nullish values', () => {
        expect(isNullish(0)).toBe(false)
        expect(isNullish('')).toBe(false)
        expect(isNullish(false)).toBe(false)
        expect(isNullish([])).toBe(false)
        expect(isNullish({})).toBe(false)
      })
    })

    describe('isNotNullish', () => {
      it('should return false for null and undefined', () => {
        expect(isNotNullish(null)).toBe(false)
        expect(isNotNullish(undefined)).toBe(false)
      })

      it('should return true for non-nullish values', () => {
        expect(isNotNullish(0)).toBe(true)
        expect(isNotNullish('')).toBe(true)
        expect(isNotNullish(false)).toBe(true)
        expect(isNotNullish([])).toBe(true)
        expect(isNotNullish({})).toBe(true)
      })
    })
  })

  describe('complex Type Guards', () => {
    describe('isObject', () => {
      it('should return true for objects', () => {
        expect(isObject({})).toBe(true)
        expect(isObject({ key: 'value' })).toBe(true)
        expect(isObject(new Date())).toBe(true)
        expect(isObject(/regex/)).toBe(true)
      })

      it('should return false for non-objects', () => {
        expect(isObject(null)).toBe(false)
        expect(isObject([])).toBe(false)
        expect(isObject('string')).toBe(false)
        expect(isObject(123)).toBe(false)
      })
    })

    describe('isArray', () => {
      it('should return true for arrays', () => {
        expect(isArray([])).toBe(true)
        expect(isArray([1, 2, 3])).toBe(true)
        expect(isArray(Array.from({length: 5}))).toBe(true)
      })

      it('should return false for non-arrays', () => {
        expect(isArray({})).toBe(false)
        expect(isArray('array')).toBe(false)
        expect(isArray(null)).toBe(false)
      })
    })

    describe('isNonEmptyArray', () => {
      it('should return true for non-empty arrays', () => {
        expect(isNonEmptyArray([1])).toBe(true)
        expect(isNonEmptyArray([1, 2, 3])).toBe(true)
        expect(isNonEmptyArray(['a', 'b'])).toBe(true)
      })

      it('should return false for empty arrays and non-arrays', () => {
        expect(isNonEmptyArray([])).toBe(false)
        expect(isNonEmptyArray({})).toBe(false)
        expect(isNonEmptyArray(null)).toBe(false)
      })
    })

    describe('isRecord', () => {
      it('should return true for plain objects', () => {
        expect(isRecord({})).toBe(true)
        expect(isRecord({ key: 'value' })).toBe(true)
        expect(isRecord(Object.create(Object.prototype))).toBe(true)
      })

      it('should return false for non-plain objects', () => {
        expect(isRecord(new Date())).toBe(false)
        expect(isRecord([])).toBe(false)
        expect(isRecord(null)).toBe(false)
        expect(isRecord('string')).toBe(false)
      })
    })

    describe('isPlainObject', () => {
      it('should return true for plain objects', () => {
        expect(isPlainObject({})).toBe(true)
        expect(isPlainObject({ a: 1 })).toBe(true)
        expect(isPlainObject(Object.create(null))).toBe(true)
      })

      it('should return false for non-plain objects', () => {
        expect(isPlainObject(new Date())).toBe(false)
        expect(isPlainObject([])).toBe(false)
        expect(isPlainObject(/regex/)).toBe(false)
        expect(isPlainObject(null)).toBe(false)
      })
    })

    describe('isDate', () => {
      it('should return true for valid dates', () => {
        expect(isDate(new Date())).toBe(true)
        expect(isDate(new Date('2023-01-01'))).toBe(true)
      })

      it('should return false for invalid dates and non-dates', () => {
        expect(isDate(new Date('invalid'))).toBe(false)
        expect(isDate('2023-01-01')).toBe(false)
        expect(isDate(null)).toBe(false)
      })
    })

    describe('isError', () => {
      it('should return true for Error instances', () => {
        expect(isError(new Error('test error'))).toBe(true)
        expect(isError(new TypeError('test type error'))).toBe(true)
        expect(isError(new RangeError('test range error'))).toBe(true)
      })

      it('should return false for non-errors', () => {
        expect(isError('error')).toBe(false)
        expect(isError({ message: 'error' })).toBe(false)
        expect(isError(null)).toBe(false)
      })
    })

    describe('isRegExp', () => {
      it('should return true for RegExp instances', () => {
        expect(isRegExp(/test/)).toBe(true)
      })

      it('should return false for non-regexps', () => {
        expect(isRegExp('/test/')).toBe(false)
        expect(isRegExp({})).toBe(false)
        expect(isRegExp(null)).toBe(false)
      })
    })

    describe('isPromise', () => {
      it('should return true for Promise instances', () => {
        expect(isPromise(Promise.resolve())).toBe(true)
        expect(isPromise(new Promise(() => {}))).toBe(true)
        expect(isPromise({ then: () => {} })).toBe(true)
      })

      it('should return false for non-promises', () => {
        expect(isPromise({})).toBe(false)
        expect(isPromise(null)).toBe(false)
        expect(isPromise('promise')).toBe(false)
      })
    })

    describe('collection Type Guards', () => {
      describe('isMap', () => {
        it('should return true for Map instances', () => {
          expect(isMap(new Map())).toBe(true)
          expect(isMap(new Map([['key', 'value']]))).toBe(true)
        })

        it('should return false for non-maps', () => {
          expect(isMap({})).toBe(false)
          expect(isMap([])).toBe(false)
          expect(isMap(null)).toBe(false)
        })
      })

      describe('isSet', () => {
        it('should return true for Set instances', () => {
          expect(isSet(new Set())).toBe(true)
          expect(isSet(new Set([1, 2, 3]))).toBe(true)
        })

        it('should return false for non-sets', () => {
          expect(isSet([])).toBe(false)
          expect(isSet({})).toBe(false)
          expect(isSet(null)).toBe(false)
        })
      })

      describe('isWeakMap', () => {
        it('should return true for WeakMap instances', () => {
          expect(isWeakMap(new WeakMap())).toBe(true)
        })

        it('should return false for non-weakmaps', () => {
          expect(isWeakMap(new Map())).toBe(false)
          expect(isWeakMap({})).toBe(false)
        })
      })

      describe('isWeakSet', () => {
        it('should return true for WeakSet instances', () => {
          expect(isWeakSet(new WeakSet())).toBe(true)
        })

        it('should return false for non-weaksets', () => {
          expect(isWeakSet(new Set())).toBe(false)
          expect(isWeakSet([])).toBe(false)
        })
      })
    })

    describe('buffer Type Guards', () => {
      describe('isArrayBuffer', () => {
        it('should return true for ArrayBuffer instances', () => {
          expect(isArrayBuffer(new ArrayBuffer(8))).toBe(true)
        })

        it('should return false for non-arraybuffers', () => {
          expect(isArrayBuffer(new Uint8Array(8))).toBe(false)
          expect(isArrayBuffer([])).toBe(false)
        })
      })

      describe('isTypedArray', () => {
        it('should return true for TypedArray instances', () => {
          expect(isTypedArray(new Uint8Array(8))).toBe(true)
          expect(isTypedArray(new Int32Array(4))).toBe(true)
          expect(isTypedArray(new Float64Array(2))).toBe(true)
        })

        it('should return false for non-typedarrays', () => {
          expect(isTypedArray([])).toBe(false)
          expect(isTypedArray(new ArrayBuffer(8))).toBe(false)
          expect(isTypedArray(new DataView(new ArrayBuffer(8)))).toBe(false)
        })
      })
    })

    describe('iterator Type Guards', () => {
      describe('isIterable', () => {
        it('should return true for iterable objects', () => {
          expect(isIterable([])).toBe(true)
          expect(isIterable('string')).toBe(true)
          expect(isIterable(new Set())).toBe(true)
          expect(isIterable(new Map())).toBe(true)
        })

        it('should return false for non-iterable objects', () => {
          expect(isIterable({})).toBe(false)
          expect(isIterable(123)).toBe(false)
          expect(isIterable(null)).toBe(false)
        })
      })

      describe('isAsyncIterable', () => {
        it('should return true for async iterable objects', () => {
          const asyncIterable = {
            [Symbol.asyncIterator]() {
              return this
            },
            async next() {
              return { value: 1, done: true }
            }
          }
          expect(isAsyncIterable(asyncIterable)).toBe(true)
        })

        it('should return false for non-async-iterable objects', () => {
          expect(isAsyncIterable([])).toBe(false)
          expect(isAsyncIterable({})).toBe(false)
          expect(isAsyncIterable(null)).toBe(false)
        })
      })
    })
  })

  describe('utility Functions', () => {
    describe('isEmpty', () => {
      it('should return true for empty values', () => {
        expect(isEmpty(null)).toBe(true)
        expect(isEmpty(undefined)).toBe(true)
        expect(isEmpty('')).toBe(true)
        expect(isEmpty([])).toBe(true)
        expect(isEmpty({})).toBe(true)
        expect(isEmpty(new Map())).toBe(true)
        expect(isEmpty(new Set())).toBe(true)
      })

      it('should return false for non-empty values', () => {
        expect(isEmpty('hello')).toBe(false)
        expect(isEmpty([1])).toBe(false)
        expect(isEmpty({ a: 1 })).toBe(false)
        expect(isEmpty(new Map([['a', 1]]))).toBe(false)
        expect(isEmpty(new Set([1]))).toBe(false)
        expect(isEmpty(123)).toBe(false)
      })
    })

    describe('isNonEmpty', () => {
      it('should return true for non-empty values', () => {
        expect(isNonEmpty('hello')).toBe(true)
        expect(isNonEmpty([1])).toBe(true)
        expect(isNonEmpty({ a: 1 })).toBe(true)
        expect(isNonEmpty(123)).toBe(true)
      })

      it('should return false for empty and nullish values', () => {
        expect(isNonEmpty(null)).toBe(false)
        expect(isNonEmpty(undefined)).toBe(false)
        expect(isNonEmpty('')).toBe(false)
        expect(isNonEmpty([])).toBe(false)
        expect(isNonEmpty({})).toBe(false)
      })
    })

    describe('hasProperty', () => {
      it('should return true when object has property', () => {
        const obj = { a: 1, b: 2 }
        expect(hasProperty(obj, 'a')).toBe(true)
        expect(hasProperty(obj, 'b')).toBe(true)
      })

      it('should return false when object does not have property', () => {
        const obj = { a: 1 }
        expect(hasProperty(obj, 'b')).toBe(false)
        expect(hasProperty(null, 'a')).toBe(false)
        expect(hasProperty('string', 'length')).toBe(false) // string is not object
      })
    })

    describe('hasMethod', () => {
      it('should return true when object has method', () => {
        const obj = { method: () => {} }
        expect(hasMethod(obj, 'method')).toBe(true)
      })

      it('should return false when object does not have method', () => {
        const obj = { property: 'value' }
        expect(hasMethod(obj, 'method')).toBe(false)
        expect(hasMethod(obj, 'property')).toBe(false) // property is not a function
      })
    })
  })

  describe('assertion Functions', () => {
    describe('assert', () => {
      it('should not throw for truthy conditions', () => {
        expect(() => assert(true)).not.toThrow()
        expect(() => assert(1)).not.toThrow()
        expect(() => assert('hello')).not.toThrow()
      })

      it('should throw for falsy conditions', () => {
        expect(() => assert(false)).toThrow(createAssertionError('Assertion failed'))
        expect(() => assert(0)).toThrow()
        expect(() => assert('')).toThrow()
        expect(() => assert(null)).toThrow()
      })

      it('should use custom message', () => {
        expect(() => assert(false, 'Custom message')).toThrow('Custom message')
      })
    })

    describe('assertIsString', () => {
      it('should not throw for strings', () => {
        expect(() => assertIsString('hello')).not.toThrow()
        expect(() => assertIsString('')).not.toThrow()
      })

      it('should throw for non-strings', () => {
        expect(() => assertIsString(123)).toThrow('Expected string, got number')
        expect(() => assertIsString(null)).toThrow('Expected string, got object')
      })

      it('should use custom message', () => {
        expect(() => assertIsString(123, 'Custom message')).toThrow('Custom message')
      })
    })

    describe('assertIsNumber', () => {
      it('should not throw for valid numbers', () => {
        expect(() => assertIsNumber(123)).not.toThrow()
        expect(() => assertIsNumber(0)).not.toThrow()
      })

      it('should throw for invalid numbers and non-numbers', () => {
        expect(() => assertIsNumber('123')).toThrow('Expected number, got string')
        expect(() => assertIsNumber(Number.NaN)).toThrow('Expected number, got number')
      })
    })

    describe('assertIsBoolean', () => {
      it('should not throw for booleans', () => {
        expect(() => assertIsBoolean(true)).not.toThrow()
        expect(() => assertIsBoolean(false)).not.toThrow()
      })

      it('should throw for non-booleans', () => {
        expect(() => assertIsBoolean(1)).toThrow('Expected boolean, got number')
      })
    })

    describe('assertIsObject', () => {
      it('should not throw for objects', () => {
        expect(() => assertIsObject({})).not.toThrow()
        expect(() => assertIsObject({ a: 1 })).not.toThrow()
      })

      it('should throw for non-objects', () => {
        expect(() => assertIsObject([])).toThrow('Expected object, got object')
        expect(() => assertIsObject(null)).toThrow('Expected object, got object')
      })
    })

    describe('assertIsArray', () => {
      it('should not throw for arrays', () => {
        expect(() => assertIsArray([])).not.toThrow()
        expect(() => assertIsArray([1, 2, 3])).not.toThrow()
      })

      it('should throw for non-arrays', () => {
        expect(() => assertIsArray({})).toThrow('Expected array, got object')
        expect(() => assertIsArray('array')).toThrow('Expected array, got string')
      })
    })

    describe('assertIsFunction', () => {
      it('should not throw for functions', () => {
        expect(() => assertIsFunction(() => {})).not.toThrow()
        expect(() => assertIsFunction(() => {})).not.toThrow()
      })

      it('should throw for non-functions', () => {
        expect(() => assertIsFunction({})).toThrow('Expected function, got object')
      })
    })

    describe('assertIsNotNullish', () => {
      it('should not throw for non-nullish values', () => {
        expect(() => assertIsNotNullish(0)).not.toThrow()
        expect(() => assertIsNotNullish('')).not.toThrow()
        expect(() => assertIsNotNullish(false)).not.toThrow()
      })

      it('should throw for nullish values', () => {
        expect(() => assertIsNotNullish(null)).toThrow('Expected non-nullish value')
        expect(() => assertIsNotNullish(undefined)).toThrow('Expected non-nullish value')
      })
    })

    describe('assertIsNonEmptyArray', () => {
      it('should not throw for non-empty arrays', () => {
        expect(() => assertIsNonEmptyArray([1])).not.toThrow()
        expect(() => assertIsNonEmptyArray([1, 2, 3])).not.toThrow()
      })

      it('should throw for empty arrays and non-arrays', () => {
        expect(() => assertIsNonEmptyArray([])).toThrow('Expected non-empty array')
        expect(() => assertIsNonEmptyArray({})).toThrow('Expected non-empty array')
      })
    })

    describe('assertIsDate', () => {
      it('should not throw for valid dates', () => {
        expect(() => assertIsDate(new Date())).not.toThrow()
      })

      it('should throw for invalid dates and non-dates', () => {
        expect(() => assertIsDate(new Date('invalid'))).toThrow('Expected Date')
        expect(() => assertIsDate('2023-01-01')).toThrow('Expected Date, got string')
      })
    })

    describe('assertIsError', () => {
      it('should not throw for Error instances', () => {
        expect(() => assertIsError(new Error('test'))).not.toThrow()
        expect(() => assertIsError(new TypeError('test'))).not.toThrow()
      })

      it('should throw for non-errors', () => {
        expect(() => assertIsError('error')).toThrow('Expected Error, got string')
        expect(() => assertIsError({ message: 'error' })).toThrow('Expected Error, got object')
      })
    })
  })

  describe('zod Integration', () => {
    const stringSchema = z.string()
    const numberSchema = z.number()
    const objectSchema = z.object({ name: z.string(), age: z.number() })

    describe('createTypeGuard', () => {
      it('should create working type guard from schema', () => {
        const isStringType = createTypeGuard(stringSchema)
        
        expect(isStringType('hello')).toBe(true)
        expect(isStringType(123)).toBe(false)
        expect(isStringType(null)).toBe(false)
      })

      it('should work with complex schemas', () => {
        const isObjectType = createTypeGuard(objectSchema)
        
        expect(isObjectType({ name: 'John', age: 30 })).toBe(true)
        expect(isObjectType({ name: 'John' })).toBe(false)
        expect(isObjectType({})).toBe(false)
      })
    })

    describe('createAssertion', () => {
      it('should create working assertion from schema', () => {
        const assertIsStringType = createAssertion(stringSchema, 'string')
        
        expect(() => assertIsStringType('hello')).not.toThrow()
        expect(() => assertIsStringType(123)).toThrow('Expected string, validation failed')
      })

      it('should use custom message', () => {
        const assertIsStringType = createAssertion(stringSchema)
        
        expect(() => assertIsStringType(123, 'Custom error')).toThrow('Custom error')
      })
    })

    describe('validateSchema', () => {
      it('should validate and return data for valid input', () => {
        expect(validateSchema(stringSchema, 'hello')).toBe('hello')
        expect(validateSchema(numberSchema, 123)).toBe(123)
      })

      it('should throw for invalid input', () => {
        expect(() => validateSchema(stringSchema, 123)).toThrow()
        expect(() => validateSchema(numberSchema, 'hello')).toThrow()
      })
    })

    describe('safeValidateSchema', () => {
      it('should return data for valid input', () => {
        expect(safeValidateSchema(stringSchema, 'hello')).toBe('hello')
        expect(safeValidateSchema(numberSchema, 123)).toBe(123)
      })

      it('should return null for invalid input', () => {
        expect(safeValidateSchema(stringSchema, 123)).toBe(null)
        expect(safeValidateSchema(numberSchema, 'hello')).toBe(null)
      })
    })

    describe('createSafeTypeGuard', () => {
      it('should return success result for valid input', () => {
        const safeIsString = createSafeTypeGuard(stringSchema)
        
        const result = safeIsString('hello')
        expect(result.success).toBe(true)
        expect(result.data).toBe('hello')
        expect(result.error).toBeUndefined()
      })

      it('should return error result for invalid input', () => {
        const safeIsString = createSafeTypeGuard(stringSchema)
        
        const result = safeIsString(123)
        expect(result.success).toBe(false)
        expect(result.data).toBeUndefined()
        expect(result.error).toBeDefined()
      })
    })

    describe('createValidator', () => {
      it('should create complete validator with all methods', () => {
        const validator = createValidator(stringSchema, 'CustomString')
        
        expect(validator.guard('hello')).toBe(true)
        expect(validator.guard(123)).toBe(false)
        
        expect(() => validator.assert('hello')).not.toThrow()
        expect(() => validator.assert(123)).toThrow()
        
        expect(validator.safe?.('hello').success).toBe(true)
        expect(validator.safe?.(123).success).toBe(false)
        
        expect(validator.schema).toBe(stringSchema)
      })
    })
  })

  describe('commonSchemas', () => {
    describe('nonEmptyString', () => {
      it('should validate non-empty strings', () => {
        const guard = createTypeGuard(CommonSchemas.nonEmptyString)
        
        expect(guard('hello')).toBe(true)
        expect(guard('')).toBe(false)
        expect(guard(123)).toBe(false)
      })
    })

    describe('positiveNumber', () => {
      it('should validate positive numbers', () => {
        const guard = createTypeGuard(CommonSchemas.positiveNumber)
        
        expect(guard(1)).toBe(true)
        expect(guard(0)).toBe(false)
        expect(guard(-1)).toBe(false)
      })
    })

    describe('email', () => {
      it('should validate email addresses', () => {
        const guard = createTypeGuard(CommonSchemas.email)
        
        expect(guard('test@example.com')).toBe(true)
        expect(guard('invalid-email')).toBe(false)
        expect(guard(123)).toBe(false)
      })
    })

    describe('jsonString', () => {
      it('should validate JSON strings', () => {
        const guard = createTypeGuard(CommonSchemas.jsonString)
        
        expect(guard('{"key": "value"}')).toBe(true)
        expect(guard('[1, 2, 3]')).toBe(true)
        expect(guard('"string"')).toBe(true)
        expect(guard('invalid json')).toBe(false)
        expect(guard(123)).toBe(false)
      })
    })

    describe('nonEmptyArray', () => {
      it('should validate non-empty arrays', () => {
        const guard = createTypeGuard(CommonSchemas.nonEmptyArray)
        
        expect(guard([1, 2, 3])).toBe(true)
        expect(guard([1])).toBe(true)
        expect(guard([])).toBe(false)
        expect(guard(123)).toBe(false)
      })
    })
  })

  describe('error Handling', () => {
    describe('createAssertionError', () => {
      it('should create proper AssertionError', () => {
        const error = createAssertionError('Test message')
        
        expect(error).toBeInstanceOf(Error)
        expect(error.name).toBe('AssertionError')
        expect(error.message).toBe('Test message')
      })

      it('should include cause when provided', () => {
        const cause = new Error('Original error')
        const error = createAssertionError('Test message', cause)
        
        expect((error as any).cause).toBe(cause)
      })
    })
  })
})