import { render, screen } from '@testing-library/react'
import React from 'react'
import { Compose } from './compose'

describe('compose Component', () => {
  it('should render children when no components provided', () => {
    render(
      <Compose components={[]}>
        <div data-testid="content">Test Content</div>
      </Compose>
    )

    const content = screen.getByTestId('content');
    console.log('Rendered content:', content.textContent);
    expect(content).toHaveTextContent(/Test\s+Content/)
  })

  it('should compose components', () => {
    const WrapperA = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="wrapper-a">
        A: {children}
      </div>
    )

    render(
      <Compose components={[WrapperA]}>
        <span data-testid="content">Content</span>
      </Compose>
    )

    const content = screen.getByTestId('content');
    const wrapperA = screen.getByTestId('wrapper-a');
    console.log('Rendered content:', content.textContent);
    console.log('Rendered wrapperA:', wrapperA.textContent);
    expect(content).toHaveTextContent(/Content/)
    expect(wrapperA).toHaveTextContent(/A:\s+Content/)
  })

  it('should handle HOC functions', () => {
    const withPrefix = (children: React.ReactNode) => (
      <div data-testid="prefix">
        Prefix: {children}
      </div>
    )

    render(
      <Compose components={[withPrefix]}>
        <span data-testid="content">Content</span>
      </Compose>
    )

    const content = screen.getByTestId('content');
    const prefix = screen.getByTestId('prefix');
    console.log('Rendered content:', content.textContent);
    console.log('Rendered prefix:', prefix.textContent);
    expect(content).toHaveTextContent(/Content/)
    expect(prefix).toHaveTextContent(/Prefix:\s+Content/)
  })

  it('should handle single component', () => {
    const SingleWrapper = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="single">
        Single: {children}
      </div>
    )

    render(
      <Compose components={[SingleWrapper]}>
        <span data-testid="content">Content</span>
      </Compose>
    )

    const single = screen.getByTestId('single');
    const content = screen.getByTestId('content');
    console.log('Rendered single:', single.textContent);
    console.log('Rendered content:', content.textContent);
    expect(single).toHaveTextContent(/Single:\s+Content/)
    expect(content).toHaveTextContent(/Content/)
  })

  it('should handle string children', () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="wrapper">
        Wrapped: {children}
      </div>
    )

    render(<Compose components={[Wrapper]}>Simple text content</Compose>)

    const wrapper = screen.getByTestId('wrapper');
    console.log('Rendered wrapper:', wrapper.textContent);
    expect(wrapper).toHaveTextContent(/Wrapped:\s+Simple\s+text\s+content/)
  })

  /**
   * Проверяет, что компоненты рендерятся в обратном порядке.
   */
  it('should handle reverse order', () => {
    const FirstWrapper = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="first">
        First: {children}
      </div>
    )

    const SecondWrapper = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="second">
        Second: {children}
      </div>
    )

    render(
      <Compose components={[FirstWrapper, SecondWrapper]} reverse={true}>
        <span data-testid="content">Content</span>
      </Compose>
    )

    const second = screen.getByTestId('second');
    const first = screen.getByTestId('first');
    console.log('Rendered second:', second.textContent);
    console.log('Rendered first:', first.textContent);
    expect(second).toHaveTextContent(/Second:\s+Content/)
    expect(first).toHaveTextContent(/First:\s+Second:\s+Content/)
  })


  it('should handle multiple components', () => {
    const WrapperA = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="wrapper-a">
        A: {children}
      </div>
    )

    const WrapperB = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="wrapper-b">
        B: {children}
      </div>
    )

    render(
      <Compose components={[WrapperA, WrapperB]}>
        <span data-testid="content">Content</span>
      </Compose>
    )

    const content = screen.getByTestId('content');
    const wrapperA = screen.getByTestId('wrapper-a');
    const wrapperB = screen.getByTestId('wrapper-b');
    console.log('Rendered content:', content.textContent);
    console.log('Rendered wrapperA:', wrapperA.textContent);
    console.log('Rendered wrapperB:', wrapperB.textContent);
    expect(content).toHaveTextContent(/Content/)
    expect(wrapperA).toHaveTextContent(/A:\s+Content/)
    expect(wrapperB).toHaveTextContent(/B:\s+A:\s+Content/)
  })
})

  it('should handle empty children', () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="wrapper">
        Wrapped: {children}
      </div>
    );

    render(<Compose components={[Wrapper]}>{undefined}</Compose>);

    const wrapper = screen.getByTestId('wrapper');
    console.log('Rendered wrapper:', wrapper.textContent);
    expect(wrapper).toHaveTextContent(/Wrapped:/);
  });

  it('should handle deeply nested components', () => {
    const WrapperA = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="wrapper-a">
        A: {children}
      </div>
    );

    const WrapperB = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="wrapper-b">
        B: {children}
      </div>
    );

    const WrapperC = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="wrapper-c">
        C: {children}
      </div>
    );

    render(
      <Compose components={[WrapperC, WrapperB, WrapperA]}>
        <span data-testid="content">Content</span>
      </Compose>
    );

    const wrapperA = screen.getByTestId('wrapper-a');
    const wrapperB = screen.getByTestId('wrapper-b');
    const wrapperC = screen.getByTestId('wrapper-c');
    console.log('Rendered wrapperA:', wrapperA.textContent);
    console.log('Rendered wrapperB:', wrapperB.textContent);
    console.log('Rendered wrapperC:', wrapperC.textContent);
    expect(wrapperA).toHaveTextContent(/A:\s+B:\s+C:\s+Content/);
    expect(wrapperB).toHaveTextContent(/B:\s+C:\s+Content/);
    expect(wrapperC).toHaveTextContent(/C:\s+Content/);
  });
