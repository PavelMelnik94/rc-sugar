# React Utility Kit 🚀

[![npm version](https://badge.fury.io/js/react-utility-kit.svg)](https://badge.fury.io/js/react-utility-kit)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

> **🌍 Язык:** [English](./README.md) | [Русский](./README.ru.md)

## 📑 Содержание

- [Что решает](#-что-решает)
- [Установка](#️-установка)
- [Принципы архитектуры](#️-принципы-архитектуры)
- [Обзор компонентов](#-обзор-компонентов)
  - [🎬 Компоненты анимации](#-компоненты-анимации)
  - [🤝 Компоненты взаимодействия](#-компоненты-взаимодействия)
  - [🔄 Компоненты итерации](#-компоненты-итерации)
  - [🧭 Компоненты навигации](#-компоненты-навигации)
  - [⚡ Компоненты производительности](#-компоненты-производительности)
  - [🏪 Компоненты управления состоянием](#-компоненты-управления-состоянием)
  - [🎨 UI компоненты](#-ui-компоненты)
  - [🔧 Утилитарные компоненты](#-утилитарные-компоненты)
- [Быстрый старт](#-быстрый-старт)
- [Требования](#-требования)
- [Участие в разработке](#-участие-в-разработке)
- [Лицензия](#-лицензия)
- [Ссылки](#-ссылки)

Комплексная библиотека утилитарных React компонентов со строгой поддержкой TypeScript, разработанная для современных React 19 приложений. Создана с акцентом на производительность, типобезопасность и удобство разработки.

## 🎯 Что решает

React Utility Kit решает распространённые задачи разработки, предоставляя:

- **🔄 Управление состоянием**: Лёгкие, типобезопасные решения без глобальных хранилищ
- **⚡ Оптимизация производительности**: Ленивая загрузка, мемоизация и эффективные паттерны рендеринга
- **🎨 UI утилиты**: Условный рендеринг, анимации и интерактивные компоненты
- **🔧 Инструменты разработчика**: Утилиты отладки, внедрение зависимостей и помощники разработки
- **📱 Обработка взаимодействий**: Жесты касания, управление фокусом и обработка пользовательского ввода
- **🚀 Современные паттерны**: Render props, составные компоненты и код без эффектов

## 🛠️ Установка

```bash
npm install react-utility-kit
# или
yarn add react-utility-kit
# или
pnpm add react-utility-kit
```

## 🏗️ Принципы архитектуры

- **Слабая связанность, высокая сплочённость**: Каждый компонент самодостаточен и сфокусирован
- **Код без эффектов**: Минимальное использование `useEffect` для лучшей производительности
- **Паттерн Render Props**: Гибкая композиция компонентов
- **Паттерны слотов**: Расширяемая архитектура компонентов
- **GRASP паттерны**: Принципы объектно-ориентированного проектирования
- **Инверсия зависимостей**: Гибкая и тестируемая структура кода
- **Единственная ответственность**: Каждый компонент имеет одну чёткую цель
- **Строгая типизация**: Полная поддержка TypeScript со строгими типами

## 📦 Обзор компонентов

### 🎬 Компоненты анимации

#### Ticker
**Назначение**: Операции на основе интервалов с автоматической очисткой и управлением состоянием

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/animation/ticker/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/animation/ticker/README.ru.md)
- **Случаи использования**: Таймеры, операции опроса, обновления в реальном времени, анимации
- **Ключевые возможности**: Управление запуск/остановка/перезапуск, подсчёт тиков, автоматическая очистка

#### Cycle
**Назначение**: Циклическое управление состоянием и переходы

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/animation/cycle/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/animation/cycle/README.ru.md)
- **Случаи использования**: Навигация карусели, пошаговые мастера, машины состояний
- **Ключевые возможности**: Навигация вперёд/назад, управление циклом, сохранение состояния

### 🤝 Компоненты взаимодействия

#### Focus
**Назначение**: Продвинутое управление фокусом и навигация с клавиатуры

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/interaction/focus/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/interaction/focus/README.ru.md)
- **Случаи использования**: Доступность, навигация с клавиатуры, захват фокуса
- **Ключевые возможности**: Автофокус, восстановление фокуса, обработка событий клавиатуры

#### Tap
**Назначение**: Улучшенные взаимодействия касания и клика

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/interaction/tap/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/interaction/tap/README.ru.md)
- **Случаи использования**: Взаимодействия с кнопками, распознавание жестов, обработка касаний
- **Ключевые возможности**: Обнаружение множественных касаний, распознавание жестов, делегирование событий

#### GesturePad
**Назначение**: Продвинутое распознавание и обработка жестов касания

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/interaction/gesture-pad/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/interaction/gesture-pad/README.ru.md)
- **Случаи использования**: Обнаружение свайпов, масштабирование щипком, приложения для рисования
- **Ключевые возможности**: Поддержка мультитач, распознавание жестов, настраиваемые обработчики

### 🔄 Компоненты итерации

#### For
**Назначение**: Декларативный рендеринг списков с расширенными возможностями

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/iteration/for/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/iteration/for/README.ru.md)
- **Случаи использования**: Динамические списки, рендеринг данных, отображение коллекций
- **Ключевые возможности**: Отслеживание индексов, обработка пустого состояния, типобезопасная итерация

#### Repeat
**Назначение**: Повторяющийся рендеринг компонентов с логикой на основе счётчика

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/iteration/repeat/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/iteration/repeat/README.ru.md)
- **Случаи использования**: Звёздные рейтинги, точки пагинации, повторяющиеся элементы
- **Ключевые возможности**: Рендеринг на основе счётчика, доступ к индексу, оптимизация производительности

### 🧭 Компоненты навигации

#### MicroRoute
**Назначение**: Лёгкое решение для клиентской маршрутизации

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/navigation/micro-route/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/navigation/micro-route/README.ru.md)
- **Случаи использования**: SPA маршрутизация, условная навигация, рендеринг на основе URL
- **Ключевые возможности**: Сопоставление паттернов, извлечение параметров, обработка 404

### ⚡ Компоненты производительности

#### Lazy
**Назначение**: Ленивая загрузка компонентов и разделение кода

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/performance/lazy/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/performance/lazy/README.ru.md)
- **Случаи использования**: Разделение кода, оптимизация производительности, динамические импорты
- **Ключевые возможности**: Интеграция с Suspense, границы ошибок, стратегии предзагрузки

#### Static
**Назначение**: Оптимизация статического контента и мемоизация

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/performance/static/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/performance/static/README.ru.md)
- **Случаи использования**: Тяжёлые вычисления, дорогие рендеры, статический контент
- **Ключевые возможности**: Автоматическая мемоизация, отслеживание зависимостей, инвалидация кэша

#### Bound
**Назначение**: Рендеринг на основе границ и обнаружение области просмотра

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/performance/bound/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/performance/bound/README.ru.md)
- **Случаи использования**: Бесконечная прокрутка, оптимизация области просмотра, ленивый рендеринг
- **Ключевые возможности**: Intersection Observer, обнаружение области просмотра, оптимизация производительности

### 🏪 Компоненты управления состоянием

#### Atom
**Назначение**: Лёгкое атомарное управление состоянием

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/atom/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/atom/README.ru.md)
- **Случаи использования**: Глобальное состояние, общие данные, реактивные обновления
- **Ключевые возможности**: Типобезопасные атомы, автоматические подписки, минимальный шаблонный код

#### Toggle
**Назначение**: Управление булевым состоянием с расширенными возможностями

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/toggle/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/toggle/README.ru.md)
- **Случаи использования**: Управление модалами, флаги функций, булевы переключатели
- **Ключевые возможности**: Действия переключения, сохранение состояния, обработка колбэков

#### Live
**Назначение**: Получение данных в реальном времени и живые обновления

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/live/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/live/README.ru.md)
- **Случаи использования**: Дашборды реального времени, живые потоки данных, операции опроса
- **Ключевые возможности**: Автоматический опрос, обработка ошибок, оптимистичные обновления

#### Cache
**Назначение**: Интеллектуальное кэширование и сохранение данных

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/cache/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/cache/README.ru.md)
- **Случаи использования**: Кэширование ответов API, дорогие вычисления, сохранение данных
- **Ключевые возможности**: Поддержка TTL, инвалидация кэша, бэкенды хранения

### 🎨 UI компоненты

#### Show
**Назначение**: Условный рендеринг с расширенными возможностями

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/show/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/show/README.ru.md)
- **Случаи использования**: Условный UI, флаги функций, адаптивный дизайн
- **Ключевые возможности**: Множественные условия, резервный контент, типобезопасные предикаты

#### Gate
**Назначение**: Контроль доступа и рендеринг на основе разрешений

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/gate/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/gate/README.ru.md)
- **Случаи использования**: Разрешения пользователей, доступ к функциям, UI на основе ролей
- **Ключевые возможности**: Проверка разрешений, валидация ролей, контроль доступа

#### Lock
**Назначение**: Блокировка UI и предотвращение взаимодействий

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/lock/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/lock/README.ru.md)
- **Случаи использования**: Состояния загрузки, отправка форм, асинхронные операции
- **Ключевые возможности**: Блокировка взаимодействий, визуальная обратная связь, обработка таймаутов

#### Scroll
**Назначение**: Продвинутое управление и контроль прокрутки

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/scroll/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/scroll/README.ru.md)
- **Случаи использования**: Плавная прокрутка, восстановление позиции прокрутки, анимации на основе прокрутки
- **Ключевые возможности**: Программная прокрутка, отслеживание позиции прокрутки, плавное поведение

