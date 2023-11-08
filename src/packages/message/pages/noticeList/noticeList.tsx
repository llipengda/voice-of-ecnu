import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useRef, useState } from 'react'
import { Notice as ONotice } from '@/types/notice'
import { WithUserInfo } from '@/types/withUserInfo'
import { ListView } from 'taro-listview'
import { getNoticeListWithUserInfo } from '@/api/Notice'
import CNotice from '@/packages/message/components/Notice/Notice'
import './noticeList.scss'

type NoticeType = 0 | 1 | 2
type Notice = WithUserInfo<ONotice>

export default function NoticeList() {
  const params = Taro.getCurrentInstance().router?.params

  const [noticeType] = useState<NoticeType>(
    (Number(params?.type) as NoticeType) || 0
  )

  const [notices, setNotices] = useState<Notice[]>([])

  const [isLoaded, setIsLoaded] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const index = useRef(1)

  const handleScrollToLower = async () => {
    const data = await getNoticeListWithUserInfo(
      ++index.current,
      10,
      noticeType
    )
    setNotices([...notices, ...data])
    setHasMore(data.length === 10)
  }

  const getData = async () => {
    index.current = 1
    const data = await getNoticeListWithUserInfo(index.current, 10, noticeType)
    setNotices(data || [])
    setIsLoaded(true)
    setHasMore(data.length === 10)
    setIsEmpty(data.length === 0)
  }

  const handlePullDownRefresh = async () => {
    await getData()
  }

  return (
    <View>
      {!isLoaded && <View className='tip'>努力加载中...</View>}
      <View className='skeleton'>
        {/* @ts-ignore */}
        <ListView
          isLoaded={isLoaded}
          hasMore={hasMore}
          style={{
            width: '100%',
            overflowX: 'hidden',
            marginBottom: '55px'
          }}
          onPullDownRefresh={handlePullDownRefresh}
          onScrollToLower={handleScrollToLower}
          needInit
          autoHeight
        >
          {notices.map(notice => (
            <View
              className={`${notice.type ? 'notice-list-item' : ''}`}
              key={notice.id}
            >
              <CNotice notice={notice} />
            </View>
          ))}
          {isEmpty && <View className='tip2'>还没有消息~</View>}
          {!isEmpty && !hasMore && <View className='tip2'>没有更多内容</View>}
        </ListView>
      </View>
    </View>
  )
}
