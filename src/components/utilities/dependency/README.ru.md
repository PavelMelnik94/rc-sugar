# Простая Инъекция Зависимостей

Легковесная, типобезопасная система инъекции зависимостей для React 19 приложений.

## Возможности

- 🚀 **Простой API** - Всего одна функция для создания контекста и хука
- 🔒 **Типобезопасность** - Полная поддержка TypeScript с автодополнением
- ⚡ **Готов для React 19** - Использует новейшие возможности React (`use` хук, новый синтаксис контекста)
- 🎯 **Локальная область** - Идеально для небольших, локальных контейнеров зависимостей
- 📦 **Без зависимостей** - Требуется только React
- 🧪 **Утилиты для тестирования** - Встроенные помощники для легкого мокирования
- 🔍 **Поддержка отладки** - Улучшенные сообщения об ошибках и интеграция с React DevTools
- ✅ **Валидация во время выполнения** - Опциональная валидация схем Zod в разработке
- ⚡ **Оптимизация производительности** - Мемоизированные компоненты для предотвращения ненужных ре-рендеров

## Установка

```bash
npm install react-utility-kit
```

## Быстрый старт

```tsx
import { createDependencyContext } from 'react-utility-kit'

// Определите интерфейс ваших сервисов
interface AppServices {
  api: { get: (url: string) => Promise<unknown> }
  logger: { log: (msg: string) => void }
}

// Создайте контекст и хук
const { Provider, useDependency } = createDependencyContext<AppServices>()

// Используйте в компонентах
function UserProfile() {
  const api = useDependency('api')
  const logger = useDependency('logger')
  
  React.useEffect(() => {
    api.get('/user').then(() => logger.log('Пользователь загружен'))
  }, [api, logger])
  
  return <div>Профиль пользователя</div>
}

// Предоставьте зависимости
function App() {
  const services: AppServices = {
    api: { get: async (url) => fetch(url).then(r => r.json()) },
    logger: { log: (msg) => console.log(msg) }
  }
  
  return (
    <Provider dependencies={services}>
      <UserProfile />
    </Provider>
  )
}
```

## Справочник API

### `createDependencyContext<T>(options?)`

Создает новый контекст инъекции зависимостей.

**Параметры:**
- `options.contextName?: string` - Имя для отладки (отображается в React DevTools)
- `options.schema?: ZodSchema` - Опциональная схема Zod для валидации во время выполнения в режиме отладки
- `options.isDebug?: boolean` - Включить режим отладки 

**Возвращает:**
- `Provider` - React компонент для предоставления зависимостей (мемоизированный)
- `useDependency` - Хук для использования зависимостей
- `createTestProvider` - Утилита для тестирования

**Пример:**
```tsx
import { z } from 'zod'

const servicesSchema = z.object({
  api: z.object({ get: z.function() }),
  logger: z.object({ log: z.function() })
})

const { Provider, useDependency, createTestProvider } = createDependencyContext<MyServices>({
  contextName: 'AppServices',
  schema: servicesSchema,
  isDebug: true
})
```

### `Provider`

Предоставляет зависимости дочерним компонентам. Компонент мемоизирован для предотвращения ненужных ре-рендеров.

**Пропсы:**
- `dependencies: T` - Объект, содержащий все зависимости
- `children: ReactNode` - Дочерние компоненты

**Возможности:**
- Автоматически валидирует зависимости с помощью схемы Zod (если предоставлена и включен режим отладки)
- Имеет установленный `displayName` для лучшего опыта в React DevTools
- Мемоизирован для предотвращения ре-рендеров когда зависимости не изменились

### `useDependency(key)`

Разрешает конкретную зависимость по ключу.

**Параметры:**
- `key: keyof T` - Ключ зависимости

**Возвращает:** Разрешенное значение зависимости

**Выбрасывает:** Ошибку, если зависимость не найдена или используется вне Provider. Сообщения об ошибках включают доступные ключи зависимостей для лучшей отладки.

## Множественные контексты

Вы можете создать несколько независимых контекстов:

```tsx
// API сервисы
const { Provider: ApiProvider, useDependency: useApi } = 
  createDependencyContext<ApiServices>()

// UI сервисы  
const { Provider: UiProvider, useDependency: useUi } = 
  createDependencyContext<UiServices>()

function App() {
  return (
    <ApiProvider dependencies={apiServices}>
      <UiProvider dependencies={uiServices}>
        <MyComponent />
      </UiProvider>
    </ApiProvider>
  )
}
```

## Утилиты TypeScript

Библиотека предоставляет утилитарные типы для продвинутого использования TypeScript:

```tsx
import { InferDependencies, ExtractDependencyTypes } from 'ui-magic-core'

// Выведите типы зависимостей из контекста
type MyDeps = InferDependencies<typeof myContext>

// Извлеките конкретные типы зависимостей
type ApiType = ExtractDependencyTypes<MyServices, 'api'>
type LoggerType = ExtractDependencyTypes<MyServices, 'logger'>
```