#### Zoom
**Назначение**: Функциональность масштабирования и изменения размера

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/zoom/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/zoom/README.ru.md)
- **Случаи использования**: Просмотрщики изображений, интерфейсы карт, масштабируемый контент
- **Ключевые возможности**: Управление масштабом, ограничения масштаба, управление центральной точкой

### 🔧 Утилитарные компоненты

#### Debug
**Назначение**: Инструменты отладки и инспекции для разработки

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/debug/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/debug/README.ru.md)
- **Случаи использования**: Отладка разработки, инспекция состояния, мониторинг производительности
- **Ключевые возможности**: Логирование пропсов, отслеживание рендеров, метрики производительности

#### Compose
**Назначение**: Композиция компонентов и паттерны высшего порядка

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/compose/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/compose/README.ru.md)
- **Случаи использования**: Композиция компонентов, HOC паттерны, вложение провайдеров
- **Ключевые возможности**: Композиция множественных провайдеров, слияние пропсов, типобезопасность

#### Mirror
**Назначение**: Зеркалирование и синхронизация компонентов

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/mirror/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/mirror/README.ru.md)
- **Случаи использования**: Синхронизация компонентов, зеркалирование состояния, параллельный рендеринг
- **Ключевые возможности**: Синхронизация состояния, зеркалирование пропсов, двунаправленные обновления

