# Компонент Mirror

Мощная утилита для клонирования и улучшения React элементов с новыми свойствами, обеспечивающая динамическую модификацию компонентов и внедрение свойств.

## Описание

Компонент `Mirror` предоставляет чистый, декларативный способ клонирования существующих React элементов с добавлением, изменением или переопределением их свойств. Он использует React API `cloneElement` для создания улучшенных версий компонентов без прямого изменения исходных элементов. Идеально подходит для композиции компонентов, внедрения свойств, динамической стилизации и создания гибких, переиспользуемых паттернов компонентов.

## Когда использовать

### Идеально подходит для
- **Внедрения свойств**: Добавления новых свойств к существующим элементам
- **Динамической стилизации**: Условного применения стилей или классов
- **Улучшения обработчиков событий**: Добавления или изменения обработчиков событий
- **Декорирования компонентов**: Улучшения компонентов дополнительной функциональностью
- **Условных свойств**: Применения свойств на основе условий времени выполнения
- **Обёртывания устаревших компонентов**: Модернизации старых компонентов
- **Применения тем**: Динамического применения свойств, связанных с темой
- **Улучшения доступности**: Добавления свойств доступности к существующим элементам

### Избегайте, когда
- Создаёте новые компоненты с нуля (используйте прямой JSX)
- Простая передача свойств (используйте стандартные React паттерны)
- Модификации глубокого дерева компонентов (проблемы производительности)
- Сложное управление состоянием (используйте специализированные решения для состояния)

## Используемые паттерны
- **Паттерн клонирования элементов**: Использует React.cloneElement для безопасного дублирования элементов
- **Паттерн внедрения свойств**: Динамически добавляет или изменяет свойства
- **Паттерн композиции**: Обеспечивает гибкую композицию компонентов
- **Паттерн улучшения**: Дополняет существующие компоненты новыми возможностями

## TypeScript интерфейс

```typescript
/**
 * Свойства для компонента Mirror
 */
interface MirrorProps extends Record<string, any> {
  /**
   * React элемент для клонирования и улучшения
   */
  element: ReactElement;

  // Все остальные свойства передаются клонированному элементу
}
```

## Справочник API

| Свойство | Тип | Обязательно | Описание |
|----------|-----|-------------|----------|
| `element` | `ReactElement` | ✅ | React элемент для клонирования |
| `...props` | `any` | ❌ | Любые дополнительные свойства для объединения с клонированным элементом |

## Примеры

### Базовое внедрение свойств
```tsx
import { Mirror } from 'ui-magic-core';

function EnhancedButton() {
  const sourceButton = <button className="base-btn">Click me</button>;

  return (
    <Mirror
      element={sourceButton}
      className="base-btn enhanced"
      onClick={() => console.log('Enhanced click!')}
      disabled={false}
    />
  );
}

// Result: <button className="base-btn enhanced" onClick={...} disabled={false}>Click me</button>
```

### Динамическая стилизация
```tsx
interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

function StyledButton({ variant, size, children }: StyledButtonProps) {
  const baseButton = <button className="btn">{children}</button>;

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  };

  const sizeClasses = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg'
  };

  return (
    <Mirror
      element={baseButton}
      className={`btn ${variantClasses[variant]} ${sizeClasses[size]}`}
    />
  );
}

// Usage
<StyledButton variant="primary" size="large">
  Submit
</StyledButton>;
```

### Улучшение обработчиков событий
```tsx
function AnalyticsButton({ sourceButton, trackingId, category }) {
  const enhancedClick = originalHandler => (event) => {
    // First track analytics
    analytics.track('Button Click', {
      trackingId,
      category,
      timestamp: Date.now()
    });

    // Then call the original handler if it exists
    if (originalHandler) {
      originalHandler(event);
    }
  };

  return (
    <Mirror
      element={sourceButton}
      onClick={enhancedClick(sourceButton.props.onClick)}
      data-tracking-id={trackingId}
      data-category={category}
    />
  );
}

// Usage
const myButton = <button onClick={() => handleSubmit()}>Submit</button>;

<AnalyticsButton
  sourceButton={myButton}
  trackingId="submit-btn-001"
  category="forms"
/>;
```

### Условное применение свойств
```tsx
function ConditionalMirror({ element, condition, conditionalProps, ...constantProps }) {
  const finalProps = condition ? { ...constantProps, ...conditionalProps } : constantProps;

  return <Mirror element={element} {...finalProps} />;
}

// Usage
function ResponsiveImage({ src, alt, isMobile }) {
  const baseImage = <img src={src} alt={alt} />;

  return (
    <ConditionalMirror
      element={baseImage}
      condition={isMobile}
      className="responsive-image"
      conditionalProps={{
        loading: 'lazy',
        sizes: '(max-width: 768px) 100vw, 50vw'
      }}
      style={{ maxWidth: '100%' }}
    />
  );
}
```

