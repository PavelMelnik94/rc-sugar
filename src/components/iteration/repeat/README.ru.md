# Компонент Repeat

Декларативная утилита для повторения контента указанное количество раз с рендерингом на основе индекса.

## Описание

Компонент `Repeat` предоставляет элегантный, декларативный способ рендеринга контента несколько раз. В отличие от традиционного маппинга массивов, он не требует фактического массива данных и идеально подходит для генерации элементов с фиксированным количеством, таких как скелетоны, плейсхолдеры, состояния загрузки или повторяющиеся UI-паттерны.

## Когда использовать

### Идеально подходит для
- **Скелетон лоадеры**: Генерация контента-заполнителя во время загрузки данных
- **Состояния загрузки**: Повторяющиеся индикаторы загрузки или спиннеры
- **Списки фиксированной длины**: UI-паттерны с известным количеством
- **Контент-плейсхолдеры**: Заполнители для пустых состояний
- **Grid-макеты**: Последовательные паттерны сетки
- **Элементы управления пагинацией**: Кнопки номеров страниц
- **Звездные рейтинги**: Отображение рейтинга с фиксированными звездами
- **Индикаторы прогресса**: Пошаговые полосы прогресса

### Избегайте когда
- Работаете с динамическими массивами данных (используйте обычный `.map()`)
- Контент значительно различается между итерациями
- Нужно сложное управление итерацией (break, continue)

## Используемые паттерны
- **Паттерн итерации**: Чистое, декларативное повторение
- **Паттерн render props**: Генерация контента на основе индекса
- **Неизменяемые массивы**: Использует `Array.from()` для чистой итерации
- **Паттерн нулевого воздействия**: Возвращает `null` для некорректных входных данных

## TypeScript интерфейс

```typescript
/**
 * Пропсы для компонента Repeat
 */
interface RepeatProps {
  /**
   * Количество повторений контента
   * @minimum 0
   */
  times: number;

  /**
   * Функция рендеринга, получающая индекс текущей итерации
   * @param index - Индекс текущей итерации с нуля (от 0 до times-1)
   * @returns React узел для рендеринга в этой итерации
   */
  children: (index: number) => React.ReactNode;
}
```

## Справочник API

| Проп | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| `times` | `number` | ✅ | Количество повторений (0 или отрицательное возвращает null) |
| `children` | `(index: number) => ReactNode` | ✅ | Функция рендеринга, получающая индекс с нуля |

## Примеры

### Скелетон лоадеры
```tsx
import { Repeat } from 'react-utility-kit';

// Скелетон списка статей
function ArticleSkeleton() {
  return (
    <div className="space-y-4">
      <Repeat times={5}>
        {index => (
          <div key={index} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        )}
      </Repeat>
    </div>
  );
}

// Скелетон сетки карточек
function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Repeat times={9}>
        {index => (
          <div key={index} className="bg-gray-100 rounded-lg h-48 animate-pulse">
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        )}
      </Repeat>
    </div>
  );
}
```

### Система звездного рейтинга
```tsx
interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  return (
    <div className="flex space-x-1">
      <Repeat times={maxStars}>
        {index => (
          <Star
            key={index}
            filled={index < rating}
            className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        )}
      </Repeat>
    </div>
  );
}
```

### Элементы управления пагинацией
```tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav className="flex space-x-2">
      <Repeat times={totalPages}>
        {(index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={index}
              onClick={() => onPageChange(pageNumber)}
              className={`px-3 py-1 rounded ${
                pageNumber === currentPage
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pageNumber}
            </button>
          );
        }}
      </Repeat>
    </nav>
  );
}
```

### Анимация загрузочных точек
```tsx
function LoadingDots() {
  return (
    <div className="flex space-x-1">
      <Repeat times={3}>
        {index => (
          <div
            key={index}
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: `${index * 0.2}s` }}
          />
        )}
      </Repeat>
    </div>
  );
}
```

### Шаги прогресса
```tsx
interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

