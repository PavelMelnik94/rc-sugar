# Experiment Component

A powerful A/B testing and feature flagging component for React applications with weighted variant distribution, reproducible randomization, and comprehensive analytics integration.

## Description

The `Experiment` component provides a sophisticated solution for A/B testing and feature experimentation. It handles variant selection based on configurable weights, ensures consistent user experiences with seed-based randomization, and integrates seamlessly with analytics platforms for experiment tracking.

## When to Use
- 🧪 **A/B Testing**: Test different UI designs, content, or functionality
- 🎯 **Feature Flagging**: Gradually roll out new features to user segments
- 📊 **Multivariate Testing**: Test multiple variants with different weights
- 🎲 **Randomized Experiences**: Provide different experiences to users
- 🔄 **Iterative Improvements**: Test improvements against current implementations
- 📈 **Conversion Optimization**: Optimize user flows and interfaces
- 🚀 **Feature Rollouts**: Safely deploy features to percentage of users

## Patterns Used
- **Weighted Distribution**: Configurable weights for variant selection
- **Deterministic Randomization**: Consistent experiences using seed values
- **Render Props Pattern**: Flexible content rendering with variant information
- **Analytics Integration**: Built-in tracking for experiment participation
- **Type Safety**: Full TypeScript support with proper variant typing
- **Resource Management**: Optimized variant selection with memoization

## TypeScript Types
```typescript
import { ReactNode } from 'react';
import { RenderProp } from '../shared/types';

/**
 * Variant definition for A/B testing
 */
interface ExperimentVariant {
  /** Variant name/identifier */
  name: string;

  /** Weight for this variant (0-100) */
  weight: number;

  /** Content to render for this variant */
  content: ReactNode | RenderProp<string>;
}

/**
 * Props for the Experiment component
 */
interface ExperimentProps {
  /** Unique experiment identifier */
  id: string;

  /** Array of variants to test */
  variants: ExperimentVariant[];

  /** Seed for reproducible randomization (e.g., user ID) */
  seed?: string | number;

  /** Callback when a variant is selected */
  onVariantSelected?: (variantName: string) => void;
}

/** Render prop type */
type RenderProp<T> = (data: T) => React.ReactNode;
```

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | **Required.** Unique identifier for the experiment |
| `variants` | `ExperimentVariant[]` | - | **Required.** Array of variants with weights and content |
| `seed` | `string \| number` | `undefined` | Seed for consistent randomization (e.g., user ID) |
| `onVariantSelected` | `(variantName: string) => void` | `undefined` | Callback fired when variant is selected |

### ExperimentVariant Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Unique variant identifier |
| `weight` | `number` | Relative weight (0-100) for selection probability |
| `content` | `ReactNode \| RenderProp<string>` | Content to render or render function |

## Examples

### Basic A/B Test
```tsx
import { Experiment } from 'react-utility-kit';

function LoginButton() {
  return (
    <Experiment
      id="login-button-test"
      variants={[
        {
          name: 'control',
          weight: 50,
          content: <button className="btn-primary">Sign In</button>
        },
        {
          name: 'treatment',
          weight: 50,
          content: <button className="btn-gradient">Join Now</button>
        }
      ]}
      seed={userId}
      onVariantSelected={(variant) => {
        analytics.track('experiment_viewed', {
          experimentId: 'login-button-test',
          variant
        });
      }}
    />
  );
}
```

### Error Handling and Validation
```tsx
import { Experiment } from 'ui-magic-core';

function SafeExperiment() {
  // The component automatically validates variants and handles errors
  return (
    <Experiment
      id="safe-test"
      variants={[
        {
          name: 'variant-a',
          weight: 60,
          content: <div>Variant A Content</div>
        },
        {
          name: 'variant-b', 
          weight: 40,
          content: <div>Variant B Content</div>
        }
      ]}
      seed={userId}
      onVariantSelected={(variant) => {
        // This will only be called if validation passes
        console.log('Selected variant:', variant);
      }}
    />
  );
}

// Invalid configurations will log errors and render nothing:
// - Empty variants array
// - Duplicate variant names
// - Invalid weights (negative numbers)
// - Zero total weight
```

### Multivariate Testing with Different Weights
```tsx
import { Experiment } from 'ui-magic-core';

function PricingDisplay({ product }) {
  return (
    <Experiment
      id="pricing-display-test"
      variants={[
        {
          name: 'control',
          weight: 40,
          content: (
            <div className="price-simple">
              <span>
$
{product.price}
              </span>
            </div>
          )
        },
        {
          name: 'with-discount',
          weight: 30,
          content: (
            <div className="price-discount">
              <span className="original">
$
{product.originalPrice}
              </span>
              <span className="sale">
$
{product.price}
              </span>
              <span className="badge">SALE</span>
            </div>
          )
        },
        {
          name: 'urgency',
          weight: 30,
          content: (
            <div className="price-urgency">
              <span>
$
{product.price}
              </span>
              <div className="timer">⏰ Limited time offer!</div>
            </div>
          )
        }
      ]}
      seed={`${userId}-${product.id}`}
      onVariantSelected={(variant) => {
        analytics.track('pricing_variant_shown', {
          productId: product.id,
          variant,
          price: product.price
        });
      }}
    />
  );
}
```

