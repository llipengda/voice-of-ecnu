import Taro from '@tarojs/taro'
import { peiranAvatar, serverUrl } from '@/common/constants'
import { Result } from '@/types/result'
import { WithUserInfo } from '@/types/withUserInfo'
import { Post } from '@/types/post'
import store from '@/redux/store'

/**
 * @deprecated
 */
export const checkStar = async (postId: number) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/star/check`,
    method: 'GET',
    data: {
      postId
    }
  })
  return data.data.data
}

export const starPost = async (postId: number) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/star/starPost?postId=${postId}`,
    method: 'POST'
  })
  return data.data.data
}

export const unstarPost = async (postId: number) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/star/unstarPost?postId=${postId}`,
    method: 'POST'
  })
  return data.data.data
}

/**
 * @deprecated
 */
export const getStarList = async () => {
  const data = await Taro.request<Result<WithUserInfo<Post>[]>>({
    url: `${serverUrl}/star/getStarListByUserId`,
    method: 'GET'
  })
  return data.data.data
}

export const getStarListPage = async (page: number, pageSize: number) => {
  const data = await Taro.request<Result<WithUserInfo<Post>[]>>({
    url: `${serverUrl}/star/get`,
    method: 'GET',
    data: {
      page,
      pageSize
    }
  })
  if (store.getState().common.yuntianMode) {
    data.data.data.forEach(post => {
      post.userName = '沛然女皇'
      post.userAvatar = peiranAvatar
    })
  }
  return data.data.data
}
