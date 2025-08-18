import type { RouteParams } from './micro-route'
import { render, screen } from '@testing-library/react'
import { MicroRoute, NotFound } from './micro-route'

describe('microRoute Component', () => {
  describe('basic routing functionality', () => {
    it('should render content when path matches exactly', () => {
      render(
        <MicroRoute path="/users" currentPath="/users">
          {() => <div>Users Page</div>}
        </MicroRoute>
      )

      expect(screen.getByText('Users Page')).toBeInTheDocument()
    })

    it('should not render content when path does not match', () => {
      render(
        <MicroRoute path="/users" currentPath="/dashboard">
          {() => <div>Users Page</div>}
        </MicroRoute>
      )

      expect(screen.queryByText('Users Page')).not.toBeInTheDocument()
    })

    it('should render null when no match and no NotFound component', () => {
      const { container } = render(
        <MicroRoute path="/users" currentPath="/dashboard">
          {() => <div>Users Page</div>}
        </MicroRoute>
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('parameter extraction', () => {
    it('should extract single parameter from path', () => {
      let capturedParams: RouteParams | null = null

      render(
        <MicroRoute path="/user/:id" currentPath="/user/123">
          {(params) => {
            capturedParams = params
            return (
              <div>
                User
                {params.id}
              </div>
            )
          }}
        </MicroRoute>
      )

      expect(screen.getByText(/User/)).toBeInTheDocument()
      expect(screen.getByText(/123/)).toBeInTheDocument()
      expect(capturedParams).toEqual({ id: '123' })
    })

    it('should extract multiple parameters from path', () => {
      let capturedParams: RouteParams | null = null

      render(
        <MicroRoute path="/user/:userId/post/:postId" currentPath="/user/123/post/456">
          {(params) => {
            capturedParams = params
            return (
              <div>
                User
                {params.userId} Post
                {params.postId}
              </div>
            )
          }}
        </MicroRoute>
      )

      expect(screen.getByText(/User/)).toBeInTheDocument()
      expect(screen.getByText(/123/)).toBeInTheDocument()
      expect(screen.getByText(/Post/)).toBeInTheDocument()
      expect(screen.getByText(/456/)).toBeInTheDocument()
      expect(capturedParams).toEqual({ userId: '123', postId: '456' })
    })

    it('should handle parameters with special characters', () => {
      let capturedParams: RouteParams | null = null

      render(
        <MicroRoute path="/search/:query" currentPath="/search/hello-world">
          {(params) => {
            capturedParams = params
            return (
              <div>
                Search:
                {params.query}
              </div>
            )
          }}
        </MicroRoute>
      )

      expect(screen.getByText(/Search:/)).toBeInTheDocument()
      expect(screen.getByText(/hello-world/)).toBeInTheDocument()
      expect(capturedParams).toEqual({ query: 'hello-world' })
    })

    it('should handle empty parameters', () => {
      let capturedParams: RouteParams | null = null

      render(
        <MicroRoute
          path="/category/:category/item/:item"
          currentPath="/category/electronics/item/laptop"
        >
          {(params) => {
            capturedParams = params
            return (
              <div>
                Category:
                {params.category}, Item:
                {params.item}
              </div>
            )
          }}
        </MicroRoute>
      )

      expect(capturedParams).toEqual({
        category: 'electronics',
        item: 'laptop',
      })
    })
  })

  describe('static paths', () => {
    it('should match static paths without parameters', () => {
      render(
        <MicroRoute path="/about" currentPath="/about">
          {() => <div>About Page</div>}
        </MicroRoute>
      )

      expect(screen.getByText('About Page')).toBeInTheDocument()
    })

    it('should match complex static paths', () => {
      render(
        <MicroRoute path="/admin/dashboard/settings" currentPath="/admin/dashboard/settings">
          {() => <div>Admin Settings</div>}
        </MicroRoute>
      )

      expect(screen.getByText('Admin Settings')).toBeInTheDocument()
    })

    it('should handle paths with special characters in static segments', () => {
      render(
        <MicroRoute path="/api/v1.0" currentPath="/api/v1.0">
          {() => <div>API v1.0</div>}
        </MicroRoute>
      )

      expect(screen.getByText('API v1.0')).toBeInTheDocument()
    })
  })

  describe('mixed static and dynamic paths', () => {
    it('should handle mixed static and parameter segments', () => {
      let capturedParams: RouteParams | null = null

      render(
        <MicroRoute path="/api/users/:id/profile" currentPath="/api/users/123/profile">
          {(params) => {
            capturedParams = params
            return (
              <div>
                User Profile
                {params.id}
              </div>
            )
          }}
        </MicroRoute>
      )

      expect(screen.getByText(/User Profile/)).toBeInTheDocument()
      expect(screen.getByText(/123/)).toBeInTheDocument()
      expect(capturedParams).toEqual({ id: '123' })
    })

    it('should not match partial paths', () => {
      render(
        <MicroRoute path="/api/users/:id/profile" currentPath="/api/users/123">
          {(params) => (
            <div>
              User Profile
              {params.id}
            </div>
          )}
        </MicroRoute>
      )

      expect(screen.queryByText(/User Profile/)).not.toBeInTheDocument()
      expect(screen.queryByText(/123/)).not.toBeInTheDocument()
    })
  })

  describe('notFound functionality', () => {
    it('should render function children when route matches', () => {
      render(
        <MicroRoute path="/users" currentPath="/users">
          {() => <div>Users Page</div>}
        </MicroRoute>
      )

      expect(screen.getByText('Users Page')).toBeInTheDocument()
    })

    it('should return null when no route matches and no NotFound', () => {
      const { container } = render(
        <MicroRoute path="/users" currentPath="/dashboard">
          {() => <div>Users Page</div>}
        </MicroRoute>
      )

      expect(container.firstChild).toBeNull()
    })

    it('should handle routing with parameters correctly', () => {
      let capturedParams: RouteParams | null = null

      render(
        <MicroRoute path="/user/:id" currentPath="/user/123">
          {(params) => {
            capturedParams = params
            return (
              <div>
                User
                {params.id}
              </div>
            )
          }}
        </MicroRoute>
      )

      expect(screen.getByText(/User/)).toBeInTheDocument()
      expect(screen.getByText(/123/)).toBeInTheDocument()
      expect(capturedParams).toEqual({ id: '123' })
    })
  })

  describe('internal path state', () => {
    it('should use internal path when currentPath is not provided', () => {
      render(<MicroRoute path="/">{() => <div>Home Page</div>}</MicroRoute>)

      expect(screen.getByText('Home Page')).toBeInTheDocument()
    })

    it('should prefer currentPath over internal path when provided', () => {
      render(
        <MicroRoute path="/users" currentPath="/users">
          {() => <div>Users Page</div>}
        </MicroRoute>
      )

      expect(screen.getByText('Users Page')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle root path matching', () => {
      render(
        <MicroRoute path="/" currentPath="/">
          {() => <div>Root Page</div>}
        </MicroRoute>
      )

      expect(screen.getByText('Root Page')).toBeInTheDocument()
    })

    it('should handle empty path segments', () => {
      render(
        <MicroRoute path="/users/:id" currentPath="/users/">
          {(params) => (
            <div>
              User
              {params.id}
            </div>
          )}
        </MicroRoute>
      )

      expect(screen.queryByText(/User/)).not.toBeInTheDocument()
    })

    it('should handle paths with trailing slashes', () => {
      render(
        <MicroRoute path="/users" currentPath="/users/">
          {() => <div>Users Page</div>}
        </MicroRoute>
      )

      expect(screen.queryByText('Users Page')).not.toBeInTheDocument()
    })

    it('should handle non-function children gracefully', () => {
      render(
        <MicroRoute
          path="/users"
          currentPath="/users"
          // @ts-expect-error - Testing behavior with invalid children type
          children={<div>Static Content</div>}
        />
      )

      expect(screen.getByText('Static Content')).toBeInTheDocument()
    })
  })

  describe('component properties', () => {
    it('should have correct displayName', () => {
      expect(MicroRoute.displayName).toBe('MicroRoute')
    })

    it('should have NotFound as static property', () => {
      expect(MicroRoute.NotFound).toBe(NotFound)
    })

    it('should have correct displayName for NotFound', () => {
      expect(NotFound.displayName).toBe('NotFound')
    })
  })

  describe('notFound component standalone', () => {
    it('should render NotFound component independently', () => {
      render(
        <NotFound>
          <div>Standalone Not Found</div>
        </NotFound>
      )

      expect(screen.getByText('Standalone Not Found')).toBeInTheDocument()
    })

    it('should handle complex children in NotFound', () => {
      render(
        <NotFound>
          <div>
            <span>Error</span>
            <button type="button">Retry</button>
          </div>
        </NotFound>
      )

      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.getByText('Retry')).toBeInTheDocument()
    })
  })

  describe('parameter extraction edge cases', () => {
    it('should handle parameters at the beginning of path', () => {
      let capturedParams: RouteParams | null = null

      render(
        <MicroRoute path="/:id/profile" currentPath="/123/profile">
          {(params) => {
            capturedParams = params
            return (
              <div>
                Profile
                {params.id}
              </div>
            )
          }}
        </MicroRoute>
      )

      expect(capturedParams).toEqual({ id: '123' })
    })

    it('should handle parameters at the end of path', () => {
      let capturedParams: RouteParams | null = null

      render(
        <MicroRoute path="/user/:id" currentPath="/user/456">
          {(params) => {
            capturedParams = params
            return (
              <div>
                User
                {params.id}
              </div>
            )
          }}
        </MicroRoute>
      )

      expect(capturedParams).toEqual({ id: '456' })
    })

    it('should handle numeric parameters', () => {
      let capturedParams: RouteParams | null = null

      render(
        <MicroRoute path="/page/:number" currentPath="/page/42">
          {(params) => {
            capturedParams = params
            return (
              <div>
                Page
                {params.number}
              </div>
            )
          }}
        </MicroRoute>
      )

      expect(capturedParams).toEqual({ number: '42' })
    })
  })
})
