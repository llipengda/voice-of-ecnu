import { disabledColor } from '@/common/constants'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import '@/custom-theme.scss'
import './CommentMenu.scss'
import { useAppSelector } from '@/redux/hooks'
import Taro from '@tarojs/taro'
import { deleteComment } from '@/api/Comments'
import { banUser } from '@/api/User'

interface IProps {
  commentId: number
  commentUserId: string
  likedComment: boolean
  onLikeComment: () => void
  onRemoveComment: (commentId: number) => void
  onClose: () => void
  onClickReply: () => void
}

export default function CommentMenu({
  commentId,
  commentUserId,
  likedComment,
  onLikeComment,
  onRemoveComment,
  onClose,
  onClickReply
}: IProps) {
  const user = useAppSelector(state => state.user)

  const handelBanUser = async () => {
    const res = await Taro.showModal({
      title: '提示',
      content: '确定要封禁用户？',
    })
    if (res.confirm) {
      onClose()
      await banUser(new Date(Date.now() + 86400000), commentUserId)
      Taro.showToast({
        title: '封禁成功',
        icon: 'success',
        duration: 1000,
      })
    }
  }

  const handleDeleteComment = async () => {
    const res = await Taro.showModal({
      title: '提示',
      content: '确定将评论删除？',
    })
    if (res.confirm) {
      onClose()
      await deleteComment(commentId)
      onRemoveComment(commentId)
      Taro.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 1000,
      })
    }
  }

  const handleClickReply = () => {
    onClose()
    onClickReply()
  }

  return (
    <View className='comment-menu'>
      <View
        className='comment-menu__item'
        onClick={() => {
          onLikeComment()
          onClose()
        }}
      >
        <AtIcon
          value={likedComment ? 'heart-2' : 'heart'}
          size='35'
          color={disabledColor}
        />
        <View className='comment-menu__item__text'>
          {likedComment && '取消'}点赞
        </View>
      </View>
      <View className='comment-menu__item'>
        <AtIcon value='message' size='35' color={disabledColor} onClick={handleClickReply}/>
        <View className='comment-menu__item__text'>回复</View>
      </View>
      {(user.id === commentUserId || user.role <= 1) && (
        <View className='comment-menu__item' onClick={handleDeleteComment}>
          <AtIcon value='trash' size='35' color={disabledColor} />
          <View className='comment-menu__item__text'>删除</View>
        </View>
      )}
      {user.role <= 1 && (
        <View className='comment-menu__item' onClick={handelBanUser}>
          <AtIcon value='blocked' size='35' color={disabledColor} />
          <View className='comment-menu__item__text'>封禁用户</View>
        </View>
      )}
    </View>
  )
}
