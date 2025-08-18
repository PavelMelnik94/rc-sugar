# MicroRoute Component

A lightweight, flexible micro-routing solution for React applications, providing pattern matching, parameter extraction, and nested routing capabilities without the complexity of full-featured routers.

## Description

The `MicroRoute` component offers a minimalist approach to client-side routing, perfect for small applications, component-level routing, widgets, or scenarios where you need simple path matching without heavy dependencies. It supports parameterized routes, exact matching, and includes a `NotFound` component for handling unmatched paths. Unlike full-featured routers, MicroRoute focuses on pattern matching and parameter extraction within individual components.

## When to Use

### Perfect For
- **Small Applications**: Simple apps that don't need complex routing
- **Component-Level Routing**: Routing logic contained within specific components
- **Micro-Frontends**: Isolated routing for widget-like components
- **Embedded Widgets**: Components that need their own routing logic
- **Testing Scenarios**: Simplified routing for component testing
- **Plugin Systems**: Plugins that need internal routing capabilities
- **Modal/Dialog Routing**: Internal routing within modals or complex dialogs
- **Dynamic Content**: Showing different content based on simple path patterns

### Avoid When
- Complex nested routing with multiple levels
- Advanced routing features (guards, lazy loading, etc.)
- Full application routing (use React Router, Next.js, etc.)
- Need for routing history management and browser navigation

## Patterns Used
- **Pattern Matching**: Uses regex patterns for path matching
- **Parameter Extraction**: Automatically extracts route parameters from paths
- **Render Props Pattern**: Provides parameters to render functions
- **Composition Pattern**: Supports nested components like NotFound
- **Type-Safe Routing**: Full TypeScript support with parameterized types

## TypeScript Interface

```typescript
/**
 * Route parameters extracted from path
 */
type RouteParams = Record<string, string>;

/**
 * Props for the MicroRoute component
 */
interface MicroRouteProps {
  /**
   * Path pattern with optional parameters (e.g., "/user/:id")
   */
  path: string;
  /**
   * Current path to match against
   * If not provided, uses internal state
   */
  currentPath?: string;
  /**
   * Render function that receives route parameters
   */
  children: (params: RouteParams) => ReactNode;
  /**
   * Whether to match exact path or allow partial matches
   * @default true
   */
  exact?: boolean;
}

/**
 * Props for the NotFound component
 */
interface NotFoundProps {
  /**
   * Content to render when no routes match
   */
  children: ReactNode;
}
```

## API Reference

### MicroRoute Component
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `path` | `string` | ✅ | Path pattern with optional parameters (e.g., "/user/:id") |
| `currentPath` | `string` | ❌ | Current path to match against. If not provided, uses internal state |
| `children` | `(params: RouteParams) => ReactNode` | ✅ | Render function receiving extracted parameters |
| `exact` | `boolean` | ❌ | Whether to match exact path (default: true) |

### NotFound Component
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | ✅ | Content to render when no routes match |

## Examples

### Basic User Profile Routing
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
            <h2>Welcome</h2>
            <p>Select a user to view their profile</p>
          </div>
        )}
      </MicroRoute>
    </div>
  );
}

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then((userData) => {
      setUser(userData);
      setLoading(false);
    });
  }, [userId]);

  if (loading)
return <div>Loading user...</div>;
  if (!user)
return <div>User not found</div>;

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

