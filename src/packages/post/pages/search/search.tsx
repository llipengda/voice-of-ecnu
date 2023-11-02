import Taro from '@tarojs/taro'
import { searchByPostOrCommentOrReplyWithUserInfo } from '@/api/Post'
import { View } from '@tarojs/components'
import { useState, useRef } from 'react'
import ListView from 'taro-listview'
import { Post } from '@/types/post'
import CPost from '@/packages/post/components/Post/Post'
import FloatLayout from '@/components/FloatLayout/FloatLayout'
import PostMenu from '@/components/PostMenu/PostMenu'
import './search.scss'
import { WithUserInfo } from '@/types/withUserInfo'

export default function search() {
  const params = Taro.getCurrentInstance().router?.params

  const [isLoaded, setIsLoaded] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [posts, setPosts] = useState<WithUserInfo<Post>[]>([])

  const index = useRef(1)

  const [showMenu, setShowMenu] = useState(false)

  const [postMenuProps, setPostMenuPorps] = useState({
    postId: 0,
    postUserId: '',
    likedPost: false,
    staredPost: false,
    onLikePost: () => {},
    onStarPost: () => {},
    onRemovePost: () => {},
    onNavigateToPost: (_: boolean) => {},
  })

  const handleScrollToLower = async () => {
    const data = await searchByPostOrCommentOrReplyWithUserInfo(
      ++index.current,
      5,
      params?.key || ''
    )
    setPosts([...posts, ...data])
    setHasMore(data.length === 5)
  }

  const handlePullDownRefresh = async () => {
    index.current = 1
    const data = await searchByPostOrCommentOrReplyWithUserInfo(1, 5, params?.key || '')
    setPosts(data)
    setIsLoaded(true)
    setHasMore(data.length === 5)
  }

  const handelShowMenu = (
    postId: number,
    postUserId: string,
    likedPost: boolean,
    staredPost: boolean,
    onLikePost: () => void,
    onStarPost: () => void,
    onRemovePost: () => void,
    onNavigateToPost: (focus: boolean) => void
  ) => {
    setShowMenu(true)
    setPostMenuPorps({
      postId,
      postUserId,
      likedPost,
      staredPost,
      onLikePost,
      onStarPost,
      onRemovePost,
      onNavigateToPost,
    })
  }

  return (
    <View>
      <FloatLayout
        title='操作'
        isOpened={showMenu}
        onClose={() => setShowMenu(false)}
      >
        <PostMenu onClose={() => setShowMenu(false)} {...postMenuProps} />
      </FloatLayout>
      <View className='skeleton'>
        {!isLoaded && <View className='tip'>努力加载中...</View>}
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
            <CPost post={p} key={p.id} onShowMenu={handelShowMenu} />
          ))}
          {posts.length === 0 && <View className='tip'>没有更多内容</View>}
        </ListView>
      </View>
    </View>
  )
}
