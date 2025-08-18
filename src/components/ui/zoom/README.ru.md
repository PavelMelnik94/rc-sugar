# Компонент Zoom

Интеллектуальный компонент автоматического масштабирования, который динамически настраивает размер контента под контейнеры с настраиваемыми ограничениями и плавными переходами. Идеально подходит для адаптивных изображений, диаграмм, схем и любого контента, нуждающегося в адаптивном масштабировании.

## Описание

Компонент `Zoom` предоставляет сложные возможности автоматического масштабирования для React-приложений. Он интеллектуально рассчитывает оптимальные коэффициенты масштабирования на основе размеров контейнера и размера контента, с поддержкой режимов подгонки по ширине/высоте, центрирования, границ масштабирования и плавных переходов. Компонент использует ResizeObserver для эффективного адаптивного поведения и изящно обрабатывает сложные сценарии масштабирования.

## Когда использовать
- **Адаптивные изображения**: Автоматическое масштабирование изображений под контейнеры с сохранением пропорций
- **Отображение диаграмм/графиков**: Обеспечение идеального размещения визуализаций данных в панелях дашборда
- **Просмотрщики документов**: Масштабирование PDF-страниц, диаграмм или технических чертежей до оптимального размера просмотра
- **Виджеты дашборда**: Автоматическое изменение размера содержимого виджетов под доступное пространство
- **Мобильные интерфейсы**: Адаптация большого контента для разных размеров экрана
- **Макеты для печати**: Масштабирование контента для предварительного просмотра печати или разных размеров бумаги
- **Интерактивные галереи**: Автоматическое масштабирование для контента различных размеров

## Используемые паттерны
- **Адаптивный дизайн**: Автоматическая адаптация к изменениям размера контейнера
- **Паттерн наблюдателя**: ResizeObserver для эффективного мониторинга размеров
- **Масштабирование на основе трансформаций**: CSS-трансформации для плавного, производительного масштабирования
- **Удовлетворение ограничений**: Интеллектуальный расчет масштаба в заданных границах
- **Оптимизация производительности**: Эффективные пересчеты и плавные переходы

## TypeScript типы

```typescript
import { ReactNode } from 'react';

/**
 * Свойства для компонента Zoom
 */
interface ZoomProps {
  /** Контент для автоматического масштабирования */
  children: ReactNode;

  /**
   * Максимальный допустимый коэффициент масштабирования
   * @default 2
   */
  maxScale?: number;

  /**
   * Минимальный допустимый коэффициент масштабирования
   * @default 0.1
   */
  minScale?: number;

  /**
   * Подгонять ли контент под ширину контейнера
   * @default false
   */
  fitWidth?: boolean;

  /**
   * Подгонять ли контент под высоту контейнера
   * @default false
   */
  fitHeight?: boolean;

  /**
   * Центрировать ли контент в контейнере
   * @default true
   */
  center?: boolean;

  /**
   * Пользовательский коэффициент масштабирования (отключает автоматический расчет)
   */
  scale?: number;

  /**
   * Обратный вызов при изменении масштаба
   * @param scale - Новое значение масштаба
   */
  onScaleChange?: (scale: number) => void;
}

/** Тип компонента Zoom */
declare const Zoom: React.FC<ZoomProps> & {
  displayName: string;
};
```

## Примеры использования

### Адаптивная галерея изображений

```tsx
import { Zoom } from 'ui-magic-core/zoom';

function AdaptiveGallery() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentScale, setCurrentScale] = useState(1);

  const images = [
    { src: '/пейзаж1.jpg', alt: 'Горный пейзаж', aspectRatio: 16 / 9 },
    { src: '/портрет1.jpg', alt: 'Городской портрет', aspectRatio: 9 / 16 },
    { src: '/квадрат1.jpg', alt: 'Абстрактное искусство', aspectRatio: 1 }
  ];

  return (
    <div className="gallery-container">
      <div className="image-viewer" style={{ height: '400px', width: '100%' }}>
        <Zoom
          fitWidth
          fitHeight
          maxScale={3}
          minScale={0.5}
          center
          onScaleChange={setCurrentScale}
        >
          <img
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
            style={{ maxWidth: 'none', height: 'auto' }}
          />
        </Zoom>
      </div>

      <div className="gallery-info">
        <span>
Масштаб:
{(currentScale * 100).toFixed(1)}
%
        </span>
        <span>
Изображение:
{selectedImage + 1}
/
{images.length}
        </span>
      </div>

      <div className="gallery-controls">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={index === selectedImage ? 'active' : ''}
          >
            Изображение
{' '}
{index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Автомасштабирование диаграмм дашборда

```tsx
import { Zoom } from 'ui-magic-core/zoom';

