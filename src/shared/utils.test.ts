import {
  clamp,
  debounce,
  generateId,
  isBrowser,
  isEmpty,
  isNotNullish,
  isNullish,
  safeGet,
  throttle,
} from './utils'

describe('utils', () => {
  describe('isNullish', () => {
    it('should return true for null', () => {
      expect(isNullish(null)).toBe(true)
    })

    it('should return true for undefined', () => {
      expect(isNullish(undefined)).toBe(true)
    })

    it('should return false for falsy values that are not null/undefined', () => {
      expect(isNullish(0)).toBe(false)
      expect(isNullish('')).toBe(false)
      expect(isNullish(false)).toBe(false)
      expect(isNullish([])).toBe(false)
      expect(isNullish({})).toBe(false)
    })

    it('should return false for truthy values', () => {
      expect(isNullish(1)).toBe(false)
      expect(isNullish('hello')).toBe(false)
      expect(isNullish(true)).toBe(false)
      expect(isNullish([1, 2, 3])).toBe(false)
      expect(isNullish({ a: 1 })).toBe(false)
    })
  })

  describe('isNotNullish', () => {
    it('should return false for null', () => {
      expect(isNotNullish(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isNotNullish(undefined)).toBe(false)
    })

    it('should return true for falsy values that are not null/undefined', () => {
      expect(isNotNullish(0)).toBe(true)
      expect(isNotNullish('')).toBe(true)
      expect(isNotNullish(false)).toBe(true)
      expect(isNotNullish([])).toBe(true)
      expect(isNotNullish({})).toBe(true)
    })

    it('should return true for truthy values', () => {
      expect(isNotNullish(1)).toBe(true)
      expect(isNotNullish('hello')).toBe(true)
      expect(isNotNullish(true)).toBe(true)
      expect(isNotNullish([1, 2, 3])).toBe(true)
      expect(isNotNullish({ a: 1 })).toBe(true)
    })
  })

  describe('isEmpty', () => {
    it('should return true for null and undefined', () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
    })

    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true)
    })

    it('should return false for non-empty string', () => {
      expect(isEmpty('hello')).toBe(false)
      expect(isEmpty(' ')).toBe(false)
    })

    it('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true)
    })

    it('should return false for non-empty array', () => {
      expect(isEmpty([1])).toBe(false)
      expect(isEmpty([1, 2, 3])).toBe(false)
    })

    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true)
    })

    it('should return false for non-empty object', () => {
      expect(isEmpty({ a: 1 })).toBe(false)
    })

    it('should return false for numbers', () => {
      expect(isEmpty(0)).toBe(false)
      expect(isEmpty(1)).toBe(false)
      expect(isEmpty(-1)).toBe(false)
    })

    it('should return false for booleans', () => {
      expect(isEmpty(true)).toBe(false)
      expect(isEmpty(false)).toBe(false)
    })
  })

  describe('safeGet', () => {
    it('should return property value when it exists', () => {
      const obj = { a: 1, b: 'hello', c: true }
      expect(safeGet(obj, 'a')).toBe(1)
      expect(safeGet(obj, 'b')).toBe('hello')
      expect(safeGet(obj, 'c')).toBe(true)
    })

    it('should return undefined for non-existent property', () => {
      const obj = { a: 1 }
      expect(safeGet(obj, 'b' as any)).toBe(undefined)
    })

    it('should return undefined when accessing property on null/undefined', () => {
      expect(safeGet(null as any, 'a' as any)).toBe(undefined)
      expect(safeGet(undefined as any, 'a' as any)).toBe(undefined)
    })

    it('should handle nested objects', () => {
      const obj = { a: { b: { c: 'deep' } } }
      expect(safeGet(obj, 'a')).toEqual({ b: { c: 'deep' } })
    })

    it('should handle getter that throws an error', () => {
      const obj = {
        get error() {
          throw new Error('Getter error')
        },
      }
      expect(safeGet(obj, 'error')).toBe(undefined)
    })
  })

  describe('clamp', () => {
    it('should return value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(0, 0, 10)).toBe(0)
      expect(clamp(10, 0, 10)).toBe(10)
    })

    it('should return min when value is below min', () => {
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(-100, -50, 50)).toBe(-50)
    })

    it('should return max when value is above max', () => {
      expect(clamp(15, 0, 10)).toBe(10)
      expect(clamp(100, -50, 50)).toBe(50)
    })

    it('should handle negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5)
      expect(clamp(-15, -10, -1)).toBe(-10)
      expect(clamp(0, -10, -1)).toBe(-1)
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should delay function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(99)
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should reset timer on multiple calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      jest.advanceTimersByTime(50)
      debouncedFn()
      jest.advanceTimersByTime(50)
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(50)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments correctly', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1', 'arg2')
      jest.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should execute function immediately on first call', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should throttle subsequent calls', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(100)
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    it('should pass arguments correctly', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn('arg1', 'arg2')
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('should use default prefix', () => {
      const id = generateId()
      expect(id).toMatch(/^ui-magic-/)
    })

    it('should use custom prefix', () => {
      const id = generateId('custom')
      expect(id).toMatch(/^custom-/)
    })

    it('should generate IDs with correct format', () => {
      const id = generateId()
      expect(id).toMatch(/^ui-magic-[a-z0-9]{9}$/)
    })
  })

  describe('isBrowser', () => {
    it('should return true in browser environment', () => {
      // В тестовой среде window определен через jsdom
      expect(isBrowser()).toBe(true)
    })

    it('should return false when window is undefined', () => {
      const originalWindow = globalThis.window
      // @ts-expect-error - Intentionally deleting window for testing
      delete globalThis.window

      expect(isBrowser()).toBe(false)

      // Восстанавливаем window
      globalThis.window = originalWindow
    })
  })
})
