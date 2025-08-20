import { z } from 'zod'
import {
  composeMappers,
  createBatchMapper,
  createConditionalMapper,
  createMapper,
  createNormalizerMapper,
  identity,
  pipe
} from './mapper'

describe('createMapper', () => {
  it('creates a basic mapper', () => {
    const doubleMapper = createMapper({
      transform: (x: number) => x * 2
    })
    
    expect(doubleMapper.map(5)).toBe(10)
    expect(doubleMapper.name).toBe('AnonymousMapper')
  })
  
  it('creates mapper with custom name', () => {
    const mapper = createMapper({
      transform: (x: number) => x * 2,
      name: 'DoubleMapper'
    })
    
    expect(mapper.name).toBe('DoubleMapper')
  })
  
  it('validates input with Zod schema', () => {
    const schema = z.object({ value: z.number() })
    const mapper = createMapper({
      schema,
      transform: (input: { value: number }) => input.value * 2,
      name: 'ValidatedMapper'
    })
    
    expect(mapper.map({ value: 5 })).toBe(10)
    
    expect(() => mapper.map({ value: 'invalid' } as any)).toThrow(/validation failed/)
  })
  
  it('processes batch of inputs', () => {
    const mapper = createMapper({
      transform: (x: number) => x * 2
    })
    
    const result = mapper.mapBatch([1, 2, 3, 4])
    expect(result).toEqual([2, 4, 6, 8])
  })
  
  it('supports memoization', () => {
    let callCount = 0
    const mapper = createMapper({
      transform: (x: number) => {
        callCount++
        return x * 2
      },
      memoize: true
    })
    
    expect(mapper.map(5)).toBe(10)
    expect(mapper.map(5)).toBe(10)
    expect(callCount).toBe(1)
  })
})

describe('mapper composition', () => {
  it('composes mappers using compose method', () => {
    const doubleMapper = createMapper({
      transform: (x: number) => x * 2,
      name: 'Double'
    })
    
    const addTenMapper = createMapper({
      transform: (x: number) => x + 10,
      name: 'AddTen'
    })
    
    const composedMapper = doubleMapper.compose(addTenMapper)
    
    expect(composedMapper.map(5)).toBe(20)
    expect(composedMapper.name).toBe('Double → AddTen')
  })
  
  it('composes mappers using composeMappers function', () => {
    const doubleMapper = createMapper({
      transform: (x: number) => x * 2
    })
    
    const stringMapper = createMapper({
      transform: (x: number) => `Value: ${x}`
    })
    
    const composed = composeMappers(doubleMapper, stringMapper)
    expect(composed.map(5)).toBe('Value: 10')
  })
  
  it('composes multiple mappers with pipe', () => {
    const double = createMapper({ 
      transform: (x: number) => x * 2,
      name: 'Double'
    })
    const addTen = createMapper({ 
      transform: (x: number) => x + 10,
      name: 'AddTen'
    })
    const toString = createMapper({ 
      transform: (x: number) => x.toString(),
      name: 'ToString'
    })
    
    const piped = pipe(double, addTen, toString)
    expect(piped.map(5)).toBe('20')
  })
})

describe('createConditionalMapper', () => {
  it('applies true mapper when condition is met', () => {
    const positiveMapper = createMapper({
      transform: (x: number) => x * 2,
      name: 'Positive'
    })
    
    const negativeMapper = createMapper({
      transform: (x: number) => Math.abs(x),
      name: 'Negative'
    })
    
    const conditionalMapper = createConditionalMapper(
      (x: number) => x > 0,
      positiveMapper,
      negativeMapper
    )
    
    expect(conditionalMapper.map(5)).toBe(10)
    expect(conditionalMapper.map(-5)).toBe(5)
  })
  
  it('throws error when condition is false and no fallback', () => {
    const mapper = createMapper({
      transform: (x: number) => x * 2
    })
    
    const conditional = createConditionalMapper(
      (x: number) => x > 0,
      mapper
    )
    
    expect(() => conditional.map(-5)).toThrow(/no fallback mapper/)
  })
})

describe('createBatchMapper', () => {
  it('processes batch with default settings', () => {
    const mapper = createMapper({
      transform: (x: number) => x * 2
    })
    
    const batchMapper = createBatchMapper(mapper)
    const result = batchMapper.map([1, 2, 3, 4])
    
    expect(result).toEqual([2, 4, 6, 8])
  })
  
  it('handles large batches with chunking', () => {
    const mapper = createMapper({
      transform: (x: number) => x * 2
    })
    
    const batchMapper = createBatchMapper(mapper, {
      chunkSize: 2,
      parallel: true
    })
    
    const result = batchMapper.map([1, 2, 3, 4, 5])
    expect(result).toEqual([2, 4, 6, 8, 10])
  })
})

describe('createNormalizerMapper', () => {
  it('normalizes object fields', () => {
    interface Input {
      firstName: string
      lastName: string
      age: number
    }
    
    interface Output {
      name: string
      fullAge: number
      isAdult: boolean
    }
    
    const normalizer = createNormalizerMapper<Input, Output>({
      name: (input) => `${input.firstName} ${input.lastName}`,
      fullAge: 'age',
      isAdult: (input) => input.age >= 18
    })
    
    const result = normalizer.map({
      firstName: 'John',
      lastName: 'Doe',
      age: 25
    })
    
    expect(result).toEqual({
      name: 'John Doe',
      fullAge: 25,
      isAdult: true
    })
  })
  
  it('validates input with schema', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number()
    })
    
    const normalizer = createNormalizerMapper<
      { name: string; age: number },
      { displayName: string }
    >({
      displayName: 'name'
    }, schema)
    
    expect(() => normalizer.map({ name: 123, age: 'invalid' } as any))
      .toThrow(/validation failed/)
  })
})

describe('identity mapper', () => {
  it('returns input unchanged', () => {
    const identityMapper = identity<string>()
    
    expect(identityMapper.map('test')).toBe('test')
    expect(identityMapper.name).toBe('IdentityMapper')
  })
})

describe('pipe function', () => {
  it('throws error with empty mappers', () => {
    expect(() => pipe()).toThrow(/requires at least one mapper/)
  })
  
  it('returns single mapper as-is', () => {
    const mapper = createMapper({
      transform: (x: number) => x * 2
    })
    
    const piped = pipe(mapper)
    expect(piped).toBe(mapper)
  })
})

describe('error handling', () => {
  it('provides meaningful error messages for validation failures', () => {
    const schema = z.object({ value: z.number().positive() })
    const mapper = createMapper({
      schema,
      transform: (input: { value: number }) => input.value,
      name: 'PositiveValueMapper'
    })
    
    expect(() => mapper.map({ value: -1 }))
      .toThrow(/PositiveValueMapper.*validation failed/)
  })
})

describe('performance and optimization', () => {
  it('memoizes expensive transformations', () => {
    let computeCount = 0
    
    const expensiveMapper = createMapper({
      transform: (x: number) => {
        computeCount++
        return Array.from({ length: x }, (_, i) => i).reduce((sum, i) => sum + i, 0)
      },
      memoize: true
    })
    
    const result1 = expensiveMapper.map(1000)
    const result2 = expensiveMapper.map(1000)
    
    expect(result1).toBe(result2)
    expect(computeCount).toBe(1)
  })
})