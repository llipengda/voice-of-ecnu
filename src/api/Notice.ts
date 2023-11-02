import Taro from '@tarojs/taro'
import { serverUrl } from '@/common/constants'
import { NoticeMap } from '@/types/notice'
import { Result } from '@/types/result'
import { mapToNoticeCnt } from '@/utils/mapToNoticeCnt'

export const checkNotice = async () => {
  const data = await Taro.request<Result<NoticeMap>>({
    url: `${serverUrl}/notice/check`,
    method: 'GET',
  })
  return mapToNoticeCnt(data.data.data)
}
