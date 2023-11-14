import Board from '@/packages/message/components/Board/Board'
import MessageList from '@/packages/message/components/MessageList/MessageList'
import { useAppSelector } from '@/redux/hooks'
import { useCheckMessage } from '@/utils/hooks/useCheckMessage'
import { useVibrateCallback } from '@/utils/hooks/useVibrateCallback'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtFab } from 'taro-ui'
import '@/custom-theme.scss'
import OneSentence from '@/packages/message/components/OneSentence/OneSentence'

export default function Message() {
  useCheckMessage()

  const showComponent = useAppSelector(state => state.review.showComponent)
  const userRole = useAppSelector(state => state.user.role)

  const handleClickAdd = useVibrateCallback(() => {
    Taro.navigateTo({
      url: '/packages/post/pages/add/add?type=board'
    })
  })

  return (
    <View>
      <MessageList />
      {showComponent && <Board />}
      {showComponent && userRole <= 0 && (
        <View style={{ position: 'fixed', bottom: '16px', right: '16px' }}>
          <AtFab onClick={handleClickAdd}>
            <View className='at-fab__icon at-icon at-icon-add' />
          </AtFab>
        </View>
      )}
      <OneSentence />
    </View>
  )
}
