# Компонент Gate

Сложная утилита для таргетирования аудитории и контроля доступа в React приложениях, разработанная для условного рендеринга контента на основе определения окружения, анализа пользовательского агента и пользовательской логики для точной сегментации аудитории.

## Описание

Компонент `Gate` предоставляет декларативный подход к условному рендерингу на основе аудитории в React приложениях. Он интеллектуально определяет целевую аудиторию (боты, люди, мобильные устройства, десктоп, среды разработки/продакшн) и соответственно рендерит подходящий контент. Этот компонент необходим для создания адаптивных приложений, которые адаптируют свое поведение и контент в зависимости от контекста просмотра, пользовательского агента или окружения.

## Когда использовать

- **Определение ботов**: Предоставление разного контента веб-краулерам и поисковым системам против человеческих пользователей
- **Рендеринг для конкретных устройств**: Показ разных UI компонентов для мобильных против десктопных пользователей
- **Логика на основе окружения**: Рендеринг инструментов отладки в разработке, но скрытие их в продакшене
- **SEO оптимизация**: Предоставление SEO-дружественного контента ботам, предлагая интерактивные возможности пользователям
- **Прогрессивное улучшение**: Начало с базового контента для ботов и улучшение для интерактивных пользователей
- **A/B тестирование**: Таргетинг конкретных сегментов аудитории для тестирования функций
- **Оптимизация производительности**: Загрузка легкого контента для сред с ограниченными ресурсами
- **Доступность**: Предоставление альтернативного контента на основе возможностей пользовательского агента

## Как это работает

Компонент `Gate` использует интеллектуальные механизмы определения для:

1. **Анализ пользовательского агента**: Анализирует строки пользовательского агента браузера для идентификации ботов, мобильных устройств и браузеров
2. **Определение окружения**: Определяет, выполняется ли в среде разработки или продакшена
3. **Пользовательская логика определения**: Поддерживает пользовательские функции определения для конкретных случаев использования
4. **Таргетинг аудитории**: Сопоставляет определенные характеристики с спецификациями целевой аудитории
5. **Fallback рендеринг**: Предоставляет изящные fallbacks для несоответствующих аудиторий

## Используемые паттерны

- **Паттерн стратегии**: Различные стратегии определения для различных типов аудитории
- **Паттерн условного рендеринга**: Рендерит контент на основе определения аудитории
- **Паттерн определения окружения**: Адаптирует поведение на основе среды выполнения
- **Паттерн Fallback**: Предоставляет альтернативный контент для нецелевых аудиторий
- **Паттерн пользовательского определения**: Позволяет пользовательскую логику определения аудитории
- **Типобезопасность**: Полная поддержка TypeScript с предопределенными типами аудитории

## TypeScript типы

```typescript
/**
 * Типы целевой аудитории для компонента Gate
 */
type GateTarget = 'bot' | 'human' | 'mobile' | 'desktop' | 'dev' | 'prod';

/**
 * Пропсы для компонента Gate
 */
interface GateProps {
  /** Целевая аудитория (одна или несколько) */
  for: GateTarget | GateTarget[];
  /** Контент для рендеринга для целевой аудитории */
  children: ReactNode;
  /** Fallback контент для нецелевой аудитории */
  fallback?: ReactNode;
  /** Пользовательская функция определения */
  detect?: () => boolean;
}

/**
 * Интерфейс результата определения
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

## Справочник API

| Проп | Тип | Обязательный | По умолчанию | Описание |
|------|-----|--------------|--------------|----------|
| `for` | `GateTarget \| GateTarget[]` | ✅ | - | Целевая аудитория(и) для рендеринга контента |
| `children` | `ReactNode` | ✅ | - | Контент для рендеринга для целевой аудитории |
| `fallback` | `ReactNode` | | `null` | Альтернативный контент для нецелевой аудитории |
| `detect` | `() => boolean` | | Встроенное определение | Пользовательская функция определения |

## Примеры

### Определение Бот против Человек
```tsx
import { Gate } from 'ui-magic-core';

