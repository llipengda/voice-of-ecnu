import { serverUrl } from '@/common/constants'
import Taro from '@tarojs/taro'
import { CreateReplyParams, Reply } from '@/types/reply'
import { Result } from '@/types/result'
import { WithUserInfo } from '@/types/withUserInfo'

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
  return data.data.data
}
