import Taro from '@tarojs/taro'
import { getUserById } from '@/api/User'
import { View, Image, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { Post as TPost } from 'types/post'
import { AtIcon } from 'taro-ui'
import { checkStar, starPost, unstarPost } from '@/api/Star'
import { checkLike, likePost, unlikePost } from '@/api/Like'
import { deletePost } from '@/api/Post'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { removePost } from '@/redux/slice/postSlice'
import './Post.scss'

export default function Post({ post }: { post: TPost }) {
  const [avatar, setAvatar] = useState('')
  const [username, setUsername] = useState('')

  const [liked, setLiked] = useState(false)
  const [stared, setStared] = useState(false)

  const [likes, setLikes] = useState(post.likes)
  const [stars, setStars] = useState(post.stars)

  const user = useAppSelector(state => state.user)

  const dispatch = useAppDispatch()

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
      await unstarPost(post.id)
      setStars(stars - 1)
    } else {
      await starPost(post.id)
      setStars(stars + 1)
    }
    setStared(!stared)
  }

  const handleDeletePost = async () => {
    const res = await Taro.showModal({
      title: '提示',
      content: '确定将帖子删除？',
    })
    if (res.confirm) {
      await deletePost(post.id)
      dispatch(removePost(post.id))
      Taro.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 1000,
      })
    }
  }

  const navigateToDetail = () => {
    Taro.navigateTo({
      url: `/packages/post/pages/home/detail/detail?postId=${post.id}&authorName=${username}&authorAvatar=${avatar}`,
    })
  }

  return (
    <View className='post skeleton-bg'>
      <View className='post__header at-row'>
        <Image className='post__header__avatar skeleton-redius' src={avatar} />
        <View className='at-col'>
          <View className='at-row'>
            <Text className='post__header__username'>
              {username || '加载中...'}
            </Text>
          </View>
          <View className='at-row'>
            <Text className='post__header__create-at'>{post.createAt}</Text>
          </View>
        </View>
        <View className='at-col post__header__delete'>
          {(user.id === post.userId || user.role <= 1) && (
            <Text onClick={handleDeletePost}>删除</Text>
          )}
        </View>
      </View>
      <View className='post__body skeleton-rect' onClick={navigateToDetail}>
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
