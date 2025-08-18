# Focus Component

A powerful utility component for managing focus state and behavior in React applications, providing advanced focus management, accessibility features, and seamless integration with keyboard navigation patterns.

## Description

The `Focus` component offers a comprehensive solution for tracking, controlling, and responding to focus events in modern React applications. It provides a render props pattern that gives you full control over focus behavior while maintaining accessibility standards and enabling complex keyboard navigation workflows.

Built with accessibility-first principles, this component helps create intuitive user experiences for both mouse and keyboard users, supporting focus trapping, auto-focus management, and sophisticated focus state transitions.

## When to Use

- **Accessibility enhancement** for complex UI components
- **Keyboard navigation** in form interfaces and interactive elements
- **Focus management** in modals, dropdowns, and overlays
- **Visual feedback** for focused states and interactive elements
- **Form field highlighting** and validation state indication
- **Custom input components** requiring focus behavior
- **Dashboard interfaces** with keyboard shortcuts
- **Game UI** or application interfaces with keyboard controls
- **Autocomplete** and searchable dropdowns
- **Tab sequences** and focus trap management

## How It Works

The `Focus` component uses React hooks to track focus and blur events, maintaining internal state and providing event handlers through render props. It automatically manages focus transitions and provides a clean API for responding to focus changes without manual event listener management.

The component supports both controlled and uncontrolled focus behavior, making it suitable for various use cases from simple focus indicators to complex focus management systems.

## Patterns Used

- **Render Props Pattern**: Provides focus state and event handlers to children
- **Controlled Component Pattern**: Allows external control of focus state
- **Hook-based State Management**: Uses React hooks for efficient state tracking
- **Event Handler Composition**: Combines focus events with custom handlers
- **Accessibility Pattern**: Follows WCAG guidelines for focus management
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## TypeScript Types

```typescript
/**
 * Props for the Focus component
 */
interface FocusProps {
  /**
   * Render function that receives focus state and event handlers
   * @param focused - Current focus state
   * @param bind - Object containing onFocus and onBlur handlers
   * @param ref - Ref object for the focusable element
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
   * Initial focus state
   * @default false
   */
  defaultFocused?: boolean;

  /**
   * Controlled focus state
   */
  focused?: boolean;

  /**
   * Callback fired when focus state changes
   */
  onFocusChange?: (focused: boolean, event: React.FocusEvent) => void;

  /**
   * Callback fired when element gains focus
   */
  onFocus?: (event: React.FocusEvent) => void;

  /**
   * Callback fired when element loses focus
   */
  onBlur?: (event: React.FocusEvent) => void;

  /**
   * Auto-focus the element on mount
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Prevent default focus behavior
   * @default false
   */
  preventScroll?: boolean;

  /**
   * Focus delay in milliseconds
   * @default 0
   */
  focusDelay?: number;

  /**
   * Blur delay in milliseconds
   * @default 0
   */
  blurDelay?: number;
}

/**
 * Focus state object
 */
interface FocusState {
  focused: boolean;
  lastFocusTime: number;
  lastBlurTime: number;
  focusCount: number;
}

/**
 * Focus event handlers
 */
interface FocusHandlers {
  onFocus: (event: React.FocusEvent) => void;
  onBlur: (event: React.FocusEvent) => void;
  focus: () => void;
  blur: () => void;
}
```

## API Reference

### Focus Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `(focused: boolean, bind: FocusHandlers, ref: RefObject) => ReactNode` | ✅ | - | Render function receiving focus state and handlers |
| `defaultFocused` | `boolean` | ❌ | `false` | Initial focus state for uncontrolled usage |
| `focused` | `boolean` | ❌ | - | Controlled focus state |
| `onFocusChange` | `(focused: boolean, event: FocusEvent) => void` | ❌ | - | Callback fired when focus state changes |
| `onFocus` | `(event: FocusEvent) => void` | ❌ | - | Callback fired when element gains focus |
| `onBlur` | `(event: FocusEvent) => void` | ❌ | - | Callback fired when element loses focus |
| `autoFocus` | `boolean` | ❌ | `false` | Auto-focus element on mount |
| `preventScroll` | `boolean` | ❌ | `false` | Prevent scrolling when focusing |
| `focusDelay` | `number` | ❌ | `0` | Delay before focus events (ms) |
| `blurDelay` | `number` | ❌ | `0` | Delay before blur events (ms) |

### Render Prop Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `focused` | `boolean` | Current focus state |
| `bind` | `FocusHandlers` | Event handlers and utility functions |
| `ref` | `RefObject<HTMLElement>` | Ref for the focusable element |

## Examples

### Basic Focus Indicator
```tsx
import { Focus } from 'ui-magic-core';

function BasicInput() {
  return (
    <Focus>
      {(focused, bind) => (
        <input
          {...bind}
          placeholder="Type here..."
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

### Advanced Form Field with Focus States
```tsx
import { Focus } from 'ui-magic-core';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
}

function FormField({ label, error, required }: FormFieldProps) {
  return (
    <Focus onFocusChange={focused => console.log('Focus changed:', focused)}>
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

### Search Input with Focus Behavior
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
              placeholder="Search components..."
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

### Custom Button with Focus Management
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

### Modal with Focus Trap
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
      // Trap focus within modal
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
                aria-label="Close modal"
              >
                ×
              </button>
            </header>

            <div className="modal-content">
              {children}
            </div>

            <footer className="modal-footer">
              <button onClick={onClose}>Cancel</button>
              <button className="primary">Confirm</button>
            </footer>
          </div>
        )}
      </Focus>
    </div>
  );
}
```

### Accessible Navigation Menu
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
    <nav role="navigation" aria-label="Main navigation">
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

### Focus Tracking Analytics
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

## Performance Considerations

1. **Event Handler Optimization**: The component memoizes event handlers to prevent unnecessary re-renders
2. **Focus State Batching**: Multiple rapid focus/blur events are batched for better performance
3. **Delay Management**: Optional delays prevent excessive state updates during rapid focus changes
4. **Memory Management**: Automatically cleans up event listeners and timers
5. **Ref Optimization**: Uses stable ref objects to avoid unnecessary DOM updates

## Best Practices

1. **Accessibility First**: Always consider keyboard navigation and screen reader users
2. **Visual Feedback**: Provide clear visual indicators for focused states
3. **Focus Management**: Use focus trapping in modals and complex components
4. **Performance**: Use delays and debouncing for rapid focus changes
5. **Testing**: Test focus behavior with keyboard navigation and assistive technologies
6. **Progressive Enhancement**: Ensure functionality works without JavaScript

## Migration Guide

### From Manual Focus Handling

**Before:**
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

**After:**
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

### From useRef and useEffect

**Before:**
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

**After:**
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

## Common Patterns

### Form Focus Flow
```tsx
function FormFocusFlow() {
  return (
    <form>
      <Focus autoFocus>
        {(focused, bind) => (
          <input {...bind} placeholder="First field" />
        )}
      </Focus>

      <Focus>
        {(focused, bind) => (
          <input {...bind} placeholder="Second field" />
        )}
      </Focus>

      <Focus>
        {(focused, bind) => (
          <button {...bind} type="submit">Submit</button>
        )}
      </Focus>
    </form>
  );
}
```

### Conditional Focus Styling
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

### Focus with Validation
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

## Related Components

- [`State`](../state/README.md) - For state management
- [`Toggle`](../toggle/README.md) - For boolean state management
- [`Maybe`](../maybe/README.md) - For conditional rendering
- [`Show`](../show/README.md) - For conditional display
- [`Gate`](../gate/README.md) - For access control
