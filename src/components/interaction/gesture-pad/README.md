# GesturePad Component

A comprehensive gesture recognition component for React that handles touch and pointer interactions including swipes, taps, pinch, and long press gestures.

## Description

The `GesturePad` component provides a declarative and highly configurable way to handle complex touch gestures in React applications. It supports single and multi-touch interactions with customizable sensitivity, timing, and distance thresholds. Perfect for building mobile-first interfaces, image galleries, interactive dashboards, and touch-enabled applications.

## When to Use
- **Mobile Navigation**: Swipe gestures for page navigation, carousel controls, or drawer interactions
- **Image/Content Viewers**: Pinch-to-zoom, swipe navigation, and double-tap actions
- **Touch Interfaces**: Custom touch controls for tablets, kiosks, or mobile applications
- **Gaming/Interactive**: Gesture-based game controls or interactive educational content
- **Accessibility**: Alternative input methods for users with different interaction preferences

## Patterns Used
- **Event Delegation**: Efficient touch event handling with proper cleanup
- **Configuration Pattern**: Highly customizable gesture parameters and thresholds
- **Callback Pattern**: Clean separation of gesture detection and application logic
- **Touch State Management**: Proper tracking of multi-touch interactions and gesture timing
- **Performance Optimization**: Efficient event listeners with passive event handling

## Core Features

### Supported Gestures
- **Swipes**: Four-directional swipe detection (left, right, up, down)
- **Taps**: Single tap and double tap recognition with configurable timing
- **Long Press**: Configurable long press detection with automatic timeout
- **Pinch**: Two-finger pinch in/out gestures for zoom controls
- **Circle**: Circular gesture detection (future enhancement)

### Advanced Configuration
- **Sensitivity Control**: Fine-tune gesture detection sensitivity (0-1 scale)
- **Distance Thresholds**: Minimum swipe distances and touch tolerances
- **Timing Windows**: Configurable timeouts for taps, double taps, and long press
- **Touch Behavior**: Control over default touch behaviors and event prevention

## TypeScript Types

```typescript
/**
 * Touch point information with coordinates and identifier
 */
interface TouchPoint {
  /** X coordinate relative to viewport */
  x: number;
  /** Y coordinate relative to viewport */
  y: number;
  /** Unique touch identifier */
  id: number;
}

/**
 * Comprehensive gesture event handlers
 */
interface GestureHandlers {
  /** Triggered on left swipe gesture */
  swipeLeft?: () => void;
  /** Triggered on right swipe gesture */
  swipeRight?: () => void;
  /** Triggered on upward swipe gesture */
  swipeUp?: () => void;
  /** Triggered on downward swipe gesture */
  swipeDown?: () => void;
  /** Triggered on pinch in (zoom out) gesture */
  pinchIn?: () => void;
  /** Triggered on pinch out (zoom in) gesture */
  pinchOut?: () => void;
  /** Triggered on single tap */
  tap?: () => void;
  /** Triggered on double tap within time window */
  doubleTap?: () => void;
  /** Triggered after long press duration */
  longPress?: () => void;
  /** Triggered on circular gesture (future) */
  circle?: () => void;
}

/**
 * Comprehensive configuration options for gesture recognition
 */
interface GesturePadProps {
  /** Gesture event handlers */
  gestures: GestureHandlers;

  /**
   * Sensitivity for gesture detection (0-1)
   * Higher values = more sensitive detection
   * @default 0.7
   */
  sensitivity?: number;

  /**
   * Minimum distance for swipe gestures (pixels)
   * @default 50
   */
  minSwipeDistance?: number;

  /**
   * Maximum time for tap gestures (milliseconds)
   * @default 300
   */
  maxTapTime?: number;

  /**
   * Time required for long press (milliseconds)
   * @default 500
   */
  longPressTime?: number;

  /**
   * Time window for double tap detection (milliseconds)
   * @default 300
   */
  doubleTapWindow?: number;

  /** Child elements to wrap with gesture detection */
  children: ReactNode;

  /** Additional styles for the gesture container */
  style?: CSSProperties;

  /**
   * Whether to prevent default touch behavior
   * Prevents scrolling, zooming, and other browser touch actions
   * @default true
   */
}
```

## Usage Examples

### Basic Touch Navigation

```tsx
import { GesturePad } from 'ui-magic-core/gesture-pad';

function ImageGallery() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <GesturePad
      gestures={{
        swipeLeft: () => setCurrentImage(prev => prev + 1),
        swipeRight: () => setCurrentImage(prev => Math.max(0, prev - 1)),
        doubleTap: () => setIsZoomed(!isZoomed),
        pinchOut: () => setIsZoomed(true),
        pinchIn: () => setIsZoomed(false)
      }}
      sensitivity={0.8}
      minSwipeDistance={30}
    >
      <div className={`image-container ${isZoomed ? 'zoomed' : ''}`}>
        <img src={images[currentImage]} alt="Gallery" />
        <div className="image-counter">
          {currentImage + 1}
{' '}
/
{images.length}
        </div>
      </div>
    </GesturePad>
  );
}
```