function DashboardPanel() {
  const [chartData, setChartData] = useState(generateChartData());
  const [panelSize, setPanelSize] = useState('medium');

  const panelSizes = {
    small: { width: '300px', height: '200px' },
    medium: { width: '500px', height: '300px' },
    large: { width: '800px', height: '500px' }
  };

  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <h3>Аналитика продаж</h3>
        <select
          value={panelSize}
          onChange={e => setPanelSize(e.target.value)}
        >
          <option value="small">Малый</option>
          <option value="medium">Средний</option>
          <option value="large">Большой</option>
        </select>
      </div>

      <div
        className="chart-container"
        style={panelSizes[panelSize]}
      >
        <Zoom
          fitWidth
          fitHeight
          maxScale={1.2}
          minScale={0.6}
          onScaleChange={(scale) => {
            console.log(`Диаграмма масштабирована до ${(scale * 100).toFixed(1)}%`);
          }}
        >
          <div className="chart-content">
            <svg width="600" height="400" viewBox="0 0 600 400">
              {/* Сложная отрисовка диаграммы */}
              <g className="chart-bars">
                {chartData.map((value, index) => (
                  <rect
                    key={index}
                    x={index * 60 + 50}
                    y={350 - value * 3}
                    width="40"
                    height={value * 3}
                    fill="#4CAF50"
                  />
                ))}
              </g>
              <g className="chart-labels">
                {chartData.map((value, index) => (
                  <text
                    key={index}
                    x={index * 60 + 70}
                    y={370}
                    textAnchor="middle"
                    fontSize="12"
                  >
                    К
{index + 1}
                  </text>
                ))}
              </g>
            </svg>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color"></span>
                Квартальные продажи (₽тыс.)
              </div>
            </div>
          </div>
        </Zoom>
      </div>
    </div>
  );
}
```

### Просмотрщик документов с элементами управления масштабом

```tsx
import { Zoom } from 'ui-magic-core/zoom';

function DocumentViewer() {
  const [userScale, setUserScale] = useState<number | undefined>(undefined);
  const [autoScale, setAutoScale] = useState(true);
  const [fitMode, setFitMode] = useState<'width' | 'height' | 'both'>('width');

  const handleScalePreset = (scale: number) => {
    setUserScale(scale);
    setAutoScale(false);
  };

  const handleAutoFit = () => {
    setUserScale(undefined);
    setAutoScale(true);
  };

  return (
    <div className="document-viewer">
      <div className="viewer-toolbar">
        <div className="scale-controls">
          <button onClick={() => handleScalePreset(0.5)}>50%</button>
          <button onClick={() => handleScalePreset(0.75)}>75%</button>
          <button onClick={() => handleScalePreset(1)}>100%</button>
          <button onClick={() => handleScalePreset(1.25)}>125%</button>
          <button onClick={() => handleScalePreset(1.5)}>150%</button>
          <button onClick={handleAutoFit} className={autoScale ? 'active' : ''}>
            Авто подгонка
          </button>
        </div>

        {autoScale && (
          <div className="fit-controls">
            <select
              value={fitMode}
              onChange={e => setFitMode(e.target.value as any)}
            >
              <option value="width">По ширине</option>
              <option value="height">По высоте</option>
              <option value="both">По обоим</option>
            </select>
          </div>
        )}
      </div>

      <div className="document-container" style={{ height: '600px' }}>
        <Zoom
          scale={userScale}
          fitWidth={autoScale && (fitMode === 'width' || fitMode === 'both')}
          fitHeight={autoScale && (fitMode === 'height' || fitMode === 'both')}
          maxScale={5}
          minScale={0.1}
          center
          onScaleChange={(scale) => {
            if (autoScale) {
              console.log(`Автомасштабирование до ${(scale * 100).toFixed(1)}%`);
            }
          }}
        >
          <div className="document-page">
            <div className="page-content">
              <h1>Заголовок документа</h1>
              <p>Это образец документа, демонстрирующий автоматическое масштабирование...</p>
              <div className="document-body">
                {/* Большой контент документа */}
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                <img src="/изображение-документа.png" alt="Диаграмма" />
                <table>
                  <thead>
                    <tr>
                      <th>Колонка 1</th>
                      <th>Колонка 2</th>
                      <th>Колонка 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Данные 1</td>
                      <td>Данные 2</td>
                      <td>Данные 3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Zoom>
      </div>
    </div>
  );
}
```

### Адаптивный мобильный виджет

```tsx
import { Zoom } from 'ui-magic-core/zoom';

