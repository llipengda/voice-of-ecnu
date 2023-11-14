import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { useCallback, useState } from 'react'
import { Comment as TComment } from '@/types/comment'
import { like, unlike } from '@/api/Like'
import { AtIcon } from 'taro-ui'
import { disabledColor } from '@/common/constants'
import ReplyBlock from '../ReplyBlock/ReplyBlock'
import { WithUserInfo } from '@/types/withUserInfo'
import { convertDate } from '@/utils/dateConvert'
import './Comment.scss'
import { ErrorCode } from '@/types/commonErrorCode'
import { useAppSelector } from '@/redux/hooks'
import { useVibrateCallback } from '@/utils/hooks/useVibrateCallback'

interface IProps {
  comment: WithUserInfo<TComment>
  onShowMenu: (
    comment: TComment,
    likedComment: boolean,
    onLikeComment: () => void
  ) => void
  id?: string
  showMenuBtn?: boolean
  showReply?: boolean
  showBorder?: boolean
  showDetail?: boolean
  onshowReplyDetail: (comment: WithUserInfo<TComment>) => void
  onCustomClickBody?: () => void
  highlight?: boolean
}

export default function Comment({
  comment,
  onShowMenu,
  id = 'comment',
  showMenuBtn = true,
  showReply = true,
  showBorder = true,
  showDetail = true,
  onshowReplyDetail,
  onCustomClickBody,
  highlight = false
}: IProps) {
  const avatar = comment.userAvatar
  const username = comment.userName

  const [liked, setLiked] = useState(comment.isLike)

  const [likes, setLikes] = useState(comment.likes)

  const [likeDisabled, setLikeDisabled] = useState(false)

  const handleLikeComment = useCallback(async () => {
    if (likeDisabled) {
      return
    }
    setLiked(!liked)
    setLikeDisabled(true)
    if (liked) {
      setLikes(likes - 1)
      await unlike(comment.id, 1)
    } else {
      setLikes(likes + 1)
      await like(comment.id, 1)
    }
    setLikeDisabled(false)
  }, [liked, likeDisabled])

  const _handleLikeComment = useVibrateCallback(handleLikeComment, [
    handleLikeComment
  ])

  const showImages = useVibrateCallback(
    (url: string) => {
      Taro.previewImage({
        current: url,
        urls: comment.images
      })
    },
    [comment.images]
  )

  const showComponent = useAppSelector(state => state.review.showComponent)

  const handleNavigateToUserInfo = useVibrateCallback(async () => {
    if (!showComponent) {
      Taro.navigateTo({
        url: `/pages/error/error?errorCode=${ErrorCode.NO_MORE_CONTENT}&showErrorCode=false`
      })
      return
    }
    await Taro.navigateTo({
      url: `/packages/user/pages/detail/detail?userId=${comment.userId}`
    })
  }, [showComponent])

  const handleShowMenu = useCallback(
    () => onShowMenu(comment, liked, handleLikeComment),
    [comment, liked, handleLikeComment]
  )

  const handleOpenDetail = useVibrateCallback(
    () => onshowReplyDetail(comment),
    [comment]
  )

  return (
    <View
      className='comment skeleton-bg'
      id={id}
      style={{ backgroundColor: highlight ? '#fffaea' : 'inherit' }}
    >
      <View className='comment__header at-row'>
        <Image
          className='comment__header__avatar skeleton-redius at-col at-col-1 at-col--auto'
          src={avatar}
          fadeIn
          lazyLoad
          onClick={handleNavigateToUserInfo}
        />
        <View className='at-col'>
          <View className='at-row'>
            <View className={`at-col at-col-${showMenuBtn ? 10 : 11}`}>
              <View className='at-row'>
                <Text
                  className='comment__header__username'
                  onClick={handleNavigateToUserInfo}
                >
                  {username || '加载中...'}
                </Text>
              </View>
              <View className='at-row'>
                <Text className='comment__header__create-at'>
                  {comment.floor ? `第${comment.floor}楼 · ` : ''}
                  {convertDate(comment.createAt)}
                </Text>
              </View>
            </View>
            <View
              className='at-col at-col-1 comment__header__like'
              onClick={_handleLikeComment}
            >
              <AtIcon
                value={liked ? 'heart-2' : 'heart'}
                size={15}
                color={disabledColor}
              />
              <Text className='comment__header__like__number'>{likes}</Text>
            </View>
            {showMenuBtn && (
              <View className='at-col at-col-1 comment__header__menu'>
                <AtIcon
                  value='menu'
                  size={15}
                  color={disabledColor}
                  onClick={handleShowMenu}
                />
              </View>
            )}
          </View>
        </View>
      </View>
      <View
        className='comment__body skeleton-rect'
        style={{ borderBottom: showBorder ? '1px solid #ddd' : 'none' }}
        onClick={
          onCustomClickBody
            ? onCustomClickBody
            : showDetail
            ? handleOpenDetail
            : () => {}
        }
      >
        <View className='comment__body__content'>
          {comment.content.split('\n').map(c => (
            <View>{c}</View>
          ))}
        </View>
        <View className='comment__body__images'>
          {comment.images &&
            comment.images.map(image => (
              <Image
                src={image}
                key={image}
                fadeIn
                lazyLoad
                mode='widthFix'
                className='comment__body__images__image'
                onClick={showDetail ? () => {} : () => showImages(image)}
              />
            ))}
        </View>
        {comment.replies > 0 && showReply && (
          <View className='comment__body__reply'>
            <ReplyBlock commentId={comment.id} replyCount={comment.replies} />
          </View>
        )}
      </View>
    </View>
  )
}
