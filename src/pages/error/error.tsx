import { ErrorCode } from '@/types/commonErrorCode'
import { generateErrorMessage } from '@/utils/generateErrorMessage'
import { Button, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import './error.scss'

export default function Error() {
  const params = Taro.getCurrentInstance().router?.params
  const [errorCode] = useState<ErrorCode>(
    (Number(params?.errorCode) as ErrorCode) || ErrorCode.NOT_FOUND
  )
  const [errorMessage] = useState<string>(params?.errorMessage || '')
  const [showErrorCode] = useState<boolean>(
    (params?.showErrorCode || 'true') === 'true'
  )

  const handleRestart = async () => {
    await Taro.clearStorage()
    await Taro.reLaunch({
      url: '/pages/home/home'
    })
  }

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
          onClick={() => Taro.navigateBack()}
        >
          返回上一页面
        </Button>
        <Button
          className='error__button'
          onClick={async () => await Taro.reLaunch({ url: '/pages/home/home' })}
        >
          返回首页
        </Button>
        <Button className='error__button' onClick={handleRestart}>
          清除缓存并重启
        </Button>
      </View>
    </View>
  )
}
