import Taro from '@tarojs/taro'
import { serverUrl } from '@/common/constants'
import { Notice, NoticeMap } from '@/types/notice'
import { Result } from '@/types/result'
import { mapToNoticeCnt } from '@/utils/mapToNoticeCnt'

export const checkNotice = async () => {
  const data = await Taro.request<Result<NoticeMap>>({
    url: `${serverUrl}/notice/check`,
    method: 'GET',
  })
  return mapToNoticeCnt(data.data.data)
}

/**
 * @param type 0:系统 1:给帖子点赞 2:给帖子回复 3:给评论点赞 4:给评论回复 5:给回复点赞 6:给回复回复
 */
export const getNoticeList = async (
  page: number,
  pageSize: number,
  type: Notice['type']
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
