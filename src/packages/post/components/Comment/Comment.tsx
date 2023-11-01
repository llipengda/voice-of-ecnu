import Taro from '@tarojs/taro'
import { getUserById } from '@/api/User'
import { View, Image, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { Comment as TComment } from '@/types/comment'
import { checkLike, like, unlike } from '@/api/Like'
import './Comment.scss'
import { AtIcon } from 'taro-ui'
import { disabledColor } from '@/common/constants'
import ReplyBlock from '../ReplyBlock/ReplyBlock'

interface IProps {
  comment: TComment
  onShowMenu: (
    comment: TComment,
    likedComment: boolean,
    onLikeComment: () => void
  ) => void
  showMenuBtn?: boolean
  showReply?: boolean
  showBorder?: boolean
  showDetail?: boolean
  onshowReplyDetail: (comment: TComment) => void
  onCustomClickBody?: () => void
}

export default function Comment({
  comment,
  onShowMenu,
  showMenuBtn = true,
  showReply = true,
  showBorder = true,
  showDetail = true,
  onshowReplyDetail,
  onCustomClickBody,
}: IProps) {
  const [avatar, setAvatar] = useState('')
  const [username, setUsername] = useState('')

  const [liked, setLiked] = useState(false)

  const [likes, setLikes] = useState(comment.likes)

  const [likeDisabled, setLikeDisabled] = useState(false)

  useEffect(() => {
    getUserById(comment.userId).then(data => {
      setAvatar(data.avatar)
      setUsername(data.name)
    })
    checkLike(comment.id, 1).then(data => setLiked(data))
  }, [])

  const handleLikeComment = async () => {
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
  }

  const showImages = (url: string) => {
    Taro.previewImage({
      current: url,
      urls: comment.images,
    })
  }

  return (
    <View className='comment skeleton-bg'>
      <View className='comment__header at-row'>
        <Image
          className='comment__header__avatar skeleton-redius at-col at-col-1 at-col--auto'
          src={avatar}
          fadeIn
          lazyLoad
        />
        <View className='at-col'>
          <View className='at-row'>
            <View className={`at-col at-col-${showMenuBtn ? 10 : 11}`}>
              <View className='at-row'>
                <Text className='comment__header__username'>
                  {username || '加载中...'}
                </Text>
              </View>
              <View className='at-row'>
                <Text className='comment__header__create-at'>
                  {comment.createAt}
                </Text>
              </View>
            </View>
            <View
              className='at-col at-col-1 comment__header__like'
              onClick={handleLikeComment}
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
                  onClick={() =>
                    onShowMenu(
                      comment,
                      liked,
                      handleLikeComment
                    )
                  }
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
            ? () => onshowReplyDetail(comment)
            : () => {}
        }
      >
        <View className='comment__body__content'>{comment.content}</View>
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
          <View
            className='comment__body__reply'
            onClick={() => onshowReplyDetail(comment)}
          >
            <ReplyBlock commentId={comment.id} replyCount={comment.replies} />
          </View>
        )}
      </View>
    </View>
  )
}
