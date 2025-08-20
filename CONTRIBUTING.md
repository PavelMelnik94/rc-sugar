# Contributing to React Utility Kit 🤝

> **🌍 Language:** [English](./CONTRIBUTING.md) | [Русский](./CONTRIBUTING.ru.md)

Thank you for your interest in contributing to React Utility Kit! We welcome contributions from developers of all skill levels. This guide will help you get started.

## 📋 Table of Contents

- [Development Philosophy](#-development-philosophy)
- [Getting Started](#-getting-started)
- [Development Guidelines](#-development-guidelines)
- [Architecture Principles](#️-architecture-principles)
- [Code Standards](#-code-standards)
- [Documentation Standards](#-documentation-standards)
- [Testing Requirements](#-testing-requirements)
- [Contribution Process](#-contribution-process)
- [Component Development](#-component-development)
- [Pull Request Guidelines](#-pull-request-guidelines)

## 🎯 Development Philosophy

React Utility Kit is built by experienced front-end developers with deep expertise in React 19 and 2025 best practices. Our development approach focuses on:

- **Modern React Patterns**: Compound components and render-props patterns
- **Library Excellence**: This is a professional npm library with high standards
- **React 19 First**: Built specifically for React 19 applications
- **Developer Experience**: Intuitive APIs with exceptional TypeScript support

## 🚀 Getting Started

### Prerequisites

- **Node.js**: ^18.0.0
- **React**: ^19.1.1  
- **TypeScript**: ^5.0.0 (required, not optional)

### Setup

```bash
# Clone the repository
git clone https://github.com/PavelMelnik94/react-utility-kit.git
cd react-utility-kit

# Install dependencies
npm install

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm test

# Build the project
npm run build
```

## 📐 Development Guidelines

### Break Down Tasks

- **Always** break large tasks into smaller, manageable subtasks
- Each subtask should have a clear, single responsibility
- Document your task breakdown in issue comments

### Dependencies

- **Use only dependencies listed in package.json**
- No additional dependencies without explicit approval
- Leverage existing tools and patterns from the codebase

## 🏗️ Architecture Principles

### Core Principles

1. **Low Coupling, High Cohesion**
   - Each component is self-contained and focused
   - Minimal dependencies between components
   - Clear, well-defined interfaces

2. **Effect-Free Code**
   - Minimize `useEffect` usage for better performance
   - Prefer declarative patterns over imperative side effects
   - Use built-in React patterns for state management

3. **Pattern Mastery**
   - **Render Props Pattern**: Flexible component composition
   - **Slot Patterns**: Extensible component architecture
   - **GRASP Patterns**: Object-oriented design principles
   - **MVC Architecture**: Clear separation of concerns
   - **Dependency Inversion**: Flexible and testable code structure

4. **Single Responsibility**
   - Each component has one clear, well-defined purpose
   - Functions should do one thing exceptionally well
   - Avoid mixing concerns within components

5. **No Global State**
   - Avoid global state stores (Redux, Zustand, etc.)
   - Use local state and prop drilling when appropriate
   - Leverage React's built-in state management patterns

## 💻 Code Standards

### TypeScript Requirements

- **Strict Typing**: All code must have strict TypeScript types
- **Zero Errors**: No TypeScript errors or type warnings allowed
- **String Typing**: Use string literal types where appropriate
- **Generic Support**: Components should be generic where it makes sense

```typescript
// ✅ Good: Strong typing with generics
interface ResourceProps<T> {
  loader: () => Promise<T>;
  children: (state: ResourceState<T>) => React.ReactNode;
}

// ❌ Bad: Weak or any types
interface BadProps {
  loader: () => Promise<any>;
  children: (state: any) => React.ReactNode;
}
```

### Validation Standards

- **Use Zod**: All input validation must use Zod schemas
- **Runtime Safety**: Validate data at runtime boundaries
- **Type Guards**: Create proper type guards for complex validations

```typescript
// ✅ Good: Zod validation
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;
```

### Code Style

- **No Comments**: Code should be self-documenting
- **Clear Naming**: Use descriptive, intention-revealing names
- **Consistent Formatting**: Follow the project's ESLint and Biome configuration

## 📚 Documentation Standards

### Bilingual Documentation

Every component **must** include documentation in both formats:

- **English**: `README.md`
- **Russian**: `README.ru.md`

### Documentation Structure

Each README should contain:

```markdown
# Component Name

Brief description of the component's purpose.

## Description
Detailed explanation of what the component does and when to use it.

## When to Use
Specific use cases and scenarios.

## Patterns Used
Architectural patterns implemented by the component.

## TypeScript Types
Complete API documentation with types.

## API Reference
Props, methods, and interfaces.

## Examples
### Basic Usage
### Advanced Patterns
### Integration Examples

## Performance Considerations
Performance characteristics and optimization tips.

## Best Practices
### Do ✅
### Don't ❌

## Migration Guide
How to migrate from other solutions.

## Related Components
Links to related components and utilities.

## Accessibility
Accessibility considerations and ARIA support.
```

### Real API Documentation

- Document the **actual** API, not idealized versions
- Include real capabilities and limitations
- Provide practical usage examples
- Show both simple and complex use cases

## 🧪 Testing Requirements

### Coverage Standards

- **Maximum Coverage**: Aim for 100% test coverage
- **Component Testing**: Test all component behaviors
- **Integration Testing**: Test component interactions
- **Type Testing**: Ensure TypeScript types are correct

### Testing Patterns

```typescript
// ✅ Good: Comprehensive testing
describe('ResourceComponent', () => {
  it('should handle loading state', () => {
    // Test loading behavior
  });
  
  it('should handle success state', () => {
    // Test successful data loading
  });
  
  it('should handle error state', () => {
    // Test error handling
  });
  
  it('should support TypeScript generics', () => {
    // Test type safety
  });
});
```

## 🔄 Contribution Process

### 1. Issue Creation

- Create an issue describing the problem or enhancement
- Use clear, descriptive titles
- Provide detailed context and requirements
- Break down complex issues into subtasks

### 2. Development

- Fork the repository
- Create a feature branch from `main`
- Follow all coding standards and architecture principles
- Write comprehensive tests
- Update documentation

### 3. Quality Checks

```bash
# Run all quality checks before submitting
npm run type-check
npm run lint
npm run format:check
npm test
npm run build
```

### 4. Pull Request

- Create a clear, descriptive pull request
- Link to related issues
- Provide testing instructions
- Include screenshots for UI changes

## 🧩 Component Development

### Component Structure

```
src/components/category/component-name/
├── index.ts                 # Main export
├── Component.tsx            # Component implementation  
├── Component.test.tsx       # Tests
├── README.md               # English documentation
├── README.ru.md            # Russian documentation
└── types.ts                # TypeScript definitions
```

### Implementation Guidelines

1. **Start with Types**
   ```typescript
   // Define clear interfaces first
   export interface ComponentProps<T = unknown> {
     // Well-defined props
   }
   ```

2. **Implement Core Logic**
   - Use render props pattern
   - Avoid useEffect when possible
   - Handle all edge cases

3. **Add Error Boundaries**
   - Graceful error handling
   - Meaningful error messages
   - Recovery mechanisms

4. **Performance Optimization**
   - Memoization where appropriate
   - Avoid unnecessary re-renders
   - Lazy loading for heavy components

## 📝 Pull Request Guidelines

### PR Checklist

- [ ] TypeScript compilation passes without errors
- [ ] All tests pass with maximum coverage
- [ ] Code follows project style guidelines
- [ ] Documentation is complete (EN + RU)
- [ ] Performance impact has been considered
- [ ] Breaking changes are documented
- [ ] Related issues are linked

### PR Description Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing performed

## Documentation
- [ ] README.md updated
- [ ] README.ru.md updated
- [ ] API documentation complete

## Performance
- [ ] No negative performance impact
- [ ] Performance improvements (if applicable)
```

## 🤝 Community Guidelines

### Communication

- Be respectful and professional
- Provide constructive feedback
- Help other contributors learn and grow
- Share knowledge and best practices

### Code Review

- Review code thoroughly for quality and standards
- Check TypeScript types and error handling
- Verify documentation completeness
- Test functionality manually when possible

## 🎯 Goals and Vision

React Utility Kit aims to be the premier utility component library for React 19 applications. We focus on:

- **Developer Experience**: Intuitive, well-documented APIs
- **Type Safety**: Comprehensive TypeScript support
- **Performance**: Optimized for production applications
- **Modern Patterns**: Cutting-edge React patterns and practices
- **Community**: Building a helpful, inclusive developer community

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community discussion
- **Documentation**: Comprehensive guides and examples

Thank you for contributing to React Utility Kit! Together, we're building something amazing. 🚀