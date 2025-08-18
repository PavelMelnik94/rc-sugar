# Компонент Tap

Утилитарный компонент для выполнения побочных эффектов во время событий жизненного цикла компонента без влияния на результат рендеринга. Идеально подходит для отладки, аналитики, логирования и мониторинга разработки.

## Описание

Компонент `Tap` предоставляет декларативный способ "подключения" к событиям жизненного цикла компонента (монтирование, размонтирование, рендеринг, изменения детей) без изменения отрендеренного результата. Он действует как прозрачная обёртка, которая позволяет выполнять побочные эффекты в определённые моменты жизненного цикла.

## Когда использовать
- 🔍 **Отладка разработки**: Логирование событий жизненного цикла компонента во время разработки
- 📊 **Отслеживание аналитики**: Отслеживание рендеров компонентов и изменений состояния
- 🐛 **Мониторинг производительности**: Мониторинг поведения и производительности компонентов
- 🔄 **Управление побочными эффектами**: Выполнение кода без влияния на рендеринг компонента
- 📝 **Логирование разработки**: Добавление временного логирования без засорения логики компонента
- ⚡ **Отладка горячей перезагрузки**: Отслеживание обновлений компонентов во время разработки

## Используемые паттерны
- **Хуки жизненного цикла**: Подключение к жизненному циклу React компонента
- **Управление побочными эффектами**: Выполнение кода без влияния на рендер
- **Прозрачная обёртка**: Рендерит детей без изменений
- **Осведомлённость о среде**: Может быть ограничен режимом разработки
- **Типобезопасность**: Полная поддержка TypeScript с правильными обработчиками событий

## TypeScript типы
```typescript
import { ReactNode } from 'react';
import { VoidEventHandler } from '../shared/types';

/**
 * Пропсы для компонента Tap
 */
interface TapProps {
  /** Дочерние элементы для рендеринга (передаются без изменений) */
  children: ReactNode;

  /** Колбэк, вызываемый при монтировании компонента */
  onMount?: VoidEventHandler;

  /** Колбэк, вызываемый при размонтировании компонента */
  onUnmount?: VoidEventHandler;

  /** Колбэк, вызываемый при каждом рендере */
  onRender?: VoidEventHandler;

  /** Колбэк, вызываемый при изменении дочерних элементов */
  onChildrenChange?: VoidEventHandler;

  /** Выполнять ли колбэки только в режиме разработки */
  devOnly?: boolean;
}

/** Тип обработчика пустого события */
type VoidEventHandler = () => void;
```

## Справочник API

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `children` | `ReactNode` | - | **Обязательный.** Контент для рендеринга (передаётся без изменений) |
| `onMount` | `VoidEventHandler` | `undefined` | Колбэк, выполняемый при монтировании компонента |
| `onUnmount` | `VoidEventHandler` | `undefined` | Колбэк, выполняемый при размонтировании компонента |
| `onRender` | `VoidEventHandler` | `undefined` | Колбэк, выполняемый при каждом рендере |
| `onChildrenChange` | `VoidEventHandler` | `undefined` | Колбэк, выполняемый при изменении пропа children |
| `devOnly` | `boolean` | `false` | Если true, колбэки выполняются только в режиме разработки |

## Примеры

### Базовый мониторинг жизненного цикла
```tsx
import { Tap } from 'react-utility-kit';

function App() {
  return (
    <Tap
      onMount={() => console.log('App component mounted')}
      onUnmount={() => console.log('App component unmounted')}
      onRender={() => console.log('App component rendered')}
    >
      <div>My application</div>
    </Tap>
  );
}
```

### Интеграция с аналитикой
```tsx
import { Tap } from 'ui-magic-core';
import { analytics } from './analytics';

function ProductCard({ product }) {
  return (
    <Tap
      onMount={() => analytics.track('product_card_viewed', {
        productId: product.id,
        productName: product.name
      })}
      onUnmount={() => analytics.track('product_card_hidden', {
        productId: product.id
      })}
    >
      <div className="product-card">
        <h3>{product.name}</h3>
        <p>
{product.price}
{' '}
$
        </p>
      </div>
    </Tap>
  );
}
```

### Отладка только для разработки
```tsx
import { Tap } from 'ui-magic-core';

function UserProfile({ user }) {
  return (
    <Tap
      devOnly={true}
      onMount={() => console.log('UserProfile mounted with user:', user)}
      onRender={() => console.log('UserProfile rendered at:', new Date())}
      onChildrenChange={() => console.log('User data changed:', user)}
    >
      <div className="user-profile">
        <img src={user.avatar} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </Tap>
  );
}
```

### Мониторинг производительности
```tsx
import { Tap } from 'ui-magic-core';

function ExpensiveComponent({ data }) {
  const startTime = useRef<number>();

  return (
    <Tap
      onMount={() => {
        startTime.current = performance.now();
        console.log('ExpensiveComponent: Mounting started');
      }}
      onRender={() => {
        if (startTime.current) {
          const renderTime = performance.now() - startTime.current;
          console.log(`ExpensiveComponent: Rendered in ${renderTime}ms`);
        }
      }}
    >
      <ComplexVisualization data={data} />
    </Tap>
  );
}
```

