import { ErrorCode } from '@/types/commonErrorCode'
import { generateErrorMessage } from '@/utils/generateErrorMessage'
import { Button, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import './error.scss'
import { useVibrateCallback } from '@/utils/hooks/useVibrateCallback'
import { useCheckMessage } from '@/utils/hooks/useCheckMessage'

export default function Error() {
  const params = Taro.getCurrentInstance().router?.params
  const [errorCode] = useState<ErrorCode>(
    (Number(params?.errorCode) as ErrorCode) || -1
  )
  const [errorMessage] = useState<string>(params?.errorMessage || '')
  const [showErrorCode] = useState<boolean>(
    (params?.showErrorCode || 'true') === 'true'
  )

  const handleRestart = useVibrateCallback(async () => {
    await Taro.clearStorage()
    await Taro.reLaunch({
      url: '/pages/home/home'
    })
  })

  const handleBack = useVibrateCallback(() => Taro.navigateBack())

  const handleBackHome = useVibrateCallback(
    async () => await Taro.reLaunch({ url: '/pages/home/home' })
  )

  useCheckMessage()

  return (
    <View className='error'>
      <View className='error__content'>
        <View className='at-icon at-icon-alert-circle error__icon' />
        <View className='error__wrap'>
          {showErrorCode && (
            <View className='error__code'>错误代码：{errorCode}</View>
          )}
          <View className='error__message'>
            {generateErrorMessage(errorCode) || errorMessage}
          </View>
        </View>
        <Button
          className='error__button error__button__first'
          onClick={handleBack}
        >
          返回上一页面
        </Button>
        <Button className='error__button' onClick={handleBackHome}>
          返回首页
        </Button>
        <Button className='error__button' onClick={handleRestart}>
          清除缓存并重启
        </Button>
      </View>
    </View>
  )
}
