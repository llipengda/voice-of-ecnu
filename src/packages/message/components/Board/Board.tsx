import { defaultAvatar } from '@/common/constants'
import { View, Image } from '@tarojs/components'
import { ListView } from 'taro-listview'
import { useRef, useState } from 'react'
import { getBoardList } from '@/api/Notice'
import { Board as TBoard } from '@/types/notice'
import { useVibrateCallback } from '@/utils/hooks/useVibrateCallback'
import BoardCard from '../BoardCard/BoardCard'
import './Board.scss'

export default function Board() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)

  const [boards, setBoards] = useState<TBoard[]>([])

  const index = useRef(1)

  const getData = async () => {
    index.current = 1
    const data = await getBoardList(index.current, 10)
    setBoards(data || [])
    setIsLoaded(true)
    setHasMore(data.length === 10)
    setIsEmpty(data.length === 0)
  }

  const handlePullDownRefresh = useVibrateCallback(async () => {
    await getData()
  })

  const handleScrollToLower = async () => {
    const data = await getBoardList(++index.current, 10)
    setBoards([...boards, ...data])
    setHasMore(data.length === 10)
    setIsEmpty(data.length === 0)
  }

  return (
    <View className='notice-board'>
      <View className='notice-board__header'>
        <Image
          src={defaultAvatar}
          className='notice-board__header__avatar'
          mode='aspectFill'
        />
        <View className='notice-board__header__title'>公告</View>
      </View>
      <View className='notice-board__content'>
        {isEmpty ? (
          <View>暂时没有公告~</View>
        ) : (
          /* @ts-ignore */
          <ListView
            isLoaded={isLoaded}
            hasMore={hasMore}
            style={{ height: '40vh', width: '100%', overflowX: 'hidden' }}
            onPullDownRefresh={handlePullDownRefresh}
            onScrollToLower={handleScrollToLower}
            needInit
          >
            {boards.map(b => (
              <BoardCard key={b.id} board={b} />
            ))}
            {(isEmpty || !hasMore) && (
              <View className='tip2'>没有更多公告了~</View>
            )}
          </ListView>
        )}
      </View>
    </View>
  )
}
