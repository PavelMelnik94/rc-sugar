# Компонент GesturePad

Комплексный компонент распознавания жестов для React, который обрабатывает сенсорные и указательные взаимодействия, включая свайпы, тапы, pinch и долгие нажатия.

## Описание

Компонент `GesturePad` предоставляет декларативный и легко настраиваемый способ обработки сложных сенсорных жестов в React-приложениях. Он поддерживает одно- и мультитач взаимодействия с настраиваемой чувствительностью, временными интервалами и пороговыми значениями расстояний. Идеально подходит для создания мобильных интерфейсов, галерей изображений, интерактивных панелей и сенсорных приложений.

## Когда использовать
- **Мобильная навигация**: Жесты свайпа для навигации по страницам, управления каруселями или панелями
- **Просмотрщики изображений/контента**: Pinch-to-zoom, навигация свайпами и действия двойного тапа
- **Сенсорные интерфейсы**: Пользовательские сенсорные элементы управления для планшетов, киосков или мобильных приложений
- **Игры/Интерактив**: Игровые элементы управления на основе жестов или интерактивный образовательный контент
- **Доступность**: Альтернативные методы ввода для пользователей с различными предпочтениями взаимодействия

## Используемые паттерны
- **Делегирование событий**: Эффективная обработка сенсорных событий с правильной очисткой
- **Паттерн конфигурации**: Высоко настраиваемые параметры жестов и пороговые значения
- **Паттерн обратного вызова**: Четкое разделение обнаружения жестов и логики приложения
- **Управление состоянием касаний**: Правильное отслеживание мультитач взаимодействий и времени жестов
- **Оптимизация производительности**: Эффективные слушатели событий с пассивной обработкой

## Основные возможности

### Поддерживаемые жесты
- **Свайпы**: Обнаружение свайпов в четырех направлениях (влево, вправо, вверх, вниз)
- **Тапы**: Распознавание одиночного и двойного тапа с настраиваемыми временными интервалами
- **Долгое нажатие**: Настраиваемое обнаружение долгого нажатия с автоматическим таймаутом
- **Pinch**: Жесты pinch двумя пальцами для управления масштабом
- **Круг**: Обнаружение круговых жестов (будущее улучшение)

### Расширенная конфигурация
- **Контроль чувствительности**: Тонкая настройка чувствительности обнаружения жестов (шкала 0-1)
- **Пороговые значения расстояний**: Минимальные расстояния свайпов и допуски касаний
- **Временные окна**: Настраиваемые таймауты для тапов, двойных тапов и долгих нажатий
- **Поведение касаний**: Контроль над стандартным поведением касаний и предотвращением событий

## TypeScript типы

```typescript
/**
 * Информация о точке касания с координатами и идентификатором
 */
interface TouchPoint {
  /** X координата относительно области просмотра */
  x: number;
  /** Y координата относительно области просмотра */
  y: number;
  /** Уникальный идентификатор касания */
  id: number;
}

/**
 * Полные обработчики событий жестов
 */
interface GestureHandlers {
  /** Вызывается при жесте свайпа влево */
  swipeLeft?: () => void;
  /** Вызывается при жесте свайпа вправо */
  swipeRight?: () => void;
  /** Вызывается при жесте свайпа вверх */
  swipeUp?: () => void;
  /** Вызывается при жесте свайпа вниз */
  swipeDown?: () => void;
  /** Вызывается при жесте pinch in (уменьшение масштаба) */
  pinchIn?: () => void;
  /** Вызывается при жесте pinch out (увеличение масштаба) */
  pinchOut?: () => void;
  /** Вызывается при одиночном тапе */
  tap?: () => void;
  /** Вызывается при двойном тапе в пределах временного окна */
  doubleTap?: () => void;
  /** Вызывается после длительности долгого нажатия */
  longPress?: () => void;
  /** Вызывается при круговом жесте (будущее) */
  circle?: () => void;
}

/**
 * Полные опции конфигурации для распознавания жестов
 */
interface GesturePadProps {
  /** Обработчики событий жестов */
  gestures: GestureHandlers;

  /**
   * Чувствительность обнаружения жестов (0-1)
   * Более высокие значения = более чувствительное обнаружение
   * @default 0.7
   */
  sensitivity?: number;

  /**
   * Минимальное расстояние для жестов свайпа (пиксели)
   * @default 50
   */
  minSwipeDistance?: number;

  /**
   * Максимальное время для жестов тапа (миллисекунды)
   * @default 300
   */
  maxTapTime?: number;

  /**
   * Время, необходимое для долгого нажатия (миллисекунды)
   * @default 500
   */
  longPressTime?: number;

  /**
   * Временное окно для обнаружения двойного тапа (миллисекунды)
   * @default 300
   */
  doubleTapWindow?: number;

  /** Дочерние элементы для обертывания обнаружением жестов */
  children: ReactNode;

  /** Дополнительные стили для контейнера жестов */
  style?: CSSProperties;

  /**
   * Предотвращать ли стандартное поведение касаний
   * Предотвращает прокрутку, масштабирование и другие браузерные действия касаний
   * @default true
   */
  preventDefault?: boolean;
}
```

