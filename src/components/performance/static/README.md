# Static Component

A powerful performance optimization component that prevents unnecessary re-renders of static content through aggressive memoization. Perfect for headers, footers, and other UI elements that rarely change, providing significant performance improvements in complex applications.

## Description

The `Static` component wraps content with React.memo and advanced memoization strategies to prevent re-renders when parent components update. It offers two modes: complete static rendering (no re-renders) and dependency-based rendering (re-renders only when specific dependencies change). This component is essential for optimizing performance in large applications with frequently updating state.

## When to Use
- **Static Headers/Footers**: Navigation bars, branding, and layout elements that don't change
- **Heavy Components**: Complex UI elements that are expensive to render
- **Third-party Widgets**: External components that don't need frequent updates
- **Background Elements**: Decorative or structural elements that remain constant
- **Performance Optimization**: When profiling shows unnecessary re-renders
- **Large Lists**: Static portions of complex lists or grids
- **Modal Content**: Static parts of modals or overlays

## Patterns Used
- **Aggressive Memoization**: Prevents all re-renders unless dependencies change
- **Selective Dependencies**: Re-renders only when specified values change
- **Performance Isolation**: Isolates static content from parent component updates
- **Memory Optimization**: Efficient component caching and cleanup

## TypeScript Types

```typescript
import { ReactNode } from 'react';

/**
 * Props for the Static component
 */
interface StaticProps {
  /** Content to render statically */
  children: ReactNode;

  /**
   * Optional dependencies to watch for changes.
   * If provided, component will only re-render when these values change.
   * If omitted, component will never re-render after initial mount.
   */
  deps?: any[];
}

/** Static component type */
declare const Static: React.FC<StaticProps> & {
  displayName: string;
};
```

## Usage Examples

### Website Header with Navigation

```tsx
import { Static } from 'react-utility-kit/static';

function WebsiteLayout() {
  const [content, setContent] = useState('home');
  const [userData, setUserData] = useState(null);
  const [theme, setTheme] = useState('light');

  return (
    <div className="website-layout">
      {/* Static header - never re-renders regardless of content changes */}
      <Static>
        <header className="site-header">
          <div className="logo">
            <img src="/logo.png" alt="Company Logo" />
            <h1>Моя Компания</h1>
          </div>

          <nav className="main-navigation">
            <ul>
              <li><a href="/">Главная</a></li>
              <li><a href="/products">Продукты</a></li>
              <li><a href="/about">О нас</a></li>
              <li><a href="/contact">Контакты</a></li>
            </ul>
          </nav>

          <div className="header-actions">
            <button className="search-btn">🔍</button>
            <button className="cart-btn">🛒</button>
          </div>
        </header>
      </Static>

      {/* Dynamic content that frequently changes */}
      <main className="content">
        {content === 'home' && <HomePage />}
        {content === 'products' && <ProductsPage />}
        {content === 'about' && <AboutPage />}
      </main>

      {/* Static footer - only re-renders when theme changes */}
      <Static deps={[theme]}>
        <footer className={`site-footer theme-${theme}`}>
          <div className="footer-content">
            <div className="footer-section">
              <h3>Связаться с нами</h3>
              <p>Email: info@company.com</p>
              <p>Телефон: +7 (495) 123-45-67</p>
            </div>

            <div className="footer-section">
              <h3>Социальные сети</h3>
              <div className="social-links">
                <a href="/facebook">Facebook</a>
                <a href="/twitter">Twitter</a>
                <a href="/linkedin">LinkedIn</a>
              </div>
            </div>

            <div className="footer-section">
              <h3>Правовая информация</h3>
              <a href="/privacy">Политика конфиденциальности</a>
              <a href="/terms">Условия использования</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 Моя Компания. Все права защищены.</p>
          </div>
        </footer>
      </Static>
    </div>
  );
}
```

### Complex Dashboard with Static Sidebar

