import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { Post as OTPost } from '@/types/post'
import { AtIcon } from 'taro-ui'
import { checkStar, starPost, unstarPost } from '@/api/Star'
import { checkLike, like, unlike } from '@/api/Like'
import { deletePost } from '@/api/Post'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { removePost } from '@/redux/slice/postSlice'
import { disabledColor } from '@/common/constants'
import './Post.scss'
import { WithUserInfo } from '@/types/withUserInfo'
import { getUserById } from '@/api/User'
import { ErrorCode } from '@/types/commonErrorCode'
import { convertDate } from '@/utils/dateConvert'

type TPost = WithUserInfo<OTPost>

function isTPost(post: TPost | OTPost): post is TPost {
  return (post as TPost).userName !== undefined
}

export default function Post({
  post,
  onShowMenu,
}: {
  post: TPost | OTPost
  onShowMenu: (
    postId: number,
    postUserId: string,
    likedPost: boolean,
    staredPost: boolean,
    onLikePost: () => void,
    onStarPost: () => void,
    onRemovePost: () => void,
    onNavigateToPost: (focus: boolean) => void
  ) => void
}) {
  const [avatar, setAvatar] = useState('')
  const [username, setUsername] = useState('')

  const [liked, setLiked] = useState(false)
  const [stared, setStared] = useState(false)

  const [likes, setLikes] = useState(post.likes)
  const [stars, setStars] = useState(post.stars)

  const [likeDisabled, setLikeDisabled] = useState(false)
  const [starDisabled, setStarDisabled] = useState(false)

  const dispatch = useAppDispatch()

  const showComponent = useAppSelector(state => state.review.showComponent)

  useEffect(() => {
    checkStar(post.id).then(data => setStared(data))
    checkLike(post.id).then(data => setLiked(data))
  }, [])

  useEffect(() => {
    if (isTPost(post)) {
      setAvatar(post.userAvatar)
      setUsername(post.userName)
    } else {
      getUserById(post.userId).then(data => {
        setAvatar(data.avatar)
        setUsername(data.name)
      })
    }
  }, [])

  const handleLikePost = async () => {
    if (likeDisabled) {
      return
    }
    setLiked(!liked)
    setLikeDisabled(true)
    if (liked) {
      setLikes(likes - 1)
      await unlike(post.id)
    } else {
      setLikes(likes + 1)
      await like(post.id)
    }
    setLikeDisabled(false)
  }

  const handleStarPost = async () => {
    if (starDisabled) {
      return
    }
    setStared(!stared)
    setStarDisabled(true)
    if (stared) {
      setStars(stars - 1)
      await unstarPost(post.id)
    } else {
      setStars(stars + 1)
      await starPost(post.id)
    }
    setStarDisabled(false)
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

  const navigateToDetail = (focus: boolean = false) => {
    if (!showComponent) {
      Taro.navigateTo({
        url: `/pages/error/error?errorCode=${ErrorCode.NO_MORE_CONTENT}&showErrorCode=false`,
      })
      return
    }
    if (!post.deleteAt) {
      Taro.navigateTo({
        url: `/packages/post/pages/detail/detail?postId=${post.id}&authorName=${username}&authorAvatar=${avatar}&sendCommentFocus=${focus}`,
      })
    } else {
      Taro.navigateTo({
        url: `/pages/error/error?errorCode=${ErrorCode.POST_NOT_FOUND}&showErrorCode=false`,
      })
    }
  }

  return (
    <View className='post skeleton-bg'>
      <View className='post__header at-row'>
        <Image
          fadeIn
          lazyLoad
          className='post__header__avatar skeleton-redius'
          src={avatar}
        />
        <View className='at-col'>
          <View className='at-row'>
            <Text className='post__header__username'>
              {username || '加载中...'}
            </Text>
          </View>
          <View className='at-row'>
            <Text className='post__header__create-at'>{convertDate(post.createAt)}</Text>
          </View>
        </View>
        <View className='at-col post__header__delete'>
          <AtIcon
            value='menu'
            size={15}
            color={disabledColor}
            onClick={() =>
              onShowMenu(
                post.id,
                post.userId,
                liked,
                stared,
                handleLikePost,
                handleStarPost,
                handleDeletePost,
                navigateToDetail
              )
            }
          />
        </View>
      </View>
      <View
        className='post__body skeleton-rect'
        onClick={() => navigateToDetail()}
      >
        <View className='post__body__title'>{post.title}</View>
        <View className='post__body__content'>
          {post.content.length <= 50
            ? post.content
            : post.content.substring(0, 50) + '...'}
        </View>
        <View className='at-row at-row--wrap'>
          {post.images.map(image => (
            <Image
              key={image}
              fadeIn
              lazyLoad
              className='post__body__image at-col at-col-4 at-col--auto'
              src={image}
              mode='aspectFill'
            />
          ))}
        </View>
      </View>
      <View className='post__footer at-row'>
        <View className='at-col-3' onClick={() => navigateToDetail()}>
          <AtIcon value='eye' size='20' color={disabledColor} />
          <Text className='post__footer__number'>{post.views}</Text>
        </View>
        <View className='at-col-3' onClick={() => navigateToDetail(true)}>
          <AtIcon value='message' size='20' color={disabledColor} />
          <Text className='post__footer__number'>{post.comments}</Text>
        </View>
        <View className='at-col-3' onClick={handleLikePost}>
          <AtIcon
            value={liked ? 'heart-2' : 'heart'}
            size='20'
            color={disabledColor}
          />
          <Text className='post__footer__number'>{likes}</Text>
        </View>
        <View className='at-col-3' onClick={handleStarPost}>
          <AtIcon
            value={stared ? 'star-2' : 'star'}
            size='20'
            color={disabledColor}
          />
          <Text className='post__footer__number'>{stars}</Text>
        </View>
      </View>
    </View>
  )
}
