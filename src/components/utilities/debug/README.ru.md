# Компонент Debug

Комплексная утилита для разработки и отладки React компонентов с консольным логированием, инспекцией данных и функциями только для разработки.

## Описание

Компонент `Debug` предоставляет мощный, но простой способ отладки React приложений во время разработки. Он логирует данные компонентов, пропсы и пользовательскую информацию в консоль со структурированным форматированием и временными метками. Компонент разработан для удобства разработки с контролем безопасности продакшена, что позволяет легко добавлять отладку по всему приложению без беспокойства о производительности или безопасности в продакшен сборках.

## Когда использовать

### Идеально подходит для
- **Отладка разработки**: Логирование пропсов, состояния и потока данных
- **Инспекция компонентов**: Понимание циклов рендеринга компонентов
- **Анализ потока данных**: Отслеживание изменений данных через компоненты
- **Отладка производительности**: Выявление ненужных перерендеров
- **Разработка функций**: Временная отладка во время реализации функций
- **Исследование багов**: Понимание поведения компонентов в конкретных сценариях
- **Интеграция третьих сторон**: Отладка взаимодействий с внешними библиотеками
- **Управление состоянием**: Отслеживание изменений состояния в сложных приложениях

### Избегайте когда
- Продакшен сборки (если не включено явно)
- Критичные к производительности пути рендеринга
- Компоненты, которые рендерятся часто (без учета производительности)
- Чувствительные данные, которые не должны логироваться

## Используемые паттерны
- **Паттерн прозрачной обертки**: Не влияет на структуру дерева компонентов
- **Паттерн инструмента разработки**: Отладка с учетом окружения
- **Паттерн структурированного логирования**: Организованный вывод в консоль с группировкой
- **Паттерн побочных эффектов**: Использует useEffect для побочных эффектов без рендеринга

## TypeScript интерфейс

```typescript
/**
 * Пропсы для компонента Debug
 */
interface DebugProps {
  /**
   * Дочерние элементы для рендеринга (компонент действует как прозрачная обертка)
   */
  children: ReactNode;

  /**
   * Пользовательская метка для идентификации вывода отладки
   */
  label?: string;

  /**
   * Отключить ли отладочное логирование
   * @default false
   */
  disabled?: boolean;

  /**
   * Дополнительные данные для логирования вместе с информацией о компоненте
   */
  data?: Record<string, any>;
}
```

## Справочник API

| Проп | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| `children` | `ReactNode` | ✅ | Дочерние элементы для рендеринга (передаются без изменений) |
| `label` | `string` | ❌ | Пользовательская метка для вывода отладки (по умолчанию: 'Debug') |
| `disabled` | `boolean` | ❌ | Отключить отладочное логирование (по умолчанию: false) |
| `data` | `Record<string, any>` | ❌ | Дополнительные данные для логирования |

## Примеры

### Базовая отладка компонентов
```tsx
import { Debug } from 'ui-magic-core';

function UserProfile({ user, settings }) {
  return (
    <Debug label="UserProfile" data={{ user, settings }}>
      <div className="user-profile">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <UserSettings settings={settings} />
      </div>
    </Debug>
  );
}

// Вывод в консоль:
// 🐛 UserProfile
// Debug Info: {
//   label: "UserProfile",
//   timestamp: "2025-06-13T10:30:45.123Z",
//   data: { user: {...}, settings: {...} },
//   children: [object Object]
// }
// Additional Data: { user: {...}, settings: {...} }
```

### Условное управление отладкой
```tsx
function ProductCard({ product, debugMode = true }) {
  return (
    <Debug
      label="ProductCard"
      disabled={!debugMode}
      data={{
        productId: product.id,
        price: product.price,
        inStock: product.inventory > 0
      }}
    >
      <div className="product-card">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>
{product.price}
{' '}
$
        </p>
        {product.inventory === 0 && <span>Нет в наличии</span>}
      </div>
    </Debug>
  );
}
```

### Отладка изменений состояния
```tsx
function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const addItem = (item) => {
    setItems(prev => [...prev, item]);
    setTotal(prev => prev + item.price);
  };

  return (
    <Debug
      label="Cart State"
      data={{
        itemCount: items.length,
        items: items.map(item => ({ id: item.id, name: item.name, price: item.price })),
        total,
        lastUpdate: Date.now()
      }}
    >
      <div className="shopping-cart">
        <h2>
Cart (
{items.length}
{' '}
items)
        </h2>
        <CartItems items={items} />
        <CartTotal total={total} />
        <AddItemForm onAdd={addItem} />
      </div>
    </Debug>
  );
}
```

