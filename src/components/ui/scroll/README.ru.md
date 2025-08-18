# Компонент Scroll

Комплексный утилитарный компонент для обработки событий прокрутки, отслеживания позиции прокрутки и взаимодействий на основе прокрутки в React приложениях с расширенными функциями для бесконечной прокрутки, виртуальной прокрутки и анимаций, срабатывающих при прокрутке.

## Описание

Компонент `Scroll` предоставляет мощный и декларативный подход к управлению поведением прокрутки в современных React приложениях. Он предлагает точный контроль над событиями прокрутки, отслеживанием позиции, определением направления и обновлениями UI на основе прокрутки. Созданный с учетом оптимизации производительности, он включает функции троттлинга, дебаунсинга и поддержки виртуальной прокрутки.

Идеально подходит для создания плавных эффектов прокрутки, реализации паттернов бесконечной прокрутки, липкой навигации, параллакс эффектов и анимаций, запускаемых прокруткой. Компонент абстрагирует сложность обработки событий прокрутки, предоставляя при этом комплексные API для продвинутого поведения прокрутки.

## Когда использовать

- **Бесконечная прокрутка** для больших наборов данных и оптимизации производительности
- **Липкие заголовки** и элементы навигации, реагирующие на прокрутку
- **Анимации, запускаемые прокруткой** и параллакс эффекты
- **Виртуальная прокрутка** для массивных списков и таблиц данных
- **Паттерны загрузки при прокрутке** для галерей изображений и контентных лент
- **Отслеживание позиции прокрутки** для аналитики и поведения пользователей
- **Функции автопрокрутки** в чат-приложениях и живых лентах
- **Восстановление прокрутки** для одностраничных приложений
- **Пользовательские полосы прокрутки** и индикаторы прокрутки
- **Навигация на основе прокрутки** и подсветка разделов

## Как это работает

Компонент `Scroll` использует оптимизированные слушатели событий с requestAnimationFrame для плавного отслеживания прокрутки. Он предоставляет комплексное состояние прокрутки через render props, включая позицию, направление, скорость и границы прокрутки. Компонент поддерживает как отслеживание прокрутки окна, так и элемента с автоматической очисткой и оптимизацией производительности.

Расширенные функции включают определение пересечения с областью просмотра, предсказание прокрутки, отслеживание импульса и настраиваемый троттлинг для различных случаев использования.

## Используемые паттерны

- **Render Props Pattern**: Предоставляет состояние прокрутки и утилиты дочерним элементам
- **Observer Pattern**: Отслеживает события прокрутки и изменения позиции
- **Performance Optimization**: Использует троттлинг и дебаунсинг для плавной производительности
- **Intersection Observer**: Эффективная загрузка и анимации на основе области просмотра
- **Custom Hook Integration**: Бесшовно работает с пользовательскими хуками прокрутки
- **Event Delegation**: Оптимизированная обработка событий для нескольких элементов прокрутки

## TypeScript типы