function ProgressSteps({ currentStep, totalSteps, stepLabels }: ProgressStepsProps) {
  return (
    <div className="flex items-center">
      <Repeat times={totalSteps}>
        {(index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                {stepLabels?.[index] && (
                  <span className="text-xs mt-1">{stepLabels[index]}</span>
                )}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        }}
      </Repeat>
    </div>
  );
}
```

### Плейсхолдеры строк таблицы
```tsx
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <table className="w-full">
      <tbody>
        <Repeat times={rows}>
          {rowIndex => (
            <tr key={rowIndex}>
              <Repeat times={columns}>
                {colIndex => (
                  <td key={colIndex} className="p-2">
                    <div
                      className="h-4 bg-gray-200 rounded animate-pulse"
                      style={{ width: `${60 + (colIndex * 20)}%` }}
                    />
                  </td>
                )}
              </Repeat>
            </tr>
          )}
        </Repeat>
      </tbody>
    </table>
  );
}
```

## Соображения производительности

### Стратегии оптимизации
```typescript
// Мемоизируйте когда пропсы часто изменяются
const MemoizedRepeat = React.memo(({ times, children }: RepeatProps) => (
  <Repeat times={times}>{children}</Repeat>
));

// Используйте стабильные ключи для лучшего согласования
<Repeat times={count}>
  {(index) => (
    <Item key={`item-${index}`} index={index} />
  )}
</Repeat>

// Рассмотрите виртуализацию для больших количеств
const LARGE_COUNT_THRESHOLD = 100;

function OptimizedRepeat({ times, children }: RepeatProps) {
  if (times > LARGE_COUNT_THRESHOLD) {
    // Рассмотрите использование react-window или react-virtualized
    console.warn('Обнаружено большое количество повторений. Рассмотрите виртуализацию.');
  }

  return <Repeat times={times}>{children}</Repeat>;
}
```

### Управление памятью
- **Небольшие количества**: Никаких особых соображений не требуется
- **Большие количества (>100)**: Рассмотрите библиотеки виртуализации
- **Динамические количества**: Предпочитайте `useMemo` для дорогих дочерних функций

## Лучшие практики

### Делайте ✅
```typescript
// Предоставляйте стабильные ключи
<Repeat times={5}>
  {(index) => <Card key={index} data={data[index]} />}
</Repeat>

// Используйте для фиксированных, известных количеств
<Repeat times={RATING_MAX_STARS}>
  {(index) => <Star key={index} filled={index < rating} />}
</Repeat>

// Мемоизируйте дорогие дочерние компоненты
const ExpensiveItem = React.memo(({ index }: { index: number }) => (
  <div>Тяжелые вычисления для {index}</div>
));
```

### Не делайте ❌
```typescript
// Не используйте для динамических данных
// Вместо этого: data.map((item, index) => ...)
<Repeat times={dynamicData.length}>
  {(index) => <Item data={dynamicData[index]} />}
</Repeat>

// Не забывайте ключи
<Repeat times={5}>
  {(index) => <div>Нет ключа!</div>}
</Repeat>

// Не используйте для сложной логики итерации
<Repeat times={10}>
  {(index) => index % 2 === 0 && <div>Только четные</div>}
</Repeat>
```

## Руководство по миграции

### От ручного создания массива
```typescript
// До: Ручное создание массива
{Array(5).fill(null).map((_, index) => (
  <SkeletonCard key={index} />
))}

// После: Компонент Repeat
<Repeat times={5}>
  {(index) => <SkeletonCard key={index} />}
</Repeat>
```

### От Array.from()
```typescript
// До: Array.from с маппингом
{Array.from({ length: 3 }, (_, i) => (
  <LoadingDot key={i} delay={i * 100} />
))}

// После: Компонент Repeat
<Repeat times={3}>
  {(index) => <LoadingDot key={index} delay={index * 100} />}
</Repeat>
```

## Связанные компоненты
- [`for`](../for/README.md) - Для итерации по фактическим массивам данных
- [`memo`](../memo/README.md) - Для мемоизации дорогих компонентов
- [`static`](../static/README.md) - Для оптимизации статического контента

## Доступность

Компонент `Repeat` сам по себе не добавляет DOM-элементы, поэтому доступность зависит от рендерируемого контента:

```typescript
// Обеспечьте правильные ARIA-метки для повторяющихся интерактивных элементов
<Repeat times={5}>
  {(index) => (
    <button
      key={index}
      aria-label={`Страница ${index + 1}`}
      onClick={() => goToPage(index + 1)}
    >
      {index + 1}
    </button>
  )}
</Repeat>

// Используйте правильные заголовки для повторяющихся секций
<Repeat times={sections.length}>
  {(index) => (
    <section key={index} aria-labelledby={`section-${index}`}>
      <h2 id={`section-${index}`}>Секция {index + 1}</h2>
      {/* содержимое секции */}
    </section>
  )}
</Repeat>
```
