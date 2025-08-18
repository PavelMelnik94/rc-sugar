# Scroll Component

A comprehensive utility component for handling scroll events, scroll position tracking, and scroll-based interactions in React applications with advanced features for infinite scrolling, virtual scrolling, and scroll-triggered animations.

## Description

The `Scroll` component provides a powerful and declarative approach to managing scroll behavior in modern React applications. It offers fine-grained control over scroll events, position tracking, direction detection, and scroll-based UI updates. Built with performance optimization in mind, it includes features like throttling, debouncing, and virtual scrolling support.

Perfect for creating smooth scroll experiences, implementing infinite scroll patterns, sticky navigation, parallax effects, and scroll-triggered animations. The component abstracts away the complexity of scroll event handling while providing comprehensive APIs for advanced scroll behaviors.

## When to Use

- **Infinite scrolling** for large datasets and performance optimization
- **Sticky headers** and navigation elements that respond to scroll
- **Scroll-triggered animations** and parallax effects
- **Virtual scrolling** for massive lists and data tables
- **Load-on-scroll** patterns for image galleries and content feeds
- **Scroll position tracking** for analytics and user behavior
- **Auto-scroll features** in chat applications and live feeds
- **Scroll restoration** for single-page applications
- **Custom scrollbars** and scroll indicators
- **Scroll-based navigation** and section highlighting

## How It Works

The `Scroll` component uses optimized event listeners with requestAnimationFrame for smooth scroll tracking. It provides comprehensive scroll state through render props, including position, direction, velocity, and scroll boundaries. The component supports both window and element-specific scroll tracking with automatic cleanup and performance optimizations.

Advanced features include viewport intersection detection, scroll prediction, momentum tracking, and customizable throttling for different use cases.

## Patterns Used

- **Render Props Pattern**: Provides scroll state and utilities to children
- **Observer Pattern**: Tracks scroll events and position changes
- **Performance Optimization**: Uses throttling and debouncing for smooth performance
- **Intersection Observer**: Efficient viewport-based loading and animations
- **Custom Hook Integration**: Works seamlessly with custom scroll hooks
- **Event Delegation**: Optimized event handling for multiple scroll elements

## TypeScript Types

```typescript
/**
 * Scroll position coordinates
 */
interface ScrollPosition {
  x: number;
  y: number;
  left: number;
  top: number;
}

/**
 * Scroll dimensions and boundaries
 */
interface ScrollDimensions {
  scrollWidth: number;
  scrollHeight: number;
  clientWidth: number;
  clientHeight: number;
  scrollLeft: number;
  scrollTop: number;
}

/**
 * Scroll direction indicators
 */
interface ScrollDirection {
  horizontal: 'left' | 'right' | 'none';
  vertical: 'up' | 'down' | 'none';
  isScrolling: boolean;
  lastDirection: ScrollDirection | null;
}

/**
 * Scroll velocity and momentum
 */
interface ScrollVelocity {
  x: number;
  y: number;
  magnitude: number;
  timestamp: number;
}

/**
 * Scroll boundaries and thresholds
 */
interface ScrollBoundaries {
  isAtTop: boolean;
  isAtBottom: boolean;
  isAtLeft: boolean;
  isAtRight: boolean;
  nearTop: boolean;
  nearBottom: boolean;
  nearLeft: boolean;
  nearRight: boolean;
}

/**
 * Complete scroll state
 */
interface ScrollState {
  position: ScrollPosition;
  dimensions: ScrollDimensions;
  direction: ScrollDirection;
  velocity: ScrollVelocity;
  boundaries: ScrollBoundaries;
  progress: {
    vertical: number;
    horizontal: number;
  };
}

/**
 * Props for the Scroll component
 */
interface ScrollProps {
  /**
   * Render function that receives comprehensive scroll state
   */
  children: (state: ScrollState, utils: ScrollUtils) => React.ReactNode;

  /**
   * Target element to track scrolling (defaults to window)
   */
  element?: HTMLElement | Window | null;

  /**
   * Scroll event callback
   */
  onScroll?: (state: ScrollState) => void;

  /**
   * Scroll start callback
   */
  onScrollStart?: (state: ScrollState) => void;

  /**
   * Scroll end callback (triggered after scroll stops)
   */
  onScrollEnd?: (state: ScrollState) => void;

  /**
   * Direction change callback
   */
  onDirectionChange?: (direction: ScrollDirection) => void;

  /**
   * Boundary reached callbacks
   */
  onReachTop?: (state: ScrollState) => void;
  onReachBottom?: (state: ScrollState) => void;
  onReachLeft?: (state: ScrollState) => void;
  onReachRight?: (state: ScrollState) => void;

  /**
   * Throttle delay for scroll events (ms)
   * @default 16
   */
  throttle?: number;

  /**
   * Debounce delay for scroll end detection (ms)
   * @default 150
   */
  debounce?: number;

  /**
   * Threshold for "near" boundary detection (px)
   * @default 100
   */
  threshold?: number;

  /**
   * Enable scroll direction tracking
   * @default true
   */
  trackDirection?: boolean;

  /**
   * Enable scroll velocity tracking
   * @default true
   */
  trackVelocity?: boolean;

  /**
   * Enable boundary detection
   * @default true
   */
  trackBoundaries?: boolean;

  /**
   * Enable smooth scrolling utilities
   * @default true
   */
  enableSmoothScroll?: boolean;
}

/**
 * Scroll utility functions
 */
interface ScrollUtils {
  scrollTo: (position: Partial<ScrollPosition>, options?: ScrollToOptions) => void;
  scrollIntoView: (element: HTMLElement, options?: ScrollIntoViewOptions) => void;
  scrollBy: (delta: Partial<ScrollPosition>, options?: ScrollToOptions) => void;
  scrollToTop: (options?: ScrollToOptions) => void;
  scrollToBottom: (options?: ScrollToOptions) => void;
  getElementOffset: (element: HTMLElement) => ScrollPosition;
  isElementInView: (element: HTMLElement) => boolean;
  getVisibleElements: (elements: HTMLElement[]) => HTMLElement[];
}
```

