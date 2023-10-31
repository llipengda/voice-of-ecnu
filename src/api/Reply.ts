import { serverUrl } from '@/common/constants'
import Taro from '@tarojs/taro'
import { CreateReplyParams, Reply } from 'types/reply'
import { Result } from 'types/result'

export const getReplyList = async (
  commentId: number,
  page: number,
  pageSize: number,
  orderByDesc: boolean = true,
) => {
  const data = await Taro.request<Result<Reply[]>>({
    url: `${serverUrl}/reply/getReplyList`,
    method: 'GET',
    data: {
      commentId,
      page,
      pageSize,
      orderByDesc,
    },
  })
  return data.data.data
}

export const createReply = async (params: CreateReplyParams) => {
  const data = await Taro.request<Result<Reply>>({
    url: `${serverUrl}/reply/createReply`,
    method: 'POST',
    data: params,
  })
  return data.data.data
}
