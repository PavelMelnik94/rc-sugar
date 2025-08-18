import { render, screen } from '@testing-library/react'
import React from 'react'
import { For } from '../for'

describe('for Component', () => {
  it('renders items correctly', () => {
    const items = ['Item 1', 'Item 2', 'Item 3']

    render(<For each={items}>{({ item, index }) => <div key={index}>{item}</div>}</For>)

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })

  it('renders fallback when array is empty', () => {
    render(
      <For each={[]} fallback={<div>No items</div>}>
        {({ item, index }) => <div key={index}>{item}</div>}
      </For>
    )

    expect(screen.getByText('No items')).toBeInTheDocument()
  })

  it('renders fallback when array is null', () => {
    render(
      <For each={null as any} fallback={<div>No items</div>}>
        {/* @ts-expect-error - null is not assignable to type 'any[]' */}
        {({ item, index }) => <div key={index}>{item}</div>}
      </For>
    )

    expect(screen.getByText('No items')).toBeInTheDocument()
  })

  it('provides correct index to render function', () => {
    const items = ['A', 'B', 'C']

    render(
      <For each={items}>
        {({ item, index }) => (
          <div key={index}>
            Item {index}: {item}
          </div>
        )}
      </For>
    )

    expect(screen.getByText('Item 0: A')).toBeInTheDocument()
    expect(screen.getByText('Item 1: B')).toBeInTheDocument()
    expect(screen.getByText('Item 2: C')).toBeInTheDocument()
  })

  it('handles complex objects', () => {
    const users = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ]

    render(
      <For each={users}>
        {({ item: user, index }) => (
          <div key={user.id}>
            User {index + 1}: {user.name}
          </div>
        )}
      </For>
    )

    expect(screen.getByText('User 1: John')).toBeInTheDocument()
    expect(screen.getByText('User 2: Jane')).toBeInTheDocument()
  })
})