### E-commerce Product Browser
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
      {/* Category listing */}
      <MicroRoute path="/category/:categoryName" currentPath={currentRoute}>
        {({ categoryName }) => (
          <CategoryProducts category={decodeURIComponent(categoryName)} />
        )}
      </MicroRoute>

      {/* Individual product */}
      <MicroRoute path="/product/:productId" currentPath={currentRoute}>
        {({ productId }) => <ProductDetails productId={productId} />}
      </MicroRoute>

      {/* Product comparison */}
      <MicroRoute path="/compare/:productId1/:productId2" currentPath={currentRoute}>
        {({ productId1, productId2 }) => (
          <ProductComparison
            productId1={productId1}
            productId2={productId2}
          />
        )}
      </MicroRoute>

      {/* Search results */}
      <MicroRoute path="/search/:query" currentPath={currentRoute}>
        {({ query }) => (
          <SearchResults searchTerm={decodeURIComponent(query)} />
        )}
      </MicroRoute>

      {/* Home page */}
      <MicroRoute path="/" currentPath={currentRoute}>
        {() => (
          <div className="product-home">
            <h2>Featured Products</h2>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsByCategory(category).then((categoryProducts) => {
      setProducts(categoryProducts);
      setLoading(false);
    });
  }, [category]);

  if (loading)
return <ProductsSkeleton />;

  return (
    <div className="category-products">
      <h2>
{category}
{' '}
Products
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
    fetchProduct(productId).then(setProduct);
  }, [productId]);

  if (!product)
return <div>Loading product...</div>;

  return (
    <div className="product-details">
      <h1>{product.name}</h1>
      <p className="price">
$
{product.price}
      </p>
      <p className="category">
Category:
{product.category}
      </p>
      <p className="description">{product.description}</p>
      <button className="add-to-cart">Add to Cart</button>
    </div>
  );
}
```

### Document Viewer with Sections
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
      {/* View entire document */}
      <MicroRoute path="/doc/:docId" currentPath={documentPath}>
        {({ docId }) => <FullDocument documentId={docId} />}
      </MicroRoute>

      {/* View specific section */}
      <MicroRoute path="/doc/:docId/section/:sectionId" currentPath={documentPath}>
        {({ docId, sectionId }) => (
          <DocumentSection documentId={docId} sectionId={sectionId} />
        )}
      </MicroRoute>

      {/* Edit document */}
      <MicroRoute path="/doc/:docId/edit" currentPath={documentPath}>
        {({ docId }) => <DocumentEditor documentId={docId} />}
      </MicroRoute>

      {/* Document list */}
      <MicroRoute path="/docs" currentPath={documentPath}>
        {() => <DocumentList />}
      </MicroRoute>

      {/* NotFound fallback */}
      <MicroRoute path="*" currentPath={documentPath}>
        {() => (
          <div className="not-found">
            <h2>Page Not Found</h2>
            <p>The requested document or section could not be found.</p>
            <button onClick={() => navigateTo('/docs')}>
              View All Documents
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
    fetchDocument(documentId).then(setDocument);
  }, [documentId]);

  if (!document)
return <div>Loading document...</div>;

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

### Admin Dashboard with Multi-Level Routing
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
        <button onClick={() => navigateTo('/admin')}>Dashboard</button>
        <button onClick={() => navigateTo('/admin/users')}>Users</button>
        <button onClick={() => navigateTo('/admin/reports')}>Reports</button>
        <button onClick={() => navigateTo('/admin/settings')}>Settings</button>
      </nav>

      <main className="admin-content">
        {/* Dashboard overview */}
        <MicroRoute path="/admin" currentPath={currentRoute}>
          {() => <DashboardOverview />}
        </MicroRoute>

        {/* User management */}
        <MicroRoute path="/admin/users" currentPath={currentRoute}>
          {() => <UserManagement />}
        </MicroRoute>

        <MicroRoute path="/admin/users/:userId" currentPath={currentRoute}>
          {({ userId }) => <UserDetails userId={userId} />}
        </MicroRoute>

        <MicroRoute path="/admin/users/:userId/edit" currentPath={currentRoute}>
          {({ userId }) => <UserEditor userId={userId} />}
        </MicroRoute>

        {/* Reports */}
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

        {/* Settings */}
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
    fetchDashboardStats().then(setStats);
  }, []);

  if (!stats)
return <div>Loading dashboard...</div>;

  return (
    <div className="dashboard-overview">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <span className="stat-value">{stats.users.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <h3>Total Sales</h3>
          <span className="stat-value">{stats.sales.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <span className="stat-value">
$
{stats.revenue.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
```

