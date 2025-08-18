# Компонент Focus

Мощный утилитарный компонент для управления состоянием фокуса и поведением в React приложениях, предоставляющий расширенное управление фокусом, функции доступности и бесшовную интеграцию с паттернами клавиатурной навигации.

## Описание

Компонент `Focus` предлагает комплексное решение для отслеживания, контроля и реагирования на события фокуса в современных React приложениях. Он предоставляет паттерн render props, который дает вам полный контроль над поведением фокуса, сохраняя при этом стандарты доступности и обеспечивая сложные рабочие процессы клавиатурной навигации.

Созданный с принципами accessibility-first, этот компонент помогает создавать интуитивные пользовательские интерфейсы как для пользователей мыши, так и для пользователей клавиатуры, поддерживая захват фокуса, автоматическое управление фокусом и сложные переходы состояний фокуса.

## Когда использовать

- **Улучшение доступности** для сложных UI компонентов
- **Клавиатурная навигация** в формах и интерактивных элементах
- **Управление фокусом** в модальных окнах, выпадающих списках и оверлеях
- **Визуальная обратная связь** для состояний фокуса и интерактивных элементов
- **Подсветка полей формы** и индикация состояния валидации
- **Пользовательские компоненты ввода**, требующие поведения фокуса
- **Интерфейсы дашбордов** с горячими клавишами
- **Игровой UI** или интерфейсы приложений с управлением клавиатурой
- **Автокомплит** и поисковые выпадающие списки
- **Последовательности табуляции** и управление захватом фокуса

## Как это работает

Компонент `Focus` использует React хуки для отслеживания событий фокуса и блюра, поддерживая внутреннее состояние и предоставляя обработчики событий через render props. Он автоматически управляет переходами фокуса и предоставляет чистый API для реагирования на изменения фокуса без ручного управления слушателями событий.

Компонент поддерживает как контролируемое, так и неконтролируемое поведение фокуса, что делает его подходящим для различных случаев использования от простых индикаторов фокуса до сложных систем управления фокусом.

## Используемые паттерны

- **Render Props Pattern**: Предоставляет состояние фокуса и обработчики событий дочерним элементам
- **Controlled Component Pattern**: Позволяет внешний контроль состояния фокуса
- **Hook-based State Management**: Использует React хуки для эффективного отслеживания состояния
- **Event Handler Composition**: Объединяет события фокуса с пользовательскими обработчиками
- **Accessibility Pattern**: Следует рекомендациям WCAG для управления фокусом
- **Type Safety**: Полная поддержка TypeScript с комплексными определениями типов

## TypeScript типы

```typescript
/**
 * Пропы для компонента Focus
 */
interface FocusProps {
  /**
   * Render функция, которая получает состояние фокуса и обработчики событий
   * @param focused - Текущее состояние фокуса
   * @param bind - Объект, содержащий обработчики onFocus и onBlur
   * @param ref - Ref объект для фокусируемого элемента
   */
  children: (
    focused: boolean,
    bind: {
      onFocus: (event: React.FocusEvent) => void;
      onBlur: (event: React.FocusEvent) => void;
    },
    ref: React.RefObject<HTMLElement>
  ) => React.ReactNode;

  /**
   * Начальное состояние фокуса
   * @default false
   */
  defaultFocused?: boolean;

  /**
   * Контролируемое состояние фокуса
   */
  focused?: boolean;

  /**
   * Коллбэк, вызываемый при изменении состояния фокуса
   */
  onFocusChange?: (focused: boolean, event: React.FocusEvent) => void;

  /**
   * Коллбэк, вызываемый когда элемент получает фокус
   */
  onFocus?: (event: React.FocusEvent) => void;

  /**
   * Коллбэк, вызываемый когда элемент теряет фокус
   */
  onBlur?: (event: React.FocusEvent) => void;

  /**
   * Автоматический фокус элемента при монтировании
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Предотвратить поведение фокуса по умолчанию
   * @default false
   */
  preventScroll?: boolean;

  /**
   * Задержка фокуса в миллисекундах
   * @default 0
   */
  focusDelay?: number;

  /**
   * Задержка блюра в миллисекундах
   * @default 0
   */
  blurDelay?: number;
}

/**
 * Объект состояния фокуса
 */
interface FocusState {
  focused: boolean;
  lastFocusTime: number;
  lastBlurTime: number;
  focusCount: number;
}

/**
 * Обработчики событий фокуса
 */
interface FocusHandlers {
  onFocus: (event: React.FocusEvent) => void;
  onBlur: (event: React.FocusEvent) => void;
  focus: () => void;
  blur: () => void;
}
```

