# Live Component

A powerful component for real-time data management with automatic polling, error handling, and comprehensive state management. Perfect for dashboards, monitoring systems, live feeds, and any application requiring up-to-date data.

## Description

The `Live` component provides a comprehensive solution for real-time data management through automatic polling. It handles the complexity of interval-based updates, error states, loading indicators, and provides fine-grained control over data fetching behavior.

## When to Use
- 📊 **Real-time Dashboards**: Live system metrics, analytics, and monitoring data
- 🔄 **Data Synchronization**: Keep UI synchronized with backend data
- 📈 **Live Trading/Finance**: Stock prices, currency rates, market data
- 🌐 **Status Monitoring**: API health, server status, application metrics
- 📱 **Social Feeds**: Live comments, notifications, activity streams
- 🎮 **Gaming**: Live scores, player stats, leaderboards
- 🔧 **Development Tools**: Live logs, performance metrics, debug information

## Patterns Used
- **Polling Pattern**: Automatic interval-based data fetching
- **Render Props Pattern**: Exposes comprehensive live state
- **State Management**: Complete lifecycle and error handling
- **Optimistic Updates**: Immediate refresh capabilities
- **Resource Management**: Automatic cleanup and memory management
- **Type Safety**: Full TypeScript support with generics

## TypeScript Types
```typescript
import { RenderProp } from '../shared/types';

/**
 * Props for the Live component
 */
interface LiveProps<T = any> {
  /** Function that returns current live value (sync or async) */
  source: () => T | Promise<T>;

  /** Polling interval in milliseconds */
  interval?: number;

  /** Initial value while loading */
  initial?: T;

  /** Whether to start automatically on mount */
  autoStart?: boolean;

  /** Compare function to determine if value changed */
  compare?: (prev: T, next: T) => boolean;

  /** Render prop receiving comprehensive live state */
  children: RenderProp<LiveState<T>>;
}

/**
 * Complete state provided to render prop
 */
interface LiveState<T = any> {
  /** Current live value */
  value: T | undefined;

  /** Previous value for comparison */
  previousValue: T | undefined;

  /** Whether currently loading/fetching */
  isLoading: boolean;

  /** Whether live updates are active */
  isLive: boolean;

  /** Error from source function */
  error: Error | null;

  /** Start live updates */
  start: () => void;

  /** Stop live updates */
  stop: () => void;

  /** Refresh value immediately */
  refresh: () => Promise<void>;

  /** Number of successful updates */
  updateCount: number;

  /** Timestamp of last successful update */
  lastUpdate: Date | null;
}

/** Render prop type */
type RenderProp<T> = (data: T) => React.ReactNode;
```

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `() => T \| Promise<T>` | - | **Required.** Function returning current data (sync or async) |
| `interval` | `number` | `1000` | Polling interval in milliseconds |
| `initial` | `T` | `undefined` | Initial value while first load is in progress |
| `autoStart` | `boolean` | `true` | Whether to automatically start polling on mount |
| `compare` | `(prev: T, next: T) => boolean` | `undefined` | Custom comparison to determine if data changed |
| `children` | `RenderProp<LiveState<T>>` | - | **Required.** Render prop receiving live state |

## Examples

### Basic Real-time Dashboard
```tsx
import { Live } from 'ui-magic-core';

function SystemDashboard() {
  return (
    <Live
      source={() => fetch('/api/system/status').then(r => r.json())}
      interval={5000}
    >
      {({ value, isLive, isLoading, error, start, stop, lastUpdate }) => (
        <div className="dashboard">
          <header>
            <h2>System Status</h2>
            <div className="status">
              {isLive ? '🟢 Live' : '🔴 Stopped'}
              <button onClick={isLive ? stop : start}>
                {isLive ? 'Stop' : 'Start'}
              </button>
            </div>
          </header>

          {isLoading && <div className="loading">Updating...</div>}
          {error && (
<div className="error">
Error:
{error.message}
</div>
)}

          {value && (
            <div className="metrics">
              <div>
CPU:
{value.cpu}
%
              </div>
              <div>
Memory:
{value.memory}
%
              </div>
              <div>
Disk:
{value.disk}
%
              </div>
              <div>
Uptime:
{value.uptime}
              </div>
            </div>
          )}

          {lastUpdate && (
            <footer>
Last updated:
{lastUpdate.toLocaleTimeString()}
            </footer>
          )}
        </div>
      )}
    </Live>
  );
}
```

### Live Stock Ticker
```tsx
import { Live } from 'ui-magic-core';

function StockTicker({ symbol }) {
  return (
    <Live
      source={() => fetchStockPrice(symbol)}
      interval={2000}
      compare={(prev, next) => prev?.price !== next?.price}
    >
      {({ value, previousValue, isLive, updateCount }) => {
        const priceChange = value && previousValue
          ? value.price - previousValue.price
          : 0;

        return (
          <div className={`stock-ticker ${priceChange >= 0 ? 'up' : 'down'}`}>
            <span className="symbol">{symbol}</span>
            <span className="price">
$
{value?.price}
            </span>
            {priceChange !== 0 && (
              <span className="change">
                {priceChange > 0 ? '+' : ''}
{priceChange.toFixed(2)}
              </span>
            )}
            <span className="indicator">{isLive ? '📶' : '📵'}</span>
            <small>
Updates:
{updateCount}
            </small>
          </div>
        );
      }}
    </Live>
  );
}
```

