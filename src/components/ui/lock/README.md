# Lock Component

A comprehensive UI locking component that disables user interactions while displaying customizable overlays, loading states, and visual feedback. Perfect for async operations, form submissions, and preventing concurrent user actions.

## Description

The `Lock` component provides sophisticated control over UI availability and user interaction. It can disable pointer events, show loading overlays, blur content, prevent scrolling, and provide visual feedback when operations are in progress. The component is designed to handle complex scenarios like form submissions, API calls, processing states, and critical operations that require exclusive user attention.

## When to Use
- **Async Operations**: Loading states during API calls, file uploads, or data processing
- **Form Submissions**: Preventing double-submissions and showing progress feedback
- **Critical Actions**: Blocking UI during important operations like payments or deletions
- **Multi-step Processes**: Disabling interface during wizard steps or guided workflows
- **Resource Access**: Preventing concurrent modifications to shared resources
- **Modal-like Behavior**: Creating focus-locked areas without full modal complexity
- **Error Recovery**: Blocking interface during error handling or recovery procedures

## Patterns Used
- **Interaction Blocking**: Pointer events and user selection prevention
- **Overlay Management**: Customizable loading and status overlays
- **Visual Feedback**: Blur effects, opacity changes, and smooth transitions
- **Scroll Control**: Page-level scroll prevention during locked states
- **Accessibility Support**: Proper ARIA attributes and screen reader considerations
- **Performance Optimization**: Efficient DOM manipulation and effect cleanup

## TypeScript Types

```typescript
import { ReactNode } from 'react';

/**
 * Props for the Lock component
 */
interface LockProps {
  /** Content to be locked/unlocked */
  children: ReactNode;

  /** Condition that determines whether to lock the interface */
  when: boolean;

  /** Optional overlay content to display when locked (e.g., spinner, message) */
  overlay?: ReactNode;

  /**
   * Whether to prevent page scrolling when locked
   * @default false
   */
  preventScroll?: boolean;

  /**
   * Whether to apply blur effect to locked content
   * @default false
   */
  blur?: boolean;

  /** Custom styles for the overlay element */
  overlayStyle?: React.CSSProperties;

  /** CSS class name for the overlay element */
  overlayClassName?: string;
}

/** Lock component type */
declare const Lock: React.FC<LockProps> & {
  displayName: string;
};
```

## Usage Examples

### Form Submission with Loading

```tsx
import { Lock } from 'ui-magic-core/lock';

function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitRegistration(formData);
      showSuccessMessage('Registration successful!');
    }
 catch (error) {
      showErrorMessage('Registration failed. Please try again.');
    }
 finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <Lock
        when={isSubmitting}
        overlay={(
          <div className="loading-overlay">
            <div className="spinner" />
            <p>Creating your account...</p>
            <p className="sub-text">Please don't close this window</p>
          </div>
        )}
        preventScroll
        blur
        overlayStyle={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)'
        }}
      >
        <form onSubmit={handleSubmit} className="registration-form">
          <h2>Create Account</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </Lock>
    </div>
  );
}
```

### File Upload with Progress

```tsx
import { Lock } from 'ui-magic-core/lock';

function FileUploader() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        await uploadFile(file, (progress) => {
          const totalProgress = ((i + progress / 100) / files.length) * 100;
          setUploadProgress(totalProgress);
        });

        setUploadedFiles(prev => [...prev, file]);
      }

      showSuccessMessage('All files uploaded successfully!');
    }
 catch (error) {
      showErrorMessage('Upload failed. Please try again.');
    }
 finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="file-uploader">
      <Lock
        when={isUploading}
        overlay={(
          <div className="upload-progress">
            <div className="progress-icon">📁</div>
            <h3>Uploading Files</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p>
{Math.round(uploadProgress)}
% Complete
            </p>
            <p className="progress-detail">
              {uploadedFiles.length}
{' '}
of
{uploadedFiles.length + 1}
{' '}
files uploaded
            </p>
          </div>
        )}
        preventScroll
        overlayStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white'
        }}
      >
        <div className="upload-area">
          <h2>Upload Files</h2>

          <div
            className="drop-zone"
            onDrop={(e) => {
              e.preventDefault();
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                handleFileUpload(files);
              }
            }}
            onDragOver={e => e.preventDefault()}
          >
            <div className="drop-content">
              <div className="upload-icon">⬆️</div>
              <p>Drag files here or click to browse</p>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files?.length) {
                    handleFileUpload(e.target.files);
                  }
                }}
                style={{ display: 'none' }}
                id="file-input"
              />
              <label htmlFor="file-input" className="browse-button">
                Choose Files
              </label>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
              <h3>Uploaded Files</h3>
              <ul>
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="uploaded-file">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      {(file.size / 1024).toFixed(1)}
{' '}
KB
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Lock>
    </div>
  );
}
```