### Mobile Menu with Gesture Controls

```tsx
import { GesturePad } from 'ui-magic-core/gesture-pad';

function MobileApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  return (
    <GesturePad
      gestures={{
        swipeRight: () => setSidebarOpen(true),
        swipeLeft: () => setSidebarOpen(false),
        swipeDown: () => setNotifications([]),
        longPress: () => showContextMenu()
      }}
      minSwipeDistance={60}
      longPressTime={600}
    >
      <div className="app-container">
        <Header />
        <MainContent />
        <Sidebar isOpen={sidebarOpen} />
      </div>
    </GesturePad>
  );
}
```

### Interactive Game Controls

```tsx
import { GesturePad } from 'ui-magic-core/gesture-pad';

function GameBoard() {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [isAttacking, setIsAttacking] = useState(false);

  return (
    <GesturePad
      gestures={{
        swipeUp: () => movePlayer('up'),
        swipeDown: () => movePlayer('down'),
        swipeLeft: () => movePlayer('left'),
        swipeRight: () => movePlayer('right'),
        tap: () => selectTarget(),
        doubleTap: () => performAttack(),
        longPress: () => openInventory()
      }}
      sensitivity={0.9}
      doubleTapWindow={250}
      preventDefault={true}
    >
      <div className="game-board">
        <Player position={playerPosition} attacking={isAttacking} />
        <GameObjects />
        <UI />
      </div>
    </GesturePad>
  );
}
```

### Content Viewer with Zoom Controls

```tsx
import { GesturePad } from 'ui-magic-core/gesture-pad';

function DocumentViewer() {
  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(1);

  const handlePinchIn = useCallback(() => {
    setZoom(prev => Math.max(0.5, prev - 0.2));
  }, []);

  const handlePinchOut = useCallback(() => {
    setZoom(prev => Math.min(3, prev + 0.2));
  }, []);

  return (
    <GesturePad
      gestures={{
        swipeLeft: () => setPage(prev => prev + 1),
        swipeRight: () => setPage(prev => Math.max(1, prev - 1)),
        pinchIn: handlePinchIn,
        pinchOut: handlePinchOut,
        doubleTap: () => setZoom(zoom === 1 ? 2 : 1)
      }}
      sensitivity={0.7}
    >
      <div
        className="document-viewer"
        style={{ transform: `scale(${zoom})` }}
      >
        <DocumentPage page={page} />
        <PageControls currentPage={page} totalPages={totalPages} />
      </div>
    </GesturePad>
  );
}
```

## Advanced Configuration

### Fine-tuning Gesture Detection

```tsx
// High sensitivity for precise interactions
<GesturePad
  gestures={handlers}
  sensitivity={0.9}
  minSwipeDistance={20}
  maxTapTime={200}
  longPressTime={300}
  doubleTapWindow={200}
/>

// Conservative settings for stable interactions
<GesturePad
  gestures={handlers}
  sensitivity={0.5}
  minSwipeDistance={80}
  maxTapTime={400}
  longPressTime={800}
  doubleTapWindow={400}
/>
```

### Custom Gesture Combinations

```tsx
function AdvancedGestureHandler() {
  const [gestureState, setGestureState] = useState({
    lastGesture: null,
    gestureCount: 0,
    comboActive: false
  });

  const handleGestureCombo = (gesture: string) => {
    setGestureState(prev => ({
      lastGesture: gesture,
      gestureCount: prev.lastGesture === gesture ? prev.gestureCount + 1 : 1,
      comboActive: true
    }));

    // Reset combo after delay
    setTimeout(() => {
      setGestureState(prev => ({ ...prev, comboActive: false }));
    }, 1000);
  };

  return (
    <GesturePad
      gestures={{
        swipeLeft: () => handleGestureCombo('swipeLeft'),
        swipeRight: () => handleGestureCombo('swipeRight'),
        doubleTap: () => executeCombo(),
        longPress: () => showGestureHelp()
      }}
    >
      <GameInterface
        comboState={gestureState}
        onComboComplete={executeSpecialMove}
      />
    </GesturePad>
  );
}
```

## Performance Considerations

### Optimization Strategies

1. **Event Handler Memoization**
```tsx
const gestureHandlers = useMemo(() => ({
  swipeLeft: () => navigate('next'),
  swipeRight: () => navigate('prev'),
  doubleTap: () => toggleZoom()
}), [navigate, toggleZoom]);

<GesturePad gestures={gestureHandlers}>
```

2. **Conditional Gesture Registration**
```tsx
const gestures = useMemo(() => {
  const handlers: GestureHandlers = {};

  if (canNavigate) {
    handlers.swipeLeft = handleSwipeLeft;
    handlers.swipeRight = handleSwipeRight;
  }

  if (canZoom) {
    handlers.pinchIn = handlePinchIn;
    handlers.pinchOut = handlePinchOut;
  }

  return handlers;
}, [canNavigate, canZoom,]);
```

3. **Throttled Gesture Responses**
```tsx
const throttledSwipe = useCallback(
  throttle((direction: string) => {
    handleSwipe(direction);
  }, 100),
  [handleSwipe]
);

const gestures = {
  swipeLeft: () => throttledSwipe('left'),
  swipeRight: () => throttledSwipe('right')
};
```

