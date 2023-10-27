import { getUserById } from '@/api/User'
import { View, Image, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { Post as TPost } from 'types/post'
import { AtIcon } from 'taro-ui'
import './Post.scss'
import { checkStar, starPost, unstarPost } from '@/api/Star'
import { checkLike, likePost, unlikePost } from '@/api/Like'

export default function Post({ post }: { post: TPost }) {
  const [avatar, setAvatar] = useState('')
  const [username, setUsername] = useState('')

  const [liked, setLiked] = useState(false)
  const [stared, setStared] = useState(false)

  const [likes, setLikes] = useState(post.likes)
  const [stars, setStars] = useState(post.stars)

  useEffect(() => {
    getUserById(post.userId).then(data => {
      setAvatar(data.avatar)
      setUsername(data.name)
    })
    checkStar(post.id).then(data => setStared(data))
    checkLike(post.id).then(data => setLiked(data))
  }, [])

  const handleLikePost = async () => {
    if (liked) {
      await unlikePost(post.id)
      setLikes(likes - 1)
    } else {
      await likePost(post.id)
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  const handleStarPost = async () => {
    if (stared) {
      unstarPost(post.id)
      setStars(stars - 1)
    } else {
      starPost(post.id)
      setStars(stars + 1)
    }
    setStared(!stared)
  }

  return (
    <View className='post skeleton-bg'>
      <View className='post__header at-row'>
        <Image
          className='post__header__avatar skeleton-redius'
          src={avatar}
        ></Image>
        <View className='at-col'>
          <View className='at-row'>
            <Text className='post__header__username'>{username}</Text>
          </View>
          <View className='at-row'>
            <Text className='post__header__create-at'>{post.createAt}</Text>
          </View>
        </View>
      </View>
      <View className='post__body skeleton-rect'>
        <View className='post__body__title'>{post.title}</View>
        <View className='post__body__content'>
          {post.content.length <= 50
            ? post.content
            : post.content.substring(0, 50) + '...'}
        </View>
        <View className='at-row at-row--wrap'>
          {post.images.map((image, i) => (
            <Image
              key={i}
              className='post__body__image at-col at-col-4 at-col--auto'
              src={image}
              mode='aspectFill'
            />
          ))}
        </View>
      </View>
      <View className='post__footer at-row'>
        <View className='at-col-3'>
          <AtIcon value='eye' size='20' color='#000' />
          <Text className='post__footer__number'>{post.views}</Text>
        </View>
        <View className='at-col-3'>
          <AtIcon value='message' size='20' color='#000' />
          <Text className='post__footer__number'>{post.comments}</Text>
        </View>
        <View className='at-col-3' onClick={handleLikePost}>
          <AtIcon value={liked ? 'heart-2' : 'heart'} size='20' color='#000' />
          <Text className='post__footer__number'>{likes}</Text>
        </View>
        <View className='at-col-3' onClick={handleStarPost}>
          <AtIcon value={stared ? 'star-2' : 'star'} size='20' color='#000' />
          <Text className='post__footer__number'>{stars}</Text>
        </View>
      </View>
    </View>
  )
}
