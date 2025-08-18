# Bound Component

A utility component for constraining numeric values within specified boundaries (min/max limits). Perfect for progress bars, sliders, scroll positions, and any scenario requiring value bounds with automatic clamping.

## Description

The `Bound` component provides an elegant solution for ensuring numeric values stay within defined limits. It automatically clamps values that exceed the specified range and provides callbacks for monitoring when values are constrained. This is particularly useful for UI components that need to display bounded data, implement progress indicators, or manage scroll-based animations with limits.

## When to Use
- **Progress Indicators**: Ensure progress values stay between 0-100%
- **Scroll Animations**: Bound scroll positions for parallax or animations
- **Slider Components**: Constrain values within allowed ranges
- **Data Visualization**: Limit chart values to display ranges
- **Gaming**: Constrain player stats, health bars, or score displays
- **Form Validation**: Ensure numeric inputs stay within valid ranges
- **Animation Systems**: Limit animation progress or timing values

## Patterns Used
- **Render Props Pattern**: Provides the bounded value through children function
- **Value Clamping**: Automatic constraint of values within min/max bounds
- **Callback Notifications**: Optional monitoring of clamping events
- **Type Safety**: Full TypeScript support for numeric constraints
- **Performance Optimization**: Efficient value comparison and clamping

## TypeScript Types

```typescript
import { RenderProp } from '../shared/types';

/**
 * Props for the Bound component
 */
interface BoundProps {
  /** Numeric value to constrain within bounds */
  value: number;

  /** Minimum allowed value (inclusive) */
  min: number;

  /** Maximum allowed value (inclusive) */
  max: number;

  /**
   * Render prop function that receives the bounded value
   * @param boundedValue - The value constrained within min/max bounds
   */
  children: RenderProp<number>;

  /**
   * Optional callback fired when value is clamped
   * @param originalValue - The original unclamped value
   * @param clampedValue - The value after clamping
   */
  onClamp?: (originalValue: number, clampedValue: number) => void;
}

/** Bound component type */
declare const Bound: React.FC<BoundProps> & {
  displayName: string;
};
```

## Usage Examples

### Progress Bar with Bounds

```tsx
import { Bound } from 'ui-magic-core/bound';

function TaskProgress() {
  const [completedTasks, setCompletedTasks] = useState(7);
  const totalTasks = 10;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <div className="task-progress">
      <h3>Project Progress</h3>
      <Bound
        value={progressPercentage}
        min={0}
        max={100}
        onClamp={(original, clamped) => {
          console.warn(`Progress clamped from ${original}% to ${clamped}%`);
        }}
      >
        {boundedProgress => (
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${boundedProgress}%` }}
            />
            <span className="progress-text">
              {Math.round(boundedProgress)}
% Complete
            </span>
          </div>
        )}
      </Bound>

      <div className="task-controls">
        <button onClick={() => setCompletedTasks(prev => prev - 1)}>
          Mark Incomplete
        </button>
        <button onClick={() => setCompletedTasks(prev => prev + 1)}>
          Mark Complete
        </button>
      </div>
    </div>
  );
}
```

### Scroll-Based Animation

```tsx
import { Bound } from 'ui-magic-core/bound';

function ParallaxHeader() {
  const [scrollY, setScrollY] = useState(0);
  const maxScrollForEffect = 400; // Animation stops after 400px

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Bound
      value={scrollY}
      min={0}
      max={maxScrollForEffect}
    >
      {(boundedScroll) => {
        const opacity = 1 - (boundedScroll / maxScrollForEffect);
        const translateY = boundedScroll * 0.5;

        return (
          <header
            className="parallax-header"
            style={{
              opacity: Math.max(0.1, opacity),
              transform: `translateY(${translateY}px)`
            }}
          >
            <h1>Parallax Header</h1>
            <p>Scroll down to see the effect</p>
            <div className="scroll-indicator">
              Scroll Progress:
{' '}
{Math.round((boundedScroll / maxScrollForEffect) * 100)}
%
            </div>
          </header>
        );
      }}
    </Bound>
  );
}
```

### Interactive Volume Control

```tsx
import { Bound } from 'ui-magic-core/bound';

