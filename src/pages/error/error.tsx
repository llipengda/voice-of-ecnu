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
  const [showErrorCode] = useState<boolean>(
    (params?.showErrorCode || 'true') === 'true'
  )

  return (
    <View className='error'>
      <View className='error__content'>
        <View className='at-icon at-icon-alert-circle error__icon' />
        <View className='error__wrap'>
          {showErrorCode && (
            <View className='error__code'>错误代码：{errorCode}</View>
          )}
          <View className='error__message'>
            {generateErrorMessage(errorCode)}
          </View>
        </View>
        <Button className='error__button' onClick={() => Taro.navigateBack()}>
          返回上一页面
        </Button>
      </View>
    </View>
  )
}
