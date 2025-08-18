# For Component

A declarative loop component for rendering lists in React, providing a clean alternative to JavaScript's map function in JSX with built-in fallback support and type safety.

## Description

The `For` component simplifies rendering collections, making your JSX more readable and expressive. It provides a declarative approach to iteration with automatic empty state handling, eliminating the need for complex conditional logic around list rendering.

The component handles edge cases like empty arrays, null values, and provides a clean render prop interface that exposes both the item and its index for maximum flexibility.

## When to Use

- **Rendering lists or arrays** in JSX with clean syntax
- **Avoiding inline `.map()` calls** that clutter your components
- **Improving readability** of list rendering logic
- **Handling empty states** declaratively without additional conditionals
- **Type-safe iteration** over collections with TypeScript support
- **Complex list rendering** where you need both item and index
- **Consistent list patterns** across your application

## How It Works

The `For` component:

1. **Checks the array**: Validates if the array exists and has items
2. **Renders fallback**: Shows fallback content if array is empty or null
3. **Maps over items**: Iterates through each item using React's map
4. **Calls render prop**: Invokes children function with item and index
5. **Returns elements**: Wraps results in React Fragment

## Patterns Used

- **Iterator Pattern**: Iterates over collections with clean abstraction
- **Render Props Pattern**: Exposes item and index through children function
- **Fallback Pattern**: Provides empty state handling
- **Type Safety**: Full TypeScript support with generic types
- **Functional Composition**: Composable with other UI components

## TypeScript Types

```typescript
/**
 * Props for the For component
 */
interface ForProps<T = any> {
  /**
   * Array of items to iterate over
   */
  each: T[] | readonly T[];
  /**
   * Render prop function that receives each item and its index
   */
  children: RenderProp<{ item: T; index: number }>;
  /**
   * Fallback content to render when array is empty
   */
  fallback?: ReactNode;
}

/**
 * Render prop type definition
 */
type RenderProp<T> = (props: T) => ReactNode;
```

## API

### For Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `each` | `T[] \| readonly T[]` | ✅ | Array to iterate over |
| `children` | `({ item: T, index: number }) => ReactNode` | ✅ | Render function for each item |
| `fallback` | `ReactNode` | ❌ | Content to show when array is empty |

## Examples

### Basic Usage

```tsx
import { For } from 'rc-sugar';

function NumberList() {
  const numbers = [1, 2, 3, 4, 5];

  return (
    <For each={numbers}>
      {({ item, index }) => (
        <div key={index} className="number-item">
          Item #
{index + 1}
:
{' '}
{item}
        </div>
      )}
    </For>
  );
}
```

### User List with Fallback

```tsx
import { For } from 'rc-sugar';

interface User {
  id: string;
  name: string;
  email: string;
}

function UserList({ users }: { users: User[] }) {
  return (
    <For each={users} fallback={<EmptyUserList />}>
      {({ item: user, index }) => (
        <UserCard
          key={user.id}
          user={user}
          position={index + 1}
        />
      )}
    </For>
  );
}

function EmptyUserList() {
  return (
    <div className="empty-state">
      <p>No users found</p>
      <button>Add User</button>
    </div>
  );
}
```

### Product Grid

```tsx
import { For } from 'rc-sugar';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      <For each={products} fallback={<ProductGridSkeleton />}>
        {({ item: product, index }) => (
          <div
            key={product.id}
            className={`product-card ${index < 3 ? 'featured' : ''}`}
          >
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">
$
{product.price}
            </p>
            {index === 0 && <span className="badge">Best Seller</span>}
          </div>
        )}
      </For>
    </div>
  );
}
```

### Navigation Menu

```tsx
import { For } from 'rc-sugar';

interface MenuItem {
  label: string;
  href: string;
  icon?: string;
  isActive?: boolean;
}

function Navigation({ items }: { items: MenuItem[] }) {
  return (
    <nav className="navigation">
      <For each={items}>
        {({ item, index }) => (
          <a
            key={index}
            href={item.href}
            className={`nav-item ${item.isActive ? 'active' : ''}`}
          >
            {item.icon && <Icon name={item.icon} />}
            {item.label}
          </a>
        )}
      </For>
    </nav>
  );
}
```

### Complex Table Rows

```tsx
import { For } from 'rc-sugar';

interface TableData {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  lastUpdated: Date;
}

function DataTable({ data }: { data: TableData[] }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Last Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <For each={data} fallback={<EmptyTableRow />}>
          {({ item, index }) => (
            <tr
              key={item.id}
              className={index % 2 === 0 ? 'even' : 'odd'}
            >
              <td>{item.name}</td>
              <td>
                <StatusBadge status={item.status} />
              </td>
              <td>{item.lastUpdated.toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(item.id)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}
```

### Nested Lists

```tsx
import { For } from 'rc-sugar';

interface Category {
  id: string;
  name: string;
  items: string[];
}

function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <div className="categories">
      <For each={categories}>
        {({ item: category, index }) => (
          <div key={category.id} className="category">
            <h3>
              {index + 1}
.
{category.name}
            </h3>
            <ul>
              <For each={category.items} fallback={<li>No items</li>}>
                {({ item, index: itemIndex }) => (
                  <li key={itemIndex}>
                    {item}
                  </li>
                )}
              </For>
            </ul>
          </div>
        )}
      </For>
    </div>
  );
}
```

## Performance Considerations

- **Key Props**: Always provide proper `key` props for React reconciliation
- **Memoization**: Consider memoizing render functions for large lists
- **Virtual Scrolling**: For very large lists, consider virtual scrolling libraries
- **Empty Checks**: Component efficiently handles empty arrays without extra renders

## Best Practices

1. **Use Proper Keys**: Always provide unique keys for list items
2. **Memoize Heavy Renders**: Use `useCallback` for expensive render functions
3. **Fallback Content**: Always provide meaningful fallback content
4. **Type Safety**: Use TypeScript generics for type-safe iteration
5. **Avoid Index as Key**: Use unique identifiers when available
6. **Handle Loading States**: Use fallback for loading indicators

## Migration from Array.map()

### Before (Verbose)
```tsx
// ❌ Verbose with manual empty checks
return (
  <div>
    {items.length > 0
? (
      items.map((item, index) => (
        <ItemComponent key={item.id} item={item} index={index} />
      ))
    )
: (
      <EmptyState />
    )}
  </div>
);
```

### After (Clean)
```tsx
// ✅ Clean and declarative
return (
  <div>
    <For each={items} fallback={<EmptyState />}>
      {({ item, index }) => (
        <ItemComponent key={item.id} item={item} index={index} />
      )}
    </For>
  </div>
);
```

## Common Patterns

### Loading Lists
```tsx
<For each={isLoading ? [] : items} fallback={<LoadingSkeleton />}>
  {({ item, index }) => <ItemCard key={item.id} item={item} />}
</For>;
```

### Filtered Lists
```tsx
<For each={items.filter(item => item.isVisible)} fallback={<NoResults />}>
  {({ item, index }) => <ItemComponent key={item.id} item={item} />}
</For>;
```

### Paginated Lists
```tsx
<For each={currentPageItems} fallback={<EmptyPage />}>
  {({ item, index }) => (
    <ItemCard
      key={item.id}
      item={item}
      globalIndex={currentPage * pageSize + index}
    />
  )}
</For>;
```

## Related Components

- [`If`](../if/README.md) - Conditional rendering
- [`Maybe`](../maybe/README.md) - Null-safe rendering
- [`Switch`](../switch/README.md) - Value-based conditional rendering
