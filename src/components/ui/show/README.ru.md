# Компонент Show

Простой и декларативный утилитарный компонент для условного рендеринга в React, предоставляющий чистую альтернативу тернарным операторам и логическим AND выражениям для логики показа/скрытия.

## Описание

Компонент `Show` предоставляет декларативный способ рендеринга контента только в том случае, если условие истинно, делая ваш JSX более чистым и читаемым. Он идеально подходит для простых сценариев условного рендеринга, где вам нужно показать или скрыть контент на основе булевого условия, с опциональным fallback контентом.

Компонент поддерживает как статический контент, так и паттерны render prop для ленивой оценки, что делает его подходящим как для простых, так и для критичных к производительности сценариев.

## Когда использовать

- **Простой условный рендеринг** на основе булевых значений
- **Показ/скрытие UI элементов** без сложной логики
- **Избегание встроенных тернарных операторов**, которые загромождают JSX
- **Улучшение читаемости** простой условной логики
- **Чистый fallback контент** для ложных условий
- **Критичные к производительности сценарии** с ленивой оценкой
- **Простая функциональность переключения** (модалы, выпадающие списки и т.д.)

## Как это работает

Компонент `Show`:

1. **Оценивает условие**: Проверяет, является ли проп `when` истинным
2. **Рендерит children**: Если истинно, рендерит children или вызывает render функцию
3. **Показывает fallback**: Если ложно, рендерит fallback контент или вызывает fallback функцию
4. **Ленивая оценка**: Поддерживает функциональные children для дорогих вычислений
5. **Возвращает null**: Если условие ложно и fallback не предоставлен

## Используемые паттерны

- **Conditional Rendering**: Простой рендеринг на основе булевых значений
- **Render Props Pattern**: Поддержка функциональных children и fallback
- **Guard Pattern**: Защищает дорогие операции булевыми проверками
- **Type Safety**: Полная поддержка TypeScript с правильной типизацией
- **Fallback Pattern**: Изящная деградация с опциональным fallback контентом

## TypeScript типы

```typescript
/**
 * Пропы для компонента Show
 */
interface ShowProps {
  /**
   * Условие для оценки
   */
  when: boolean;
  /**
   * Контент для рендеринга, когда условие истинно
   * Может быть ReactNode или render функцией для ленивой оценки
   */
  children: ReactNode | (() => ReactNode);
  /**
   * Запасной контент для рендеринга, когда условие ложно
   * Может быть ReactNode или render функцией для ленивой оценки
   */
  fallback?: ReactNode | (() => ReactNode);
}
```

## API

### Пропы компонента Show

| Проп | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| `when` | `boolean` | ✅ | Условие для оценки показа контента |
| `children` | `ReactNode \| (() => ReactNode)` | ✅ | Контент для рендеринга, когда условие истинно |
| `fallback` | `ReactNode \| (() => ReactNode)` | ❌ | Контент для рендеринга, когда условие ложно |

## Примеры

### Базовое использование

```tsx
import { Show } from 'rc-sugar';

function UserGreeting({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <Show when={isLoggedIn}>
      <div className="welcome-message">
        <h2>Добро пожаловать!</h2>
        <p>Рады видеть вас снова.</p>
      </div>
    </Show>
  );
}
```

### С Fallback контентом

```tsx
import { Show } from 'rc-sugar';

function AuthSection({ user }: { user: User | null }) {
  return (
    <Show when={!!user} fallback={<LoginForm />}>
      <UserDashboard user={user} />
    </Show>
  );
}
```

### Видимость модалки

```tsx
import { Show } from 'rc-sugar';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="app">
      <button onClick={() => setIsModalOpen(true)}>
        Открыть модалку
      </button>

      <Show when={isModalOpen}>
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2>Содержимое модалки</h2>
          <p>Это модальное окно.</p>
        </Modal>
      </Show>
    </div>
  );
}
```

### Состояния загрузки

```tsx
import { Show } from 'rc-sugar';

function DataComponent({ isLoading, data }: { isLoading: boolean; data: any[] }) {
  return (
    <div className="data-component">
      <Show when={isLoading} fallback={<DataTable data={data} />}>
        <div className="loading-state">
          <Spinner />
          <p>Загрузка данных...</p>
        </div>
      </Show>
    </div>
  );
}
```

### Границы ошибок

```tsx
import { Show } from 'rc-sugar';

function ApiResponseHandler({
  isError,
  error,
  data
}: {
  isError: boolean;
  error?: string;
  data?: any;
}) {
  return (
    <Show when={isError} fallback={<SuccessContent data={data} />}>
      <div className="error-state">
        <ErrorIcon />
        <h3>Упс! Что-то пошло не так</h3>
        <p>{error || 'Произошла неожиданная ошибка'}</p>
        <button onClick={retryRequest}>Попробовать снова</button>
      </div>
    </Show>
  );
}
```

### Ленивая оценка для производительности

```tsx
import { Show } from 'rc-sugar';

function ExpensiveRenderer({ shouldRender }: { shouldRender: boolean }) {
  return (
    <Show when={shouldRender}>
      {() => {
        // Это дорогое вычисление выполняется только когда shouldRender истинно
        console.log('Рендеринг дорогого компонента...');
        return <HeavyComputationComponent />;
      }}
    </Show>
  );
}
```

### Флаги функций

