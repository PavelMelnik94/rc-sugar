# Компонент Lock

Комплексный компонент блокировки UI, который отключает пользовательское взаимодействие при отображении настраиваемых оверлеев, состояний загрузки и визуальной обратной связи. Идеально подходит для асинхронных операций, отправки форм и предотвращения одновременных пользовательских действий.

## Описание

Компонент `Lock` предоставляет расширенное управление доступностью UI и пользовательским взаимодействием. Он может отключать события указателя, показывать оверлеи загрузки, размывать контент, предотвращать прокрутку и обеспечивать визуальную обратную связь во время выполнения операций. Компонент разработан для обработки сложных сценариев, таких как отправка форм, вызовы API, состояния обработки и критические операции, требующие исключительного внимания пользователя.

## Когда использовать
- **Асинхронные операции**: Состояния загрузки во время вызовов API, загрузки файлов или обработки данных
- **Отправка форм**: Предотвращение двойной отправки и отображение прогресса
- **Критические действия**: Блокировка UI во время важных операций, таких как платежи или удаления
- **Многошаговые процессы**: Отключение интерфейса во время шагов мастера или управляемых рабочих процессов
- **Доступ к ресурсам**: Предотвращение одновременных изменений общих ресурсов
- **Модальное поведение**: Создание областей с заблокированным фокусом без полной сложности модалей
- **Восстановление после ошибок**: Блокировка интерфейса во время обработки ошибок или восстановления

## Используемые паттерны
- **Блокировка взаимодействия**: Предотвращение событий указателя и выделения пользователем
- **Управление оверлеем**: Настраиваемые оверлеи загрузки и статуса
- **Визуальная обратная связь**: Эффекты размытия, изменения прозрачности и плавные переходы
- **Контроль прокрутки**: Предотвращение прокрутки страницы во время заблокированных состояний
- **Поддержка доступности**: Правильные атрибуты ARIA и рассмотрение программ чтения с экрана
- **Оптимизация производительности**: Эффективная манипуляция DOM и очистка эффектов

## Типы TypeScript

```typescript
import { ReactNode } from 'react';

/**
 * Пропсы для компонента Lock
 */
interface LockProps {
  /** Контент для блокировки/разблокировки */
  children: ReactNode;

  /** Условие, определяющее блокировку интерфейса */
  when: boolean;

  /** Опциональный контент оверлея для отображения при блокировке (например, спиннер, сообщение) */
  overlay?: ReactNode;

  /**
   * Предотвращать ли прокрутку страницы при блокировке
   * @default false
   */
  preventScroll?: boolean;

  /**
   * Применять ли эффект размытия к заблокированному контенту
   * @default false
   */
  blur?: boolean;

  /** Пользовательские стили для элемента оверлея */
  overlayStyle?: React.CSSProperties;

  /** CSS класс для элемента оверлея */
  overlayClassName?: string;
}

/** Тип компонента Lock */
declare const Lock: React.FC<LockProps> & {
  displayName: string;
};
```

## Примеры использования

