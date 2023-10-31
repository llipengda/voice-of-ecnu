import { disabledColor } from '@/common/constants'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import '@/custom-theme.scss'
import './PostMenu.scss'
import { useAppSelector } from '@/redux/hooks'
import Taro from '@tarojs/taro'
import { banUser } from '@/api/User'

interface IProps {
  postId: number
  postUserId: string
  likedPost: boolean
  staredPost: boolean
  onLikePost: () => void
  onStarPost: () => void
  onRemovePost: () => void
  onClose: () => void
  onNavigateToPost: (focus: boolean) => void
}

export default function CommentMenu({
  postId,
  postUserId,
  likedPost,
  staredPost,
  onLikePost,
  onStarPost,
  onRemovePost,
  onClose,
  onNavigateToPost,
}: IProps) {
  const user = useAppSelector(state => state.user)

  const handelBanUser = async () => {
    const res = await Taro.showModal({
      title: '提示',
      content: '确定要封禁用户？',
    })
    if (res.confirm) {
      onClose()
      await banUser(new Date(Date.now() + 86400000), postUserId)
      Taro.showToast({
        title: '封禁成功',
        icon: 'success',
        duration: 1000,
      })
    }
  }

  const handleClickComment = () => {
    onClose()
    onNavigateToPost(true)
  }

  return (
    <View className='post-menu' id={postId.toString()}>
      <View
        className='post-menu__item'
        onClick={() => {
          onLikePost()
          onClose()
        }}
      >
        <AtIcon
          value={likedPost ? 'heart-2' : 'heart'}
          size='35'
          color={disabledColor}
        />
        <View className='post-menu__item__text'>{likedPost && '取消'}点赞</View>
      </View>
      <View
        className='post-menu__item'
        onClick={() => {
          onStarPost()
          onClose()
        }}
      >
        <AtIcon
          value={staredPost ? 'star-2' : 'star'}
          size='35'
          color={disabledColor}
        />
        <View className='post-menu__item__text'>
          {staredPost && '取消'}收藏
        </View>
      </View>
      <View className='post-menu__item' onClick={handleClickComment}>
        <AtIcon value='message' size='35' color={disabledColor} />
        <View className='post-menu__item__text'>评论</View>
      </View>
      {(user.id === postUserId || user.role <= 1) && (
        <View
          className='post-menu__item'
          onClick={() => {
            onClose()
            onRemovePost()
          }}
        >
          <AtIcon value='trash' size='35' color={disabledColor} />
          <View className='post-menu__item__text'>删除</View>
        </View>
      )}
      {user.role <= 1 && (
        <View className='post-menu__item' onClick={handelBanUser}>
          <AtIcon value='blocked' size='35' color={disabledColor} />
          <View className='post-menu__item__text'>封禁用户</View>
        </View>
      )}
    </View>
  )
}