### Отладка API ответов
```tsx
function DataFetcher({ url }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return (
    <Debug
      label="API Data Loading"
      data={{
        url,
        loading,
        error,
        dataReceived: !!data,
        dataSize: data ? JSON.stringify(data).length : 0,
        responseTime: Date.now() // Can track actual response time
      }}
    >
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {data && <DataDisplay data={data} />}
    </Debug>
  );
}
```

### Отладка валидации форм
```tsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim())
newErrors.name = 'Name is required';
    if (!formData.email.includes('@'))
newErrors.email = 'Valid email is required';
    if (formData.message.length < 10)
newErrors.message = 'Message is too short';

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Debug
      label="Form Validation"
      data={{
        formData,
        errors,
        isValid,
        fieldsFilled: Object.values(formData).filter(v => v.trim()).length,
        totalFields: Object.keys(formData).length
      }}
    >
      <form onSubmit={(e) => { e.preventDefault(); validateForm(); }}>
        <FormField
          label="Name"
          value={formData.name}
          onChange={value => setFormData(prev => ({ ...prev, name: value }))}
          error={errors.name}
        />
        <FormField
          label="Email"
          value={formData.email}
          onChange={value => setFormData(prev => ({ ...prev, email: value }))}
          error={errors.email}
        />
        <TextArea
          label="Message"
          value={formData.message}
          onChange={value => setFormData(prev => ({ ...prev, message: value }))}
          error={errors.message}
        />
        <button type="submit" disabled={!isValid}>Submit</button>
      </form>
    </Debug>
  );
}
```

### Отладка производительности
```tsx
function ExpensiveComponent({ data }) {
  const renderStart = performance.now();

  // Expensive calculations
  const processedData = useMemo(() => {
    const start = performance.now();
    const result = data.map(item => ({
      ...item,
      computed: heavyComputation(item)
    }));
    const end = performance.now();

    return {
      result,
      computationTime: end - start
    };
  }, [data]);

  const renderEnd = performance.now();

  return (
    <Debug
      label="Performance Metrics"
      data={{
        dataSize: data.length,
        computationTime: processedData.computationTime,
        totalRenderTime: renderEnd - renderStart,
        memoryUsage: performance.memory
? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
        }
: 'Not available'
      }}
    >
      <div className="expensive-component">
        {processedData.result.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </Debug>
  );
}
```

### Условная отладка
```tsx
function ConditionalDebugExample({ user, debugMode }) {
  const shouldDebug = debugMode || user?.role === 'developer';

  if (shouldDebug) {
    return (
      <Debug
        label="Developer Mode"
        production={true} // Force logging even in production for developers
        data={{
          user: {
            id: user.id,
            role: user.role,
            permissions: user.permissions
          },
          debugMode,
          environment: process.env.NODE_ENV,
          buildTime: process.env.REACT_APP_BUILD_TIME
        }}
      >
        <AdminPanel user={user} />
      </Debug>
    );
  }

  return <AdminPanel user={user} />;
}
```

### Интеграция с Error Boundary
```tsx
class DebugErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.group('🚨 Error Boundary caught an error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();
  }

  render() {
    if (this.state.hasError) {
      return (
        <Debug
          label="Error Boundary"
          production={true}
          data={{
            error: this.state.error.message,
            stack: this.state.error.stack,
            timestamp: new Date().toISOString()
          }}
        >
          <ErrorFallback error={this.state.error} />
        </Debug>
      );
    }

    return this.props.children;
  }
}

function SafeComponent() {
  return (
    <DebugErrorBoundary>
      <Debug label="Safe Component">
        <RiskyComponent />
      </Debug>
    </DebugErrorBoundary>
  );
}
```

### Пользовательский хук для отладки
```tsx
// Custom debug hook
function useDebug(label: string, data: any, enabled = true) {
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV === 'production')
return;

    console.group(`🔍 Hook Debug: ${label}`);
    console.log('Data:', data);
    console.log('Timestamp:', new Date().toISOString());
    console.groupEnd();
  }, [label, data, enabled]);
}

function HookDebugExample() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Debug custom hook
  useDebug('Counter State', { count, name });

  return (
    <Debug label="Component with Hook" data={{ count, name }}>
      <div>
        <p>
Counter:
{count}
        </p>
        <button onClick={() => setCount(c => c + 1)}>Increment</button>

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter name"
        />
      </div>
    </Debug>
  );
}
```

