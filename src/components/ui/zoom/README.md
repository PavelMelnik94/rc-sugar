# Zoom Component

An intelligent automatic scaling component that dynamically adjusts content size to fit containers with customizable constraints and smooth transitions. Perfect for responsive images, charts, diagrams, and any content that needs adaptive scaling.

## Description

The `Zoom` component provides sophisticated automatic scaling capabilities for React applications. It intelligently calculates optimal scale factors based on container dimensions and content size, with support for width/height fitting modes, centering, scale bounds, and smooth transitions. The component uses ResizeObserver for efficient responsive behavior and handles complex scaling scenarios with ease.

## When to Use
- **Responsive Images**: Automatically scale images to fit containers while maintaining aspect ratio
- **Chart/Graph Display**: Ensure data visualizations fit perfectly in dashboard panels
- **Document Viewers**: Scale PDF pages, diagrams, or technical drawings to optimal viewing size
- **Dashboard Widgets**: Automatically size widget content to available space
- **Mobile Interfaces**: Adapt large content for different screen sizes
- **Print Layouts**: Scale content for print preview or different paper sizes
- **Interactive Galleries**: Automatic scaling for varying content sizes

## Patterns Used
- **Responsive Design**: Automatic adaptation to container size changes
- **Observer Pattern**: ResizeObserver for efficient dimension monitoring
- **Transform-based Scaling**: CSS transforms for smooth, performant scaling
- **Constraint Satisfaction**: Intelligent scale calculation within bounds
- **Performance Optimization**: Efficient recomputation and smooth transitions

## TypeScript Types

```typescript
import { ReactNode } from 'react';

/**
 * Props for the Zoom component
 */
interface ZoomProps {
  /** Content to be automatically scaled */
  children: ReactNode;

  /**
   * Maximum scale factor allowed
   * @default 2
   */
  maxScale?: number;

  /**
   * Minimum scale factor allowed
   * @default 0.1
   */
  minScale?: number;

  /**
   * Whether to fit content to container width
   * @default false
   */
  fitWidth?: boolean;

  /**
   * Whether to fit content to container height
   * @default false
   */
  fitHeight?: boolean;

  /**
   * Whether to center content in container
   * @default true
   */
  center?: boolean;

  /**
   * Custom scale override (disables automatic calculation)
   */
  scale?: number;

  /**
   * Callback fired when scale changes
   * @param scale - The new scale value
   */
  onScaleChange?: (scale: number) => void;
}

/** Zoom component type */
declare const Zoom: React.FC<ZoomProps> & {
  displayName: string;
};
```

## Usage Examples

### Responsive Image Gallery

```tsx
import { Zoom } from 'ui-magic-core/zoom';

function ResponsiveGallery() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentScale, setCurrentScale] = useState(1);

  const images = [
    { src: '/landscape1.jpg', alt: 'Mountain landscape', aspectRatio: 16 / 9 },
    { src: '/portrait1.jpg', alt: 'City portrait', aspectRatio: 9 / 16 },
    { src: '/square1.jpg', alt: 'Abstract art', aspectRatio: 1 }
  ];

  return (
    <div className="gallery-container">
      <div className="image-viewer" style={{ height: '400px', width: '100%' }}>
        <Zoom
          fitWidth
          fitHeight
          maxScale={3}
          minScale={0.5}
          center
          onScaleChange={setCurrentScale}
        >
          <img
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
            style={{ maxWidth: 'none', height: 'auto' }}
          />
        </Zoom>
      </div>

      <div className="gallery-info">
        <span>
Scale:
{(currentScale * 100).toFixed(1)}
%
        </span>
        <span>
Image:
{selectedImage + 1}
/
{images.length}
        </span>
      </div>

      <div className="gallery-controls">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={index === selectedImage ? 'active' : ''}
          >
            Image
{' '}
{index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Dashboard Chart Auto-Scaling

```tsx
import { Zoom } from 'ui-magic-core/zoom';

