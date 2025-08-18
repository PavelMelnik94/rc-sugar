# Toggle Component

A simple utility for managing boolean state in React applications, designed specifically for toggle functionality, switches, checkboxes, and any on/off logic.

## Description

The `Toggle` component provides a declarative way to manage boolean state in React applications. It encapsulates toggle logic with a render props pattern, offering convenient methods for state manipulation. This component is perfect for any scenario where you need to manage true/false states with a clean, reusable API.

## When to Use

- **UI Toggles and Switches**: Dark mode toggles, feature flags, settings switches
- **Show/Hide Logic**: Collapsible sections, expandable content, modal visibility
- **Form Controls**: Checkboxes, radio button alternatives, form field toggles
- **Feature Flags**: Enabling/disabling features, beta feature toggles
- **Preference Management**: User preferences, notification settings, privacy controls
- **Conditional Rendering**: Toggling between different views or components
- **Accordion and Collapsible Content**: Expanding/collapsing content sections

## How It Works

The `Toggle` component manages boolean state with the following features:

1. **State Management**: Handles true/false state with optional initial value
2. **Render Props Pattern**: Exposes state and control functions through children
3. **Change Callbacks**: Optional onChange callback for state changes
4. **Optimized Updates**: Only triggers onChange when state actually changes

## Patterns Used

- **Boolean State Pattern**: Specialized for true/false state management
- **Render Props Pattern**: Exposes state and control functions through children
- **Observer Pattern**: Callbacks for state change notifications
- **Optimization Pattern**: Prevents unnecessary onChange calls
- **Type Safety**: Full TypeScript support with proper type definitions

## TypeScript Types

```typescript
/**
 * Toggle state information
 */
interface ToggleState {
  /** Current toggle state */
  on: boolean;
  /** Toggle the state */
  toggle: () => void;
  /** Turn on */
  setOn: () => void;
  /** Turn off */
  setOff: () => void;
  /** Set specific state */
  setState: (state: boolean) => void;
}

/**
 * Props for the Toggle component
 */
interface ToggleProps {
  /** Initial toggle state */
  initial?: boolean;
  /** Children render function */
  children: RenderProp<ToggleState>;
  /** Callback when toggle state changes */
  onChange?: (state: boolean) => void;
}
```

## API Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `initial` | `boolean` | | `false` | Initial toggle state |
| `children` | `RenderProp<ToggleState>` | ✅ | - | Render function with toggle state |
| `onChange` | `(state: boolean) => void` | | - | Callback when toggle state changes |

## Examples

### Basic Toggle Switch
```tsx
import { Toggle } from 'ui-magic-core';

function BasicToggle() {
  return (
    <Toggle initial={false}>
      {({ on, toggle }) => (
        <button
          onClick={toggle}
          className={`toggle-btn ${on ? 'on' : 'off'}`}
          aria-pressed={on}
        >
          {on ? 'ON' : 'OFF'}
        </button>
      )}
    </Toggle>
  );
}
```

### Toggle with State Change Callback
```tsx
function CallbackToggle() {
  return (
    <Toggle 
      initial={false}
      onChange={(state) => console.log('Toggle state:', state)}
    >
      {({ on, toggle }) => (
        <button onClick={toggle}>
          {on ? 'ON' : 'OFF'}
        </button>
      )}
    </Toggle>
  );
}
```

### Toggle with All Control Methods
```tsx
function AdvancedToggle() {
  return (
    <Toggle initial={false}>
      {({ on, toggle, setOn, setOff, setState }) => (
        <div>
          <div>Status: {on ? 'ON' : 'OFF'}</div>
          <button onClick={toggle}>Toggle</button>
          <button onClick={setOn}>Turn On</button>
          <button onClick={setOff}>Turn Off</button>
          <button onClick={() => setState(true)}>Set True</button>
          <button onClick={() => setState(false)}>Set False</button>
        </div>
      )}
    </Toggle>
  );
}
```

