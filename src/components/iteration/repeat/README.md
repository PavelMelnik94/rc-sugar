# Repeat Component

A declarative utility for repeating content a specified number of times with index-based rendering.

## Description

The `Repeat` component provides an elegant, declarative way to render content multiple times. Unlike traditional array mapping, it doesn't require an actual data array and is perfect for generating fixed-count elements like skeletons, placeholders, loading states, or repeated UI patterns.

## When to Use

### Perfect For
- **Skeleton Loaders**: Generate placeholder content while data loads
- **Loading States**: Repeated loading indicators or spinners
- **Fixed-Length Lists**: UI patterns with known count
- **Placeholder Content**: Empty state placeholders
- **Grid Layouts**: Consistent grid patterns
- **Pagination Controls**: Page number buttons
- **Star Ratings**: Rating display with fixed stars
- **Progress Indicators**: Step-by-step progress bars

### Avoid When
- Working with dynamic data arrays (use regular `.map()`)
- Content varies significantly between iterations
- Need complex iteration control (break, continue)

## Patterns Used
- **Iteration Pattern**: Clean, declarative repetition
- **Render Props Pattern**: Index-based content generation
- **Immutable Arrays**: Uses `Array.from()` for clean iteration
- **Zero-Impact Pattern**: Returns `null` for invalid inputs

## TypeScript Interface

```typescript
/**
 * Props for the Repeat component
 */
interface RepeatProps {
  /**
   * Number of times to repeat the content
   * @minimum 0
   */
  times: number;

  /**
   * Render function that receives the current iteration index
   * @param index - Zero-based index of current iteration (0 to times-1)
   * @returns React node to render for this iteration
   */
  children: (index: number) => React.ReactNode;
}
```

## API Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `times` | `number` | ✅ | Number of repetitions (0 or negative returns null) |
| `children` | `(index: number) => ReactNode` | ✅ | Render function receiving zero-based index |

## Examples

### Skeleton Loaders
```tsx
import { Repeat } from 'react-utility-kit';

// Article list skeleton
function ArticleSkeleton() {
  return (
    <div className="space-y-4">
      <Repeat times={5}>
        {index => (
          <div key={index} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        )}
      </Repeat>
    </div>
  );
}

// Card grid skeleton
function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Repeat times={9}>
        {index => (
          <div key={index} className="bg-gray-100 rounded-lg h-48 animate-pulse">
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        )}
      </Repeat>
    </div>
  );
}
```

### Star Rating System
```tsx
interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  return (
    <div className="flex space-x-1">
      <Repeat times={maxStars}>
        {index => (
          <Star
            key={index}
            filled={index < rating}
            className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        )}
      </Repeat>
    </div>
  );
}
```

### Pagination Controls
```tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav className="flex space-x-2">
      <Repeat times={totalPages}>
        {(index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={index}
              onClick={() => onPageChange(pageNumber)}
              className={`px-3 py-1 rounded ${
                pageNumber === currentPage
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pageNumber}
            </button>
          );
        }}
      </Repeat>
    </nav>
  );
}
```

### Loading Dots Animation
```tsx
function LoadingDots() {
  return (
    <div className="flex space-x-1">
      <Repeat times={3}>
        {index => (
          <div
            key={index}
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: `${index * 0.2}s` }}
          />
        )}
      </Repeat>
    </div>
  );
}
```

### Progress Steps
```tsx
interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

