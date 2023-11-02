import { View } from '@tarojs/components'
import MessageListItem from '../MessageListItem/MessageListItem'
import './MessageList.scss'
import { useAppSelector } from '@/redux/hooks'

export default function MessageList() {
  const noticeCnt = useAppSelector(state => state.notice)

  return (
    <View className='message-list'>
      <MessageListItem
        icon='settings'
        title='系统消息'
        describe='你有新的系统消息'
        number={noticeCnt.system}
      />
      <MessageListItem
        icon='heart-2'
        title='点赞'
        describe='你收到了新的点赞'
        number={noticeCnt.like.total}
      />
      <MessageListItem
        icon='message'
        title='回复'
        describe='你收到了新的回复'
        number={noticeCnt.reply.total}
      />
    </View>
  )
}