### Checkbox Toggle
```tsx
function CheckboxToggle() {
  return (
    <Toggle initial={false}>
      {({ on, toggle }) => (
        <label>
          <input
            type="checkbox"
            checked={on}
            onChange={toggle}
          />
          Enable notifications
        </label>
      )}
    </Toggle>
  );
}
```

### Collapsible Content Section
```tsx
function CollapsibleSection({ title, children }) {
  return (
    <Toggle initial={false}>
      {(state, { toggle }) => (
        <div className="collapsible-section">
          <button
            className="section-header"
            onClick={toggle}
            aria-expanded={state.on}
            aria-controls="section-content"
          >
            <span>{title}</span>
            <span className={`chevron ${state.on ? 'up' : 'down'}`}>
              {state.on ? '▲' : '▼'}
            </span>
          </button>

          <div
            id="section-content"
            className={`section-content ${state.on ? 'expanded' : 'collapsed'}`}
            style={{
              maxHeight: state.on ? 'none' : '0',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            {children}
          </div>
        </div>
      )}
    </Toggle>
  );
}

// Usage
function App() {
  return (
    <div>
      <CollapsibleSection title="Account Settings">
        <div>Your account settings content here...</div>
      </CollapsibleSection>

      <CollapsibleSection title="Privacy Settings">
        <div>Your privacy settings content here...</div>
      </CollapsibleSection>
    </div>
  );
}
```

### Modal Visibility Control
```tsx
function ModalController() {
  return (
    <Toggle initial={false}>
      {(state, { toggle, turnOff }) => (
        <div>
          <button onClick={toggle} className="open-modal-btn">
            Open Settings Modal
          </button>

          {state.on && (
            <div className="modal-overlay" onClick={turnOff}>
              <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Settings</h2>
                  <button onClick={turnOff} className="close-btn">
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <p>Modal content goes here...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Toggle>
  );
}
```

### Controlled Toggle for Form
```tsx
function UserProfileForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isPublic: false,
    notifications: true
  });

  return (
    <form>
      <input
        type="text"
        value={formData.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Name"
      />

      <input
        type="email"
        value={formData.email}
        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
        placeholder="Email"
      />

      {/* Controlled toggle for public profile */}
      <Toggle
        on={formData.isPublic}
        onChange={isPublic => setFormData(prev => ({ ...prev, isPublic }))}
      >
        {(state, { toggle }) => (
          <label className="form-toggle">
            <input
              type="checkbox"
              checked={state.on}
              onChange={toggle}
            />
            Make profile public
          </label>
        )}
      </Toggle>

      {/* Controlled toggle for notifications */}
      <Toggle
        on={formData.notifications}
        onChange={notifications => setFormData(prev => ({ ...prev, notifications }))}
      >
        {(state, { toggle }) => (
          <label className="form-toggle">
            <input
              type="checkbox"
              checked={state.on}
              onChange={toggle}
            />
            Enable notifications
          </label>
        )}
      </Toggle>

      <button type="submit">Save Profile</button>
    </form>
  );
}
```

