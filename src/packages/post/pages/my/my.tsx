import { useEffect, useRef, useState } from 'react'
import Taro from '@tarojs/taro'
import { useAppSelector } from '@/redux/hooks'
import PostMenu from '@/components/PostMenu/PostMenu'
import { Post } from '@/types/post'
import { WithUserInfo } from '@/types/withUserInfo'
import { View } from '@tarojs/components'
import ListView from 'taro-listview'
import FloatLayout from '@/components/FloatLayout/FloatLayout'
import CPost from '@/packages/post/components/Post/Post'
import { getPostByUserId } from '@/api/Post'
import { addUserInfo } from '@/utils/addUserInfo'
import { getStarList } from '@/api/Star'
import './my.scss'

export default function my() {
  const params = Taro.getCurrentInstance().router?.params
  const [type] = useState<'post' | 'star'>(
    (params?.type as 'post' | 'star') || 'post'
  )

  const showComponent = useAppSelector(state => state.review.showComponent)
  const user = useAppSelector(state => state.user)

  useEffect(() => {
    if (type === 'star') {
      Taro.setNavigationBarTitle({ title: '我的收藏' })
    } else {
      Taro.setNavigationBarTitle({
        title: `我的${showComponent ? '帖子' : ''}`,
      })
    }
  }, [type])

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
    if (type === 'post') {
      const data = await getPostByUserId(++index.current, 5, user.id) || []
      const newData = data.map(post => addUserInfo(post))
      setPosts([...posts, ...newData])
      setHasMore(data.length === 5)
    }
  }

  const handlePullDownRefresh = async () => {
    index.current = 1
    if (type === 'post') {
      const data = await getPostByUserId(1, 5, user.id) || []
      const newData = data.map(post => addUserInfo(post))
      setPosts(newData)
      setIsLoaded(true)
      setHasMore(data.length === 5)
    } else {
      const data = await getStarList() || []
      setPosts(data)
      setIsLoaded(true)
      setHasMore(false)
    }
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
