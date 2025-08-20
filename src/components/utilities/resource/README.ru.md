# Компонент Resource

Мощный компонент для управления асинхронными ресурсами в React приложениях, который обрабатывает состояния загрузки, ошибки и загрузку данных с поддержкой отмены запросов. Идеально подходит для архитектуры Feature-Sliced Design (FSD).

## Описание

Компонент Resource предоставляет декларативный способ обработки асинхронных операций в React приложениях. Он управляет состояниями загрузки, обработкой ошибок, отменой запросов и предоставляет чистый интерфейс render props для отображения различных состояний UI в зависимости от статуса асинхронной операции.

## Когда использовать

- 🔄 **Загрузка асинхронных данных**: Загрузка данных из API, баз данных или любых асинхронных источников
- 📊 **Управление сущностями**: Управление сущностями в FSD архитектуре (пользователи, продукты, заказы)
- 🎯 **Данные функций**: Загрузка данных, специфичных для функций в слое features
- 🧩 **Данные виджетов**: Управление асинхронными операциями на уровне виджетов
- 🔍 **Поиск и фильтрация**: Обработка результатов поиска и отфильтрованных данных
- 📄 **Данные страниц**: Загрузка ресурсов на уровне страниц
- 🔄 **Обновление данных**: Предоставление возможностей перезагрузки с состояниями загрузки
- 🚫 **Отмена запросов**: Автоматическая очистка отложенных запросов

## Используемые паттерны

- **Паттерн Render Props**: Гибкий рендеринг на основе состояния ресурса
- **Отмена запросов**: Автоматическая отмена устаревших запросов
- **Дизайн без эффектов**: Минимальные побочные эффекты с правильной очисткой
- **Составные компоненты**: Дополнительные вспомогательные компоненты для общих паттернов
- **Безопасность TypeScript**: Полная типобезопасность с генерическими типами ресурсов
- **Отслеживание зависимостей**: Автоматическая перезагрузка при изменении зависимостей
- **Управление ресурсами**: Правильная очистка и управление памятью

## TypeScript типы

```typescript
interface ResourceState<T, E = Error> {
  data: T | null
  error: E | null
  loading: boolean
  refetch: () => Promise<void>
}

interface ResourceProps<T, E = Error> {
  loader: () => Promise<T>
  initialData?: T
  immediate?: boolean
  deps?: unknown[]
  onError?: (error: E) => void
  onSuccess?: (data: T) => void
  children: RenderProp<ResourceState<T, E>>
}
```

## Справочник API

### Пропсы

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `loader` | `() => Promise<T>` | обязательный | Функция, возвращающая Promise для загрузки ресурса |
| `initialData` | `T` | `null` | Начальные данные для отображения перед загрузкой |
| `immediate` | `boolean` | `true` | Загружать ли немедленно при монтировании |
| `deps` | `unknown[]` | `[]` | Зависимости, которые запускают перезагрузку при изменении |
| `onError` | `(error: E) => void` | - | Колбэк при возникновении ошибки |
| `onSuccess` | `(data: T) => void` | - | Колбэк при успешной загрузке данных |
| `children` | `RenderProp<ResourceState<T, E>>` | обязательный | Функция рендеринга, получающая состояние ресурса |

### Состояние ресурса

Функция рендеринга children получает объект `ResourceState` с:

- `data`: Загруженные данные или null
- `error`: Любая произошедшая ошибка или null
- `loading`: Булево значение, указывающее, выполняется ли запрос
- `refetch`: Функция для ручной перезагрузки ресурса

## Примеры

### Базовое использование

```tsx
interface User {
  id: number
  name: string
  email: string
}

function UserProfile({ userId }: { userId: number }) {
  return (
    <Resource<User> loader={() => fetchUser(userId)}>
      {({ data, loading, error, refetch }) => {
        if (loading && !data) return <UserSkeleton />
        if (error) return <ErrorMessage error={error} onRetry={refetch} />
        if (data) return <UserCard user={data} />
        return null
      }}
    </Resource>
  )
}
```

### С зависимостями

```tsx
function UserPosts({ userId, category }: { userId: number; category: string }) {
  return (
    <Resource<Post[]> 
      loader={() => fetchUserPosts(userId, category)}
      deps={[userId, category]}
    >
      {({ data, loading, error, refetch }) => (
        <div>
          {loading && <div className="spinner">Загрузка постов...</div>}
          {error && <ErrorBanner error={error} onRetry={refetch} />}
          {data && <PostList posts={data} />}
        </div>
      )}
    </Resource>
  )
}
```

### С начальными данными

