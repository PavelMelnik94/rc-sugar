# Компонент MicroRoute

Лёгкое, гибкое решение для микро-маршрутизации в React приложениях, обеспечивающее сопоставление паттернов, извлечение параметров и возможности вложенной маршрутизации без сложности полнофункциональных роутеров.

## Описание

Компонент `MicroRoute` предлагает минималистичный подход к клиентской маршрутизации, идеальный для небольших приложений, маршрутизации на уровне компонентов, виджетов или сценариев, где нужно простое сопоставление путей без тяжёлых зависимостей. Он поддерживает параметризованные маршруты, точное сопоставление и включает компонент `NotFound` для обработки несовпадающих путей. В отличие от полнофункциональных роутеров, MicroRoute фокусируется на сопоставлении паттернов и извлечении параметров в рамках отдельных компонентов.

## Когда использовать

### Идеально подходит для
- **Небольших приложений**: Простые приложения, которые не нуждаются в сложной маршрутизации
- **Маршрутизации на уровне компонентов**: Логика маршрутизации, содержащаяся в определённых компонентах
- **Микро-фронтендов**: Изолированная маршрутизация для виджет-подобных компонентов
- **Встроенных виджетов**: Компоненты, которые нуждаются в собственной логике маршрутизации
- **Сценариев тестирования**: Упрощённая маршрутизация для тестирования компонентов
- **Плагинных систем**: Плагины, которые нуждаются в возможностях внутренней маршрутизации
- **Маршрутизации модалок/диалогов**: Внутренняя маршрутизация в модалках или сложных диалогах
- **Динамического контента**: Показ различного контента на основе простых паттернов путей

### Избегайте, когда
- Сложная вложенная маршрутизация с множественными уровнями
- Продвинутые функции маршрутизации (охранники, ленивая загрузка и т.д.)
- Полная маршрутизация приложения (используйте React Router, Next.js и т.д.)
- Необходимость управления историей маршрутизации и браузерной навигации

## Используемые паттерны
- **Сопоставление паттернов**: Использует regex паттерны для сопоставления путей
- **Извлечение параметров**: Автоматически извлекает параметры маршрута из путей
- **Паттерн render props**: Предоставляет параметры функциям рендеринга
- **Паттерн композиции**: Поддерживает вложенные компоненты, такие как NotFound
- **Типобезопасная маршрутизация**: Полная поддержка TypeScript с параметризованными типами

## TypeScript интерфейс

```typescript
/**
 * Параметры маршрута, извлечённые из пути
 */
type RouteParams = Record<string, string>;

/**
 * Свойства для компонента MicroRoute
 */
interface MicroRouteProps {
  /**
   * Паттерн пути с опциональными параметрами (например, "/user/:id")
   */
  path: string;
  /**
   * Текущий путь для сопоставления
   * Если не предоставлен, использует внутреннее состояние
   */
  currentPath?: string;
  /**
   * Функция рендеринга, получающая параметры маршрута
   */
  children: (params: RouteParams) => ReactNode;
  /**
   * Следует ли точно сопоставлять путь или разрешать частичные совпадения
   * @default true
   */
  exact?: boolean;
}

/**
 * Свойства для компонента NotFound
 */
interface NotFoundProps {
  /**
   * Контент для рендеринга, когда ни один маршрут не совпадает
   */
  children: ReactNode;
}
```

## Справочник API

### Компонент MicroRoute
| Свойство | Тип | Обязательно | Описание |
|----------|-----|-------------|----------|
| `path` | `string` | ✅ | Паттерн пути с опциональными параметрами (например, "/user/:id") |
| `currentPath` | `string` | ❌ | Текущий путь для сопоставления. Если не предоставлен, использует внутреннее состояние |
| `children` | `(params: RouteParams) => ReactNode` | ✅ | Функция рендеринга, получающая извлечённые параметры |
| `exact` | `boolean` | ❌ | Следует ли точно сопоставлять путь (по умолчанию: true) |

### Компонент NotFound
| Свойство | Тип | Обязательно | Описание |
|----------|-----|-------------|----------|
| `children` | `ReactNode` | ✅ | Контент для рендеринга, когда ни один маршрут не совпадает |

## Примеры

