# Компонент Static

Мощный компонент оптимизации производительности, который предотвращает ненужные перерендеры статического контента через агрессивную мемоизацию. Идеально подходит для заголовков, подвалов и других UI элементов, которые редко изменяются, обеспечивая значительные улучшения производительности в сложных приложениях.

## Описание

Компонент `Static` оборачивает контент с помощью React.memo и продвинутых стратегий мемоизации для предотвращения перерендеров при обновлении родительских компонентов. Он предлагает два режима: полностью статический рендеринг (без перерендеров) и рендеринг на основе зависимостей (перерендер только при изменении конкретных зависимостей). Этот компонент необходим для оптимизации производительности в больших приложениях с часто обновляющимся состоянием.

## Когда использовать
- **Статические заголовки/подвалы**: Панели навигации, брендинг и элементы макета, которые не изменяются
- **Тяжёлые компоненты**: Сложные UI элементы, которые дорого рендерить
- **Сторонние виджеты**: Внешние компоненты, которые не требуют частых обновлений
- **Фоновые элементы**: Декоративные или структурные элементы, которые остаются постоянными
- **Оптимизация производительности**: Когда профилирование показывает ненужные перерендеры
- **Большие списки**: Статические части сложных списков или сеток
- **Контент модалей**: Статические части модалей или оверлеев

## Используемые паттерны
- **Агрессивная мемоизация**: Предотвращает все перерендеры, если не изменяются зависимости
- **Селективные зависимости**: Перерендер только при изменении указанных значений
- **Изоляция производительности**: Изолирует статический контент от обновлений родительского компонента
- **Оптимизация памяти**: Эффективное кэширование компонентов и очистка

## Типы TypeScript

```typescript
import { ReactNode } from 'react';

/**
 * Пропсы для компонента Static
 */
interface StaticProps {
  /** Контент для статического рендеринга */
  children: ReactNode;

  /**
   * Опциональные зависимости для отслеживания изменений.
   * Если предоставлены, компонент будет перерендериваться только при изменении этих значений.
   * Если не указаны, компонент никогда не будет перерендериваться после первоначального монтирования.
   */
  deps?: any[];
}

/** Тип компонента Static */
declare const Static: React.FC<StaticProps> & {
  displayName: string;
};
```

## Примеры использования

### Заголовок сайта с навигацией

```tsx
import { Static } from 'ui-magic-core/static';

function SiteLayout() {
  const [content, setContent] = useState('главная');
  const [userData, setUserData] = useState(null);
  const [theme, setTheme] = useState('светлая');

  return (
    <div className="website-layout">
      {/* Статический заголовок - никогда не перерендерится независимо от изменений контента */}
      <Static>
        <header className="site-header">
          <div className="logo">
            <img src="/logo.png" alt="Логотип компании" />
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

      {/* Динамический контент, который часто изменяется */}
      <main className="content">
        {content === 'главная' && <HomePage />}
        {content === 'продукты' && <ProductsPage />}
        {content === 'онас' && <AboutPage />}
      </main>

      {/* Статический подвал - перерендерится только при изменении темы */}
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
                <a href="/vk">ВКонтакте</a>
                <a href="/telegram">Telegram</a>
                <a href="/youtube">YouTube</a>
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

### Сложная панель администратора со статической боковой панелью

```tsx
import { Static } from 'ui-magic-core/static';