## Примеры использования

### Базовая сенсорная навигация

```tsx
import { GesturePad } from 'ui-magic-core/gesture-pad';

function ImageGallery() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <GesturePad
      gestures={{
        swipeLeft: () => setCurrentImage(prev => prev + 1),
        swipeRight: () => setCurrentImage(prev => Math.max(0, prev - 1)),
        doubleTap: () => setIsZoomed(!isZoomed),
        pinchOut: () => setIsZoomed(true),
        pinchIn: () => setIsZoomed(false)
      }}
      sensitivity={0.8}
      minSwipeDistance={30}
    >
      <div className={`image-container ${isZoomed ? 'zoomed' : ''}`}>
        <img src={images[currentImage]} alt="Галерея" />
        <div className="image-counter">
          {currentImage + 1}
{' '}
/
{images.length}
        </div>
      </div>
    </GesturePad>
  );
}
```

### Мобильное меню с управлением жестами

```tsx
import { GesturePad } from 'ui-magic-core/gesture-pad';

function MobileApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  return (
    <GesturePad
      gestures={{
        swipeRight: () => setSidebarOpen(true),
        swipeLeft: () => setSidebarOpen(false),
        swipeDown: () => setNotifications([]),
        longPress: () => showContextMenu()
      }}
      minSwipeDistance={60}
      longPressTime={600}
    >
      <div className="app-container">
        <Header />
        <MainContent />
        <Sidebar isOpen={sidebarOpen} />
      </div>
    </GesturePad>
  );
}
```

### Интерактивные игровые элементы управления

```tsx
import { GesturePad } from 'ui-magic-core/gesture-pad';

function GameBoard() {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [isAttacking, setIsAttacking] = useState(false);

  return (
    <GesturePad
      gestures={{
        swipeUp: () => movePlayer('up'),
        swipeDown: () => movePlayer('down'),
        swipeLeft: () => movePlayer('left'),
        swipeRight: () => movePlayer('right'),
        tap: () => selectTarget(),
        doubleTap: () => performAttack(),
        longPress: () => openInventory()
      }}
      sensitivity={0.9}
      doubleTapWindow={250}
      preventDefault={true}
    >
      <div className="game-board">
        <Player position={playerPosition} attacking={isAttacking} />
        <GameObjects />
        <Interface />
      </div>
    </GesturePad>
  );
}
```

### Просмотрщик контента с управлением масштабом