### Интеграция с границей ошибок
```tsx
import { Tap } from 'react-utility-kit';

function ComponentWithErrorTracking({ children }) {
  return (
    <Tap
      onMount={() => console.log('Component successfully mounted')}
      onUnmount={() => console.log('Component unmounted')}
      onRender={() => {
        // Track successful renders
        metrics.increment('component.render.success');
      }}
    >
      <ErrorBoundary
        onError={(error) => {
          console.error('Component error:', error);
          metrics.increment('component.render.error');
        }}
      >
        {children}
      </ErrorBoundary>
    </Tap>
  );
}
```

### Интеграция A/B тестирования
```tsx
import { Tap } from 'react-utility-kit';

function FeatureFlag({ variant, children }) {
  return (
    <Tap
      onMount={() => {
        analytics.track('feature_flag_shown', {
          variant,
          timestamp: Date.now()
        });
      }}
      onUnmount={() => {
        analytics.track('feature_flag_hidden', {
          variant,
          timestamp: Date.now()
        });
      }}
    >
      {children}
    </Tap>
  );
}

// Использование
<FeatureFlag variant="новый_заказ">
  <NewOrderFlow />
</FeatureFlag>;
```

### Отслеживание форм
```tsx
import { Tap } from 'ui-magic-core';

function FormSection({ sectionName, children }) {
  return (
    <Tap
      onMount={() => {
        analytics.track('form_section_viewed', {
          section: sectionName,
          timestamp: Date.now()
        });
      }}
      onChildrenChange={() => {
        analytics.track('form_section_updated', {
          section: sectionName
        });
      }}
    >
      <div className="form-section">
        <h3>{sectionName}</h3>
        {children}
      </div>
    </Tap>
  );
}
```

## Соображения производительности

### 🚀 **Оптимизации**
- **Нулевое влияние на рендер**: Компонент Tap не влияет на производительность рендеринга
- **Условное выполнение**: Используйте `devOnly` для избежания накладных расходов в продакшене
- **Минимальная память**: Компонент поддерживает минимальное внутреннее состояние
- **Очистка эффектов**: Правильно очищает эффекты при размонтировании

### ⚠️ **Соображения**
- **Частота рендера**: `onRender` срабатывает при каждом рендере - используйте осторожно
- **Утечки памяти**: Убедитесь, что функции колбэков не создают утечки памяти
- **Режим разработки**: Помните о настройке `devOnly` в разных средах

```tsx
// Хорошо: Лёгкое логирование
<Tap
  devOnly={true}
  onMount={() => console.log('Компонент смонтирован')}
>
  <MyComponent />
</Tap>

// Избегайте: Тяжёлые операции при каждом рендере
<Tap
  onRender={() => {
    // Это выполняется при КАЖДОМ рендере - избегайте тяжёлых операций
    heavyAnalyticsOperation();
  }}
>
  <MyComponent />
</Tap>
```

## Лучшие практики

### ✅ **Рекомендуется**
- Использовать `devOnly={true}` для логирования, специфичного для разработки
- Держать функции колбэков лёгкими и быстрыми
- Использовать для аналитики и мониторинга без влияния на UX
- Сочетать с границами ошибок для комплексного отслеживания
- Использовать описательные имена в логировании для более лёгкой отладки

### ❌ **Избегать**
- Тяжёлых операций в колбэке `onRender`
- Хранения больших объектов в замыканиях колбэков
- Использования без `devOnly` для функций, предназначенных только для отладки
- Изменения внешнего состояния в колбэках жизненного цикла

## Руководство по миграции

### Из ручного управления жизненным циклом
```tsx
// До: Ручные хуки useEffect
function MyComponent() {
  useEffect(() => {
    console.log('Компонент смонтирован');
    return () => console.log('Компонент размонтирован');
  }, []);

  useEffect(() => {
    console.log('Компонент отрендерен');
  });

  return <div>Контент</div>;
}

// После: Использование компонента Tap
function MyComponent() {
  return (
    <Tap
      onMount={() => console.log('Компонент смонтирован')}
      onUnmount={() => console.log('Компонент размонтирован')}
      onRender={() => console.log('Компонент отрендерен')}
    >
      <div>Контент</div>
    </Tap>
  );
}
```

### Из HOC аналитики
```tsx
// До: Компонент высшего порядка
function withAnalytics(WrappedComponent) {
  return function AnalyticsWrapper(props) {
    useEffect(() => {
      analytics.track('component_viewed');
    }, []);

    return <WrappedComponent {...props} />;
  };
}

// После: Использование компонента Tap
function MyComponent(props) {
  return (
    <Tap onMount={() => analytics.track('component_viewed')}>
      <OriginalComponent {...props} />
    </Tap>
  );
}
```

## Связанные компоненты

- **[`track`](../track/README.ru.md)** - Отслеживание аналитики с управлением событиями
- **[`debug`](../debug/README.ru.md)** - Утилиты отладки разработки
- **[`memo`](../memo/README.ru.md)** - Оптимизация производительности с мемоизацией

## Доступность

Компонент `Tap` нейтрален к доступности, поскольку он не рендерит никаких UI элементов и не вмешивается в дерево доступности. Он просто предоставляет возможности мониторинга жизненного цикла.

## Соображения среды

### Разработка против продакшена
```tsx
// Мониторинг только для разработки
<Tap
  devOnly={true}
  onMount={() => console.log('Разработка: Компонент смонтирован')}
>
  <MyComponent />
</Tap>

// Аналитика продакшена
<Tap
  onMount={() => analytics.track('component_viewed')}
>
  <MyComponent />
</Tap>
```
