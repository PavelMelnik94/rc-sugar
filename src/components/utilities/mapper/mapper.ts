import type { z } from 'zod'

export interface MapperConfig<TInput, TOutput> {
  transform: (input: TInput) => TOutput
  schema?: z.ZodSchema<TInput>
  name?: string
  memoize?: boolean
}

export interface Mapper<TInput, TOutput> {
  map: (input: TInput) => TOutput
  mapBatch: (inputs: TInput[]) => TOutput[]
  name: string
  compose: <TNext>(nextMapper: Mapper<TOutput, TNext>) => Mapper<TInput, TNext>
}

export interface ConditionalMapper<TInput, TOutput> {
  map: (input: TInput) => TOutput
  condition: (input: TInput) => boolean
  trueMapper: Mapper<TInput, TOutput>
  falseMapper?: Mapper<TInput, TOutput>
}

const createMemoizedTransform = <TInput, TOutput>(
  transform: (input: TInput) => TOutput
): ((input: TInput) => TOutput) => {
  const cache = new Map<string, TOutput>()
  return (input: TInput): TOutput => {
    const key = JSON.stringify(input)
    if (cache.has(key)) {
      return cache.get(key)!
    }
    const result = transform(input)
    cache.set(key, result)
    return result
  }
}

export const createMapper = <TInput, TOutput>(
  config: MapperConfig<TInput, TOutput>
): Mapper<TInput, TOutput> => {
  const { transform, schema, name = 'AnonymousMapper', memoize = false } = config
  
  const processTransform = memoize ? createMemoizedTransform(transform) : transform
  
  const validateAndTransform = (input: TInput): TOutput => {
    if (schema) {
      try {
        schema.parse(input)
      } catch (error) {
        throw new Error(`Mapper "${name}" validation failed: ${error}`)
      }
    }
    return processTransform(input)
  }
  
  const mapper: Mapper<TInput, TOutput> = {
    map: validateAndTransform,
    
    mapBatch: (inputs: TInput[]): TOutput[] => {
      return inputs.map(validateAndTransform)
    },
    
    name,
    
    compose: <TNext>(nextMapper: Mapper<TOutput, TNext>): Mapper<TInput, TNext> => {
      return createMapper({
        transform: (input: TInput) => nextMapper.map(validateAndTransform(input)),
        name: `${name} → ${nextMapper.name}`,
        memoize
      })
    }
  }
  
  return mapper
}

export const composeMappers = <TInput, TIntermediate, TOutput>(
  firstMapper: Mapper<TInput, TIntermediate>,
  secondMapper: Mapper<TIntermediate, TOutput>
): Mapper<TInput, TOutput> => {
  return firstMapper.compose(secondMapper)
}

export const createConditionalMapper = <TInput, TOutput>(
  condition: (input: TInput) => boolean,
  trueMapper: Mapper<TInput, TOutput>,
  falseMapper?: Mapper<TInput, TOutput>
): ConditionalMapper<TInput, TOutput> => {
  const conditionalTransform = (input: TInput): TOutput => {
    if (condition(input)) {
      return trueMapper.map(input)
    }
    if (falseMapper) {
      return falseMapper.map(input)
    }
    throw new Error('Conditional mapper: condition is false and no fallback mapper provided')
  }
  
  return {
    map: conditionalTransform,
    condition,
    trueMapper,
    falseMapper
  }
}

export const createBatchMapper = <TInput, TOutput>(
  mapper: Mapper<TInput, TOutput>,
  options?: {
    chunkSize?: number
    parallel?: boolean
  }
): {
  map: (inputs: TInput[]) => TOutput[]
  chunkSize: number
  parallel: boolean
  originalMapper: Mapper<TInput, TOutput>
} => {
  const { chunkSize = 1000, parallel = false } = options || {}
  
  const processBatch = (inputs: TInput[]): TOutput[] => {
    if (inputs.length <= chunkSize || !parallel) {
      return mapper.mapBatch(inputs)
    }
    
    const chunks: TInput[][] = []
    for (let i = 0; i < inputs.length; i += chunkSize) {
      chunks.push(inputs.slice(i, i + chunkSize))
    }
    
    return chunks.flatMap(chunk => mapper.mapBatch(chunk))
  }
  
  return {
    map: processBatch,
    chunkSize,
    parallel,
    originalMapper: mapper
  }
}

export const createNormalizerMapper = <TInput extends Record<string, unknown>, TOutput>(
  fieldMappings: Record<keyof TOutput, keyof TInput | ((input: TInput) => unknown)>,
  schema?: z.ZodSchema<TInput>
): Mapper<TInput, TOutput> => {
  const transform = (input: TInput): TOutput => {
    const output = {} as TOutput
    
    for (const [outputKey, mapping] of Object.entries(fieldMappings)) {
      if (typeof mapping === 'function') {
        ;(output as Record<string, unknown>)[outputKey] = mapping(input)
      } else {
        ;(output as Record<string, unknown>)[outputKey] = input[mapping as keyof TInput]
      }
    }
    
    return output
  }
  
  return createMapper({
    transform,
    schema,
    name: 'NormalizerMapper'
  })
}

export const identity = <T>(): Mapper<T, T> => {
  return createMapper({
    transform: (input: T) => input,
    name: 'IdentityMapper'
  })
}

export const pipe = <TInput, TOutput>(
  ...mappers: Mapper<unknown, unknown>[]
): Mapper<TInput, TOutput> => {
  if (mappers.length === 0) {
    throw new Error('pipe requires at least one mapper')
  }
  
  if (mappers.length === 1) {
    return mappers[0] as Mapper<TInput, TOutput>
  }
  
  return mappers.reduce((acc, mapper) => acc.compose(mapper)) as Mapper<TInput, TOutput>
}