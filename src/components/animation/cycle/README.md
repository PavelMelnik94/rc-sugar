# Cycle Component

An automatic carousel component that cycles through items with configurable timing, pause controls, and smooth transitions. Perfect for banners, testimonials, image galleries, and any rotating content display.

## Description

The `Cycle` component provides an elegant solution for automatically rotating through a collection of items with precise timing control. It handles the complexity of interval management, pause functionality, and smooth transitions while maintaining a simple API. The component supports hover-to-pause behavior, custom interval timing, and callback notifications for cycle events.

## When to Use
- 🎠 **Carousels & Banners**: Rotating hero banners, promotional content, featured items
- 💬 **Testimonials**: Cycling through customer reviews and testimonials
- 📸 **Image Galleries**: Automatic slideshow functionality
- 📢 **Announcements**: Rotating notices, alerts, and announcements
- 📊 **Data Displays**: Cycling through different metrics or charts
- 🎯 **Marketing Content**: Rotating offers, deals, and promotional materials
- 🔄 **Content Rotation**: Any scenario requiring automatic content switching

## Patterns Used
- **Automatic State Management**: Handles interval-based cycling automatically
- **Pause Control**: Mouse hover pause functionality for better UX
- **Event Callbacks**: Notifications for cycle state changes
- **Responsive Timing**: Configurable intervals for different content types
- **Type Safety**: Full TypeScript support for item types
- **Performance Optimization**: Efficient timer management and cleanup

## TypeScript Types
```typescript
import { ReactNode } from 'react';

/**
 * Props for the Cycle component
 */
interface CycleProps {
  /** Array of items to cycle through */
  items: ReactNode[];

  /** Interval in milliseconds between cycles */
  interval: number;

  /** Whether to automatically start cycling */
  autoStart?: boolean;

  /** Whether to pause cycling on hover */
  pauseOnHover?: boolean;

  /** Callback when the active item changes */
  onCycle?: (currentIndex: number, previousIndex: number) => void;

  /** Render prop for custom item rendering */
  renderItem?: (item: ReactNode, index: number) => ReactNode;

  /** Render prop for custom indicator rendering */
  renderIndicators?: (currentIndex: number, totalItems: number) => ReactNode;
}

/** Cycle component type */
declare const Cycle: React.FC<CycleProps> & {
  start: (setCycleRunning: (running: boolean) => void) => () => void;
  stop: (setCycleRunning: (running: boolean) => void) => () => void;
  next: (setCurrentIndex: (index: number | ((prev: number) => number)) => void, length: number) => () => void;
  previous: (setCurrentIndex: (index: number | ((prev: number) => number)) => void, length: number) => () => void;
};
```

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ReactNode[]` | - | **Required.** Array of items to cycle through |
| `interval` | `number` | - | **Required.** Time in milliseconds between transitions |
| `autoStart` | `boolean` | `true` | Whether to start cycling automatically on mount |
| `pauseOnHover` | `boolean` | `false` | Whether to pause cycling when mouse hovers over component |
| `onCycle` | `(currentIndex: number, previousIndex: number) => void` | `undefined` | Callback fired when active item changes |
| `renderItem` | `(item: ReactNode, index: number) => ReactNode` | `undefined` | Custom render function for each item |
| `renderIndicators` | `(currentIndex: number, totalItems: number) => ReactNode` | `undefined` | Custom render function for indicators |

## Examples

### Basic Banner Carousel
```tsx
import { Cycle } from 'react-utility-kit';

function HeroBanner() {
  const banners = [
    <div className="banner banner-1">
      <h2>Summer Sale - 50% Off</h2>
      <p>Limited time offer on all summer collection</p>
      <button>Shop Now</button>
    </div>,
    <div className="banner banner-2">
      <h2>New Arrivals</h2>
      <p>Discover our latest fashion trends</p>
      <button>Explore</button>
    </div>,
    <div className="banner banner-3">
      <h2>Free Shipping</h2>
      <p>On orders over $100</p>
      <button>Learn More</button>
    </div>
  ];

  return (
    <div className="hero-section">
      <Cycle
        items={banners}
        interval={4000}
        pauseOnHover={true}
        onCycle={(current, previous) => {
          console.log(`Switched from banner ${previous} to banner ${current}`);
        }}
      />
    </div>
  );
}
```

### Testimonials Carousel
```tsx
import { Cycle } from 'ui-magic-core';