### Улучшение доступности
```tsx
function AccessibilityEnhancer({ element, ariaLabel, ariaDescription, role }) {
  const accessibilityProps = {};

  if (ariaLabel)
accessibilityProps['aria-label'] = ariaLabel;
  if (ariaDescription)
accessibilityProps['aria-describedby'] = ariaDescription;
  if (role)
accessibilityProps.role = role;

  return <Mirror element={element} {...accessibilityProps} />;
}

// Usage
function AccessibleCard({ children }) {
  const cardElement = (
    <div className="card">
      {children}
    </div>
  );

  return (
    <AccessibilityEnhancer
      element={cardElement}
      role="article"
      ariaLabel="Product information card"
      ariaDescription="card-description"
    />
  );
}
```

### Применение темы
```tsx
function ThemedElement({ element, theme }) {
  const themeProps = {
    'data-theme': theme.name,
    'style': {
      ...element.props.style,
      '--primary-color': theme.primaryColor,
      '--secondary-color': theme.secondaryColor,
      '--font-family': theme.fontFamily
    },
    'className': `${element.props.className || ''} theme-${theme.name}`
  };

  return <Mirror element={element} {...themeProps} />;
}

// Usage
const darkTheme = {
  name: 'dark',
  primaryColor: '#ffffff',
  secondaryColor: '#cccccc',
  fontFamily: 'Inter, sans-serif'
};

function ThemedApplication({ children }) {
  const appElement = <div className="app">{children}</div>;

  return <ThemedElement element={appElement} theme={darkTheme} />;
}
```

### Улучшение полей формы
```tsx
function FormFieldEnhancer({ element, validation, required, helpText }) {
  const validationProps = {};

  if (validation?.error) {
    validationProps['aria-invalid'] = true;
    validationProps['aria-describedby'] = `${element.props.id}-error`;
  }

  if (required) {
    validationProps.required = true;
    validationProps['aria-required'] = true;
  }

  if (helpText) {
    validationProps['aria-describedby'] = `${element.props.id}-help`;
  }

  return (
    <div className="form-field">
      <Mirror element={element} {...validationProps} />

      {helpText && (
        <div id={`${element.props.id}-help`} className="help-text">
          {helpText}
        </div>
      )}

      {validation?.error && (
        <div id={`${element.props.id}-error`} className="error-text" role="alert">
          {validation.error}
        </div>
      )}
    </div>
  );
}

// Usage
function LoginForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const emailField = (
    <input
      id="email"
      type="email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      placeholder="Enter your email"
    />
  );

  return (
    <form>
      <FormFieldEnhancer
        element={emailField}
        required
        validation={{ error: emailError }}
        helpText="We'll never share your email address"
      />
    </form>
  );
}
```

### Обёртка библиотеки компонентов
```tsx
// Wrapping third-party components
function LibraryButtonAdapter({ children, variant, ...props }) {
  // Third-party button component
  const thirdPartyButton = <ThirdPartyButton type="button">{children}</ThirdPartyButton>;

  // Map our API to third-party API
  const mappedProps = {
    ...props,
    variant: variant === 'primary' ? 'contained' : 'outlined',
    color: variant === 'danger' ? 'error' : 'primary'
  };

  return <Mirror element={thirdPartyButton} {...mappedProps} />;
}

// Usage - now the third-party component follows our API
<LibraryButtonAdapter variant="primary" onClick={handleClick}>
  Our Button
</LibraryButtonAdapter>;
```

### Адаптивное улучшение компонентов
```tsx
function ResponsiveEnhancer({ element, breakpoints }) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768)
setCurrentBreakpoint('mobile');
      else if (width < 1024)
setCurrentBreakpoint('tablet');
      else setCurrentBreakpoint('desktop');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const responsiveProps = breakpoints[currentBreakpoint] || {};

  return (
    <Mirror
      element={element}
      {...responsiveProps}
      data-breakpoint={currentBreakpoint}
    />
  );
}

// Usage
function ResponsiveImage({ src, alt }) {
  const baseImage = <img src={src} alt={alt} />;

  const breakpoints = {
    mobile: {
      style: { width: '100%', height: 'auto' },
      loading: 'lazy'
    },
    tablet: {
      style: { width: '50%', height: 'auto' },
      loading: 'lazy'
    },
    desktop: {
      style: { width: '25%', height: 'auto' },
      loading: 'eager'
    }
  };

  return (
    <ResponsiveEnhancer element={baseImage} breakpoints={breakpoints} />
  );
}
```