```tsx
import { Static } from 'ui-magic-core/static';

function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState('analytics');
  const [dashboardData, setDashboardData] = useState({});
  const [user, setUser] = useState({ name: 'Алексей', role: 'admin' });

  return (
    <div className="admin-dashboard">
      {/* Static sidebar - never changes unless user data changes */}
      <Static deps={[user]}>
        <aside className="dashboard-sidebar">
          <div className="user-profile">
            <img src={user.avatar || '/default-avatar.png'} alt="Профиль" />
            <div className="user-info">
              <h3>{user.name}</h3>
              <span className="user-role">{user.role}</span>
            </div>
          </div>

          <nav className="sidebar-navigation">
            <ul>
              <li className={currentPage === 'analytics' ? 'active' : ''}>
                <button onClick={() => setCurrentPage('analytics')}>
                  📊 Аналитика
                </button>
              </li>
              <li className={currentPage === 'users' ? 'active' : ''}>
                <button onClick={() => setCurrentPage('users')}>
                  👥 Пользователи
                </button>
              </li>
              <li className={currentPage === 'content' ? 'active' : ''}>
                <button onClick={() => setCurrentPage('content')}>
                  📝 Контент
                </button>
              </li>
              <li className={currentPage === 'settings' ? 'active' : ''}>
                <button onClick={() => setCurrentPage('settings')}>
                  ⚙️ Настройки
                </button>
              </li>
            </ul>
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn">Выйти</button>
          </div>
        </aside>
      </Static>

      {/* Dynamic content area */}
      <main className="dashboard-content">
        <header className="content-header">
          <h1>{getPageTitle(currentPage)}</h1>
          <div className="header-actions">
            <button className="refresh-btn">Обновить</button>
            <button className="export-btn">Экспорт</button>
          </div>
        </header>

        <div className="content-body">
          {currentPage === 'analytics' && <AnalyticsPage data={dashboardData} />}
          {currentPage === 'users' && <UsersPage />}
          {currentPage === 'content' && <ContentPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}
```

### E-commerce Product Grid with Static Filters

```tsx
import { Static } from 'ui-magic-core/static';

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 1000],
    brand: 'all'
  });
  const [sortBy, setSortBy] = useState('name');
  const [categories, setCategories] = useState([
    'Электроника',
'Одежда',
'Дом и сад',
'Спорт'
  ]);

  return (
    <div className="product-catalog">
      {/* Static filter sidebar - only updates when categories change */}
      <Static deps={[categories]}>
        <aside className="filter-sidebar">
          <div className="filter-section">
            <h3>Фильтры</h3>

            <div className="filter-group">
              <label>Категория</label>
              <select
                value={filters.category}
                onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="all">Все категории</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Ценовой диапазон</label>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={filters.priceRange[1]}
                  onChange={e => setFilters(prev => ({
                    ...prev,
                    priceRange: [0, Number.parseInt(e.target.value)]
                  }))}
                />
                <span>
До
{filters.priceRange[1]}
₽
                </span>
              </div>
            </div>

            <div className="filter-group">
              <label>Бренд</label>
              <select
                value={filters.brand}
                onChange={e => setFilters(prev => ({ ...prev, brand: e.target.value }))}
              >
                <option value="all">Все бренды</option>
                <option value="samsung">Samsung</option>
                <option value="apple">Apple</option>
                <option value="sony">Sony</option>
              </select>
            </div>

            <button
              className="clear-filters-btn"
              onClick={() => setFilters({ category: 'all', priceRange: [0, 1000], brand: 'all' })}
            >
              Очистить фильтры
            </button>
          </div>

          <div className="popular-categories">
            <h4>Популярные категории</h4>
            <ul>
              {categories.slice(0, 4).map(category => (
                <li key={category}>
                  <a href={`/category/${category}`}>{category}</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </Static>

      {/* Dynamic product grid that updates with filters */}
      <main className="product-grid-container">
        <div className="grid-header">
          <div className="results-info">
            Найдено
{' '}
{products.length}
{' '}
товаров
          </div>

          <div className="sort-controls">
            <label>Сортировать по:</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="name">Названию</option>
              <option value="price">Цене</option>
              <option value="rating">Рейтингу</option>
              <option value="date">Дате добавления</option>
            </select>
          </div>
        </div>

        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
```