## API Reference

### Scroll Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `(state: ScrollState, utils: ScrollUtils) => ReactNode` | ✅ | - | Render function receiving scroll state and utilities |
| `element` | `HTMLElement \| Window \| null` | ❌ | `window` | Target element to track scrolling |
| `onScroll` | `(state: ScrollState) => void` | ❌ | - | Callback fired on scroll events |
| `onScrollStart` | `(state: ScrollState) => void` | ❌ | - | Callback fired when scrolling starts |
| `onScrollEnd` | `(state: ScrollState) => void` | ❌ | - | Callback fired when scrolling ends |
| `onDirectionChange` | `(direction: ScrollDirection) => void` | ❌ | - | Callback fired when scroll direction changes |
| `onReachTop` | `(state: ScrollState) => void` | ❌ | - | Callback fired when reaching top boundary |
| `onReachBottom` | `(state: ScrollState) => void` | ❌ | - | Callback fired when reaching bottom boundary |
| `onReachLeft` | `(state: ScrollState) => void` | ❌ | - | Callback fired when reaching left boundary |
| `onReachRight` | `(state: ScrollState) => void` | ❌ | - | Callback fired when reaching right boundary |
| `throttle` | `number` | ❌ | `16` | Throttle delay for scroll events (ms) |
| `debounce` | `number` | ❌ | `150` | Debounce delay for scroll end detection (ms) |
| `threshold` | `number` | ❌ | `100` | Threshold for "near" boundary detection (px) |
| `trackDirection` | `boolean` | ❌ | `true` | Enable scroll direction tracking |
| `trackVelocity` | `boolean` | ❌ | `true` | Enable scroll velocity tracking |
| `trackBoundaries` | `boolean` | ❌ | `true` | Enable boundary detection |

## Examples

### Basic Scroll Position Tracking
```tsx
import { Scroll } from 'react-utility-kit';

function BasicScrollTracker() {
  return (
    <Scroll>
      {(state, utils) => (
        <div style={{ height: '200vh', padding: '20px' }}>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '10px'
            }}
          >
            <p>
Scroll Position: X:
{state.position.x}
, Y:
{state.position.y}
            </p>
            <p>
Progress:
{Math.round(state.progress.vertical * 100)}
%
            </p>
            <p>
Direction:
{state.direction.vertical}
            </p>
          </div>

          <h1>Scroll down to see position tracking</h1>
          <div style={{ height: '100vh' }}>Content goes here...</div>
        </div>
      )}
    </Scroll>
  );
}
```

