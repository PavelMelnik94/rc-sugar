import { act, render, screen, waitFor } from '@testing-library/react'
import { Resource } from './resource'

interface TestData {
  id: number
  name: string
}

const mockData: TestData = { id: 1, name: 'Test User' }
const mockError = new Error('Failed to load')

const createMockLoader = (data: TestData, delay = 0) =>
  jest
    .fn()
    .mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(data), delay)))

const createFailingLoader = (error: Error, delay = 0) =>
  jest
    .fn()
    .mockImplementation(() => new Promise((_, reject) => setTimeout(() => reject(error), delay)))

describe('resource Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic Loading States', () => {
    it('should render loading state initially', async () => {
      const loader = createMockLoader(mockData, 100)

      render(
        <Resource<TestData> loader={loader}>
          {({ loading, data, error }) => {
            if (loading) return <div data-testid="loading">Loading...</div>
            if (error) return <div data-testid="error">Error occurred</div>
            if (data) return <div data-testid="data">{data.name}</div>
            return <div data-testid="empty">No data</div>
          }}
        </Resource>
      )

      expect(screen.getByTestId('loading')).toHaveTextContent('Loading...')
    })

    it('should render data after successful load', async () => {
      const loader = createMockLoader(mockData, 10)

      render(
        <Resource<TestData> loader={loader}>
          {({ loading, data, error }) => {
            if (loading) return <div data-testid="loading">Loading...</div>
            if (error) return <div data-testid="error">Error occurred</div>
            if (data) return <div data-testid="data">{data.name}</div>
            return <div data-testid="empty">No data</div>
          }}
        </Resource>
      )

      expect(screen.getByTestId('loading')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByTestId('data')).toHaveTextContent('Test User')
      })

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(loader).toHaveBeenCalledTimes(1)
    })

    it('should render error state when loader fails', async () => {
      const loader = createFailingLoader(mockError, 10)

      render(
        <Resource<TestData> loader={loader}>
          {({ loading, data, error }) => {
            if (loading) return <div data-testid="loading">Loading...</div>
            if (error) return <div data-testid="error">{error.message}</div>
            if (data) return <div data-testid="data">{data.name}</div>
            return <div data-testid="empty">No data</div>
          }}
        </Resource>
      )

      expect(screen.getByTestId('loading')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Failed to load')
      })

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(loader).toHaveBeenCalledTimes(1)
    })
  })

  describe('initial Data', () => {
    it('should render initial data when provided', async () => {
      const loader = createMockLoader(mockData, 10)

      render(
        <Resource<TestData> loader={loader} initialData={mockData}>
          {({ loading, data, error }) => {
            if (error) return <div data-testid="error">Error occurred</div>
            return (
              <div>
                <div data-testid="data">{data?.name}</div>
                {loading && <div data-testid="loading">Loading...</div>}
              </div>
            )
          }}
        </Resource>
      )

      // Should show initial data immediately
      expect(screen.getByTestId('data')).toHaveTextContent('Test User')
      // Should also show loading indicator since it's still fetching fresh data
      expect(screen.getByTestId('loading')).toBeInTheDocument()

      // After loading completes, should still show the same data (since it's the same)
      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      })

      expect(screen.getByTestId('data')).toHaveTextContent('Test User')
    })

    it('should still load data even with initial data', async () => {
      const newData = { id: 2, name: 'Updated User' }
      const loader = createMockLoader(newData, 10)

      render(
        <Resource<TestData> loader={loader} initialData={mockData}>
          {({ loading, data, error }) => {
            if (error) return <div data-testid="error">Error occurred</div>
            return (
              <div>
                <div data-testid="data">{data?.name}</div>
                {loading && <div data-testid="loading">Loading...</div>}
              </div>
            )
          }}
        </Resource>
      )

      expect(screen.getByTestId('data')).toHaveTextContent('Test User')
      expect(screen.getByTestId('loading')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByTestId('data')).toHaveTextContent('Updated User')
      })

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })
  })

  describe('immediate Loading Control', () => {
    it('should not load immediately when immediate is false', () => {
      const loader = createMockLoader(mockData)

      render(
        <Resource<TestData> loader={loader} immediate={false}>
          {({ loading, data, error }) => {
            if (loading) return <div data-testid="loading">Loading...</div>
            if (error) return <div data-testid="error">Error occurred</div>
            if (data) return <div data-testid="data">{data.name}</div>
            return <div data-testid="empty">No data</div>
          }}
        </Resource>
      )

      expect(screen.getByTestId('empty')).toBeInTheDocument()
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(loader).not.toHaveBeenCalled()
    })
  })

  describe('refetch Functionality', () => {
    it('should provide refetch function that reloads data', async () => {
      const loader = createMockLoader(mockData, 10)

      render(
        <Resource<TestData> loader={loader}>
          {({ loading, data, error, refetch }) => {
            if (loading) return <div data-testid="loading">Loading...</div>
            if (error) return <div data-testid="error">Error occurred</div>
            if (data) {
              return (
                <div>
                  <div data-testid="data">{data.name}</div>
                  <button type="button" data-testid="refetch" onClick={() => refetch()}>
                    Refetch
                  </button>
                </div>
              )
            }
            return <div data-testid="empty">No data</div>
          }}
        </Resource>
      )

      await waitFor(() => {
        expect(screen.getByTestId('data')).toHaveTextContent('Test User')
      })

      expect(loader).toHaveBeenCalledTimes(1)

      act(() => {
        screen.getByTestId('refetch').click()
      })

      await waitFor(() => {
        expect(loader).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('dependencies', () => {
    it('should reload when dependencies change', async () => {
      const loader = createMockLoader(mockData, 10)
      let userId = 1

      const { rerender } = render(
        <Resource<TestData> loader={loader} deps={[userId]}>
          {({ loading, data }) =>
            loading ? (
              <div data-testid="loading">Loading...</div>
            ) : data ? (
              <div data-testid="data">{data.name}</div>
            ) : null
          }
        </Resource>
      )

      await waitFor(() => {
        expect(screen.getByTestId('data')).toBeInTheDocument()
      })

      expect(loader).toHaveBeenCalledTimes(1)

      userId = 2
      rerender(
        <Resource<TestData> loader={loader} deps={[userId]}>
          {({ loading, data }) =>
            loading ? (
              <div data-testid="loading">Loading...</div>
            ) : data ? (
              <div data-testid="data">{data.name}</div>
            ) : null
          }
        </Resource>
      )

      await waitFor(() => {
        expect(loader).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('callbacks', () => {
    it('should call onSuccess when data loads successfully', async () => {
      const loader = createMockLoader(mockData, 10)
      const onSuccess = jest.fn()

      render(
        <Resource<TestData> loader={loader} onSuccess={onSuccess}>
          {({ loading, data }) =>
            loading ? (
              <div data-testid="loading">Loading...</div>
            ) : data ? (
              <div data-testid="data">{data.name}</div>
            ) : null
          }
        </Resource>
      )

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(mockData)
      })
    })

    it('should call onError when loading fails', async () => {
      const loader = createFailingLoader(mockError, 10)
      const onError = jest.fn()

      render(
        <Resource<TestData> loader={loader} onError={onError}>
          {({ loading, error }) =>
            loading ? (
              <div data-testid="loading">Loading...</div>
            ) : error ? (
              <div data-testid="error">{error.message}</div>
            ) : null
          }
        </Resource>
      )

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(mockError)
      })
    })
  })

  describe('request Cancellation', () => {
    it('should cancel previous request when deps change', async () => {
      const loader1 = createMockLoader({ id: 1, name: 'User 1' }, 100)
      const loader2 = createMockLoader({ id: 2, name: 'User 2' }, 50)

      let currentLoader = loader1

      const { rerender } = render(
        <Resource<TestData> loader={() => currentLoader()}>
          {({ loading, data }) =>
            loading ? (
              <div data-testid="loading">Loading...</div>
            ) : data ? (
              <div data-testid="data">{data.name}</div>
            ) : null
          }
        </Resource>
      )

      expect(screen.getByTestId('loading')).toBeInTheDocument()

      currentLoader = loader2
      rerender(
        <Resource<TestData> loader={() => currentLoader()}>
          {({ loading, data }) =>
            loading ? (
              <div data-testid="loading">Loading...</div>
            ) : data ? (
              <div data-testid="data">{data.name}</div>
            ) : null
          }
        </Resource>
      )

      await waitFor(() => {
        expect(screen.getByTestId('data')).toHaveTextContent('User 2')
      })
    })
  })

  describe('compound Components', () => {
    it('should export Loading compound component', () => {
      expect(Resource.Loading).toBeDefined()
      expect(typeof Resource.Loading).toBe('function')
    })

    it('should export Error compound component', () => {
      expect(Resource.Error).toBeDefined()
      expect(typeof Resource.Error).toBe('function')
    })

    it('should export Success compound component', () => {
      expect(Resource.Success).toBeDefined()
      expect(typeof Resource.Success).toBe('function')
    })

    it('should render Loading compound component', () => {
      render(
        <Resource.Loading>
          <div data-testid="loading-content">Loading...</div>
        </Resource.Loading>
      )

      expect(screen.getByTestId('loading-content')).toHaveTextContent('Loading...')
    })

    it('should render Error compound component with render prop', () => {
      const testError = new Error('Test error')
      const mockRetry = jest.fn()

      render(
        <Resource.Error error={testError} onRetry={mockRetry}>
          {({ error, retry }) => (
            <div>
              <div data-testid="error-message">{error.message}</div>
              <button type="button" data-testid="retry-button" onClick={retry}>
                Retry
              </button>
            </div>
          )}
        </Resource.Error>
      )

      expect(screen.getByTestId('error-message')).toHaveTextContent('Test error')

      act(() => {
        screen.getByTestId('retry-button').click()
      })

      expect(mockRetry).toHaveBeenCalledTimes(1)
    })

    it('should render Success compound component with render prop', () => {
      render(
        <Resource.Success data={mockData}>
          {(data) => <div data-testid="success-content">{data.name}</div>}
        </Resource.Success>
      )

      expect(screen.getByTestId('success-content')).toHaveTextContent('Test User')
    })
  })
})