## Справочник API

### Пропы компонента Focus

| Проп | Тип | Обязательный | По умолчанию | Описание |
|------|-----|--------------|--------------|----------|
| `children` | `(focused: boolean, bind: FocusHandlers, ref: RefObject) => ReactNode` | ✅ | - | Render функция, получающая состояние фокуса и обработчики |
| `defaultFocused` | `boolean` | ❌ | `false` | Начальное состояние фокуса для неконтролируемого использования |
| `focused` | `boolean` | ❌ | - | Контролируемое состояние фокуса |
| `onFocusChange` | `(focused: boolean, event: FocusEvent) => void` | ❌ | - | Коллбэк, вызываемый при изменении состояния фокуса |
| `onFocus` | `(event: FocusEvent) => void` | ❌ | - | Коллбэк, вызываемый когда элемент получает фокус |
| `onBlur` | `(event: FocusEvent) => void` | ❌ | - | Коллбэк, вызываемый когда элемент теряет фокус |
| `autoFocus` | `boolean` | ❌ | `false` | Автоматический фокус элемента при монтировании |
| `preventScroll` | `boolean` | ❌ | `false` | Предотвратить прокрутку при фокусировке |
| `focusDelay` | `number` | ❌ | `0` | Задержка перед событиями фокуса (мс) |
| `blurDelay` | `number` | ❌ | `0` | Задержка перед событиями блюра (мс) |

### Параметры Render Prop

| Параметр | Тип | Описание |
|----------|-----|----------|
| `focused` | `boolean` | Текущее состояние фокуса |
| `bind` | `FocusHandlers` | Обработчики событий и утилитарные функции |
| `ref` | `RefObject<HTMLElement>` | Ref для фокусируемого элемента |

## Примеры

### Базовый индикатор фокуса
```tsx
import { Focus } from 'ui-magic-core';

function BasicInput() {
  return (
    <Focus>
      {(focused, bind) => (
        <input
          {...bind}
          placeholder="Введите здесь..."
          style={{
            borderColor: focused ? '#007acc' : '#ccc',
            boxShadow: focused ? '0 0 0 2px rgba(0, 122, 204, 0.3)' : 'none',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
        />
      )}
    </Focus>
  );
}
```

### Расширенное поле формы с состояниями фокуса
```tsx
import { Focus } from 'ui-magic-core';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
}

function FormField({ label, error, required }: FormFieldProps) {
  return (
    <Focus onFocusChange={focused => console.log('Фокус изменен:', focused)}>
      {(focused, bind, ref) => (
        <div className={`form-field ${focused ? 'focused' : ''} ${error ? 'error' : ''}`}>
          <label
            htmlFor={`field-${label}`}
            className={`form-label ${focused ? 'active' : ''}`}
          >
            {label}
{' '}
{required && <span className="required">*</span>}
          </label>

          <input
            {...bind}
            ref={ref}
            id={`field-${label}`}
            className="form-input"
            aria-invalid={!!error}
            aria-describedby={error ? `${label}-error` : undefined}
          />

          {error && (
            <span id={`${label}-error`} className="error-message" role="alert">
              {error}
            </span>
          )}

          <div className={`focus-indicator ${focused ? 'visible' : ''}`} />
        </div>
      )}
    </Focus>
  );
}
```