function DashboardPanel() {
  const [chartData, setChartData] = useState(generateChartData());
  const [panelSize, setPanelSize] = useState('medium');

  const panelSizes = {
    small: { width: '300px', height: '200px' },
    medium: { width: '500px', height: '300px' },
    large: { width: '800px', height: '500px' }
  };

  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <h3>Sales Analytics</h3>
        <select
          value={panelSize}
          onChange={e => setPanelSize(e.target.value)}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div
        className="chart-container"
        style={panelSizes[panelSize]}
      >
        <Zoom
          fitWidth
          fitHeight
          maxScale={1.2}
          minScale={0.6}
          onScaleChange={(scale) => {
            console.log(`Chart scaled to ${(scale * 100).toFixed(1)}%`);
          }}
        >
          <div className="chart-content">
            <svg width="600" height="400" viewBox="0 0 600 400">
              {/* Complex chart rendering */}
              <g className="chart-bars">
                {chartData.map((value, index) => (
                  <rect
                    key={index}
                    x={index * 60 + 50}
                    y={350 - value * 3}
                    width="40"
                    height={value * 3}
                    fill="#4CAF50"
                  />
                ))}
              </g>
              <g className="chart-labels">
                {chartData.map((value, index) => (
                  <text
                    key={index}
                    x={index * 60 + 70}
                    y={370}
                    textAnchor="middle"
                    fontSize="12"
                  >
                    Q
{index + 1}
                  </text>
                ))}
              </g>
            </svg>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color"></span>
                Quarterly Sales ($K)
              </div>
            </div>
          </div>
        </Zoom>
      </div>
    </div>
  );
}
```

### Document Viewer with Zoom Controls

```tsx
import { Zoom } from 'ui-magic-core/zoom';

function DocumentViewer() {
  const [customScale, setCustomScale] = useState<number | undefined>(undefined);
  const [autoScale, setAutoScale] = useState(true);
  const [fitMode, setFitMode] = useState<'width' | 'height' | 'both'>('width');

  const handleScalePreset = (scale: number) => {
    setCustomScale(scale);
    setAutoScale(false);
  };

  const handleAutoFit = () => {
    setCustomScale(undefined);
    setAutoScale(true);
  };

  return (
    <div className="document-viewer">
      <div className="viewer-toolbar">
        <div className="zoom-controls">
          <button onClick={() => handleScalePreset(0.5)}>50%</button>
          <button onClick={() => handleScalePreset(0.75)}>75%</button>
          <button onClick={() => handleScalePreset(1)}>100%</button>
          <button onClick={() => handleScalePreset(1.25)}>125%</button>
          <button onClick={() => handleScalePreset(1.5)}>150%</button>
          <button onClick={handleAutoFit} className={autoScale ? 'active' : ''}>
            Auto Fit
          </button>
        </div>

        {autoScale && (
          <div className="fit-controls">
            <select
              value={fitMode}
              onChange={e => setFitMode(e.target.value as any)}
            >
              <option value="width">Fit Width</option>
              <option value="height">Fit Height</option>
              <option value="both">Fit Both</option>
            </select>
          </div>
        )}
      </div>

      <div className="document-container" style={{ height: '600px' }}>
        <Zoom
          scale={customScale}
          fitWidth={autoScale && (fitMode === 'width' || fitMode === 'both')}
          fitHeight={autoScale && (fitMode === 'height' || fitMode === 'both')}
          maxScale={5}
          minScale={0.1}
          center
          onScaleChange={(scale) => {
            if (autoScale) {
              console.log(`Auto-scaled to ${(scale * 100).toFixed(1)}%`);
            }
          }}
        >
          <div className="document-page">
            <div className="page-content">
              <h1>Document Title</h1>
              <p>This is a sample document that demonstrates automatic scaling...</p>
              <div className="document-body">
                {/* Large document content */}
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                <img src="/document-image.png" alt="Diagram" />
                <table>
                  <thead>
                    <tr>
                      <th>Column 1</th>
                      <th>Column 2</th>
                      <th>Column 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Data 1</td>
                      <td>Data 2</td>
                      <td>Data 3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Zoom>
      </div>
    </div>
  );
}
```

### Mobile-Responsive Widget

```tsx
import { Zoom } from 'ui-magic-core/zoom';

