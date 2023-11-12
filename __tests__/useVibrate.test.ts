import { renderHook } from '@testing-library/react'
import { useVibrate } from '../src/utils/hooks/useVibrate'
import { useAppSelector } from '../src/redux/hooks'

jest.mock('../src/redux/hooks')
jest.mock('@tarojs/taro', () => ({
  vibrateShort: jest.fn().mockResolvedValue(undefined)
}))

describe('useVibrate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a function', () => {
    const { result } = renderHook(() => useVibrate())
    expect(typeof result.current).toBe('function')
  })

  it('should call useAppSelector with the correct argument', () => {
    renderHook(() => useVibrate())
    expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should call Taro.vibrateShort when isVibrate is true', async () => {
    (useAppSelector as jest.Mock).mockReturnValueOnce(true)
    const { result } = renderHook(() => useVibrate())
    await result.current()
    expect(require('@tarojs/taro').vibrateShort).toHaveBeenCalledWith({ type: 'medium' })
  })

  it('should not call Taro.vibrateShort when isVibrate is false', async () => {
    (useAppSelector as jest.Mock).mockReturnValueOnce(false)
    const { result } = renderHook(() => useVibrate())
    await result.current()
    expect(require('@tarojs/taro').vibrateShort).not.toHaveBeenCalled()
  })

  it('should call Taro.vibrateShort with the correct type', async () => {
    (useAppSelector as jest.Mock).mockReturnValueOnce(true)
    const { result } = renderHook(() => useVibrate('light'))
    await result.current()
    expect(require('@tarojs/taro').vibrateShort).toHaveBeenCalledWith({ type: 'light' })
  })
})