### Advanced Settings Panel
```tsx
function AdvancedSettings() {
  return (
    <div className="settings-panel">
      <h2>Advanced Settings</h2>

      {/* Auto-save toggle */}
      <Toggle
        initial={true}
        persist={{ key: 'auto-save' }}
        onChange={(enabled) => {
          if (enabled) {
            startAutoSave();
          }
 else {
            stopAutoSave();
          }
        }}
      >
        {(state, { toggle }) => (
          <div className="setting-item">
            <div className="setting-info">
              <h4>Auto-save</h4>
              <p>Automatically save your work</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={state.on}
                onChange={toggle}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
        )}
      </Toggle>

      {/* Keyboard shortcuts toggle */}
      <Toggle
        initial={true}
        persist={{ key: 'keyboard-shortcuts' }}
        validate={(enabled) => {
          if (!enabled) {
            return window.confirm('This will disable all keyboard shortcuts. Continue?');
          }
          return true;
        }}
      >
        {(state, { toggle }) => (
          <div className="setting-item">
            <div className="setting-info">
              <h4>Keyboard Shortcuts</h4>
              <p>Enable keyboard shortcuts for faster navigation</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={state.on}
                onChange={toggle}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
        )}
      </Toggle>

      {/* Analytics toggle with nested content */}
      <Toggle
        initial={false}
        persist={{ key: 'analytics-enabled' }}
      >
        {(state, { toggle }) => (
          <div className="setting-item">
            <div className="setting-info">
              <h4>Analytics & Tracking</h4>
              <p>Help improve the app by sharing anonymous usage data</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={state.on}
                onChange={toggle}
              />
              <span className="switch-slider"></span>
            </label>

            {state.on && (
              <div className="nested-settings">
                <Toggle initial={true} persist={{ key: 'performance-analytics' }}>
                  {(perfState, { toggle: togglePerf }) => (
                    <label>
                      <input
                        type="checkbox"
                        checked={perfState.on}
                        onChange={togglePerf}
                      />
                      Performance Analytics
                    </label>
                  )}
                </Toggle>

                <Toggle initial={false} persist={{ key: 'crash-reports' }}>
                  {(crashState, { toggle: toggleCrash }) => (
                    <label>
                      <input
                        type="checkbox"
                        checked={crashState.on}
                        onChange={toggleCrash}
                      />
                      Crash Reports
                    </label>
                  )}
                </Toggle>
              </div>
            )}
          </div>
        )}
      </Toggle>
    </div>
  );
}
```

## Performance Considerations

- **State Synchronization**: Avoid creating multiple toggles for the same logical state
- **Persistence Throttling**: Consider debouncing persistence operations for frequently toggled states
- **Re-render Optimization**: Use `React.memo` for expensive child components
- **Event Handler Memoization**: Memoize event handlers when passing to expensive components

```tsx
// Performance optimized toggle usage
const OptimizedToggle = React.memo(({ children, ...props }) => (
  <Toggle {...props}>
    {(state, actions) => {
      const memoizedActions = useMemo(() => actions, [actions.toggle]);
      return children(state, memoizedActions);
    }}
  </Toggle>
));
```

## Best Practices

1. **Accessibility**: Always provide proper ARIA labels and keyboard support
2. **Visual Feedback**: Provide clear visual indication of toggle state
3. **Persistence**: Use persistence for user preferences and settings
4. **Validation**: Implement validation for critical state changes
5. **Controlled Mode**: Use controlled mode when integrating with forms or external state
6. **Error Handling**: Handle validation errors gracefully with user feedback

## Migration Guide

### From useState Hook

**Before:**
```tsx
function Component() {
  const [isOn, setIsOn] = useState(false);

  const toggle = () => setIsOn(prev => !prev);

  return (
    <button onClick={toggle}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}
```

**After:**
```tsx
function Component() {
  return (
    <Toggle initial={false}>
      {(state, { toggle }) => (
        <button onClick={toggle}>
          {state.on ? 'ON' : 'OFF'}
        </button>
      )}
    </Toggle>
  );
}
```

### From Class Component State

**Before:**
```tsx
class Component extends React.Component {
  state = { isToggled: false };

  toggle = () => {
    this.setState(prev => ({ isToggled: !prev.isToggled }));
  };

  render() {
    return (
      <button onClick={this.toggle}>
        {this.state.isToggled ? 'ON' : 'OFF'}
      </button>
    );
  }
}
```

**After:**
```tsx
function Component() {
  return (
    <Toggle initial={false}>
      {(state, { toggle }) => (
        <button onClick={toggle}>
          {state.on ? 'ON' : 'OFF'}
        </button>
      )}
    </Toggle>
  );
}
```