### Infinite Scroll Implementation
```tsx
import { useEffect, useState } from 'react';
import { Scroll } from 'ui-magic-core';

interface DataItem {
  id: number;
  title: string;
  content: string;
}

function InfiniteScrollList() {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreItems = async () => {
    if (loading || !hasMore)
return;

    setLoading(true);
    // Simulate API call
    const newItems = Array.from({ length: 20 }, (_, i) => ({
      id: items.length + i,
      title: `Item ${items.length + i + 1}`,
      content: `Content for item ${items.length + i + 1}`
    }));

    setTimeout(() => {
      setItems(prev => [...prev, ...newItems]);
      setLoading(false);
      if (items.length + newItems.length >= 200) {
        setHasMore(false);
      }
    }, 1000);
  };

  useEffect(() => {
    loadMoreItems(); // Load initial items
  }, []);

  return (
    <Scroll
      onReachBottom={loadMoreItems}
      threshold={200}
    >
      {(state, utils) => (
        <div>
          <h1>Infinite Scroll Demo</h1>

          <div className="items-list">
            {items.map(item => (
              <div key={item.id} className="item-card">
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </div>
            ))}
          </div>

          {loading && (
            <div className="loading-indicator">
              Loading more items...
            </div>
          )}

          {!hasMore && (
            <div className="end-message">
              No more items to load
            </div>
          )}

          {state.boundaries.nearBottom && (
            <button
              onClick={utils.scrollToTop}
              className="scroll-to-top"
            >
              ↑ Back to Top
            </button>
          )}
        </div>
      )}
    </Scroll>
  );
}
```

### Sticky Header with Scroll Direction
```tsx
import { Scroll } from 'ui-magic-core';

function StickyHeaderPage() {
  return (
    <Scroll trackDirection>
      {(state, utils) => (
        <div>
          <header
            className={`
              sticky-header
              ${state.direction.vertical === 'up' ? 'header-visible' : 'header-hidden'}
              ${state.position.y > 100 ? 'header-scrolled' : ''}
            `}
          >
            <nav>
              <h1>My Website</h1>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>

            <div className="scroll-progress">
              <div
                className="progress-bar"
                style={{ width: `${state.progress.vertical * 100}%` }}
              />
            </div>
          </header>

          <main style={{ paddingTop: '80px' }}>
            <section id="home" style={{ height: '100vh' }}>
              <h2>Home Section</h2>
            </section>
            <section id="about" style={{ height: '100vh' }}>
              <h2>About Section</h2>
            </section>
            <section id="services" style={{ height: '100vh' }}>
              <h2>Services Section</h2>
            </section>
            <section id="contact" style={{ height: '100vh' }}>
              <h2>Contact Section</h2>
            </section>
          </main>
        </div>
      )}
    </Scroll>
  );
}
```

### Parallax Scroll Effects
```tsx
import { Scroll } from 'ui-magic-core';

function ParallaxPage() {
  return (
    <Scroll trackVelocity>
      {(state, utils) => (
        <div className="parallax-container">
          {/* Background layer with slower movement */}
          <div
            className="parallax-bg"
            style={{
              transform: `translateY(${state.position.y * 0.5}px)`,
              opacity: Math.max(0, 1 - state.progress.vertical)
            }}
          >
            <img src="/bg-mountains.jpg" alt="Mountains" />
          </div>

          {/* Middle layer with medium movement */}
          <div
            className="parallax-mid"
            style={{
              transform: `translateY(${state.position.y * 0.3}px) scale(${1 + state.progress.vertical * 0.1})`
            }}
          >
            <img src="/bg-trees.png" alt="Trees" />
          </div>

          {/* Content layer with normal movement */}
          <div className="content-layer">
            <section className="hero">
              <h1
                style={{
                  transform: `translateY(${state.position.y * 0.2}px)`,
                  opacity: Math.max(0, 1 - state.progress.vertical * 2)
                }}
              >
                Parallax Scroll Demo
              </h1>
            </section>

            <section className="content">
              <div
                style={{
                  transform: `translateX(${Math.sin(state.progress.vertical * Math.PI) * 50}px)`
                }}
              >
                <h2>Animated Content</h2>
                <p>This content moves based on scroll position</p>
              </div>
            </section>
          </div>

          {/* Velocity indicator */}
          <div
            className="velocity-indicator"
            style={{
              opacity: Math.min(1, state.velocity.magnitude / 1000),
              transform: `scale(${1 + state.velocity.magnitude / 2000})`
            }}
          >
            Speed:
{' '}
{Math.round(state.velocity.magnitude)}
          </div>
        </div>
      )}
    </Scroll>
  );
}
```

