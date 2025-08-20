# Утилита Маппера Данных

Гибкий, типобезопасный инфраструктурный инструмент для маппинга и нормализации трансформаций данных. Разработан для максимальной производительности и композиции без зависимостей от бизнес-логики.

## Описание

Утилита Data Mapper предоставляет полный набор инструментов для преобразования данных из одного формата в другой с полной поддержкой TypeScript, валидацией Zod и оптимизациями производительности. Следует инфраструктурным паттернам с высокой связностью и низкой зацепленностью.

## Когда использовать

- **Трансформация данных**: Преобразование ответов API во внутренние структуры данных
- **Нормализация**: Стандартизация форматов данных из разных источников  
- **Конвейерная обработка**: Построение композиционных цепочек трансформации данных
- **Валидация**: Обеспечение целостности данных при трансформациях
- **Оптимизация производительности**: Кэширование дорогостоящих трансформаций

## Используемые паттерны

- **Паттерн композиции**: Цепочки комбинаций мапперов
- **Паттерн стратегии**: Условный маппинг на основе характеристик входных данных
- **Паттерн строителя**: Fluent API для конфигурации мапперов
- **Паттерн мемоизации**: Автоматическое кэширование для оптимизации производительности

## Типы TypeScript

```typescript
type MapperConfig<TInput, TOutput> = {
  transform: (input: TInput) => TOutput
  schema?: z.ZodSchema<TInput>
  name?: string
  memoize?: boolean
}

type Mapper<TInput, TOutput> = {
  map: (input: TInput) => TOutput
  mapBatch: (inputs: TInput[]) => TOutput[]
  name: string
  compose: <TNext>(nextMapper: Mapper<TOutput, TNext>) => Mapper<TInput, TNext>
}
```

## Справочник API

### `createMapper<TInput, TOutput>(config)`

Создает новый типобезопасный маппер с опциональной валидацией и мемоизацией.

**Параметры:**
- `config.transform`: Функция для трансформации входных данных в выходные
- `config.schema?`: Опциональная схема Zod для валидации входных данных
- `config.name?`: Опциональное имя для отладки и композиции
- `config.memoize?`: Включить мемоизацию для дорогостоящих трансформаций

**Возвращает:** `Mapper<TInput, TOutput>`

### `composeMappers(firstMapper, secondMapper)`

Композирует два маппера в единый конвейер трансформации.

### `createConditionalMapper(condition, trueMapper, falseMapper?)`

Создает маппер, который применяет различные трансформации на основе условий входных данных.

### `createBatchMapper(mapper, options?)`

Оптимизирует маппер для обработки больших батчей с поддержкой разбиения на части.

### `createNormalizerMapper(fieldMappings, schema?)`

Создает маппер для нормализации полей объектов с гибким маппингом полей.

### `pipe(...mappers)`

Композирует несколько мапперов в последовательный конвейер трансформации.

### `identity()`

Возвращает идентификационный маппер, который передает входные данные без изменений.

## Примеры

### Базовая трансформация данных

```typescript
import { createMapper } from 'react-utility-kit/mapper';

interface ApiUser {
  first_name: string;
  last_name: string;
  email_address: string;
}

interface AppUser {
  fullName: string;
  email: string;
}

const userMapper = createMapper<ApiUser, AppUser>({
  transform: (apiUser) => ({
    fullName: `${apiUser.first_name} ${apiUser.last_name}`,
    email: apiUser.email_address
  }),
  name: 'UserMapper'
});

const appUser = userMapper.map({
  first_name: 'Иван',
  last_name: 'Иванов', 
  email_address: 'ivan@example.com'
});
// Результат: { fullName: 'Иван Иванов', email: 'ivan@example.com' }
```

### Валидация со схемой Zod

```typescript
import { z } from 'zod';
import { createMapper } from 'react-utility-kit/mapper';

const apiResponseSchema = z.object({
  data: z.array(z.object({
    id: z.number(),
    name: z.string(),
    price: z.number().positive()
  })),
  total: z.number()
});

const productMapper = createMapper({
  schema: apiResponseSchema,
  transform: (response) => ({
    products: response.data.map(item => ({
      id: item.id,
      displayName: item.name.toUpperCase(),
      formattedPrice: `${item.price.toFixed(2)} ₽`
    })),
    count: response.total
  }),
  name: 'ProductResponseMapper'
});
```

### Композиция и конвейеры

```typescript
import { createMapper, pipe } from 'react-utility-kit/mapper';

const parseJson = createMapper<string, object>({
  transform: (json) => JSON.parse(json),
  name: 'JsonParser'
});

const extractData = createMapper<{data: any[]}, any[]>({
  transform: (response) => response.data,
  name: 'DataExtractor'
});

const normalizeItems = createMapper<any[], Product[]>({
  transform: (items) => items.map(item => ({
    id: item.id,
    name: item.title || item.name,
    price: Number(item.cost || item.price)
  })),
  name: 'ItemNormalizer'
});

// Метод 1: Последовательная композиция
const jsonToProducts = parseJson
  .compose(extractData)
  .compose(normalizeItems);

// Метод 2: Pipe композиция  
const jsonToProductsPipe = pipe(
  parseJson,
  extractData,
  normalizeItems
);

const products = jsonToProducts.map('{"data": [{"id": 1, "title": "Товар", "cost": 1000}]}');
```

### Условный маппинг

