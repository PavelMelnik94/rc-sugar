# Компонент For

Декларативный компонент цикла для рендеринга списков в React, предоставляющий чистую альтернативу функции map JavaScript в JSX с встроенной поддержкой fallback и типобезопасностью.

## Описание

Компонент `For` упрощает рендеринг коллекций, делая ваш JSX более читаемым и выразительным. Он предоставляет декларативный подход к итерации с автоматической обработкой пустых состояний, устраняя необходимость в сложной условной логике вокруг рендеринга списков.

Компонент обрабатывает крайние случаи, такие как пустые массивы, null значения, и предоставляет чистый интерфейс render prop, который предоставляет как элемент, так и его индекс для максимальной гибкости.

## Когда использовать

- **Рендеринг списков или массивов** в JSX с чистым синтаксисом
- **Избегание встроенных вызовов `.map()`**, которые загромождают ваши компоненты
- **Улучшение читаемости** логики рендеринга списков
- **Обработка пустых состояний** декларативно без дополнительных условий
- **Типобезопасная итерация** по коллекциям с поддержкой TypeScript
- **Сложный рендеринг списков**, где нужны и элемент, и индекс
- **Согласованные паттерны списков** во всем приложении

## Как это работает

Компонент `For`:

1. **Проверяет массив**: Валидирует, существует ли массив и есть ли в нем элементы
2. **Рендерит fallback**: Показывает fallback контент, если массив пуст или null
3. **Итерирует по элементам**: Проходит через каждый элемент, используя React map
4. **Вызывает render prop**: Вызывает функцию children с элементом и индексом
5. **Возвращает элементы**: Оборачивает результаты в React Fragment

## Используемые паттерны

- **Iterator Pattern**: Итерирует по коллекциям с чистой абстракцией
- **Render Props Pattern**: Предоставляет элемент и индекс через функцию children
- **Fallback Pattern**: Обеспечивает обработку пустых состояний
- **Type Safety**: Полная поддержка TypeScript с generic типами
- **Functional Composition**: Компонуется с другими UI компонентами

## TypeScript типы

```typescript
/**
 * Пропы для компонента For
 */
interface ForProps<T = any> {
  /**
   * Массив элементов для итерации
   */
  each: T[] | readonly T[];
  /**
   * Render prop функция, которая получает каждый элемент и его индекс
   */
  children: RenderProp<{ item: T; index: number }>;
  /**
   * Запасной контент для рендеринга, когда массив пуст
   */
  fallback?: ReactNode;
}

/**
 * Определение типа Render prop
 */
type RenderProp<T> = (props: T) => ReactNode;
```

## API

### Пропы компонента For

| Проп | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| `each` | `T[] \| readonly T[]` | ✅ | Массив для итерации |
| `children` | `({ item: T, index: number }) => ReactNode` | ✅ | Render функция для каждого элемента |
| `fallback` | `ReactNode` | ❌ | Контент для показа, когда массив пуст |

## Примеры

### Базовое использование

```tsx
import { For } from 'rc-sugar';

function NumberList() {
  const numbers = [1, 2, 3, 4, 5];

  return (
    <For each={numbers}>
      {({ item, index }) => (
        <div key={index} className="number-item">
          Item #
{index + 1}
:
{' '}
{item}
        </div>
      )}
    </For>
  );
}
```

### Список пользователей с Fallback

```tsx
import { For } from 'rc-sugar';

interface User {
  id: string;
  name: string;
  email: string;
}

function UserList({ users }: { users: User[] }) {
  return (
    <For each={users} fallback={<EmptyUserList />}>
      {({ item: user, index }) => (
        <UserCard
          key={user.id}
          user={user}
          position={index + 1}
        />
      )}
    </For>
  );
}

function EmptyUserList() {
  return (
    <div className="empty-state">
      <p>No users found</p>
      <button>Add user</button>
    </div>
  );
}
```

### Сетка товаров

```tsx
import { For } from 'rc-sugar';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      <For each={products} fallback={<ProductGridSkeleton />}>
        {({ item: product, index }) => (
          <div
            key={product.id}
            className={`product-card ${index < 3 ? 'featured' : ''}`}
          >
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">
{product.price}
$
            </p>
            {index === 0 && <span className="badge">Bestseller</span>}
          </div>
        )}
      </For>
    </div>
  );
}
```

### Меню навигации