### Базовая маршрутизация профиля пользователя
```tsx
import { MicroRoute } from 'ui-magic-core';

interface User {
  id: string;
  name: string;
  email: string;
}

function UserWidget({ currentPath }: { currentPath: string }) {
  return (
    <div className="user-widget">
      <MicroRoute path="/user/:id" currentPath={currentPath}>
        {({ id }) => <UserProfile userId={id} />}
      </MicroRoute>

      <MicroRoute path="/user/:id/settings" currentPath={currentPath}>
        {({ id }) => <UserSettings userId={id} />}
      </MicroRoute>

      <MicroRoute path="/users" currentPath={currentPath}>
        {() => <UserList />}
      </MicroRoute>

      <MicroRoute path="/" currentPath={currentPath}>
        {() => (
          <div>
            <h2>Добро пожаловать</h2>
            <p>Выберите пользователя для просмотра профиля</p>
          </div>
        )}
      </MicroRoute>
    </div>
  );
}

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUser(userId).then((userData) => {
      setUser(userData);
      setIsLoading(false);
    });
  }, [userId]);

  if (isLoading)
return <div>Загружается пользователь...</div>;
  if (!user)
return <div>Пользователь не найден</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>
Email:
{user.email}
      </p>
      <p>
ID:
{user.id}
      </p>
    </div>
  );
}
```

### Браузер товаров для электронной коммерции
```tsx
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

function ProductBrowser({ currentRoute }: { currentRoute: string }) {
  return (
    <div className="product-browser">
      {/* Список категорий */}
      <MicroRoute path="/category/:categoryName" currentPath={currentRoute}>
        {({ categoryName }) => (
          <CategoryProducts category={decodeURIComponent(categoryName)} />
        )}
      </MicroRoute>

      {/* Отдельный товар */}
      <MicroRoute path="/product/:productId" currentPath={currentRoute}>
        {({ productId }) => <ProductDetails productId={productId} />}
      </MicroRoute>

      {/* Сравнение товаров */}
      <MicroRoute path="/compare/:productId1/:productId2" currentPath={currentRoute}>
        {({ productId1, productId2 }) => (
          <ProductComparison
            productId1={productId1}
            productId2={productId2}
          />
        )}
      </MicroRoute>

      {/* Результаты поиска */}
      <MicroRoute path="/search/:query" currentPath={currentRoute}>
        {({ query }) => (
          <SearchResults searchTerm={decodeURIComponent(query)} />
        )}
      </MicroRoute>

      {/* Главная страница */}
      <MicroRoute path="/" currentPath={currentRoute}>
        {() => (
          <div className="product-home">
            <h2>Рекомендуемые товары</h2>
            <FeaturedProducts />
            <CategoryGrid />
          </div>
        )}
      </MicroRoute>
    </div>
  );
}

function CategoryProducts({ category }: { category: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProductsByCategory(category).then((categoryProducts) => {
      setProducts(categoryProducts);
      setIsLoading(false);
    });
  }, [category]);

  if (isLoading)
return <ProductSkeleton />;

  return (
    <div className="category-products">
      <h2>
Товары категории
{category}
      </h2>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductDetails({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProduct(productId).then(setProduct);
  }, [productId]);

  if (!product)
return <div>Загружается товар...</div>;

  return (
    <div className="product-details">
      <h1>{product.name}</h1>
      <p className="price">
{product.price}
{' '}
₽
      </p>
      <p className="category">
Категория:
{product.category}
      </p>
      <p className="description">{product.description}</p>
      <button className="add-to-cart">Добавить в корзину</button>
    </div>
  );
}
```

