import { checkNotice } from '@/api/Notice'
import MessageList from '@/packages/messages/components/MessageList/MessageList'
import { useAppDispatch } from '@/redux/hooks'
import { setNoticeCnt } from '@/redux/slice/noticeSlice'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useDidShow } from '@tarojs/taro'

export default function message() {
  const dispatch = useAppDispatch()
  
  useDidShow(async () => {
    const data = await checkNotice()
    dispatch(setNoticeCnt(data))
    if (data.total === 0) return
    Taro.setTabBarBadge({
      index: 1,
      text: data.total > 99 ? '99+' : data.total.toString(),
    })
  })

  return (
    <View>
      <MessageList />
    </View>
  )
}
