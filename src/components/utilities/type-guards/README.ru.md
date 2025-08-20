# Тайпгарды и Функции Утверждения

Полная коллекция тайпгардов и функций утверждения с полной поддержкой TypeScript и интеграцией Zod схем.

## Возможности

- 🚀 **Полное Покрытие Типов** - Гарды для всех типов JavaScript включая примитивы, объекты, коллекции и многое другое
- 🔒 **Безопасность Типов** - Полная поддержка TypeScript с правильным сужением типов
- ⚡ **Готово для React 19** - Оптимизировано для современной разработки React
- 🎯 **Нулевые Зависимости** - Требуется только React и Zod (Zod для валидации схем)
- 🧪 **Функции Утверждения** - Встроенные функции утверждения, которые выбрасывают ошибки при несоответствии типов
- 🔍 **Интеграция Zod** - Создание тайпгардов и утверждений из Zod схем
- ✅ **Валидация во Время Выполнения** - Безопасная проверка типов во время выполнения с детальными сообщениями об ошибках
- 📦 **Tree Shakeable** - Импортируйте только то, что нужно

## Установка

```bash
npm install react-utility-kit
```

## Быстрый Старт

### Базовые Тайпгарды

```tsx
import { 
  isString, 
  isNumber, 
  isArray, 
  isNonEmptyArray,
  isObject,
  isNotNullish 
} from 'react-utility-kit/type-guards'

// Тайпгарды для примитивных типов
if (isString(value)) {
  // value теперь типизировано как string
  console.log(value.toUpperCase())
}

if (isNumber(value)) {
  // value теперь типизировано как number
  console.log(value.toFixed(2))
}

// Тайпгарды массивов с сужением типов
if (isArray(value)) {
  // value теперь типизировано как unknown[]
  console.log(value.length)
}

if (isNonEmptyArray(value)) {
  // value теперь типизировано как [unknown, ...unknown[]]
  console.log(value[0]) // Безопасный доступ - гарантированно существует
}

// Проверки на nullish
if (isNotNullish(value)) {
  // value теперь типизировано как NonNullable<T>
  // Безопасно использовать без проверок на null
}
```

### Функции Утверждения

```tsx
import { 
  assert,
  assertIsString, 
  assertIsNumber,
  assertIsArray,
  assertIsNotNullish 
} from 'react-utility-kit/type-guards'

function processUserInput(input: unknown) {
  // Выбрасывает AssertionError если input не строка
  assertIsString(input, 'Пользовательский ввод должен быть строкой')
  
  // Теперь input безопасно типизирован как string
  return input.toUpperCase()
}

function calculateSum(numbers: unknown) {
  assertIsArray(numbers, 'Ожидался массив чисел')
  
  return numbers.reduce((sum, num) => {
    assertIsNumber(num, 'Все элементы должны быть числами')
    return sum + num
  }, 0)
}

// Общее утверждение
function validateCondition(condition: unknown, message: string) {
  assert(condition, message)
  // Продолжает выполнение только если условие истинно
}
```

### Интеграция Zod Схем

```tsx
import { z } from 'zod'
import { 
  createTypeGuard, 
  createAssertion,
  createValidator,
  validateSchema,
  safeValidateSchema 
} from 'react-utility-kit/type-guards'

// Определите вашу схему
const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().positive()
})

// Создайте тайпгард
const isUser = createTypeGuard(UserSchema)

if (isUser(data)) {
  // data теперь типизирован как { name: string; email: string; age: number }
  console.log(data.name)
}

// Создайте утверждение
const assertIsUser = createAssertion(UserSchema, 'User')

function processUser(input: unknown) {
  assertIsUser(input)
  // input теперь безопасно типизирован как User
  return input.email
}

// Полный валидатор со всеми методами
const userValidator = createValidator(UserSchema, 'User')

// Используйте тайпгард
if (userValidator.guard(data)) {
  // Безопасно использовать
}

// Используйте утверждение
userValidator.assert(data, 'Неверные данные пользователя')

// Используйте безопасную валидацию
const result = userValidator.safe?.(data)
if (result?.success) {
  console.log(result.data)
}
```

### Общие Паттерны Схем

