import { checkNotice } from '@/api/Notice'
import { setNoticeCnt } from '@/redux/slice/noticeSlice'
import Taro, { useDidShow } from '@tarojs/taro'
import { useVibrateCallback } from './useVibrateCallback'
import { useAppDispatch } from '@/redux/hooks'

export const useCheckMessage = () => {
  const dispatch = useAppDispatch()

  useDidShow(
    useVibrateCallback(async () => {
      const data = await checkNotice()
      dispatch(setNoticeCnt(data))
      if (data.total === 0) {
        try {
          await Taro.hideTabBarRedDot({
            index: 1
          })
        } catch (err) {
          console.log('CAN NOT HIDE TABBAR REDDOT', err)
        }
        return
      }
      await Taro.setTabBarBadge({
        index: 1,
        text: data.total > 99 ? '99+' : data.total.toString()
      })
    })
  )
}
