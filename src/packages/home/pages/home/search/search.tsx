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

  const index = useRef(1)

  const handleScrollToLower = async () => {
    const data = await searchByPostOrCommentOrReply(
      ++index.current,
      5,
      params?.key || ''
    )
    setPosts([...posts, ...data])
    setHasMore(data.length > 0)
  }

  const handlePullDownRefresh = async () => {
    index.current = 1
    const data = await searchByPostOrCommentOrReply(0, 5, params?.key || '')
    setPosts(data)
    setIsLoaded(true)
    setHasMore(data.length > 0)
  }

  const handleRemovePost = (id: number) => {
    setPosts(posts.filter(p => p.id !== id))
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
          needInit
        >
          {posts.map(p => (
            <CPost
              post={p}
              key={p.id}
              onRemove={() => handleRemovePost(p.id)}
            />
          ))}
          {posts.length === 0 && <View className='tip'>没有更多内容</View>}
        </ListView>
      </View>
    </View>
  )
}
