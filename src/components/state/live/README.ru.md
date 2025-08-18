# Компонент Live

Мощный компонент для управления данными реального времени с автоматическим опросом, обработкой ошибок и комплексным управлением состоянием. Идеально подходит для дашбордов, систем мониторинга, живых лент и любых приложений, требующих актуальных данных.

## Описание

Компонент `Live` предоставляет комплексное решение для управления данными реального времени через автоматический опрос. Он обрабатывает сложность обновлений на основе интервалов, состояния ошибок, индикаторы загрузки и предоставляет детальное управление поведением получения данных.

## Когда использовать
- 📊 **Дашборды реального времени**: Живые системные метрики, аналитика и данные мониторинга
- 🔄 **Синхронизация данных**: Поддержание синхронизации UI с данными backend
- 📈 **Живая торговля/финансы**: Цены акций, курсы валют, рыночные данные
- 🌐 **Мониторинг статуса**: Здоровье API, статус сервера, метрики приложения
- 📱 **Социальные ленты**: Живые комментарии, уведомления, потоки активности
- 🎮 **Игры**: Живые счета, статистика игроков, таблицы лидеров
- 🔧 **Инструменты разработки**: Живые логи, метрики производительности, отладочная информация

## Используемые паттерны
- **Паттерн опроса**: Автоматическое получение данных на основе интервалов
- **Паттерн render props**: Предоставляет комплексное живое состояние
- **Управление состоянием**: Полная обработка жизненного цикла и ошибок
- **Оптимистичные обновления**: Возможности немедленного обновления
- **Управление ресурсами**: Автоматическая очистка и управление памятью
- **Типобезопасность**: Полная поддержка TypeScript с дженериками

## TypeScript типы
```typescript
import { RenderProp } from '../shared/types';

/**
 * Пропсы для компонента Live
 */
interface LiveProps<T = any> {
  /** Функция, возвращающая текущее живое значение (синхронно или асинхронно) */
  source: () => T | Promise<T>;

  /** Интервал опроса в миллисекундах */
  interval?: number;

  /** Начальное значение во время загрузки */
  initial?: T;

  /** Автоматически ли начинать при монтировании */
  autoStart?: boolean;

  /** Функция сравнения для определения изменения значения */
  compare?: (prev: T, next: T) => boolean;

  /** Render prop, получающий комплексное живое состояние */
  children: RenderProp<LiveState<T>>;
}

/**
 * Полное состояние, предоставляемое render prop
 */
interface LiveState<T = any> {
  /** Текущее живое значение */
  value: T | undefined;

  /** Предыдущее значение для сравнения */
  previousValue: T | undefined;

  /** Идёт ли сейчас загрузка/получение данных */
  isLoading: boolean;

  /** Активны ли живые обновления */
  isLive: boolean;

  /** Ошибка от функции source */
  error: Error | null;

  /** Запустить живые обновления */
  start: () => void;

  /** Остановить живые обновления */
  stop: () => void;

  /** Обновить значение немедленно */
  refresh: () => Promise<void>;

  /** Количество успешных обновлений */
  updateCount: number;

  /** Временная метка последнего успешного обновления */
  lastUpdate: Date | null;
}

/** Тип render prop */
type RenderProp<T> = (data: T) => React.ReactNode;
```

## Справочник API

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `source` | `() => T \| Promise<T>` | - | **Обязательный.** Функция, возвращающая текущие данные (синхронно или асинхронно) |
| `interval` | `number` | `1000` | Интервал опроса в миллисекундах |
| `initial` | `T` | `undefined` | Начальное значение во время первой загрузки |
| `autoStart` | `boolean` | `true` | Автоматически ли начинать опрос при монтировании |
| `compare` | `(prev: T, next: T) => boolean` | `undefined` | Пользовательское сравнение для определения изменения данных |
| `children` | `RenderProp<LiveState<T>>` | - | **Обязательный.** Render prop, получающий живое состояние |

## Примеры

### Базовый дашборд реального времени
```tsx
import { Live } from 'react-utility-kit';

function SystemDashboard() {
  return (
    <Live
      source={() => fetch('/api/system/status').then(r => r.json())}
      interval={5000}
    >
      {({ value, isLive, isLoading, error, start, stop, lastUpdate }) => (
        <div className="dashboard">
          <header>
            <h2>Статус системы</h2>
            <div className="status">
              {isLive ? '🟢 Live' : '🔴 Stop'}
              <button onClick={isLive ? stop : start}>
                {isLive ? 'Stop' : 'Live'}
              </button>
            </div>
          </header>

          {isLoading && <div className="loading">Обновление...</div>}
          {error && (
<div className="error">
Ошибка:
{error.message}
</div>
)}

          {value && (
            <div className="metrics">
              <div>
ЦП:
{value.cpu}
%
              </div>
              <div>
Память:
{value.memory}
%
              </div>
              <div>
Диск:
{value.disk}
%
              </div>
              <div>
Время работы:
{value.uptime}
              </div>
            </div>
          )}

          {lastUpdate && (
            <footer>
Последнее обновление:
{lastUpdate.toLocaleTimeString()}
            </footer>
          )}
        </div>
      )}
    </Live>
  );
}
```

