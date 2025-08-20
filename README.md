# React Utility Kit 🚀

[![npm version](https://badge.fury.io/js/react-utility-kit.svg)](https://badge.fury.io/js/react-utility-kit)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

> **🌍 Language:** [English](./README.md) | [Русский](./README.ru.md)

## 📑 Table of Contents

- [What It Solves](#-what-it-solves)
- [Installation](#️-installation)
- [Architecture Principles](#️-architecture-principles)
- [Components Overview](#-components-overview)
  - [🎬 Animation Components](#-animation-components)
  - [🤝 Interaction Components](#-interaction-components)
  - [🔄 Iteration Components](#-iteration-components)
  - [🧭 Navigation Components](#-navigation-components)
  - [⚡ Performance Components](#-performance-components)
  - [🏪 State Management Components](#-state-management-components)
  - [🎨 UI Components](#-ui-components)
  - [🔧 Utility Components](#-utility-components)
- [Quick Start](#-quick-start)
- [Requirements](#-requirements)
- [Contributing](#-contributing)
- [License](#-license)
- [Links](#-links)

A comprehensive React utility component library with strict TypeScript support, designed for modern React 19 applications. Built with a focus on performance, type safety, and developer experience.in mind.

## 🎯 What It Solves

React Utility Kit addresses common development challenges by providing:

- **🔄 State Management**: Lightweight, type-safe state solutions without global stores
- **⚡ Performance Optimization**: Lazy loading, memoization, and efficient rendering patterns
- **🎨 UI Utilities**: Conditional rendering, animations, and interactive components
- **🔧 Developer Tools**: Debugging utilities, dependency injection, type guards, and development helpers
- **📱 Interaction Handling**: Touch gestures, focus management, and user input processing
- **🚀 Modern Patterns**: Render props, compound components, and effect-free code

## 🛠️ Installation

```bash
npm install react-utility-kit
# or
yarn add react-utility-kit
# or
pnpm add react-utility-kit
```

## 🏗️ Architecture Principles

- **Low Coupling, High Cohesion**: Each component is self-contained and focused
- **Effect-Free Code**: Minimal `useEffect` usage for better performance
- **Render Props Pattern**: Flexible component composition
- **Slot Patterns**: Extensible component architecture
- **GRASP Patterns**: Object-oriented design principles
- **Dependency Inversion**: Flexible and testable code structure
- **Single Responsibility**: Each component has one clear purpose
- **Strong Typing**: Full TypeScript support with strict types

## 📦 Components Overview

### 🎬 Animation Components

#### Ticker
**Purpose**: Interval-based operations with automatic cleanup and state management

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/animation/ticker/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/animation/ticker/README.ru.md)
- **Use Cases**: Timers, polling operations, real-time updates, animations
- **Key Features**: Start/stop/restart controls, tick counting, automatic cleanup

#### Cycle
**Purpose**: Cyclical state management and transitions

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/animation/cycle/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/animation/cycle/README.ru.md)
- **Use Cases**: Carousel navigation, step wizards, state machines
- **Key Features**: Forward/backward navigation, loop control, state persistence

### 🤝 Interaction Components

#### Focus
**Purpose**: Advanced focus management and keyboard navigation

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/interaction/focus/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/interaction/focus/README.ru.md)
- **Use Cases**: Accessibility, keyboard navigation, focus trapping
- **Key Features**: Auto-focus, focus restoration, keyboard event handling

#### Tap
**Purpose**: Enhanced touch and click interactions

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/interaction/tap/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/interaction/tap/README.ru.md)
- **Use Cases**: Button interactions, gesture recognition, touch handling
- **Key Features**: Multi-tap detection, gesture recognition, event delegation

#### GesturePad
**Purpose**: Advanced touch gesture recognition and handling

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/interaction/gesture-pad/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/interaction/gesture-pad/README.ru.md)
- **Use Cases**: Swipe detection, pinch-to-zoom, drawing applications
- **Key Features**: Multi-touch support, gesture recognition, customizable handlers

### 🔄 Iteration Components

#### For
**Purpose**: Declarative list rendering with enhanced features

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/iteration/for/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/iteration/for/README.ru.md)
- **Use Cases**: Dynamic lists, data rendering, collection display
- **Key Features**: Index tracking, empty state handling, type-safe iteration

#### Repeat
**Purpose**: Repetitive component rendering with count-based logic

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/iteration/repeat/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/iteration/repeat/README.ru.md)
- **Use Cases**: Star ratings, pagination dots, repeated elements
- **Key Features**: Count-based rendering, index access, performance optimization

### 🧭 Navigation Components

#### MicroRoute
**Purpose**: Lightweight client-side routing solution

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/navigation/micro-route/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/navigation/micro-route/README.ru.md)
- **Use Cases**: SPA routing, conditional navigation, URL-based rendering
- **Key Features**: Pattern matching, parameter extraction, 404 handling

### ⚡ Performance Components

#### Lazy
**Purpose**: Component lazy loading and code splitting

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/performance/lazy/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/performance/lazy/README.ru.md)
- **Use Cases**: Code splitting, performance optimization, dynamic imports
- **Key Features**: Suspense integration, error boundaries, preloading strategies

#### Static
**Purpose**: Static content optimization and memoization

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/performance/static/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/performance/static/README.ru.md)
- **Use Cases**: Heavy computations, expensive renders, static content
- **Key Features**: Automatic memoization, dependency tracking, cache invalidation

#### Bound
**Purpose**: Boundary-based rendering and viewport detection

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/performance/bound/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/performance/bound/README.ru.md)
- **Use Cases**: Infinite scrolling, viewport optimization, lazy rendering
- **Key Features**: Intersection Observer, viewport detection, performance optimization

### 🏪 State Management Components

#### Atom
**Purpose**: Lightweight atomic state management

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/atom/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/atom/README.ru.md)
- **Use Cases**: Global state, shared data, reactive updates
- **Key Features**: Type-safe atoms, automatic subscriptions, minimal boilerplate

#### Toggle
**Purpose**: Boolean state management with enhanced features

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/toggle/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/toggle/README.ru.md)
- **Use Cases**: Modal controls, feature flags, boolean switches
- **Key Features**: Toggle actions, state persistence, callback handling

#### Live
**Purpose**: Real-time data fetching and live updates

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/live/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/live/README.ru.md)
- **Use Cases**: Real-time dashboards, live data feeds, polling operations
- **Key Features**: Automatic polling, error handling, optimistic updates

#### Cache
**Purpose**: Intelligent caching and data persistence

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/cache/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/state/cache/README.ru.md)
- **Use Cases**: API response caching, expensive computations, data persistence
- **Key Features**: TTL support, cache invalidation, storage backends

### 🎨 UI Components

#### Show
**Purpose**: Conditional rendering with enhanced features

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/show/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/show/README.ru.md)
- **Use Cases**: Conditional UI, feature flags, responsive design
- **Key Features**: Multiple conditions, fallback content, type-safe predicates

#### Gate
**Purpose**: Access control and permission-based rendering

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/gate/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/gate/README.ru.md)
- **Use Cases**: User permissions, feature access, role-based UI
- **Key Features**: Permission checking, role validation, access control

#### Lock
**Purpose**: UI locking and interaction prevention

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/lock/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/lock/README.ru.md)
- **Use Cases**: Loading states, form submission, async operations
- **Key Features**: Interaction blocking, visual feedback, timeout handling

#### Scroll
**Purpose**: Advanced scroll management and control

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/scroll/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/scroll/README.ru.md)
- **Use Cases**: Smooth scrolling, scroll restoration, scroll-based animations
- **Key Features**: Programmatic scrolling, scroll position tracking, smooth behavior

