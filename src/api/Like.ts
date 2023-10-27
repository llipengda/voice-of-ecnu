import Taro from '@tarojs/taro'
import { serverUrl } from '@/common/constants'
import { Result } from 'types/result'

/**
 *
 * @param type 0 帖子 1 评论 2 回复
 */
export const checkLike = async (id: number, type: 0 | 1 | 2 = 0) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/like/check`,
    method: 'GET',
    data: {
      id,
      type,
    },
  })
  return data.data.data
}

/**
 *
 * @param type 0 帖子 1 评论 2 回复
 */
export const likePost = async (id: number, type: 0 | 1 | 2 = 0) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/like/like?id=${id}&type=${type}`,
    method: 'POST',
  })
  return data.data.data
}

/**
 *
 * @param type 0 帖子 1 评论 2 回复
 */
export const unlikePost = async (id: number, type: 0 | 1 | 2 = 0) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/like/unlike?id=${id}&type=${type}`,
    method: 'POST',
  })
  return data.data.data
}
