import { View } from '@tarojs/components'
import { useState } from 'react'
import { OneSentence as TOneSentence } from '@/types/notice'
import './OneSentence.scss'
import { getOneSentence } from '@/api/Notice'
import { useVibrateCallback } from '@/utils/hooks/useVibrateCallback'
import { useDidShow } from '@tarojs/taro'

export default function OneSentence() {
  const [sentence, setSentence] = useState<TOneSentence>()

  const getData = async () => {
    const data = await getOneSentence()
    setSentence(data)
  }

  const handleRefresh = useVibrateCallback(async () => {
    await getData()
  })

  useDidShow(async () => {
    await getData()
  })

  return (
    <View className='one-sentence'>
      <View className='one-sentence__header'>
        <View className='one-sentence__header__title'>一言</View>
        <View
          className='one-sentence__header__refresh at-icon at-icon-reload'
          onClick={handleRefresh}
        />
      </View>
      <View className='one-sentence__content'>
        <View className='one-sentence__content__text'>
          {sentence?.sentence || '加载中...'}
        </View>
        <View className='one-sentence__content__from'>
          {sentence ? `—— ${sentence.author}《${sentence.source}》` : ''}
        </View>
      </View>
    </View>
  )
}
