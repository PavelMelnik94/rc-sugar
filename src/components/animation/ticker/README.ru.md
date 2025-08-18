# Компонент Ticker

Универсальный компонент на основе интервалов, который выполняет действия через регулярные промежутки времени с автоматической очисткой, управлением состояния и гибкими опциями контроля. Идеально подходит для таймеров, операций опроса, анимации и любой функциональности, основанной на времени, требующей надёжного выполнения и управления жизненным циклом.

## Описание

Компонент `Ticker` предоставляет декларативный способ обработки интервальных операций в React приложениях. Он автоматически управляет жизненным циклом `setInterval`, предлагает контроль запуска/остановки/перезапуска, поддерживает ограничения максимального количества тиков и предоставляет состояние в реальном времени через render props. Компонент разработан для сценариев, требующих надёжной синхронизации, автоматической очистки и сложного управления интервалами.

## Когда использовать
- **Таймеры и обратный отсчёт**: Цифровые часы, таймеры обратного отсчёта и секундомеры
- **Операции опроса**: Регулярные вызовы API, обновление данных и проверка статуса
- **Обновления в реальном времени**: Отображение живых данных, индикаторы прогресса и мониторы статуса
- **Анимации**: Анимации на основе времени, переходы и визуальные эффекты
- **Игровая логика**: Игровые таймеры, пошаговая механика и периодические события
- **Системы мониторинга**: Проверки работоспособности, мониторинг производительности и оповещения
- **Функции автосохранения**: Периодическое сохранение данных и операции резервного копирования

## Используемые паттерны
- **Паттерн Render Props**: Предоставляет состояние тикера и элементы управления детям
- **Автоматическая очистка**: Предотвращает утечки памяти с правильной очисткой интервалов
- **Управление состоянием**: Отслеживает количество тиков, статус работы и элементы управления
- **Гибкое управление**: Запуск, остановка, перезапуск и конфигурация максимального количества тиков
- **Колбэки событий**: События onTick и onStop для внешней интеграции

## Типы TypeScript

```typescript
/**
 * Интерфейс состояния тикера, предоставляемый детям render prop
 */
interface TickerState {
  /** Текущее количество тиков, начиная с 0 */
  count: number;

  /** Функция немедленной остановки тикера */
  stop: () => void;

  /** Функция перезапуска тикера (сбрасывает count до 0) */
  restart: () => void;

  /** Работает ли тикер в данный момент */
  isRunning: boolean;
}

/**
 * Пропсы для компонента Ticker
 */
interface TickerProps {
  /** Интервал между тиками в миллисекундах */
  interval: number;

  /** Колбэк, вызываемый при каждом тике с текущим количеством */
  onTick?: (count: number) => void;

  /**
   * Начинать ли тиканье сразу при монтировании
   * @default true
   */
  autoStart?: boolean;

  /** Максимальное количество тиков перед остановкой (бесконечно, если не указано) */
  maxTicks?: number;

  /** Колбэк, вызываемый при остановке тикера с финальным количеством */
  onStop?: (finalCount: number) => void;

  /** Функция render prop, которая получает состояние тикера */
  children?: (state: TickerState) => ReactNode;
}

/** Тип компонента Ticker */
declare const Ticker: React.FC<TickerProps> & {
  displayName: string;
};
```

## Примеры использования

### Цифровые часы с обновлениями в реальном времени

```tsx
import { Ticker } from 'ui-magic-core/ticker';

function DigitalClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  return (
    <div className="digital-clock">
      <Ticker
        interval={1000} // Обновление каждую секунду
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

### Таймер обратного отсчёта с несколькими этапами

```tsx
import { Ticker } from 'ui-magic-core/ticker';