### Поисковый ввод с поведением фокуса
```tsx
import { useState } from 'react';
import { Focus } from 'ui-magic-core';

function SearchInput() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  return (
    <Focus
      onFocus={() => setSuggestions(['React', 'TypeScript', 'JavaScript'])}
      onBlur={() => setTimeout(() => setSuggestions([]), 150)}
    >
      {(focused, bind) => (
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              {...bind}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Поиск компонентов..."
              className={`search-input ${focused ? 'focused' : ''}`}
            />
            <span className={`search-icon ${focused ? 'active' : ''}`}>
              🔍
            </span>
          </div>

          {focused && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions
                .filter(s => s.toLowerCase().includes(query.toLowerCase()))
                .map((suggestion, index) => (
                  <div
                    key={suggestion}
                    className="suggestion-item"
                    onClick={() => setQuery(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </Focus>
  );
}
```

### Кастомная кнопка с управлением фокусом
```tsx
import { Focus } from 'ui-magic-core';

interface ActionButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ActionButton({ variant, disabled, onClick, children }: ActionButtonProps) {
  return (
    <Focus autoFocus={variant === 'primary'}>
      {(focused, bind) => (
        <button
          {...bind}
          onClick={onClick}
          disabled={disabled}
          className={`
            action-button
            action-button--${variant}
            ${focused ? 'action-button--focused' : ''}
            ${disabled ? 'action-button--disabled' : ''}
          `}
          aria-pressed={focused}
        >
          {children}
          {focused && <span className="focus-ring" />}
        </button>
      )}
    </Focus>
  );
}
```

### Модальное окно с захватом фокуса
```tsx
import { useEffect, useRef } from 'react';
import { Focus } from 'ui-magic-core';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Захват фокуса внутри модального окна
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements?.length) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  if (!isOpen)
return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <Focus autoFocus>
        {(focused, bind) => (
          <div
            {...bind}
            ref={modalRef}
            className={`modal ${focused ? 'modal--focused' : ''}`}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <header className="modal-header">
              <h2 id="modal-title">{title}</h2>
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="Закрыть модальное окно"
              >
                ×
              </button>
            </header>

            <div className="modal-content">
              {children}
            </div>

            <footer className="modal-footer">
              <button onClick={onClose}>Отмена</button>
              <button className="primary">Подтвердить</button>
            </footer>
          </div>
        )}
      </Focus>
    </div>
  );
}
```

### Доступное меню навигации
```tsx
import { useRef, useState } from 'react';
import { Focus } from 'ui-magic-core';

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  children?: MenuItem[];
}

function NavigationMenu({ items }: { items: MenuItem[] }) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <nav role="navigation" aria-label="Основная навигация">
      <ul className="nav-menu">
        {items.map(item => (
          <li key={item.id} className="nav-item">
            <Focus
              onFocusChange={(focused) => {
                if (focused)
setActiveItem(item.id);
              }}
            >
              {(focused, bind) => (
                <a
                  {...bind}
                  href={item.href}
                  className={`
                    nav-link
                    ${focused ? 'nav-link--focused' : ''}
                    ${activeItem === item.id ? 'nav-link--active' : ''}
                  `}
                  role="menuitem"
                  tabIndex={focused ? 0 : -1}
                >
                  {item.label}
                  {focused && <span className="focus-indicator" />}
                </a>
              )}
            </Focus>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### Отслеживание фокуса для аналитики
```tsx
import { Focus } from 'ui-magic-core';
import { useAnalytics } from './hooks/useAnalytics';