### Просмотрщик документов с разделами
```tsx
interface Document {
  id: string;
  title: string;
  sections: DocumentSection[];
}

interface DocumentSection {
  id: string;
  title: string;
  content: string;
}

function DocumentViewer({ documentPath }: { documentPath: string }) {
  return (
    <div className="document-viewer">
      <MicroRoute path="/doc/:docId" currentPath={documentPath}>
        {({ docId }) => <FullDocument documentId={docId} />}
      </MicroRoute>

      <MicroRoute path="/doc/:docId/section/:sectionId" currentPath={documentPath}>
        {({ docId, sectionId }) => (
          <DocumentSection documentId={docId} sectionId={sectionId} />
        )}
      </MicroRoute>

      <MicroRoute path="/doc/:docId/edit" currentPath={documentPath}>
        {({ docId }) => <DocumentEditor documentId={docId} />}
      </MicroRoute>

      <MicroRoute path="/docs" currentPath={documentPath}>
        {() => <DocumentList />}
      </MicroRoute>

      {/* Запасной вариант NotFound */}
      <MicroRoute path="*" currentPath={documentPath}>
        {() => (
          <div className="not-found">
            <h2>Страница не найдена</h2>
            <p>Запрошенный документ или раздел не может быть найден.</p>
            <button onClick={() => navigateTo('/docs')}>
              Просмотреть все документы
            </button>
          </div>
        )}
      </MicroRoute>
    </div>
  );
}

function FullDocument({ documentId }: { documentId: string }) {
  const [document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    getDocument(documentId).then(setDocument);
  }, [documentId]);

  if (!document)
return <div>Загружается документ...</div>;

  return (
    <div className="full-document">
      <header className="document-header">
        <h1>{document.title}</h1>
        <nav className="section-nav">
          {document.sections.map(section => (
            <a
              key={section.id}
              href={`#section-${section.id}`}
              className="section-link"
            >
              {section.title}
            </a>
          ))}
        </nav>
      </header>

      <div className="document-content">
        {document.sections.map(section => (
          <section key={section.id} id={`section-${section.id}`}>
            <h2>{section.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </section>
        ))}
      </div>
    </div>
  );
}
```

### Панель администратора с многоуровневой маршрутизацией
```tsx
interface DashboardStats {
  users: number;
  sales: number;
  revenue: number;
}

function AdminDashboard({ currentRoute }: { currentRoute: string }) {
  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <button onClick={() => navigateTo('/admin')}>Панель</button>
        <button onClick={() => navigateTo('/admin/users')}>Пользователи</button>
        <button onClick={() => navigateTo('/admin/reports')}>Отчёты</button>
        <button onClick={() => navigateTo('/admin/settings')}>Настройки</button>
      </nav>

      <main className="admin-content">
        <MicroRoute path="/admin" currentPath={currentRoute}>
          {() => <DashboardOverview />}
        </MicroRoute>

        <MicroRoute path="/admin/users" currentPath={currentRoute}>
          {() => <UserManagement />}
        </MicroRoute>

        <MicroRoute path="/admin/users/:userId" currentPath={currentRoute}>
          {({ userId }) => <UserDetails userId={userId} />}
        </MicroRoute>

        <MicroRoute path="/admin/users/:userId/edit" currentPath={currentRoute}>
          {({ userId }) => <UserEditor userId={userId} />}
        </MicroRoute>

        <MicroRoute path="/admin/reports" currentPath={currentRoute}>
          {() => <ReportsOverview />}
        </MicroRoute>

        <MicroRoute path="/admin/reports/:reportType" currentPath={currentRoute}>
          {({ reportType }) => (
            <ReportViewer reportType={reportType as ReportType} />
          )}
        </MicroRoute>

        <MicroRoute path="/admin/reports/:reportType/:dateRange" currentPath={currentRoute}>
          {({ reportType, dateRange }) => (
            <DetailedReport
              reportType={reportType as ReportType}
              dateRange={dateRange}
            />
          )}
        </MicroRoute>

        <MicroRoute path="/admin/settings" currentPath={currentRoute}>
          {() => <AdminSettings />}
        </MicroRoute>

        <MicroRoute path="/admin/settings/:section" currentPath={currentRoute}>
          {({ section }) => <SettingsSection section={section} />}
        </MicroRoute>
      </main>
    </div>
  );
}

function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats)
return <div>Загружается панель...</div>;

  return (
    <div className="dashboard-overview">
      <h1>Панель администратора</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Всего пользователей</h3>
          <span className="stat-value">{stats.users.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <h3>Всего продаж</h3>
          <span className="stat-value">{stats.sales.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <h3>Выручка</h3>
          <span className="stat-value">
{stats.revenue.toLocaleString()}
{' '}
₽
          </span>
        </div>
      </div>
    </div>
  );
}
```

### Чат-приложение с маршрутизацией комнат
```tsx
interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
}

interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
}