function TestimonialsCarousel() {
  const testimonials = [
    <div className="testimonial">
      <blockquote>
        "This product completely transformed our workflow. Amazing results!"
      </blockquote>
      <cite>
        <img src="/avatar1.jpg" alt="Sarah Johnson" />
        <div>
          <strong>Sarah Johnson</strong>
          <span>CEO, TechCorp</span>
        </div>
      </cite>
    </div>,
    <div className="testimonial">
      <blockquote>
        "Outstanding customer service and top-quality products. Highly recommended!"
      </blockquote>
      <cite>
        <img src="/avatar2.jpg" alt="Mike Chen" />
        <div>
          <strong>Mike Chen</strong>
          <span>Designer, CreativeStudio</span>
        </div>
      </cite>
    </div>,
    <div className="testimonial">
      <blockquote>
        "The best investment we've made for our business this year."
      </blockquote>
      <cite>
        <img src="/avatar3.jpg" alt="Emma Wilson" />
        <div>
          <strong>Emma Wilson</strong>
          <span>Founder, StartupX</span>
        </div>
      </cite>
    </div>
  ];

  return (
    <section className="testimonials-section">
      <h2>What Our Customers Say</h2>
      <div className="testimonials-container">
        <Cycle
          items={testimonials}
          interval={6000}
          pauseOnHover={true}
        />
      </div>
    </section>
  );
}
```

### Image Gallery Slideshow
```tsx
import { Cycle } from 'react-utility-kit';