```tsx
import { Show } from 'rc-sugar';

function FeatureToggle({
  isFeatureEnabled,
  children
}: {
  isFeatureEnabled: boolean;
  children: ReactNode;
}) {
  return (
    <Show when={isFeatureEnabled}>
      {children}
    </Show>
  );
}

// Использование
function App() {
  return (
    <div>
      <FeatureToggle isFeatureEnabled={flags.newDashboard}>
        <NewDashboard />
      </FeatureToggle>

      <FeatureToggle isFeatureEnabled={flags.betaFeatures}>
        <BetaFeaturesPanel />
      </FeatureToggle>
    </div>
  );
}
```

### Адаптивный дизайн

```tsx
import { Show } from 'rc-sugar';

function ResponsiveLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  return (
    <div className="layout">
      <Show when={isMobile} fallback={<DesktopNavigation />}>
        <MobileNavigation />
      </Show>

      <main className="content">
        <Show when={!isMobile}>
          <Sidebar />
        </Show>

        <div className="main-content">
          <ContentArea />
        </div>
      </main>
    </div>
  );
}
```

### Разрешения и контроль доступа

```tsx
import { Show } from 'rc-sugar';

function ProtectedContent({
  userPermissions,
  requiredPermission
}: {
  userPermissions: string[];
  requiredPermission: string;
}) {
  const hasPermission = userPermissions.includes(requiredPermission);

  return (
    <Show when={hasPermission} fallback={<AccessDeniedMessage />}>
      <SensitiveContent />
    </Show>
  );
}
```

### Сообщения валидации формы

```tsx
import { Show } from 'rc-sugar';

function FormField({
  value,
  error,
  touched
}: {
  value: string;
  error?: string;
  touched: boolean;
}) {
  const showError = touched && !!error;

  return (
    <div className="form-field">
      <input value={value} className={showError ? 'error' : ''} />
      <Show when={showError}>
        <span className="error-message">{error}</span>
      </Show>
    </div>
  );
}
```

### Система уведомлений

```tsx
import { Show } from 'rc-sugar';

function NotificationContainer({ notifications }: { notifications: Notification[] }) {
  const hasNotifications = notifications.length > 0;

  return (
    <Show when={hasNotifications}>
      <div className="notification-container">
        {notifications.map(notification => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </Show>
  );
}
```

### Сложный условный UI

```tsx
import { Show } from 'rc-sugar';

function ShoppingCart({
  items,
  isCheckingOut,
  isLoggedIn
}: {
  items: CartItem[];
  isCheckingOut: boolean;
  isLoggedIn: boolean;
}) {
  const hasItems = items.length > 0;
  const canCheckout = hasItems && isLoggedIn && !isCheckingOut;

  return (
    <div className="shopping-cart">
      <h2>Корзина покупок</h2>

      <Show when={hasItems} fallback={<EmptyCartMessage />}>
        <CartItemsList items={items} />
        <CartSummary items={items} />

        <Show when={canCheckout} fallback={<LoginPrompt />}>
          <CheckoutButton items={items} />
        </Show>
      </Show>
    </div>
  );
}
```

## Соображения производительности

- **Render функции**: Используйте функциональные children для дорогих вычислений
- **Булева оценка**: Простые булевы проверки очень быстрые
- **Перерендеры**: Компонент перерендеривается при изменении пропа `when`
- **Fallback функции**: Используйте функциональный fallback для дорогого fallback контента

## Лучшие практики

1. **Используйте для простых условий**: Идеально подходит для простого рендеринга на основе булевых значений
2. **Предоставляйте осмысленные Fallback**: Подумайте, что показать, когда условие ложно
3. **Ленивая оценка**: Используйте функциональные children для дорогих операций
4. **Описательные пропы**: Используйте описательные булевы переменные вместо сложных выражений
5. **Комбинируйте с другими компонентами**: Хорошо работает с компонентами If, Switch и Maybe
6. **Избегайте глубокой вложенности**: Для сложной логики рассмотрите использование компонента If

## Миграция с тернарных операторов

### До (встроенный тернарный)
```tsx
// ❌ Встроенные тернарные операторы могут быть трудночитаемыми
return (
  <div>
    {isLoading
? (
      <div className="loading">
        <Spinner />
        <span>Загрузка...</span>
      </div>
    )
: null}

    {hasError ? <ErrorMessage error={error} /> : null}

    {user ? <UserProfile user={user} /> : <LoginForm />}
  </div>
);
```

### После (чисто и декларативно)
```tsx
// ✅ Чистые и читаемые компоненты Show
return (
  <div>
    <Show when={isLoading}>
      <div className="loading">
        <Spinner />
        <span>Загрузка...</span>
      </div>
    </Show>

    <Show when={hasError}>
      <ErrorMessage error={error} />
    </Show>

    <Show when={!!user} fallback={<LoginForm />}>
      <UserProfile user={user} />
    </Show>
  </div>
);
```

## Общие паттерны

### Состояния переключения
```tsx
<Show when={isExpanded} fallback={<ExpandButton />}>
  <CollapseButton />
</Show>;
```

### Загрузка данных
```tsx
<Show when={!isLoading} fallback={<LoadingSkeleton />}>
  <DataDisplay data={data} />
</Show>;
```

### Аутентификация пользователя
```tsx
<Show when={isAuthenticated} fallback={<LoginRequired />}>
  <AuthenticatedContent />
</Show>;
```

## Связанные компоненты

- [`If`](../if/README.ru.md) - Сложный условный рендеринг с ElseIf/Else
- [`Maybe`](../maybe/README.ru.md) - Безопасный от null рендеринг
- [`Switch`](../switch/README.ru.md) - Условный рендеринг на основе значений