### Chat Messages Feed
```tsx
import { Live } from 'ui-magic-core';

function LiveChatFeed({ roomId }) {
  return (
    <Live
      source={() => fetchLatestMessages(roomId)}
      interval={1000}
      initial={[]}
    >
      {({ value: messages, isLoading, error, refresh, isLive }) => (
        <div className="chat-feed">
          <header>
            <h3>
Live Chat
{isLive && '🔴'}
            </h3>
            <button onClick={refresh} disabled={isLoading}>
              Refresh
            </button>
          </header>

          <div className="messages">
            {messages?.map(message => (
              <div key={message.id} className="message">
                <strong>
{message.author}
:
                </strong>
{' '}
{message.text}
                <time>{new Date(message.timestamp).toLocaleTimeString()}</time>
              </div>
            ))}
          </div>

          {error && (
            <div className="error">
Failed to load messages:
{error.message}
            </div>
          )}
        </div>
      )}
    </Live>
  );
}
```

### Live Analytics Widget
```tsx
import { Live } from 'ui-magic-core';

function AnalyticsWidget() {
  return (
    <Live
      source={async () => {
        const [visitors, pageViews, revenue] = await Promise.all([
          fetch('/api/analytics/visitors').then(r => r.json()),
          fetch('/api/analytics/pageviews').then(r => r.json()),
          fetch('/api/analytics/revenue').then(r => r.json()),
        ]);
        return { visitors, pageViews, revenue };
      }}
      interval={10000}
    >
      {({ value, isLoading, error, updateCount, lastUpdate }) => (
        <div className="analytics-widget">
          <h3>Live Analytics</h3>

          {isLoading && <div className="spinner">Loading...</div>}

          {error
? (
            <div className="error">Analytics unavailable</div>
          )
: value
? (
            <div className="metrics">
              <div className="metric">
                <label>Active Visitors</label>
                <span className="value">{value.visitors}</span>
              </div>
              <div className="metric">
                <label>Page Views</label>
                <span className="value">{value.pageViews}</span>
              </div>
              <div className="metric">
                <label>Revenue Today</label>
                <span className="value">
$
{value.revenue}
                </span>
              </div>
            </div>
          )
: (
            <div>No data available</div>
          )}

          <footer>
            Updates:
{' '}
{updateCount}
{' '}
|
            Last:
{' '}
{lastUpdate?.toLocaleTimeString()}
          </footer>
        </div>
      )}
    </Live>
  );
}
```

### Server Health Monitor
```tsx
import { Live } from 'ui-magic-core';

function ServerHealthMonitor({ servers }) {
  return (
    <div className="server-grid">
      {servers.map(server => (
        <Live
          key={server.id}
          source={() => checkServerHealth(server.id)}
          interval={3000}
          autoStart={true}
        >
          {({ value: health, isLoading, error, isLive, start, stop }) => (
            <div className={`server-card ${health?.status || 'unknown'}`}>
              <header>
                <h4>{server.name}</h4>
                <button
                  onClick={isLive ? stop : start}
                  className={isLive ? 'stop' : 'start'}
                >
                  {isLive ? 'Stop' : 'Monitor'}
                </button>
              </header>

              <div className="status">
                <div className={`indicator ${health?.status}`}>
                  {health?.status === 'healthy'
? '🟢'
                   : health?.status === 'warning' ? '🟡' : '🔴'}
                </div>
                <span>{health?.status || 'Unknown'}</span>
              </div>

              {health && (
                <div className="metrics">
                  <div>
Response:
{health.responseTime}
ms
                  </div>
                  <div>
CPU:
{health.cpu}
%
                  </div>
                  <div>
Memory:
{health.memory}
%
                  </div>
                </div>
              )}

              {error && <div className="error">Check failed</div>}
              {isLoading && <div className="loading">Checking...</div>}
            </div>
          )}
        </Live>
      ))}
    </div>
  );
}
```

### Live Log Viewer
```tsx
import { Live } from 'ui-magic-core';

function LiveLogViewer({ logLevel = 'info' }) {
  return (
    <Live
      source={() => fetchLogs(logLevel, 50)}
      interval={2000}
      compare={(prev, next) => prev?.length !== next?.length}
    >
      {({ value: logs, isLive, error, stop, start, updateCount }) => (
        <div className="log-viewer">
          <header>
            <h3>
Live Logs (
{logLevel}
)
            </h3>
            <div className="controls">
              <button onClick={isLive ? stop : start}>
                {isLive ? 'Pause' : 'Resume'}
              </button>
              <span>
Updates:
{updateCount}
              </span>
            </div>
          </header>

          <div className="log-content">
            {logs?.map((log, index) => (
              <div key={index} className={`log-entry ${log.level}`}>
                <time>{new Date(log.timestamp).toLocaleTimeString()}</time>
                <span className="level">
[
{log.level.toUpperCase()}
]
                </span>
                <span className="message">{log.message}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="error">
Failed to fetch logs:
{error.message}
            </div>
          )}
        </div>
      )}
    </Live>
  );
}
```