```typescript
/**
 * Координаты позиции прокрутки
 */
interface ScrollPosition {
  x: number;
  y: number;
  left: number;
  top: number;
}

/**
 * Размеры и границы прокрутки
 */
interface ScrollDimensions {
  scrollWidth: number;
  scrollHeight: number;
  clientWidth: number;
  clientHeight: number;
  scrollLeft: number;
  scrollTop: number;
}

/**
 * Индикаторы направления прокрутки
 */
interface ScrollDirection {
  horizontal: 'left' | 'right' | 'none';
  vertical: 'up' | 'down' | 'none';
  isScrolling: boolean;
  lastDirection: ScrollDirection | null;
}

/**
 * Скорость и импульс прокрутки
 */
interface ScrollVelocity {
  x: number;
  y: number;
  magnitude: number;
  timestamp: number;
}

/**
 * Границы и пороги прокрутки
 */
interface ScrollBoundaries {
  isAtTop: boolean;
  isAtBottom: boolean;
  isAtLeft: boolean;
  isAtRight: boolean;
  nearTop: boolean;
  nearBottom: boolean;
  nearLeft: boolean;
  nearRight: boolean;
}

/**
 * Полное состояние прокрутки
 */
interface ScrollState {
  position: ScrollPosition;
  dimensions: ScrollDimensions;
  direction: ScrollDirection;
  velocity: ScrollVelocity;
  boundaries: ScrollBoundaries;
  progress: {
    vertical: number;
    horizontal: number;
  };
}

/**
 * Пропы для компонента Scroll
 */
interface ScrollProps {
  /**
   * Render функция, которая получает комплексное состояние прокрутки
   */
  children: (state: ScrollState, utils: ScrollUtils) => React.ReactNode;

  /**
   * Целевой элемент для отслеживания прокрутки (по умолчанию window)
   */
  element?: HTMLElement | Window | null;

  /**
   * Коллбэк события прокрутки
   */
  onScroll?: (state: ScrollState) => void;

  /**
   * Коллбэк начала прокрутки
   */
  onScrollStart?: (state: ScrollState) => void;

  /**
   * Коллбэк окончания прокрутки (срабатывает после остановки прокрутки)
   */
  onScrollEnd?: (state: ScrollState) => void;

  /**
   * Коллбэк изменения направления
   */
  onDirectionChange?: (direction: ScrollDirection) => void;

  /**
   * Коллбэки достижения границ
   */
  onReachTop?: (state: ScrollState) => void;
  onReachBottom?: (state: ScrollState) => void;
  onReachLeft?: (state: ScrollState) => void;
  onReachRight?: (state: ScrollState) => void;

  /**
   * Задержка троттлинга для событий прокрутки (мс)
   * @default 16
   */
  throttle?: number;

  /**
   * Задержка дебаунсинга для определения окончания прокрутки (мс)
   * @default 150
   */
  debounce?: number;

  /**
   * Порог для определения "близкой" границы (px)
   * @default 100
   */
  threshold?: number;

  /**
   * Включить отслеживание направления прокрутки
   * @default true
   */
  trackDirection?: boolean;

  /**
   * Включить отслеживание скорости прокрутки
   * @default true
   */
  trackVelocity?: boolean;

  /**
   * Включить определение границ
   * @default true
   */
  trackBoundaries?: boolean;

  /**
   * Включить утилиты плавной прокрутки
   * @default true
   */
  enableSmoothScroll?: boolean;
}

/**
 * Утилитарные функции прокрутки
 */
interface ScrollUtils {
  scrollTo: (position: Partial<ScrollPosition>, options?: ScrollToOptions) => void;
  scrollIntoView: (element: HTMLElement, options?: ScrollIntoViewOptions) => void;
  scrollBy: (delta: Partial<ScrollPosition>, options?: ScrollToOptions) => void;
  scrollToTop: (options?: ScrollToOptions) => void;
  scrollToBottom: (options?: ScrollToOptions) => void;
  getElementOffset: (element: HTMLElement) => ScrollPosition;
  isElementInView: (element: HTMLElement) => boolean;
  getVisibleElements: (elements: HTMLElement[]) => HTMLElement[];
}
```

## Справочник API

### Пропы компонента Scroll

