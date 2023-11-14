import Taro from '@tarojs/taro'
import { peiranAvatar, serverUrl } from '@/common/constants'
import { Notice, NoticeMap, Board, OneSentence } from '@/types/notice'
import { Result } from '@/types/result'
import { mapToNoticeCnt } from '@/utils/mapToNoticeCnt'
import { WithUserInfo } from '@/types/withUserInfo'
import store from '@/redux/store'

export const checkNotice = async () => {
  const data = await Taro.request<Result<NoticeMap>>({
    url: `${serverUrl}/notice/check`,
    method: 'GET'
  })
  return mapToNoticeCnt(data.data.data)
}

/**
 * @deprecated
 */
export const getNoticeList = async (
  page: number,
  pageSize: number,
  /** 0-系统 1-点赞 2-评论 */
  type: 0 | 1 | 2
) => {
  const data = await Taro.request<Result<Notice[]>>({
    url: `${serverUrl}/notice/getList`,
    method: 'GET',
    data: {
      page,
      pageSize,
      type
    }
  })
  return data.data.data
}

export const getNoticeListWithUserInfo = async (
  page: number,
  pageSize: number,
  /** 0-系统 1-点赞 2-评论 */
  type: 0 | 1 | 2
) => {
  const data = await Taro.request<Result<WithUserInfo<Notice>[]>>({
    url: `${serverUrl}/notice/notices`,
    method: 'GET',
    data: {
      page,
      pageSize,
      type
    }
  })
  if (store.getState().common.yuntianMode) {
    data.data.data.forEach(item => {
      item.userName = '沛然女皇'
      item.userAvatar = peiranAvatar
    })
  }
  return data.data.data
}

export const sendNotice = async (msg: string, userId: string) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/notice/send?msg=${msg}&userId=${userId}`,
    method: 'POST'
  })
  return data.data.data
}

export const getBoardList = async (page: number, pageSize: number) => {
  const data = await Taro.request<Result<Board[]>>({
    url: `${serverUrl}/board/get`,
    method: 'GET',
    data: {
      page,
      pageSize
    }
  })
  return data.data.data
}

export const addBoard = async (params: { content: string; title: string }) => {
  const data = await Taro.request<Result<string>>({
    url: `${serverUrl}/board/add`,
    method: 'POST',
    data: params
  })
  return data.data.data
}

export const getOneSentence = async (type: string = 'i') => {
  const data = await Taro.request<Result<OneSentence>>({
    url: `${serverUrl}/oneSentence`,
    method: 'GET',
    data: { type }
  })
  return data.data.data
}
