# Ticker Component

A versatile interval-based component that executes actions at regular intervals with automatic cleanup, state management, and flexible control options. Perfect for timers, polling operations, animations, and any time-based functionality requiring reliable execution and lifecycle management.

## Description

The `Ticker` component provides a declarative way to handle interval-based operations in React applications. It manages `setInterval` lifecycle automatically, offers start/stop/restart controls, supports maximum tick limits, and provides real-time state through render props. The component is designed for scenarios requiring reliable timing, automatic cleanup, and sophisticated interval management.

## When to Use
- **Timers and Countdowns**: Digital clocks, countdown timers, and stopwatches
- **Polling Operations**: Regular API calls, data refresh, and status checking
- **Real-time Updates**: Live data displays, progress indicators, and status monitors
- **Animations**: Time-based animations, transitions, and visual effects
- **Game Logic**: Game timers, turn-based mechanics, and periodic events
- **Monitoring Systems**: Health checks, performance monitoring, and alerts
- **Auto-save Features**: Periodic data saves and backup operations

## Patterns Used
- **Render Props Pattern**: Exposes ticker state and controls to children
- **Automatic Cleanup**: Prevents memory leaks with proper interval cleanup
- **State Management**: Tracks tick count, running status, and controls
- **Flexible Control**: Start, stop, restart, and maximum tick configuration
- **Event Callbacks**: onTick and onStop events for external integration

## TypeScript Types

```typescript
/**
 * Ticker state interface exposed to render prop children
 */
interface TickerState {
  /** Current tick count starting from 0 */
  count: number;

  /** Function to stop the ticker immediately */
  stop: () => void;

  /** Function to restart the ticker (resets count to 0) */
  restart: () => void;

  /** Whether ticker is currently running */
  isRunning: boolean;
}

/**
 * Props for the Ticker component
 */
interface TickerProps {
  /** Interval between ticks in milliseconds */
  interval: number;

  /** Callback fired on each tick with current count */
  onTick?: (count: number) => void;

  /**
   * Whether to start ticking immediately on mount
   * @default true
   */
  autoStart?: boolean;

  /** Maximum number of ticks before stopping (infinite if not provided) */
  maxTicks?: number;

  /** Callback fired when ticker stops with final count */
  onStop?: (finalCount: number) => void;

  /** Render prop function that receives ticker state */
  children?: (state: TickerState) => ReactNode;
}

/** Ticker component type */
declare const Ticker: React.FC<TickerProps> & {
  displayName: string;
};
```

## Usage Examples

### Digital Clock with Real-time Updates

```tsx
import { Ticker } from 'ui-magic-core/ticker';

function DigitalClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  return (
    <div className="digital-clock">
      <Ticker
        interval={1000} // Update every second
        onTick={() => setCurrentTime(new Date())}
      >
        {({ count, stop, restart, isRunning }) => (
          <div className="clock-container">
            <div className="time-display">
              <div className="current-time">
                {currentTime.toLocaleTimeString('ru-RU')}
              </div>
              <div className="current-date">
                {currentTime.toLocaleDateString('ru-RU', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            <div className="clock-info">
              <div className="uptime">
                Работает:
{' '}
{Math.floor(count / 3600)}
ч
{' '}
{Math.floor((count % 3600) / 60)}
м
{' '}
{count % 60}
с
              </div>

              <div className="clock-controls">
                <button
                  onClick={isRunning ? stop : restart}
                  className={`control-btn ${isRunning ? 'stop' : 'start'}`}
                >
                  {isRunning ? '⏸️ Остановить' : '▶️ Запустить'}
                </button>

                <button onClick={restart} className="control-btn reset">
                  🔄 Сбросить
                </button>
              </div>
            </div>

            <div className="time-zones">
              <div className="timezone">
                <span className="tz-label">Москва:</span>
                <span className="tz-time">{currentTime.toLocaleTimeString('ru-RU')}</span>
              </div>
              <div className="timezone">
                <span className="tz-label">Лондон:</span>
                <span className="tz-time">
                  {new Date(currentTime.getTime() - 3 * 60 * 60 * 1000).toLocaleTimeString('en-GB')}
                </span>
              </div>
              <div className="timezone">
                <span className="tz-label">Нью-Йорк:</span>
                <span className="tz-time">
                  {new Date(currentTime.getTime() - 8 * 60 * 60 * 1000).toLocaleTimeString('en-US')}
                </span>
              </div>
            </div>
          </div>
        )}
      </Ticker>
    </div>
  );
}
```