## Performance Considerations

### 🚀 **Optimizations**
- **Smart Polling**: Only updates when data actually changes (with `compare` prop)
- **Automatic Cleanup**: Clears intervals and prevents memory leaks
- **Error Recovery**: Continues polling after errors
- **Batched Updates**: Efficient state management with minimal re-renders

### ⚠️ **Considerations**
- **Network Impact**: Be mindful of polling frequency and data size
- **Battery Usage**: Frequent polling can drain mobile device batteries
- **Server Load**: Many concurrent polling connections can impact server performance
- **Memory Management**: Long-running live components should be monitored

```tsx
// Good: Reasonable polling intervals
<Live source={fetchData} interval={5000}>
  {/* ... */}
</Live>

// Good: Custom comparison to avoid unnecessary updates
<Live
  source={fetchData}
  compare={(prev, next) => prev.id !== next.id}
>
  {/* ... */}
</Live>

// Avoid: Too frequent polling
<Live source={fetchData} interval={100}>
  {/* This polls 10 times per second! */}
</Live>
```

## Best Practices

### ✅ **Recommended**
- Use appropriate polling intervals (1-10 seconds for most cases)
- Implement custom `compare` functions for efficiency
- Handle error states gracefully in UI
- Provide start/stop controls for user agency
- Use initial values to prevent layout shifts
- Monitor network usage and performance impact

### ❌ **Avoid**
- Extremely frequent polling (< 500ms) without good reason
- Ignoring error states in UI
- Polling when component is not visible (consider visibility API)
- Large data payloads without pagination
- Multiple Live components polling the same endpoint

## Migration Guide

### From Manual useEffect Polling
```tsx
// Before: Manual polling with useEffect
function DashboardWidget() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      setLoading(true);
      try {
        const result = await fetchData();
        setData(result);
        setError(null);
      }
 catch (err) {
        setError(err);
      }
 finally {
        setLoading(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && (
<div>
Error:
{error.message}
</div>
)}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}

// After: Using Live component
function DashboardWidget() {
  return (
    <Live source={fetchData} interval={5000}>
      {({ value, isLoading, error }) => (
        <div>
          {isLoading && <div>Loading...</div>}
          {error && (
<div>
Error:
{error.message}
</div>
)}
          {value && <div>{JSON.stringify(value)}</div>}
        </div>
      )}
    </Live>
  );
}
```

### From WebSocket to Polling
```tsx
// Before: WebSocket connection
function LiveFeed() {
  const [data, setData] = useState();

  useEffect(() => {
    const ws = new WebSocket('/api/live-feed');
    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    return () => ws.close();
  }, []);

  return <div>{data?.message}</div>;
}

// After: Fallback to polling for simpler setup
function LiveFeed() {
  return (
    <Live
      source={() => fetch('/api/live-feed').then(r => r.json())}
      interval={1000}
    >
      {({ value }) => <div>{value?.message}</div>}
    </Live>
  );
}
```

## Related Components

- **[`async`](../async/README.md)** - One-time async data fetching
- **[`cache`](../cache/README.md)** - Data caching and memoization
- **[`track`](../track/README.md)** - Analytics and event tracking

## Accessibility

The `Live` component is accessibility-neutral but consider these best practices:

### Screen Reader Support
- Announce important data changes using live regions
- Provide alternative ways to access live data

```tsx
<Live source={fetchAlerts} interval={5000}>
  {({ value: alerts }) => (
    <div aria-live="polite" aria-label="Live system alerts">
      {alerts?.map(alert => (
        <div key={alert.id} role="alert">
          {alert.message}
        </div>
      ))}
    </div>
  )}
</Live>;
```

## Advanced Patterns

### Multiple Data Sources
```tsx
function CombinedDashboard() {
  return (
    <div className="dashboard">
      <Live source={() => fetch('/api/metrics')} interval={5000}>
        {({ value: metrics }) => (
          <MetricsWidget data={metrics} />
        )}
      </Live>

      <Live source={() => fetch('/api/alerts')} interval={3000}>
        {({ value: alerts }) => (
          <AlertsWidget data={alerts} />
        )}
      </Live>

      <Live source={() => fetch('/api/logs')} interval={2000}>
        {({ value: logs }) => (
          <LogsWidget data={logs} />
        )}
      </Live>
    </div>
  );
}
```

### Conditional Polling
```tsx
function ConditionalLive({ isVisible, priority }) {
  const interval = priority === 'high' ? 1000 : 5000;

  return (
    <Live
      source={fetchData}
      interval={interval}
      autoStart={isVisible}
    >
      {({ value, start, stop, isLive }) => (
        <div>
          {!isVisible && (
            <button onClick={start}>Start monitoring</button>
          )}
          {/* ... render data ... */}
        </div>
      )}
    </Live>
  );
}
```
