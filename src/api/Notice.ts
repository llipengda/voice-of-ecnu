import Taro from '@tarojs/taro'
import { serverUrl } from '@/common/constants'
import { Notice, NoticeMap } from '@/types/notice'
import { Result } from '@/types/result'
import { mapToNoticeCnt } from '@/utils/mapToNoticeCnt'
import { WithUserInfo } from '@/types/withUserInfo'

export const checkNotice = async () => {
  const data = await Taro.request<Result<NoticeMap>>({
    url: `${serverUrl}/notice/check`,
    method: 'GET',
  })
  return mapToNoticeCnt(data.data.data)
}

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
      type,
    },
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
      type,
    },
  })
  return data.data.data
}

export const sendNotice = async (msg: string, userId: string) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/notice/send?msg=${msg}&userId=${userId}`,
    method: 'POST',
  })
  return data.data.data
}