function MobileWidget() {
  const [orientation, setOrientation] = useState('portrait');
  const [scaleInfo, setScaleInfo] = useState({ scale: 1, mode: 'auto' });

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return (
    <div className={`mobile-widget ${orientation}`}>
      <div className="widget-header">
        <h3>Мобильный дашборд</h3>
        <div className="scale-indicator">
          Масштаб:
{' '}
{(scaleInfo.scale * 100).toFixed(0)}
%
        </div>
      </div>

      <div className="widget-content">
        <Zoom
          fitWidth={orientation === 'portrait'}
          fitHeight={orientation === 'landscape'}
          maxScale={2}
          minScale={0.3}
          center
          onScaleChange={(scale) => {
            setScaleInfo({
              scale,
              mode: orientation === 'portrait' ? 'fit-width' : 'fit-height'
            });
          }}
        >
          <div className="dashboard-content">
            <div className="metrics-grid">
              <div className="metric-card">
                <h4>Пользователи</h4>
                <div className="metric-value">1,234</div>
              </div>
              <div className="metric-card">
                <h4>Продажи</h4>
                <div className="metric-value">₽2,485 тыс.</div>
              </div>
              <div className="metric-card">
                <h4>Конверсия</h4>
                <div className="metric-value">3.2%</div>
              </div>
              <div className="metric-card">
                <h4>Рост</h4>
                <div className="metric-value">+12%</div>
              </div>
            </div>

            <div className="chart-section">
              <div className="mini-chart">
                <svg width="300" height="150" viewBox="0 0 300 150">
                  <polyline
                    points="10,140 50,120 90,100 130,80 170,90 210,70 250,60 290,50"
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Zoom>
      </div>
    </div>
  );
}
```

### Масштабирование макета для печати

```tsx
import { Zoom } from 'ui-magic-core/zoom';