function ProgressSteps({ currentStep, totalSteps, stepLabels }: ProgressStepsProps) {
  return (
    <div className="flex items-center">
      <Repeat times={totalSteps}>
        {(index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                {stepLabels?.[index] && (
                  <span className="text-xs mt-1">{stepLabels[index]}</span>
                )}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        }}
      </Repeat>
    </div>
  );
}
```

### Table Row Placeholders
```tsx
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <table className="w-full">
      <tbody>
        <Repeat times={rows}>
          {rowIndex => (
            <tr key={rowIndex}>
              <Repeat times={columns}>
                {colIndex => (
                  <td key={colIndex} className="p-2">
                    <div
                      className="h-4 bg-gray-200 rounded animate-pulse"
                      style={{ width: `${60 + (colIndex * 20)}%` }}
                    />
                  </td>
                )}
              </Repeat>
            </tr>
          )}
        </Repeat>
      </tbody>
    </table>
  );
}
```

## Performance Considerations

### Optimization Strategies
```typescript
// Memoize when props change frequently
const MemoizedRepeat = React.memo(({ times, children }: RepeatProps) => (
  <Repeat times={times}>{children}</Repeat>
));

// Use stable keys for better reconciliation
<Repeat times={count}>
  {(index) => (
    <Item key={`item-${index}`} index={index} />
  )}
</Repeat>

// Consider virtualization for large counts
const LARGE_COUNT_THRESHOLD = 100;

function OptimizedRepeat({ times, children }: RepeatProps) {
  if (times > LARGE_COUNT_THRESHOLD) {
    // Consider using react-window or react-virtualized
    console.warn('Large repeat count detected. Consider virtualization.');
  }

  return <Repeat times={times}>{children}</Repeat>;
}
```

### Memory Management
- **Small Counts**: No special considerations needed
- **Large Counts (>100)**: Consider virtualization libraries
- **Dynamic Counts**: Prefer `useMemo` for expensive child functions

## Best Practices

### Do ✅
```typescript
// Provide stable keys
<Repeat times={5}>
  {(index) => <Card key={index} data={data[index]} />}
</Repeat>

// Use for fixed, known counts
<Repeat times={RATING_MAX_STARS}>
  {(index) => <Star key={index} filled={index < rating} />}
</Repeat>

// Memoize expensive child components
const ExpensiveItem = React.memo(({ index }: { index: number }) => (
  <div>Heavy computation for {index}</div>
));
```

### Don't ❌
```typescript
// Don't use for dynamic data
// Instead: data.map((item, index) => ...)
<Repeat times={dynamicData.length}>
  {(index) => <Item data={dynamicData[index]} />}
</Repeat>

// Don't forget keys
<Repeat times={5}>
  {(index) => <div>No key!</div>}
</Repeat>

// Don't use for complex iteration logic
<Repeat times={10}>
  {(index) => index % 2 === 0 && <div>Even only</div>}
</Repeat>
```

## Migration Guide

### From Manual Array Creation
```typescript
// Before: Manual array creation
{Array(5).fill(null).map((_, index) => (
  <SkeletonCard key={index} />
))}

// After: Repeat component
<Repeat times={5}>
  {(index) => <SkeletonCard key={index} />}
</Repeat>
```

### From Array.from()
```typescript
// Before: Array.from with mapping
{Array.from({ length: 3 }, (_, i) => (
  <LoadingDot key={i} delay={i * 100} />
))}

// After: Repeat component
<Repeat times={3}>
  {(index) => <LoadingDot key={index} delay={index * 100} />}
</Repeat>
```

## Related Components
- [`for`](../for/README.md) - For iterating over actual data arrays
- [`memo`](../memo/README.md) - For memoizing expensive components
- [`static`](../static/README.md) - For static content optimization

## Accessibility

The `Repeat` component itself doesn't add any DOM elements, so accessibility depends on the rendered content:

```typescript
// Ensure proper ARIA labels for repeated interactive elements
<Repeat times={5}>
  {(index) => (
    <button
      key={index}
      aria-label={`Page ${index + 1}`}
      onClick={() => goToPage(index + 1)}
    >
      {index + 1}
    </button>
  )}
</Repeat>

// Use proper headings for repeated sections
<Repeat times={sections.length}>
  {(index) => (
    <section key={index} aria-labelledby={`section-${index}`}>
      <h2 id={`section-${index}`}>Section {index + 1}</h2>
      {/* section content */}
    </section>
  )}
</Repeat>
```