function AdminPanel() {
  const [currentPage, setCurrentPage] = useState('аналитика');
  const [dashboardData, setDashboardData] = useState({});
  const [user, setUser] = useState({ имя: 'Алексей', роль: 'админ' });

  return (
    <div className="admin-dashboard">
      {/* Статическая боковая панель - не изменяется, пока не изменятся данные пользователя */}
      <Static deps={[user]}>
        <aside className="dashboard-sidebar">
          <div className="user-profile">
            <img src={user.аватар || '/default-avatar.png'} alt="Профиль" />
            <div className="user-info">
              <h3>{user.имя}</h3>
              <span className="user-role">{user.роль}</span>
            </div>
          </div>

          <nav className="sidebar-navigation">
            <ul>
              <li className={currentPage === 'аналитика' ? 'active' : ''}>
                <button onClick={() => setCurrentPage('аналитика')}>
                  📊 Аналитика
                </button>
              </li>
              <li className={currentPage === 'пользователи' ? 'active' : ''}>
                <button onClick={() => setCurrentPage('пользователи')}>
                  👥 Пользователи
                </button>
              </li>
              <li className={currentPage === 'контент' ? 'active' : ''}>
                <button onClick={() => setCurrentPage('контент')}>
                  📝 Контент
                </button>
              </li>
              <li className={currentPage === 'настройки' ? 'active' : ''}>
                <button onClick={() => setCurrentPage('настройки')}>
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

      {/* Динамическая область контента */}
      <main className="dashboard-content">
        <header className="content-header">
          <h1>{getPageTitle(currentPage)}</h1>
          <div className="header-actions">
            <button className="refresh-btn">Обновить</button>
            <button className="export-btn">Экспорт</button>
          </div>
        </header>

        <div className="content-body">
          {currentPage === 'аналитика' && <AnalyticsPage data={dashboardData} />}
          {currentPage === 'пользователи' && <UsersPage />}
          {currentPage === 'контент' && <ContentPage />}
          {currentPage === 'настройки' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}
```

### Интернет-магазин с сеткой товаров и статическими фильтрами

```tsx
import { Static } from 'ui-magic-core/static';

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    категория: 'все',
    ценовойДиапазон: [0, 10000],
    бренд: 'все'
  });
  const [sortBy, setSortBy] = useState('название');
  const [categories, setCategories] = useState([
    'Электроника',
'Одежда',
'Дом и сад',
'Спорт'
  ]);

  return (
    <div className="product-catalog">
      {/* Статическая боковая панель фильтров - обновляется только при изменении категорий */}
      <Static deps={[categories]}>
        <aside className="filter-sidebar">
          <div className="filter-section">
            <h3>Фильтры</h3>

            <div className="filter-group">
              <label>Категория</label>
              <select
                value={filters.категория}
                onChange={e => setFilters(prev => ({ ...prev, категория: e.target.value }))}
              >
                <option value="все">Все категории</option>
                {categories.map(категория => (
                  <option key={категория} value={категория}>
                    {категория}
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
                  max="50000"
                  value={filters.ценовойДиапазон[1]}
                  onChange={e => setFilters(prev => ({
                    ...prev,
                    ценовойДиапазон: [0, Number.parseInt(e.target.value)]
                  }))}
                />
                <span>
До
{filters.ценовойДиапазон[1]}
₽
                </span>
              </div>
            </div>

            <div className="filter-group">
              <label>Бренд</label>
              <select
                value={filters.бренд}
                onChange={e => setFilters(prev => ({ ...prev, бренд: e.target.value }))}
              >
                <option value="все">Все бренды</option>
                <option value="samsung">Samsung</option>
                <option value="apple">Apple</option>
                <option value="xiaomi">Xiaomi</option>
              </select>
            </div>

            <button
              className="clear-filters-btn"
              onClick={() => setFilters({ категория: 'все', ценовойДиапазон: [0, 10000], бренд: 'все' })}
            >
              Очистить фильтры
            </button>
          </div>

          <div className="popular-categories">
            <h4>Популярные категории</h4>
            <ul>
              {categories.slice(0, 4).map(категория => (
                <li key={категория}>
                  <a href={`/category/${категория}`}>{категория}</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </Static>

      {/* Динамическая сетка товаров, которая обновляется с фильтрами */}
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
              <option value="название">Названию</option>
              <option value="цена">Цене</option>
              <option value="рейтинг">Рейтингу</option>
              <option value="дата">Дате добавления</option>
            </select>
          </div>
        </div>

        <div className="product-grid">
          {products.map(товар => (
            <ProductCard key={товар.id} товар={товар} />
          ))}
        </div>
      </main>
    </div>
  );
}
```

## Справочник API

### StaticProps

| Проп       | Тип          | Обязательный | По умолчанию | Описание                                              |
|------------|--------------|--------------|--------------|-------------------------------------------------------|
| `children` | `ReactNode`  | ✅           | -            | Контент для рендеринга со статической оптимизацией  |
| `deps`     | `any[]`      | ❌           | -            | Зависимости, которые вызывают перерендер при изменении |

### Руководство по использованию

#### Без зависимостей
Когда `deps` не предоставлен, компонент **никогда** не будет перерендериваться после первоначального монтирования:
```tsx
<Static>
  <ExpensiveComponent />
</Static>;
```

#### С зависимостями
Когда `deps` предоставлен, перерендеры происходят только при изменении зависимостей:
```tsx
<Static deps={[theme, user.id]}>
  <UserProfile theme={theme} userId={user.id} />
</Static>;
```

## Лучшие практики

### Производительность
- **Минимальные перерендеры**: Используйте только при необходимости
- **Оптимизация оверлея**: Поддерживайте лёгкий контент оверлея
- **Мониторинг размера бандла**: Следите за влиянием мемоизации на размер
- **Баланс накладных расходов**: Сравнивайте стоимость компонента с накладными расходами мемоизации

### Пользовательский опыт
- **Определение тяжёлых компонентов**: Используйте React DevTools Profiler для поиска дорогих рендеров
- **Стратегические зависимости**: Включайте только значения, которые действительно влияют на рендеринг
- **Поверхностные vs глубокие зависимости**: Используйте примитивные значения или стабильные ссылки в deps
- **Использование памяти**: Балансируйте преимущества мемоизации с накладными расходами памяти

## Связанные компоненты
- [`memo`](../memo/README.md) - Для React.memo с пользовательским сравнением
- [`cache`](../cache/README.md) - Для кэширования данных и вычислений
- [`lazy`](../lazy/README.md) - Для разделения кода и ленивой загрузки