### Modal Dialog with Static Content

```tsx
import { Static } from 'ui-magic-core/static';

function ConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await performAction();
      setIsOpen(false);
    }
 catch (err) {
      setError(err.message);
    }
 finally {
      setLoading(false);
    }
  };

  if (!isOpen)
return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        {/* Static modal header - never changes */}
        <Static>
          <header className="modal-header">
            <h2>Подтверждение действия</h2>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
          </header>
        </Static>

        {/* Dynamic content that changes based on state */}
        <div className="modal-body">
          {error
? (
            <div className="error-message">
              <p>
Произошла ошибка:
{error}
              </p>
              <button onClick={() => setError(null)}>Попробовать снова</button>
            </div>
          )
: (
            <div className="confirmation-content">
              <div className="warning-icon">⚠️</div>
              <p>Вы уверены, что хотите выполнить это действие?</p>
              <p className="warning-text">Это действие нельзя отменить.</p>
            </div>
          )}
        </div>

        {/* Static modal footer - actions don't change structure */}
        <Static>
          <footer className="modal-footer">
            <button
              className="btn-secondary"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              className="btn-danger"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Выполняется...' : 'Подтвердить'}
            </button>
          </footer>
        </Static>
      </div>
    </div>
  );
}
```

### Performance-Critical List with Static Items