## Accessibility Considerations

### Keyboard and Screen Reader Support

```tsx
function AccessibleGestureArea() {
  return (
    <GesturePad
      gestures={{
        swipeLeft: nextSlide,
        swipeRight: prevSlide,
        doubleTap: togglePlayback
      }}
    >
      <div
        role="region"
        aria-label="Interactive slide viewer"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft')
prevSlide();
          if (e.key === 'ArrowRight')
nextSlide();
          if (e.key === ' ')
togglePlayback();
        }}
      >
        <SlideContent />
        <VisualGestureIndicators />
      </div>
    </GesturePad>
  );
}
```

### Reduced Motion Support

```tsx
function MotionAwareGestures() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const sensitivity = prefersReducedMotion ? 0.5 : 0.8;
  const minDistance = prefersReducedMotion ? 80 : 50;

  return (
    <GesturePad
      gestures={handlers}
      sensitivity={sensitivity}
      minSwipeDistance={minDistance}
    >
      <Content />
    </GesturePad>
  );
}
```

## Best Practices

### 1. Gesture Feedback
Always provide visual or haptic feedback for recognized gestures:

```tsx
const [gestureActive, setGestureActive] = useState(false);

const gestures = {
  swipeLeft: () => {
    setGestureActive(true);
    navigator.vibrate?.(50); // Haptic feedback
    setTimeout(() => setGestureActive(false), 200);
    handleSwipe();
  }
};
```

### 2. Graceful Degradation
Provide alternative interaction methods for non-touch devices:

```tsx
function ResponsiveInterface() {
  const hasTouch = 'ontouchstart' in window;

  if (!hasTouch) {
    return <KeyboardInterface />;
  }

  return (
    <GesturePad gestures={handlers}>
      <TouchInterface />
    </GesturePad>
  );
}
```

### 3. Context-Aware Gestures
Adapt gesture behavior based on application state:

```tsx
const gestures = useMemo(() => {
  if (isEditing) {
    return {
      longPress: showEditMenu,
      doubleTap: selectWord
    };
  }

  return {
    swipeLeft: nextPage,
    swipeRight: prevPage,
    doubleTap: toggleZoom
  };
}, [isEditing]);
```

### 4. Gesture Conflicts Prevention
Avoid conflicting gestures and provide clear interaction patterns:

```tsx
// Good: Clear, non-conflicting gestures
const gestures = {
  swipeLeft: navigate, // Horizontal movement
  swipeUp: showMenu, // Vertical movement
  doubleTap: zoom, // Tap interaction
  longPress: contextMenu // Time-based interaction
};

// Avoid: Conflicting or ambiguous gestures
const problematicGestures = {
  swipeLeft: action1,
  swipeRight: action2,
  tap: action3,
  doubleTap: action4 // May conflict with tap
};
```

## Related Components

- [`focus`](../focus/README.md) - Focus management for gesture interactions
- [`scroll`](../scroll/README.md) - Scroll behavior that works with gestures
- [`zoom`](../zoom/README.md) - Zoom controls that complement pinch gestures
- [`bound`](../bound/README.md) - Boundary constraints for gesture areas

## Migration Guide

### From Touch Event Handlers

**Before:**
```tsx
const handleTouchStart = (e) => { /* manual touch handling */ };
const handleTouchMove = (e) => { /* manual gesture detection */ };
const handleTouchEnd = (e) => { /* manual gesture recognition */ };

<div
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>
```

**After:**
```tsx
<GesturePad
  gestures={{
    swipeLeft: handleSwipeLeft,
    doubleTap: handleDoubleTap,
    pinchOut: handlePinchOut
  }}
>
```

### From React Touch Libraries

**Before:**
```tsx
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedLeft: handleLeft,
  onSwipedRight: handleRight
});

<div {...handlers}>
```

**After:**
```tsx
<GesturePad
  gestures={{
    swipeLeft: handleLeft,
    swipeRight: handleRight,
    pinchIn: handlePinchIn,
    longPress: handleLongPress
  }}
>
```
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  onTap?: () => void;
  onDrag?: (delta: { x: number; y: number }) => void;
  children: React.ReactNode;
}
```

## API
| Prop        | Type                                         | Required | Description                  |
|-------------|----------------------------------------------|----------|------------------------------|
| `onSwipe`   | `(direction: 'left' | 'right' | 'up' | 'down') => void` |          | Swipe event handler         |
| `onTap`     | `() => void`                                 |          | Tap event handler           |
| `onDrag`    | `(delta: { x: number; y: number }) => void`  |          | Drag event handler          |
| `children`  | `ReactNode`                                  | ✅       | Content to render           |

## Examples
### Basic Usage
```tsx
import { GesturePad } from 'rc-sugar';

<GesturePad onSwipe={dir => alert(dir)}>
  <div>Swipe me!</div>
</GesturePad>
```

## Best Practices
- Use for mobile and touch UIs
- Prefer for custom gesture logic
