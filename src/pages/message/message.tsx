import MessageList from '@/packages/message/components/MessageList/MessageList'
import { useCheckMessage } from '@/utils/hooks/useCheckMessage'
import { View } from '@tarojs/components'

export default function Message() {
  useCheckMessage()

  return (
    <View>
      <MessageList />
    </View>
  )
}