function PrintPreview() {
  const [paperSize, setPaperSize] = useState('A4');
  const [currentScale, setCurrentScale] = useState(1);

  const paperSizes = {
    A4: { width: '210mm', height: '297mm' },
    Letter: { width: '8.5in', height: '11in' },
    Legal: { width: '8.5in', height: '14in' }
  };

  return (
    <div className="print-preview">
      <div className="print-controls">
        <select
          value={paperSize}
          onChange={e => setPaperSize(e.target.value)}
        >
          <option value="A4">A4</option>
          <option value="Letter">Letter</option>
          <option value="Legal">Legal</option>
        </select>

        <div className="scale-info">
          Текущий масштаб:
{' '}
{(currentScale * 100).toFixed(1)}
%
        </div>

        <button onClick={() => window.print()}>
          Печать документа
        </button>
      </div>

      <div
        className="paper-container"
        style={{
          width: paperSizes[paperSize].width,
          height: paperSizes[paperSize].height,
          maxWidth: '100%',
          maxHeight: '80vh',
          margin: '0 auto',
          backgroundColor: 'white',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Zoom
          fitWidth
          fitHeight
          maxScale={1}
          minScale={0.1}
          center
          onScaleChange={setCurrentScale}
        >
          <div className="document-content" style={{ padding: '1in' }}>
            <header className="document-header">
              <h1>Бизнес-отчет</h1>
              <div className="header-info">
                <div>
Дата:
{new Date().toLocaleDateString('ru-RU')}
                </div>
                <div>
Бумага:
{paperSize}
                </div>
              </div>
            </header>

            <main className="document-body">
              <section>
                <h2>Краткое изложение</h2>
                <p>Этот отчет предоставляет комплексный обзор...</p>
              </section>

              <section>
                <h2>Финансовые данные</h2>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Квартал</th>
                      <th>Выручка</th>
                      <th>Рост</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1 кв. 2024</td>
                      <td>₽8,750,000</td>
                      <td>+15%</td>
                    </tr>
                    <tr>
                      <td>2 кв. 2024</td>
                      <td>₽10,062,500</td>
                      <td>+12%</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </main>

            <footer className="document-footer">
              <div>Страница 1 из 1</div>
              <div>
Масштаб:
{(currentScale * 100).toFixed(1)}
%
              </div>
            </footer>
          </div>
        </Zoom>
      </div>
    </div>
  );
}
```

## Расширенная конфигурация

### Пользовательское управление масштабом

```tsx
function CustomZoomControls() {
  const [manualScale, setManualScale] = useState<number | undefined>(undefined);
  const [autoMode, setAutoMode] = useState(true);

  return (
    <div className="zoom-container">
      <div className="zoom-controls">
        <button
          onClick={() => {
            setAutoMode(true);
            setManualScale(undefined);
          }}
          className={autoMode ? 'active' : ''}
        >
          Авто подгонка
        </button>

        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={manualScale || 1}
          onChange={(e) => {
            setManualScale(Number(e.target.value));
            setAutoMode(false);
          }}
          disabled={autoMode}
        />

        <span>
{((manualScale || 1) * 100).toFixed(0)}
%
        </span>
      </div>

      <div className="content-area" style={{ height: '400px' }}>
        <Zoom
          scale={manualScale}
          fitWidth={autoMode}
          fitHeight={autoMode}
          maxScale={3}
          minScale={0.1}
          onScaleChange={(scale) => {
            if (autoMode) {
              console.log(`Автомасштаб: ${scale}`);
            }
          }}
        >
          <div className="scalable-content">
            <h2>Масштабируемый контент</h2>
            <p>Этот контент адаптируется к различным уровням масштабирования...</p>
          </div>
        </Zoom>
      </div>
    </div>
  );
}
```

### Адаптивное масштабирование точек останова

```tsx
function AdaptiveZoom() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Расчет адаптивных ограничений масштаба
  const getScaleLimits = () => {
    if (windowSize.width < 768) {
      return { maxScale: 1.5, minScale: 0.5 }; // Мобильный
    }
 else if (windowSize.width < 1024) {
      return { maxScale: 2, minScale: 0.3 }; // Планшет
    }
 else {
      return { maxScale: 3, minScale: 0.1 }; // Десктоп
    }
  };

  const { maxScale, minScale } = getScaleLimits();

  return (
    <div className="adaptive-zoom">
      <div className="device-info">
        <span>
Устройство:
{windowSize.width}
x
{windowSize.height}
        </span>
        <span>
Диапазон масштаба:
{(minScale * 100).toFixed(0)}
%-
{(maxScale * 100).toFixed(0)}
%
        </span>
      </div>

      <Zoom
        fitWidth
        maxScale={maxScale}
        minScale={minScale}
        center
      >
        <div className="adaptive-content">
          <h1>Адаптивный дизайн</h1>
          <div className="content-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="grid-item">
                Элемент
{' '}
{i + 1}
              </div>
            ))}
          </div>
        </div>
      </Zoom>
    </div>
  );
}
```

### Управление анимацией и переходами

```tsx
function AnimatedZoom() {
  const [targetScale, setTargetScale] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const animateToScale = (scale: number) => {
    setIsAnimating(true);
    setTargetScale(scale);

    // Сброс состояния анимации после перехода
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="animated-zoom">
      <div className="animation-controls">
        <button onClick={() => animateToScale(0.5)}>Уменьшить</button>
        <button onClick={() => animateToScale(1)}>Сброс</button>
        <button onClick={() => animateToScale(1.5)}>Увеличить</button>
        <div className={`animation-indicator ${isAnimating ? 'active' : ''}`}>
          {isAnimating ? 'Анимируется...' : 'Готово'}
        </div>
      </div>

      <div className="zoom-content">
        <Zoom
          scale={targetScale}
          maxScale={2}
          minScale={0.25}
          center
          onScaleChange={(scale) => {
            console.log(`Масштаб изменен на: ${scale}`);
          }}
        >
          <div className="animated-content">
            <div className="zoom-target">
              <h3>Анимированное масштабирование</h3>
              <p>Наблюдайте плавное масштабирование этого контента</p>
              <div className="visual-indicator">
                <div className="scale-circle"></div>
              </div>
            </div>
          </div>
        </Zoom>
      </div>
    </div>
  );
}
```

## Соображения производительности

### Оптимизация большого контента

```tsx
function OptimizedZoom() {
  const [isVisible, setIsVisible] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Виртуализация для больших наборов данных
  const [visibleItems, setVisibleItems] = useState({ start: 0, end: 50 });
  const allItems = useMemo(() =>
    Array.from({ length: 1000 }, (_, i) => ({ id: i, value: `Элемент ${i}` })), []);

  const handleScaleChange = useCallback((scale: number) => {
    // Настройка виртуализации в зависимости от масштаба
    const itemsToShow = Math.floor(50 / scale);
    setVisibleItems({ start: 0, end: Math.min(itemsToShow, allItems.length) });
  }, [allItems.length]);

  return (
    <div className="optimized-zoom">
      <div className="performance-controls">
        <button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'Скрыть' : 'Показать'}
{' '}
контент
        </button>
        <span>
Показано
{visibleItems.end - visibleItems.start}
{' '}
из
{allItems.length}
{' '}
элементов
        </span>
      </div>

      {isVisible && (
        <div className="zoom-viewport" style={{ height: '400px' }}>
          <Zoom
            fitWidth
            maxScale={2}
            minScale={0.1}
            onScaleChange={handleScaleChange}
          >
            <div ref={contentRef} className="large-content">
              {allItems.slice(visibleItems.start, visibleItems.end).map(item => (
                <div key={item.id} className="content-item">
                  {item.value}
                </div>
              ))}
            </div>
          </Zoom>
        </div>
      )}
    </div>
  );
}
```

## Лучшие практики

### 1. Выбирайте подходящие границы масштаба
Устанавливайте значимые минимальные и максимальные значения масштаба:

```tsx
// Хорошо: Логичные границы для различных типов контента
<Zoom maxScale={3} minScale={0.5}>     {/* Изображения */}
<Zoom maxScale={2} minScale={0.1}>     {/* Диаграммы */}
<Zoom maxScale={1.5} minScale={0.8}>   {/* Текстовый контент */}