### Feature Flag with Gradual Rollout
```tsx
import { Experiment } from 'ui-magic-core';

function NavigationMenu() {
  return (
    <Experiment
      id="new-navigation"
      variants={[
        {
          name: 'old-nav',
          weight: 80,
          content: <LegacyNavigation />
        },
        {
          name: 'new-nav',
          weight: 20,
          content: <NewNavigation />
        }
      ]}
      seed={userId}
      onVariantSelected={(variant) => {
        if (variant === 'new-nav') {
          analytics.track('feature_flag_enabled', {
            feature: 'new-navigation',
            userId
          });
        }
      }}
    />
  );
}
```

### Render Props Pattern
```tsx
import { Experiment } from 'ui-magic-core';

function CheckoutFlow() {
  return (
    <Experiment
      id="checkout-flow-test"
      variants={[
        {
          name: 'single-page',
          weight: 50,
          content: variant => (
            <div data-variant={variant}>
              <SinglePageCheckout />
            </div>
          )
        },
        {
          name: 'multi-step',
          weight: 50,
          content: variant => (
            <div data-variant={variant}>
              <MultiStepCheckout />
            </div>
          )
        }
      ]}
      seed={sessionId}
      onVariantSelected={(variant) => {
        analytics.track('checkout_experiment', {
          variant,
          sessionId,
          timestamp: Date.now()
        });
      }}
    />
  );
}
```

### E-commerce Product Recommendations
```tsx
import { Experiment } from 'react-utility-kit';

function ProductRecommendations({ userId, currentProduct }) {
  return (
    <Experiment
      id="recommendation-algorithm"
      variants={[
        {
          name: 'collaborative',
          weight: 25,
          content: <CollaborativeRecommendations userId={userId} />
        },
        {
          name: 'content-based',
          weight: 25,
          content: <ContentBasedRecommendations product={currentProduct} />
        },
        {
          name: 'hybrid',
          weight: 30,
          content: <HybridRecommendations userId={userId} product={currentProduct} />
        },
        {
          name: 'trending',
          weight: 20,
          content: <TrendingRecommendations />
        }
      ]}
      seed={userId}
      onVariantSelected={(variant) => {
        analytics.track('recommendation_algorithm_assigned', {
          algorithm: variant,
          userId,
          productId: currentProduct.id
        });
      }}
    />
  );
}
```

### Landing Page Hero Section
```tsx
import { Experiment } from 'react-utility-kit';

function HeroSection() {
  return (
    <Experiment
      id="hero-message-test"
      variants={[
        {
          name: 'benefit-focused',
          weight: 33,
          content: (
            <div className="hero-benefits">
              <h1>Save Time and Money</h1>
              <p>Our platform helps you achieve more with less effort</p>
              <button>Start Saving Now</button>
            </div>
          )
        },
        {
          name: 'feature-focused',
          weight: 33,
          content: (
            <div className="hero-features">
              <h1>Powerful Tools for Everyone</h1>
              <p>Advanced features made simple and accessible</p>
              <button>Explore Features</button>
            </div>
          )
        },
        {
          name: 'social-proof',
          weight: 34,
          content: (
            <div className="hero-social">
              <h1>Join 10,000+ Happy Users</h1>
              <p>See why teams worldwide choose our platform</p>
              <button>Join the Community</button>
            </div>
          )
        }
      ]}
      seed={visitorId}
      onVariantSelected={(variant) => {
        analytics.track('hero_variant_shown', {
          variant,
          visitorId,
          page: 'landing'
        });
      }}
    />
  );
}
```

### Mobile vs Desktop Experiences
```tsx
import { Experiment } from 'ui-magic-core';

function ResponsiveFeature() {
  const isMobile = window.innerWidth < 768;

  return (
    <Experiment
      id="mobile-feature-test"
      variants={[
        {
          name: 'simplified',
          weight: isMobile ? 60 : 30,
          content: <SimplifiedInterface />
        },
        {
          name: 'full-featured',
          weight: isMobile ? 40 : 70,
          content: <FullFeaturedInterface />
        }
      ]}
      seed={`${userId}-${isMobile ? 'mobile' : 'desktop'}`}
      onVariantSelected={(variant) => {
        analytics.track('responsive_experiment', {
          variant,
          deviceType: isMobile ? 'mobile' : 'desktop',
          userId
        });
      }}
    />
  );
}
```

## Performance Considerations

### 🚀 **Optimizations**
- **Memoized Selection**: Variant selection is memoized to prevent recalculation
- **Deterministic Randomization**: Consistent results when using seeds
- **Lightweight Hash Function**: Fast hash computation for seed-based selection
- **Minimal Re-renders**: Optimized to avoid unnecessary component updates

