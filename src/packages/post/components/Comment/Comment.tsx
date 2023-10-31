import Taro from '@tarojs/taro'
import { getUserById } from '@/api/User'
import { View, Image, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { Comment as TComment } from 'types/comment'
import { checkLike, likePost, unlikePost } from '@/api/Like'
import './Comment.scss'
import { AtIcon } from 'taro-ui'
import { disabledColor } from '@/common/constants'

interface IProps {
  comment: TComment
  onShowMenu: (
    commentId: number,
    commentUserId: string,
    likedComment: boolean,
    onLikeComment: () => void,
  ) => void
}

export default function Comment({
  comment,
  onShowMenu,
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
      await unlikePost(comment.id, 1)
    } else {
      setLikes(likes + 1)
      await likePost(comment.id, 1)
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
        />
        <View className='at-col'>
          <View className='at-row'>
            <View className='at-col at-col-10'>
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
            <View className='at-col at-col-1 comment__header__menu'>
              <AtIcon
                value='menu'
                size={15}
                color={disabledColor}
                onClick={() => onShowMenu(comment.id, comment.userId, liked, handleLikeComment)}
              />
            </View>
          </View>
        </View>
      </View>
      <View className='comment__body skeleton-rect'>
        <View className='comment__body__content'>{comment.content}</View>
        <View className='comment__body__images'>
          {comment.images.map(image => (
            <Image
              src={image}
              key={image}
              mode='widthFix'
              className='comment__body__images__image'
              onClick={() => showImages(image)}
            />
          ))}
        </View>
      </View>
    </View>
  )
}
