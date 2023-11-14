import { View, Image, Text } from '@tarojs/components'
import { useCallback, useState } from 'react'
import { Reply as OTReply } from '@/types/reply'
import { like, unlike } from '@/api/Like'
import { AtIcon } from 'taro-ui'
import { disabledColor } from '@/common/constants'
import { WithUserInfo } from '@/types/withUserInfo'
import { convertDate } from '@/utils/dateConvert'
import './Reply.scss'
import Taro from '@tarojs/taro'
import { useAppSelector } from '@/redux/hooks'
import { ErrorCode } from '@/types/commonErrorCode'
import { useVibrateCallback } from '@/utils/hooks/useVibrateCallback'

type TReply = WithUserInfo<OTReply>

interface IProps {
  reply: TReply
  onShowMenu: (
    replyId: number,
    replyUserId: string,
    replyContent: string,
    replyUserName: string,
    likedReply: boolean,
    onLikeReply: () => void
  ) => void
  onClickReply: (
    replyId: number,
    replyUserName: string,
    replyContent: string
  ) => void
}

export default function Reply({ reply, onShowMenu, onClickReply }: IProps) {
  const [liked, setLiked] = useState(reply.isLike)
  const [likes, setLikes] = useState(reply.likes)
  const [likeDisabled, setLikeDisabled] = useState(false)

  const handleLikeReply = useCallback(async () => {
    if (likeDisabled) {
      return
    }
    setLiked(!liked)
    setLikeDisabled(true)
    if (liked) {
      setLikes(likes - 1)
      await unlike(reply.id, 2)
    } else {
      setLikes(likes + 1)
      await like(reply.id, 2)
    }
    setLikeDisabled(false)
  }, [liked, likeDisabled, likes, reply.id])

  const _handleLikeReply = useVibrateCallback(handleLikeReply, [
    handleLikeReply
  ])

  const showComponent = useAppSelector(state => state.review.showComponent)

  const handleNavigateToUserInfo = useVibrateCallback(async () => {
    if (!showComponent) {
      Taro.navigateTo({
        url: `/pages/error/error?errorCode=${ErrorCode.NO_MORE_CONTENT}&showErrorCode=false`
      })
      return
    }
    await Taro.navigateTo({
      url: `/packages/user/pages/detail/detail?userId=${reply.userId}`
    })
  }, [showComponent, reply.userId])

  return (
    <View className='reply skeleton-bg'>
      <View className='reply__header at-row'>
        <Image
          className='reply__header__avatar skeleton-redius at-col at-col-1 at-col--auto'
          src={reply.userAvatar}
          fadeIn
          lazyLoad
          onClick={handleNavigateToUserInfo}
        />
        <View className='at-col'>
          <View className='at-row'>
            <View className='at-col at-col-10'>
              <View className='at-row'>
                <Text
                  className='reply__header__username'
                  onClick={handleNavigateToUserInfo}
                >
                  {reply.userName}
                </Text>
              </View>
              <View className='at-row'>
                <Text className='reply__header__create-at'>
                  {convertDate(reply.createAt)}
                </Text>
              </View>
            </View>
            <View
              className='at-col at-col-1 reply__header__like'
              onClick={_handleLikeReply}
            >
              <AtIcon
                value={liked ? 'heart-2' : 'heart'}
                size={15}
                color={disabledColor}
              />
              <Text className='reply__header__like__number'>{likes}</Text>
            </View>
            <View className='at-col at-col-1 reply__header__menu'>
              <AtIcon
                value='menu'
                size={15}
                color={disabledColor}
                onClick={() =>
                  onShowMenu(
                    reply.id,
                    reply.userId,
                    reply.content,
                    reply.userName,
                    liked,
                    handleLikeReply
                  )
                }
              />
            </View>
          </View>
        </View>
      </View>
      <View className='reply__body skeleton-rect'>
        <View
          className='reply__body__content'
          onClick={() =>
            onClickReply(
              reply.id,
              reply.userName,
              reply.content.length > 6
                ? reply.content.slice(0, 6) + '...'
                : reply.content
            )
          }
        >
          {reply.replyUserId && (
            <Text className='reply__body__content__reply'>
              {' 回复 '}
              {reply.replyUserName}
              {'：'}
            </Text>
          )}
          {reply.content}
        </View>
      </View>
    </View>
  )
}
