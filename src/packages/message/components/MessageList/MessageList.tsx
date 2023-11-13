import { View } from '@tarojs/components'
import MessageListItem from '../MessageListItem/MessageListItem'
import { useAppSelector } from '@/redux/hooks'
import Taro from '@tarojs/taro'
import './MessageList.scss'
import { useVibrateCallback } from '@/utils/hooks/useVibrateCallback'

export default function MessageList() {
  const noticeCnt = useAppSelector(state => state.notice)
  const showComponent = useAppSelector(state => state.review.showComponent)

  const navigateTo = useVibrateCallback((type: 0 | 1 | 2) => {
    Taro.navigateTo({
      url: `/packages/message/pages/noticeList/noticeList?type=${type}`
    })
  })

  return (
    <View className='message-list'>
      <MessageListItem
        icon='settings'
        title='系统消息'
        describe='你有新的系统消息'
        number={noticeCnt.system}
        onClick={() => navigateTo(0)}
      />
      <MessageListItem
        icon='heart-2'
        title='点赞'
        describe='你收到了新的点赞'
        number={noticeCnt.like.total}
        onClick={() => navigateTo(1)}
      />
      {showComponent && (
        <MessageListItem
          icon='message'
          title='回复'
          describe='你收到了新的回复'
          number={noticeCnt.reply.total}
          onClick={() => navigateTo(2)}
        />
      )}
    </View>
  )
}