### Countdown Timer with Multiple Stages

```tsx
import { Ticker } from 'ui-magic-core/ticker';

function CountdownTimer() {
  const [targetDate, setTargetDate] = useState(new Date(Date.now() + 5 * 60 * 1000)); // 5 minutes from now
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      setIsFinished(true);
      return 0;
    }

    return Math.floor(difference / 1000);
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}д ${hours}ч ${minutes}м ${secs}с`;
    }
 else if (hours > 0) {
      return `${hours}ч ${minutes}м ${secs}с`;
    }
 else if (minutes > 0) {
      return `${minutes}м ${secs}с`;
    }
 else {
      return `${secs}с`;
    }
  };

  const getUrgencyLevel = (seconds) => {
    if (seconds <= 30)
return 'critical';
    if (seconds <= 60)
return 'urgent';
    if (seconds <= 300)
return 'warning';
    return 'normal';
  };

  return (
    <div className="countdown-timer">
      <Ticker
        interval={1000}
        onTick={() => {
          const remaining = calculateTimeRemaining();
          setTimeRemaining(remaining);

          // Play sound for last 10 seconds
          if (remaining <= 10 && remaining > 0) {
            playTickSound();
          }
        }}
        onStop={() => {
          setIsFinished(true);
          playFinishSound();
        }}
      >
        {({ count, stop, restart, isRunning }) => (
          <div className="timer-container">
            <div className="timer-header">
              <h2>Обратный отсчёт</h2>
              <div className="timer-controls">
                <input
                  type="datetime-local"
                  value={targetDate.toISOString().slice(0, 16)}
                  onChange={(e) => {
                    setTargetDate(new Date(e.target.value));
                    setIsFinished(false);
                  }}
                  disabled={isRunning}
                />
              </div>
            </div>

            <div className={`timer-display ${getUrgencyLevel(timeRemaining)}`}>
              {isFinished
? (
                <div className="timer-finished">
                  <div className="finish-icon">🎉</div>
                  <div className="finish-message">Время вышло!</div>
                  <div className="finish-time">
                    Завершено в
{' '}
{new Date().toLocaleTimeString('ru-RU')}
                  </div>
                </div>
              )
: (
                <div className="timer-active">
                  <div className="time-remaining">
                    {formatTime(timeRemaining)}
                  </div>

                  <div className="timer-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.max(0, Math.min(100, (timeRemaining / 300) * 100))}%`,
                          backgroundColor: getUrgencyLevel(timeRemaining) === 'critical'
? '#dc3545'
                                         : getUrgencyLevel(timeRemaining) === 'urgent'
? '#fd7e14'
                                         : getUrgencyLevel(timeRemaining) === 'warning' ? '#ffc107' : '#28a745'
                        }}
                      />
                    </div>
                  </div>

                  <div className="timer-info">
                    <div className="target-time">
                      Цель:
{' '}
{targetDate.toLocaleString('ru-RU')}
                    </div>
                    <div className="elapsed-time">
                      Работает:
{' '}
{formatTime(count)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="timer-actions">
              <button
                onClick={isRunning ? stop : restart}
                className={`btn ${isRunning ? 'btn-danger' : 'btn-success'}`}
              >
                {isRunning ? '⏹️ Остановить' : '▶️ Запустить'}
              </button>

              <button
                onClick={() => {
                  setTargetDate(new Date(Date.now() + 5 * 60 * 1000));
                  setIsFinished(false);
                  restart();
                }}
                className="btn btn-secondary"
              >
                🔄 5 минут
              </button>

              <button
                onClick={() => {
                  setTargetDate(new Date(Date.now() + 25 * 60 * 1000));
                  setIsFinished(false);
                  restart();
                }}
                className="btn btn-secondary"
              >
                🍅 Помодоро (25м)
              </button>
            </div>
          </div>
        )}
      </Ticker>
    </div>
  );
}

function playTickSound() {
  // Play tick sound implementation
  const audio = new Audio('/sounds/tick.wav');
  audio.volume = 0.3;
  audio.play().catch(() => {}); // Ignore if sound fails
}

function playFinishSound() {
  // Play finish sound implementation
  const audio = new Audio('/sounds/finish.wav');
  audio.volume = 0.5;
  audio.play().catch(() => {});
}
```

### Data Polling with Auto-refresh

```tsx
import { Ticker } from 'ui-magic-core/ticker';

function DataDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [pollInterval, setPollInterval] = useState(30); // seconds

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dashboard-data');
      const data = await response.json();

      setDashboardData(data);
      setLastUpdate(new Date());
    }
 catch (err) {
      setError(err.message);
    }
 finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="data-dashboard">
      <Ticker
        interval={pollInterval * 1000}
        onTick={fetchDashboardData}
        autoStart={true}
      >
        {({ count, stop, restart, isRunning }) => (
          <div className="dashboard-container">
            <div className="dashboard-header">
              <h1>Панель мониторинга</h1>

              <div className="refresh-controls">
                <div className="refresh-status">
                  <span className={`status-indicator ${isRunning ? 'active' : 'inactive'}`} />
                  <span className="status-text">
                    {isRunning ? 'Автообновление включено' : 'Автообновление отключено'}
                  </span>
                </div>

                <div className="refresh-info">
                  {lastUpdate && (
                    <span className="last-update">
                      Обновлено:
{' '}
{lastUpdate.toLocaleTimeString('ru-RU')}
                    </span>
                  )}
                  <span className="refresh-count">
                    Обновлений:
{' '}
{count}
                  </span>
                </div>

                <div className="refresh-actions">
                  <select
                    value={pollInterval}
                    onChange={(e) => {
                      setPollInterval(Number.parseInt(e.target.value));
                      restart(); // Restart with new interval
                    }}
                    className="interval-select"
                  >
                    <option value={10}>10 секунд</option>
                    <option value={30}>30 секунд</option>
                    <option value={60}>1 минута</option>
                    <option value={300}>5 минут</option>
                    <option value={900}>15 минут</option>
                  </select>

                  <button
                    onClick={fetchDashboardData}
                    disabled={isLoading}
                    className="manual-refresh-btn"
                  >
                    {isLoading ? '🔄' : '⟳'}
{' '}
Обновить
                  </button>

                  <button
                    onClick={isRunning ? stop : restart}
                    className={`auto-refresh-btn ${isRunning ? 'active' : 'inactive'}`}
                  >
                    {isRunning ? '⏸️ Остановить' : '▶️ Запустить'}
                  </button>
                </div>
              </div>
            </div>

            {error
? (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <div className="error-message">
                  <h3>Ошибка загрузки данных</h3>
                  <p>{error}</p>
                  <button onClick={fetchDashboardData} className="retry-btn">
                    Попробовать снова
                  </button>
                </div>
              </div>
            )
: (
              <div className="dashboard-content">
                {isLoading && (
                  <div className="loading-overlay">
                    <div className="loading-spinner">🔄</div>
                    <span>Загрузка данных...</span>
                  </div>
                )}

                <div className="metrics-grid">
                  <div className="metric-card">
                    <h3>Активные пользователи</h3>
                    <div className="metric-value">
                      {dashboardData?.activeUsers || '---'}
                    </div>
                    <div className="metric-change">
                      +
{dashboardData?.userGrowth || 0}
% за сегодня
                    </div>
                  </div>

                  <div className="metric-card">
                    <h3>Доходы</h3>
                    <div className="metric-value">
                      {dashboardData?.revenue ? `${dashboardData.revenue.toLocaleString('ru-RU')}₽` : '---'}
                    </div>
                    <div className="metric-change">
                      +
{dashboardData?.revenueGrowth || 0}
% за месяц
                    </div>
                  </div>

                  <div className="metric-card">
                    <h3>Заказы</h3>
                    <div className="metric-value">
                      {dashboardData?.orders || '---'}
                    </div>
                    <div className="metric-change">
                      {dashboardData?.pendingOrders || 0}
{' '}
в обработке
                    </div>
                  </div>

                  <div className="metric-card">
                    <h3>Производительность</h3>
                    <div className="metric-value">
                      {dashboardData?.performance ? `${dashboardData.performance}%` : '---'}
                    </div>
                    <div className="metric-change">
                      Среднее время ответа:
{' '}
{dashboardData?.responseTime || 0}
мс
                    </div>
                  </div>
                </div>

                <div className="charts-section">
                  <div className="chart-container">
                    <h3>Трафик по часам</h3>
                    {dashboardData?.hourlyTraffic && (
                      <TrafficChart data={dashboardData.hourlyTraffic} />
                    )}
                  </div>

                  <div className="chart-container">
                    <h3>Топ страниц</h3>
                    {dashboardData?.topPages && (
                      <TopPagesChart data={dashboardData.topPages} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Ticker>
    </div>
  );
}
```

### Game Timer with Multiple Phases

```tsx
import { Ticker } from 'ui-magic-core/ticker';

function GameTimer() {
  const [gamePhase, setGamePhase] = useState('waiting'); // waiting, playing, paused, finished
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLimit, setTimeLimit] = useState(60); // seconds
  const [gameEvents, setGameEvents] = useState([]);

  const addGameEvent = (message) => {
    setGameEvents(prev => [...prev, {
      id: Date.now(),
      message,
      timestamp: new Date()
    }]);
  };

  const startGame = () => {
    setGamePhase('playing');
    setScore(0);
    addGameEvent('Игра началась!');
  };

  const pauseGame = () => {
    setGamePhase('paused');
    addGameEvent('Игра поставлена на паузу');
  };

  const resumeGame = () => {
    setGamePhase('playing');
    addGameEvent('Игра возобновлена');
  };

  const endGame = (finalScore) => {
    setGamePhase('finished');
    addGameEvent(`Игра завершена! Финальный счёт: ${finalScore}`);
  };

  return (
    <div className="game-timer">
      <Ticker
        interval={1000}
        autoStart={false}
        maxTicks={timeLimit}
        onTick={(count) => {
          if (gamePhase === 'playing') {
            // Game logic can go here
            if (count % 10 === 0) {
              setScore(prev => prev + level * 100);
              addGameEvent(`Бонус! +${level * 100} очков`);
            }

            if (count % 20 === 0) {
              setLevel(prev => prev + 1);
              addGameEvent(`Уровень повышен до ${level + 1}!`);
            }
          }
        }}
        onStop={(finalCount) => {
          if (gamePhase === 'playing') {
            endGame(score);
          }
        }}
      >
        {({ count, stop, restart, isRunning }) => {
          const timeRemaining = Math.max(0, timeLimit - count);

          return (
            <div className="game-container">
              <div className="game-header">
                <h1>🎮 Игровой таймер</h1>
                <div className="game-stats">
                  <div className="stat">
                    <span className="stat-label">Счёт:</span>
                    <span className="stat-value">{score.toLocaleString('ru-RU')}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Уровень:</span>
                    <span className="stat-value">{level}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Время:</span>
                    <span className={`stat-value ${timeRemaining <= 10 ? 'critical' : ''}`}>
                      {Math.floor(timeRemaining / 60)}
:
{(timeRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="game-display">
                <div className={`game-status ${gamePhase}`}>
                  {gamePhase === 'waiting' && (
                    <div className="status-waiting">
                      <h2>Готовы к игре?</h2>
                      <p>
Нажмите "Начать" чтобы начать
{timeLimit}
-секундную игру
                      </p>
                    </div>
                  )}

                  {gamePhase === 'playing' && (
                    <div className="status-playing">
                      <div className="progress-ring">
                        <svg width="200" height="200">
                          <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="#e0e0e0"
                            strokeWidth="10"
                          />
                          <circle
                            cx="100"
                            cy="100"
                            r="90"
                            fill="none"
                            stroke="#4caf50"
                            strokeWidth="10"
                            strokeDasharray={`${2 * Math.PI * 90}`}
                            strokeDashoffset={`${2 * Math.PI * 90 * (1 - timeRemaining / timeLimit)}`}
                            transform="rotate(-90 100 100)"
                          />
                        </svg>
                        <div className="progress-content">
                          <div className="time-display">{timeRemaining}</div>
                          <div className="level-display">
L
{level}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {gamePhase === 'paused' && (
                    <div className="status-paused">
                      <h2>⏸️ Пауза</h2>
                      <p>Игра приостановлена</p>
                      <p>
Оставшееся время:
{timeRemaining}
с
                      </p>
                    </div>
                  )}

                  {gamePhase === 'finished' && (
                    <div className="status-finished">
                      <h2>🏆 Игра завершена!</h2>
                      <div className="final-stats">
                        <div className="final-score">
                          Финальный счёт:
{' '}
{score.toLocaleString('ru-RU')}
                        </div>
                        <div className="final-level">
                          Достигнутый уровень:
{' '}
{level}
                        </div>
                        <div className="final-time">
                          Время игры:
{' '}
{count}
с
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="game-controls">
                  {gamePhase === 'waiting' && (
                    <button onClick={() => { startGame(); restart(); }} className="btn btn-success btn-lg">
                      🚀 Начать игру
                    </button>
                  )}

                  {gamePhase === 'playing' && (
                    <>
                      <button onClick={() => { pauseGame(); stop(); }} className="btn btn-warning">
                        ⏸️ Пауза
                      </button>
                      <button onClick={() => { endGame(score); stop(); }} className="btn btn-danger">
                        ⏹️ Завершить
                      </button>
                    </>
                  )}

                  {gamePhase === 'paused' && (
                    <>
                      <button onClick={() => { resumeGame(); restart(); }} className="btn btn-success">
                        ▶️ Продолжить
                      </button>
                      <button onClick={() => { endGame(score); stop(); }} className="btn btn-danger">
                        ⏹️ Завершить
                      </button>
                    </>
                  )}

                  {gamePhase === 'finished' && (
                    <button
                      onClick={() => {
                        setGamePhase('waiting');
                        setScore(0);
                        setLevel(1);
                        setGameEvents([]);
                      }}
                      className="btn btn-primary btn-lg"
                    >
                      🔄 Играть снова
                    </button>
                  )}
                </div>
              </div>

              <div className="game-events">
                <h3>События игры</h3>
                <div className="events-list">
                  {gameEvents.slice(-5).reverse().map(event => (
                    <div key={event.id} className="event-item">
                      <span className="event-time">
                        {event.timestamp.toLocaleTimeString('ru-RU')}
                      </span>
                      <span className="event-message">{event.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }}
      </Ticker>
    </div>
  );
}
```

## API Reference

### TickerProps

| Prop        | Type                          | Required | Default | Description                                        |
|-------------|-------------------------------|----------|---------|----------------------------------------------------|
| `interval`  | `number`                      | ✅       | -       | Interval between ticks in milliseconds            |
| `onTick`    | `(count: number) => void`     | ❌       | -       | Callback fired on each tick with current count   |
| `autoStart` | `boolean`                     | ❌       | `true`  | Whether to start ticking immediately on mount    |
| `maxTicks`  | `number`                      | ❌       | -       | Maximum number of ticks before stopping          |
| `onStop`    | `(finalCount: number) => void`| ❌       | -       | Callback fired when ticker stops                 |
| `children`  | `(state: TickerState) => ReactNode` | ❌ | -       | Render prop function receiving ticker state      |

### TickerState

| Property    | Type         | Description                               |
|-------------|--------------|-------------------------------------------|
| `count`     | `number`     | Current tick count starting from 0       |
| `stop`      | `() => void` | Function to stop the ticker immediately  |
| `restart`   | `() => void` | Function to restart ticker (resets count)|
| `isRunning` | `boolean`    | Whether ticker is currently running       |

## Best Practices

### Performance
- **Appropriate Intervals**: Use reasonable intervals to avoid performance issues
- **Cleanup**: Component automatically cleans up intervals on unmount
- **State Updates**: Avoid heavy operations in onTick callbacks
- **Memory Management**: Be mindful of closures in callback functions

### User Experience
- **Visual Feedback**: Always provide visual indication of ticker state
- **Control Options**: Give users ability to start/stop when appropriate
- **Progress Indication**: Show progress for finite operations
- **Error Handling**: Handle errors gracefully in async operations

### Accessibility
- **Screen Reader Support**: Announce important timer changes
- **Keyboard Navigation**: Ensure controls are keyboard accessible
- **Focus Management**: Manage focus during timer state changes
- **Motion Preferences**: Respect user motion preferences

## Migration Guide

### From setInterval
```tsx
// Before: Manual setInterval management
function OldTimer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
<div>
Count:
{count}
</div>
);
}

// After: Using Ticker component
function NewTimer() {
  return (
    <Ticker interval={1000}>
      {({ count }) => (
<div>
Count:
{count}
</div>
)}
    </Ticker>
  );
}
```

### From Custom Hook
```tsx
// Before: Custom interval hook
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// After: Using Ticker component
<Ticker interval={delay} onTick={callback} />;
```

## Related Components
- [`async`](../async/README.md) - For handling async operations in tickers
- [`state`](../state/README.md) - For complex state management
- [`memo`](../memo/README.md) - For optimizing ticker-based components
  interval: number;
  children: (tick: number) => React.ReactNode;
}
```

## API
| Prop        | Type                                         | Required | Description                  |
|-------------|----------------------------------------------|----------|------------------------------|
| `interval`  | `number`                                     | ✅       | Interval in ms               |
| `children`  | `(tick: number) => ReactNode`                 | ✅       | Render prop for tick count   |

## Examples
### Basic Usage
```tsx
import { Ticker } from 'rc-sugar';

<Ticker interval={1000}>
  {tick => <div>Seconds: {tick}</div>}
</Ticker>
```

## Best Practices
- Use for timers, clocks, or polling
- Prefer for periodic UI updates
