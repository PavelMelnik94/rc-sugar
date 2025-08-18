# Компонент Experiment

Мощный компонент для A/B тестирования и управления флагами функций в React приложениях с взвешенным распределением вариантов, воспроизводимой рандомизацией и комплексной интеграцией с аналитикой.

## Описание

Компонент `Experiment` предоставляет сложное решение для A/B тестирования и экспериментов с функциями. Он обрабатывает выбор вариантов на основе настраиваемых весов, обеспечивает последовательный пользовательский опыт с рандомизацией на основе seed и бесшовно интегрируется с платформами аналитики для отслеживания экспериментов.

## Когда использовать
- 🧪 **A/B тестирование**: Тестирование различных UI дизайнов, контента или функциональности
- 🎯 **Флаги функций**: Постепенное развёртывание новых функций для сегментов пользователей
- 📊 **Многовариантное тестирование**: Тестирование множественных вариантов с разными весами
- 🎲 **Рандомизированные опыты**: Предоставление разных опытов пользователям
- 🔄 **Итеративные улучшения**: Тестирование улучшений против текущих реализаций
- 📈 **Оптимизация конверсии**: Оптимизация пользовательских потоков и интерфейсов
- 🚀 **Развёртывание функций**: Безопасное развёртывание функций для процента пользователей

## Используемые паттерны
- **Взвешенное распределение**: Настраиваемые веса для выбора вариантов
- **Детерминированная рандомизация**: Последовательные опыты с использованием seed значений
- **Паттерн render props**: Гибкий рендеринг контента с информацией о варианте
- **Интеграция с аналитикой**: Встроенное отслеживание участия в экспериментах
- **Типобезопасность**: Полная поддержка TypeScript с правильной типизацией вариантов
- **Управление ресурсами**: Оптимизированный выбор вариантов с мемоизацией

## TypeScript типы
```typescript
import { ReactNode } from 'react';
import { RenderProp } from '../shared/types';

/**
 * Определение варианта для A/B тестирования
 */
interface ExperimentVariant {
  /** Имя/идентификатор варианта */
  name: string;

  /** Вес для этого варианта (0-100) */
  weight: number;

  /** Контент для рендеринга для этого варианта */
  content: ReactNode | RenderProp<string>;
}

/**
 * Пропсы для компонента Experiment
 */
interface ExperimentProps {
  /** Уникальный идентификатор эксперимента */
  id: string;

  /** Массив вариантов для тестирования */
  variants: ExperimentVariant[];

  /** Seed для воспроизводимой рандомизации (например, ID пользователя) */
  seed?: string | number;

  /** Колбэк при выборе варианта */
  onVariantSelected?: (variantName: string) => void;
}

/** Тип render prop */
type RenderProp<T> = (data: T) => React.ReactNode;
```

## Справочник API

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `id` | `string` | - | **Обязательный.** Уникальный идентификатор эксперимента |
| `variants` | `ExperimentVariant[]` | - | **Обязательный.** Массив вариантов с весами и контентом |
| `seed` | `string \| number` | `undefined` | Seed для последовательной рандомизации (например, ID пользователя) |
| `onVariantSelected` | `(variantName: string) => void` | `undefined` | Колбэк, вызываемый при выборе варианта |

### Свойства ExperimentVariant

| Свойство | Тип | Описание |
|----------|-----|----------|
| `name` | `string` | Уникальный идентификатор варианта |
| `weight` | `number` | Относительный вес (0-100) для вероятности выбора |
| `content` | `ReactNode \| RenderProp<string>` | Контент для рендеринга или функция рендеринга |

## Примеры

### Базовый A/B тест
```tsx
import { Experiment } from 'react-utility-kit';

function LoginButton() {
  return (
    <Experiment
      id="login-button-test"
      variants={[
        {
          name: 'control',
          weight: 50,
          content: <button className="btn-primary">Войти</button>
        },
        {
          name: 'treatment',
          weight: 50,
          content: <button className="btn-gradient">Присоединиться</button>
        }
      ]}
      seed={userId}
      onVariantSelected={(variant) => {
        analytics.track('experiment_viewed', {
          experimentId: 'login-button-test',
          variant
        });
      }}
    />
  );
}
```

