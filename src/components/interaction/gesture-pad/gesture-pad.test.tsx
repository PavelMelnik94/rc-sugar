import { fireEvent, render, screen } from '@testing-library/react'
import { GesturePad } from './gesture-pad'

describe('gesturePad', () => {
  it('should render children', () => {
    render(
      <GesturePad gestures={{}}>
        <div data-testid="gesture-content">Swipe me!</div>
      </GesturePad>
    )

    expect(screen.getByTestId('gesture-content')).toHaveTextContent('Swipe me!')
  })

  it('should detect tap gestures', () => {
    const onTap = jest.fn()

    render(
      <GesturePad gestures={{ tap: onTap }}>
        <div data-testid="tap-area">Tap me!</div>
      </GesturePad>
    )

    const element = screen.getByTestId('tap-area')

    fireEvent.touchStart(element, {
      touches: [{ clientX: 100, clientY: 100, identifier: 1 }],
    })

    fireEvent.touchEnd(element, {
      changedTouches: [{ clientX: 100, clientY: 100, identifier: 1 }],
    })

    expect(onTap).toHaveBeenCalled()
  })

  it('should detect swipe right gesture', () => {
    const onSwipeRight = jest.fn()

    render(
      <GesturePad gestures={{ swipeRight: onSwipeRight }}>
        <div data-testid="swipe-area">Swipe right!</div>
      </GesturePad>
    )

    const element = screen.getByTestId('swipe-area')

    // Start touch on left side
    fireEvent.touchStart(element, {
      touches: [{ clientX: 50, clientY: 100, identifier: 1 }],
    })

    // End touch on right side (swipe right)
    fireEvent.touchEnd(element, {
      changedTouches: [{ clientX: 150, clientY: 100, identifier: 1 }],
    })

    expect(onSwipeRight).toHaveBeenCalled()
  })

  it('should detect swipe left gesture', () => {
    const onSwipeLeft = jest.fn()

    render(
      <GesturePad gestures={{ swipeLeft: onSwipeLeft }}>
        <div data-testid="swipe-area">Swipe left!</div>
      </GesturePad>
    )

    const element = screen.getByTestId('swipe-area')

    // Start touch on right side
    fireEvent.touchStart(element, {
      touches: [{ clientX: 150, clientY: 100, identifier: 1 }],
    })

    // End touch on left side (swipe left)
    fireEvent.touchEnd(element, {
      changedTouches: [{ clientX: 50, clientY: 100, identifier: 1 }],
    })

    expect(onSwipeLeft).toHaveBeenCalled()
  })

  it('should detect swipe up gesture', () => {
    const onSwipeUp = jest.fn()

    render(
      <GesturePad gestures={{ swipeUp: onSwipeUp }}>
        <div data-testid="swipe-area">Swipe up!</div>
      </GesturePad>
    )

    const element = screen.getByTestId('swipe-area')

    // Start touch on bottom
    fireEvent.touchStart(element, {
      touches: [{ clientX: 100, clientY: 200, identifier: 1 }],
    })

    // End touch on top (swipe up)
    fireEvent.touchEnd(element, {
      changedTouches: [{ clientX: 100, clientY: 50, identifier: 1 }],
    })

    expect(onSwipeUp).toHaveBeenCalled()
  })

  it('should detect swipe down gesture', () => {
    const onSwipeDown = jest.fn()

    render(
      <GesturePad gestures={{ swipeDown: onSwipeDown }}>
        <div data-testid="swipe-area">Swipe down!</div>
      </GesturePad>
    )

    const element = screen.getByTestId('swipe-area')

    // Start touch on top
    fireEvent.touchStart(element, {
      touches: [{ clientX: 100, clientY: 50, identifier: 1 }],
    })

    // End touch on bottom (swipe down)
    fireEvent.touchEnd(element, {
      changedTouches: [{ clientX: 100, clientY: 200, identifier: 1 }],
    })

    expect(onSwipeDown).toHaveBeenCalled()
  })

  it('should not trigger swipe for short distances', () => {
    const onSwipeRight = jest.fn()

    render(
      <GesturePad gestures={{ swipeRight: onSwipeRight }} minSwipeDistance={100}>
        <div data-testid="swipe-area">Short swipe</div>
      </GesturePad>
    )

    const element = screen.getByTestId('swipe-area')

    // Short swipe (less than minimum distance)
    fireEvent.touchStart(element, {
      touches: [{ clientX: 100, clientY: 100, identifier: 1 }],
    })

    fireEvent.touchEnd(element, {
      changedTouches: [{ clientX: 150, clientY: 100, identifier: 1 }],
    })

    expect(onSwipeRight).not.toHaveBeenCalled()
  })

  it('should handle pinch gestures with two fingers', () => {
    const onPinchIn = jest.fn()

    render(
      <GesturePad gestures={{ pinchIn: onPinchIn }}>
        <div data-testid="pinch-area">Pinch me!</div>
      </GesturePad>
    )

    const element = screen.getByTestId('pinch-area')

    // Two finger pinch in (start far apart, end close together)
    fireEvent.touchStart(element, {
      touches: [
        { clientX: 50, clientY: 100, identifier: 1 },
        { clientX: 200, clientY: 100, identifier: 2 },
      ],
    })

    fireEvent.touchEnd(element, {
      changedTouches: [
        { clientX: 100, clientY: 100, identifier: 1 },
        { clientX: 120, clientY: 100, identifier: 2 },
      ],
    })

    expect(onPinchIn).toHaveBeenCalled()
  })

  it('should handle long press gestures', () => {
    jest.useFakeTimers()
    const onLongPress = jest.fn()

    render(
      <GesturePad gestures={{ longPress: onLongPress }} longPressTime={500}>
        <div data-testid="long-press-area">Long press me!</div>
      </GesturePad>
    )

    const element = screen.getByTestId('long-press-area')

    // Start touch
    fireEvent.touchStart(element, {
      touches: [{ clientX: 100, clientY: 100, identifier: 1 }],
    })

    // Advance time to trigger long press
    jest.advanceTimersByTime(500)

    expect(onLongPress).toHaveBeenCalled()

    jest.useRealTimers()
  })

  it('should detect double tap gestures', () => {
    jest.useFakeTimers()
    const onDoubleTap = jest.fn()
    const onTap = jest.fn()

    render(
      <GesturePad gestures={{ doubleTap: onDoubleTap, tap: onTap }} doubleTapWindow={300}>
        <div data-testid="double-tap-area">Double tap me!</div>
      </GesturePad>
    )

    const element = screen.getByTestId('double-tap-area')

    // First tap
    fireEvent.touchStart(element, {
      touches: [{ clientX: 100, clientY: 100, identifier: 1 }],
    })
    fireEvent.touchEnd(element, {
      changedTouches: [{ clientX: 100, clientY: 100, identifier: 1 }],
    })

    // Advance a little time (within double tap window)
    jest.advanceTimersByTime(100)

    // Second tap (should trigger double tap)
    fireEvent.touchStart(element, {
      touches: [{ clientX: 100, clientY: 100, identifier: 1 }],
    })
    fireEvent.touchEnd(element, {
      changedTouches: [{ clientX: 100, clientY: 100, identifier: 1 }],
    })

    expect(onDoubleTap).toHaveBeenCalled()
    expect(onTap).toHaveBeenCalledTimes(1) // Only the first tap

    jest.useRealTimers()
  })

  it('should handle pinch out gestures', () => {
    const onPinchOut = jest.fn()

    render(
      <GesturePad gestures={{ pinchOut: onPinchOut }}>
        <div data-testid="pinch-out-area">Pinch out!</div>
      </GesturePad>
    )

    const element = screen.getByTestId('pinch-out-area')

    // Two finger pinch out (start close together, end far apart)
    fireEvent.touchStart(element, {
      touches: [
        { clientX: 100, clientY: 100, identifier: 1 },
        { clientX: 120, clientY: 100, identifier: 2 },
      ],
    })

    fireEvent.touchEnd(element, {
      changedTouches: [
        { clientX: 50, clientY: 100, identifier: 1 },
        { clientX: 200, clientY: 100, identifier: 2 },
      ],
    })

    expect(onPinchOut).toHaveBeenCalled()
  })

  it('should have correct displayName', () => {
    expect(GesturePad.displayName).toBe('GesturePad')
  })
})