#### Mapper
**Назначение**: Утилиты трансформации и маппинга данных

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/mapper/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/mapper/README.ru.md)
- **Случаи использования**: Трансформация API ответов, нормализация данных, конвейерная обработка, валидация
- **Ключевые возможности**: Поддержка TypeScript, валидация Zod, паттерны композиции, оптимизация производительности

#### Experiment
**Назначение**: A/B тестирование и экспериментирование с функциями

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/experiment/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/experiment/README.ru.md)
- **Случаи использования**: A/B тестирование, флаги функций, экспериментальные возможности
- **Ключевые возможности**: Выбор вариантов, отслеживание экспериментов, статистический анализ

#### Dependency
**Назначение**: Внедрение зависимостей и управление сервисами

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/dependency/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/dependency/README.ru.md)
- **Случаи использования**: Внедрение сервисов, управление зависимостями, тестируемая архитектура
- **Ключевые возможности**: Типобезопасное внедрение, иерархия провайдеров, жизненный цикл сервисов

#### Resource
**Назначение**: Управление асинхронными ресурсами с состояниями загрузки

- **📖 Документация**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/resource/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/resource/README.ru.md)
- **Случаи использования**: Загрузка данных API, асинхронные операции, интеграция с FSD архитектурой
- **Ключевые возможности**: Состояния загрузки, обработка ошибок, отмена запросов, отслеживание зависимостей

## 🚀 Быстрый старт

```tsx
import { Show, For, Ticker, Lazy } from 'react-utility-kit';

function App() {
  return (
    <div>
      {/* Условный рендеринг */}
      <Show when={user.isLoggedIn}>
        <Dashboard />
      </Show>
      
      {/* Рендеринг списка */}
      <For each={items}>
        {(item, index) => <Item key={item.id} data={item} />}
      </For>
      
      {/* Функциональность таймера */}
      <Ticker interval={1000} maxTicks={60}>
        {({ count, isRunning, start, stop }) => (
          <div>
            <span>Таймер: {count}с</span>
            <button onClick={isRunning ? stop : start}>
              {isRunning ? 'Стоп' : 'Старт'}
            </button>
          </div>
        )}
      </Ticker>
      
      {/* Ленивая загрузка */}
      <Lazy loader={() => import('./HeavyComponent')}>
        <div>Загрузка...</div>
      </Lazy>
    </div>
  );
}
```

## 📋 Требования

- **React**: ^19.1.1
- **TypeScript**: ^5.0.0 (рекомендуется)
- **Node.js**: ^18.0.0

## 🤝 Участие в разработке

Мы приветствуем вклад в развитие! Пожалуйста, ознакомьтесь с нашим [Руководством по участию](./CONTRIBUTING.md) для получения подробностей.

## 📄 Лицензия

MIT License - см. файл [LICENSE](./LICENSE) для подробностей.

## 🔗 Ссылки

- **📦 NPM пакет**: [react-utility-kit](https://www.npmjs.com/package/react-utility-kit)
- **📚 Документация**: [GitHub репозиторий](https://github.com/PavelMelnik94/react-utility-kit)
- **🐛 Проблемы**: [GitHub Issues](https://github.com/PavelMelnik94/react-utility-kit/issues)
- **💬 Обсуждения**: [GitHub Discussions](https://github.com/PavelMelnik94/react-utility-kit/discussions)

---

**Сделано с ❤️ [Павлом Мельником](https://github.com/PavelMelnik94)**