### Обработка ошибок и валидация
```tsx
import { Experiment } from 'ui-magic-core';

function SafeExperiment() {
  // Компонент автоматически валидирует варианты и обрабатывает ошибки
  return (
    <Experiment
      id="safe-test"
      variants={[
        {
          name: 'variant-a',
          weight: 60,
          content: <div>Контент варианта A</div>
        },
        {
          name: 'variant-b', 
          weight: 40,
          content: <div>Контент варианта B</div>
        }
      ]}
      seed={userId}
      onVariantSelected={(variant) => {
        // Это будет вызвано только если валидация прошла успешно
        console.log('Выбранный вариант:', variant);
      }}
    />
  );
}

// Неверные конфигурации будут логировать ошибки и ничего не рендерить:
// - Пустой массив вариантов
// - Дублирующиеся имена вариантов
// - Неверные веса (отрицательные числа)
// - Нулевой общий вес
```

### Многовариантное тестирование с разными весами
```tsx
import { Experiment } from 'ui-magic-core';

function PricingDisplay({ product }) {
  return (
    <Experiment
      id="pricing-display-test"
      variants={[
        {
          name: 'control',
          weight: 40,
          content: (
            <div className="price-simple">
              <span>
$
{product.price}
              </span>
            </div>
          )
        },
        {
          name: 'with-discount',
          weight: 30,
          content: (
            <div className="price-discount">
              <span className="original">
$
{product.originalPrice}
              </span>
              <span className="sale">
$
{product.price}
              </span>
              <span className="badge">SALE</span>
            </div>
          )
        },
        {
          name: 'urgency',
          weight: 30,
          content: (
            <div className="price-urgency">
              <span>
$
{product.price}
              </span>
              <div className="timer">⏰ Limited time offer!</div>
            </div>
          )
        }
      ]}
      seed={`${userId}-${product.id}`}
      onVariantSelected={(variant) => {
        analytics.track('pricing_variant_shown', {
          productId: product.id,
          variant,
          price: product.price
        });
      }}
    />
  );
}
```

### Флаг функции с постепенным развёртыванием
```tsx
import { Experiment } from 'ui-magic-core';

function NavigationMenu() {
  return (
    <Experiment
      id="new-navigation"
      variants={[
        {
          name: 'old-nav',
          weight: 80,
          content: <OldNavigation />
        },
        {
          name: 'new-nav',
          weight: 20,
          content: <NewNavigation />
        }
      ]}
      seed={userId}
      onVariantSelected={(variant) => {
        if (variant === 'new-nav') {
          analytics.track('feature_flag_enabled', {
            feature: 'new-navigation',
            userId
          });
        }
      }}
    />
  );
}
```

### Паттерн Render Props
```tsx
import { Experiment } from 'ui-magic-core';

function CheckoutFlow() {
  return (
    <Experiment
      id="checkout-flow-test"
      variants={[
        {
          name: 'single-page',
          weight: 50,
          content: variant => (
            <div data-variant={variant}>
              <SinglePageCheckout />
            </div>
          )
        },
        {
          name: 'multi-step',
          weight: 50,
          content: variant => (
            <div data-variant={variant}>
              <MultiStepCheckout />
            </div>
          )
        }
      ]}
      seed={sessionId}
      onVariantSelected={(variant) => {
        analytics.track('checkout_experiment', {
          variant,
          sessionId,
          timestamp: Date.now()
        });
      }}
    />
  );
}
```

### Рекомендации товаров в e-commerce
```tsx
import { Experiment } from 'ui-magic-core';

function ProductRecommendations({ userId, currentProduct }) {
  return (
    <Experiment
      id="recommendation-algorithm"
      variants={[
        {
          name: 'collaborative',
          weight: 25,
          content: <CollaborativeRecommendations userId={userId} />
        },
        {
          name: 'content-based',
          weight: 25,
          content: <ContentBasedRecommendations product={currentProduct} />
        },
        {
          name: 'hybrid',
          weight: 30,
          content: <HybridRecommendations userId={userId} product={currentProduct} />
        },
        {
          name: 'trending',
          weight: 20,
          content: <TrendingRecommendations />
        }
      ]}
      seed={userId}
      onVariantSelected={(variant) => {
        analytics.track('recommendation_algorithm_assigned', {
          algorithm: variant,
          userId,
          productId: currentProduct.id
        });
      }}
    />
  );
}
```