// Избегайте: Чрезмерные границы, которые ухудшают UX
<Zoom maxScale={10} minScale={0.01}>   {/* Слишком экстремально */}
```

### 2. Предоставляйте визуальную обратную связь о масштабе
Всегда показывайте пользователям текущий уровень масштаба:

```tsx
<div className="scale-indicator">
  Масштаб:
{' '}
{(currentScale * 100).toFixed(0)}
%
</div>;
```

### 3. Изящно обрабатывайте изменение размера контейнера
Убедитесь, что масштабирование адаптируется к изменениям контейнера:

```tsx
// Компонент автоматически обрабатывает это с помощью ResizeObserver
// Но вы можете предоставить дополнительную обратную связь
<Zoom
  fitWidth
  onScaleChange={(scale) => {
    console.log(`Адаптирован к новому размеру контейнера: ${scale}`);
  }}
>
```

### 4. Оптимизируйте для сенсорных устройств
Учитывайте дружественные к касанию элементы управления масштабом:

```tsx
const touchDevice = 'ontouchstart' in window;

<Zoom
  fitWidth={touchDevice}
  fitHeight={!touchDevice}
  maxScale={touchDevice ? 2 : 3}
>
```

## Связанные компоненты

// ...existing code...

## Руководство по миграции

### От ручных CSS-трансформаций

**До:**
```tsx
const [scale, setScale] = useState(1);

<div
  style={{
    transform: `scale(${scale})`,
    transformOrigin: 'center center'
  }}
>
  <Content />
</div>;
```

**После:**
```tsx
<Zoom
  scale={scale}
  center
  onScaleChange={setScale}
>
  <Content />
</Zoom>;
```

### От сторонних библиотек масштабирования

**До:**
```tsx
import ZoomLibrary from 'zoom-library';

<ZoomLibrary minZoom={0.1} maxZoom={3}>
  <Content />
</ZoomLibrary>;
```

**После:**
```tsx
<Zoom
  minScale={0.1}
  maxScale={3}
  fitWidth
  center
>
  <Content />
</Zoom>;
```