function ChatApp({ currentPath }: { currentPath: string }) {
  return (
    <div className="chat-app">
      <aside className="chat-sidebar">
        <RoomList />
      </aside>

      <main className="chat-main">
        <MicroRoute path="/chat" currentPath={currentPath}>
          {() => (
            <div className="welcome-view">
              <h2>Добро пожаловать в чат</h2>
              <p>Выберите комнату, чтобы начать общение</p>
            </div>
          )}
        </MicroRoute>

        <MicroRoute path="/chat/room/:roomId" currentPath={currentPath}>
          {({ roomId }) => <ChatRoom roomId={roomId} />}
        </MicroRoute>

        <MicroRoute path="/chat/dm/:userId" currentPath={currentPath}>
          {({ userId }) => <DirectMessage userId={userId} />}
        </MicroRoute>

        <MicroRoute path="/chat/room/:roomId/settings" currentPath={currentPath}>
          {({ roomId }) => <RoomSettings roomId={roomId} />}
        </MicroRoute>

        <MicroRoute path="/chat/user/:userId" currentPath={currentPath}>
          {({ userId }) => <ChatUserProfile userId={userId} />}
        </MicroRoute>
      </main>
    </div>
  );
}

function ChatRoom({ roomId }: { roomId: string }) {
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Загружаем данные комнаты и сообщения
    Promise.all([
      getChatRoom(roomId),
      getRoomMessages(roomId)
    ]).then(([roomData, messagesData]) => {
      setRoom(roomData);
      setMessages(messagesData);
    });

    // Настраиваем подписку на сообщения в реальном времени
    const unsubscribe = subscribeToRoomMessages(roomId, (message) => {
      setMessages(prev => [...prev, message]);
    });

    return unsubscribe;
  }, [roomId]);

  const sendMessage = () => {
    if (!newMessage.trim())
return;

    const message: Message = {
      id: Date.now().toString(),
      userId: getCurrentUserId(),
      content: newMessage,
      timestamp: Date.now()
    };

    sendChatMessage(roomId, message);
    setNewMessage('');
  };

  if (!room)
return <div>Загружается комната...</div>;

  return (
    <div className="chat-room">
      <header className="room-header">
        <h2>{room.name}</h2>
        <div className="room-participants">
          {room.participants.length}
{' '}
участников
        </div>
        <button onClick={() => navigateTo(`/chat/room/${roomId}/settings`)}>
          Настройки
        </button>
      </header>

      <div className="messages-container">
        {messages.map(message => (
          <div key={message.id} className="message">
            <span className="message-user">{message.userId}</span>
            <span className="message-content">{message.content}</span>
            <span className="message-time">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Введите сообщение..."
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
}
```

### Многошаговая форма с маршрутизацией на основе шагов
```tsx
interface FormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    theme: 'light' | 'dark';
  };
  paymentInfo: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}

function MultiStepFormWizard({ currentStep }: { currentStep: string }) {
  const [formData, setFormData] = useState<Partial<FormData>>({});

  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  return (
    <div className="form-wizard">
      <div className="wizard-header">
        <StepIndicator currentStep={currentStep} />
      </div>

      <div className="wizard-content">
        <MicroRoute path="/form/step1" currentPath={currentStep}>
          {() => (
            <PersonalInfoStep
              data={formData.personalInfo}
              onUpdate={data => updateFormData('personalInfo', data)}
              onNext={() => navigateTo('/form/step2')}
            />
          )}
        </MicroRoute>

        <MicroRoute path="/form/step2" currentPath={currentStep}>
          {() => (
            <PreferencesStep
              data={formData.preferences}
              onUpdate={data => updateFormData('preferences', data)}
              onNext={() => navigateTo('/form/step3')}
              onBack={() => navigateTo('/form/step1')}
            />
          )}
        </MicroRoute>

        <MicroRoute path="/form/step3" currentPath={currentStep}>
          {() => (
            <PaymentInfoStep
              data={formData.paymentInfo}
              onUpdate={data => updateFormData('paymentInfo', data)}
              onNext={() => navigateTo('/form/review')}
              onBack={() => navigateTo('/form/step2')}
            />
          )}
        </MicroRoute>

        <MicroRoute path="/form/review" currentPath={currentStep}>
          {() => (
            <ReviewStep
              formData={formData}
              onSubmit={() => submitForm(formData)}
              onBack={() => navigateTo('/form/step3')}
            />
          )}
        </MicroRoute>

        <MicroRoute path="/form/success" currentPath={currentStep}>
          {() => (
            <SuccessStep onStartOver={() => navigateTo('/form/step1')} />
          )}
        </MicroRoute>

        {/* По умолчанию на шаг 1 */}
        <MicroRoute path="/form" currentPath={currentStep}>
          {() => {
            navigateTo('/form/step1');
            return null;
          }}
        </MicroRoute>
      </div>
    </div>
  );
}

function PersonalInfoStep({ data, onUpdate, onNext }: {
  data?: FormData['personalInfo'];
  onUpdate: (data: Partial<FormData['personalInfo']>) => void;
  onNext: () => void;
}) {
  const [firstName, setFirstName] = useState(data?.firstName || '');
  const [lastName, setLastName] = useState(data?.lastName || '');
  const [email, setEmail] = useState(data?.email || '');

  const handleNext = () => {
    onUpdate({ firstName, lastName, email });
    onNext();
  };

  const isValid = firstName && lastName && email;

  return (
    <div className="form-step">
      <h2>Личная информация</h2>

      <div className="form-group">
        <label htmlFor="firstName">Имя</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Фамилия</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={handleNext}
          disabled={!isValid}
        >
          Далее
        </button>
      </div>
    </div>
  );
}
```

## Соображения производительности

### Стратегии оптимизации
```typescript
// Мемоизируйте компоненты маршрутов для предотвращения ненужных перерендеров
const MemoizedRoute = React.memo(MicroRoute);

// Используйте ленивую загрузку для конкретных маршрутов
function LazyRoute({ path, component: Component, ...props }: {
  path: string;
  component: React.ComponentType<any>;
  [key: string]: any;
}) {
  return (
    <MicroRoute path={path}>
      {(params) => (
        <React.Suspense fallback={<div>Загрузка...</div>}>
          <Component {...props} params={params} />
        </React.Suspense>
      )}
    </MicroRoute>
  );
}

// Оптимизируйте извлечение параметров для сложных паттернов
const useMemoizedParams = (path: string, pattern: string) => {
  return useMemo(() => {
    return extractParams(path, pattern);
  }, [path, pattern]);
};
```

### Управление памятью
```typescript
// Очищайте ресурсы при изменении маршрутов
function useRouteCleanup(routeParams: RouteParams, cleanup: () => void) {
  const previousParams = useRef(routeParams);

  useEffect(() => {
    if (JSON.stringify(previousParams.current) !== JSON.stringify(routeParams)) {
      cleanup();
      previousParams.current = routeParams;
    }
  }, [routeParams, cleanup]);
}

// Дебаунс изменений маршрутов для лучшей производительности
function useDebouncedRoute(path: string, delay: number = 200) {
  const [debouncedPath, setDebouncedPath] = useState(path);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPath(path);
    }, delay);

    return () => clearTimeout(timer);
  }, [path, delay]);

  return debouncedPath;
}
```

## Лучшие практики

### Делайте ✅
```typescript
// Используйте описательные паттерны маршрутов
<MicroRoute path="/user/:userId/profile">
  {({ userId }) => <UserProfile id={userId} />}