#### Zoom
**Purpose**: Zoom and scale functionality

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/zoom/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/ui/zoom/README.ru.md)
- **Use Cases**: Image viewers, map interfaces, scalable content
- **Key Features**: Zoom controls, scale limits, center point management

### 🔧 Utility Components

#### Debug
**Purpose**: Development debugging and inspection tools

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/debug/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/debug/README.ru.md)
- **Use Cases**: Development debugging, state inspection, performance monitoring
- **Key Features**: Props logging, render tracking, performance metrics

#### Type Guards
**Purpose**: Type guards and function assertions with Zod integration

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/type-guards/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/type-guards/README.ru.md)
- **Use Cases**: Runtime type checking, input validation, type-safe assertions
- **Key Features**: Complete type coverage, Zod schema integration, assertion functions

#### Compose
**Purpose**: Component composition and higher-order patterns

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/compose/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/compose/README.ru.md)
- **Use Cases**: Component composition, HOC patterns, provider nesting
- **Key Features**: Multiple provider composition, prop merging, type safety

#### Mirror
**Purpose**: Component mirroring and synchronization

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/mirror/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/mirror/README.ru.md)
- **Use Cases**: Component synchronization, state mirroring, parallel rendering
- **Key Features**: State synchronization, prop mirroring, bidirectional updates

