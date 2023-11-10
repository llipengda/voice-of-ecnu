import { View } from '@tarojs/components'
import UserCard from '../../components/UserCard/UserCard'
import { useAppSelector } from '@/redux/hooks'
import { useEffect, useRef, useState } from 'react'
import { User, UserStatistics } from '@/types/user'
import Taro, { useReachBottom } from '@tarojs/taro'
import { getUserById, getUserStatisticsById } from '@/api/User'
import { getPostByUserId } from '@/api/Post'
import CustomModal, {
  ICustomModalProps
} from '@/components/CustomModal/CustomModal'
import PostMenu from '@/components/PostMenu/PostMenu'
import { Post } from '@/types/post'
import { WithUserInfo } from '@/types/withUserInfo'
import { ListView } from 'taro-listview'
import CPost from '@/components/Post/Post'
import FloatLayout from '@/components/FloatLayout/FloatLayout'
import { AtDivider } from 'taro-ui'
import './detail.scss'

export default function Detail() {
  const params = Taro.getCurrentInstance().router?.params
  const [userId] = useState<string>(params?.userId || '')

  const self = useAppSelector(state => state.user)
  const [user, setUser] = useState<User | null>(null)
  const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(
    null
  )

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
    onNavigateToPost: (_: boolean) => {}
  })

  const [showModal, setShowModal] = useState(false)
  const [modalProps, setModalProps] = useState<ICustomModalProps>({
    isOpen: showModal,
    onCancle: () => setShowModal(false),
    onConfirm: () => setShowModal(false),
    title: '提示',
    children: <View />
  })

  const [reachBottomLoadingDisabled, setReachBottomLoadingDisabled] =
    useState(false)

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

  const handleScrollToLower = async () => {
    const data = (await getPostByUserId(++index.current, 5, userId)) || []
    setPosts([...posts, ...data])
    setHasMore(data.length === 5)
  }

  const handlePullDownRefresh = async () => {
    index.current = 1
    const data = (await getPostByUserId(1, 5, userId)) || []
    setPosts(data)
    setIsLoaded(true)
    setHasMore(data.length === 5)
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

  useEffect(() => {
    ;(async () => {
      const data = await getUserById(userId)
      setUser(data)
      const userStatistics = await getUserStatisticsById(userId)
      setUserStatistics(userStatistics)
    })()
  }, [userId])

  useReachBottom(async () => {
    if (!hasMore || reachBottomLoadingDisabled) {
      return
    }
    setReachBottomLoadingDisabled(true)
    await handleScrollToLower()
    setReachBottomLoadingDisabled(false)
  })

  return (
    <View className='user-detail'>
      <View className='user-detail__card'>
        {user !== null && userStatistics !== null && (
          <UserCard
            user={user}
            userStatistics={userStatistics}
            isSelf={user.id === self.id}
          />
        )}
      </View>
      <AtDivider content='TA的帖子' />
      <View className='user-detail__list'>
        <CustomModal {...modalProps} isOpen={showModal} />
        <FloatLayout
          title='操作'
          isOpened={showMenu}
          onClose={() => setShowMenu(false)}
        >
          <PostMenu
            onShowModal={handleShowModal}
            onClose={() => setShowMenu(false)}
            {...postMenuProps}
          />
        </FloatLayout>
        <View className='skeleton'>
          {!isLoaded && <View className='tip'>努力加载中...</View>}
          {/* @ts-ignore */}
          <ListView
            isLoaded={isLoaded}
            hasMore={hasMore}
            style={{ width: '100%', overflowX: 'hidden' }}
            autoHeight
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
            {(posts.length === 0 || !hasMore) && (
              <View className='tip2'>没有更多内容</View>
            )}
          </ListView>
        </View>
      </View>
    </View>
  )
}
