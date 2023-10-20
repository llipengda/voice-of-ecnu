import { View } from '@tarojs/components'
import { useState } from 'react'
import { AtButton } from 'taro-ui'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <View>
      <View style={{ textAlign: 'center' }}>clicked {count} times</View>
      <AtButton
        onClick={() => setCount(count => count + 1)}
        type='primary'
        size='small'
      >
        cilck me
      </AtButton>
    </View>
  )
}