### Живой тикер акций
```tsx
import { Live } from 'ui-magic-core';

function StockTicker({ symbol }) {
  return (
    <Live
      source={() => getStockPrice(symbol)}
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
{value?.price}
{' '}
₽
            </span>
            {priceChange !== 0 && (
              <span className="change">
                {priceChange > 0 ? '+' : ''}
{priceChange.toFixed(2)}
              </span>
            )}
            <span className="indicator">{isLive ? '📶' : '📵'}</span>
            <small>
Обновлений:
{updateCount}
            </small>
          </div>
        );
      }}
    </Live>
  );
}
```

### Лента сообщений чата
```tsx
import { Live } from 'ui-magic-core';

function LiveChatFeed({ roomId }) {
  return (
    <Live
      source={() => getLatestMessages(roomId)}
      interval={1000}
      initial={[]}
    >
      {({ value: messages, isLoading, error, refresh, isLive }) => (
        <div className="chat-feed">
          <header>
            <h3>
Живой чат
{isLive && '🔴'}
            </h3>
            <button onClick={refresh} disabled={isLoading}>
              Обновить
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
Не удалось загрузить сообщения:
{error.message}
            </div>
          )}
        </div>
      )}
    </Live>
  );
}
```

### Живой виджет аналитики
```tsx
import { Live } from 'ui-magic-core';

function AnalyticsWidget() {
  return (
    <Live
      source={async () => {
        const [visitors, pageviews, revenue] = await Promise.all([
          fetch('/api/analytics/visitors').then(r => r.json()),
          fetch('/api/analytics/pageviews').then(r => r.json()),
          fetch('/api/analytics/revenue').then(r => r.json()),
        ]);
        return { visitors, pageviews, revenue };
      }}
      interval={10000}
    >
      {({ value, isLoading, error, updateCount, lastUpdate }) => (
        <div className="analytics-widget">
          <h3>Живая аналитика</h3>

          {isLoading && <div className="spinner">Загрузка...</div>}

          {error
? (
            <div className="error">Аналитика недоступна</div>
          )
: value
? (
            <div className="metrics">
              <div className="metric">
                <label>Активные посетители</label>
                <span className="value">{value.visitors}</span>
              </div>
              <div className="metric">
                <label>Просмотры страниц</label>
                <span className="value">{value.pageviews}</span>
              </div>
              <div className="metric">
                <label>Доход сегодня</label>
                <span className="value">
{value.revenue}
{' '}
₽
                </span>
              </div>
            </div>
          )
: (
            <div>Данные недоступны</div>
          )}

          <footer>
            Обновлений:
{' '}
{updateCount}
{' '}
|
            Последнее:
{' '}
{lastUpdate?.toLocaleTimeString()}
          </footer>
        </div>
      )}
    </Live>
  );
}
```

### Монитор здоровья сервера
```tsx
import { Live } from 'react-utility-kit';

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
                  {isLive ? 'Стоп' : 'Мониторить'}
                </button>
              </header>

              <div className="status">
                <div className={`indicator ${health?.status}`}>
                  {health?.status === 'healthy'
? '🟢'
                   : health?.status === 'warning' ? '🟡' : '🔴'}
                </div>
                <span>{health?.status || 'Неизвестно'}</span>
              </div>

              {health && (
                <div className="metrics">
                  <div>
Отклик:
{health.responseTime}
мс
                  </div>
                  <div>
ЦП:
{health.cpu}
%
                  </div>
                  <div>
Память:
{health.memory}
%
                  </div>
                </div>
              )}

              {error && <div className="error">Проверка не удалась</div>}
              {isLoading && <div className="loading">Проверка...</div>}
            </div>
          )}
        </Live>
      ))}
    </div>
  );
}
```

