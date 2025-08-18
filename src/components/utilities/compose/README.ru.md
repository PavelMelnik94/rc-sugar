# Компонент Compose

Мощная утилита для функциональной композиции React компонентов и компонентов высшего порядка (HOC), обеспечивающая чистое и читаемое обертывание компонентов.

## Описание

Компонент `Compose` предоставляет декларативный способ композиции нескольких компонентов или HOC вместе, устраняя необходимость в глубоко вложенных деревьях компонентов. Он автоматически обрабатывает порядок обертывания и поддерживает как React компоненты, так и HOC функции. Идеально подходит для композиции провайдеров, паттернов промежуточного ПО и создания переиспользуемых комбинаций компонентов.

## Когда использовать

### Идеально подходит для
- **Композиции провайдеров**: Множественные контекстные провайдеры (Auth, Theme, Router)
- **Цепочки HOC**: Комбинирование множественных компонентов высшего порядка
- **Паттерны промежуточного ПО**: Последовательное улучшение компонентов
- **Группировка границ ошибок**: Множественные границы ошибок с разными целями
- **Обертки разрешений**: Многоуровневые компоненты контроля доступа
- **Композиция макетов**: Комбинирование компонентов макета
- **Переключатели функций**: Условное обертывание функций
- **Отслеживание аналитики**: Множественные HOC отслеживания

### Избегайте когда
- Обертывание одного компонента (используйте напрямую)
- Статические, неизменяющиеся композиции
- Критичные к производительности пути с множеством компонентов
- Простая передача пропсов (используйте встроенную композицию React)

## Используемые паттерны
- **Паттерн функциональной композиции**: Математическая композиция функций, примененная к React
- **Паттерн компонента высшего порядка**: Расширенная поддержка HOC
- **Паттерн провайдера**: Чистая композиция провайдеров
- **Паттерн reduce**: Использует Array.reduce для накопления компонентов

## TypeScript интерфейс

```typescript
/**
 * Пропсы для компонента Compose
 */
interface ComposeProps extends BaseComponentProps {
  /** Массив компонентов или HOC для композиции */
  components: (ComponentType<{ children: ReactNode }> | ((children: ReactNode) => ReactElement))[];
  /** Дочерние элементы для обертывания составными компонентами */
  children: ReactNode;
  /** Обратить ли порядок композиции (по умолчанию: false) */
  reverse?: boolean;
}
```

## Справочник API

| Проп | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| `components` | `(ComponentType<{children: ReactNode}> \| ((children: ReactNode) => ReactElement))[]` | ✅ | Массив компонентов или HOC для композиции |
| `children` | `ReactNode` | ✅ | Дочерние элементы для обертывания составными компонентами |
| `reverse` | `boolean` | ❌ | Обратить порядок композиции (по умолчанию: false) |

## Примеры

### Композиция провайдеров
```tsx
import { Compose } from 'react-utility-kit';

// Отдельные провайдеры
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext value={{ user, setUser }}>
      {children}
    </AuthContext>
  );
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={{ theme, setTheme }}>
      {children}
    </ThemeContext>
  );
}

function RouterProvider({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
}

function I18nProvider({ children }: { children: ReactNode }) {
  return (
    <IntlProvider locale="ru" messages={messages}>
      {children}
    </IntlProvider>
  );
}

// Чистая композиция вместо вложенных провайдеров
function App() {
  return (
    <Compose components={[AuthProvider, ThemeProvider, RouterProvider, I18nProvider]}>
      <Router>
        <Header />
        <MainContent />
        <Footer />
      </Router>
    </Compose>
  );
}

// Эквивалентно:
// <AuthProvider>
//   <ThemeProvider>
//     <RouterProvider>
//       <I18nProvider>
//         <Router>...</Router>
//       </I18nProvider>
//     </RouterProvider>
//   </ThemeProvider>
// </AuthProvider>
```

### Композиция HOC
```tsx
// Компоненты высшего порядка
function withLoading(WrappedComponent: ComponentType) {
  return (props: any) => {
    const [loading, setLoading] = useState(false);
    return (
      <LoadingProvider value={{ loading, setLoading }}>
        <WrappedComponent {...props} />
      </LoadingProvider>
    );
  };
}

function withErrorBoundary(WrappedComponent: ComponentType) {
  return (props: any) => (
    <ErrorBoundary>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
}

function withAuth(WrappedComponent: ComponentType) {
  return (props: any) => {
    const { user } = useAuth();
    if (!user)
return <LoginForm />;
    return <WrappedComponent {...props} />;
  };
}

function withAnalytics(WrappedComponent: ComponentType) {
  return (props: any) => {
    useEffect(() => {
      analytics.track('Просмотр компонента', { component: WrappedComponent.name });
    }, []);
    return <WrappedComponent {...props} />;
  };
}

// Композиция множественных HOC
function EnhancedDashboard() {
  return (
    <Compose components={[withAuth, withErrorBoundary, withLoading, withAnalytics]}>
      <Dashboard />
    </Compose>
  );
}

// Намного чище чем:
// withAuth(withErrorBoundary(withLoading(withAnalytics(Dashboard))))
```

