import { backgroundColor } from '@/common/constants'
import { View } from '@tarojs/components'
import { useRef, useState } from 'react'
import { AtFab, AtSearchBar } from 'taro-ui'
import CPost from '@/packages/post/components/Post/Post'
import ListView from 'taro-listview'
import { getPostListWithUserInfo } from '@/api/Post'
import { Post as OPost } from '@/types/post'
import Taro, { useDidShow } from '@tarojs/taro'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setPosts as RSetPosts,
  changeSelectedIndex,
} from '@/redux/slice/postSlice'
import './home.scss'
import CustomNavBar from '@/components/CustomNavBar/CustomNavBar'
import FloatLayout from '@/components/FloatLayout/FloatLayout'
import PostMenu from '@/components/PostMenu/PostMenu'
import { WithUserInfo } from '@/types/withUserInfo'

type Post = WithUserInfo<OPost>

export default function Home() {
  const [searchText, setSearchText] = useState('')

  const [isLoaded, setIsLoaded] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)

  const posts = useAppSelector(state => state.post.posts)
  const selected = useAppSelector(state => state.post.selectedIndex)
  const loginInfo = useAppSelector(state => state.login)

  const dispatch = useAppDispatch()
  const setPosts = (posts: Post[]) => dispatch(RSetPosts(posts))
  const setSelected = (index: number) => dispatch(changeSelectedIndex(index))

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

  const handleSearchClick = () => {
    Taro.navigateTo({
      url: `/packages/post/pages/search/search?key=${searchText}`,
    })
  }

  const index = useRef(1)

  const handleScrollToLower = async () => {
    const data = await getPostListWithUserInfo(++index.current, 5, selected === 1)
    setPosts([...posts, ...data])
    setHasMore(data.length === 5)
    setIsEmpty(data.length === 0)
  }

  const getData = async () => {
    index.current = 1
    const data = await getPostListWithUserInfo(index.current, 5, selected === 1)
    setPosts(data || [])
    setIsLoaded(true)
    setHasMore(data.length === 5)
    setIsEmpty(data.length === 0)
  }

  const handlePullDownRefresh = async () => {
    await getData()
  }

  const handleSwitchTab = async (i: number) => {
    setSelected(i)
    setPosts([])
    setIsEmpty(false)
    index.current = 1
    const data = await getPostListWithUserInfo(index.current, 5, i === 1)
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

  useDidShow(async () => {
    if (isLoaded) {
      handlePullDownRefresh()
    }
  })

  return (
    <View style={{ width: '100%' }}>
      <CustomNavBar
        showTabs
        tabList={[{ title: '最新' }, { title: '热门' }]}
        tabIndex={selected}
        onSwitchTab={i => handleSwitchTab(i)}
      />
      <FloatLayout
        title='操作'
        isOpened={showMenu}
        onClose={() => setShowMenu(false)}
      >
        <PostMenu onClose={() => setShowMenu(false)} {...postMenuProps} />
      </FloatLayout>
      <AtSearchBar
        value={searchText}
        onChange={e => setSearchText(e)}
        onActionClick={handleSearchClick}
        customStyle={{
          background: backgroundColor,
          color: '#fff',
          border: 'none',
        }}
      />
      {!isLoaded && <View className='tip'>努力加载中...</View>}
      {loginInfo.token && (
        <View className='skeleton'>
          {/* @ts-ignore */}
          <ListView
            isLoaded={isLoaded}
            hasMore={hasMore}
            style={{ height: '84vh', width: '100%', overflowX: 'hidden' }}
            onPullDownRefresh={handlePullDownRefresh}
            onScrollToLower={handleScrollToLower}
            needInit
          >
            {posts.map(p => (
              <CPost post={p} key={p.id} onShowMenu={handelShowMenu} />
            ))}
            {isEmpty && <View className='tip2'>没有更多内容</View>}
          </ListView>
        </View>
      )}
      <View style={{ position: 'fixed', bottom: '16px', right: '16px' }}>
        <AtFab
          onClick={() => {
            Taro.navigateTo({
              url: '/packages/post/pages/add/add',
            })
          }}
        >
          <View className='at-fab__icon at-icon at-icon-add' />
        </AtFab>
      </View>
    </View>
  )
}