#### Mapper
**Purpose**: Data transformation and mapping utilities

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/mapper/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/mapper/README.ru.md)
- **Use Cases**: API response transformation, data normalization, pipeline processing, validation
- **Key Features**: TypeScript support, Zod validation, composition patterns, performance optimizations

#### Experiment
**Purpose**: A/B testing and feature experimentation

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/experiment/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/experiment/README.ru.md)
- **Use Cases**: A/B testing, feature flags, experimental features
- **Key Features**: Variant selection, experiment tracking, statistical analysis

#### Dependency
**Purpose**: Dependency injection and service management

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/dependency/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/dependency/README.ru.md)
- **Use Cases**: Service injection, dependency management, testable architecture
- **Key Features**: Type-safe injection, provider hierarchy, service lifecycle

#### Resource
**Purpose**: Async resource management with loading states

- **📖 Documentation**: [English](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/resource/README.md) | [Русский](https://github.com/PavelMelnik94/react-utility-kit/blob/main/src/components/utilities/resource/README.ru.md)
- **Use Cases**: API data loading, async operations, FSD architecture integration
- **Key Features**: Loading states, error handling, request cancellation, dependency tracking

## 🚀 Quick Start

```tsx
import { Show, For, Ticker, Lazy } from 'react-utility-kit';

function App() {
  return (
    <div>
      {/* Conditional rendering */}
      <Show when={user.isLoggedIn}>
        <Dashboard />
      </Show>
      
      {/* List rendering */}
      <For each={items}>
        {(item, index) => <Item key={item.id} data={item} />}
      </For>
      
      {/* Timer functionality */}
      <Ticker interval={1000} maxTicks={60}>
        {({ count, isRunning, start, stop }) => (
          <div>
            <span>Timer: {count}s</span>
            <button onClick={isRunning ? stop : start}>
              {isRunning ? 'Stop' : 'Start'}
            </button>
          </div>
        )}
      </Ticker>
      
      {/* Lazy loading */}
      <Lazy loader={() => import('./HeavyComponent')}>
        <div>Loading...</div>
      </Lazy>
    </div>
  );
}
```

## 📋 Requirements

- **React**: ^19.1.1
- **TypeScript**: ^5.0.0 (recommended)
- **Node.js**: ^18.0.0

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Links

- **📦 NPM Package**: [react-utility-kit](https://www.npmjs.com/package/react-utility-kit)
- **📚 Documentation**: [GitHub Repository](https://github.com/PavelMelnik94/react-utility-kit)
- **🐛 Issues**: [GitHub Issues](https://github.com/PavelMelnik94/react-utility-kit/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/PavelMelnik94/react-utility-kit/discussions)

---

**Made with ❤️ by [Pavel Melnik](https://github.com/PavelMelnik94)** via Github Copilot
