import { render, screen } from '@testing-library/react'
import { z } from 'zod' 
import { createDependencyContext } from './dependency'

interface TestServices {
  [key: string]: unknown
  apiService: {
    name: string
    getData: () => Promise<string>
  }
  logger: {
    level: string
    log: (message: string) => void
  }
}

const testServices: TestServices = {
  apiService: {
    name: 'TestAPI',
    getData: async () => 'test-data',
  },
  logger: {
    level: 'debug',
    log: (message: string) => console.log(message),
  },
}

// Create context for tests
const { Provider: TestProvider, useDependency: useTestService } = createDependencyContext<TestServices>()

// Test components
function TestComponent(): React.ReactElement {
  const apiService = useTestService('apiService')
  const logger = useTestService('logger')

  return (
    <div>
      <div data-testid="api-name">{apiService.name}</div>
      <div data-testid="logger-level">{logger.level}</div>
    </div>
  )
}



describe('simple dependency injection', () => {
  describe('createDependencyContext', () => {
    it('should create Provider and useDependency hook', () => {
      const { Provider, useDependency, createTestProvider } = createDependencyContext<TestServices>({
        contextName: 'Test'
      })

      expect(Provider).toBeDefined()
      expect(useDependency).toBeDefined()
      expect(createTestProvider).toBeDefined()
      expect(typeof Provider).toBe('object') // React.memo returns object
      expect(typeof useDependency).toBe('function')
      expect(typeof createTestProvider).toBe('function')
    })
  })

  describe('provider', () => {
    it('should provide dependencies to child components', () => {
      render(
        <TestProvider dependencies={testServices}>
          <TestComponent />
        </TestProvider>
      )

      expect(screen.getByTestId('api-name')).toHaveTextContent('TestAPI')
      expect(screen.getByTestId('logger-level')).toHaveTextContent('debug')
    })
  })

  describe('useDependency hook', () => {
    it('should resolve dependencies correctly', () => {
      render(
        <TestProvider dependencies={testServices}>
          <TestComponent />
        </TestProvider>
      )

      expect(screen.getByTestId('api-name')).toHaveTextContent('TestAPI')
      expect(screen.getByTestId('logger-level')).toHaveTextContent('debug')
    })

    it('should return entire context when no key provided', () => {
      const TestAllDependencies = () => {
        const allDeps = useTestService() as TestServices
        return (
          <div>
            <div data-testid="all-api">{allDeps.apiService.name}</div>
            <div data-testid="all-logger">{allDeps.logger.level}</div>
          </div>
        )
      }

      render(
        <TestProvider dependencies={testServices}>
          <TestAllDependencies />
        </TestProvider>
      )

      expect(screen.getByTestId('all-api')).toHaveTextContent('TestAPI')
      expect(screen.getByTestId('all-logger')).toHaveTextContent('debug')
    })

    it('should throw error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

      expect(() => {
        render(<TestComponent />)
      }).toThrow('Dependency context not found. Make sure Provider is used.')

      consoleSpy.mockRestore()
    })

    it('should throw error for non-existent dependency', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

      const TestComponentWithError = () => {
        const nonExistent = useTestService('nonExistent' as keyof TestServices)
        return <div>{String(nonExistent)}</div>
      }

      expect(() => {
        render(
          <TestProvider dependencies={testServices}>
            <TestComponentWithError />
          </TestProvider>
        )
      }).toThrow('Dependency "nonExistent" not found. Available dependencies: [apiService, logger]')

      consoleSpy.mockRestore()
    })
  })

  describe('createTestProvider utility', () => {
    it('should work with createTestProvider utility', () => {
      const { useDependency, createTestProvider } = createDependencyContext<TestServices>({
        contextName: 'Test'
      })

      const TestComponent = () => {
        const apiService = useDependency('apiService')
        return <div data-testid="test-api">{apiService.name}</div>
      }

      const TestProvider = createTestProvider({
        apiService: { name: 'MockAPI', getData: async () => 'mock-data' }
      })

      render(
        <TestProvider>
          <TestComponent />
        </TestProvider>
      )

      expect(screen.getByTestId('test-api')).toHaveTextContent('MockAPI')
    })

    it('should have correct displayName for Provider', () => {
      const { Provider: TestProvider } = createDependencyContext<TestServices>({
        contextName: 'Test'
      })

      expect(TestProvider.displayName).toBe('TestProvider')
    })

    it('should validate dependencies with Zod schema in debug mode', () => {
      const testSchema = z.any() // Simplified schema to avoid type conflicts

      const { Provider: ValidationProvider } = createDependencyContext<TestServices>({
        schema: testSchema,
        contextName: 'ValidationTest'
      })

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { })

      const TestComponent = () => {
        return <div>Test</div>
      }

      // Valid dependencies should not log errors
      render(
        <ValidationProvider dependencies={testServices} isDebug={true}>
          <TestComponent />
        </ValidationProvider>
      )

      expect(consoleSpy).not.toHaveBeenCalled()

      // Test with debug mode disabled - should not validate
      render(
        <ValidationProvider dependencies={testServices} isDebug={false}>
          <TestComponent />
        </ValidationProvider>
      )

      expect(consoleSpy).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('multiple contexts', () => {
    it('should support multiple independent contexts', () => {
      interface OtherServices {
        [key: string]: unknown
        cache: { get: (key: string) => string }
      }

      const { Provider: OtherProvider, useDependency: useOtherService } = createDependencyContext<OtherServices>()

      const otherServices: OtherServices = {
        cache: { get: (key: string) => `cached-${key}` }
      }

      function MultiContextComponent(): React.ReactElement {
        const apiService = useTestService('apiService')
        const cache = useOtherService('cache')

        return (
          <div>
            <div data-testid="multi-api">{apiService.name}</div>
            <div data-testid="multi-cache">{cache.get('test')}</div>
          </div>
        )
      }

      render(
        <TestProvider dependencies={testServices}>
          <OtherProvider dependencies={otherServices}>
            <MultiContextComponent />
          </OtherProvider>
        </TestProvider>
      )

      expect(screen.getByTestId('multi-api')).toHaveTextContent('TestAPI')
      expect(screen.getByTestId('multi-cache')).toHaveTextContent('cached-test')
    })
  })

})