## Продвинутые примеры

### С валидацией во время выполнения

```tsx
import { z } from 'zod'
import { createDependencyContext } from 'ui-magic-core'

interface Services {
  api: { get: (url: string) => Promise<any> }
  config: { apiUrl: string }
}

const servicesSchema = z.object({
  api: z.object({ get: z.function() }),
  config: z.object({ apiUrl: z.string().url() })
})

const { Provider, useDependency } = createDependencyContext<Services>({
  contextName: 'AppServices',
  schema: servicesSchema,
  isDebug: process.env.NODE_ENV === 'development'
})
```

### Оптимизированная по производительности настройка

```tsx
// Provider автоматически мемоизирован, но вы можете оптимизировать и зависимости
const services = useMemo(() => ({
  api: { get: (url: string) => fetch(url).then(r => r.json()) },
  logger: { log: (msg: string) => console.log(msg) }
}), [])

return (
  <Provider dependencies={services}>
    <App />
  </Provider>
)
```

## Лучшие практики

1. **Определяйте интерфейсы** - Всегда типизируйте ваши зависимости
2. **Держите локально** - Используйте для зависимостей уровня компонента
3. **Избегайте глобального состояния** - Это не решение для управления состоянием
4. **Используйте фабрики** - Создавайте сервисы с помощью фабричных функций
5. **Изоляция тестов** - Легко мокать зависимости в тестах
6. **Используйте contextName** - Устанавливайте осмысленные имена для лучшей отладки
7. **Включайте валидацию** - Используйте схемы Zod в разработке для раннего обнаружения ошибок
8. **Мемоизируйте зависимости** - Предотвращайте ненужные ре-рендеры мемоизацией объектов зависимостей

## Тестирование

### Базовое тестирование

```tsx
// Легко тестировать с мок зависимостями
const mockServices = {
  api: { get: jest.fn() },
  logger: { log: jest.fn() }
}

render(
  <Provider dependencies={mockServices}>
    <ComponentUnderTest />
  </Provider>
)
```

### Использование `createTestProvider`

Утилита `createTestProvider` делает тестирование еще проще:

```tsx
const { createTestProvider } = createDependencyContext<MyServices>()

// Создайте тестовый провайдер с частичными моками
const TestProvider = createTestProvider({
  api: { get: jest.fn().mockResolvedValue({ data: 'test' }) },
  logger: { log: jest.fn() }
})

render(
  <TestProvider>
    <ComponentUnderTest />
  </TestProvider>
)
```

### Тестирование с валидацией схемы

```tsx
import { z } from 'zod'

const testSchema = z.object({
  api: z.any(),
  logger: z.any()
})

const { createTestProvider } = createDependencyContext<MyServices>({
  schema: testSchema,
  isDebug: true
})

// Это будет валидировать ваши тестовые зависимости
const TestProvider = createTestProvider(mockServices)
```

## Устранение неполадок

### Частые проблемы

**Ошибка: "Dependency 'xyz' not found"**
- Проверьте, что ключ зависимости существует в вашем объекте зависимостей
- Сообщение об ошибке покажет доступные ключи для отладки
- Убедитесь, что вы используете хук внутри Provider

**Проблемы с производительностью**
- Используйте `useMemo` для мемоизации вашего объекта зависимостей
- Provider уже мемоизирован, но зависимости должны быть стабильными
- Избегайте создания новых объектов на каждом рендере

**Ошибки TypeScript**
- Убедитесь, что ваш интерфейс соответствует фактической структуре зависимостей
- Используйте предоставленные утилитарные типы для сложных сценариев
- Проверьте, что схема Zod соответствует вашему интерфейсу TypeScript

**Ошибки валидации**
- Валидация Zod работает только в режиме отладки
- Проверьте, что ваши зависимости соответствуют предоставленной схеме
- Используйте `z.any()` для сложных объектов, которые сложно валидировать

### Режим отладки

Режим отладки автоматически включается в разработке (`NODE_ENV !== 'production'`) и предоставляет:
- Улучшенные сообщения об ошибках с доступными ключами зависимостей
- Валидацию во время выполнения с схемами Zod
- Лучшую интеграцию с React DevTools с именами компонентов

## Руководство по миграции

### С v1.x на v2.x

Новая версия обратно совместима, но вы можете использовать новые возможности:

```tsx
// Старый способ (все еще работает)
const { Provider, useDependency } = createDependencyContext<Services>()

// Новый способ с улучшенными возможностями
const { Provider, useDependency, createTestProvider } = createDependencyContext<Services>({
  contextName: 'MyServices',
  schema: mySchema,
  isDebug: true
})
```

## Лицензия

MIT