### Отправка формы с загрузкой

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
      showSuccessMessage('Регистрация успешна!');
    }
 catch (error) {
      showErrorMessage('Регистрация не удалась. Попробуйте снова.');
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
            <p>Создаём ваш аккаунт...</p>
            <p className="sub-text">Пожалуйста, не закрывайте это окно</p>
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
          <h2>Создать аккаунт</h2>

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
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            {isSubmitting ? 'Создание аккаунта...' : 'Создать аккаунт'}
          </button>
        </form>
      </Lock>
    </div>
  );
}
```

### Загрузка файлов с прогрессом

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

      showSuccessMessage('Все файлы успешно загружены!');
    }
 catch (error) {
      showErrorMessage('Загрузка не удалась. Попробуйте снова.');
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
            <h3>Загрузка файлов</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressZagruzki}%` }}
              />
            </div>
            <p>
{Math.round(progressZagruzki)}
% Завершено
            </p>
            <p className="progress-detail">
              {zagruzhennyeFajly.length}
{' '}
из
{zagruzhennyeFajly.length + 1}
{' '}
файлов загружено
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
          <h2>Загрузить файлы</h2>

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
              <p>Перетащите файлы сюда или нажмите для выбора</p>
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
                Выбрать файлы
              </label>
            </div>
          </div>

          {zagruzhennyeFajly.length > 0 && (
            <div className="uploaded-files">
              <h3>Загруженные файлы</h3>
              <ul>
                {zagruzhennyeFajly.map((file, index) => (
                  <li key={index} className="uploaded-file">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      {(file.size / 1024).toFixed(1)}
{' '}
КБ
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

### Обработка платежей

```tsx
import { Lock } from 'ui-magic-core/lock';

function PaymentForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'payment' | 'processing' | 'complete'>('payment');
  const [orderDetails, setOrderDetails] = useState({
    total: 2999.99,
    currency: 'RUB',
    items: ['Премиум план - 1 год']
  });

  const handlePayment = async (paymentData: any) => {
    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Имитация обработки платежа
      await new Promise(resolve => setTimeout(resolve, 3000));

      const result = await submitPayment(paymentData);

      if (result.success) {
        setPaymentStep('complete');
        // Держим заблокированным момент для показа успеха
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
      showErrorMessage('Платёж не удался. Проверьте данные и попробуйте снова.');
    }
  };

  const getOverlayContent = () => {
    switch (paymentStep) {
      case 'processing':
        return (
          <div className="payment-processing">
            <div className="processing-animation">💳</div>
            <h3>Обработка платежа</h3>
            <p>Пожалуйста, подождите, пока мы обрабатываем ваш платёж...</p>
            <div className="security-note">
              🔒 Ваш платёж защищён 256-битным SSL шифрованием
            </div>
          </div>
        );
      case 'complete':
        return (
          <div className="payment-success">
            <div className="success-icon">✅</div>
            <h3>Платёж успешен!</h3>
            <p>Спасибо за покупку</p>
            <p>Перенаправляем в ваш аккаунт...</p>
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
          <h2>Завершите покупку</h2>

          <div className="order-summary">
            <h3>Сводка заказа</h3>
            {orderDetails.items.map((item, index) => (
              <div key={index} className="order-item">
                <span>{item}</span>
                <span>
{orderDetails.total}
₽
                </span>
              </div>
            ))}
            <div className="order-total">
              <strong>
Итого:
{orderDetails.total}
₽
              </strong>
            </div>
          </div>

          <div className="payment-form">
            <div className="form-group">
              <label>Номер карты</label>
              <input type="text" placeholder="1234 5678 9012 3456" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Срок действия</label>
                <input type="text" placeholder="ММ/ГГ" />
              </div>
              <div className="form-group">
                <label>CVC</label>
                <input type="text" placeholder="123" />
              </div>
            </div>

            <button
              onClick={() => handlePayment({ /* данные платежа */ })}
              className="pay-button"
              disabled={isProcessing}
            >
              {isProcessing ? 'Обработка...' : `Оплатить ${orderDetails.total}₽`}
            </button>
          </div>
        </div>
      </Lock>
    </div>
  );
}
```

## Справочник API

### LockProps

| Проп              | Тип                      | Обязательный | По умолчанию | Описание                                      |
|-------------------|--------------------------|--------------|--------------|-----------------------------------------------|
| `children`        | `ReactNode`              | ✅           | -            | Контент для блокировки/разблокировки         |
| `when`            | `boolean`                | ✅           | -            | Условие, определяющее состояние блокировки   |
| `overlay`         | `ReactNode`              | ❌           | -            | Контент для отображения при блокировке       |
| `preventScroll`   | `boolean`                | ❌           | `false`      | Предотвращать ли прокрутку страницы          |
| `blur`            | `boolean`                | ❌           | `false`      | Применять ли эффект размытия к контенту      |
| `overlayStyle`    | `React.CSSProperties`    | ❌           | -            | Пользовательские стили для элемента оверлея  |
| `overlayClassName`| `string`                 | ❌           | -            | CSS класс для элемента оверлея               |

## Лучшие практики

### Производительность
- **Минимальные перерендеры**: Обновляйте состояние блокировки только при необходимости
- **Оптимизация оверлея**: Поддерживайте лёгкий контент оверлея
- **Управление памятью**: Очищайте слушатели событий и эффекты
- **Плавные переходы**: Используйте CSS переходы для лучшего UX

### Пользовательский опыт
- **Ясная обратная связь**: Всегда предоставляйте осмысленный контент оверлея
- **Индикация прогресса**: Показывайте прогресс для длительных операций
- **Обработка ошибок**: Предоставляйте варианты восстановления в оверлеях ошибок
- **Адаптивный дизайн**: Убедитесь, что оверлеи работают на всех размерах экрана

### Доступность
- **Управление фокусом**: Обрабатывайте фокус во время циклов блокировки/разблокировки
- **Поддержка программ чтения с экрана**: Используйте соответствующие ARIA метки
- **Навигация с клавиатуры**: Поддерживайте доступность клавиатуры
- **Предпочтения движения**: Учитывайте предпочтения пользователя по анимации

## Связанные компоненты
- [`async`](../async/README.md) - Для управления асинхронными операциями
- [`state`](../state/README.md) - Для сложного управления состоянием
- [`gate`](../gate/README.md) - Для условного рендеринга
- [`memo`](../memo/README.md) - Для оптимизации производительности
