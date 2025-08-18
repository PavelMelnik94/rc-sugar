# Компонент Cycle

Автоматический компонент карусели, который циклически переключает элементы с настраиваемыми временными интервалами, элементами управления паузой и плавными переходами. Идеально подходит для баннеров, отзывов, галерей изображений и любого вращающегося отображения контента.

## Описание

Компонент `Cycle` предоставляет элегантное решение для автоматического переключения коллекции элементов с точным контролем времени. Он обрабатывает сложности управления интервалами, функциональности паузы и плавных переходов, сохраняя при этом простой API. Компонент поддерживает поведение паузы при наведении, настраиваемые временные интервалы и уведомления через обратные вызовы для событий цикла.

## Когда использовать
- 🎠 **Карусели и баннеры**: Вращающиеся баннеры-герои, рекламный контент, избранные элементы
- 💬 **Отзывы**: Циклическое переключение отзывов клиентов и рекомендаций
- 📸 **Галереи изображений**: Функциональность автоматического слайд-шоу
- 📢 **Объявления**: Вращающиеся уведомления, предупреждения и объявления
- 📊 **Отображение данных**: Циклическое переключение различных метрик или диаграмм
- 🎯 **Маркетинговый контент**: Вращающиеся предложения, скидки и рекламные материалы
- 🔄 **Ротация контента**: Любой сценарий, требующий автоматического переключения контента

## Используемые паттерны
- **Автоматическое управление состоянием**: Автоматическая обработка циклического переключения на основе интервалов
- **Контроль паузы**: Функциональность паузы при наведении мыши для лучшего UX
- **Обратные вызовы событий**: Уведомления об изменениях состояния цикла
- **Адаптивное время**: Настраиваемые интервалы для различных типов контента
- **Безопасность типов**: Полная поддержка TypeScript для типов элементов
- **Оптимизация производительности**: Эффективное управление таймерами и очистка

## TypeScript типы
```typescript
import { ReactNode } from 'react';

/**
 * Свойства для компонента Cycle
 */
interface CycleProps {
  /** Массив элементов для циклического переключения */
  items: ReactNode[];

  /** Интервал в миллисекундах между циклами */
  interval: number;

  /** Автоматически ли начинать циклическое переключение */
  autoStart?: boolean;

  /** Приостанавливать ли циклическое переключение при наведении */
  pauseOnHover?: boolean;

  /** Обратный вызов при изменении активного элемента */
  onCycle?: (currentIndex: number, previousIndex: number) => void;
}

/** Тип компонента Cycle */
declare const Cycle: React.FC<CycleProps> & {
  displayName: string;
};
```

## Примеры использования

### Базовая карусель изображений

```jsx
import { Cycle } from 'ui-magic-core/cycle';

function ImageGallery() {
  const images = [
    <img src="/photo1.jpg" alt="Beautiful sunset" />,
    <img src="/photo2.jpg" alt="Mountain landscape" />,
    <img src="/photo3.jpg" alt="Ocean waves" />,
    <img src="/photo4.jpg" alt="City skyline" />
  ];

  return (
    <div className="gallery-container">
      <h2>Photo Gallery</h2>
      <Cycle
        items={images}
        interval={3000}
        pauseOnHover={true}
        onCycle={(current, previous) => {
          console.log(`Switched from ${previous} to ${current}`);
        }}
      />
    </div>
  );
}
```

### Карусель отзывов

```jsx
import { Cycle } from 'ui-magic-core/cycle';

function TestimonialCarousel() {
  const testimonials = [
    <div className="testimonial">
      <p>"Excellent service! Highly recommend to all my friends."</p>
      <cite>— Anna Petrova, Moscow</cite>
      <div className="rating">⭐⭐⭐⭐⭐</div>
    </div>,
    <div className="testimonial">
      <p>"Fast delivery and great product quality."</p>
      <cite>— Mikhail Ivanov, Saint Petersburg</cite>
      <div className="rating">⭐⭐⭐⭐⭐</div>
    </div>,
    <div className="testimonial">
      <p>"User-friendly interface and professional support."</p>
      <cite>— Elena Sidorova, Novosibirsk</cite>
      <div className="rating">⭐⭐⭐⭐⭐</div>
    </div>
  ];

  return (
    <section className="testimonial-section">
      <h2>What Our Clients Say</h2>
      <Cycle
        items={testimonials}
        interval={5000}
        pauseOnHover={true}
        autoStart={true}
      />
    </section>
  );
}
```

### Рекламный баннер

```jsx
import { Cycle } from 'ui-magic-core/cycle';

function PromoBanner() {
  const [currentOffer, setCurrentOffer] = useState(0);

  const offers = [
    <div className="offer discount">
      <h3>Скидка 50% на все товары</h3>
      <p>Только до конца месяца! Не упустите шанс!</p>
      <button>Купить сейчас</button>
    </div>,
    <div className="offer delivery">
      <h3>Бесплатная доставка</h3>
      <p>На заказы свыше 3000 руб. по всей России</p>
      <button>Заказать сейчас</button>
    </div>,
    <div className="offer new-collection">
      <h3>Новая коллекция</h3>
      <p>Эксклюзивные модели только что поступили</p>
      <button>Смотреть новые поступления</button>
    </div>
  ];

  const handleOfferChange = (current, previous) => {
    setCurrentOffer(current);
    // Отправка аналитики
    analytics.track('banner_change', {
      from: previous,
      to: current,
      time: Date.now()
    });
  };

  return (
    <div className="promo-banner">
      <Cycle
        items={offers}
        interval={4000}
        pauseOnHover={true}
        onCycle={handleOfferChange}
      />
      <div className="indicators">
        {offers.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentOffer ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
```