```typescript
import { createMapper, createConditionalMapper } from 'react-utility-kit/mapper';

interface ApiResponse {
  status: 'success' | 'error';
  data?: any;
  error?: string;
}

const successMapper = createMapper<ApiResponse, any>({
  transform: (response) => response.data,
  name: 'SuccessMapper'
});

const errorMapper = createMapper<ApiResponse, Error>({
  transform: (response) => new Error(response.error || 'Неизвестная ошибка'),
  name: 'ErrorMapper'
});

const responseMapper = createConditionalMapper(
  (response: ApiResponse) => response.status === 'success',
  successMapper,
  errorMapper
);
```

### Пакетная обработка

```typescript
import { createMapper, createBatchMapper } from 'react-utility-kit/mapper';

const expensiveTransform = createMapper({
  transform: (data: RawData) => processComplexCalculation(data),
  memoize: true, // Кэширование результатов для повторных входных данных
  name: 'ExpensiveProcessor'
});

const batchProcessor = createBatchMapper(expensiveTransform, {
  chunkSize: 100,
  parallel: true
});

const results = batchProcessor.map(largeDataArray);
```

### Нормализация полей

```typescript
import { createNormalizerMapper } from 'react-utility-kit/mapper';

interface LegacyUser {
  user_id: number;
  first_name: string;
  last_name: string;
  email_addr: string;
  created_at: string;
}

interface ModernUser {
  id: number;
  fullName: string;
  email: string;
  createdDate: Date;
  initials: string;
}

const userNormalizer = createNormalizerMapper<LegacyUser, ModernUser>({
  id: 'user_id',
  fullName: (user) => `${user.first_name} ${user.last_name}`,
  email: 'email_addr',
  createdDate: (user) => new Date(user.created_at),
  initials: (user) => `${user.first_name[0]}${user.last_name[0]}`
});
```

## Соображения производительности

### Мемоизация для дорогостоящих операций

```typescript
const heavyMapper = createMapper({
  transform: (data) => performExpensiveCalculation(data),
  memoize: true, // Автоматическое кэширование результатов
  name: 'HeavyCalculation'
});
```

### Оптимизация пакетной обработки

```typescript
// Эффективная обработка больших наборов данных
const optimizedBatch = createBatchMapper(mapper, {
  chunkSize: 1000,  // Обработка частями
  parallel: true    // Включить параллельную обработку
});
```

### Управление памятью

- Используйте мемоизацию разумно для часто повторяющихся входных данных
- Периодически очищайте кэш для долгоживущих приложений
- Учитывайте компромисс между использованием памяти и вычислениями

## Лучшие практики

### ✅ **Рекомендуется**

- Использовать описательные имена для мапперов для облегчения отладки
- Включать валидацию со схемами Zod во время разработки
- Композировать простые мапперы вместо создания сложных одноступенчатых трансформаций
- Использовать мемоизацию для дорогостоящих, чистых трансформаций
- Использовать дженерики TypeScript для полной типобезопасности

### ❌ **Избегайте**

- Создания излишне сложных одноступенчатых трансформаций
- Смешивания бизнес-логики с трансформацией данных
- Использования мемоизации для нечистых функций
- Игнорирования валидации в критических конвейерах данных
- Создания циклических зависимостей в композиции мапперов

## Руководство по миграции

### От ручных трансформаций

**До:**
```typescript
function transformUser(apiUser: ApiUser): AppUser {
  return {
    fullName: `${apiUser.first_name} ${apiUser.last_name}`,
    email: apiUser.email_address
  };
}

const users = apiUsers.map(transformUser);
```

**После:**
```typescript
const userMapper = createMapper<ApiUser, AppUser>({
  transform: (apiUser) => ({
    fullName: `${apiUser.first_name} ${apiUser.last_name}`,
    email: apiUser.email_address
  }),
  name: 'UserMapper'
});

const users = userMapper.mapBatch(apiUsers);
```

### От трансформаций Lodash

**До:**
```typescript
import { map, compose } from 'lodash/fp';

const transformPipeline = compose(
  map(normalize),
  map(validate),
  map(transform)
);
```

**После:**
```typescript
const transformPipeline = pipe(
  transformMapper,
  validateMapper, 
  normalizeMapper
);
```

## Связанные компоненты

- **[`dependency`](../dependency/README.md)** - Внедрение зависимостей для инфраструктурных сервисов
- **[`debug`](../debug/README.md)** - Утилиты отладки для разработки

## Соображения по окружению

Утилита mapper не зависит от окружения и работает как в браузере, так и в Node.js. Валидация Zod может быть условно включена для сред разработки:

```typescript
const mapper = createMapper({
  transform: myTransform,
  schema: process.env.NODE_ENV === 'development' ? mySchema : undefined
});
```

## Устранение неполадок

### Частые проблемы

**Ошибка валидации**
- Валидация Zod работает только при предоставлении схемы
- Проверьте соответствие входных данных предоставленной схеме
- Используйте `z.any()` для сложных объектов, которые сложно валидировать

**Проблемы производительности**
- Используйте мемоизацию только для чистых функций
- Учитывайте размер кэша при обработке больших объемов данных
- Рассмотрите использование batch processing для больших массивов

**Ошибки композиции**
- Убедитесь, что типы выходных данных первого маппера соответствуют входным типам второго
- Проверьте порядок композиции в pipe операциях
- Избегайте циклических зависимостей между мапперами

## Лицензия

MIT