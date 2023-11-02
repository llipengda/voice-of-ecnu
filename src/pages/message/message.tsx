import MessageList from '@/packages/messages/components/MessageList/MessageList'
import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

export default function message() {
  useLoad(() => {
    console.log('message loaded')
  })

  return (
    <View>
      <MessageList />
    </View>
  )
}
