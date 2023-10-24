import { searchByPostOrCommentOrReply } from '@/api/Post'
import { View } from '@tarojs/components'
import { useState, useRef } from 'react'
import ListView from 'taro-listview'
import { Post } from 'types/post'
import CPost from '@/packages/home/components/Post/Post'
import Taro from '@tarojs/taro'
import './search.scss'

export default function search() {
  const params = Taro.getCurrentInstance().router?.params

  const [isLoaded, setIsLoaded] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])

  const [scrollTop, setScrollTop] = useState(0)

  const index = useRef(1)

  const handleScrollToLower = async () => {
    const data = await searchByPostOrCommentOrReply(++index.current, 5, params?.key || '')
    setPosts([...posts, ...data])
    setHasMore(data.length > 0)
  }

  const handlePullDownRefresh = async () => {
    index.current = 1
    const data = await searchByPostOrCommentOrReply(++index.current, 5, params?.key || '')
    setPosts(data)
    setIsLoaded(true)
    setHasMore(data.length > 0)
  }

  return (
    <View>
      <View className='skeleton'>
        {/* @ts-ignore */}
        <ListView
          isLoaded={isLoaded}
          hasMore={hasMore}
          style={{ height: '100vh', width: '100%', overflowX: 'hidden' }}
          onPullDownRefresh={handlePullDownRefresh}
          onScrollToLower={handleScrollToLower}
          onScroll={e => setScrollTop(e.detail.scrollTop)}
          scrollTop={scrollTop}
          needInit
        >
          {posts.map(p => (
            <CPost post={p} key={p.id} />
          ))}
        </ListView>
      </View>
    </View>
  )
}