```tsx
import { GesturePad } from 'ui-magic-core/gesture-pad';

function DocumentViewer() {
  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(1);

  const handlePinchIn = useCallback(() => {
    setZoom(prev => Math.max(0.5, prev - 0.2));
  }, []);

  const handlePinchOut = useCallback(() => {
    setZoom(prev => Math.min(3, prev + 0.2));
  }, []);

  return (
    <GesturePad
      gestures={{
        swipeLeft: () => setPage(prev => prev + 1),
        swipeRight: () => setPage(prev => Math.max(1, prev - 1)),
        pinchIn: handlePinchIn,
        pinchOut: handlePinchOut,
        doubleTap: () => setZoom(zoom === 1 ? 2 : 1)
      }}
      sensitivity={0.7}
    >
      <div
        className="document-viewer"
        style={{ transform: `scale(${zoom})` }}
      >
        <DocumentPage page={page} />
        <PageControls currentPage={page} totalPages={totalPages} />
      </div>
    </GesturePad>
  );
}
```

## Расширенная конфигурация

### Тонкая настройка обнаружения жестов

```tsx
// Высокая чувствительность для точных взаимодействий
<GesturePad
  gestures={handlers}
  sensitivity={0.9}
  minSwipeDistance={20}
  maxTapTime={200}
  longPressTime={300}
  doubleTapWindow={200}
/>

// Консервативные настройки для стабильных взаимодействий
<GesturePad
  gestures={handlers}
  sensitivity={0.5}
  minSwipeDistance={80}
  maxTapTime={400}
  longPressTime={800}
  doubleTapWindow={400}
/>
```

### Пользовательские комбинации жестов

```tsx
function AdvancedGestureHandler() {
  const [gestureState, setGestureState] = useState({
    lastGesture: null,
    gestureCount: 0,
    comboActive: false
  });

  const handleGestureCombo = (gesture: string) => {
    setGestureState(prev => ({
      lastGesture: gesture,
      gestureCount: prev.lastGesture === gesture ? prev.gestureCount + 1 : 1,
      comboActive: true
    }));

    // Сброс комбо после задержки
    setTimeout(() => {
      setGestureState(prev => ({ ...prev, comboActive: false }));
    }, 1000);
  };

  return (
    <GesturePad
      gestures={{
        swipeLeft: () => handleGestureCombo('swipeLeft'),
        swipeRight: () => handleGestureCombo('swipeRight'),
        doubleTap: () => executeCombo(),
        longPress: () => showGestureHelp()
      }}
    >
      <GameInterface
        comboState={gestureState}
        onComboComplete={performSpecialMove}
      />
    </GesturePad>
  );
}
```

## Соображения производительности

### Стратегии оптимизации

1. **Мемоизация обработчиков событий**
```tsx
const gestureHandlers = useMemo(() => ({
  swipeLeft: () => navigate('next'),
  swipeRight: () => navigate('previous'),
  doubleTap: () => toggleZoom()
}), [navigate, toggleZoom]);

<GesturePad gestures={gestureHandlers}>
```

2. **Условная регистрация жестов**
```tsx
const gestures = useMemo(() => {
  const handlers: GestureHandlers = {};

  if (canNavigate) {
    handlers.swipeLeft = handleSwipeLeft;
    handlers.swipeRight = handleSwipeRight;
  }

  if (canZoom) {
    handlers.pinchIn = handlePinchIn;
    handlers.pinchOut = handlePinchOut;
  }

  return handlers;
}, [canNavigate, canZoom,]);
```

3. **Ограниченные по времени ответы на жесты**
```tsx
const throttledSwipe = useCallback(
  throttle((direction: string) => {
    handleSwipe(direction);
  }, 100),
  [handleSwipe]
);

const gestures = {
  swipeLeft: () => throttledSwipe('left'),
  swipeRight: () => throttledSwipe('right')
};
```

## Соображения доступности

### Поддержка клавиатуры и программ чтения с экрана

```tsx
function AccessibleGestureArea() {
  return (
    <GesturePad
      gestures={{
        swipeLeft: nextSlide,
        swipeRight: previousSlide,
        doubleTap: togglePlayback
      }}
    >
      <div
        role="region"
        aria-label="Интерактивный просмотрщик слайдов"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft')
previousSlide();
          if (e.key === 'ArrowRight')
nextSlide();
          if (e.key === ' ')
togglePlayback();
        }}
      >
        <SlideContent />
        <VisualGestureIndicators />
      </div>
    </GesturePad>
  );
}
```