```tsx
import { For } from 'rc-sugar';

interface MenuItem {
  label: string;
  href: string;
  icon?: string;
  isActive?: boolean;
}

function Navigation({ items }: { items: MenuItem[] }) {
  return (
    <nav className="navigation">
      <For each={items}>
        {({ item, index }) => (
          <a
            key={index}
            href={item.href}
            className={`nav-item ${item.isActive ? 'active' : ''}`}
          >
            {item.icon && <Icon name={item.icon} />}
            {item.label}
          </a>
        )}
      </For>
    </nav>
  );
}
```

### Сложные строки таблицы

```tsx
import { For } from 'rc-sugar';

interface TableData {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  lastUpdated: Date;
}

function DataTable({ data }: { data: TableData[] }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Last Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <For each={data} fallback={<EmptyTableRow />}>
          {({ item, index }) => (
            <tr
              key={item.id}
              className={index % 2 === 0 ? 'even' : 'odd'}
            >
              <td>{item.name}</td>
              <td>
                <StatusBadge status={item.status} />
              </td>
              <td>{item.lastUpdated.toLocaleDateString('en-US')}</td>
              <td>
                <button onClick={() => handleEdit(item.id)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}
```

### Вложенные списки

```tsx
import { For } from 'rc-sugar';

interface Category {
  id: string;
  name: string;
  items: string[];
}

function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <div className="categories">
      <For each={categories}>
        {({ item: category, index }) => (
          <div key={category.id} className="category">
            <h3>
              {index + 1}
.
{category.name}
            </h3>
            <ul>
              <For each={category.items} fallback={<li>No items</li>}>
                {({ item, index: itemIndex }) => (
                  <li key={itemIndex}>
                    {item}
                  </li>
                )}
              </For>
            </ul>
          </div>
        )}
      </For>
    </div>
  );
}
```

## Соображения производительности

- **Key Пропы**: Всегда предоставляйте правильные `key` пропы для React reconciliation
- **Мемоизация**: Рассмотрите мемоизацию render функций для больших списков
- **Виртуальная прокрутка**: Для очень больших списков рассмотрите библиотеки виртуальной прокрутки
- **Проверки пустоты**: Компонент эффективно обрабатывает пустые массивы без дополнительных рендеров

## Лучшие практики

1. **Используйте правильные ключи**: Всегда предоставляйте уникальные ключи для элементов списка
2. **Мемоизируйте тяжелые рендеры**: Используйте `useCallback` для дорогих render функций
3. **Fallback контент**: Всегда предоставляйте осмысленный fallback контент
4. **Типобезопасность**: Используйте TypeScript generics для типобезопасной итерации
5. **Избегайте индекс как ключ**: Используйте уникальные идентификаторы, когда доступны
6. **Обрабатывайте состояния загрузки**: Используйте fallback для индикаторов загрузки

## Миграция с Array.map()

### До (многословно)
```tsx
// ❌ Многословно с ручными проверками пустоты
return (
  <div>
    {items.length > 0
? (
      items.map((item, index) => (
        <ItemComponent key={item.id} item={item} index={index} />
      ))
    )
: (
      <EmptyState />
    )}
  </div>
);
```

### После (чисто)
```tsx
// ✅ Чисто и декларативно
return (
  <div>
    <For each={items} fallback={<EmptyState />}>
      {({ item, index }) => (
        <ItemComponent key={item.id} item={item} index={index} />
      )}
    </For>
  </div>
);
```

## Общие паттерны

### Загружающиеся списки
```tsx
<For each={isLoading ? [] : items} fallback={<LoadingSkeleton />}>
  {({ item, index }) => <ItemCard key={item.id} item={item} />}
</For>;
```

### Отфильтрованные списки
```tsx
<For each={items.filter(item => item.isVisible)} fallback={<NoResults />}>
  {({ item, index }) => <ItemComponent key={item.id} item={item} />}
</For>;
```

### Постраничные списки
```tsx
<For each={currentPageItems} fallback={<EmptyPage />}>
  {({ item, index }) => (
    <ItemCard
      key={item.id}
      item={item}
      globalIndex={currentPage * pageSize + index}
    />
  )}
</For>;
```

## Связанные компоненты

- [`If`](../if/README.ru.md) - Условный рендеринг
- [`Maybe`](../maybe/README.ru.md) - Безопасный от null рендеринг
- [`Switch`](../switch/README.ru.md) - Условный рендеринг на основе значений
