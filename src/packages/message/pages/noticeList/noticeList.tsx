import Taro from '@tarojs/taro'
import { useState } from 'react'

type NoticeType = 'system' | 'reply' | 'like'

export default function list() {
  const params = Taro.getCurrentInstance().router?.params

  const [noticeType] = useState<NoticeType>(
    (params?.type as NoticeType) || 'system'
  )
  
  return <div>{noticeType}</div>
}
