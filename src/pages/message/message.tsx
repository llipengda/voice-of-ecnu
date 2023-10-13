import { Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

export default function message() {
  useLoad(() => {
    console.log('message loaded')
  })

  return <Text>Hello from message</Text>
}
