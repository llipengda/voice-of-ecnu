import { serverUrl } from '@/common/constants'
import Taro from '@tarojs/taro'
import { Result } from '@/types/result'
import { Comment, CreateCommentParams } from '@/types/comment'
import { WithUserInfo } from '@/types/withUserInfo'

export const getCommentList = async (
  postId: number,
  page: number,
  pageSize: number,
  orderByDesc: boolean = false
) => {
  const data = await Taro.request<Result<Comment[]>>({
    url: `${serverUrl}/comment/getCommentList`,
    method: 'GET',
    data: {
      postId,
      page,
      pageSize,
      orderByDesc,
    },
  })
  return data.data.data
}

export const deleteComment = async (commentId: number) => {
  const data = await Taro.request<Result<string>>({
    url: `${serverUrl}/comment/deleteComment?commentId=${commentId}`,
    method: 'POST',
  })
  return data.data.data
}

export const createComment = async (params: CreateCommentParams) => {
  const data = await Taro.request<Result<Comment>>({
    url: `${serverUrl}/comment/createComment`,
    method: 'POST',
    data: params,
  })
  return data.data.data
}

export const getCommentListWithUserInfo = async (
  postId: number,
  page: number,
  pageSize: number,
  orderByDesc: boolean = false
) => {
  const data = await Taro.request<Result<WithUserInfo<Comment>[]>>({
    url: `${serverUrl}/comment/comments`,
    method: 'GET',
    data: {
      postId,
      page,
      pageSize,
      orderByDesc,
    },
  })
  return data.data.data
}
