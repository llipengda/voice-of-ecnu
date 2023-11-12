import { backgroundColor, postPerPage } from '@/common/constants'
import { View } from '@tarojs/components'
import { useRef, useState } from 'react'
import { AtFab, AtSearchBar } from 'taro-ui'
import CPost from '@/components/Post/Post'
import { ListView } from 'taro-listview'
import { getPostListWithUserInfo } from '@/api/Post'
import { Post as OPost } from '@/types/post'
import Taro, { useDidShow } from '@tarojs/taro'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setPosts as RSetPosts,
  changeSelectedIndex
} from '@/redux/slice/postSlice'
import CustomNavBar from '@/components/CustomNavBar/CustomNavBar'
import FloatLayout from '@/components/FloatLayout/FloatLayout'
import PostMenu from '@/components/PostMenu/PostMenu'
import { WithUserInfo } from '@/types/withUserInfo'
import CustomModal, {
  ICustomModalProps
} from '@/components/CustomModal/CustomModal'
import './home.scss'
import { useVibrateCallback } from '@/utils/hooks/useVibrateCallback'

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
  const setPosts = (_posts: Post[]) => dispatch(RSetPosts(_posts))
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
    onNavigateToPost: (_: boolean) => {}
  })

  const showCompent = useAppSelector(state => state.review.showComponent)

  const [showModal, setShowModal] = useState(false)
  const [modalProps, setModalProps] = useState<ICustomModalProps>({
    isOpen: showModal,
    onCancle: () => setShowModal(false),
    onConfirm: () => setShowModal(false),
    title: '提示',
    children: <View />
  })

  const handleShowModal = (
    props: Partial<ICustomModalProps>
  ): Promise<boolean> => {
    return new Promise(resolve => {
      setShowModal(true)
      setModalProps({
        ...modalProps,
        ...props,
        onConfirm: () => {
          setShowModal(false)
          resolve(true)
        },
        onCancle: () => {
          setShowModal(false)
          resolve(false)
        }
      })
    })
  }

  const handleSearchClick = useVibrateCallback(() => {
    Taro.navigateTo({
      url: `/packages/post/pages/search/search?key=${searchText}`
    })
  })

  const index = useRef(1)

  const handleScrollToLower = async () => {
    const data = await getPostListWithUserInfo(
      ++index.current,
      postPerPage,
      selected === 1
    )
    setPosts([...posts, ...data])
    setHasMore(data.length === postPerPage)
    setIsEmpty(data.length === 0)
  }

  const getData = async () => {
    index.current = 1
    const data = await getPostListWithUserInfo(
      index.current,
      postPerPage,
      selected === 1
    )
    setPosts(data || [])
    setIsLoaded(true)
    setHasMore(data.length === postPerPage)
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
    const data = await getPostListWithUserInfo(
      index.current,
      postPerPage,
      i === 1
    )
    setPosts(data)
    setIsLoaded(true)
    setHasMore(data.length === postPerPage)
  }

  const handleShowMenu = (
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
      onNavigateToPost
    })
  }

  useDidShow(async () => {
    if (isLoaded) {
      await handlePullDownRefresh()
    }
  })

  return (
    <>
      <CustomModal {...modalProps} isOpen={showModal} />
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
          <PostMenu
            onClose={() => setShowMenu(false)}
            {...postMenuProps}
            onShowModal={handleShowModal}
          />
        </FloatLayout>
        <AtSearchBar
          value={searchText}
          onChange={e => setSearchText(e)}
          onActionClick={handleSearchClick}
          customStyle={{
            background: backgroundColor,
            color: '#fff',
            border: 'none'
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
                <CPost
                  onShowModal={handleShowModal}
                  post={p}
                  key={p.id}
                  onShowMenu={handleShowMenu}
                />
              ))}
              {(isEmpty || !hasMore) && (
                <View className='tip2'>没有更多内容</View>
              )}
            </ListView>
          </View>
        )}
        {showCompent && (
          <View style={{ position: 'fixed', bottom: '16px', right: '16px' }}>
            <AtFab
              onClick={() => {
                Taro.navigateTo({
                  url: '/packages/post/pages/add/add'
                })
              }}
            >
              <View className='at-fab__icon at-icon at-icon-add' />
            </AtFab>
          </View>
        )}
      </View>
    </>
  )
}
