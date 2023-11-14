import { useAppSelector } from '@/redux/hooks'
import { decreaseShoudNotVibrate } from '@/redux/slice/commonSlice'
import Taro from '@tarojs/taro'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

/**
 * 返回一个回调函数，如果 isVibrate 为 true，则触发短震动。
 * @param type - 要触发的震动类型。默认为 'medium'。
 * @returns 触发短震动的回调函数。
 */
export const useVibrate = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
  const isVibrate = useAppSelector(state => state.user.isVibrate)
  const cnt = useAppSelector(state => state.common.shoudNotVibrate)
  const dispatch = useDispatch()
  const vibrate = useCallback(async () => {
    if (isVibrate) {
      if (cnt > 0) {
        dispatch(decreaseShoudNotVibrate())
        return
      }
      await Taro.vibrateShort({ type })
    }
  }, [isVibrate, cnt, type])
  return vibrate
}
