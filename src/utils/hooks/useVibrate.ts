import { useAppSelector } from '@/redux/hooks'
import Taro from '@tarojs/taro'
import { useCallback } from 'react'

/**
 * 返回一个回调函数，如果 isVibrate 为 true，则触发短震动。
 * @param type - 要触发的震动类型。默认为 'medium'。
 * @returns 触发短震动的回调函数。
 */
export const useVibrate = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
  const isVibrate = useAppSelector(state => state.user.isVibrate)
  const vibrate = useCallback(async () => {
    if (isVibrate) {
      console.warn('vibrate')
      await Taro.vibrateShort({ type })
    }
  }, [isVibrate, type])
  return vibrate
}