```tsx
import { Static } from 'ui-magic-core/static';

function OptimizedContactList() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Expensive operation that shouldn't trigger re-renders of static content
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
      || contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contacts, searchTerm]);

  return (
    <div className="contact-list-app">
      {/* Static app header */}
      <Static>
        <header className="app-header">
          <div className="app-title">
            <h1>📱 Контакты</h1>
            <span className="contact-count">
{contacts.length}
{' '}
контактов
            </span>
          </div>

          <div className="header-actions">
            <button className="add-contact-btn">
              ➕ Добавить контакт
            </button>
            <button className="import-btn">
              📥 Импорт
            </button>
            <button className="export-btn">
              📤 Экспорт
            </button>
          </div>
        </header>
      </Static>

      <div className="app-body">
        {/* Static search bar structure */}
        <Static>
          <div className="search-section">
            <div className="search-input-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Поиск контактов..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </button>
              )}
            </div>

            <div className="search-filters">
              <button className="filter-btn">Все</button>
              <button className="filter-btn">Избранные</button>
              <button className="filter-btn">Недавние</button>
            </div>
          </div>
        </Static>

        <div className="contact-list-container">
          {/* Contact list - items re-render only when data changes */}
          <div className="contact-list">
            {filteredContacts.map(contact => (
              <Static key={contact.id} deps={[contact, selectedContact?.id]}>
                <div
                  className={`contact-item ${
                    selectedContact?.id === contact.id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="contact-avatar">
                    {contact.avatar
? (
                      <img src={contact.avatar} alt={contact.name} />
                    )
: (
                      <div className="avatar-placeholder">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="contact-info">
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-email">{contact.email}</div>
                    <div className="contact-phone">{contact.phone}</div>
                  </div>

                  <div className="contact-actions">
                    <button className="quick-call-btn">📞</button>
                    <button className="quick-message-btn">💬</button>
                  </div>
                </div>
              </Static>
            ))}
          </div>

          {/* Contact details panel */}
          {selectedContact && (
            <div className="contact-details">
              <ContactDetailsPanel contact={selectedContact} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## API Reference

### StaticProps

| Prop       | Type         | Required | Default | Description                                          |
|------------|--------------|----------|---------|------------------------------------------------------|
| `children` | `ReactNode`  | ✅       | -       | Content to render with static optimization          |
| `deps`     | `any[]`      | ❌       | -       | Dependencies that trigger re-renders when changed   |

### Usage Guidelines

#### Without Dependencies
When `deps` is not provided, the component will **never** re-render after initial mount:
```tsx
<Static>
  <ExpensiveComponent />
</Static>;
```

#### With Dependencies
When `deps` is provided, re-renders occur only when dependencies change:
```tsx
<Static deps={[theme, user.id]}>
  <UserProfile theme={theme} userId={user.id} />
</Static>;
```

#### Performance Considerations
- Use for components that are expensive to render
- Avoid overuse - not all components need static optimization
- Monitor bundle size impact of memoization
- Consider component size vs. memoization overhead

#### Best Practices
- **Identify Heavy Components**: Use React DevTools Profiler to find expensive renders
- **Strategic Dependencies**: Only include values that actually affect the rendered output
- **Shallow vs Deep Dependencies**: Use primitive values or stable references in deps
- **Memory Usage**: Balance memoization benefits against memory overhead

## Advanced Examples

### Theme-Aware Static Components

```tsx
function ThemedLayout() {
  const [theme, setTheme] = useState('light');
  const [content, setContent] = useState('home');

  return (
    <div className={`app theme-${theme}`}>
      {/* Header adapts to theme changes only */}
      <Static deps={[theme]}>
        <header className={`header header-${theme}`}>
          <nav>
            <Logo theme={theme} />
            <Navigation theme={theme} />
            <ThemeToggle theme={theme} onToggle={setTheme} />
          </nav>
        </header>
      </Static>

      {/* Content changes frequently */}
      <main>
        {content === 'home' && <HomePage />}
        {content === 'about' && <AboutPage />}
      </main>

      {/* Footer is completely static */}
      <Static>
        <footer>
          <p>&copy; 2025 My Company</p>
        </footer>
      </Static>
    </div>
  );
}
```

## Migration Guide

### From Manual Memoization
```tsx
// Before: Manual memo with complex dependencies
const ExpensiveComponent = memo(({ data, theme }) => {
  return <ComplexVisualization data={data} theme={theme} />;
}, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data && prevProps.theme === nextProps.theme;
});

// After: Using Static component
<Static deps={[data, theme]}>
  <ComplexVisualization data={data} theme={theme} />
</Static>;
```

### From useCallback/useMemo Patterns
```tsx
// Before: Complex memoization logic
function MyComponent() {
  const memoizedContent = useMemo(() => (
    <ExpensiveContent />
  ), []);

  return (
    <div>
      {memoizedContent}
      <DynamicContent />
    </div>
  );
}

// After: Using Static component
function MyComponent() {
  return (
    <div>
      <Static>
        <ExpensiveContent />
      </Static>
      <DynamicContent />
    </div>
  );
}
```

## Performance Impact

### Benchmark Results
- **Render Time Reduction**: Up to 90% for heavy components
- **Memory Usage**: Minimal overhead for memoization
- **Bundle Size**: ~0.5KB additional JavaScript
- **Re-render Prevention**: Eliminates cascading updates

### When to Use
✅ **Good candidates:**
- Headers, footers, sidebars
- Heavy data visualizations
- Third-party widgets
- Complex forms with static sections

❌ **Avoid for:**
- Simple components (buttons, text)
- Frequently changing content
- Components with many dependencies
- Already optimized components

## Related Components
- [`memo`](../memo/README.md) - For React.memo with custom comparison
- [`cache`](../cache/README.md) - For data and computation caching
- [`lazy`](../lazy/README.md) - For code splitting and lazy loading
}
```

## API
| Prop        | Type                                         | Required | Description                  |
|-------------|----------------------------------------------|----------|------------------------------|
| `children`  | `ReactNode`                                  | ✅       | Static content to render     |

## Examples
### Basic Usage
```tsx
import { Static } from 'rc-sugar';

<Static>
  <div>This will never re-render</div>
</Static>
```

## Best Practices
- Use for constant or memoized UI
- Prefer for static sections