function CountdownTimer() {
  const [targetDate, setTargetDate] = useState(new Date(Date.now() + 5 * 60 * 1000)); // 5 минут от текущего времени
  const [remainingTime, setRemainingTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const calculateRemainingTime = () => {
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
          const remaining = calculateRemainingTime();
          setRemainingTime(remaining);

          // Воспроизведение звука для последних 10 секунд
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

            <div className={`timer-display ${getUrgencyLevel(remainingTime)}`}>
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
                    {formatTime(remainingTime)}
                  </div>

                  <div className="timer-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.max(0, Math.min(100, (remainingTime / 300) * 100))}%`,
                          backgroundColor: getUrgencyLevel(remainingTime) === 'critical'
? '#dc3545'
                                         : getUrgencyLevel(remainingTime) === 'urgent'
? '#fd7e14'
                                         : getUrgencyLevel(remainingTime) === 'warning' ? '#ffc107' : '#28a745'
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
  // Реализация воспроизведения звука тика
  const audio = new Audio('/sounds/tick.wav');
  audio.volume = 0.3;
  audio.play().catch(() => {}); // Игнорировать, если звук не удался
}

function playFinishSound() {
  // Реализация воспроизведения звука завершения
  const audio = new Audio('/sounds/finish.wav');
  audio.volume = 0.5;
  audio.play().catch(() => {});
}
```

### Опрос данных с авто-обновлением

```tsx
import { Ticker } from 'ui-magic-core/ticker';

function DataDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(30); // секунды

  const loadDashboardData = async () => {
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
        interval={pollingInterval * 1000}
        onTick={loadDashboardData}
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
                    value={pollingInterval}
                    onChange={(e) => {
                      setPollingInterval(Number.parseInt(e.target.value));
                      restart(); // Перезапуск с новым интервалом
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
                    onClick={loadDashboardData}
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
                  <button onClick={loadDashboardData} className="retry-btn">
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
              </div>
            )}
          </div>
        )}
      </Ticker>
    </div>
  );
}
```

## Справочник API

### TickerProps

| Проп        | Тип                               | Обязательный | По умолчанию | Описание                                           |
|-------------|-----------------------------------|--------------|--------------|---------------------------------------------------|
| `interval`  | `number`                          | ✅           | -            | Интервал между тиками в миллисекундах             |
| `onTick`    | `(count: number) => void`         | ❌           | -            | Колбэк, вызываемый при каждом тике с текущим количеством |
| `autoStart` | `boolean`                         | ❌           | `true`       | Начинать ли тиканье сразу при монтировании        |
| `maxTicks`  | `number`                          | ❌           | -            | Максимальное количество тиков перед остановкой    |
| `onStop`    | `(finalCount: number) => void`    | ❌           | -            | Колбэк, вызываемый при остановке тикера           |
| `children`  | `(state: TickerState) => ReactNode` | ❌         | -            | Функция render prop, получающая состояние тикера  |

### TickerState

| Свойство    | Тип          | Описание                                    |
|-------------|--------------|---------------------------------------------|
| `count`     | `number`     | Текущее количество тиков, начиная с 0       |
| `stop`      | `() => void` | Функция немедленной остановки тикера        |
| `restart`   | `() => void` | Функция перезапуска тикера (сбрасывает count) |
| `isRunning` | `boolean`    | Работает ли тикер в данный момент           |

## Лучшие практики

### Производительность
- **Подходящие интервалы**: Используйте разумные интервалы, чтобы избежать проблем с производительностью
- **Очистка**: Компонент автоматически очищает интервалы при размонтировании
- **Обновления состояния**: Избегайте тяжёлых операций в колбэках onTick
- **Управление памятью**: Будьте внимательны к замыканиям в функциях колбэков

### Пользовательский опыт
- **Визуальная обратная связь**: Всегда предоставляйте визуальную индикацию состояния тикера
- **Опции управления**: Давайте пользователям возможность запускать/останавливать при необходимости
- **Индикация прогресса**: Показывайте прогресс для конечных операций
- **Обработка ошибок**: Изящно обрабатывайте ошибки в асинхронных операциях

## Связанные компоненты
- [`async`](../async/README.md) - Для обработки асинхронных операций в тикерах
- [`state`](../state/README.md) - Для сложного управления состоянием
- [`memo`](../memo/README.md) - Для оптимизации компонентов на основе тикера
