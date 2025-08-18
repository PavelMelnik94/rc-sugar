# Компонент Lazy

Мощная утилита для ленивой загрузки компонентов, контента и ресурсов в React приложениях, предназначенная для улучшения производительности и уменьшения размера начального бандла через интеллектуальное разделение кода.

## Описание

Компонент `Lazy` предоставляет декларативный подход к ленивой загрузке в React приложениях. Он откладывает загрузку и рендеринг компонентов или контента до тех пор, пока они действительно не понадобятся, например, когда они появляются в области видимости, при взаимодействии пользователя или на основе пользовательских триггеров. Этот компонент является важным для оптимизации производительности, особенно в больших приложениях, где не все компоненты нужно загружать немедленно.

## Когда использовать

- **Разделение кода**: Разбиение больших бандлов на меньшие чанки, которые загружаются по требованию
- **Разделение по маршрутам**: Загрузка компонентов страниц только при навигации к определенным маршрутам
- **Загрузка на основе видимости**: Загрузка контента при его появлении в области видимости
- **Флаги функций**: Условная загрузка функций на основе разрешений пользователя или окружения
- **Тяжелые компоненты**: Отсрочка загрузки дорогих компонентов как графики, редакторы или сложные визуализации
- **Сторонние библиотеки**: Загрузка больших внешних библиотек только когда нужно
- **Прогрессивное улучшение**: Добавление расширенной функциональности постепенно

## Как это работает

Компонент `Lazy` использует динамические импорты и встроенные возможности ленивой загрузки React для:

1. **Динамический импорт**: Загружает компоненты используя ES6 динамические импорты
2. **Интеграция с Suspense**: Работает бесшовно с React Suspense для fallback UI
3. **Error Boundaries**: Предоставляет обработку ошибок для неудачных загрузок
4. **Intersection Observer**: Опциональная загрузка на основе области видимости
5. **Предзагрузка**: Умные стратегии предзагрузки для лучшего UX

## Используемые паттерны

- **Паттерн ленивой загрузки**: Откладывает загрузку ресурсов до необходимости
- **Паттерн разделения кода**: Разбивает бандлы на меньшие, загружаемые чанки
- **Паттерн Intersection Observer**: Загружает контент при входе в область видимости
- **Паттерн Render Props**: Предоставляет состояние загрузки и методы управления
- **Паттерн Error Boundary**: Изящная обработка ошибок загрузки
- **Паттерн предзагрузки**: Стратегическая предзагрузка ресурсов для производительности

## TypeScript типы

```typescript
/**
 * Пропсы для компонента Lazy
 * @template T - Тип пропсов ленивозагружаемого компонента
 */
interface LazyProps<T = any> {
  /** Функция динамического импорта, возвращающая компонент */
  loader: () => Promise<{ default: React.ComponentType<T> }>;
  /** Fallback контент во время загрузки */
  fallback?: React.ReactNode;
  /** Пропсы для передачи в загруженный компонент */
  componentProps?: T;
  /** Загружать при входе компонента в область видимости */
  intersectionBased?: boolean;
  /** Опции intersection observer */
  intersectionOptions?: IntersectionObserverInit;
  /** Предзагружать компонент */
  preload?: boolean;
  /** Компонент fallback для ошибок */
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  /** Попытки повтора при ошибке */
  retryAttempts?: number;
  /** Задержка перед загрузкой (мс) */
  delay?: number;
  /** Колбэк при успешной загрузке компонента */
  onLoad?: (component: React.ComponentType<T>) => void;
  /** Колбэк при ошибке загрузки */
  onError?: (error: Error) => void;
}

/**
 * Опции для создания ленивых компонентов
 */
interface LazyOptions {
  /** Пользовательский компонент загрузки */
  loading?: React.ComponentType;
  /** Пользовательский компонент ошибки */
  error?: React.ComponentType<{ error: Error; retry: () => void }>;
  /** Стратегия предзагрузки */
  preloadStrategy?: 'hover' | 'visible' | 'immediate' | 'idle';
  /** Кэшировать загруженные компоненты */
  cache?: boolean;
}

/**
 * Фабрика ленивых компонентов
 */
interface LazyFactory {
  <T = any>(
    loader: () => Promise<{ default: React.ComponentType<T> }>,
    options?: LazyOptions
  ): React.ComponentType<T>;
}
```

## Справочник API