</MicroRoute>

// Обрабатывайте состояния загрузки и ошибок
<MicroRoute path="/product/:productId">
  {({ productId }) => (
    <AsyncProductLoader
      productId={productId}
      fallback={<ProductSkeleton />}
      onError={<ProductNotFound />}
    />
  )}
</MicroRoute>

// Используйте TypeScript для безопасности параметров
interface ProductParams {
  productId: string;
  categoryId?: string;
}

<MicroRoute path="/category/:categoryId/product/:productId">
  {(params: ProductParams) => (
    <ProductView
      productId={params.productId}
      categoryId={params.categoryId}
    />
  )}
</MicroRoute>

// Предоставляйте значимые компоненты NotFound
<MicroRoute path="/user/:id">
  {({ id }) => <UserProfile userId={id} />}
  <MicroRoute.NotFound>
    <div>
      <h2>Пользователь не найден</h2>
      <p>Пользователь, которого вы ищете, не существует.</p>
      <button onClick={() => navigateTo('/users')}>
        Просмотреть всех пользователей
      </button>
    </div>
  </MicroRoute.NotFound>
</MicroRoute>
```

### Не делайте ❌
```typescript
// Не игнорируйте валидацию параметров
<MicroRoute path="/user/:id">
  {({ id }) => (
    <UserProfile userId={id} /> // ❌ Нет валидации формата id
  )}
</MicroRoute>

// Не создавайте сложные вложенные иерархии маршрутов
<MicroRoute path="/a/:b/c/:d/e/:f/g/:h"> // ❌ Слишком сложно для микро-маршрутизации
  {(params) => <TooNestedComponent {...params} />}
</MicroRoute>

// Не забывайте обрабатывать граничные случаи
<MicroRoute path="/search/:query">
  {({ query }) => (
    <SearchResults query={query} /> // ❌ Что если запрос пустой?
  )}