function HomePage() {
  return (
    <div>
      <h1>Welcome to our website</h1>

      {/* SEO-optimized content for bots */}
      <Gate for="bot" fallback={null}>
        <div className="seo-content">
          <h2>About our services</h2>
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

### Рендеринг Мобильный против Десктоп
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

### Функции Разработка против Продакшн
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

### Несколько целевых аудиторий
```tsx
function AdminDashboard() {
  return (
    <div className="dashboard">
      {/* Show for mobile and desktop humans */}
      <Gate for={['human']} fallback={<div>Please enable JavaScript</div>}>
        <UserInterface />
      </Gate>

      {/* Desktop admin tools */}
      <Gate for="desktop">
        <AdvancedControls />
        <FullScreenGraphs />
      </Gate>

      {/* Mobile simplified interface */}
      <Gate for="mobile" fallback={null}>
        <SimplifiedMobileControls />
        <TouchOptimizedInterface />
      </Gate>
    </div>
  );
}
```

### Пользовательская логика определения
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

### Стратегия SEO оптимизации
```tsx
function ProductPage({ product }) {
  return (
    <div>
      {/* Богатые структурированные данные для поисковых систем */}
      <Gate for="bot">
        <ProductJsonLd product={product} />
        <SEOMetadata product={product} />
        <StaticProductInfo product={product} />
        <ServerRenderedReviews productId={product.id} />
      </Gate>

      {/* Интерактивные функции для пользователей */}
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

### Прогрессивное улучшение
```tsx
function ContactForm() {
  return (
    <div className="contact-section">
      {/* Базовая форма для всех аудиторий */}
      <form action="/contact" method="POST">
        <input type="text" name="name" placeholder="Ваше имя" required />
        <input type="email" name="email" placeholder="Ваш email" required />
        <textarea name="message" placeholder="Ваше сообщение" required />

        {/* Улучшенные функции для интерактивных пользователей */}
        <Gate for="human" fallback={<button type="submit">Отправить сообщение</button>}>
          <FormValidation />
          <AutoSave />
          <CharacterCounter />
          <AttachmentUpload />
          <SubmitButton />
        </Gate>
      </form>

      {/* Контактная информация для ботов (SEO) */}
      <Gate for="bot">
        <address>
          <p>Email: contact@example.com</p>
          <p>Телефон: +7-555-123-4567</p>
          <p>Адрес: ул. Главная 123, Город, Область 12345</p>
        </address>
      </Gate>
    </div>
  );
}
```

### Конфигурация для конкретного окружения
```tsx
function APIProvider({ children }) {
  return (
    <div>
      {/* Конфигурация разработки */}
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

      {/* Конфигурация продакшена */}
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

## Соображения производительности

- **Серверный рендеринг**: Определение Gate работает корректно во время SSR для согласованного рендеринга
- **Клиентская гидратация**: Изящно обрабатывает несоответствия гидратации
- **Размер бандла**: Минимальные накладные расходы с поддержкой tree-shaking для неиспользуемой логики определения
- **Кэширование определения**: Результаты кэшируются для избежания повторных дорогих операций определения
- **Производительность Fallback**: Легкий fallback контент для нецелевых аудиторий

```tsx
// Производительно оптимизированное использование gate
function OptimizedGate({ children, ...props }) {
  // Мемоизация дорогой логики определения
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

## Лучшие практики

1. **Четкое таргетирование аудитории**: Используйте конкретные и осмысленные цели аудитории
2. **Изящные Fallbacks**: Всегда предоставляйте подходящий fallback контент
3. **SEO соображения**: Убедитесь, что боты получают осмысленный, сканируемый контент
4. **Влияние на производительность**: Учитывайте влияние на производительность разных аудиторий
5. **Стратегия тестирования**: Тестируйте все пути аудитории в вашем приложении
6. **Прогрессивное улучшение**: Начинайте с базовой функциональности и улучшайте прогрессивно

## Руководство по миграции

### От условного рендеринга

**До:**
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

**После:**
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

### От переменных окружения

**До:**
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

**После:**
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

## Связанные компоненты

- [`Show`](../show/README.md) - Для простого условного рендеринга
- [`Maybe`](../maybe/README.md) - Для null-безопасного условного рендеринга
- [`Switch`](../switch/README.md) - Для многоветвевой условной логики
- [`If`](../if/README.md) - Для сложных паттернов условного рендеринга