## Соображения производительности

### Стратегии оптимизации
```typescript
// Memoize debug data to prevent unnecessary logging
const DebugMemo = React.memo(Debug);

// Use useMemo for expensive debug data
function OptimizedDebug({ children, ...props }) {
  const debugData = useMemo(() => ({
    timestamp: Date.now(),
    ...props.data
  }), [props.data]);

  return (
    <Debug {...props} data={debugData}>
      {children}
    </Debug>
  );
}

// Conditional rendering for performance
function ConditionalDebug({ children, condition, ...props }) {
  if (!condition && process.env.NODE_ENV === 'production') {
    return <>{children}</>;
  }

  return <Debug {...props}>{children}</Debug>;
}
```

## Лучшие практики

### Делайте ✅
```typescript
// Use meaningful labels
<Debug label="User Authentication Flow" data={{ userId, isAuthenticated }}>
  <AuthenticatedRoute />
</Debug>

// Include relevant context
<Debug
  label="Payment Processing"
  data={{
    amount,
    currency,
    paymentMethod,
    userId,
    orderId,
    timestamp: Date.now()
  }}
>
  <PaymentForm />
</Debug>

// Use environment checks
const isDebugEnabled = process.env.NODE_ENV === 'development' ||
                      process.env.REACT_APP_DEBUG === 'true';

<Debug production={isDebugEnabled}>
  <Component />
</Debug>

// Structure debug data meaningfully
<Debug
  label="Component State"
  data={{
    state: { count, name },
    props: { initialValue },
    computed: { isValid, hasErrors },
    meta: { renderCount: renderCountRef.current++ }
  }}
>
  <FormComponent />
</Debug>
```

### Не делайте ❌
```typescript
// Don't log sensitive information
<Debug data={{ password, creditCard, ssn }}> // ❌ Security risk
  <Component />
</Debug>

// Don't leave production debugging enabled without a good reason
<Debug production={true} data={sensitiveData}> // ❌ May expose data
  <Component />
</Debug>

// Don't debug every component
function App() {
  return (
    <Debug label="App">
      <Debug label="Header">
        <Debug label="Nav">
          <Debug label="MenuItem"> // ❌ Too much debugging
            <MenuItem />
          </Debug>
        </Debug>
      </Debug>
    </Debug>
  );
}

// Don't log huge objects without filtering
<Debug data={{
  hugeDatabaseDump: allRecords // ❌ May crash the browser
}}>
  <Component />
</Debug>
```

## Руководство по миграции

### От операторов Console.log
```typescript
// Before: Manual console logging
function Component({ data }) {
  console.log('Component data:', data);

  return <div>{data.name}</div>;
}

// After: Debug component
function Component({ data }) {
  return (
    <Debug label="Component" data={{ data }}>
      <div>{data.name}</div>
    </Debug>
  );
}
```

### От пользовательских отладочных компонентов
```typescript
// Before: Custom debug wrapper
function MyDebugWrapper({ children, info }) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Debug:', info);
  }
  return children;
}

// After: Standard Debug component
<Debug label="My Component" data={info}>
  {children}
</Debug>
```

## Связанные компоненты
- [`if`](../if/README.md) - Для условной отладки на основе условий
- [`when`](../when/README.md) - Для сложной условной логики отладки
- [`gate`](../gate/README.md) - Для отладки на основе флагов функций

## Советы по разработке

### Интеграция с консолью браузера
```typescript
// Setup global debug helpers
window.debugComponent = (label: string, data: any) => {
  console.group(`🔧 Manual Debug: ${label}`);
  console.log(data);
  console.groupEnd();
};

// Usage in components
function Component() {
  const handleDebug = () => {
    window.debugComponent('Manual Debug', { state, props });
  };

  return (
    <Debug label="Component">
      <button onClick={handleDebug}>Manual Debug</button>
    </Debug>
  );
}
```

### Интеграция с DevTools
```typescript
// Integration with React DevTools
function DevToolsDebug({ children, label, data }) {
  // This will appear in the React DevTools Profiler
  React.Profiler.onRender?.(label, 'mount', 0, 0, 0, 0);

  return (
    <Debug label={label} data={data}>
      {children}
    </Debug>
  );
}
```

Компонент `Debug` является важным инструментом разработки, который помогает поддерживать качество кода и ускорять рабочие процессы отладки, сохраняя при этом безопасность продакшена.
