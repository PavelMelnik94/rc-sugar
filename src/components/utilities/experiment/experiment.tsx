import type { ReactNode } from 'react'
import type { RenderProp } from '../../../shared/types'
import { useMemo } from 'react'

export interface ExperimentVariant {
  /**
   * Variant name/identifier
   */
  name: string
  /**
   * Weight for this variant (0-100)
   */
  weight: number
  /**
   * Content to render for this variant
   */
  content: ReactNode | RenderProp<string>
}


export interface ExperimentProps {
  /**
   * Unique experiment identifier
   */
  id: string
  /**
   * Array of variants to test
   */
  variants: ExperimentVariant[]
  /**
   * Seed for reproducible randomization (e.g., user ID)
   * If not provided, will be random on each render
   */
  seed?: string | number
  /**
   * Callback when a variant is selected
   */
  onVariantSelected?: (variantName: string) => void
}

/**
 * Simple hash function for consistent randomization
 */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}


function validateVariants(variants: ExperimentVariant[]): void {
  if (variants.length === 0) {
    throw new Error('Experiment must have at least one variant')
  }

  const names = new Set<string>()
  for (const variant of variants) {
    if (!variant.name || typeof variant.name !== 'string') {
      throw new Error('Each variant must have a valid name')
    }
    if (names.has(variant.name)) {
      throw new Error(`Duplicate variant name: ${variant.name}`)
    }
    names.add(variant.name)

    if (typeof variant.weight !== 'number' || variant.weight < 0) {
      throw new Error(`Invalid weight for variant ${variant.name}: must be a non-negative number`)
    }
  }

  const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0)
  if (totalWeight === 0) {
    throw new Error('Total weight of all variants must be greater than 0')
  }
}

/**
 * Experiment component - A/B testing for React components
 *
 * @example
 * ```tsx
 * <Experiment
 *   id="button-test"
 *   variants={[
 *     { name: 'A', weight: 50, content: <ButtonA>Old Design</ButtonA> },
 *     { name: 'B', weight: 50, content: <ButtonB>New Design</ButtonB> }
 *   ]}
 *   seed={user.id}
 *   onVariantSelected={(variant) => {
 *     analytics.track('experiment_variant', { variant });
 *   }}
 * />
 * ```
 */
export function Experiment({ id, variants, seed, onVariantSelected }: ExperimentProps): ReactNode {
  const selectedVariant = useMemo(() => {
    try {
      validateVariants(variants)
    } catch (error) {
      console.error(`Experiment "${id}" validation failed:`, error)
      return null
    }

    if (variants.length === 1) {
      const variant = variants[0]
      onVariantSelected?.(variant.name)
      return variant
    }

    const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0)
    const normalizedWeights = variants.map((v) => v.weight / totalWeight)

    const random =
      seed !== undefined ? (simpleHash(`${id}-${String(seed)}`) % 10000) / 10000 : Math.random()

    let cumulativeWeight = 0
    for (let i = 0; i < variants.length; i++) {
      cumulativeWeight += normalizedWeights[i]
      if (random <= cumulativeWeight) {
        const variant = variants[i]
        onVariantSelected?.(variant.name)
        return variant
      }
    }

    const fallbackVariant = variants[variants.length - 1]
    onVariantSelected?.(fallbackVariant.name)
    return fallbackVariant
  }, [id, variants, seed, onVariantSelected])

  if (!selectedVariant) {
    return null
  }

  const content = selectedVariant.content

  if (typeof content === 'function') {
    return <>{content(selectedVariant.name)}</>
  }

  return <>{content}</>
}

Experiment.displayName = 'Experiment'
