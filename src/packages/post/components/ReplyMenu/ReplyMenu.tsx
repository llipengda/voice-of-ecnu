import { disabledColor } from '@/common/constants'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { useAppSelector } from '@/redux/hooks'
import Taro from '@tarojs/taro'
import { banUser } from '@/api/User'
import { deleteReply } from '@/api/Reply'
import '@/custom-theme.scss'
import './ReplyMenu.scss'

interface IProps {
  replyId: number
  replyUserId: string
  replyContent: string
  replyUserName: string
  likedReply: boolean
  onLikeReply: () => void
  onRemoveReply: (replyId: number) => void
  onClose: () => void
  onClickReply: (replyId: number, replyUserName: string, replyContent: string) => void
}

export default function CommentMenu({
  replyId,
  replyUserId,
  likedReply,
  replyContent,
  replyUserName,
  onLikeReply,
  onRemoveReply,
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
      await banUser(1, replyUserId)
      Taro.showToast({
        title: '封禁成功',
        icon: 'success',
        duration: 1000,
      })
    }
  }

  const handleDeleteReply = async () => {
    const res = await Taro.showModal({
      title: '提示',
      content: '确定将回复删除？',
    })
    if (res.confirm) {
      onClose()
      await deleteReply(replyId)
      onRemoveReply(replyId)
      Taro.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 1000,
      })
    }
  }

  const handleClickReply = () => {
    onClose()
    onClickReply(replyId, replyUserName, replyContent)
  }

  return (
    <View className='reply-menu'>
      <View
        className='reply-menu__item'
        onClick={() => {
          onLikeReply()
          onClose()
        }}
      >
        <AtIcon
          value={likedReply ? 'heart-2' : 'heart'}
          size='35'
          color={disabledColor}
        />
        <View className='reply-menu__item__text'>
          {likedReply && '取消'}点赞
        </View>
      </View>
      <View className='reply-menu__item'>
        <AtIcon value='message' size='35' color={disabledColor} onClick={handleClickReply}/>
        <View className='reply-menu__item__text'>回复</View>
      </View>
      {(user.id === replyUserId || user.role <= 1) && (
        <View className='reply-menu__item' onClick={handleDeleteReply}>
          <AtIcon value='trash' size='35' color={disabledColor} />
          <View className='reply-menu__item__text'>删除</View>
        </View>
      )}
      {user.role <= 1 && (
        <View className='reply-menu__item' onClick={handelBanUser}>
          <AtIcon value='blocked' size='35' color={disabledColor} />
          <View className='reply-menu__item__text'>封禁用户</View>
        </View>
      )}
    </View>
  )
}