### Поддержка уменьшенного движения

```tsx
function MotionAwareGestures() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const sensitivity = prefersReducedMotion ? 0.5 : 0.8;
  const minDistance = prefersReducedMotion ? 80 : 50;

  return (
    <GesturePad
      gestures={handlers}
      sensitivity={sensitivity}
      minSwipeDistance={minDistance}
    >
      <Content />
    </GesturePad>
  );
}
```

## Лучшие практики

### 1. Обратная связь по жестам
Всегда предоставляйте визуальную или тактильную обратную связь для распознанных жестов:

```tsx
const [gestureActive, setGestureActive] = useState(false);

const gestures = {
  swipeLeft: () => {
    setGestureActive(true);
    navigator.vibrate?.(50); // Тактильная обратная связь
    setTimeout(() => setGestureActive(false), 200);
    handleSwipe();
  }
};
```

### 2. Плавная деградация
Предоставляйте альтернативные методы взаимодействия для устройств без сенсорного экрана:

```tsx
function AdaptiveInterface() {
  const hasTouch = 'ontouchstart' in window;

  if (!hasTouch) {
    return <KeyboardInterface />;
  }

  return (
    <GesturePad gestures={handlers}>
      <TouchInterface />
    </GesturePad>
  );
}
```

### 3. Контекстно-зависимые жесты
Адаптируйте поведение жестов в зависимости от состояния приложения:

```tsx
const gestures = useMemo(() => {
  if (isEditing) {
    return {
      longPress: showEditingMenu,
      doubleTap: selectWord
    };
  }

  return {
    swipeLeft: nextPage,
    swipeRight: previousPage,
    doubleTap: toggleZoom
  };
}, [isEditing]);
```

### 4. Предотвращение конфликтов жестов
Избегайте конфликтующих жестов и предоставляйте четкие паттерны взаимодействия:

```tsx
// Хорошо: Четкие, неконфликтующие жесты
const gestures = {
  swipeLeft: navigation, // Горизонтальное движение
  swipeUp: showMenu, // Вертикальное движение
  doubleTap: zoom, // Взаимодействие тапом
  longPress: contextMenu // Временное взаимодействие
};

// Избегайте: Конфликтующие или неоднозначные жесты
const problematicGestures = {
  swipeLeft: action1,
  swipeRight: action2,
  tap: action3,
  doubleTap: action4 // Может конфликтовать с tap
};
```

## Связанные компоненты

- [`focus`](../focus/README.ru.md) - Управление фокусом для взаимодействий с жестами
- [`scroll`](../scroll/README.ru.md) - Поведение прокрутки, работающее с жестами
- [`zoom`](../zoom/README.ru.md) - Элементы управления масштабом, дополняющие pinch-жесты
- [`bound`](../bound/README.ru.md) - Ограничения границ для областей жестов

## Руководство по миграции

### От обработчиков событий касания

**До:**
```tsx
const handleTouchStart = (e) => { /* ручная обработка касаний */ };
const handleTouchMove = (e) => { /* ручное обнаружение жестов */ };
const handleTouchEnd = (e) => { /* ручное распознавание жестов */ };

<div
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>
```

**После:**
```tsx
<GesturePad
  gestures={{
    swipeLeft: handleSwipeLeft,
    doubleTap: handleDoubleTap,
    pinchOut: handlePinchOut
  }}
>
```

### От React Touch библиотек

**До:**
```tsx
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedLeft: handleLeft,
  onSwipedRight: handleRight
});

<div {...handlers}>
```

**После:**
```tsx
<GesturePad
  gestures={{
    swipeLeft: handleLeft,
    swipeRight: handleRight,
    pinchIn: handlePinchIn,
    longPress: handleLongPress
  }}
>
```