### Virtual Scroll List
```tsx
import { useMemo, useState } from 'react';
import { Scroll } from 'ui-magic-core';

interface VirtualItem {
  id: number;
  height: number;
  content: string;
}

function VirtualScrollList() {
  const [items] = useState<VirtualItem[]>(() =>
    Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      height: 50 + Math.random() * 100,
      content: `Virtual item ${i + 1}`
    }))
  );

  const containerHeight = 400;
  const overscan = 5;

  return (
    <div style={{ height: containerHeight, overflow: 'auto' }}>
      <Scroll element={undefined}>
        {(state, utils) => {
          const totalHeight = items.reduce((sum, item) => sum + item.height, 0);

          // Calculate visible range
          const scrollTop = state.position.y;
          const scrollBottom = scrollTop + containerHeight;

          let startIndex = 0;
          let currentHeight = 0;

          // Find start index
          for (let i = 0; i < items.length; i++) {
            if (currentHeight + items[i].height > scrollTop) {
              startIndex = Math.max(0, i - overscan);
              break;
            }
            currentHeight += items[i].height;
          }

          // Find end index
          let endIndex = startIndex;
          currentHeight = items.slice(0, startIndex).reduce((sum, item) => sum + item.height, 0);

          for (let i = startIndex; i < items.length; i++) {
            if (currentHeight > scrollBottom) {
              endIndex = Math.min(items.length - 1, i + overscan);
              break;
            }
            currentHeight += items[i].height;
            endIndex = i;
          }

          const visibleItems = items.slice(startIndex, endIndex + 1);
          const offsetY = items.slice(0, startIndex).reduce((sum, item) => sum + item.height, 0);

          return (
            <div style={{ height: totalHeight, position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: offsetY,
                  left: 0,
                  right: 0
                }}
              >
                {visibleItems.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      height: item.height,
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                      background: index % 2 === 0 ? '#f9f9f9' : 'white'
                    }}
                  >
                    {item.content}
{' '}
(Height:
{item.height}
px)
                  </div>
                ))}
              </div>

              {/* Scroll info overlay */}
              <div
                style={{
                  position: 'fixed',
                  top: 10,
                  right: 10,
                  background: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '4px'
                }}
              >
                <div>
Items
{startIndex}
-
{endIndex}
{' '}
of
{items.length}
                </div>
                <div>
Progress:
{Math.round(state.progress.vertical * 100)}
%
                </div>
              </div>
            </div>
          );
        }}
      </Scroll>
    </div>
  );
}
```

### Scroll-triggered Animations
```tsx
import { useEffect, useRef } from 'react';
import { Scroll } from 'ui-magic-core';

function ScrollAnimations() {
  const elementsRef = useRef<HTMLDivElement[]>([]);

  return (
    <Scroll onScroll={(state) => {
      // Check which elements are in view and animate them
      elementsRef.current.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const inView = rect.top < window.innerHeight && rect.bottom > 0;

          if (inView) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }
 else {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
          }
        }
      });
    }}
    >
      {(state, utils) => (
        <div>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              ref={el => el && (elementsRef.current[i] = el)}
              style={{
                height: '200px',
                margin: '100px 0',
                background: `hsl(${i * 36}, 70%, 60%)`,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                transition: 'all 0.6s ease',
                opacity: 0,
                transform: 'translateY(50px)'
              }}
            >
              Animated Section
{' '}
{i + 1}
            </div>
          ))}

          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              padding: '10px',
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              borderRadius: '4px'
            }}
          >
            Scroll:
{' '}
{Math.round(state.position.y)}
px
          </div>
        </div>
      )}
    </Scroll>
  );
}
```

