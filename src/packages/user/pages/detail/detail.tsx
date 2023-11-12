import { Picker, View } from '@tarojs/components'
import UserCard from '../../components/UserCard/UserCard'
import { useAppSelector } from '@/redux/hooks'
import { useEffect, useRef, useState } from 'react'
import { User, UserStatistics } from '@/types/user'
import Taro, { useReachBottom } from '@tarojs/taro'
import { banUser, getUserById, getUserStatisticsById } from '@/api/User'
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
import { checkBan } from '@/utils/dateConvert'
import { postPerPage, primaryColor } from '@/common/constants'

export default function Detail() {
  const params = Taro.getCurrentInstance().router?.params
  const [userId] = useState<string>(params?.userId || '')

  const self = useAppSelector(state => state.user)
  const [user, setUser] = useState<User | null>(null)
  const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(
    null
  )

  const [banned, setBanned] = useState(checkBan(user?.bannedBefore || null))

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
    const data =
      (await getPostByUserId(++index.current, postPerPage, userId)) || []
    setPosts([...posts, ...data])
    setHasMore(data.length === postPerPage)
  }

  const handlePullDownRefresh = async () => {
    index.current = 1
    const data = (await getPostByUserId(1, postPerPage, userId)) || []
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

  useEffect(() => {
    ;(async () => {
      const data = await getUserById(userId)
      setUser(data)
      setBanned(checkBan(data.bannedBefore || null))
      if (!data.isOpen) {
        setIsLoaded(true)
      }
      const userStatistics = await getUserStatisticsById(userId)
      setUserStatistics(userStatistics)
    })()
  }, [userId, banned])

  useReachBottom(async () => {
    if (!hasMore || reachBottomLoadingDisabled) {
      return
    }
    setReachBottomLoadingDisabled(true)
    await handleScrollToLower()
    setReachBottomLoadingDisabled(false)
  })

  const handleBanUser = async () => {
    if (banned) {
      const res = await handleShowModal({
        title: '提示',
        children: <View>确定要解封该用户吗？</View>
      })
      if (res) {
        const data = await banUser(-1, user?.id || '')
        if (!data) {
          return
        }
        Taro.showToast({
          title: '解封成功',
          icon: 'success',
          duration: 1000
        })
        setBanned(false)
      }
    } else {
      const BanUser = ({ onChange }: { onChange: (e: number) => void }) => {
        const [selected, setSelected] = useState(0)
        const days = [1, 3, 7, 30]
        return (
          <View>
            <View>确定要封禁该用户吗？</View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '5px'
              }}
            >
              <View>封禁时间：</View>
              <Picker
                range={days}
                value={selected}
                onChange={e => {
                  setSelected(e.detail.value as number)
                  onChange(days[e.detail.value])
                }}
                style={{
                  marginRight: '10px',
                  color: primaryColor,
                  fontWeight: 900,
                  background: '#eee',
                  borderRadius: '5px',
                  padding: '5px'
                }}
              >
                {days[selected]}
              </Picker>
              <View>天</View>
            </View>
          </View>
        )
      }

      let bannedDays = 1

      const res = await handleShowModal({
        title: '提示',
        children: <BanUser onChange={e => (bannedDays = e)} />
      })
      if (res) {
        const data = await banUser(bannedDays, user?.id || '')
        if (!data) {
          return
        }
        Taro.showToast({
          title: '封禁成功',
          icon: 'success',
          duration: 1000
        })
        setBanned(true)
      }
    }
  }

  return (
    <View className='user-detail'>
      {isLoaded && self.role <= 1 && (
        <View className='user-detail__ban' onClick={handleBanUser}>
          {banned ? '解除封禁' : '封禁用户'}
        </View>
      )}
      <View className='user-detail__card'>
        {user !== null && userStatistics !== null && (
          <UserCard
            user={user}
            userStatistics={userStatistics}
            isSelf={user.id === self.id}
          />
        )}
      </View>
      {isLoaded && (
        <AtDivider content={user?.id === self.id ? '我的帖子' : 'TA的帖子'} />
      )}
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
        {user?.id === self.id || user?.isOpen ? (
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
        ) : (
          <View className='tip2'>{isLoaded ? '用户选择不展示帖子' : ''}</View>
        )}
      </View>
    </View>
  )
}