function MobileWidget() {
  const [orientation, setOrientation] = useState('portrait');
  const [scaleInfo, setScaleInfo] = useState({ scale: 1, mode: 'auto' });

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return (
    <div className={`mobile-widget ${orientation}`}>
      <div className="widget-header">
        <h3>Mobile Dashboard</h3>
        <div className="scale-indicator">
          Scale:
{' '}
{(scaleInfo.scale * 100).toFixed(0)}
%
        </div>
      </div>

      <div className="widget-content">
        <Zoom
          fitWidth={orientation === 'portrait'}
          fitHeight={orientation === 'landscape'}
          maxScale={2}
          minScale={0.3}
          center
          onScaleChange={(scale) => {
            setScaleInfo({
              scale,
              mode: orientation === 'portrait' ? 'fit-width' : 'fit-height'
            });
          }}
        >
          <div className="dashboard-content">
            <div className="metrics-grid">
              <div className="metric-card">
                <h4>Users</h4>
                <div className="metric-value">1,234</div>
              </div>
              <div className="metric-card">
                <h4>Sales</h4>
                <div className="metric-value">$45.6K</div>
              </div>
              <div className="metric-card">
                <h4>Conversion</h4>
                <div className="metric-value">3.2%</div>
              </div>
              <div className="metric-card">
                <h4>Growth</h4>
                <div className="metric-value">+12%</div>
              </div>
            </div>

            <div className="chart-section">
              <div className="mini-chart">
                <svg width="300" height="150" viewBox="0 0 300 150">
                  <polyline
                    points="10,140 50,120 90,100 130,80 170,90 210,70 250,60 290,50"
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Zoom>
      </div>
    </div>
  );
}
```

### Print Layout Scaling

```tsx
import { Zoom } from 'ui-magic-core/zoom';

