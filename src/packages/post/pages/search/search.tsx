import Taro from '@tarojs/taro'
import { searchByPostOrCommentOrReplyWithUserInfo } from '@/api/Post'
import { View } from '@tarojs/components'
import { useState, useRef } from 'react'
import { ListView } from 'taro-listview'
import { Post } from '@/types/post'
import CPost from '@/components/Post/Post'
import FloatLayout from '@/components/FloatLayout/FloatLayout'
import PostMenu from '@/components/PostMenu/PostMenu'
import './search.scss'
import { WithUserInfo } from '@/types/withUserInfo'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setShowComponent } from '@/redux/slice/reviewSlice'
import CustomModal, {
  ICustomModalProps
} from '@/components/CustomModal/CustomModal'
import { $cdsfsufsuf$, $dfjhFDASF55$, postPerPage } from '@/common/constants'
import { useVibrateCallback } from '@/utils/hooks/useVibrateCallback'
import { $GHDFbs65f4se1 } from '@/redux/slice/commonSlice'

export default function Search() {
  const params = Taro.getCurrentInstance().router?.params
  const user = useAppSelector(state => state.user)

  const dispatch = useAppDispatch()

  if (params?.key === $cdsfsufsuf$) {
    dispatch(setShowComponent(true))
  }
  if (params?.key === $dfjhFDASF55$ && user.role <= 1) {
    dispatch($GHDFbs65f4se1(true))
  }

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

  const handleShowModal = useVibrateCallback(
    (props: Partial<ICustomModalProps>): Promise<boolean> => {
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
  )

  const handleScrollToLower = async () => {
    const data = await searchByPostOrCommentOrReplyWithUserInfo(
      ++index.current,
      postPerPage,
      params?.key || ''
    )
    setPosts([...posts, ...data])
    setHasMore(data.length === postPerPage)
  }

  const handlePullDownRefresh = useVibrateCallback(async () => {
    index.current = 1
    const data = await searchByPostOrCommentOrReplyWithUserInfo(
      1,
      postPerPage,
      params?.key || ''
    )
    setPosts(data)
    setIsLoaded(true)
    setHasMore(data.length === postPerPage)
  }, [params?.key])

  const handleShowMenu = useVibrateCallback(
    (
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
  )

  return (
    <View>
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
          style={{ height: '100vh', width: '100%', overflowX: 'hidden' }}
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
          {posts.length === 0 && <View className='tip'>没有更多内容</View>}
        </ListView>
      </View>
    </View>
  )
}