```tsx
function ProductDetails({ productId, cachedProduct }: Props) {
  return (
    <Resource<Product>
      loader={() => fetchProduct(productId)}
      initialData={cachedProduct}
      deps={[productId]}
    >
      {({ data, loading, error, refetch }) => (
        <div>
          {data && <ProductCard product={data} />}
          {loading && <div className="refresh-indicator">Обновление...</div>}
          {error && <div className="error">Не удалось обновить</div>}
        </div>
      )}
    </Resource>
  )
}
```

### Ручная загрузка

```tsx
function SearchResults() {
  const [query, setQuery] = useState('')
  
  return (
    <div>
      <SearchInput 
        value={query} 
        onChange={setQuery}
      />
      
      <Resource<SearchResult[]>
        loader={() => searchAPI(query)}
        immediate={false}
        deps={[query]}
      >
        {({ data, loading, error, refetch }) => (
          <div>
            <button onClick={refetch} disabled={loading || !query}>
              {loading ? 'Поиск...' : 'Найти'}
            </button>
            
            {error && <ErrorMessage error={error} />}
            {data && <SearchResultList results={data} />}
          </div>
        )}
      </Resource>
    </div>
  )
}
```

### Интеграция с FSD архитектурой

```tsx
// entities/user/api/userApi.ts
export const fetchUser = (id: number): Promise<User> => {
  return api.get(`/users/${id}`)
}

// features/user-profile/ui/UserProfile.tsx
export function UserProfile({ userId }: UserProfileProps) {
  return (
    <Resource<User>
      loader={() => fetchUser(userId)}
      deps={[userId]}
      onError={(error) => {
        analytics.track('user_profile_load_error', { userId, error: error.message })
      }}
    >
      {({ data, loading, error, refetch }) => {
        if (loading && !data) return <UserProfileSkeleton />
        if (error) return <UserProfileError error={error} onRetry={refetch} />
        if (data) return <UserProfileCard user={data} onRefresh={refetch} />
        return null
      }}
    </Resource>
  )
}

// widgets/user-dashboard/ui/UserDashboard.tsx
export function UserDashboard() {
  return (
    <div className="dashboard">
      <Resource<DashboardData>
        loader={() => fetchDashboardData()}
        onSuccess={(data) => {
          analytics.track('dashboard_loaded', { itemCount: data.items.length })
        }}
      >
        {({ data, loading, error, refetch }) => (
          <DashboardLayout>
            {loading && <DashboardSkeleton />}
            {error && <DashboardError error={error} onRetry={refetch} />}
            {data && <DashboardContent data={data} onRefresh={refetch} />}
          </DashboardLayout>
        )}
      </Resource>
    </div>
  )
}
```

### Паттерны обработки ошибок

```tsx
function RobustResourceLoader() {
  return (
    <Resource<ApiData>
      loader={async () => {
        const response = await fetch('/api/data')
        if (!response.ok) {
          throw new ApiError(response.status, response.statusText)
        }
        return response.json()
      }}
      onError={(error) => {
        if (error instanceof ApiError) {
          // Обработка ошибок API
          logger.error('API Error:', error.status, error.message)
        } else {
          // Обработка сетевых ошибок
          logger.error('Network Error:', error.message)
        }
      }}
    >
      {({ data, loading, error, refetch }) => {
        if (loading) return <LoadingSpinner />
        
        if (error) {
          if (error instanceof ApiError && error.status === 404) {
            return <NotFoundMessage />
          }
          return <GenericError error={error} onRetry={refetch} />
        }
        
        return data ? <DataView data={data} /> : <EmptyState />
      }}
    </Resource>
  )
}
```

## Соображения производительности

### Отмена запросов
- Автоматически отменяет предыдущие запросы при изменении зависимостей
- Предотвращает утечки памяти и состояния гонки
- Не требует дополнительной конфигурации

### Управление памятью
- Очищает ресурсы при размонтировании компонента
- Предотвращает обновления состояния на размонтированных компонентах
- AbortController автоматически обрабатывает очистку

### Советы по оптимизации

```tsx
// Мемоизируйте дорогие загрузчики
const memoizedLoader = useCallback(() => {
  return expensiveDataFetch(complexParams)
}, [complexParams])

<Resource loader={memoizedLoader}>
  {/* ... */}
</Resource>

// Используйте стабильные массивы зависимостей
const stableDeps = useMemo(() => [userId, filters], [userId, filters])

<Resource 
  loader={() => fetchData(userId, filters)}
  deps={stableDeps}
>
  {/* ... */}
</Resource>
```

## Лучшие практики

### Делайте ✅