function PrintPreview() {
  const [paperSize, setPaperSize] = useState('A4');
  const [currentScale, setCurrentScale] = useState(1);

  const paperSizes = {
    A4: { width: '210mm', height: '297mm' },
    Letter: { width: '8.5in', height: '11in' },
    Legal: { width: '8.5in', height: '14in' }
  };

  return (
    <div className="print-preview">
      <div className="print-controls">
        <select
          value={paperSize}
          onChange={e => setPaperSize(e.target.value)}
        >
          <option value="A4">A4</option>
          <option value="Letter">Letter</option>
          <option value="Legal">Legal</option>
        </select>

        <div className="scale-info">
          Current Scale:
{' '}
{(currentScale * 100).toFixed(1)}
%
        </div>

        <button onClick={() => window.print()}>
          Print Document
        </button>
      </div>

      <div
        className="paper-container"
        style={{
          width: paperSizes[paperSize].width,
          height: paperSizes[paperSize].height,
          maxWidth: '100%',
          maxHeight: '80vh',
          margin: '0 auto',
          backgroundColor: 'white',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Zoom
          fitWidth
          fitHeight
          maxScale={1}
          minScale={0.1}
          center
          onScaleChange={setCurrentScale}
        >
          <div className="document-content" style={{ padding: '1in' }}>
            <header className="document-header">
              <h1>Business Report</h1>
              <div className="header-info">
                <div>
Date:
{new Date().toLocaleDateString()}
                </div>
                <div>
Paper:
{paperSize}
                </div>
              </div>
            </header>

            <main className="document-body">
              <section>
                <h2>Executive Summary</h2>
                <p>This report provides a comprehensive overview...</p>
              </section>

              <section>
                <h2>Financial Data</h2>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Quarter</th>
                      <th>Revenue</th>
                      <th>Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Q1 2024</td>
                      <td>$125,000</td>
                      <td>+15%</td>
                    </tr>
                    <tr>
                      <td>Q2 2024</td>
                      <td>$143,750</td>
                      <td>+12%</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </main>

            <footer className="document-footer">
              <div>Page 1 of 1</div>
              <div>
Scale:
{(currentScale * 100).toFixed(1)}
%
              </div>
            </footer>
          </div>
        </Zoom>
      </div>
    </div>
  );
}
```

```

## Advanced Configuration

### Custom Scale Control

```tsx
function CustomZoomControls() {
  const [manualScale, setManualScale] = useState<number | undefined>(undefined);
  const [isAutoMode, setIsAutoMode] = useState(true);

  return (
    <div className="zoom-container">
      <div className="zoom-controls">
        <button
          onClick={() => {
            setIsAutoMode(true);
            setManualScale(undefined);
          }}
          className={isAutoMode ? 'active' : ''}
        >
          Auto Fit
        </button>

        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={manualScale || 1}
          onChange={(e) => {
            setManualScale(Number(e.target.value));
            setIsAutoMode(false);
          }}
          disabled={isAutoMode}
        />

        <span>{((manualScale || 1) * 100).toFixed(0)}%</span>
      </div>

      <div className="content-area" style={{ height: '400px' }}>
        <Zoom
          scale={manualScale}
          fitWidth={isAutoMode}
          fitHeight={isAutoMode}
          maxScale={3}
          minScale={0.1}
          onScaleChange={(scale) => {
            if (isAutoMode) {
              console.log(`Auto scale: ${scale}`);
            }
          }}
        >
          <div className="scalable-content">
            <h2>Scalable Content</h2>
            <p>This content adapts to different zoom levels...</p>
          </div>
        </Zoom>
      </div>
    </div>
  );
}
```

### Responsive Breakpoint Scaling

```tsx
function ResponsiveZoom() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive scale constraints
  const getScaleConstraints = () => {
    if (windowSize.width < 768) {
      return { maxScale: 1.5, minScale: 0.5 }; // Mobile
    }
 else if (windowSize.width < 1024) {
      return { maxScale: 2, minScale: 0.3 }; // Tablet
    }
 else {
      return { maxScale: 3, minScale: 0.1 }; // Desktop
    }
  };

  const { maxScale, minScale } = getScaleConstraints();

  return (
    <div className="responsive-zoom">
      <div className="device-info">
        <span>
Device:
{windowSize.width}
x
{windowSize.height}
        </span>
        <span>
Scale Range:
{(minScale * 100).toFixed(0)}
%-
{(maxScale * 100).toFixed(0)}
%
        </span>
      </div>

      <Zoom
        fitWidth
        maxScale={maxScale}
        minScale={minScale}
        center
      >
        <div className="responsive-content">
          <h1>Responsive Design</h1>
          <div className="content-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="grid-item">
                Item
{' '}
{i + 1}
              </div>
            ))}
          </div>
        </div>
      </Zoom>
    </div>
  );
}
```

### Animation and Transition Control

```tsx
function AnimatedZoom() {
  const [targetScale, setTargetScale] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const animateToScale = (scale: number) => {
    setIsAnimating(true);
    setTargetScale(scale);

    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="animated-zoom">
      <div className="animation-controls">
        <button onClick={() => animateToScale(0.5)}>Zoom Out</button>
        <button onClick={() => animateToScale(1)}>Reset</button>
        <button onClick={() => animateToScale(1.5)}>Zoom In</button>
        <div className={`animation-indicator ${isAnimating ? 'active' : ''}`}>
          {isAnimating ? 'Animating...' : 'Ready'}
        </div>
      </div>

      <div className="zoom-content">
        <Zoom
          scale={targetScale}
          maxScale={2}
          minScale={0.25}
          center
          onScaleChange={(scale) => {
            console.log(`Scale changed to: ${scale}`);
          }}
        >
          <div className="animated-content">
            <div className="zoom-target">
              <h3>Animated Scaling</h3>
              <p>Watch this content smoothly scale in and out</p>
              <div className="visual-indicator">
                <div className="scale-circle"></div>
              </div>
            </div>
          </div>
        </Zoom>
      </div>
    </div>
  );
}
```

## Performance Considerations

### Optimizing Large Content

```tsx
function OptimizedZoom() {
  const [isVisible, setIsVisible] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Virtualization for large datasets
  const [visibleItems, setVisibleItems] = useState({ start: 0, end: 50 });
  const allItems = useMemo(() =>
    Array.from({ length: 1000 }, (_, i) => ({ id: i, value: `Item ${i}` })), []);

  const handleScaleChange = useCallback((scale: number) => {
    // Adjust virtualization based on scale
    const itemsPerView = Math.floor(50 / scale);
    setVisibleItems({ start: 0, end: Math.min(itemsPerView, allItems.length) });
  }, [allItems.length]);

  return (
    <div className="optimized-zoom">
      <div className="performance-controls">
        <button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'Hide' : 'Show'}
{' '}
Content
        </button>
        <span>
Showing
{visibleItems.end - visibleItems.start}
{' '}
of
{allItems.length}
{' '}
items
        </span>
      </div>

      {isVisible && (
        <div className="zoom-viewport" style={{ height: '400px' }}>
          <Zoom
            fitWidth
            maxScale={2}
            minScale={0.1}
            onScaleChange={handleScaleChange}
          >
            <div ref={contentRef} className="large-content">
              {allItems.slice(visibleItems.start, visibleItems.end).map(item => (
                <div key={item.id} className="content-item">
                  {item.value}
                </div>
              ))}
            </div>
          </Zoom>
        </div>
      )}
    </div>
  );
}
```

### Debounced Scale Updates

```tsx
function DebouncedZoom() {
  const [scaleHistory, setScaleHistory] = useState<number[]>([]);

  const debouncedScaleChange = useMemo(
    () => debounce((scale: number) => {
      setScaleHistory(prev => [...prev.slice(-9), scale]);
      // Heavy computation or API calls here
      console.log('Debounced scale update:', scale);
    }, 300),
    []
  );

  return (
    <div className="debounced-zoom">
      <div className="scale-history">
        <h4>Scale History (Debounced)</h4>
        <div className="history-items">
          {scaleHistory.map((scale, index) => (
            <span key={index} className="history-item">
              {(scale * 100).toFixed(1)}
%
            </span>
          ))}
        </div>
      </div>

      <Zoom
        fitWidth
        fitHeight
        maxScale={3}
        minScale={0.2}
        onScaleChange={debouncedScaleChange}
      >
        <div className="heavy-content">
          <h2>Heavy Content</h2>
          <p>Scale changes are debounced for performance</p>
          {/* Simulate heavy content */}
          <div className="content-grid">
            {Array.from({ length: 100 }, (_, i) => (
              <div key={i} className="grid-cell">
                Cell
{' '}
{i}
              </div>
            ))}
          </div>
        </div>
      </Zoom>
    </div>
  );
}
```

## Integration with Other Components

### Zoom with Gesture Controls

```tsx
import { GesturePad } from 'ui-magic-core/gesture-pad';

function GestureZoom() {
  const [customScale, setCustomScale] = useState<number | undefined>(undefined);
  const [lastGesture, setLastGesture] = useState('');

  const handlePinchIn = () => {
    setCustomScale(prev => Math.max(0.1, (prev || 1) * 0.8));
    setLastGesture('Pinch In');
  };

  const handlePinchOut = () => {
    setCustomScale(prev => Math.min(3, (prev || 1) * 1.25));
    setLastGesture('Pinch Out');
  };

  const handleDoubleTap = () => {
    setCustomScale(customScale === 1 ? 2 : 1);
    setLastGesture('Double Tap');
  };

  return (
    <div className="gesture-zoom">
      <div className="gesture-info">
        <span>
Last Gesture:
{lastGesture}
        </span>
        <span>
Scale:
{((customScale || 1) * 100).toFixed(0)}
%
        </span>
      </div>

      <GesturePad
        gestures={{
          pinchIn: handlePinchIn,
          pinchOut: handlePinchOut,
          doubleTap: handleDoubleTap
        }}
      >
        <Zoom
          scale={customScale}
          maxScale={3}
          minScale={0.1}
          center
        >
          <div className="gesture-content">
            <h2>Gesture-Controlled Zoom</h2>
            <p>Use pinch gestures or double-tap to zoom</p>
            <img src="/sample-image.jpg" alt="Sample" />
          </div>
        </Zoom>
      </GesturePad>
    </div>
  );
}
```

### Zoom with Bounds

```tsx
import { Bound } from 'ui-magic-core/bound';

function BoundedZoom() {
  const [rawScale, setRawScale] = useState(1);

  return (
    <div className="bounded-zoom">
      <div className="scale-controls">
        <input
          type="range"
          min="-2"
          max="5"
          step="0.1"
          value={rawScale}
          onChange={e => setRawScale(Number(e.target.value))}
        />
        <span>
Raw Input:
{rawScale}
        </span>
      </div>

      <Bound
        value={rawScale}
        min={0.1}
        max={3}
        onClamp={(original, clamped) => {
          console.log(`Scale clamped: ${original} → ${clamped}`);
        }}
      >
        {boundedScale => (
          <Zoom
            scale={boundedScale}
            center
          >
            <div className="bounded-content">
              <h2>Bounded Zoom</h2>
              <p>Scale is automatically bounded between 0.1x and 3x</p>
              <div className="scale-indicator">
                Current Scale:
{' '}
{(boundedScale * 100).toFixed(1)}
%
              </div>
            </div>
          </Zoom>
        )}
      </Bound>
    </div>
  );
}
```

## Accessibility Considerations

### Screen Reader Support

```tsx
function AccessibleZoom() {
  const [currentScale, setCurrentScale] = useState(1);

  return (
    <div className="accessible-zoom">
      <div
        className="zoom-status"
        role="status"
        aria-live="polite"
        aria-label={`Content scaled to ${(currentScale * 100).toFixed(0)} percent`}
      >
        <span className="sr-only">
          Content is currently scaled to
{' '}
{(currentScale * 100).toFixed(0)}
%
        </span>
      </div>

      <div className="zoom-controls" role="group" aria-label="Zoom controls">
        <button
          onClick={() => setCurrentScale(prev => Math.max(0.1, prev * 0.8))}
          aria-label="Zoom out"
        >
          Zoom Out
        </button>
        <button
          onClick={() => setCurrentScale(1)}
          aria-label="Reset zoom to 100%"
        >
          Reset
        </button>
        <button
          onClick={() => setCurrentScale(prev => Math.min(3, prev * 1.25))}
          aria-label="Zoom in"
        >
          Zoom In
        </button>
      </div>

      <Zoom
        scale={currentScale}
        maxScale={3}
        minScale={0.1}
        center
        onScaleChange={setCurrentScale}
      >
        <div
          className="zoomable-content"
          role="img"
          aria-label="Zoomable diagram"
        >
          <h2>Accessible Content</h2>
          <p>This content can be zoomed for better visibility</p>
        </div>
      </Zoom>
    </div>
  );
}
```

### Keyboard Navigation

```tsx
function KeyboardZoom() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          setScale(prev => Math.min(3, prev * 1.1));
        }
 else if (e.key === '-') {
          e.preventDefault();
          setScale(prev => Math.max(0.1, prev * 0.9));
        }
 else if (e.key === '0') {
          e.preventDefault();
          setScale(1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="keyboard-zoom"
      tabIndex={0}
      role="region"
      aria-label="Zoomable content area. Use Ctrl/Cmd + Plus to zoom in, Ctrl/Cmd + Minus to zoom out, Ctrl/Cmd + 0 to reset"
    >
      <div className="keyboard-instructions">
        <p>Use Ctrl/Cmd + Plus/Minus to zoom, Ctrl/Cmd + 0 to reset</p>
        <p>
Current zoom:
{(scale * 100).toFixed(0)}
%
        </p>
      </div>

      <Zoom
        scale={scale}
        maxScale={3}
        minScale={0.1}
        center
      >
        <div className="keyboard-content">
          <h2>Keyboard-Controlled Zoom</h2>
          <p>Use standard browser zoom shortcuts</p>
        </div>
      </Zoom>
    </div>
  );
}
```

## Best Practices

### 1. Choose Appropriate Scale Bounds
Set meaningful minimum and maximum scale values:

```tsx
// Good: Logical bounds for different content types
<Zoom maxScale={3} minScale={0.5}>     {/* Images */}
<Zoom maxScale={2} minScale={0.1}>     {/* Charts */}
<Zoom maxScale={1.5} minScale={0.8}>   {/* Text content */}

// Avoid: Excessive bounds that hurt UX
<Zoom maxScale={10} minScale={0.01}>   {/* Too extreme */}
```

### 2. Provide Visual Scale Feedback
Always show users the current scale level:

```tsx
<div className="scale-indicator">
  Zoom:
{' '}
{(currentScale * 100).toFixed(0)}
%
</div>;
```

### 3. Handle Container Resize Gracefully
Ensure zoom adapts to container changes:

```tsx
// The component automatically handles this with ResizeObserver
// But you can provide additional feedback
<Zoom
  fitWidth
  onScaleChange={(scale) => {
    console.log(`Adapted to new container size: ${scale}`);
  }}
>
```

### 4. Optimize for Touch Devices
Consider touch-friendly zoom controls:

```tsx
const isTouchDevice = 'ontouchstart' in window;

<Zoom
  fitWidth={isTouchDevice}
  fitHeight={!isTouchDevice}
  maxScale={isTouchDevice ? 2 : 3}
>
```

## Related Components

- [`gesture-pad`](../gesture-pad/README.md) - Add pinch-to-zoom gestures
- [`bound`](../bound/README.md) - Constrain zoom values within limits
- [`scroll`](../scroll/README.md) - Handle scroll behavior with zoom
- [`focus`](../focus/README.md) - Focus management for zoomed content

## Migration Guide

### From Manual CSS Transforms

**Before:**
```tsx
const [scale, setScale] = useState(1);

<div
  style={{
    transform: `scale(${scale})`,
    transformOrigin: 'center center'
  }}
>
  <Content />
</div>;
```

**After:**
```tsx
<Zoom
  scale={scale}
  center
  onScaleChange={setScale}
>
  <Content />
</Zoom>;
```

### From Third-party Zoom Libraries

**Before:**
```tsx
import ZoomLibrary from 'some-zoom-lib';

<ZoomLibrary minZoom={0.1} maxZoom={3}>
  <Content />
</ZoomLibrary>;
```

**After:**
```tsx
<Zoom
  minScale={0.1}
  maxScale={3}
  fitWidth
  center
>
  <Content />
</Zoom>;
```
|-------------|----------------------------------------------|----------|------------------------------|
| `min`       | `number`                                     |          | Minimum zoom level           |
| `max`       | `number`                                     |          | Maximum zoom level           |
| `step`      | `number`                                     |          | Step size for zoom           |
| `initial`   | `number`                                     |          | Initial zoom level           |
| `children`  | `(zoom: number, setZoom: (z: number) => void)`| ✅      | Render prop for zoom logic   |

## Examples
### Basic Usage
```tsx
import { Zoom } from 'rc-sugar';

<Zoom min={1} max={5} step={0.5} initial={1}>
  {(zoom, setZoom) => (
    <div style={{ transform: `scale(${zoom})` }}>
      <button onClick={() => setZoom(zoom - 0.5)}>-</button>
      <span>
{zoom}
x
      </span>
      <button onClick={() => setZoom(zoom + 0.5)}>+</button>
    </div>
  )}
</Zoom>;
```

## Best Practices
- Use for zoomable UI elements
- Prefer for images, maps, or diagrams