| Проп | Тип | Обязательный | По умолчанию | Описание |
|------|-----|--------------|--------------|----------|
| `children` | `(state: ScrollState, utils: ScrollUtils) => ReactNode` | ✅ | - | Render функция, получающая состояние прокрутки и утилиты |
| `element` | `HTMLElement \| Window \| null` | ❌ | `window` | Целевой элемент для отслеживания прокрутки |
| `onScroll` | `(state: ScrollState) => void` | ❌ | - | Коллбэк, вызываемый при событиях прокрутки |
| `onScrollStart` | `(state: ScrollState) => void` | ❌ | - | Коллбэк, вызываемый при начале прокрутки |
| `onScrollEnd` | `(state: ScrollState) => void` | ❌ | - | Коллбэк, вызываемый при окончании прокрутки |
| `onDirectionChange` | `(direction: ScrollDirection) => void` | ❌ | - | Коллбэк, вызываемый при изменении направления прокрутки |
| `onReachTop` | `(state: ScrollState) => void` | ❌ | - | Коллбэк, вызываемый при достижении верхней границы |
| `onReachBottom` | `(state: ScrollState) => void` | ❌ | - | Коллбэк, вызываемый при достижении нижней границы |
| `onReachLeft` | `(state: ScrollState) => void` | ❌ | - | Коллбэк, вызываемый при достижении левой границы |
| `onReachRight` | `(state: ScrollState) => void` | ❌ | - | Коллбэк, вызываемый при достижении правой границы |
| `throttle` | `number` | ❌ | `16` | Задержка троттлинга для событий прокрутки (мс) |
| `debounce` | `number` | ❌ | `150` | Задержка дебаунсинга для определения окончания прокрутки (мс) |
| `threshold` | `number` | ❌ | `100` | Порог для определения "близкой" границы (px) |
| `trackDirection` | `boolean` | ❌ | `true` | Включить отслеживание направления прокрутки |
| `trackVelocity` | `boolean` | ❌ | `true` | Включить отслеживание скорости прокрутки |
| `trackBoundaries` | `boolean` | ❌ | `true` | Включить определение границ |
| `onReachLeft` | `(state: ScrollState) => void` | ❌ | - | Коллбэк, вызываемый при достижении левой границы |
| `onReachRight` | `(state: ScrollState) => void` | ❌ | - | Коллбэк, вызываемый при достижении правой границы |
| `throttle` | `number` | ❌ | `16` | Задержка троттлинга для событий прокрутки (мс) |
| `debounce` | `number` | ❌ | `150` | Задержка дебаунсинга для определения окончания прокрутки (мс) |
| `threshold` | `number` | ❌ | `100` | Порог для определения "близкой" границы (px) |
| `trackDirection` | `boolean` | ❌ | `true` | Включить отслеживание направления прокрутки |
| `trackVelocity` | `boolean` | ❌ | `true` | Включить отслеживание скорости прокрутки |
| `trackBoundaries` | `boolean` | ❌ | `true` | Включить определение границ |
| `enableSmoothScroll` | `boolean` | ❌ | `true` | Включить утилиты плавной прокрутки |

## Примеры

### Базовое отслеживание позиции прокрутки
```tsx
import { Scroll } from 'ui-magic-core';

function BasicScrollTracker() {
  return (
    <Scroll>
      {(state, utils) => (
        <div style={{ height: '200vh', padding: '20px' }}>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '10px'
            }}
          >
            <p>
Позиция прокрутки: X:
{state.position.x}
, Y:
{state.position.y}
            </p>
            <p>
Прогресс:
{Math.round(state.progress.vertical * 100)}
%
            </p>
            <p>
Направление:
{state.direction.vertical}
            </p>
          </div>

          <h1>Прокрутите вниз, чтобы увидеть отслеживание позиции</h1>
          <div style={{ height: '100vh' }}>Контент здесь...</div>
        </div>
      )}
    </Scroll>
  );
}
```

### Реализация бесконечной прокрутки
```tsx
import { useEffect, useState } from 'react';
import { Scroll } from 'ui-magic-core';

interface DataItem {
  id: number;
  title: string;
  content: string;
}

function InfiniteScrollList() {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreItems = async () => {
    if (loading || !hasMore)
return;

    setLoading(true);
    // Имитация API вызова
    const newItems = Array.from({ length: 20 }, (_, i) => ({
      id: items.length + i,
      title: `Элемент ${items.length + i + 1}`,
      content: `Контент для элемента ${items.length + i + 1}`
    }));

    setTimeout(() => {
      setItems(prev => [...prev, ...newItems]);
      setLoading(false);
      if (items.length + newItems.length >= 200) {
        setHasMore(false);
      }
    }, 1000);
  };

  useEffect(() => {
    loadMoreItems(); // Загрузить начальные элементы
  }, []);

  return (
    <Scroll
      onReachBottom={loadMoreItems}
      threshold={200}
    >
      {(state, utils) => (
        <div>
          <h1>Демо бесконечной прокрутки</h1>

          <div className="items-list">
            {items.map(item => (
              <div key={item.id} className="item-card">
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </div>
            ))}
          </div>

          {loading && (
            <div className="loading-indicator">
              Загрузка дополнительных элементов...
            </div>
          )}

          {!hasMore && (
            <div className="end-message">
              Больше нет элементов для загрузки
            </div>
          )}

          {state.boundaries.nearBottom && (
            <button
              onClick={utils.scrollToTop}
              className="scroll-to-top"
            >
              ↑ Наверх
            </button>
          )}
        </div>
      )}
    </Scroll>
  );
}
```

