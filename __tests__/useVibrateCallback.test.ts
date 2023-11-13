import { renderHook } from '@testing-library/react'
import { useVibrateCallback } from '../src/utils/hooks/useVibrateCallback'
import { useVibrate } from '../src/utils/hooks/useVibrate'
import React, { useCallback } from 'react'

jest.mock('../src/utils/hooks/useVibrate', () => ({
  useVibrate: jest.fn().mockReturnValue(jest.fn())
}))

describe('useVibrateCallback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a function', () => {
    const { result } = renderHook(() => useVibrateCallback(() => {}))
    expect(typeof result.current).toBe('function')
  })

  it('should call useVibrate', () => {
    renderHook(() => useVibrateCallback(() => {}))
    expect(useVibrate).toHaveBeenCalled()
  })

  it('should call the callback function', async () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useVibrateCallback(callback))
    await result.current()
    expect(callback).toHaveBeenCalled()
  })

  it('should pass arguments to the callback function', async () => {
    const callback = jest.fn()
    const { result } = renderHook(() => useVibrateCallback(callback))
    await result.current('foo', 'bar')
    expect(callback).toHaveBeenCalledWith('foo', 'bar')
  })

  it('should return the result of the callback function', async () => {
    const callback = jest.fn().mockReturnValueOnce('baz')
    const { result } = renderHook(() => useVibrateCallback(callback))
    const resultValue = await result.current()
    expect(resultValue).toBe('baz')
  })

  it('should pass additional arguments to callback function', async () => {
    const callback = jest.fn()
    const args = ['foo', 'bar']
    const { result } = renderHook(() =>
      useVibrateCallback(callback, [], ...args)
    )
    await result.current(...args)
    expect(callback).toHaveBeenCalledWith(...args)
  })

  it('should pass additional dependencies to useCallback', async () => {
    const callback = jest.fn()
    jest
      .spyOn(React, 'useCallback')
      .mockImplementation((func, deps) => useCallback(func, deps))
    const deps = ['foo', 'bar']
    const { result, rerender } = renderHook(
      ({ deps }) => useVibrateCallback(callback, deps),
      { initialProps: { deps } }
    )
    await result.current()
    expect(callback).toHaveBeenCalled()
    expect(React.useCallback).toHaveBeenCalledWith(expect.any(Function), [
      ...deps,
      expect.any(Function)
    ])
    rerender({ deps: ['foo', 'baz'] })
    expect(React.useCallback).toHaveBeenCalledWith(expect.any(Function), [
      'foo',
      'baz',
      expect.any(Function)
    ])
  })
})