### Группировка границ ошибок
```tsx
function APIErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<APIErrorMessage />}
      onError={error => reportAPIError(error)}
    >
      {children}
    </ErrorBoundary>
  );
}

function UIErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<UIErrorMessage />}
      onError={error => reportUIError(error)}
    >
      {children}
    </ErrorBoundary>
  );
}

function CriticalErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<CriticalErrorMessage />}
      onError={error => reportCriticalError(error)}
    >
      {children}
    </ErrorBoundary>
  );
}

function RobustComponent() {
  return (
    <Compose components={[CriticalErrorBoundary, APIErrorBoundary, UIErrorBoundary]}>
      <ComplexFeature />
    </Compose>
  );
}
```

### Композиция разрешений и переключателей функций
```tsx
function FeatureFlag({ feature, children }: { feature: string; children: ReactNode }) {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(feature) ? <>{children}</> : null;
}

function Permission({ role, children }: { role: string; children: ReactNode }) {
  const { hasRole } = usePermissions();
  return hasRole(role) ? <>{children}</> : <AccessDenied />;
}

function Subscription({ plan, children }: { plan: string; children: ReactNode }) {
  const { hasPlan } = useSubscription();
  return hasPlan(plan) ? <>{children}</> : <UpgradePrompt />;
}

// Создание фабрик оберток
function withFeature(feature: string) {
  return ({ children }: { children: ReactNode }) => (
  <FeatureFlag feature={feature}>{children}</FeatureFlag>
);
}

function withPermission(role: string) {
  return ({ children }: { children: ReactNode }) => (
  <Permission role={role}>{children}</Permission>
);
}

function withSubscription(plan: string) {
  return ({ children }: { children: ReactNode }) => (
  <Subscription plan={plan}>{children}</Subscription>
);
}

// Композиция контроля доступа
function PremiumAdminFeature() {
  return (
    <Compose components={[
      withSubscription('premium'),
      withPermission('admin'),
      withFeature('advanced-analytics')
    ]}
    >
      <AdvancedAnalyticsDashboard />
    </Compose>
  );
}
```

### Композиция макетов
```tsx
function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Sidebar({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <aside className="w-64 bg-white shadow-lg">
        <Navigation />
      </aside>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

function ContentArea({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {children}
    </div>
  );
}

function DashboardPage() {
  return (
    <Compose components={[PageLayout, Sidebar, ContentArea]}>
      <DashboardContent />
    </Compose>
  );
}
```

### Обратный порядок композиции
```tsx
function OuterWrapper({ children }: { children: ReactNode }) {
  return <div className="outer">{children}</div>;
}

function MiddleWrapper({ children }: { children: ReactNode }) {
  return <div className="middle">{children}</div>;
}

function InnerWrapper({ children }: { children: ReactNode }) {
  return <div className="inner">{children}</div>;
}

// Обычный порядок: Outer > Middle > Inner > Content
<Compose components={[OuterWrapper, MiddleWrapper, InnerWrapper]}>
  <Content />
</Compose>

// Обратный порядок: Inner > Middle > Outer > Content
<Compose components={[OuterWrapper, MiddleWrapper, InnerWrapper]} reverse>
  <Content />
</Compose>
```

### Динамическая композиция компонентов
```tsx
interface AppShellProps {
  features: string[];
  userRole: string;
  subscription: string;
}

function AppShell({ features, userRole, subscription, children }: AppShellProps & { children: ReactNode }) {
  // Динамическое построение списка компонентов
  const components: ComponentType<{ children: ReactNode }>[] = [
    AuthProvider,
    ThemeProvider
  ];

  // Добавление условных компонентов
  if (features.includes('routing')) {
    components.push(RouterProvider);
  }

  if (features.includes('i18n')) {
    components.push(I18nProvider);
  }

  if (userRole === 'admin') {
    components.push(AdminProvider);
  }

  if (subscription === 'premium') {
    components.push(PremiumProvider);
  }

  // Всегда добавлять границу ошибок последней
  components.push(GlobalErrorBoundary);

  return (
    <Compose components={components}>
      {children}
    </Compose>
  );
}

// Использование
<AppShell
  features={['routing', 'i18n']}
  userRole="admin"
  subscription="premium"
>
  <App />
</AppShell>;
```

### Тестирование с Compose
```tsx
// Утилиты для тестов
function TestProviders({ children }: { children: ReactNode }) {
  return (
    <Compose components={[
      ({ children }) => <AuthProvider initialUser={mockUser}>{children}</AuthProvider>,
      ({ children }) => <ThemeProvider initialTheme="light">{children}</ThemeProvider>,
      ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
      ({ children }) => <QueryClient client={testQueryClient}>{children}</QueryClient>
    ]}
    >
      {children}
    </Compose>
  );
}

// В тестах
function renderWithProviders(ui: ReactElement) {
  return render(
    <TestProviders>
      {ui}
    </TestProviders>
  );
}

test('панель управления показывает данные пользователя', () => {
  renderWithProviders(<Dashboard />);
  expect(screen.getByText('Добро пожаловать, Иван')).toBeInTheDocument();
});
```