### ⚠️ **Considerations**
- **Initial Render**: Variant selection happens during initial render
- **Seed Consistency**: Changing seed will result in different variant selection
- **Weight Distribution**: Ensure weights add up to reasonable totals

```tsx
// Good: Consistent seed for user experience
<Experiment
  id="test"
  seed={userId} // Consistent across sessions
  variants={variants}
/>;

// Good: Reasonable weight distribution
const variants = [
  { name: 'A', weight: 50, content: <ComponentA /> },
  { name: 'B', weight: 50, content: <ComponentB /> }
];

// Avoid: Changing seeds
<Experiment
  id="test"
  seed={Math.random()} // Different every render!
  variants={variants}
/>;
```

## Best Practices

### ✅ **Recommended**
- Use consistent seeds (user ID, session ID) for stable experiences
- Implement proper analytics tracking in `onVariantSelected`
- Keep experiment IDs descriptive and unique
- Test variant weights with adequate sample sizes
- Plan for statistical significance in experiment duration
- Document experiment hypotheses and success metrics

### ❌ **Avoid**
- Changing experiment IDs during active tests
- Using random seeds that change on every render
- Running too many concurrent experiments without proper analysis
- Ignoring statistical significance in results
- Testing without clear success metrics

## Migration Guide

### From Manual A/B Testing
```tsx
// Before: Manual A/B testing logic
function FeatureToggle() {
  const [variant, setVariant] = useState();

  useEffect(() => {
    const random = Math.random();
    setVariant(random < 0.5 ? 'A' : 'B');

    analytics.track('ab_test', { variant });
  }, []);

  return variant === 'A' ? <ComponentA /> : <ComponentB />;
}

// After: Using Experiment component
function FeatureToggle() {
  return (
    <Experiment
      id="feature-test"
      variants={[
        { name: 'A', weight: 50, content: <ComponentA /> },
        { name: 'B', weight: 50, content: <ComponentB /> }
      ]}
      seed={userId}
      onVariantSelected={(variant) => {
        analytics.track('ab_test', { variant });
      }}
    />
  );
}
```

### From Feature Flags
```tsx
// Before: Simple feature flags
function ConditionalFeature() {
  const showNewFeature = featureFlags.includes('new-feature');

  return showNewFeature ? <NewFeature /> : <OldFeature />;
}

// After: Gradual rollout with experiments
function ConditionalFeature() {
  return (
    <Experiment
      id="new-feature-rollout"
      variants={[
        { name: 'old', weight: 80, content: <OldFeature /> },
        { name: 'new', weight: 20, content: <NewFeature /> }
      ]}
      seed={userId}
      onVariantSelected={(variant) => {
        if (variant === 'new') {
          analytics.track('new_feature_shown', { userId });
        }
      }}
    />
  );
}
```

## Related Components

- **[`gate`](../gate/README.md)** - Audience targeting and conditional rendering
- **[`track`](../track/README.md)** - Analytics tracking and event management
- **[`switch`](../switch/README.md)** - Conditional rendering with multiple cases

## Accessibility

The `Experiment` component is accessibility-neutral as it doesn't render UI elements directly. However, ensure that all variants maintain consistent accessibility standards:

### Consistent Experience
- Maintain similar interaction patterns across variants
- Ensure all variants meet WCAG guidelines
- Test variants with assistive technologies

```tsx
<Experiment
  id="button-test"
  variants={[
    {
      name: 'control',
      weight: 50,
      content: (
        <button aria-label="Sign in to your account">
          Sign In
        </button>
      )
    },
    {
      name: 'treatment',
      weight: 50,
      content: (
        <button aria-label="Join our platform today">
          Join Now
        </button>
      )
    }
  ]}
/>;
```

## Analytics Integration

### Experiment Tracking
```tsx
function ExperimentWithAnalytics() {
  return (
    <Experiment
      id="conversion-test"
      variants={variants}
      seed={userId}
      onVariantSelected={(variant) => {
        // Track experiment participation
        analytics.track('experiment_participated', {
          experimentId: 'conversion-test',
          variant,
          userId,
          timestamp: Date.now()
        });

        // Update user properties
        analytics.setUserProperties({
          [`experiment_conversion_test`]: variant
        });
      }}
    />
  );
}
```

### Conversion Tracking
```tsx
function ExperimentWithConversion() {
  const handleConversion = (variant) => {
    analytics.track('experiment_conversion', {
      experimentId: 'checkout-flow',
      variant,
      conversionType: 'purchase',
      value: cartTotal
    });
  };

  return (
    <Experiment
      id="checkout-flow"
      variants={variants}
      seed={userId}
      onVariantSelected={(variant) => {
        // Store variant for later conversion tracking
        window.currentExperimentVariant = variant;
      }}
    />
  );
}
```
