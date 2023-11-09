import { disabledColor, primaryColor } from '@/common/constants'
import { Picker, View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { useState } from 'react'
import { useAppSelector } from '@/redux/hooks'
import Taro from '@tarojs/taro'
import { banUser } from '@/api/User'
import { ICustomModalProps } from '../CustomModal/CustomModal'
import '@/custom-theme.scss'
import './PostMenu.scss'

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
  onShowModal: (props: Partial<ICustomModalProps>) => Promise<boolean>
}

export default function PostMenu({
  postId,
  postUserId,
  likedPost,
  staredPost,
  onLikePost,
  onStarPost,
  onRemovePost,
  onClose,
  onNavigateToPost,
  onShowModal
}: IProps) {
  const user = useAppSelector(state => state.user)
  const showComponent = useAppSelector(state => state.review.showComponent)

  const handelBanUser = async () => {
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
      await banUser(bannedDays, postUserId)
      Taro.showToast({
        title: '封禁成功',
        icon: 'success',
        duration: 1000
      })
    }
  }

  const handleClickComment = () => {
    onClose()
    onNavigateToPost(true)
  }

  return (
    <>
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
          <View className='post-menu__item__text'>
            {likedPost && '取消'}点赞
          </View>
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
        {showComponent && (
          <View className='post-menu__item' onClick={handleClickComment}>
            <AtIcon value='message' size='35' color={disabledColor} />
            <View className='post-menu__item__text'>评论</View>
          </View>
        )}
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
    </>
  )
}