function AnalyticsButton({ trackingId, children }: { trackingId: string; children: React.ReactNode }) {
  const { track } = useAnalytics();

  return (
    <Focus
      onFocus={(event) => {
        track('button_focused', {
          trackingId,
          focusMethod: event.nativeEvent.isTrusted ? 'keyboard' : 'programmatic',
          timestamp: Date.now()
        });
      }}
      onBlur={(event) => {
        track('button_blurred', {
          trackingId,
          blurReason: event.relatedTarget ? 'next_element' : 'click_outside',
          timestamp: Date.now()
        });
      }}
    >
      {(focused, bind) => (
        <button
          {...bind}
          className={`analytics-button ${focused ? 'focused' : ''}`}
          data-tracking-id={trackingId}
        >
          {children}
          {focused && <span className="focus-analytics-indicator" />}
        </button>
      )}
    </Focus>
  );
}
```

## Соображения производительности

1. **Оптимизация обработчиков событий**: Компонент мемоизирует обработчики событий для предотвращения ненужных ре-рендеров
2. **Батчинг состояния фокуса**: Множественные быстрые события фокуса/блюра батчируются для лучшей производительности
3. **Управление задержками**: Опциональные задержки предотвращают избыточные обновления состояния при быстрых изменениях фокуса
4. **Управление памятью**: Автоматически очищает слушатели событий и таймеры
5. **Оптимизация ref**: Использует стабильные ref объекты для избежания ненужных DOM обновлений

## Лучшие практики

1. **Доступность прежде всего**: Всегда учитывайте клавиатурную навигацию и пользователей скринридеров
2. **Визуальная обратная связь**: Предоставляйте четкие визуальные индикаторы для состояний фокуса
3. **Управление фокусом**: Используйте захват фокуса в модальных окнах и сложных компонентах
4. **Производительность**: Используйте задержки и дебаунсинг для быстрых изменений фокуса
5. **Тестирование**: Тестируйте поведение фокуса с клавиатурной навигацией и ассистивными технологиями
6. **Прогрессивное улучшение**: Убедитесь, что функциональность работает без JavaScript

## Руководство по миграции

### От ручного управления фокусом

**До:**
```tsx
function OldInput() {
  const [focused, setFocused] = useState(false);

  return (
    <input
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ borderColor: focused ? 'blue' : 'gray' }}
    />
  );
}
```

**После:**
```tsx
function NewInput() {
  return (
    <Focus>
      {(focused, bind) => (
        <input
          {...bind}
          style={{ borderColor: focused ? 'blue' : 'gray' }}
        />
      )}
    </Focus>
  );
}
```

### От useRef и useEffect

**До:**
```tsx
function OldComponent() {
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element)
return;

    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, []);

  return <input ref={ref} />;
}
```

**После:**
```tsx
function NewComponent() {
  return (
    <Focus>
      {(focused, bind, ref) => (
        <input {...bind} ref={ref} />
      )}
    </Focus>
  );
}
```

## Общие паттерны

### Поток фокуса формы
```tsx
function FormFocusFlow() {
  return (
    <form>
      <Focus autoFocus>
        {(focused, bind) => (
          <input {...bind} placeholder="Первое поле" />
        )}
      </Focus>

      <Focus>
        {(focused, bind) => (
          <input {...bind} placeholder="Второе поле" />
        )}
      </Focus>

      <Focus>
        {(focused, bind) => (
          <button {...bind} type="submit">Отправить</button>
        )}
      </Focus>
    </form>
  );
}
```

### Условная стилизация фокуса
```tsx
function ConditionalFocus({ variant }: { variant: 'success' | 'error' | 'default' }) {
  return (
    <Focus>
      {(focused, bind) => (
        <input
          {...bind}
          className={`
            input-${variant}
            ${focused ? `input-${variant}--focused` : ''}
          `}
        />
      )}
    </Focus>
  );
}
```

### Фокус с валидацией
```tsx
function ValidatedField({ validator }: { validator: (value: string) => string | null }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <Focus onBlur={() => setError(validator(value))}>
      {(focused, bind) => (
        <div>
          <input
            {...bind}
            value={value}
            onChange={e => setValue(e.target.value)}
            className={error ? 'input-error' : ''}
          />
          {error && <span className="error">{error}</span>}
        </div>
      )}
    </Focus>
  );
}
```

## Связанные компоненты

- [`State`](../state/README.ru.md) - Для управления состоянием
- [`Toggle`](../toggle/README.ru.md) - Для управления boolean состоянием
- [`Maybe`](../maybe/README.ru.md) - Для условного рендеринга
- [`Show`](../show/README.ru.md) - Для условного отображения
- [`Gate`](../gate/README.md) - Для контроля доступа