### Панель мониторинга метрик

```jsx
import { Cycle } from 'ui-magic-core/cycle';

function MetricsPanel() {
  const metrics = [
    <div className="metric sales">
      <h3>Sales Today</h3>
      <div className="value">₽2,485,000</div>
      <div className="change positive">+12.5%</div>
    </div>,
    <div className="metric users">
      <h3>Active Users</h3>
      <div className="value">15,847</div>
      <div className="change positive">+8.2%</div>
    </div>,
    <div className="metric orders">
      <h3>New Orders</h3>
      <div className="value">342</div>
      <div className="change negative">-3.1%</div>
    </div>,
    <div className="metric conversion">
      <h3>Conversion Rate</h3>
      <div className="value">4.7%</div>
      <div className="change positive">+0.8%</div>
    </div>
  ];

  return (
    <div className="metrics-panel">
      <h2>Key Metrics</h2>
      <Cycle
        items={metrics}
        interval={6000}
        pauseOnHover={true}
        onCycle={(current) => {
          console.log(`Displaying metric: ${current}`);
        }}
      />
    </div>
  );
}
```

### Образовательная карусель с инструкциями

```jsx
import { Cycle } from 'ui-magic-core/cycle';

function InstructionCarousel() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    <div className="instruction-step">
      <h3>Step 1: Registration</h3>
      <p>Create an account by providing your email and a secure password</p>
      <img src="/instruction-1.png" alt="Registration Form" />
      <button onClick={() => markStepAsCompleted(0)}>
        Got it
      </button>
    </div>,
    <div className="instruction-step">
      <h3>Step 2: Profile Setup</h3>
      <p>Add a photo and fill in your personal information</p>
      <img src="/instruction-2.png" alt="Profile Settings" />
      <button onClick={() => markStepAsCompleted(1)}>
        Got it
      </button>
    </div>,
    <div className="instruction-step">
      <h3>Step 3: First Purchase</h3>
      <p>Select a product and place your first order</p>
      <img src="/instruction-3.png" alt="Purchase Process" />
      <button onClick={() => markStepAsCompleted(2)}>
        Got it
      </button>
    </div>
  ];

  const markStepAsCompleted = (step: number) => {
    setCompletedSteps(prev => [...prev, step]);
  };

  return (
    <div className="instruction-carousel">
      <h2>Getting Started</h2>
      <Cycle
        items={steps}
        interval={8000}
        pauseOnHover={true}
        autoStart={true}
      />
      <div className="progress">
        <span>Progress: {completedSteps.length}/{steps.length}</span>
        <div className="progress-bar">
          <div
            className="fill"
            style={{
              width: `${(completedSteps.length / steps.length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

## Новые пропсы для кастомного рендера

### `renderItem`
- **Тип**: `(item: ReactNode, index: number) => ReactNode`
- **Описание**: Функция-рендер-проп для кастомизации отображения каждого элемента в цикле.
- **Пример**:

```tsx
<Cycle
  items={items}
  interval={3000}
  renderItem={(item, index) => (
    <div className="custom-item" key={index}>
      {item}
    </div>
  )}
/>
```

### `renderIndicators`
- **Тип**: `(currentIndex: number, totalItems: number) => ReactNode`
- **Описание**: Функция-рендер-проп для кастомизации отображения индикаторов.
- **Пример**:

```tsx
<Cycle
  items={items}
  interval={3000}
  renderIndicators={(currentIndex, totalItems) => (
    <div className="custom-indicators">
      {Array.from({ length: totalItems }).map((_, index) => (
        <span
          key={index}
          className={index === currentIndex ? 'active' : ''}
        >
          {index + 1}
        </span>
      ))}
    </div>
  )}
/>
```

## Расширенная конфигурация

### Регулировка времени в зависимости от типа контента

```jsx
// Быстрое переключение для простого контента
<Cycle items={simpleItems} interval={2000} />

// Медленное переключение для сложного контента
<Cycle items={complexItems} interval={8000} />

// Очень медленное для чтения
<Cycle items={textBlocks} interval={12000} />
```

### Условный автозапуск

```jsx
function ConditionalCarousel() {
  const userPrefersAutoStart = useUserPreference('autostart');
  const elementInViewport = useIntersectionObserver(refToElement);

  return (
    <Cycle
      items={items}
      interval={4000}
      autoStart={userPrefersAutoStart && elementInViewport}
      pauseOnHover={true}
    />
  );
}
```

### Динамические элементы

```jsx
function DynamicCarousel() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Получение данных с сервера
    fetchData().then(setData);
  }, []);

  const items = useMemo(() =>
    data.map(item => (
      <ProductCard key={item.id} data={item} />
    )), [data]);

  if (items.length === 0) {
    return <LoadingIndicator />;
  }

  return (
    <Cycle
      items={items}
      interval={5000}
      pauseOnHover={true}
    />
  );
}
```

## Интеграция аналитики

### Отслеживание просмотров

```jsx
function AnalyticsCarousel() {
  const trackView = useCallback((index: number) => {
    analytics.event('carousel_view', {
      position: index,
      time: Date.now(),
      sessionId: getSessionId()
    });
  }, []);

  return (
    <Cycle
      items={items}
      interval={4000}
      onCycle={trackView}
    />
  );
}
```

### A/B тестирование интервалов

```jsx
function IntervalTesting() {
  const experimentalInterval = useABTest('carousel-interval', {
    control: 4000,
    variant_a: 3000,
    variant_b: 5000
  });

  return (
    <Cycle
      items={items}
      interval={experimentalInterval}
      onCycle={(current) => {
        trackConversion('view_item', { position: current });
      }}
    />
  );
}
```

## Учет производительности

### Оптимизация рендеринга

```jsx
// Мемоизация элементов, чтобы предотвратить ненужные перерисовки
const memoizedItems = useMemo(() =>
  itemData.map(data => (
    <HeavyComponent key={data.id} {...data} />
  )), [itemData]);

<Cycle items={memoizedItems} interval={4000} />;
```

### Ленивое загружать контент

```jsx
function LazyLoadCarousel() {
  const [loadedItems, setLoadedItems] = useState(new Set());

  const handleItemChange = useCallback((index: number) => {
    // Предварительная загрузка следующих элементов
    const nextIndices = [index + 1, index + 2].filter(i =>
      i < totalItems && !loadedItems.has(i)
    );

    nextIndices.forEach(preloadItem);
  }, [loadedItems]);

  return (
    <Cycle
      items={items}
      interval={4000}
      onCycle={handleItemChange}
    />
  );
}
```

## Доступность

### Поддержка экранных читалок

```jsx
function AccessibleCarousel() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  return (
    <div
      role="region"
      aria-label="Карусель с автоматическим циклом"
      aria-live="polite"
    >
      <Cycle
        items={items}
        interval={6000}
        pauseOnHover={true}
        onCycle={setCurrentSlideIndex}
      />
      <div className="slide-info" aria-live="polite">
        Слайд
{' '}
{currentSlideIndex + 1}
{' '}
из
{' '}
{items.length}
      </div>
    </div>
  );
}
```

### Управление с клавиатуры

```jsx
function KeyboardControlCarousel() {
  const [keyboardPause, setKeyboardPause] = useState(false);

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === ' ') {
      setKeyboardPause(!keyboardPause);
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyPress}
      aria-label="Нажмите пробел для паузы/воспроизведения"
    >
      <Cycle
        items={items}
        interval={4000}
        autoStart={!keyboardPause}
      />
    </div>
  );
}
```

## Рекомендации по лучшим практикам

### 1. Адаптивные интервалы
Регулируйте интервалы в зависимости от контента:

```jsx
const interval = useMemo(() => {
  if (contentType === 'image')
return 3000;
  if (contentType === 'text')
return 8000;
  if (contentType === 'video')
return 15000;
  return 4000;
}, [contentType]);
```

### 2. Индикаторы прогресса
Покажите пользователям, где они находятся:

```jsx
<div className="carousel-indicators">
  {items.map((_, index) => (
    <button
      key={index}
      className={`indicator ${index === current ? 'active' : ''}`}
      onClick={() => switchTo(index)}
    />
  ))}
</div>;
```

### 3. Плавное ухудшение
Обеспечьте функциональность без JavaScript:

```jsx
<noscript>
  <div className="static-carousel">
    {items.map((item, index) => (
      <div key={index} className="static-slide">
        {item}
      </div>
    ))}
  </div>
</noscript>;
```

## Связанные компоненты

- [`gesture-pad`](../gesture-pad/README.md) - Добавьте управление жестами к карусели
- [`lazy`](../lazy/README.md) - Ленивое загружать контент карусели
- [`memo`](../memo/README.md) - Оптимизация рендеринга элементов
- [`focus`](../focus/README.md) - Управление фокусом внутри карусели

## Руководство по миграции

### Из setInterval

**До:**
```jsx
useEffect(() => {
  const interval = setInterval(() => {
    setCurrent(prev => (prev + 1) % items.length);
  }, 3000);

  return () => clearInterval(interval);
}, [items.length]);
```

**После:**
```jsx
<Cycle
  items={items}
  interval={3000}
  onCycle={setCurrent}
/>;
```

### Из внешних библиотек каруселей

**До:**
```jsx
import { Carousel } from 'carousel-library';

<Carousel autoplay autoplaySpeed={3000}>
  {items.map(item => <div>{item}</div>)}
</Carousel>;
```

**После:**
```jsx
<Cycle
  items={items}
  interval={3000}
  pauseOnHover={true}
/>;
```
