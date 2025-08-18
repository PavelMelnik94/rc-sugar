# Компонент Bound

Утилитарный компонент для ограничения числовых значений в заданных границах (мин/макс лимиты). Идеально подходит для прогресс-баров, слайдеров, позиций прокрутки и любых сценариев, требующих ограничения значений с автоматическим обрезанием.

## Описание

Компонент `Bound` предоставляет элегантное решение для обеспечения того, чтобы числовые значения оставались в определенных пределах. Он автоматически обрезает значения, превышающие заданный диапазон, и предоставляет обратные вызовы для мониторинга случаев ограничения значений. Это особенно полезно для UI-компонентов, которые должны отображать ограниченные данные, реализовывать индикаторы прогресса или управлять анимациями на основе прокрутки с лимитами.

## Когда использовать
- **Индикаторы прогресса**: Обеспечение значений прогресса в диапазоне 0-100%
- **Анимации прокрутки**: Ограничение позиций прокрутки для параллакса или анимаций
- **Компоненты слайдеров**: Ограничение значений в допустимых диапазонах
- **Визуализация данных**: Ограничение значений диаграмм до диапазонов отображения
- **Игры**: Ограничение характеристик игрока, полос здоровья или отображения очков
- **Валидация форм**: Обеспечение числовых вводов в допустимых диапазонах
- **Анимационные системы**: Ограничение прогресса анимации или значений времени

## Используемые паттерны
- **Паттерн Render Props**: Предоставляет ограниченное значение через дочернюю функцию
- **Обрезание значений**: Автоматическое ограничение значений в пределах мин/макс границ
- **Уведомления через обратные вызовы**: Опциональный мониторинг событий обрезания
- **Безопасность типов**: Полная поддержка TypeScript для числовых ограничений
- **Оптимизация производительности**: Эффективное сравнение значений и обрезание

## TypeScript типы

```typescript
import { RenderProp } from '../shared/types';

/**
 * Свойства для компонента Bound
 */
interface BoundProps {
  /** Числовое значение для ограничения в пределах границ */
  value: number;

  /** Минимально допустимое значение (включительно) */
  min: number;

  /** Максимально допустимое значение (включительно) */
  max: number;

  /**
   * Функция render prop, которая получает ограниченное значение
   * @param boundedValue - Значение, ограниченное в пределах мин/макс границ
   */
  children: RenderProp<number>;

  /**
   * Опциональный обратный вызов, вызываемый при обрезании значения
   * @param originalValue - Исходное необрезанное значение
   * @param clampedValue - Значение после обрезания
   */
  onClamp?: (originalValue: number, clampedValue: number) => void;
}

/** Тип компонента Bound */
declare const Bound: React.FC<BoundProps> & {
  displayName: string;
};
```

## Примеры использования

### Прогресс-бар с границами

```tsx
import { Bound } from 'ui-magic-core/bound';

function TaskProgress() {
  const [completedTasks, setCompletedTasks] = useState(7);
  const totalTasks = 10;
  const progressPercent = (completedTasks / totalTasks) * 100;

  return (
    <div className="task-progress">
      <h3>Project Progress</h3>
      <Bound
        value={progressPercent}
        min={0}
        max={100}
        onClamp={(original, clamped) => {
          console.warn(`Progress clamped from ${original}% to ${clamped}%`);
        }}
      >
        {boundedProgress => (
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${boundedProgress}%` }}
            />
            <span className="progress-text">
              {Math.round(boundedProgress)}
% Complete
            </span>
          </div>
        )}
      </Bound>

      <div className="task-controls">
        <button onClick={() => setCompletedTasks(prev => prev - 1)}>
          Mark Incomplete
        </button>
        <button onClick={() => setCompletedTasks(prev => prev + 1)}>
          Mark Complete
        </button>
      </div>
    </div>
  );
}
```

### Анимация на основе прокрутки

```tsx
import { Bound } from 'ui-magic-core/bound';

