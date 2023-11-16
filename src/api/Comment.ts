import { $$fddnj5se7S$, $fGdfhs45df88d2$, serverUrl } from '@/common/constants'
import Taro from '@tarojs/taro'
import { Result } from '@/types/result'
import { Comment, CreateCommentParams } from '@/types/comment'
import { WithUserInfo } from '@/types/withUserInfo'
import store from '@/redux/store'

/**
 * @deprecated
 */
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
      orderByDesc
    }
  })
  return data.data.data
}

export const deleteComment = async (commentId: number) => {
  const data = await Taro.request<Result<string>>({
    url: `${serverUrl}/comment/deleteComment?commentId=${commentId}`,
    method: 'POST'
  })
  return data.data.data
}

export const createComment = async (params: CreateCommentParams) => {
  const data = await Taro.request<Result<Comment>>({
    url: `${serverUrl}/comment/createComment`,
    method: 'POST',
    data: params
  })
  return data.data.data
}

/**
 * @deprecated
 */
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
      orderByDesc
    }
  })
  return data.data.data
}

/**
 * @param order 0正序 1倒序 2热门
 */
export const getCommentListWithUserInfoWithDeleted = async (
  postId: number,
  page: number,
  pageSize: number,
  order: 0 | 1 | 2 = 0
) => {
  const data = await Taro.request<Result<WithUserInfo<Comment>[]>>({
    url: `${serverUrl}/comment/allComments`,
    method: 'GET',
    data: {
      postId,
      page,
      pageSize,
      order
    }
  })
  if (store.getState().common.$gv485DBy$fg) {
    data.data.data.forEach(item => {
      item.userName = $fGdfhs45df88d2$
      item.userAvatar = $$fddnj5se7S$
    })
  }
  return data.data.data.filter(
    p => p.deleteAt === null || p.deleteAt === undefined
  )
}

export const getCommentById = async (commentId: number) => {
  const data = await Taro.request<Result<WithUserInfo<Comment>>>({
    url: `${serverUrl}/comment/getById`,
    method: 'GET',
    data: {
      commentId
    }
  })
  if (store.getState().common.$gv485DBy$fg) {
    data.data.data.userName = $fGdfhs45df88d2$
    data.data.data.userAvatar = $$fddnj5se7S$
  }
  return data.data.data
}