### Живой просмотрщик логов
```tsx
import { Live } from 'ui-magic-core';

function LiveLogViewer({ logLevel = 'info' }) {
  return (
    <Live
      source={() => getLogs(logLevel, 50)}
      interval={2000}
      compare={(prev, next) => prev?.length !== next?.length}
    >
      {({ value: logs, isLive, error, stop, start, updateCount }) => (
        <div className="log-viewer">
          <header>
            <h3>
Живые логи (
{logLevel}
)
            </h3>
            <div className="controls">
              <button onClick={isLive ? stop : start}>
                {isLive ? 'Пауза' : 'Продолжить'}
              </button>
              <span>
Обновлений:
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
Не удалось получить логи:
{error.message}
            </div>
          )}
        </div>
      )}
    </Live>
  );
}
```

## Соображения производительности

### 🚀 **Оптимизации**
- **Умный опрос**: Обновляется только при фактическом изменении данных (с пропом `compare`)
- **Автоматическая очистка**: Очищает интервалы и предотвращает утечки памяти
- **Восстановление после ошибок**: Продолжает опрос после ошибок
- **Пакетные обновления**: Эффективное управление состоянием с минимальными ре-рендерами

### ⚠️ **Соображения**
- **Влияние на сеть**: Учитывайте частоту опроса и размер данных
- **Использование батареи**: Частый опрос может разряжать аккумуляторы мобильных устройств
- **Нагрузка на сервер**: Множество одновременных подключений опроса может повлиять на производительность сервера
- **Управление памятью**: Долго работающие живые компоненты должны мониториться

```tsx
// Хорошо: Разумные интервалы опроса
<Live source={getData} interval={5000}>
  {/* ... */}
</Live>

// Хорошо: Пользовательское сравнение для избежания ненужных обновлений
<Live
  source={getData}
  compare={(prev, next) => prev.id !== next.id}
>
  {/* ... */}
</Live>

// Избегайте: Слишком частый опрос
<Live source={getData} interval={100}>
  {/* Это опрашивает 10 раз в секунду! */}
</Live>
```

## Лучшие практики

### ✅ **Рекомендуется**
- Использовать подходящие интервалы опроса (1-10 секунд для большинства случаев)
- Реализовать пользовательские функции `compare` для эффективности
- Корректно обрабатывать состояния ошибок в UI
- Предоставлять элементы управления старт/стоп для пользовательского контроля
- Использовать начальные значения для предотвращения сдвигов макета
- Мониторить использование сети и влияние на производительность

### ❌ **Избегать**
- Чрезвычайно частого опроса (< 500мс) без веской причины
- Игнорирования состояний ошибок в UI
- Опроса, когда компонент не виден (рассмотрите API видимости)
- Больших полезных нагрузок данных без пагинации
- Множественных Live компонентов, опрашивающих одну и ту же конечную точку

## Руководство по миграции

### Из ручного опроса с useEffect
```tsx
// До: Ручной опрос с useEffect
function DashboardWidget() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      setLoading(true);
      try {
        const result = await getData();
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
      {loading && <div>Загрузка...</div>}
      {error && (
<div>
Ошибка:
{error.message}
</div>
)}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}

// После: Использование компонента Live
function DashboardWidget() {
  return (
    <Live source={getData} interval={5000}>
      {({ value, isLoading, error }) => (
        <div>
          {isLoading && <div>Загрузка...</div>}
          {error && (
<div>
Ошибка:
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

### Из WebSocket к опросу
```tsx
// До: WebSocket соединение
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

// После: Fallback к опросу для более простой настройки
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

## Связанные компоненты

- **[`async`](../async/README.ru.md)** - Одноразовое асинхронное получение данных
- **[`cache`](../cache/README.ru.md)** - Кэширование данных и мемоизация
- **[`track`](../track/README.ru.md)** - Аналитика и отслеживание событий

## Доступность

Компонент `Live` нейтрален к доступности, но учтите эти лучшие практики:

### Поддержка скрин-ридеров
- Объявляйте важные изменения данных через живые регионы
- Предоставляйте альтернативные способы доступа к живым данным

```tsx
<Live source={getNotifications} interval={5000}>
  {({ value: notifications }) => (
    <div aria-live="polite" aria-label="Живые системные уведомления">
      {notifications?.map(notification => (
        <div key={notification.id} role="alert">
          {notification.message}
        </div>
      ))}
    </div>
  )}
</Live>;
```

## Продвинутые паттерны

### Множественные источники данных
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

### Условный опрос
```tsx
function ConditionalLive({ visible, priority }) {
  const interval = priority === 'high' ? 1000 : 5000;

  return (
    <Live
      source={getData}
      interval={interval}
      autoStart={visible}
    >
      {({ value, start, stop, isLive }) => (
        <div>
          {!visible && (
            <button onClick={start}>Начать мониторинг</button>
          )}
          {/* ... рендер данных ... */}
        </div>
      )}
    </Live>
  );
}
```
