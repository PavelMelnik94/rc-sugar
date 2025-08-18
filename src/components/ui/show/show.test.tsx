import { render, screen } from '@testing-library/react'
import React from 'react'
import { Show } from '../show'

describe('show Component', () => {
  it('renders children when condition is true', () => {
    render(
      <Show when={true}>
        <div>Visible content</div>
      </Show>
    )

    expect(screen.getByText('Visible content')).toBeInTheDocument()
  })

  it('does not render children when condition is false', () => {
    render(
      <Show when={false}>
        <div>Hidden content</div>
      </Show>
    )

    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })

  it('renders fallback when condition is false and fallback is provided', () => {
    render(
      <Show when={false} fallback={<div>Fallback content</div>}>
        <div>Hidden content</div>
      </Show>
    )

    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
    expect(screen.getByText('Fallback content')).toBeInTheDocument()
  })

  it('renders children over fallback when condition is true', () => {
    render(
      <Show when={true} fallback={<div>Fallback content</div>}>
        <div>Visible content</div>
      </Show>
    )

    expect(screen.getByText('Visible content')).toBeInTheDocument()
    expect(screen.queryByText('Fallback content')).not.toBeInTheDocument()
  })

  it('works with function children', () => {
    render(<Show when={true}>{() => <div>Function child</div>}</Show>)

    expect(screen.getByText('Function child')).toBeInTheDocument()
  })
})