</MicroRoute>

// Не используйте микро-маршрутизацию для полной маршрутизации приложения
// ❌ Используйте подходящие библиотеки маршрутизации для сложных приложений
```

## Руководство по миграции

### От условного рендеринга
```typescript
// Раньше: Сложное условное рендеринг
function ContentArea({ currentView, userId, productId }) {
  if (currentView === 'user' && userId) {
    return <UserProfile userId={userId} />;
  }
  if (currentView === 'product' && productId) {
    return <ProductDetails productId={productId} />;
  }
  if (currentView === 'home') {
    return <HomePage />;
  }
  return <NotFound />;
}

// Сейчас: Маршрутизация на основе MicroRoute
function ContentArea({ currentPath }) {
  return (
    <div>
      <MicroRoute path="/user/:userId" currentPath={currentPath}>
        {({ userId }) => <UserProfile userId={userId} />}
      </MicroRoute>

      <MicroRoute path="/product/:productId" currentPath={currentPath}>
        {({ productId }) => <ProductDetails productId={productId} />}
      </MicroRoute>

      <MicroRoute path="/" currentPath={currentPath}>
        {() => <HomePage />}
      </MicroRoute>

      <MicroRoute path="*" currentPath={currentPath}>
        {() => <NotFound />}
      </MicroRoute>
    </div>
  );
}
```

### От switch-конструкций
```typescript
// Раньше: Маршрутизация на основе switch
function renderContent(route: string, params: any) {
  switch (route) {
    case 'dashboard':
      return <Dashboard />;
    case 'user-profile':
      return <UserProfile userId={params.userId} />;
    case 'settings':
      return <Settings section={params.section} />;
    default:
      return <NotFound />;
  }
}

// Сейчас: Паттерн сопоставления MicroRoute
function ContentRenderer({ currentPath }: { currentPath: string }) {
  return (
    <>
      <MicroRoute path="/dashboard" currentPath={currentPath}>
        {() => <Dashboard />}
      </MicroRoute>

      <MicroRoute path="/user/:userId" currentPath={currentPath}>
        {({ userId }) => <UserProfile userId={userId} />}
      </MicroRoute>

      <MicroRoute path="/settings/:section" currentPath={currentPath}>
        {({ section }) => <Settings section={section} />}
      </MicroRoute>

      <MicroRoute path="*" currentPath={currentPath}>
        {() => <NotFound />}
      </MicroRoute>
    </>
  );
}
```

## Связанные компоненты
- [`if`](../if/README.md) - Для простого условного рендеринга
- [`switch`](../switch/README.md) - Для мульти-условного рендеринга
- [`when`](../when/README.md) - Для сложной условной логики

## Доступность

Компонент `MicroRoute` поддерживает доступность при обеспечении маршрутизации:

```typescript
// Обеспечьте правильные ARIA-метки и роли
<MicroRoute path="/section/:sectionId" currentPath={currentPath}>
  {({ sectionId }) => (
    <section
      role="main"
      aria-labelledby={`section-${sectionId}-title`}
      aria-live="polite"
    >
      <h1 id={`section-${sectionId}-title`}>
        Раздел {sectionId}
      </h1>
      <SectionContent sectionId={sectionId} />
    </section>
  )}
</MicroRoute>

// Обрабатывайте управление фокусом при изменении маршрутов
function useRouteFocus(routeParams: RouteParams) {
  useEffect(() => {
    // Фокус на основном контенте при изменении маршрута
    const mainElement = document.querySelector('[role="main"]');
    if (mainElement) {
      (mainElement as HTMLElement).focus();
    }
  }, [routeParams]);
}

// Предоставьте ссылки пропуска для клавиатурной навигации
<MicroRoute path="/complex-page/:pageId" currentPath={currentPath}>
  {({ pageId }) => (
    <div>
      <a href="#main-content" className="skip-link">
        Перейти к основному контенту
      </a>
      <nav aria-label="Навигация по странице">
        <PageNavigation pageId={pageId} />
      </nav>
      <main id="main-content" tabIndex={-1}>
        <PageContent pageId={pageId} />
      </main>
    </div>
  )}
</MicroRoute>
```

Компонент `MicroRoute` предоставляет лёгкое, гибкое решение для маршрутизации на уровне компонентов в React приложениях, идеальное для виджетов, небольших приложений и сценариев, где полнофункциональная маршрутизация излишна.