```tsx
import { CommonSchemas, createTypeGuard } from 'react-utility-kit/type-guards'

const isEmail = createTypeGuard(CommonSchemas.email)
const isPositiveNumber = createTypeGuard(CommonSchemas.positiveNumber)
const isNonEmptyString = createTypeGuard(CommonSchemas.nonEmptyString)
const isUrl = createTypeGuard(CommonSchemas.url)
const isJsonString = createTypeGuard(CommonSchemas.jsonString)

// Использование
if (isEmail(input)) {
  // input - валидная email строка
  sendEmail(input)
}

if (isPositiveNumber(value)) {
  // value - положительное число
  processPositiveNumber(value)
}
```

### Продвинутое Использование

```tsx
import { 
  hasProperty, 
  hasMethod,
  isEmpty,
  isNonEmpty,
  isPlainObject,
  createSafeTypeGuard 
} from 'react-utility-kit/type-guards'

// Проверки свойств и методов
const obj: unknown = { name: 'John', greet: () => 'Hello' }

if (hasProperty(obj, 'name')) {
  // obj теперь типизирован как Record<'name', unknown>
  console.log(obj.name)
}

if (hasMethod(obj, 'greet')) {
  // obj теперь типизирован как Record<'greet', Function>
  console.log(obj.greet())
}

// Проверки на пустоту
if (isEmpty(value)) {
  console.log('Значение пустое (null, undefined, "", [], {}, пустые Map/Set)')
}

if (isNonEmpty(value)) {
  console.log('Значение не пустое и не nullish')
}

// Безопасная валидация с детальными результатами
const safeIsUser = createSafeTypeGuard(UserSchema)
const result = safeIsUser(data)

if (result.success) {
  console.log('Валидный пользователь:', result.data)
} else {
  console.error('Ошибка валидации:', result.error)
}
```

## Полный Справочник Тайпгардов

### Примитивные Типы
- `isString(value)` - Тайпгард для строк
- `isNumber(value)` - Тайпгард для чисел (исключая NaN)
- `isBoolean(value)` - Тайпгард для булевых значений
- `isBigInt(value)` - Тайпгард для BigInt
- `isSymbol(value)` - Тайпгард для Symbol
- `isFunction(value)` - Тайпгард для функций
- `isPrimitive(value)` - Тайпгард для примитивных значений

### Nullish Типы
- `isNull(value)` - Проверка на null
- `isUndefined(value)` - Проверка на undefined
- `isNullish(value)` - Проверка на null или undefined
- `isNotNullish(value)` - Проверка на не-nullish

### Объектные Типы
- `isObject(value)` - Тайпгард для объектов
- `isArray(value)` - Тайпгард для массивов
- `isNonEmptyArray(value)` - Тайпгард для непустых массивов
- `isRecord(value)` - Тайпгард для простых объектов
- `isPlainObject(value)` - Тайпгард для простых объектов (более строгий)
- `isDate(value)` - Тайпгард для валидных Date
- `isError(value)` - Тайпгард для экземпляров Error
- `isRegExp(value)` - Тайпгард для RegExp
- `isPromise(value)` - Тайпгард для Promise-подобных объектов

### Типы Коллекций
- `isMap(value)` - Тайпгард для экземпляров Map
- `isSet(value)` - Тайпгард для экземпляров Set
- `isWeakMap(value)` - Тайпгард для экземпляров WeakMap
- `isWeakSet(value)` - Тайпгард для экземпляров WeakSet

### Буферные Типы
- `isArrayBuffer(value)` - Тайпгард для ArrayBuffer
- `isTypedArray(value)` - Тайпгард для TypedArray

### Итераторные Типы
- `isIterable(value)` - Тайпгард для итерируемых объектов
- `isAsyncIterable(value)` - Тайпгард для асинхронно-итерируемых объектов

### Утилитарные Функции
- `isEmpty(value)` - Проверка на пустое значение
- `isNonEmpty(value)` - Проверка на непустое значение
- `hasProperty(obj, key)` - Проверка существования свойства
- `hasMethod(obj, key)` - Проверка существования метода

## Функции Утверждения

Все тайпгарды имеют соответствующие функции утверждения:

- `assert(condition, message?)` - Общее утверждение
- `assertIsString(value, message?)` - Утверждение для строк
- `assertIsNumber(value, message?)` - Утверждение для чисел
- `assertIsBoolean(value, message?)` - Утверждение для булевых значений
- `assertIsObject(value, message?)` - Утверждение для объектов
- `assertIsArray(value, message?)` - Утверждение для массивов
- `assertIsFunction(value, message?)` - Утверждение для функций
- `assertIsNotNullish(value, message?)` - Утверждение для не-nullish
- `assertIsNonEmptyArray(value, message?)` - Утверждение для непустых массивов
- `assertIsDate(value, message?)` - Утверждение для Date
- `assertIsError(value, message?)` - Утверждение для Error

