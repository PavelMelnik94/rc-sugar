# Gate Component

A sophisticated audience targeting and access control utility for React applications, designed to conditionally render content based on environment detection, user agent analysis, and custom logic for precise audience segmentation.

## Description

The `Gate` component provides a declarative approach to audience-based conditional rendering in React applications. It intelligently detects the target audience (bots, humans, mobile devices, desktop, development/production environments) and renders appropriate content accordingly. This component is essential for creating responsive applications that adapt their behavior and content based on the viewing context, user agent, or environment.

## When to Use

- **Bot Detection**: Serving different content to web crawlers and search engines vs. human users
- **Device-Specific Rendering**: Showing different UI components for mobile vs. desktop users
- **Environment-Based Logic**: Rendering debug tools in development but hiding them in production
- **SEO Optimization**: Providing SEO-friendly content to bots while offering interactive experiences to users
- **Progressive Enhancement**: Starting with basic content for bots and enhancing for interactive users
- **A/B Testing**: Targeting specific audience segments for feature testing
- **Performance Optimization**: Loading lightweight content for resource-constrained environments
- **Accessibility**: Providing alternative content based on user agent capabilities

## How It Works

The `Gate` component uses intelligent detection mechanisms to:

1. **User Agent Analysis**: Analyzes browser user agent strings to identify bots, mobile devices, and browsers
2. **Environment Detection**: Determines if running in development or production environment
3. **Custom Detection Logic**: Supports custom detection functions for specific use cases
4. **Audience Targeting**: Matches detected characteristics against target audience specifications
5. **Fallback Rendering**: Provides graceful fallbacks for non-matching audiences

## Patterns Used

- **Strategy Pattern**: Different detection strategies for various audience types
- **Conditional Rendering Pattern**: Renders content based on audience detection
- **Environment Detection Pattern**: Adapts behavior based on runtime environment
- **Fallback Pattern**: Provides alternative content for non-target audiences
- **Custom Detection Pattern**: Allows custom audience detection logic
- **Type Safety**: Full TypeScript support with predefined audience types

## TypeScript Types

```typescript
/**
 * Target audience types for Gate component
 */
type GateTarget = 'bot' | 'human' | 'mobile' | 'desktop' | 'dev' | 'prod';

/**
 * Props for the Gate component
 */
interface GateProps {
  /** Target audience (single or multiple) */
  for: GateTarget | GateTarget[];
  /** Content to render for target audience */
  children: ReactNode;
  /** Fallback content for non-target audience */
  fallback?: ReactNode;
  /** Custom detection function */
  detect?: () => boolean;
}

/**
 * Detection result interface
 */
interface DetectionResult {
  isBot: boolean;
  isHuman: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  isDev: boolean;
  isProd: boolean;
}
```

## API Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `for` | `GateTarget \| GateTarget[]` | ✅ | - | Target audience(s) to render content for |
| `children` | `ReactNode` | ✅ | - | Content to render for target audience |
| `fallback` | `ReactNode` | | `null` | Alternative content for non-target audience |
| `detect` | `() => boolean` | | Built-in detection | Custom detection function |

## Examples

### Bot vs Human Detection
```tsx
import { Gate } from 'react-utility-kit';

function HomePage() {
  return (
    <div>
      <h1>Welcome to Our Website</h1>

      {/* SEO-optimized content for bots */}
      <Gate for="bot" fallback={null}>
        <div className="seo-content">
          <h2>About Our Services</h2>
          <p>We provide excellent web development services...</p>
          <nav>
            <a href="/services">Services</a>
            <a href="/contact">Contact</a>
            <a href="/blog">Blog</a>
          </nav>
        </div>
      </Gate>

      {/* Interactive content for humans */}
      <Gate for="human" fallback={<div>Loading...</div>}>
        <InteractiveHero />
        <DynamicNavigation />
        <LiveChatWidget />
      </Gate>
    </div>
  );
}
```

### Mobile vs Desktop Rendering
```tsx
function ResponsiveLayout() {
  return (
    <div className="app">
      {/* Mobile-optimized layout */}
      <Gate for="mobile">
        <MobileHeader />
        <MobileNavigation />
        <MobileMainContent />
        <MobileFooter />
      </Gate>

      {/* Desktop layout with sidebar */}
      <Gate for="desktop">
        <DesktopHeader />
        <div className="desktop-layout">
          <Sidebar />
          <DesktopMainContent />
        </div>
        <DesktopFooter />
      </Gate>
    </div>
  );
}
```

### Development vs Production Features
```tsx
function Application() {
  return (
    <div className="app">
      <Header />
      <MainContent />

      {/* Debug tools only in development */}
      <Gate for="dev">
        <DebugPanel />
        <PerformanceMonitor />
        <DevToolbar />
      </Gate>

      {/* Analytics only in production */}
      <Gate for="prod">
        <AnalyticsTracker />
        <ErrorBoundary />
        <ProductionOptimizations />
      </Gate>
    </div>
  );
}
```

### Multiple Target Audiences
```tsx
function AdminDashboard() {
  return (
    <div className="dashboard">
      {/* Show for both mobile and desktop humans */}
      <Gate for={['human']} fallback={<div>Please enable JavaScript</div>}>
        <UserInterface />
      </Gate>

      {/* Desktop-specific admin tools */}
      <Gate for="desktop">
        <AdvancedControls />
        <FullScreenGraphs />
      </Gate>

      {/* Mobile-specific simplified interface */}
      <Gate for="mobile" fallback={null}>
        <SimplifiedMobileControls />
        <TouchOptimizedInterface />
      </Gate>
    </div>
  );
}
```

