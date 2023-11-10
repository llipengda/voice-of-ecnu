import { disabledColor, primaryColor } from '@/common/constants'
import { Picker, View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { useAppSelector } from '@/redux/hooks'
import Taro from '@tarojs/taro'
import { deleteComment, getCommentById } from '@/api/Comment'
import { banUser } from '@/api/User'
import { useState } from 'react'
import { ICustomModalProps } from '@/components/CustomModal/CustomModal'
import { sendNotice } from '@/api/Notice'
import '@/custom-theme.scss'
import './CommentMenu.scss'

interface IProps {
  commentId: number
  commentUserId: string
  likedComment: boolean
  onLikeComment: () => void
  onRemoveComment: (commentId: number) => void
  onClose: () => void
  onClickReply: () => void
  onShowModal: (props: Partial<ICustomModalProps>) => Promise<boolean>
}

export default function CommentMenu({
  commentId,
  commentUserId,
  likedComment,
  onLikeComment,
  onRemoveComment,
  onClose,
  onClickReply,
  onShowModal
}: IProps) {
  const user = useAppSelector(state => state.user)

  const handleBanUser = async () => {
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

    const res = await onShowModal({
      title: '提示',
      children: <BanUser onChange={e => (bannedDays = e)} />
    })
    if (res) {
      onClose()
      const data = await banUser(bannedDays, commentUserId)
      if (!data) {
        return
      }
      Taro.showToast({
        title: '封禁成功',
        icon: 'success',
        duration: 1000
      })
    }
  }

  const handleDeleteComment = async () => {
    const DelComment = ({ onChange }: { onChange: (e: string) => void }) => {
      const [selected, setSelected] = useState(0)
      const reasons = [
        '其他',
        '色情低俗',
        '垃圾广告',
        '辱骂攻击',
        '违法犯罪',
        '时政不实信息',
        '青少年不宜',
        '侵犯权益'
      ]
      return (
        <View>
          <View>确定要删除该评论吗？</View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '5px'
            }}
          >
            <View>删除原因：</View>
            <Picker
              range={reasons}
              value={selected}
              onChange={e => {
                setSelected(e.detail.value as number)
                onChange(reasons[e.detail.value])
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
              {reasons[selected]}
            </Picker>
          </View>
        </View>
      )
    }

    let delReason = '其他'

    if (user.id === commentUserId) {
      const res = await Taro.showModal({
        title: '提示',
        content: '确定将评论删除？'
      })
      if (res.confirm) {
        onClose()
        await deleteComment(commentId)
        onRemoveComment(commentId)
        Taro.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
      }
    } else if (user.role <= 1) {
      const res = await onShowModal({
        title: '警告',
        children: <DelComment onChange={e => (delReason = e)} />
      })
      if (res) {
        const comment = await getCommentById(commentId)
        onClose()
        await deleteComment(commentId)
        onRemoveComment(commentId)
        await sendNotice(
          `您于 ${comment.createAt} 发布的评论 \"${comment.content.substring(
            0,
            10
          )}...\" 因「${delReason}」被管理员删除`,
          commentUserId
        )
        Taro.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
      }
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
        <AtIcon
          value='message'
          size='35'
          color={disabledColor}
          onClick={handleClickReply}
        />
        <View className='comment-menu__item__text'>回复</View>
      </View>
      {(user.id === commentUserId || user.role <= 1) && (
        <View className='comment-menu__item' onClick={handleDeleteComment}>
          <AtIcon value='trash' size='35' color={disabledColor} />
          <View className='comment-menu__item__text'>删除</View>
        </View>
      )}
      {user.role <= 1 && (
        <View className='comment-menu__item' onClick={handleBanUser}>
          <AtIcon value='blocked' size='35' color={disabledColor} />
          <View className='comment-menu__item__text'>封禁用户</View>
        </View>
      )}
    </View>
  )
}