### Героическая секция лендинга
```tsx
import { Experiment } from 'react-utility-kit';

function HeroSection() {
  return (
    <Experiment
      id="hero-message-test"
      variants={[
        {
          name: 'benefit-focused',
          weight: 33,
          content: (
            <div className="hero-benefits">
              <h1>Экономьте время и деньги</h1>
              <p>Наша платформа поможет вам достичь большего с меньшими усилиями</p>
              <button>Начать экономить</button>
            </div>
          )
        },
        {
          name: 'feature-focused',
          weight: 33,
          content: (
            <div className="hero-features">
              <h1>Мощные инструменты для всех</h1>
              <p>Продвинутые функции, сделанные простыми и доступными</p>
              <button>Изучить функции</button>
            </div>
          )
        },
        {
          name: 'social-proof',
          weight: 34,
          content: (
            <div className="hero-social">
              <h1>Присоединяйтесь к 10 000+ довольных пользователей</h1>
              <p>Узнайте, почему команды по всему миру выбирают нашу платформу</p>
              <button>Присоединиться к сообществу</button>
            </div>
          )
        }
      ]}
      seed={visitorId}
      onVariantSelected={(variant) => {
        analytics.track('hero_variant_shown', {
          variant,
          visitorId,
          page: 'landing'
        });
      }}
    />
  );
}
```

### Мобильные против десктопных опытов
```tsx
import { Experiment } from 'ui-magic-core';

function ResponsiveFeature() {
  const isMobile = window.innerWidth < 768;

  return (
    <Experiment
      id="mobile-feature-test"
      variants={[
        {
          name: 'simplified',
          weight: isMobile ? 60 : 30,
          content: <SimplifiedInterface />
        },
        {
          name: 'full-featured',
          weight: isMobile ? 40 : 70,
          content: <FullFeaturedInterface />
        }
      ]}
      seed={`${userId}-${isMobile ? 'mobile' : 'desktop'}`}
      onVariantSelected={(variant) => {
        analytics.track('responsive_experiment', {
          variant,
          deviceType: isMobile ? 'mobile' : 'desktop',
          userId
        });
      }}
    />
  );
}
```

## Соображения производительности

### 🚀 **Оптимизации**
- **Мемоизированный выбор**: Выбор варианта мемоизирован для предотвращения пересчёта
- **Детерминированная рандомизация**: Последовательные результаты при использовании seeds
- **Лёгкая хеш-функция**: Быстрое вычисление хеша для выбора на основе seed
- **Минимальные ре-рендеры**: Оптимизирован для избежания ненужных обновлений компонента

### ⚠️ **Соображения**
- **Начальный рендер**: Выбор варианта происходит во время начального рендера
- **Последовательность seed**: Изменение seed приведёт к другому выбору варианта
- **Распределение весов**: Убедитесь, что веса складываются в разумные итоги

```tsx
// Хорошо: Последовательный seed для пользовательского опыта
<Experiment
  id="test"
  seed={userId} // Последовательный во всех сессиях
  variants={варианты}
/>;

// Хорошо: Разумное распределение весов
const variants = [
  { name: 'A', weight: 50, content: <ComponentA /> },
  { name: 'B', weight: 50, content: <ComponentB /> }
];

// Избегайте: Изменяющиеся seeds
<Experiment
  id="test"
  seed={Math.random()} // Разный при каждом рендере!
  variants={variants}
/>;
```

## Лучшие практики

### ✅ **Рекомендуется**
- Использовать последовательные seeds (ID пользователя, ID сессии) для стабильных опытов
- Реализовать правильное отслеживание аналитики в `onVariantSelected`
- Держать ID экспериментов описательными и уникальными
- Тестировать веса вариантов с адекватными размерами выборки
- Планировать статистическую значимость в продолжительности эксперимента
- Документировать гипотезы экспериментов и метрики успеха