### Липкий заголовок с направлением прокрутки
```tsx
import { Scroll } from 'ui-magic-core';

function StickyHeaderPage() {
  return (
    <Scroll trackDirection>
      {(state, utils) => (
        <div>
          <header
            className={`
              sticky-header
              ${state.direction.vertical === 'up' ? 'header-visible' : 'header-hidden'}
              ${state.position.y > 100 ? 'header-scrolled' : ''}
            `}
          >
            <nav>
              <h1>Мой Сайт</h1>
              <ul>
                <li><a href="#home">Главная</a></li>
                <li><a href="#about">О нас</a></li>
                <li><a href="#services">Услуги</a></li>
                <li><a href="#contact">Контакты</a></li>
              </ul>
            </nav>

            <div className="scroll-progress">
              <div
                className="progress-bar"
                style={{ width: `${state.progress.vertical * 100}%` }}
              />
            </div>
          </header>

          <main style={{ paddingTop: '80px' }}>
            <section id="home" style={{ height: '100vh' }}>
              <h2>Раздел "Главная"</h2>
            </section>
            <section id="about" style={{ height: '100vh' }}>
              <h2>Раздел "О нас"</h2>
            </section>
            <section id="services" style={{ height: '100vh' }}>
              <h2>Раздел "Услуги"</h2>
            </section>
            <section id="contact" style={{ height: '100vh' }}>
              <h2>Раздел "Контакты"</h2>
            </section>
          </main>
        </div>
      )}
    </Scroll>
  );
}
```

### Параллакс эффекты прокрутки
```tsx
import { Scroll } from 'ui-magic-core';

function ParallaxPage() {
  return (
    <Scroll trackVelocity>
      {(state, utils) => (
        <div className="parallax-container">
          {/* Фоновый слой с более медленным движением */}
          <div
            className="parallax-bg"
            style={{
              transform: `translateY(${state.position.y * 0.5}px)`,
              opacity: Math.max(0, 1 - state.progress.vertical)
            }}
          >
            <img src="/bg-mountains.jpg" alt="Горы" />
          </div>

          {/* Средний слой со средним движением */}
          <div
            className="parallax-mid"
            style={{
              transform: `translateY(${state.position.y * 0.3}px) scale(${1 + state.progress.vertical * 0.1})`
            }}
          >
            <img src="/bg-trees.png" alt="Деревья" />
          </div>

          {/* Слой контента с обычным движением */}
          <div className="content-layer">
            <section className="hero">
              <h1
                style={{
                  transform: `translateY(${state.position.y * 0.2}px)`,
                  opacity: Math.max(0, 1 - state.progress.vertical * 2)
                }}
              >
                Демо параллакс прокрутки
              </h1>
            </section>

            <section className="content">
              <div
                style={{
                  transform: `translateX(${Math.sin(state.progress.vertical * Math.PI) * 50}px)`
                }}
              >
                <h2>Анимированный контент</h2>
                <p>Этот контент движется в зависимости от позиции прокрутки</p>
              </div>
            </section>
          </div>

          {/* Индикатор скорости */}
          <div
            className="velocity-indicator"
            style={{
              opacity: Math.min(1, state.velocity.magnitude / 1000),
              transform: `scale(${1 + state.velocity.magnitude / 2000})`
            }}
          >
            Скорость:
{' '}
{Math.round(state.velocity.magnitude)}
          </div>
        </div>
      )}
    </Scroll>
  );
}
```