function ImageGallery({ images }) {
  const slides = images.map((image, index) => (
    <div key={index} className="slide">
      <img
        src={image.url}
        alt={image.alt}
        className="slide-image"
      />
      <div className="slide-caption">
        <h3>{image.title}</h3>
        <p>{image.description}</p>
      </div>
    </div>
  ));

  return (
    <div className="gallery-container">
      <Cycle
        items={slides}
        interval={5000}
        pauseOnHover={true}
        onCycle={(current, previous) => {
          // Update gallery indicators
          updateGalleryIndicators(current);
        }}
      />

      <div className="gallery-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
```

### News Ticker
```tsx
import { Cycle } from 'react-utility-kit';

function NewsTicker() {
  const newsItems = [
    <div className="news-item">
      <span className="news-label">BREAKING:</span>
      <span className="news-text">Major breakthrough in renewable energy technology</span>
    </div>,
    <div className="news-item">
      <span className="news-label">SPORTS:</span>
      <span className="news-text">Local team wins championship after 20-year drought</span>
    </div>,
    <div className="news-item">
      <span className="news-label">WEATHER:</span>
      <span className="news-text">Sunny skies expected this weekend with temperatures reaching 75°F</span>
    </div>,
    <div className="news-item">
      <span className="news-label">TECH:</span>
      <span className="news-text">New smartphone model features revolutionary battery technology</span>
    </div>
  ];

  return (
    <div className="news-ticker">
      <div className="ticker-label">NEWS</div>
      <div className="ticker-content">
        <Cycle
          items={newsItems}
          interval={3000}
          pauseOnHover={true}
        />
      </div>
    </div>
  );
}
```

### Product Showcase
```tsx
import { Cycle } from 'react-utility-kit';

function ProductShowcase({ products }) {
  const [isPlaying, setIsPlaying] = useState(true);

  const productSlides = products.map(product => (
    <div key={product.id} className="product-slide">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <div className="product-badge">{product.badge}</div>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-price">
$
{product.price}
        </p>
        <div className="product-rating">
          {'★'.repeat(product.rating)}
        </div>
        <button className="product-cta">View Details</button>
      </div>
    </div>
  ));

  return (
    <div className="product-showcase">
      <div className="showcase-header">
        <h2>Featured Products</h2>
        <div className="showcase-controls">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="play-pause-btn"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>

      <div className="showcase-content">
        <Cycle
          items={productSlides}
          interval={4000}
          autoStart={isPlaying}
          pauseOnHover={true}
          onCycle={(current, previous) => {
            // Track product showcase analytics
            analytics.track('product_showcase_viewed', {
              productId: products[current].id,
              position: current
            });
          }}
        />
      </div>
    </div>
  );
}
```

### Announcement Banner
```tsx
import { Cycle } from 'ui-magic-core';

function AnnouncementBanner() {
  const announcements = [
    <div className="announcement urgent">
      <span className="icon">🚨</span>
      <span>System maintenance scheduled for tonight 11 PM - 2 AM</span>
      <button className="close-btn">×</button>
    </div>,
    <div className="announcement info">
      <span className="icon">📢</span>
      <span>New features released! Check out our updated dashboard</span>
      <button className="close-btn">×</button>
    </div>,
    <div className="announcement success">
      <span className="icon">🎉</span>
      <span>Welcome to our new and improved platform!</span>
      <button className="close-btn">×</button>
    </div>
  ];

  return (
    <div className="announcement-banner">
      <Cycle
        items={announcements}
        interval={5000}
        pauseOnHover={true}
        onCycle={(current) => {
          // Log announcement views
          console.log(`Announcement ${current} displayed`);
        }}
      />
    </div>
  );
}
```

### Dashboard Metrics Rotation
```tsx
import { Cycle } from 'ui-magic-core';

function MetricsRotator() {
  const metrics = [
    <div className="metric-card">
      <h3>Total Revenue</h3>
      <div className="metric-value">$2,456,789</div>
      <div className="metric-change positive">+12.5%</div>
      <div className="metric-period">This Month</div>
    </div>,
    <div className="metric-card">
      <h3>Active Users</h3>
      <div className="metric-value">45,231</div>
      <div className="metric-change positive">+8.3%</div>
      <div className="metric-period">Last 30 Days</div>
    </div>,
    <div className="metric-card">
      <h3>Conversion Rate</h3>
      <div className="metric-value">3.24%</div>
      <div className="metric-change negative">-1.2%</div>
      <div className="metric-period">This Week</div>
    </div>,
    <div className="metric-card">
      <h3>Customer Satisfaction</h3>
      <div className="metric-value">4.8/5</div>
      <div className="metric-change positive">+0.3</div>
      <div className="metric-period">Current Rating</div>
    </div>
  ];

  return (
    <div className="metrics-rotator">
      <div className="widget-header">
        <h2>Key Metrics</h2>
        <div className="rotation-indicator">
          <div className="dot active"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>

      <Cycle
        items={metrics}
        interval={3500}
        pauseOnHover={true}
        onCycle={(current) => {
          // Update rotation indicator
          updateIndicator(current);
        }}
      />
    </div>
  );
}
```

## Performance Considerations

### 🚀 **Optimizations**
- **Efficient Timer Management**: Single interval timer with automatic cleanup
- **Minimal Re-renders**: State updates only when necessary
- **Memory Management**: Proper cleanup of timers and event listeners
- **Hover Detection**: Lightweight mouse event handling

### ⚠️ **Considerations**
- **Timer Precision**: Intervals may vary slightly due to JavaScript timing
- **Content Complexity**: Heavy content items may affect transition smoothness
- **Multiple Instances**: Many cycle components may impact performance

```tsx
// Good: Reasonable interval timing
<Cycle items={items} interval={3000} />

// Good: Optimized content
const optimizedItems = useMemo(() =>
  items.map(item => <OptimizedComponent key={item.id} {...item} />)
, [items]);

// Avoid: Very short intervals
<Cycle items={items} interval={100} /> // Too fast for users

// Avoid: Heavy unoptimized content
<Cycle items={heavyComponents} interval={1000} />
```

## Best Practices

### ✅ **Recommended**
- Use appropriate intervals (3-6 seconds for most content)
- Enable pause on hover for better user experience
- Provide visual indicators for multi-item cycles
- Keep content items similar in size and complexity
- Implement accessibility features for motion-sensitive users
- Use callbacks for analytics and state management

### ❌ **Avoid**
- Extremely fast cycling that may cause seizures or discomfort
- Auto-cycling critical information that users need time to read
- Mixed content types with vastly different reading times
- Heavy animations or transitions that conflict with cycling
- Cycling without any pause or control options

## Migration Guide

### From Manual State Management
```tsx
// Before: Manual cycling logic
function ManualCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [items.length]);

  return <div>{items[currentIndex]}</div>;
}