| Проп | Тип | Обязательный | По умолчанию | Описание |
|------|-----|--------------|--------------|----------|
| `loader` | `() => Promise<{ default: ComponentType }>` | ✅ | - | Функция динамического импорта |
| `fallback` | `ReactNode` | | `<div>Loading...</div>` | UI загрузки fallback |
| `componentProps` | `T` | | `{}` | Пропсы для загруженного компонента |
| `intersectionBased` | `boolean` | | `false` | Загружать при входе в область видимости |
| `intersectionOptions` | `IntersectionObserverInit` | | `{}` | Конфигурация intersection observer |
| `preload` | `boolean` | | `false` | Предзагружать компонент немедленно |
| `errorFallback` | `ComponentType<{error, retry}>` | | Встроенная ошибка | Пользовательский компонент ошибки |
| `retryAttempts` | `number` | | `3` | Количество попыток повтора |
| `delay` | `number` | | `0` | Задержка перед загрузкой (мс) |
| `onLoad` | `(component) => void` | | - | Колбэк успеха |
| `onError` | `(error) => void` | | - | Колбэк ошибки |

## Примеры

### Базовое разделение кода
```tsx
import { Lazy } from 'ui-magic-core';

// Базовая ленивая загрузка
function App() {
  return (
    <div>
      <h1>Мое приложение</h1>
      <Lazy
        loader={() => import('./components/Dashboard')}
        fallback={<div>Загрузка дашборда...</div>}
      />
    </div>
  );
}
```