function VolumeControl() {
  const [rawVolume, setRawVolume] = useState(75);
  const [volumeWarnings, setVolumeWarnings] = useState<string[]>([]);

  const handleVolumeClamp = (original: number, clamped: number) => {
    if (original > 100) {
      setVolumeWarnings(prev => [
        ...prev,
        `Volume limited to maximum (${original}% → ${clamped}%)`
      ]);
    }
 else if (original < 0) {
      setVolumeWarnings(prev => [
        ...prev,
        `Volume limited to minimum (${original}% → ${clamped}%)`
      ]);
    }
  };

  return (
    <div className="volume-control">
      <h3>Audio Volume</h3>

      <Bound
        value={rawVolume}
        min={0}
        max={100}
        onClamp={handleVolumeClamp}
      >
        {boundedVolume => (
          <div className="volume-display">
            <div className="volume-slider">
              <div
                className="volume-fill"
                style={{ width: `${boundedVolume}%` }}
              />
              <div
                className="volume-handle"
                style={{ left: `${boundedVolume}%` }}
              />
            </div>

            <div className="volume-info">
              <span className="volume-value">
{Math.round(boundedVolume)}
%
              </span>
              <span className={`volume-level ${
                boundedVolume > 80
? 'loud'
                : boundedVolume > 40 ? 'medium' : 'quiet'
              }`}
              >
                {boundedVolume > 80
? '🔊'
                 : boundedVolume > 40 ? '🔉' : '🔈'}
              </span>
            </div>
          </div>
        )}
      </Bound>

      <div className="volume-controls">
        <button onClick={() => setRawVolume(0)}>Mute</button>
        <button onClick={() => setRawVolume(prev => prev - 10)}>-10</button>
        <button onClick={() => setRawVolume(prev => prev + 10)}>+10</button>
        <button onClick={() => setRawVolume(100)}>Max</button>
        <button onClick={() => setRawVolume(150)}>⚠️ Test Overflow</button>
      </div>

      {volumeWarnings.length > 0 && (
        <div className="volume-warnings">
          {volumeWarnings.slice(-3).map((warning, index) => (
            <div key={index} className="warning">
              ⚠️
{' '}
{warning}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Gaming Health Bar

```tsx
import { Bound } from 'ui-magic-core/bound';

function HealthBar() {
  const [currentHealth, setCurrentHealth] = useState(85);
  const [maxHealth] = useState(100);
  const [damageLog, setDamageLog] = useState<string[]>([]);

  const takeDamage = (amount: number) => {
    setCurrentHealth(prev => prev - amount);
    setDamageLog(prev => [...prev, `Took ${amount} damage`]);
  };

  const heal = (amount: number) => {
    setCurrentHealth(prev => prev + amount);
    setDamageLog(prev => [...prev, `Healed ${amount} HP`]);
  };

  return (
    <div className="health-system">
      <Bound
        value={currentHealth}
        min={0}
        max={maxHealth}
        onClamp={(original, clamped) => {
          if (original > maxHealth) {
            setDamageLog(prev => [...prev, 'Cannot heal above maximum health']);
          }
 else if (original <= 0) {
            setDamageLog(prev => [...prev, '💀 Player defeated!']);
          }
        }}
      >
        {(boundedHealth) => {
          const healthPercentage = (boundedHealth / maxHealth) * 100;
          const isLowHealth = healthPercentage < 25;
          const isCritical = boundedHealth === 0;

          return (
            <div className={`health-display ${isLowHealth ? 'low-health' : ''}`}>
              <div className="health-bar-container">
                <div
                  className={`health-bar ${isCritical ? 'critical' : ''}`}
                  style={{
                    width: `${healthPercentage}%`,
                    backgroundColor: isCritical
? '#ff0000'
                                   : isLowHealth ? '#ff6600' : '#00ff00'
                  }}
                />
                <div className="health-text">
                  {Math.round(boundedHealth)}
/
{maxHealth}
{' '}
HP
                </div>
              </div>

              {isLowHealth && !isCritical && (
                <div className="health-warning pulse">
                  ⚠️ Low Health!
                </div>
              )}

              {isCritical && (
                <div className="defeat-message">
                  💀 Defeated! Respawn?
                </div>
              )}
            </div>
          );
        }}
      </Bound>

      <div className="health-controls">
        <button onClick={() => takeDamage(10)}>Take 10 Damage</button>
        <button onClick={() => takeDamage(25)}>Take 25 Damage</button>
        <button onClick={() => heal(15)}>Heal 15 HP</button>
        <button onClick={() => heal(50)}>Major Heal</button>
        <button onClick={() => setCurrentHealth(maxHealth)}>Full Heal</button>
      </div>

      <div className="damage-log">
        <h4>Combat Log</h4>
        {damageLog.slice(-5).map((entry, index) => (
          <div key={index} className="log-entry">
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Data Visualization with Bounds

```tsx
import { Bound } from 'ui-magic-core/bound';

function SalesChart() {
  const [salesData] = useState([120, 85, 200, 150, 95, 180, 220]);
  const chartMin = 0;
  const chartMax = 200; // Maximum displayable value

  return (
    <div className="sales-chart">
      <h3>
Weekly Sales (Max Display: $
{chartMax}
k)
      </h3>

      <div className="chart-container">
        {salesData.map((sales, index) => (
          <Bound
            key={index}
            value={sales}
            min={chartMin}
            max={chartMax}
            onClamp={(original, clamped) => {
              if (original > chartMax) {
                console.log(`Sales data capped at ${chartMax}k (actual: ${original}k)`);
              }
            }}
          >
            {(boundedSales) => {
              const barHeight = (boundedSales / chartMax) * 100;
              const isOverLimit = sales > chartMax;

              return (
                <div className="chart-bar-container">
                  <div
                    className={`chart-bar ${isOverLimit ? 'over-limit' : ''}`}
                    style={{ height: `${barHeight}%` }}
                  />
                  <div className="bar-label">
                    Day
{' '}
{index + 1}
                  </div>
                  <div className="bar-value">
                    $
{boundedSales}
k
{isOverLimit && <span className="overflow">📈</span>}
                  </div>
                </div>
              );
            }}
          </Bound>
        ))}
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="normal-bar"></span>
          Normal Range (0-$
{chartMax}
k)
        </div>
        <div className="legend-item">
          <span className="over-limit-bar"></span>
          Values Over Limit
        </div>
      </div>
    </div>
  );
}
```

```

## Advanced Configuration

### Dynamic Bounds

```tsx
function DynamicBounds() {
  const [userLevel, setUserLevel] = useState(5);
  const [score, setScore] = useState(150);

  // Bounds change based on user level
  const maxScore = userLevel * 100;
  const minScore = 0;

  return (
    <Bound
      value={score}
      min={minScore}
      max={maxScore}
      onClamp={(original, clamped) => {
        notifyUser(`Score adjusted to level ${userLevel} limits`);
      }}
    >
      {(boundedScore) => (
        <div className="dynamic-score">
          <h3>Level {userLevel} Player</h3>
          <div className="score-display">
            Score: {boundedScore}/{maxScore}
          </div>
          <div className="level-controls">
            <button onClick={() => setUserLevel(prev => prev + 1)}>
              Level Up
            </button>
            <button onClick={() => setScore(prev => prev + 50)}>
              Add Points
            </button>
          </div>
        </div>
      )}
    </Bound>
  );
}
```

### Multiple Bounds with Composition

```tsx
function MultiLayerBounds() {
  const [rawValue, setRawValue] = useState(250);

  return (
    <Bound value={rawValue} min={0} max={200}>
      {level1Bounded => (
        <Bound value={level1Bounded} min={50} max={150}>
          {level2Bounded => (
            <div className="multi-bound-display">
              <div>
Original:
{rawValue}
              </div>
              <div>
Level 1 (0-200):
{level1Bounded}
              </div>
              <div>
Level 2 (50-150):
{level2Bounded}
              </div>

              <div className="value-controls">
                <input
                  type="range"
                  min={-50}
                  max={300}
                  value={rawValue}
                  onChange={e => setRawValue(Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </Bound>
      )}
    </Bound>
  );
}
```

### Bounds with Animation

```tsx
function AnimatedBounds() {
  const [targetValue, setTargetValue] = useState(75);
  const [animatedValue, setAnimatedValue] = useState(75);

  // Animate to bounded target value
  useEffect(() => {
    const animate = () => {
      setAnimatedValue((prev) => {
        const diff = targetValue - prev;
        if (Math.abs(diff) < 0.1)
return targetValue;
        return prev + diff * 0.1;
      });
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [targetValue]);

  return (
    <Bound
      value={animatedValue}
      min={0}
      max={100}
    >
      {boundedValue => (
        <div className="animated-progress">
          <div
            className="progress-bar animated"
            style={{
              width: `${boundedValue}%`,
              transition: 'width 0.016s ease-out'
            }}
          />
          <div className="controls">
            <button onClick={() => setTargetValue(0)}>0%</button>
            <button onClick={() => setTargetValue(50)}>50%</button>
            <button onClick={() => setTargetValue(100)}>100%</button>
            <button onClick={() => setTargetValue(150)}>150% (Test)</button>
          </div>
        </div>
      )}
    </Bound>
  );
}
```

## Performance Considerations

### Optimizing Frequent Updates

```tsx
// Debounce rapid value changes
function OptimizedBounds() {
  const [value, setValue] = useState(50);
  const debouncedValue = useDebounce(value, 100);

  return (
    <Bound
      value={debouncedValue}
      min={0}
      max={100}
      onClamp={useCallback((original, clamped) => {
        // Only log when debounced value is clamped
        console.log(`Debounced clamp: ${original} → ${clamped}`);
      }, [])}
    >
      {boundedValue => (
        <div className="optimized-display">
          <div>
Current:
{value}
          </div>
          <div>
Debounced & Bounded:
{boundedValue}
          </div>
          <input
            type="range"
            min={-20}
            max={120}
            value={value}
            onChange={e => setValue(Number(e.target.value))}
          />
        </div>
      )}
    </Bound>
  );
}
```

### Memoization for Complex Children

```tsx
function MemoizedBoundDisplay() {
  const [value, setValue] = useState(75);

  const ExpensiveChart = useMemo(() =>
    ({ boundedValue }: { boundedValue: number }) => (
      <div className="expensive-chart">
        {/* Complex chart rendering */}
        <svg width="200" height="100">
          <rect
            width={boundedValue * 2}
            height="20"
            fill="#4CAF50"
          />
        </svg>
      </div>
    ), []);

  return (
    <Bound value={value} min={0} max={100}>
      {boundedValue => (
        <ExpensiveChart boundedValue={boundedValue} />
      )}
    </Bound>
  );
}
```

## Error Handling and Edge Cases

### Invalid Bounds Detection

```tsx
function SafeBounds() {
  const [value, setValue] = useState(50);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);

  // Ensure valid bounds
  const validMin = Math.min(min, max);
  const validMax = Math.max(min, max);
  const boundsValid = validMin < validMax;

  if (!boundsValid) {
    return (
      <div className="error-state">
        ⚠️ Invalid bounds: min (
{min}
) must be less than max (
{max}
)
      </div>
    );
  }

  return (
    <Bound
      value={value}
      min={validMin}
      max={validMax}
      onClamp={(original, clamped) => {
        console.log(`Value clamped: ${original} → ${clamped}`);
      }}
    >
      {boundedValue => (
        <div className="safe-bounds">
          <div>
Value:
{boundedValue}
          </div>
          <div>
Range:
{validMin}
{' '}
-
{validMax}
          </div>

          <div className="bound-controls">
            <label>
              Min:
              <input
                type="number"
                value={min}
                onChange={e => setMin(Number(e.target.value))}
              />
            </label>
            <label>
              Max:
              <input
                type="number"
                value={max}
                onChange={e => setMax(Number(e.target.value))}
              />
            </label>
            <label>
              Value:
              <input
                type="number"
                value={value}
                onChange={e => setValue(Number(e.target.value))}
              />
            </label>
          </div>
        </div>
      )}
    </Bound>
  );
}
```

### Handling Infinity and NaN

```tsx
function RobustBounds() {
  const [input, setInput] = useState('50');

  const numericValue = useMemo(() => {
    const parsed = Number.parseFloat(input);
    if (isNaN(parsed) || !isFinite(parsed)) {
      return 0; // Default value for invalid input
    }
    return parsed;
  }, [input]);

  return (
    <div className="robust-bounds">
      <label>
        Enter value (try 'abc', 'Infinity', etc.):
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter number..."
        />
      </label>

      <Bound
        value={numericValue}
        min={0}
        max={100}
        onClamp={(original, clamped) => {
          console.log(`Robust clamp: ${original} → ${clamped}`);
        }}
      >
        {boundedValue => (
          <div className="result">
            <div>
Input: "
{input}
"
            </div>
            <div>
Parsed:
{numericValue}
            </div>
            <div>
Bounded:
{boundedValue}
            </div>
            <div
              className="visual-indicator"
              style={{
                width: `${boundedValue}%`,
                height: '20px',
                backgroundColor: '#4CAF50'
              }}
            />
          </div>
        )}
      </Bound>
    </div>
  );
}
```

## Accessibility Considerations

### Screen Reader Support

```tsx
function AccessibleBounds() {
  const [value, setValue] = useState(75);

  return (
    <Bound value={value} min={0} max={100}>
      {boundedValue => (
        <div
          className="accessible-progress"
          role="progressbar"
          aria-valuenow={boundedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: ${boundedValue} percent`}
        >
          <div
            className="progress-visual"
            style={{ width: `${boundedValue}%` }}
          />
          <div className="sr-only">
            Progress:
{' '}
{boundedValue}
{' '}
out of 100
          </div>

          <div className="progress-controls">
            <button
              onClick={() => setValue(prev => prev - 10)}
              aria-label="Decrease progress by 10%"
            >
              Decrease
            </button>
            <button
              onClick={() => setValue(prev => prev + 10)}
              aria-label="Increase progress by 10%"
            >
              Increase
            </button>
          </div>
        </div>
      )}
    </Bound>
  );
}
```

## Best Practices

### 1. Choose Appropriate Bounds
Select meaningful minimum and maximum values based on your use case:

```tsx
// Good: Logical bounds
<Bound value={percentage} min={0} max={100} />
<Bound value={opacity} min={0} max={1} />
<Bound value={volume} min={0} max={100} />

// Avoid: Arbitrary or too restrictive bounds
<Bound value={userAge} min={0} max={50} /> // Why max 50?
<Bound value={price} min={99.99} max={100.01} /> // Too restrictive
```

### 2. Provide User Feedback
Always inform users when values are being clamped:

```tsx
const [message, setMessage] = useState('');

<Bound
  value={userInput}
  min={0}
  max={100}
  onClamp={(original, clamped) => {
    setMessage(`Value adjusted from ${original} to ${clamped}`);
    setTimeout(() => setMessage(''), 3000);
  }}
>
  {/* UI content */}
</Bound>;

{ message && <div className="clamp-message">{message}</div>; }
```

### 3. Handle Edge Cases Gracefully
Consider what happens with invalid inputs:

```tsx
const safeBounds = useMemo(() => ({
  min: Math.min(minInput, maxInput),
  max: Math.max(minInput, maxInput),
  value: isFinite(valueInput) ? valueInput : 0
}), [minInput, maxInput, valueInput]);
```

### 4. Use Semantic HTML
Enhance accessibility with proper ARIA attributes:

```tsx
<Bound value={progress} min={0} max={100}>
  {bounded => (
    <div
      role="progressbar"
      aria-valuenow={bounded}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Task completion progress"
    >
      {/* Progress UI */}
    </div>
  )}
</Bound>;
```

## Related Components

- [`gesture-pad`](../gesture-pad/README.md) - Touch gestures that might need bounds
- [`scroll`](../scroll/README.md) - Scroll positions that can be bounded
- [`zoom`](../zoom/README.md) - Zoom levels that need min/max constraints

## Migration Guide

### From Manual Clamping

**Before:**
```tsx
const clampedValue = Math.min(Math.max(value, min), max);

if (clampedValue !== value) {
  console.log('Value was clamped');
}

return <ProgressBar value={clampedValue} />;
```

**After:**
```tsx
<Bound
  value={value}
  min={min}
  max={max}
  onClamp={(original, clamped) => {
    console.log('Value was clamped');
  }}
>
  {boundedValue => <ProgressBar value={boundedValue} />}
</Bound>;
```

### From Lodash Clamp

**Before:**
```tsx
import { clamp } from 'lodash';

const boundedValue = clamp(value, min, max);
return <Component value={boundedValue} />;
```

**After:**
```tsx
<Bound value={value} min={min} max={max}>
  {boundedValue => <Component value={boundedValue} />}
</Bound>;
```
| `onChange`  | `(v: T) => void`                       | ✅       | Change handler               |
| `children`  | `(value: T, setValue: (v: T) => void)` | ✅       | Render prop for usage        |

## Examples
### Basic Usage
```tsx
import { Bound } from 'rc-sugar';

<Bound value={text} onChange={setText}>
  {(value, setValue) => (
    <input value={value} onChange={e => setValue(e.target.value)} />
  )}
</Bound>;
```

## Best Practices
- Use for forms and controlled inputs
- Prefer for reducing boilerplate