function ParallaxHeader() {
  const [scrollY, setScrollY] = useState(0);
  const maxScrollForEffect = 400; // Animation stops after 400px

  useEffect(() => {
    const scrollHandler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  return (
    <Bound
      value={scrollY}
      min={0}
      max={maxScrollForEffect}
    >
      {(boundedScroll) => {
        const opacity = 1 - (boundedScroll / maxScrollForEffect);
        const translateY = boundedScroll * 0.5;

        return (
          <header
            className="parallax-header"
            style={{
              opacity: Math.max(0.1, opacity),
              transform: `translateY(${translateY}px)`
            }}
          >
            <h1>Parallax Header</h1>
            <p>Scroll down to see the effect</p>
            <div className="scroll-indicator">
              Scroll Progress:
{' '}
{Math.round((boundedScroll / maxScrollForEffect) * 100)}
%
            </div>
          </header>
        );
      }}
    </Bound>
  );
}
```

### Интерактивное управление громкостью

```tsx
import { Bound } from 'ui-magic-core/bound';

function VolumeControl() {
  const [rawVolume, setRawVolume] = useState(75);
  const [volumeWarnings, setVolumeWarnings] = useState<string[]>([]);

  const handleVolumeClamping = (original: number, clamped: number) => {
    if (original > 100) {
      setVolumeWarnings(prev => [
        ...prev,
        `Volume clamped to maximum (${original}% → ${clamped}%)`
      ]);
    }
 else if (original < 0) {
      setVolumeWarnings(prev => [
        ...prev,
        `Volume clamped to minimum (${original}% → ${clamped}%)`
      ]);
    }
  };

  return (
    <div className="volume-control">
      <h3>Audio Volume</h3>

      <Bound
        value={rawVolume}
        min={0}
        max={100}
        onClamp={handleVolumeClamping}
      >
        {boundedVolume => (
          <div className="volume-display">
            <div className="volume-slider">
              <div
                className="volume-fill"
                style={{ width: `${boundedVolume}%` }}
              />
              <div
                className="volume-handle"
                style={{ left: `${boundedVolume}%` }}
              />
            </div>

            <div className="volume-info">
              <span className="volume-value">
{Math.round(boundedVolume)}
%
              </span>
              <span className={`volume-level ${
                boundedVolume > 80
? 'loud'
                : boundedVolume > 40 ? 'medium' : 'quiet'
              }`}
              >
                {boundedVolume > 80
? '🔊'
                 : boundedVolume > 40 ? '🔉' : '🔈'}
              </span>
            </div>
          </div>
        )}
      </Bound>

      <div className="volume-controls">
        <button onClick={() => setRawVolume(0)}>Mute</button>
        <button onClick={() => setRawVolume(prev => prev - 10)}>-10</button>
        <button onClick={() => setRawVolume(prev => prev + 10)}>+10</button>
        <button onClick={() => setRawVolume(100)}>Max</button>
        <button onClick={() => setRawVolume(150)}>⚠️ Overflow Test</button>
      </div>

      {volumeWarnings.length > 0 && (
        <div className="volume-warnings">
          {volumeWarnings.slice(-3).map((warning, index) => (
            <div key={index} className="warning">
              ⚠️
{' '}
{warning}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Игровая полоса здоровья

```tsx
import { Bound } from 'ui-magic-core/bound';

function HealthBar() {
  const [currentHealth, setCurrentHealth] = useState(85);
  const [maxHealth] = useState(100);
  const [damageLog, setDamageLog] = useState<string[]>([]);

  const takeDamage = (amount: number) => {
    setCurrentHealth(prev => prev - amount);
    setDamageLog(prev => [...prev, `Took ${amount} damage`]);
  };

  const heal = (amount: number) => {
    setCurrentHealth(prev => prev + amount);
    setDamageLog(prev => [...prev, `Healed ${amount} HP`]);
  };

  return (
    <div className="health-system">
      <Bound
        value={currentHealth}
        min={0}
        max={maxHealth}
        onClamp={(original, clamped) => {
          if (original > maxHealth) {
            setDamageLog(prev => [...prev, 'Cannot heal above max health']);
          }
 else if (original <= 0) {
            setDamageLog(prev => [...prev, '💀 Player defeated!']);
          }
        }}
      >
        {(boundedHealth) => {
          const healthPercentage = (boundedHealth / maxHealth) * 100;
          const lowHealth = healthPercentage < 25;
          const critical = boundedHealth === 0;

          return (
            <div className={`health-display ${lowHealth ? 'low-health' : ''}`}>
              <div className="health-bar-container">
                <div
                  className={`health-bar ${critical ? 'critical' : ''}`}
                  style={{
                    width: `${healthPercentage}%`,
                    backgroundColor: critical
? '#ff0000'
                                   : lowHealth ? '#ff6600' : '#00ff00'
                  }}
                />
                <div className="health-text">
                  {Math.round(boundedHealth)}
/
{maxHealth}
{' '}
HP
                </div>
              </div>

              {lowHealth && !critical && (
                <div className="health-warning pulse">
                  ⚠️ Low health!
                </div>
              )}

              {critical && (
                <div className="defeat-message">
                  💀 Defeated! Respawn?
                </div>
              )}
            </div>
          );
        }}
      </Bound>

      <div className="health-controls">
        <button onClick={() => takeDamage(10)}>Take 10 damage</button>
        <button onClick={() => takeDamage(25)}>Take 25 damage</button>
        <button onClick={() => heal(15)}>Heal 15 HP</button>
        <button onClick={() => heal(50)}>Big Heal</button>
        <button onClick={() => setCurrentHealth(maxHealth)}>Full Heal</button>
      </div>

      <div className="damage-log">
        <h4>Combat Log</h4>
        {damageLog.slice(-5).map((entry, index) => (
          <div key={index} className="log-entry">
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Визуализация данных с границами

```tsx
import { Bound } from 'ui-magic-core/bound';

function SalesChart() {
  const [salesData] = useState([120, 85, 200, 150, 95, 180, 220]);
  const chartMin = 0;
  const chartMax = 200; // Максимальное отображаемое значение

  return (
    <div className="sales-chart">
      <h3>
Недельные продажи (Макс. отображение: ₽
{chartMax}
тыс.)
      </h3>

      <div className="chart-container">
        {salesData.map((sales, index) => (
          <Bound
            key={index}
            value={sales}
            min={chartMin}
            max={chartMax}
            onClamp={(original, clamped) => {
              if (original > chartMax) {
                console.log(`Данные продаж ограничены до ${chartMax}тыс. (фактически: ${original}тыс.)`);
              }
            }}
          >
            {(boundedSales) => {
              const barHeight = (boundedSales / chartMax) * 100;
              const exceedsLimit = sales > chartMax;

              return (
                <div className="chart-bar-container">
                  <div
                    className={`chart-bar ${exceedsLimit ? 'exceeds-limit' : ''}`}
                    style={{ height: `${barHeight}%` }}
                  />
                  <div className="bar-label">
                    День
{' '}
{index + 1}
                  </div>
                  <div className="bar-value">
                    ₽
{boundedSales}
тыс.
{exceedsLimit && <span className="overflow">📈</span>}
                  </div>
                </div>
              );
            }}
          </Bound>
        ))}
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="normal-bar"></span>
          Нормальный диапазон (0-₽
{chartMax}
тыс.)
        </div>
        <div className="legend-item">
          <span className="overflow-bar"></span>
          Значения выше лимита
        </div>
      </div>
    </div>
  );
}
```

## Расширенная конфигурация

### Динамические границы

```tsx
function DynamicBounds() {
  const [userLevel, setUserLevel] = useState(5);
  const [points, setPoints] = useState(150);

  // Границы изменяются в зависимости от уровня пользователя
  const maxPoints = userLevel * 100;
  const minPoints = 0;

  return (
    <Bound
      value={points}
      min={minPoints}
      max={maxPoints}
      onClamp={(original, clamped) => {
        notifyUser(`Очки скорректированы до лимитов уровня ${userLevel}`);
      }}
    >
      {boundedPoints => (
        <div className="dynamic-points">
          <h3>
Игрок
{userLevel}
{' '}
уровня
          </h3>
          <div className="points-display">
            Очки:
{' '}
{boundedPoints}
/
{maxPoints}
          </div>
          <div className="level-controls">
            <button onClick={() => setUserLevel(prev => prev + 1)}>
              Повысить уровень
            </button>
            <button onClick={() => setPoints(prev => prev + 50)}>
              Добавить очки
            </button>
          </div>
        </div>
      )}
    </Bound>
  );
}
```

### Множественные границы с композицией

```tsx
function MultilayerBounds() {
  const [rawValue, setRawValue] = useState(250);

  return (
    <Bound value={rawValue} min={0} max={200}>
      {boundedLevel1 => (
        <Bound value={boundedLevel1} min={50} max={150}>
          {boundedLevel2 => (
            <div className="multilayer-display">
              <div>
Исходное:
{rawValue}
              </div>
              <div>
Уровень 1 (0-200):
{boundedLevel1}
              </div>
              <div>
Уровень 2 (50-150):
{boundedLevel2}
              </div>

              <div className="value-controls">
                <input
                  type="range"
                  min={-50}
                  max={300}
                  value={rawValue}
                  onChange={e => setRawValue(Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </Bound>
      )}
    </Bound>
  );
}
```

### Границы с анимацией

```tsx
function AnimatedBounds() {
  const [targetValue, setTargetValue] = useState(75);
  const [animatedValue, setAnimatedValue] = useState(75);

  // Анимация к ограниченному целевому значению
  useEffect(() => {
    const animate = () => {
      setAnimatedValue((prev) => {
        const difference = targetValue - prev;
        if (Math.abs(difference) < 0.1)
return targetValue;
        return prev + difference * 0.1;
      });
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [targetValue]);

  return (
    <Bound
      value={animatedValue}
      min={0}
      max={100}
    >
      {boundedValue => (
        <div className="animated-progress">
          <div
            className="progress-bar animated"
            style={{
              width: `${boundedValue}%`,
              transition: 'width 0.016s ease-out'
            }}
          />
          <div className="controls">
            <button onClick={() => setTargetValue(0)}>0%</button>
            <button onClick={() => setTargetValue(50)}>50%</button>
            <button onClick={() => setTargetValue(100)}>100%</button>
            <button onClick={() => setTargetValue(150)}>150% (Тест)</button>
          </div>
        </div>
      )}
    </Bound>
  );
}
```

## Соображения производительности

### Оптимизация частых обновлений

```tsx
// Отложенные быстрые изменения значений
function OptimizedBounds() {
  const [value, setValue] = useState(50);
  const debouncedValue = useDebounce(value, 100);

  return (
    <Bound
      value={debouncedValue}
      min={0}
      max={100}
      onClamp={useCallback((original, clamped) => {
        // Логирование только когда отложенное значение обрезается
        console.log(`Отложенное обрезание: ${original} → ${clamped}`);
      }, [])}
    >
      {boundedValue => (
        <div className="optimized-display">
          <div>
Текущее:
{value}
          </div>
          <div>
Отложенное и ограниченное:
{boundedValue}
          </div>
          <input
            type="range"
            min={-20}
            max={120}
            value={value}
            onChange={e => setValue(Number(e.target.value))}
          />
        </div>
      )}
    </Bound>
  );
}
```

### Мемоизация для сложных дочерних элементов

```tsx
function MemoizedBoundsDisplay() {
  const [value, setValue] = useState(75);

  const ExpensiveChart = useMemo(() =>
    ({ boundedValue }: { boundedValue: number }) => (
      <div className="expensive-chart">
        {/* Сложное отображение диаграммы */}
        <svg width="200" height="100">
          <rect
            width={boundedValue * 2}
            height="20"
            fill="#4CAF50"
          />
        </svg>
      </div>
    ), []);

  return (
    <Bound value={value} min={0} max={100}>
      {boundedValue => (
        <ExpensiveChart boundedValue={boundedValue} />
      )}
    </Bound>
  );
}
```

## Обработка ошибок и крайних случаев

### Обнаружение недопустимых границ

```tsx
function SafeBounds() {
  const [value, setValue] = useState(50);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);

  // Ensure valid bounds
  const validMin = Math.min(min, max);
  const validMax = Math.max(min, max);
  const boundsValid = validMin <= validMax;

  if (!boundsValid) {
    return (
      <div className="error-state">
        ⚠️ Недопустимые границы: min (
{min}
) не может быть больше max (
{max}
)
      </div>
    );
  }

  return (
    <Bound
      value={value}
      min={validMin}
      max={validMax}
      onClamp={(original, clamped) => {
        console.log(`Значение обрезано: ${original} → ${clamped}`);
      }}
    >
      {boundedValue => (
        <div className="safe-bounds">
          <div>
Значение:
{boundedValue}
          </div>
          <div>
Диапазон:
{validMin}
{' '}
-
{validMax}
          </div>

          <div className="bounds-controls">
            <label>
              Min:
              <input
                type="number"
                value={min}
                onChange={e => setMin(Number(e.target.value))}
              />
            </label>
            <label>
              Max:
              <input
                type="number"
                value={max}
                onChange={e => setMax(Number(e.target.value))}
              />
            </label>
            <label>
              Value:
              <input
                type="number"
                value={value}
                onChange={e => setValue(Number(e.target.value))}
              />
            </label>
          </div>
        </div>
      )}
    </Bound>
  );
}
```

## Лучшие практики

### 1. Выбирайте подходящие границы
Выбирайте значимые минимальные и максимальные значения в зависимости от вашего случая использования:

```tsx
// Хорошо: Логичные границы
<Bound value={процент} min={0} max={100} />
<Bound value={прозрачность} min={0} max={1} />
<Bound value={громкость} min={0} max={100} />

// Избегайте: Произвольные или слишком ограничительные границы
<Bound value={возрастПользователя} min={0} max={50} /> // Почему макс 50?
<Bound value={цена} min={99.99} max={100.01} /> // Слишком ограничительно
```

### 2. Предоставляйте обратную связь пользователю
Всегда информируйте пользователей, когда значения обрезаются:

```tsx
const [сообщение, setСообщение] = useState('');

<Bound
  value={вводПользователя}
  min={0}
  max={100}
  onClamp={(исходное, обрезанное) => {
    setСообщение(`Значение скорректировано с ${исходное} до ${обрезанное}`);
    setTimeout(() => setСообщение(''), 3000);
  }}
>
  {/* UI контент */}
</Bound>;

{ сообщение && <div className="сообщение-обрезания">{сообщение}</div>; }
```

### 3. Изящно обрабатывайте крайние случаи
Учитывайте, что происходит с недопустимыми входными данными:

```tsx
const безопасныеГраницы = useMemo(() => ({
  min: Math.min(минВвод, максВвод),
  max: Math.max(минВвод, максВвод),
  value: isFinite(значениеВвод) ? значениеВвод : 0
}), [минВвод, максВвод, значениеВвод]);
```

### 4. Используйте семантический HTML
Улучшайте доступность с помощью правильных ARIA атрибутов:

```tsx
<Bound value={прогресс} min={0} max={100}>
  {ограниченный => (
    <div
      role="progressbar"
      aria-valuenow={ограниченный}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Прогресс выполнения задачи"
    >
      {/* UI прогресса */}
    </div>
  )}
</Bound>;
```

## Связанные компоненты

- [`validate`](../validate/README.ru.md) - Валидация ввода, которая может работать с границами
- [`gesture-pad`](../gesture-pad/README.ru.md) - Сенсорные жесты, которые могут нуждаться в границах
- [`scroll`](../scroll/README.ru.md) - Позиции прокрутки, которые можно ограничить
- [`zoom`](../zoom/README.ru.md) - Уровни масштабирования, нуждающиеся в мин/макс ограничениях

## Руководство по миграции

### От ручного обрезания

**До:**
```tsx
const обрезанноеЗначение = Math.min(Math.max(значение, мин), макс);

if (обрезанноеЗначение !== значение) {
  console.log('Значение было обрезано');
}

return <ПолосаПрогресса value={обрезанноеЗначение} />;
```

**После:**
```tsx
<Bound
  value={значение}
  min={мин}
  max={макс}
  onClamp={(исходное, обрезанное) => {
    console.log('Значение было обрезано');
  }}
>
  {ограниченноеЗначение => <ПолосаПрогресса value={ограниченноеЗначение} />}
</Bound>;
```

### От Lodash Clamp

**До:**
```tsx
import { clamp } from 'lodash';

const ограниченноеЗначение = clamp(значение, мин, макс);
return <Компонент value={ограниченноеЗначение} />;
```

**После:**
```tsx
<Bound value={значение} min={мин} max={макс}>
  {ограниченноеЗначение => <Компонент value={ограниченноеЗначение} />}
</Bound>;
```