### Список виртуальной прокрутки
```tsx
import { useMemo, useState } from 'react';
import { Scroll } from 'ui-magic-core';

interface VirtualItem {
  id: number;
  height: number;
  content: string;
}

function VirtualScrollList() {
  const [items] = useState<VirtualItem[]>(() =>
    Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      height: 50 + Math.random() * 100,
      content: `Виртуальный элемент ${i + 1}`
    }))
  );

  const containerHeight = 400;
  const overscan = 5;

  return (
    <div style={{ height: containerHeight, overflow: 'auto' }}>
      <Scroll element={undefined}>
        {(state, utils) => {
          const totalHeight = items.reduce((sum, item) => sum + item.height, 0);

          // Вычислить видимый диапазон
          const scrollTop = state.position.y;
          const scrollBottom = scrollTop + containerHeight;

          let startIndex = 0;
          let currentHeight = 0;

          // Найти начальный индекс
          for (let i = 0; i < items.length; i++) {
            if (currentHeight + items[i].height > scrollTop) {
              startIndex = Math.max(0, i - overscan);
              break;
            }
            currentHeight += items[i].height;
          }

          // Найти конечный индекс
          let endIndex = startIndex;
          currentHeight = items.slice(0, startIndex).reduce((sum, item) => sum + item.height, 0);

          for (let i = startIndex; i < items.length; i++) {
            if (currentHeight > scrollBottom) {
              endIndex = Math.min(items.length - 1, i + overscan);
              break;
            }
            currentHeight += items[i].height;
            endIndex = i;
          }

          const visibleItems = items.slice(startIndex, endIndex + 1);
          const offsetY = items.slice(0, startIndex).reduce((sum, item) => sum + item.height, 0);

          return (
            <div style={{ height: totalHeight, position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: offsetY,
                  left: 0,
                  right: 0
                }}
              >
                {visibleItems.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      height: item.height,
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                      background: index % 2 === 0 ? '#f9f9f9' : 'white'
                    }}
                  >
                    {item.content}
{' '}
(Высота:
{item.height}
px)
                  </div>
                ))}
              </div>

              {/* Оверлей информации прокрутки */}
              <div
                style={{
                  position: 'fixed',
                  top: 10,
                  right: 10,
                  background: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '4px'
                }}
              >
                <div>
Элементы
{startIndex}
-
{endIndex}
{' '}
из
{items.length}
                </div>
                <div>
Прогресс:
{Math.round(state.progress.vertical * 100)}
%
                </div>
              </div>
            </div>
          );
        }}
      </Scroll>
    </div>
  );
}
```

### Анимации, запускаемые прокруткой
```tsx
import { useEffect, useRef } from 'react';
import { Scroll } from 'ui-magic-core';

function ScrollAnimations() {
  const elementsRef = useRef<HTMLDivElement[]>([]);

  return (
    <Scroll onScroll={(state) => {
      // Проверить, какие элементы в области просмотра и анимировать их
      elementsRef.current.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const inView = rect.top < window.innerHeight && rect.bottom > 0;

          if (inView) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }
 else {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
          }
        }
      });
    }}
    >
      {(state, utils) => (
        <div>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              ref={el => el && (elementsRef.current[i] = el)}
              style={{
                height: '200px',
                margin: '100px 0',
                background: `hsl(${i * 36}, 70%, 60%)`,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                transition: 'all 0.6s ease',
                opacity: 0,
                transform: 'translateY(50px)'
              }}
            >
              Анимированный раздел
{' '}
{i + 1}
            </div>
          ))}

          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              padding: '10px',
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              borderRadius: '4px'
            }}
          >
            Прокрутка:
{' '}
{Math.round(state.position.y)}
px
          </div>
        </div>
      )}
    </Scroll>
  );
}
```

## Соображения производительности

1. **Троттлинг событий**: Настраиваемый троттлинг предотвращает избыточное срабатывание событий во время прокрутки
2. **Дебаунсинг обнаружения окончания**: Эффективно определяет, когда прокрутка остановилась
3. **RequestAnimationFrame**: Использует RAF для плавных анимаций и обновлений
4. **Управление памятью**: Автоматически очищает слушатели событий и таймеры
5. **Кэширование границ**: Кэширует вычисления границ для уменьшения повторных вычислений
6. **Селективное отслеживание**: Отключите неиспользуемые функции (скорость, направление) для лучшей производительности

## Лучшие практики