```tsx
// Используйте TypeScript дженерики для типобезопасности
<Resource<User[]> loader={() => fetchUsers()}>
  {({ data }) => data && <UserList users={data} />}
</Resource>

// Обрабатывайте все состояния ресурсов
<Resource loader={loader}>
  {({ data, loading, error, refetch }) => {
    if (loading && !data) return <Skeleton />
    if (error) return <Error error={error} onRetry={refetch} />
    if (data) return <Content data={data} />
    return <EmptyState />
  }}
</Resource>

// Обеспечивайте осмысленную обработку ошибок
<Resource 
  loader={loader}
  onError={(error) => {
    analytics.track('resource_error', { error: error.message })
    toast.error('Не удалось загрузить данные')
  }}
>
  {/* ... */}
</Resource>
```

### Не делайте ❌

```tsx
// Не игнорируйте состояния ошибок
<Resource loader={loader}>
  {({ data, loading }) => {
    if (loading) return <Spinner />
    return <Content data={data} /> // А что если есть ошибка?
  }}
</Resource>

// Не создавайте загрузчики внутри рендера
<Resource loader={() => fetch('/api/data')}> // Создает новую функцию каждый рендер
  {/* ... */}
</Resource>

// Не забывайте обрабатывать пустые состояния
<Resource loader={loader}>
  {({ data, loading, error }) => {
    if (loading) return <Spinner />
    if (error) return <Error />
    return <Content data={data} /> // А что если data равно null/пустое?
  }}
</Resource>
```

## Руководство по миграции

### От useEffect + useState

```tsx
// До: Ручное управление состоянием
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    
    fetchUser(userId)
      .then(data => {
        if (!cancelled) {
          setUser(data)
          setError(null)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [userId])

  if (loading) return <Spinner />
  if (error) return <Error />
  return user ? <UserCard user={user} /> : null
}

// После: Декларативное управление ресурсами
function UserProfile({ userId }) {
  return (
    <Resource<User>
      loader={() => fetchUser(userId)}
      deps={[userId]}
    >
      {({ data, loading, error, refetch }) => {
        if (loading) return <Spinner />
        if (error) return <Error error={error} onRetry={refetch} />
        return data ? <UserCard user={data} /> : null
      }}
    </Resource>
  )
}
```

### От пользовательских хуков

```tsx
// До: Пользовательский хук
function useUser(userId) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  
  useEffect(() => {
    fetchUser(userId)
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => setState({ data: null, loading: false, error }))
  }, [userId])
  
  return state
}

// После: Компонент Resource
function UserProfile({ userId }) {
  return (
    <Resource<User>
      loader={() => fetchUser(userId)}
      deps={[userId]}
    >
      {({ data, loading, error }) => {
        // Та же логика рендеринга
      }}
    </Resource>
  )
}
```

## Связанные компоненты

- [`cache`](../cache/README.ru.md) - Для кэширования данных ресурсов
- [`lazy`](../../performance/lazy/README.ru.md) - Для ленивой загрузки компонентов с данными
- [`compose`](../compose/README.ru.md) - Для композиции провайдеров ресурсов
- [`debug`](../debug/README.ru.md) - Для отладки состояний ресурсов

## Доступность

Компонент Resource нейтрален к доступности, поскольку он не рендерит UI элементы напрямую. Однако убедитесь, что ваши состояния ресурсов обеспечивают правильную доступность:

### Состояния загрузки
```tsx
<Resource loader={loader}>
  {({ loading, data, error }) => {
    if (loading) {
      return (
        <div 
          role="status" 
          aria-live="polite"
          aria-label="Загрузка контента"
        >
          <Spinner />
          <span className="sr-only">Загрузка...</span>
        </div>
      )
    }
    // ... другие состояния
  }}
</Resource>
```

### Состояния ошибок
```tsx
<Resource loader={loader}>
  {({ error, refetch }) => {
    if (error) {
      return (
        <div role="alert" aria-live="assertive">
          <p>Не удалось загрузить контент: {error.message}</p>
          <button onClick={refetch}>Попробовать снова</button>
        </div>
      )
    }
    // ... другие состояния
  }}
</Resource>
```

## Интеграция с аналитикой

```tsx
function AnalyticsResource<T>({ resourceName, ...props }: Props & { resourceName: string }) {
  return (
    <Resource<T>
      {...props}
      onSuccess={(data) => {
        analytics.track('resource_loaded', {
          resource: resourceName,
          size: Array.isArray(data) ? data.length : 1
        })
        props.onSuccess?.(data)
      }}
      onError={(error) => {
        analytics.track('resource_error', {
          resource: resourceName,
          error: error.message
        })
        props.onError?.(error)
      }}
    >
      {props.children}
    </Resource>
  )
}
```