### Разделение кода по маршрутам
```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Lazy } from 'ui-magic-core';

// Ленивая загрузка компонентов маршрутов
function LazyHome() {
  return (
<Lazy
  loader={() => import('./pages/HomePage')}
  fallback={<PageSkeleton />}
/>
);
}

function LazyDashboard() {
  return (
<Lazy
  loader={() => import('./pages/DashboardPage')}
  fallback={<PageSkeleton />}
  preload // Предзагрузка для лучшего UX
/>
);
}

function LazyAdmin() {
  return (
<Lazy
  loader={() => import('./pages/AdminPage')}
  fallback={<PageSkeleton />}
  errorFallback={({ error, retry }) => (
      <div>
        <h3>Не удалось загрузить панель администратора</h3>
        <p>{error.message}</p>
        <button onClick={retry}>Повторить</button>
      </div>
    )}
/>
);
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LazyHome />} />
        <Route path="/dashboard" element={<LazyDashboard />} />
        <Route path="/admin" element={<LazyAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Ленивая загрузка на основе области видимости
```tsx
function BlogPost({ content }) {
  return (
    <article>
      <h1>{content.title}</h1>
      <p>{content.excerpt}</p>

      {/* Загружать тяжелый компонент комментариев только при прокрутке в видимость */}
      <Lazy
        loader={() => import('./CommentsSection')}
        componentProps={{ postId: content.id }}
        intersectionBased
        intersectionOptions={{
          threshold: 0.1,
          rootMargin: '100px 0px' // Загружать за 100px до входа в область видимости
        }}
        fallback={(
          <div className="comments-placeholder">
            <div className="skeleton" />
            <p>Загрузка комментариев...</p>
          </div>
        )}
      />
    </article>
  );
}
```

### Загрузка на основе флагов функций
```tsx
function ProductPage({ productId, user }) {
  return (
    <div>
      <ProductInfo productId={productId} />

      {/* Загружать расширенные функции только для премиум пользователей */}
      {user.isPremium && (
        <Lazy
          loader={() => import('./PremiumFeatures')}
          componentProps={{ productId, user }}
          fallback={<FeatureSkeleton />}
          onLoad={() => analytics.track('premium_features_loaded')}
        />
      )}

      {/* Загружать дашборд аналитики для админ пользователей */}
      {user.isAdmin && (
        <Lazy
          loader={() => import('./AnalyticsDashboard')}
          intersectionBased
          fallback={<div>Загрузка аналитики...</div>}
        />
      )}
    </div>
  );
}
```

### Загрузка тяжелых сторонних библиотек
```tsx
function DataVisualization({ data }) {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <h2>Анализ данных</h2>
      <div className="data-summary">
        {/* Показать сводку без тяжелой библиотеки графиков */}
        <DataSummary data={data} />
      </div>

      <button onClick={() => setShowChart(true)}>
        Показать интерактивный график
      </button>

      {showChart && (
        <Lazy
          loader={() => import('./ChartComponent')} // Загружает Chart.js/D3/etc
          componentProps={{ data }}
          fallback={(
            <div className="chart-loading">
              <div className="spinner" />
              <p>Загрузка библиотеки графиков...</p>
            </div>
          )}
          onLoad={() => console.log('Библиотека графиков загружена')}
          retryAttempts={2}
        />
      )}
    </div>
  );
}
```

### Расширенная загрузка модальных окон
```tsx
function UserProfile({ userId }) {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div>
      <UserInfo userId={userId} />

      <button onClick={() => setShowEditModal(true)}>
        Редактировать профиль
      </button>

      {showEditModal && (
        <Lazy
          loader={() => import('./EditProfileModal')}
          componentProps={{
            userId,
            isOpen: showEditModal,
            onClose: () => setShowEditModal(false)
          }}
          fallback={(
            <div className="modal-backdrop">
              <div className="modal-loading">
                Загрузка редактора...
              </div>
            </div>
          )}
          delay={100} // Небольшая задержка для предотвращения мерцания
        />
      )}
    </div>
  );
}
```

### Прогрессивная галерея изображений
```tsx
function ImageGallery({ images }) {
  return (
    <div className="gallery">
      {images.map((image, index) => (
        <Lazy
          key={image.id}
          loader={() => import('./HighResImage')}
          componentProps={{ src: image.highRes, alt: image.alt }}
          intersectionBased
          intersectionOptions={{ threshold: 0.1 }}
          fallback={(
            <img
              src={image.thumbnail}
              alt={image.alt}
              className="thumbnail"
            />
          )}
          delay={index * 50} // Ступенчатая загрузка
        />
      ))}
    </div>
  );
}
```

### Умная стратегия предзагрузки
```tsx
function NavigationMenu({ currentPage }) {
  const [hoveredLink, setHoveredLink] = useState(null);

  // Предзагрузка при наведении для лучшего UX
  const preloadPage = (pageId) => {
    if (pageId !== currentPage) {
      // Запуск предзагрузки
      import(`./pages/${pageId}Page`);
    }
  };

  return (
    <nav>
      <Link
        to="/dashboard"
        onMouseEnter={() => preloadPage('Dashboard')}
      >
        Дашборд
      </Link>
      <Link
        to="/analytics"
        onMouseEnter={() => preloadPage('Analytics')}
      >
        Аналитика
      </Link>
      <Link
        to="/settings"
        onMouseEnter={() => preloadPage('Settings')}
      >
        Настройки
      </Link>
    </nav>
  );
}
```

## Соображения производительности

- **Анализ бандла**: Используйте webpack-bundle-analyzer для выявления возможностей разделения
- **Стратегия предзагрузки**: Баланс между производительностью и использованием ресурсов
- **Условия сети**: Учитывайте медленные соединения при настройке задержек и fallbacks
- **Стратегия кэширования**: Реализуйте правильное кэширование для загруженных компонентов
- **Восстановление после ошибок**: Предоставляйте осмысленные состояния ошибок и механизмы повтора

```tsx
// Производительно оптимизированная ленивая загрузка
function OptimizedLazy({ loader, ...props }) {
  const memoizedLoader = useCallback(loader, []);

  return (
    <Lazy
      loader={memoizedLoader}
      intersectionOptions={{ threshold: 0.1 }}
      preload={false}
      {...props}
    />
  );
}
```

## Лучшие практики

1. **Стратегическое разделение**: Разделяйте на границах маршрутов и функций
2. **Осмысленные fallbacks**: Предоставляйте skeleton UI, который соответствует финальному контенту
3. **Обработка ошибок**: Всегда предоставляйте error boundaries и механизмы повтора
4. **Предзагрузка**: Используйте состояния hover/focus для предзагрузки вероятно нужного контента
5. **Прогрессивное улучшение**: Начинайте с базовой функциональности, улучшайте постепенно
6. **Мониторинг производительности**: Отслеживайте времена загрузки и показатели успеха

## Руководство по миграции

### От React.lazy

**До:**
```tsx
const LazyComponent = React.lazy(() => import('./Component'));

function App() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

**После:**
```tsx
function App() {
  return (
    <Lazy
      loader={() => import('./Component')}
      fallback={<div>Загрузка...</div>}
    />
  );
}
```

### От динамических импортов

**До:**
```tsx
function Component() {
  const [Module, setModule] = useState(null);

  useEffect(() => {
    import('./HeavyModule').then(setModule);
  }, []);

  if (!Module)
return <div>Загрузка...</div>;
  return <Module.default />;
}
```

**После:**
```tsx
function Component() {
  return (
    <Lazy
      loader={() => import('./HeavyModule')}
      fallback={<div>Загрузка...</div>}
    />
  );
}
```

## Связанные компоненты

- [`Async`](../async/README.ru.md) - Для управления асинхронными состояниями
- [`Show`](../show/README.ru.md) - Для условного рендеринга
- [`Maybe`](../maybe/README.ru.md) - Для безопасного рендеринга null-значений
- [`Gate`](../gate/README.md) - Для загрузки на основе разрешений
- [`Memo`](../memo/README.md) - Для оптимизации производительности
