import { View } from '@tarojs/components'
import MessageListItem from '../MessageListItem/MessageListItem'
import './MessageList.scss'

export default function MessageList() {
  return (
    <View className='message-list'>
      <MessageListItem
        icon='settings'
        title='系统消息'
        describe='你有新的系统消息'
        number={10}
      />
      <MessageListItem
        icon='heart-2'
        title='点赞'
        describe='有人点赞了你的帖子'
        number={0}
      />
      <MessageListItem
        icon='message'
        title='回复'
        describe='有人回复了你的帖子'
        number={20}
      />
    </View>
  )
}
