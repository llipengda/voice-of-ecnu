import Taro from '@tarojs/taro'
import { serverUrl } from '@/common/constants'
import { Result } from 'types/result'

export const checkStar = async (postId: number) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/star/check`,
    method: 'GET',
    data: {
      postId,
    },
  })
  return data.data.data
}

export const starPost = async (postId: number) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/star/starPost?postId=${postId}`,
    method: 'POST',
  })
  return data.data.data
}

export const unstarPost = async (postId: number) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/star/unstarPost?postId=${postId}`,
    method: 'POST',
  })
  return data.data.data
}