### Интеграция с границей ошибок
```tsx
function ErrorBoundaryElement({ element, fallback, onError }) {
  const [hasError, setHasError] = useState(false);

  const errorBoundaryProps = {
    onError: (error, errorInfo) => {
      setHasError(true);
      onError?.(error, errorInfo);
      console.error('Element error:', error);
    }
  };

  if (hasError) {
    return fallback || <div>Something went wrong</div>;
  }

  try {
    return <Mirror element={element} {...errorBoundaryProps} />;
  }
 catch (error) {
    setHasError(true);
    return fallback || <div>Something went wrong</div>;
  }
}

// Usage
function SafeComponent() {
  const riskyElement = <RiskyComponent data={complexData} />;

  return (
    <ErrorBoundaryElement
      element={riskyElement}
      fallback={<div>Failed to load component</div>}
      onError={error => reportError(error)}
    />
  );
}
```

## Соображения производительности

### Стратегии оптимизации
```typescript
// Memoize mirror components to prevent unnecessary re-renders
const MemoizedMirror = React.memo(Mirror);

// Use useMemo for expensive prop calculations
function OptimizedMirror({ element, calculateProps, dependencies }) {
  const calculatedProps = useMemo(() => calculateProps(), dependencies);

  return <Mirror element={element} {...calculatedProps} />;
}

// Avoid creating new elements in render
function EfficientMirror({ children, ...props }) {
  // Good: element is created once
  const baseElement = useMemo(() => (
    <div className="base">{children}</div>
  ), [children]);

  return <Mirror element={baseElement} {...props} />;
}
```

### Управление памятью
```typescript
// Clean up event listeners and references
function ManagedMirror({ element, onMount, onUnmount }) {
  const ref = useRef();

  useEffect(() => {
    if (ref.current && onMount) {
      onMount(ref.current);
    }

    return () => {
      if (ref.current && onUnmount) {
        onUnmount(ref.current);
      }
    };
  }, [onMount, onUnmount]);

  return <Mirror element={element} ref={ref} />;
}
```

## Лучшие практики

### Делайте ✅
```typescript
// Use meaningful prop names
<Mirror
  element={button}
  variant="primary"
  size="large"
  isLoading={loading}
/>

// Provide fallbacks for missing elements
function SafeMirror({ element, ...props }) {
  if (!element) {
    console.warn('Mirror: Element not provided');
    return null;
  }

  return <Mirror element={element} {...props} />;
}

// Preserve the original element structure
const originalElement = <Button primary>Original</Button>;
<Mirror element={originalElement} disabled={isDisabled} />

// Use TypeScript for type safety
interface MirrorButtonProps {
  element: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>;
  variant?: 'primary' | 'secondary';
}

function MirrorButton({ element, variant, ...props }: MirrorButtonProps) {
  return <Mirror element={element} data-variant={variant} {...props} />;
}
```

### Не делайте ❌
```typescript
// Don't pass invalid elements
<Mirror element="not an element" /> // ❌ Will warn and return null

// Don't mutate the original element
function BadMirror({ element }) {
  element.props.className = 'modified'; // ❌ Mutates the original
  return <Mirror element={element} />;
}

// Don't create elements inside render without memoization
function BadPractice({ data }) {
  return (
    <Mirror
      element={<ExpensiveComponent data={data} />} // ❌ Creates new element on each render
      additionalProp="value"
    />
  );
}

// Don't ignore TypeScript warnings
<Mirror element={42} /> // ❌ TypeScript will warn about invalid element
```

## Руководство по миграции

### От ручного cloneElement
```typescript
// Before: Manual use of cloneElement
function EnhancedComponent({ originalElement, newProps }) {
  return React.cloneElement(originalElement, {
    ...originalElement.props,
    ...newProps
  });
}

// Now: Mirror component
function EnhancedComponent({ originalElement, newProps }) {
  return <Mirror element={originalElement} {...newProps} />;
}
```

### От компонентов-обёрток
```typescript
// Before: Wrapper component pattern
function ButtonWrapper({ children, additionalProps }) {
  return (
    <button {...additionalProps}>
      {children}
    </button>
  );
}

// Now: Element enhancement with Mirror
function ButtonEnhancer({ originalButton, ...additionalProps }) {
  return <Mirror element={originalButton} {...additionalProps} />;
}
```

## Связанные компоненты
- [`compose`](../compose/README.md) - Для композиции множественных компонентов
- [`if`](../if/README.md) - Для условного рендеринга элементов
- [`when`](../when/README.md) - Для сложной условной логики

## Доступность

Компонент `Mirror` сохраняет и может улучшать свойства доступности:

```typescript
// Preserves existing accessibility props
const accessibleButton = (
  <button
    aria-label="Close dialog"
    aria-expanded={isOpen}
    role="button"
  >
    Close
  </button>
);

// Mirror preserves all accessibility properties
<Mirror element={accessibleButton} className="enhanced-close-btn" />

// Adds accessibility enhancements
<Mirror
  element={accessibleButton}
  aria-describedby="close-help-text"
  aria-keyshortcuts="Escape"
/>
```

Компонент `Mirror` - это мощный инструмент для композиции и улучшения компонентов, обеспечивающий гибкие и поддерживаемые React приложения.