### Chat Application with Room Routing
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

function ChatApplication({ currentPath }: { currentPath: string }) {
  return (
    <div className="chat-app">
      <aside className="chat-sidebar">
        <RoomList />
      </aside>

      <main className="chat-main">
        {/* Room list view */}
        <MicroRoute path="/chat" currentPath={currentPath}>
          {() => (
            <div className="welcome-view">
              <h2>Welcome to Chat</h2>
              <p>Select a room to start chatting</p>
            </div>
          )}
        </MicroRoute>

        {/* Specific chat room */}
        <MicroRoute path="/chat/room/:roomId" currentPath={currentPath}>
          {({ roomId }) => <ChatRoom roomId={roomId} />}
        </MicroRoute>

        {/* Direct message */}
        <MicroRoute path="/chat/dm/:userId" currentPath={currentPath}>
          {({ userId }) => <DirectMessage userId={userId} />}
        </MicroRoute>

        {/* Room settings */}
        <MicroRoute path="/chat/room/:roomId/settings" currentPath={currentPath}>
          {({ roomId }) => <RoomSettings roomId={roomId} />}
        </MicroRoute>

        {/* User profile in chat context */}
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
    // Load room data and messages
    Promise.all([
      fetchChatRoom(roomId),
      fetchRoomMessages(roomId)
    ]).then(([roomData, messagesData]) => {
      setRoom(roomData);
      setMessages(messagesData);
    });

    // Setup real-time message subscription
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
return <div>Loading room...</div>;

  return (
    <div className="chat-room">
      <header className="room-header">
        <h2>{room.name}</h2>
        <div className="room-participants">
          {room.participants.length}
{' '}
participants
        </div>
        <button onClick={() => navigateTo(`/chat/room/${roomId}/settings`)}>
          Settings
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
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
```

### Multi-Step Form with Route-Based Steps
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
        {/* Step 1: Personal Information */}
        <MicroRoute path="/form/step1" currentPath={currentStep}>
          {() => (
            <PersonalInfoStep
              data={formData.personalInfo}
              onUpdate={data => updateFormData('personalInfo', data)}
              onNext={() => navigateTo('/form/step2')}
            />
          )}
        </MicroRoute>

        {/* Step 2: Preferences */}
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

        {/* Step 3: Payment Information */}
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

        {/* Review step */}
        <MicroRoute path="/form/review" currentPath={currentStep}>
          {() => (
            <ReviewStep
              formData={formData}
              onSubmit={() => submitForm(formData)}
              onBack={() => navigateTo('/form/step3')}
            />
          )}
        </MicroRoute>

        {/* Success page */}
        <MicroRoute path="/form/success" currentPath={currentStep}>
          {() => (
            <SuccessStep onStartOver={() => navigateTo('/form/step1')} />
          )}
        </MicroRoute>

        {/* Default to step 1 */}
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
      <h2>Personal Information</h2>

      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
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
          Next
        </button>
      </div>
    </div>
  );
}
```

## Performance Considerations

### Optimization Strategies
```typescript
// Memoize route components to prevent unnecessary re-renders
const MemoizedRoute = React.memo(MicroRoute);

// Use route-specific lazy loading
function LazyRoute({ path, component: Component, ...props }: {
  path: string;
  component: React.ComponentType<any>;
  [key: string]: any;
}) {
  return (
    <MicroRoute path={path}>
      {(params) => (
        <React.Suspense fallback={<div>Loading...</div>}>
          <Component {...props} params={params} />
        </React.Suspense>
      )}
    </MicroRoute>
  );
}

// Optimize parameter extraction for complex patterns
const useMemoizedParams = (path: string, pattern: string) => {
  return useMemo(() => {
    return extractParams(path, pattern);
  }, [path, pattern]);
};
```

### Memory Management
```typescript
// Clean up resources when routes change
function useRouteCleanup(routeParams: RouteParams, cleanup: () => void) {
  const prevParams = useRef(routeParams);

  useEffect(() => {
    if (JSON.stringify(prevParams.current) !== JSON.stringify(routeParams)) {
      cleanup();
      prevParams.current = routeParams;
    }
  }, [routeParams, cleanup]);
}

// Debounce route changes for better performance
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

## Best Practices

### Do ✅
```typescript
// Use descriptive route patterns
<MicroRoute path="/user/:userId/profile">
  {({ userId }) => <UserProfile id={userId} />}
</MicroRoute>

// Handle loading and error states
<MicroRoute path="/product/:productId">
  {({ productId }) => (
    <AsyncProductLoader
      productId={productId}
      fallback={<ProductSkeleton />}
      onError={<ProductNotFound />}
    />
  )}
</MicroRoute>

// Use TypeScript for parameter safety
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

// Provide meaningful NotFound components
<MicroRoute path="/user/:id">
  {({ id }) => <UserProfile userId={id} />}
  <MicroRoute.NotFound>
    <div>
      <h2>User not found</h2>
      <p>The user you're looking for doesn't exist.</p>
      <button onClick={() => navigateTo('/users')}>
        View all users
      </button>
    </div>
  </MicroRoute.NotFound>
</MicroRoute>
```

### Don't ❌
```typescript
// Don't ignore parameter validation
<MicroRoute path="/user/:id">
  {({ id }) => (
    <UserProfile userId={id} /> // ❌ No validation of id format
  )}
</MicroRoute>

// Don't create complex nested route hierarchies
<MicroRoute path="/a/:b/c/:d/e/:f/g/:h"> // ❌ Too complex for micro-routing
  {(params) => <OverlyNestedComponent {...params} />}
</MicroRoute>

// Don't forget to handle edge cases
<MicroRoute path="/search/:query">
  {({ query }) => (
    <SearchResults query={query} /> // ❌ What if query is empty?
  )}
</MicroRoute>

// Don't use micro-routing for full application routing
// ❌ Use proper routing libraries for complex apps
```

## Migration Guide

### From Conditional Rendering
```typescript
// Before: Complex conditional rendering
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

// After: MicroRoute-based routing
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

### From Switch Statements
```typescript
// Before: Switch-based routing
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

// After: MicroRoute pattern matching
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

## Related Components
- [`if`](../if/README.md) - For simple conditional rendering
- [`switch`](../switch/README.md) - For multi-condition rendering
- [`when`](../when/README.md) - For complex conditional logic

## Accessibility

The `MicroRoute` component maintains accessibility while providing routing:

```typescript
// Ensure proper ARIA labels and roles
<MicroRoute path="/section/:sectionId" currentPath={currentPath}>
  {({ sectionId }) => (
    <section
      role="main"
      aria-labelledby={`section-${sectionId}-title`}
      aria-live="polite"
    >
      <h1 id={`section-${sectionId}-title`}>
        Section {sectionId}
      </h1>
      <SectionContent sectionId={sectionId} />
    </section>
  )}
</MicroRoute>

// Handle focus management on route changes
function useRouteFocus(routeParams: RouteParams) {
  useEffect(() => {
    // Focus main content when route changes
    const mainElement = document.querySelector('[role="main"]');
    if (mainElement) {
      (mainElement as HTMLElement).focus();
    }
  }, [routeParams]);
}

// Provide skip links for keyboard navigation
<MicroRoute path="/complex-page/:pageId" currentPath={currentPath}>
  {({ pageId }) => (
    <div>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <nav aria-label="Page navigation">
        <PageNavigation pageId={pageId} />
      </nav>
      <main id="main-content" tabIndex={-1}>
        <PageContent pageId={pageId} />
      </main>
    </div>
  )}
</MicroRoute>
```

The `MicroRoute` component provides a lightweight, flexible solution for component-level routing in React applications, perfect for widgets, small applications, and scenarios where full-featured routing is overkill.