## Performance Considerations

1. **Event Throttling**: Configurable throttling prevents excessive event firing during scroll
2. **Debounced End Detection**: Efficiently detects when scrolling has stopped
3. **RequestAnimationFrame**: Uses RAF for smooth animations and updates
4. **Memory Management**: Automatically cleans up event listeners and timers
5. **Boundary Caching**: Caches boundary calculations to reduce repeated computations
6. **Selective Tracking**: Disable unused features (velocity, direction) for better performance

## Best Practices

1. **Performance Optimization**: Use throttling for heavy scroll handlers
2. **Accessibility**: Provide reduced motion alternatives for animations
3. **Mobile Optimization**: Consider touch scrolling behavior and momentum
4. **Progressive Enhancement**: Ensure functionality works without scroll tracking
5. **Memory Management**: Clean up listeners in component unmount
6. **Smooth Animations**: Use CSS transforms instead of changing layout properties

## Migration Guide

### From Manual Scroll Listeners

**Before:**
```tsx
function OldScrollComponent() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
<div>
Scroll Y:
{scrollY}
</div>
);
}
```

**After:**
```tsx
function NewScrollComponent() {
  return (
    <Scroll>
      {state => (
        <div>
Scroll Y:
{state.position.y}
        </div>
      )}
    </Scroll>
  );
}
```

### From Intersection Observer

**Before:**
```tsx
function OldInfiniteScroll() {
  const [items, setItems] = useState([]);
  const observerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {items.map(item => <div key={item.id}>{item.content}</div>)}
      <div ref={observerRef} />
    </div>
  );
}
```

**After:**
```tsx
function NewInfiniteScroll() {
  const [items, setItems] = useState([]);

  return (
    <Scroll onReachBottom={() => loadMore()}>
      {state => (
        <div>
          {items.map(item => <div key={item.id}>{item.content}</div>)}
        </div>
      )}
    </Scroll>
  );
}
```

## Common Patterns

### Back to Top Button
```tsx
function BackToTopButton() {
  return (
    <Scroll>
      {(state, utils) => (
        <div>
          {/* Content */}
          <div style={{ height: '200vh' }}>
            Long content here...
          </div>

          {/* Back to top button */}
          {state.position.y > 500 && (
            <button
              onClick={utils.scrollToTop}
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                opacity: Math.min(1, (state.position.y - 500) / 500)
              }}
            >
              ↑ Top
            </button>
          )}
        </div>
      )}
    </Scroll>
  );
}
```

### Reading Progress Indicator
```tsx
function ReadingProgress() {
  return (
    <Scroll>
      {state => (
        <div>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: `${state.progress.vertical * 100}%`,
              height: '3px',
              background: 'linear-gradient(90deg, #007acc, #00d4aa)',
              zIndex: 1000
            }}
          />
          <article style={{ height: '200vh', padding: '20px' }}>
            <h1>Long Article</h1>
            <p>Article content goes here...</p>
          </article>
        </div>
      )}
    </Scroll>
  );
}
```

### Smooth Section Navigation
```tsx
function SectionNavigation() {
  return (
    <Scroll>
      {(state, utils) => (
        <div>
          <nav style={{ position: 'fixed', top: 0, width: '100%' }}>
            <button onClick={() => utils.scrollTo({ y: 0 })}>
              Section 1
            </button>
            <button onClick={() => utils.scrollTo({ y: 800 })}>
              Section 2
            </button>
            <button onClick={() => utils.scrollTo({ y: 1600 })}>
              Section 3
            </button>
          </nav>

          <div style={{ height: '800px', background: '#f0f0f0' }}>Section 1</div>
          <div style={{ height: '800px', background: '#e0e0e0' }}>Section 2</div>
          <div style={{ height: '800px', background: '#d0d0d0' }}>Section 3</div>
        </div>
      )}
    </Scroll>
  );
}
```

## Related Components

- [`Focus`](../focus/README.md) - For focus management and keyboard navigation
- [`Maybe`](../maybe/README.md) - For conditional rendering based on scroll state
- [`Show`](../show/README.md) - For scroll-triggered visibility
- [`Lazy`](../lazy/README.md) - For scroll-based lazy loading
- [`State`](../state/README.md) - For scroll state management