## Функции Интеграции Zod

- `createTypeGuard(schema)` - Создать тайпгард из Zod схемы
- `createAssertion(schema, name?)` - Создать утверждение из Zod схемы
- `createValidator(schema, name?)` - Создать полный валидатор
- `validateSchema(schema, value)` - Валидировать и вернуть данные (выбрасывает ошибку при неудаче)
- `safeValidateSchema(schema, value)` - Безопасная валидация (возвращает null при ошибке)
- `createSafeTypeGuard(schema)` - Создать безопасный тайпгард с детальными результатами

## Общие Схемы

Предварительно построенные Zod схемы для общих паттернов:

- `CommonSchemas.nonEmptyString` - Непустая строка
- `CommonSchemas.positiveNumber` - Положительное число
- `CommonSchemas.nonNegativeNumber` - Неотрицательное число
- `CommonSchemas.integer` - Целое число
- `CommonSchemas.url` - Валидная URL строка
- `CommonSchemas.email` - Валидная email строка
- `CommonSchemas.uuid` - Валидная UUID строка
- `CommonSchemas.dateString` - Валидная строка даты
- `CommonSchemas.jsonString` - Валидная JSON строка
- `CommonSchemas.nonEmptyArray` - Непустой массив
- `CommonSchemas.plainObject` - Простой объект

## Утилиты TypeScript

```tsx
import type { 
  TypePredicate,
  AssertionFunction,
  TypeValidator,
  TypeGuardResult,
  InferSchema,
  AssertionError 
} from 'react-utility-kit/type-guards'

// Определения типов для пользовательских тайпгардов
type MyTypePredicate = TypePredicate<MyType>
type MyAssertion = AssertionFunction<MyType>
type MyValidator = TypeValidator<MyType>

// Вывести типы схем
type UserType = InferSchema<typeof UserSchema>
```

## Обработка Ошибок

Все функции утверждения выбрасывают экземпляры `AssertionError` с детальной информацией:

```tsx
import { assertIsString, createAssertionError } from 'react-utility-kit/type-guards'

try {
  assertIsString(123)
} catch (error) {
  if (error instanceof Error && error.name === 'AssertionError') {
    console.log('Утверждение не удалось:', error.message)
    console.log('Вызвано:', error.cause)
  }
}

// Создать пользовательские ошибки утверждения
const customError = createAssertionError('Пользовательское сообщение', { value: 123 })
```

## Лучшие Практики

1. **Используйте Тайпгарды для Потока Управления** - Позвольте TypeScript сузить типы естественно
2. **Используйте Утверждения для Валидации Входных Данных** - Выбрасывайте ошибки рано при неверных данных
3. **Комбинируйте с Zod Схемами** - Получите безопасность типов во время выполнения и компиляции
4. **Пользовательские Сообщения об Ошибках** - Предоставляйте полезный контекст в сообщениях утверждений
5. **Безопасная Валидация** - Используйте безопасные варианты, когда нужна детальная информация об ошибках
6. **Tree Shaking** - Импортируйте только нужные функции

## Заметки о Производительности

- Все тайпгарды оптимизированы для производительности
- Интеграция Zod загружается лениво по необходимости
- Tree shaking обеспечивает минимальный размер бандла
- Нет накладных расходов во время выполнения для неиспользуемых функций

## Интеграция с React

Идеально подходит для валидации пропсов, ответов API и пользовательского ввода:

```tsx
import React from 'react'
import { assertIsString, isArray, assertIsNotNullish } from 'react-utility-kit/type-guards'

interface Props {
  data: unknown
}

function MyComponent({ data }: Props) {
  // Валидация пропсов во время выполнения
  assertIsNotNullish(data, 'Данные обязательны')
  
  if (isArray(data)) {
    return (
      <ul>
        {data.map((item, index) => (
          <li key={index}>{String(item)}</li>
        ))}
      </ul>
    )
  }
  
  assertIsString(data, 'Данные должны быть строкой или массивом')
  return <p>{data}</p>
}
```

## Лицензия

MIT