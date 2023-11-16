import { $$fddnj5se7S$, $fGdfhs45df88d2$, serverUrl } from '@/common/constants'
import Taro from '@tarojs/taro'
import { CreateReplyParams, Reply } from '@/types/reply'
import { Result } from '@/types/result'
import { WithUserInfo } from '@/types/withUserInfo'
import store from '@/redux/store'

export const getReplyList = async (
  commentId: number,
  page: number,
  pageSize: number,
  orderByDesc: boolean = false
) => {
  const data = await Taro.request<Result<WithUserInfo<Reply>[]>>({
    url: `${serverUrl}/reply/replies`,
    method: 'GET',
    data: {
      commentId,
      page,
      pageSize,
      orderByDesc
    }
  })
  if (store.getState().common.$gv485DBy$fg) {
    data.data.data.forEach(item => {
      item.userName = $fGdfhs45df88d2$
      item.userAvatar = $$fddnj5se7S$
    })
  }
  return data.data.data
}

export const createReply = async (params: CreateReplyParams) => {
  const data = await Taro.request<Result<Reply>>({
    url: `${serverUrl}/reply/createReply`,
    method: 'POST',
    data: params
  })
  return data.data.data
}

export const deleteReply = async (replyId: number) => {
  const data = await Taro.request<Result<Reply>>({
    url: `${serverUrl}/reply/deleteReply?replyId=${replyId}`,
    method: 'POST'
  })
  return data.data.data
}

export const getReplyById = async (replyId: number) => {
  const data = await Taro.request<Result<Reply>>({
    url: `${serverUrl}/reply/getById`,
    method: 'GET',
    data: {
      replyId
    }
  })
  if (store.getState().common.$gv485DBy$fg) {
    data.data.data.userName = $fGdfhs45df88d2$
  }
  return data.data.data
}