### Custom Detection Logic
```tsx
function FeatureGate() {
  // Custom detection for specific browser capabilities
  const hasAdvancedFeatures = () => {
    return (
      'serviceWorker' in navigator
      && 'PushManager' in window
      && 'Notification' in window
    );
  };

  return (
    <div>
      <Gate
        for="human"
        detect={hasAdvancedFeatures}
        fallback={<BasicNotificationSystem />}
      >
        <AdvancedPushNotifications />
        <ServiceWorkerFeatures />
      </Gate>
    </div>
  );
}
```

### SEO Optimization Strategy
```tsx
function ProductPage({ product }) {
  return (
    <div>
      {/* Rich structured data for search engines */}
      <Gate for="bot">
        <ProductJsonLd product={product} />
        <SEOMetadata product={product} />
        <StaticProductInfo product={product} />
        <ServerRenderedReviews productId={product.id} />
      </Gate>

      {/* Interactive features for users */}
      <Gate for="human" fallback={<StaticProductInfo product={product} />}>
        <InteractiveProductGallery images={product.images} />
        <DynamicPricing productId={product.id} />
        <RealTimeInventory productId={product.id} />
        <UserReviews productId={product.id} />
        <RecommendationEngine userId={user.id} productId={product.id} />
      </Gate>
    </div>
  );
}
```

### Progressive Enhancement
```tsx
function ContactForm() {
  return (
    <div className="contact-section">
      {/* Basic form for all audiences */}
      <form action="/contact" method="POST">
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="Your Email" required />
        <textarea name="message" placeholder="Your Message" required />

        {/* Enhanced features for interactive users */}
        <Gate for="human" fallback={<button type="submit">Send Message</button>}>
          <FormValidation />
          <AutoSave />
          <CharacterCounter />
          <AttachmentUpload />
          <SubmitButton />
        </Gate>
      </form>

      {/* Contact info for bots (SEO) */}
      <Gate for="bot">
        <address>
          <p>Email: contact@example.com</p>
          <p>Phone: +1-555-123-4567</p>
          <p>Address: 123 Main St, City, State 12345</p>
        </address>
      </Gate>
    </div>
  );
}
```

### Environment-Specific Configuration
```tsx
function APIProvider({ children }) {
  return (
    <div>
      {/* Development configuration */}
      <Gate for="dev">
        <APIContext value={{
          baseURL: 'http://localhost:3001',
          debug: true,
          mockData: true,
          timeout: 10000
        }}
        >
          {children}
        </APIContext>
      </Gate>

      {/* Production configuration */}
      <Gate for="prod">
        <APIContext value={{
          baseURL: 'https://api.production.com',
          debug: false,
          mockData: false,
          timeout: 5000
        }}
        >
          {children}
        </APIContext>
      </Gate>
    </div>
  );
}
```

## Performance Considerations

- **Server-Side Rendering**: Gate detection works correctly during SSR for consistent rendering
- **Client-Side Hydration**: Handles hydration mismatches gracefully
- **Bundle Size**: Minimal overhead with tree-shaking support for unused detection logic
- **Detection Caching**: Results are cached to avoid repeated expensive detection operations
- **Fallback Performance**: Lightweight fallback content for non-target audiences

```tsx
// Performance optimized gate usage
function OptimizedGate({ children, ...props }) {
  // Memoize expensive detection logic
  const memoizedDetect = useCallback(() => {
    return expensiveDetectionLogic();
  }, []);

  return (
    <Gate detect={memoizedDetect} {...props}>
      {children}
    </Gate>
  );
}
```

## Best Practices

1. **Clear Audience Targeting**: Use specific and meaningful audience targets
2. **Graceful Fallbacks**: Always provide appropriate fallback content
3. **SEO Considerations**: Ensure bots receive meaningful, crawlable content
4. **Performance Impact**: Consider the performance implications of different audiences
5. **Testing Strategy**: Test all audience paths in your application
6. **Progressive Enhancement**: Start with basic functionality and enhance progressively

## Migration Guide

### From Conditional Rendering

**Before:**
```tsx
function Component() {
  const isMobile = /Mobile|Android|iPhone/.test(navigator.userAgent);

  return (
    <div>
      {isMobile ? <MobileUI /> : <DesktopUI />}
    </div>
  );
}
```

**After:**
```tsx
function Component() {
  return (
    <div>
      <Gate for="mobile">
        <MobileUI />
      </Gate>
      <Gate for="desktop">
        <DesktopUI />
      </Gate>
    </div>
  );
}
```

### From Environment Variables

**Before:**
```tsx
function App() {
  return (
    <div>
      <MainApp />
      {process.env.NODE_ENV === 'development' && <DevTools />}
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </div>
  );
}
```

**After:**
```tsx
function App() {
  return (
    <div>
      <MainApp />
      <Gate for="dev">
        <DevTools />
      </Gate>
      <Gate for="prod">
        <Analytics />
      </Gate>
    </div>
  );
}
```

## Related Components

- [`Show`](../show/README.md) - For simple conditional rendering
- [`Maybe`](../maybe/README.md) - For null-safe conditional rendering
- [`Switch`](../switch/README.md) - For multi-branch conditional logic
- [`If`](../if/README.md) - For complex conditional rendering patterns