1. **Оптимизация производительности**: Используйте троттлинг для тяжелых обработчиков прокрутки
2. **Доступность**: Предоставляйте альтернативы с уменьшенным движением для анимаций
3. **Мобильная оптимизация**: Учитывайте поведение сенсорной прокрутки и импульс
4. **Прогрессивное улучшение**: Убедитесь, что функциональность работает без отслеживания прокрутки
5. **Управление памятью**: Очищайте слушатели при размонтировании компонента
6. **Плавные анимации**: Используйте CSS transforms вместо изменения свойств макета

## Руководство по миграции

### От ручных слушателей прокрутки

**До:**
```tsx
function OldScrollComponent() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
<div>
Прокрутка Y:
{scrollY}
</div>
);
}
```

**После:**
```tsx
function NewScrollComponent() {
  return (
    <Scroll>
      {state => (
        <div>
Прокрутка Y:
{state.position.y}
        </div>
      )}
    </Scroll>
  );
}
```

### От Intersection Observer

**До:**
```tsx
function OldInfiniteScroll() {
  const [items, setItems] = useState([]);
  const observerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {items.map(item => <div key={item.id}>{item.content}</div>)}
      <div ref={observerRef} />
    </div>
  );
}
```

**После:**
```tsx
function NewInfiniteScroll() {
  const [items, setItems] = useState([]);

  return (
    <Scroll onReachBottom={() => loadMore()}>
      {state => (
        <div>
          {items.map(item => <div key={item.id}>{item.content}</div>)}
        </div>
      )}
    </Scroll>
  );
}
```

## Общие паттерны

### Кнопка "Наверх"
```tsx
function BackToTopButton() {
  return (
    <Scroll>
      {(state, utils) => (
        <div>
          {/* Контент */}
          <div style={{ height: '200vh' }}>
            Длинный контент здесь...
          </div>

          {/* Кнопка "Наверх" */}
          {state.position.y > 500 && (
            <button
              onClick={utils.scrollToTop}
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                opacity: Math.min(1, (state.position.y - 500) / 500)
              }}
            >
              ↑ Наверх
            </button>
          )}
        </div>
      )}
    </Scroll>
  );
}
```

### Индикатор прогресса чтения
```tsx
function ReadingProgress() {
  return (
    <Scroll>
      {state => (
        <div>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: `${state.progress.vertical * 100}%`,
              height: '3px',
              background: 'linear-gradient(90deg, #007acc, #00d4aa)',
              zIndex: 1000
            }}
          />
          <article style={{ height: '200vh', padding: '20px' }}>
            <h1>Длинная статья</h1>
            <p>Содержание статьи здесь...</p>
          </article>
        </div>
      )}
    </Scroll>
  );
}
```

### Плавная навигация по разделам
```tsx
function SectionNavigation() {
  return (
    <Scroll>
      {(state, utils) => (
        <div>
          <nav style={{ position: 'fixed', top: 0, width: '100%' }}>
            <button onClick={() => utils.scrollTo({ y: 0 })}>
              Раздел 1
            </button>
            <button onClick={() => utils.scrollTo({ y: 800 })}>
              Раздел 2
            </button>
            <button onClick={() => utils.scrollTo({ y: 1600 })}>
              Раздел 3
            </button>
          </nav>

          <div style={{ height: '800px', background: '#f0f0f0' }}>Раздел 1</div>
          <div style={{ height: '800px', background: '#e0e0e0' }}>Раздел 2</div>
          <div style={{ height: '800px', background: '#d0d0d0' }}>Раздел 3</div>
        </div>
      )}
    </Scroll>
  );
}
```

## Связанные компоненты

- [`Focus`](../focus/README.ru.md) - Для управления фокусом и клавиатурной навигации
- [`Maybe`](../maybe/README.ru.md) - Для условного рендеринга на основе состояния прокрутки
- [`Show`](../show/README.ru.md) - Для видимости, запускаемой прокруткой
- [`Lazy`](../lazy/README.ru.md) - Для ленивой загрузки на основе прокрутки
- [`State`](../state/README.ru.md) - Для управления состоянием прокрутки