// After: Using Cycle component
function AutoCarousel() {
  return (
    <Cycle
      items={items}
      interval={3000}
      pauseOnHover={true}
    />
  );
}
```

### From Third-party Carousel Libraries
```tsx
// Before: Heavy carousel library
import { Carousel } from 'some-carousel-lib';

function HeavyCarousel() {
  return (
    <Carousel autoPlay interval={3000}>
      {items.map(item => (
        <CarouselItem key={item.id}>{item.content}</CarouselItem>
      ))}
    </Carousel>
  );
}

// After: Lightweight Cycle component
function LightCarousel() {
  const slideItems = items.map(item => (
    <div key={item.id} className="slide">
      {item.content}
    </div>
  ));

  return (
    <Cycle
      items={slideItems}
      interval={3000}
      pauseOnHover={true}
    />
  );
}
```

## Related Components

- **[`show`](../show/README.md)** - Conditional rendering for cycle states
- **[`animate`](../animate/README.md)** - Adding transitions between cycle items
- **[`timer`](../timer/README.md)** - Advanced timer and scheduling utilities

## Accessibility

The `Cycle` component should be implemented with accessibility in mind:

### Motion Sensitivity
- Respect `prefers-reduced-motion` CSS media query
- Provide pause controls for auto-cycling content
- Avoid rapid cycling that may trigger vestibular disorders

```tsx
// Accessible cycle implementation
function AccessibleCycle({ items, interval }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div>
      <Cycle
        items={items}
        interval={prefersReducedMotion ? 10000 : interval}
        pauseOnHover={true}
      />

      <div className="cycle-controls" role="group" aria-label="Carousel controls">
        <button aria-label="Pause carousel">⏸️</button>
        <button aria-label="Play carousel">▶️</button>
      </div>
    </div>
  );
}
```

### Screen Reader Support
- Use appropriate ARIA labels and live regions
- Announce content changes to screen readers
- Provide alternative navigation methods

```tsx
<div
  role="region"
  aria-label="Featured content carousel"
  aria-live="polite"
>
  <Cycle
    items={items}
    interval={4000}
    onCycle={(current) => {
      // Announce to screen readers
      announceToScreenReader(`Showing item ${current + 1} of ${items.length}`);
    }}
  />
</div>;
```

## Advanced Patterns

### Controlled Cycling
```tsx
function ControlledCycle() {
  const [isPaused, setIsPaused] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);

  return (
    <div>
      <Cycle
        items={items}
        interval={isPaused ? 0 : 3000}
        onCycle={current => setCurrentItem(current)}
      />

      <div className="controls">
        <button onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <span>
Item
{currentItem + 1}
{' '}
of
{items.length}
        </span>
      </div>
    </div>
  );
}
```

### Conditional Cycling
```tsx
function ConditionalCycle({ shouldCycle, items }) {
  return shouldCycle
? (
    <Cycle items={items} interval={3000} />
  )
: (
    <div>{items[0]}</div>
  );
}
```
- Use for step-based or cyclic UIs
- Prefer for carousels, toggles, and steppers

## New Props for Custom Rendering

### `renderItem`
- **Type**: `(item: ReactNode, index: number) => ReactNode`
- **Description**: A render-prop function to customize the rendering of each item in the cycle.
- **Example**:

```tsx
<Cycle
  items={items}
  interval={3000}
  renderItem={(item, index) => (
    <div className="custom-item" key={index}>
      {item}
    </div>
  )}
/>
```

### `renderIndicators`
- **Type**: `(currentIndex: number, totalItems: number) => ReactNode`
- **Description**: A render-prop function to customize the rendering of indicators.
- **Example**:

```tsx
<Cycle
  items={items}
  interval={3000}
  renderIndicators={(currentIndex, totalItems) => (
    <div className="custom-indicators">
      {Array.from({ length: totalItems }).map((_, index) => (
        <span
          key={index}
          className={index === currentIndex ? 'active' : ''}
        >
          {index + 1}
        </span>
      ))}
    </div>
  )}
/>
```