## Соображения производительности

### Стратегии оптимизации
```typescript
// Мемоизируйте статические массивы компонентов
const STATIC_PROVIDERS = [AuthProvider, ThemeProvider, RouterProvider];

function App() {
  return (
    <Compose components={STATIC_PROVIDERS}>
      <AppContent />
    </Compose>
  );
}

// Мемоизируйте динамические композиции
function DynamicCompose({ features, children }) {
  const components = useMemo(() => {
    const comps = [BaseProvider];
    if (features.includes('auth')) comps.push(AuthProvider);
    if (features.includes('theme')) comps.push(ThemeProvider);
    return comps;
  }, [features]);

  return (
    <Compose components={components}>
      {children}
    </Compose>
  );
}

// Используйте React.memo для дорогих провайдеров
const ExpensiveProvider = React.memo(({ children }) => {
  const expensiveValue = useExpensiveCalculation();
  return (
    <ExpensiveContext.Provider value={expensiveValue}>
      {children}
    </ExpensiveContext.Provider>
  );
});
```

## Лучшие практики

### Делайте ✅
```typescript
// Используйте последовательное именование для компонентов-оберток
const withAuth = (Component) => (props) => (
  <AuthGuard>
    <Component {...props} />
  </AuthGuard>
);

// Предоставляйте осмысленные имена для отображения
AuthProvider.displayName = 'AuthProvider';
ThemeProvider.displayName = 'ThemeProvider';

// Группируйте связанные провайдеры
const DATA_PROVIDERS = [QueryProvider, CacheProvider];
const UI_PROVIDERS = [ThemeProvider, ToastProvider];
const AUTH_PROVIDERS = [AuthProvider, PermissionProvider];

<Compose components={[...DATA_PROVIDERS, ...UI_PROVIDERS, ...AUTH_PROVIDERS]}>
  <App />
</Compose>

// Используйте TypeScript для лучшей типобезопасности
interface ProviderProps {
  children: ReactNode;
}

const TypedProvider: React.FC<ProviderProps> = ({ children }) => (
  <Context.Provider value={value}>{children}</Context.Provider>
);
```

### Не делайте ❌
```typescript
// Не создавайте композиции слишком много компонентов (влияние на производительность)
<Compose components={arrayWith50Components}> // Слишком много!
  {children}
</Compose>

// Не создавайте компоненты инлайн (вызывает повторные рендеры)
<Compose components={[
  ({ children }) => <div>{children}</div> // Создает новый компонент каждый рендер
]}>
  {children}
</Compose>

// Не игнорируйте порядок компонентов (может нарушить функциональность)
<Compose components={[RouterProvider, QueryProvider, AuthProvider]}>
  {/* AuthProvider может нуждаться в контексте роутера */}
</Compose>

// Не забывайте границы ошибок в композиции
<Compose components={[Provider1, Provider2]}> // Нет обработки ошибок
  <RiskyComponent />
</Compose>
```

## Руководство по миграции

### От вложенных компонентов
```typescript
// До: Глубоко вложенные провайдеры
function AppWithProviders() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider>
          <QueryProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </QueryProvider>
        </RouterProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// После: Чистая композиция
function AppWithProviders() {
  return (
    <Compose components={[
      AuthProvider,
      ThemeProvider,
      RouterProvider,
      QueryProvider,
      ToastProvider
    ]}>
      <App />
    </Compose>
  );
}
```

### От ада HOC
```typescript
// До: Ад вложенности HOC
const EnhancedComponent = withAuth(
  withErrorBoundary(
    withLoading(
      withAnalytics(
        withPermissions(Component)
      )
    )
  )
);

// После: Декларативная композиция
<Compose components={[withAuth, withErrorBoundary, withLoading, withAnalytics, withPermissions]}>
  <Component />
</Compose>
```

## Связанные компоненты
- [`gate`](../gate/README.md) - Для условного рендеринга компонентов
- [`if`](../if/README.md) - Для простого условного рендеринга
- [`when`](../when/README.md) - Для сложной условной логики

## Доступность

Компонент `Compose` сам по себе не влияет на доступность, но составные компоненты должны поддерживать доступность:

```typescript
// Убедитесь, что провайдеры не нарушают дерево доступности
function AccessibleProvider({ children }: { children: ReactNode }) {
  return (
    <div role="none"> {/* Используйте role="none" чтобы не влиять на семантику */}
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    </div>
  );
}

// Поддерживайте правильные ARIA отношения через композицию
<Compose components={[
  ({ children }) => <div role="main">{children}</div>,
  ({ children }) => <section aria-labelledby="main-heading">{children}</section>
]}>
  <h1 id="main-heading">Заголовок страницы</h1>
  <Content />
</Compose>
```
