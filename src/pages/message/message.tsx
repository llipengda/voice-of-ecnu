import Board from '@/packages/message/components/Board/Board'
import MessageList from '@/packages/message/components/MessageList/MessageList'
import { useAppSelector } from '@/redux/hooks'
import { useCheckMessage } from '@/utils/hooks/useCheckMessage'
import { View } from '@tarojs/components'

export default function Message() {
  useCheckMessage()

  const showComponent = useAppSelector(state => state.review.showComponent)

  return (
    <View>
      <MessageList />
      {showComponent && <Board />}
    </View>
  )
}