### ❌ **Избегать**
- Изменения ID экспериментов во время активных тестов
- Использования случайных seeds, которые меняются при каждом рендере
- Проведения слишком много одновременных экспериментов без должного анализа
- Игнорирования статистической значимости в результатах
- Тестирования без ясных метрик успеха

## Руководство по миграции

### Из ручного A/B тестирования
```tsx
// До: Ручная логика A/B тестирования
function FeatureToggle() {
  const [variant, setVariant] = useState();

  useEffect(() => {
    const random = Math.random();
    setVariant(random < 0.5 ? 'A' : 'B');

    analytics.track('ab_test', { variant });
  }, []);

  return variant === 'A' ? <ComponentA /> : <ComponentB />;
}

// После: Использование компонента Experiment
function FeatureToggle() {
  return (
    <Experiment
      id="feature-test"
      variants={[
        { name: 'A', weight: 50, content: <ComponentA /> },
        { name: 'B', weight: 50, content: <ComponentB /> }
      ]}
      seed={userId}
      onVariantSelected={(variant) => {
        analytics.track('ab_test', { variant });
      }}
    />
  );
}
```

### Из флагов функций
```tsx
// До: Простые флаги функций
function ConditionalFeature() {
  const showNewFeature = featureFlags.includes('new-feature');

  return showNewFeature ? <NewFeature /> : <OldFeature />;
}

// После: Постепенное развёртывание с экспериментами
function ConditionalFeature() {
  return (
    <Experiment
      id="new-feature-rollout"
      variants={[
        { name: 'old', weight: 80, content: <OldFeature /> },
        { name: 'new', weight: 20, content: <NewFeature /> }
      ]}
      seed={userId}
      onVariantSelected={(variant) => {
        if (variant === 'new') {
          analytics.track('new_feature_shown', { userId });
        }
      }}
    />
  );
}
```

## Связанные компоненты

- **[`gate`](../gate/README.ru.md)** - Целевое направление аудитории и условный рендеринг
- **[`track`](../track/README.ru.md)** - Отслеживание аналитики и управление событиями
- **[`switch`](../switch/README.ru.md)** - Условный рендеринг с множественными случаями

## Доступность

Компонент `Experiment` нейтрален к доступности, поскольку он не рендерит UI элементы напрямую. Однако убедитесь, что все варианты поддерживают последовательные стандарты доступности:

### Последовательный опыт
- Поддерживайте похожие паттерны взаимодействия между вариантами
- Убедитесь, что все варианты соответствуют руководящим принципам WCAG
- Тестируйте варианты с вспомогательными технологиями

```tsx
<Experiment
  id="button-test"
  variants={[
    {
      name: 'control',
      weight: 50,
      content: (
        <button aria-label="Войти в ваш аккаунт">
          Войти
        </button>
      )
    },
    {
      name: 'treatment',
      weight: 50,
      content: (
        <button aria-label="Присоединиться к нашей платформе сегодня">
          Присоединиться
        </button>
      )
    }
  ]}
/>;
```

## Интеграция с аналитикой

### Отслеживание экспериментов
```tsx
function ExperimentWithAnalytics() {
  return (
    <Experiment
      id="conversion-test"
      variants={variants}
      seed={userId}
      onVariantSelected={(variant) => {
        // Отслеживание участия в эксперименте
        analytics.track('experiment_participated', {
          experimentId: 'conversion-test',
          variant,
          userId,
          timestamp: Date.now()
        });

        // Обновление свойств пользователя
        analytics.setUserProperties({
          [`experiment_conversion_test`]: variant
        });
      }}
    />
  );
}
```

### Отслеживание конверсии
```tsx
function ExperimentWithConversion() {
  const handleConversion = (variant) => {
    analytics.track('experiment_conversion', {
      experimentId: 'checkout-flow',
      variant,
      conversionType: 'purchase',
      value: cartTotal
    });
  };

  return (
    <Experiment
      id="checkout-flow"
      variants={variants}
      seed={userId}
      onVariantSelected={(variant) => {
        // Сохранение варианта для последующего отслеживания конверсии
        window.currentExperimentVariant = variant;
      }}
    />
  );
}
```
