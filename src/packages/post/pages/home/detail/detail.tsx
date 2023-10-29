import Taro, { useLoad } from '@tarojs/taro'
import { deletePost, getPostById } from '@/api/Post'
import { View, Image, Text } from '@tarojs/components'
import { useState } from 'react'
import { AtAvatar, AtIcon } from 'taro-ui'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import './detail.scss'
import { removePost } from '@/redux/slice/postSlice'
import { checkLike, likePost, unlikePost } from '@/api/Like'
import { checkStar, starPost, unstarPost } from '@/api/Star'

export default function detail() {
  const params = Taro.getCurrentInstance().router?.params

  const postId = Number(params?.postId!)
  const authorName = params?.authorName!
  const authorAvatar = params?.authorAvatar!

  const [authorId, setAuthorId] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [createAt, setCreateAt] = useState('')
  const [views, setViews] = useState(0)
  const [comments, setComments] = useState(0)
  const [likes, setLikes] = useState(0)
  const [stars, setStars] = useState(0)

  const [liked, setLiked] = useState(false)
  const [stared, setStared] = useState(false)

  const user = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()

  const handleDeletePost = async () => {
    const res = await Taro.showModal({
      title: '提示',
      content: '确定要删除该帖子吗？',
    })
    if (res.confirm) {
      await deletePost(postId)
      dispatch(removePost(postId))
      Taro.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 1000,
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    }
  }

  useLoad(async () => {
    const data = await getPostById(postId)
    setAuthorId(data.userId)
    setTitle(data.title)
    setContent(data.content)
    setImages(data.images)
    setCreateAt(data.createAt)
    setViews(data.views)
    setComments(data.comments)
    setLikes(data.likes)
    setStars(data.stars)
    const liked = await checkLike(postId)
    setLiked(liked)
    const stared = await checkStar(postId)
    setStared(stared)
  })

  const handleLikePost = async () => {
    if (liked) {
      await unlikePost(postId)
      setLikes(likes - 1)
    } else {
      await likePost(postId)
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  const handleStarPost = async () => {
    if (stared) {
      await unstarPost(postId)
      setStars(stars - 1)
    } else {
      await starPost(postId)
      setStars(stars + 1)
    }
    setStared(!stared)
  }

  return (
    <View className='post-detail'>
      <View className='post-detail__title'>{title || '加载中...'}</View>
      <View className='at-row'>
        <AtAvatar
          circle
          image={authorAvatar}
          className='post-detail__avatar'
          size='small'
        />
        <View className='at-col'>
          <View className='post-detail__author at-row'>{authorName}</View>
          <View className='post-detail__create-at at-row'>{createAt}</View>
        </View>
        <View className='at-col post-detail__delete'>
          {(user.id === authorId || user.role <= 1) && (
            <Text onClick={handleDeletePost}>删除</Text>
          )}
        </View>
      </View>
      <View className='post-detail__content'>{content}</View>
      <View className='post-detail__images'>
        {images.map(image => (
          <Image
            src={image}
            key={image}
            mode='widthFix'
            className='post-detail__image'
          />
        ))}
      </View>
      <View className='post-detail__actions at-row'>
        <View className='at-col-3'>
          <AtIcon value='eye' size='20' color='#000' className='at-row'/>
          <Text className='post__footer__number at-row'>{views}</Text>
        </View>
        <View className='at-col-3'>
          <AtIcon value='message' size='20' color='#000' />
          <Text className='post__footer__number at-row'>{comments}</Text>
        </View>
        <View className='at-col-3' onClick={handleLikePost}>
          <AtIcon value={liked ? 'heart-2' : 'heart'} size='20' color='#000' />
          <Text className='post__footer__number at-row'>{likes}</Text>
        </View>
        <View className='at-col-3' onClick={handleStarPost}>
          <AtIcon value={stared ? 'star-2' : 'star'} size='20' color='#000' />
          <Text className='post__footer__number at-row'>{stars}</Text>
        </View>
      </View>
    </View>
  )
}