### Payment Processing

```tsx
import { Lock } from 'ui-magic-core/lock';

function CheckoutForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'payment' | 'processing' | 'complete'>('payment');
  const [orderDetails, setOrderDetails] = useState({
    amount: 99.99,
    currency: 'USD',
    items: ['Premium Plan - 1 year']
  });

  const processPayment = async (paymentData: any) => {
    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const result = await submitPayment(paymentData);

      if (result.success) {
        setPaymentStep('complete');
        // Keep locked for a moment to show success
        setTimeout(() => {
          setIsProcessing(false);
          redirectToThankYouPage();
        }, 2000);
      }
 else {
        throw new Error(result.error);
      }
    }
 catch (error) {
      setIsProcessing(false);
      setPaymentStep('payment');
      showErrorMessage('Payment failed. Please check your details and try again.');
    }
  };

  const getOverlayContent = () => {
    switch (paymentStep) {
      case 'processing':
        return (
          <div className="payment-processing">
            <div className="processing-animation">💳</div>
            <h3>Processing Payment</h3>
            <p>Please wait while we process your payment...</p>
            <div className="security-note">
              🔒 Your payment is secured with 256-bit SSL encryption
            </div>
          </div>
        );
      case 'complete':
        return (
          <div className="payment-success">
            <div className="success-icon">✅</div>
            <h3>Payment Successful!</h3>
            <p>Thank you for your purchase</p>
            <p>Redirecting to your account...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="checkout-container">
      <Lock
        when={isProcessing}
        overlay={getOverlayContent()}
        preventScroll
        blur
        overlayStyle={{
          backgroundColor: paymentStep === 'complete'
            ? 'rgba(76, 175, 80, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          color: paymentStep === 'complete' ? 'white' : 'inherit'
        }}
      >
        <div className="checkout-form">
          <h2>Complete Your Purchase</h2>

          <div className="order-summary">
            <h3>Order Summary</h3>
            {orderDetails.items.map((item, index) => (
              <div key={index} className="order-item">
                <span>{item}</span>
                <span>
$
{orderDetails.amount}
                </span>
              </div>
            ))}
            <div className="order-total">
              <strong>
Total: $
{orderDetails.amount}
              </strong>
            </div>
          </div>

          <div className="payment-form">
            <div className="form-group">
              <label>Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry</label>
                <input type="text" placeholder="MM/YY" />
              </div>
              <div className="form-group">
                <label>CVC</label>
                <input type="text" placeholder="123" />
              </div>
            </div>

            <button
              onClick={() => processPayment({ /* payment data */ })}
              className="pay-button"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${orderDetails.amount}`}
            </button>
          </div>
        </div>
      </Lock>
    </div>
  );
}
```

### Data Loading with Skeleton

```tsx
import { Lock } from 'ui-magic-core/lock';

function UserDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchUserDashboardData();
      setUserData(data);
    }
 catch (err) {
      setError('Failed to load dashboard data');
    }
 finally {
      setIsLoading(false);
    }
  };

  const SkeletonLoader = () => (
    <div className="skeleton-loader">
      <div className="skeleton-header">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-text-block">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-subtitle"></div>
        </div>
      </div>

      <div className="skeleton-content">
        <div className="skeleton-card">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
        <div className="skeleton-card">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
        <div className="skeleton-card">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line short"></div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="error-state">
        <h3>⚠️ Error Loading Dashboard</h3>
        <p>{error}</p>
        <button onClick={loadUserData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Lock
        when={isLoading}
        overlay={<SkeletonLoader />}
        overlayStyle={{
          backgroundColor: 'transparent',
          position: 'absolute'
        }}
      >
        <div className="dashboard-content">
          <header className="dashboard-header">
            <div className="user-info">
              <img src={userData?.avatar} alt="Avatar" />
              <div>
                <h1>
Welcome back,
{userData?.name}
                </h1>
                <p>
Last login:
{userData?.lastLogin}
                </p>
              </div>
            </div>
          </header>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Account Balance</h3>
              <div className="balance">
$
{userData?.balance}
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Recent Activity</h3>
              <ul>
                {userData?.recentActivity?.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>

            <div className="dashboard-card">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button>Transfer Money</button>
                <button>Pay Bills</button>
                <button>View Statements</button>
              </div>
            </div>
          </div>
        </div>
      </Lock>
    </div>
  );
}
```

### Multi-step Wizard

```tsx
import { Lock } from 'ui-magic-core/lock';

function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [wizardData, setWizardData] = useState({
    profile: {},
    preferences: {},
    verification: {}
  });

  const steps = [
    { title: 'Profile Setup', component: ProfileStep },
    { title: 'Preferences', component: PreferencesStep },
    { title: 'Verification', component: VerificationStep },
    { title: 'Complete', component: CompleteStep }
  ];

  const nextStep = async () => {
    setIsProcessing(true);

    try {
      // Simulate processing/validation
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
 catch (error) {
      showErrorMessage('Step validation failed');
    }
 finally {
      setIsProcessing(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="wizard-container">
      <div className="wizard-progress">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`progress-step ${
              index === currentStep
? 'active'
              : index < currentStep ? 'completed' : 'pending'
            }`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>

      <Lock
        when={isProcessing}
        overlay={(
          <div className="wizard-processing">
            <div className="processing-spinner"></div>
            <h3>Processing Step</h3>
            <p>Validating your information...</p>
          </div>
        )}
        blur
        overlayStyle={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <div className="wizard-content">
          <h2>{steps[currentStep].title}</h2>

          <CurrentStepComponent
            data={wizardData}
            updateData={setWizardData}
          />

          <div className="wizard-actions">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="btn-secondary"
              >
                Previous
              </button>
            )}

            <button
              onClick={nextStep}
              disabled={isProcessing}
              className="btn-primary"
            >
              {isProcessing
? 'Processing...'
               : currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </Lock>
    </div>
  );
}
```

## API Reference

### LockProps

| Prop               | Type                     | Required | Default | Description                                    |
|-------------------|--------------------------|----------|---------|------------------------------------------------|
| `children`        | `ReactNode`              | ✅       | -       | Content to be locked/unlocked                 |
| `when`            | `boolean`                | ✅       | -       | Condition that determines lock state          |
| `overlay`         | `ReactNode`              | ❌       | -       | Content to display when locked                |
| `preventScroll`   | `boolean`                | ❌       | `false` | Whether to prevent page scrolling when locked |
| `blur`            | `boolean`                | ❌       | `false` | Whether to apply blur effect to content       |
| `overlayStyle`    | `React.CSSProperties`    | ❌       | -       | Custom styles for the overlay element         |
| `overlayClassName`| `string`                 | ❌       | -       | CSS class name for the overlay element        |

### Usage Guidelines

#### Overlay Content
- Can be any React node (components, text, JSX)
- Positioned absolutely over the locked content
- Receives pointer events when lock is active
- Should provide clear feedback about the operation in progress

#### Performance Considerations
- Lock/unlock operations are optimized for smooth transitions
- Overlay content is only rendered when lock is active
- Scroll prevention uses efficient event listeners
- Blur effects use CSS transforms for hardware acceleration

#### Accessibility Features
- Maintains focus management during lock states
- Supports screen readers with proper ARIA attributes
- Preserves keyboard navigation patterns
- Respects user motion preferences for animations

## Advanced Examples

### Conditional Overlay Based on Operation

```tsx
import { Lock } from 'ui-magic-core/lock';

function AdvancedForm() {
  const [operation, setOperation] = useState<'idle' | 'saving' | 'validating' | 'error'>('idle');

  const getOverlayContent = () => {
    switch (operation) {
      case 'saving':
        return (
          <div className="operation-overlay saving">
            <div className="icon">💾</div>
            <h3>Saving Changes</h3>
            <p>Please wait while we save your data...</p>
          </div>
        );
      case 'validating':
        return (
          <div className="operation-overlay validating">
            <div className="icon">✓</div>
            <h3>Validating Data</h3>
            <p>Checking your information...</p>
          </div>
        );
      case 'error':
        return (
          <div className="operation-overlay error">
            <div className="icon">⚠️</div>
            <h3>Operation Failed</h3>
            <p>Please try again or contact support</p>
            <button onClick={() => setOperation('idle')}>
              Retry
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Lock
      when={operation !== 'idle'}
      overlay={getOverlayContent()}
      preventScroll={operation === 'saving'}
      blur={operation !== 'error'}
      overlayStyle={{
        backgroundColor: operation === 'error'
          ? 'rgba(220, 53, 69, 0.9)'
          : 'rgba(255, 255, 255, 0.95)',
        color: operation === 'error' ? 'white' : 'inherit'
      }}
    >
      <form className="advanced-form">
        {/* Form content */}
      </form>
    </Lock>
  );
}
```

### Integration with Loading States

```tsx
import { useQuery } from 'react-query';
import { Lock } from 'ui-magic-core/lock';

function DataVisualization() {
  const { data, isLoading, isError, refetch } = useQuery('dashboard-data', fetchData);

  if (isError) {
    return (
      <div className="error-container">
        <h2>Failed to Load Data</h2>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <Lock
      when={isLoading}
      overlay={(
        <div className="loading-visualization">
          <div className="loading-charts">
            <div className="chart-skeleton"></div>
            <div className="chart-skeleton"></div>
            <div className="chart-skeleton"></div>
          </div>
          <p>Loading dashboard data...</p>
        </div>
      )}
      overlayStyle={{
        backgroundColor: 'rgba(248, 249, 250, 0.95)',
        backdropFilter: 'blur(2px)'
      }}
    >
      <div className="dashboard">
        {data && (
          <>
            <div className="chart-container">
              <BarChart data={data.sales} />
            </div>
            <div className="chart-container">
              <LineChart data={data.trends} />
            </div>
            <div className="chart-container">
              <PieChart data={data.categories} />
            </div>
          </>
        )}
      </div>
    </Lock>
  );
}
```

## Best Practices

### Performance
- **Minimal Re-renders**: Only update lock state when necessary
- **Overlay Optimization**: Keep overlay content lightweight
- **Memory Management**: Clean up event listeners and effects
- **Smooth Transitions**: Use CSS transitions for better UX

### User Experience
- **Clear Feedback**: Always provide meaningful overlay content
- **Progress Indication**: Show progress for long operations
- **Error Handling**: Provide recovery options in error overlays
- **Responsive Design**: Ensure overlays work on all screen sizes

### Accessibility
- **Focus Management**: Handle focus during lock/unlock cycles
- **Screen Reader Support**: Use appropriate ARIA labels
- **Keyboard Navigation**: Maintain keyboard accessibility
- **Motion Preferences**: Respect user animation preferences

### Security
- **Prevent Double Actions**: Use locks to prevent duplicate submissions
- **Data Integrity**: Lock UI during critical operations
- **User Confirmation**: Lock UI during destructive actions

## Common Patterns

### Form Submission Pattern
```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

async function handleSubmit(data) {
  setIsSubmitting(true);
  try {
    await submitForm(data);
  }
 finally {
    setIsSubmitting(false);
  }
}

return (
  <Lock when={isSubmitting} overlay={<SubmissionSpinner />}>
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  </Lock>
);
```

### Page Navigation Pattern
```tsx
const [isNavigating, setIsNavigating] = useState(false);

async function navigate(path) {
  setIsNavigating(true);
  await router.push(path);
  // Navigation complete, component will unmount
}

return (
  <Lock when={isNavigating} overlay={<NavigationSpinner />} preventScroll>
    <div className="page-content">
      {/* page content */}
    </div>
  </Lock>
);
```

## Migration Guide

### From Custom Loading States
```tsx
// Before: Manual loading state management
function OldComponent() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={`container ${isLoading ? 'loading' : ''}`}>
      {isLoading && <div className="overlay">Loading...</div>}
      <div className={isLoading ? 'blurred' : ''}>
        {/* content */}
      </div>
    </div>
  );
}

// After: Using Lock component
function NewComponent() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Lock
      when={isLoading}
      overlay={<div>Loading...</div>}
      blur
    >
      {/* content */}
    </Lock>
  );
}
```

## Related Components
- [`async`](../async/README.md) - For managing async operations
- [`state`](../state/README.md) - For complex state management
- [`gate`](../gate/README.md) - For conditional rendering
- [`memo`](../memo/README.md) - For performance optimization
