import Taro from '@tarojs/taro'
import { View, Image, Text, Picker } from '@tarojs/components'
import { useCallback, useEffect, useState } from 'react'
import { Post as OTPost } from '@/types/post'
import { AtIcon } from 'taro-ui'
import { starPost, unstarPost } from '@/api/Star'
import { like, unlike } from '@/api/Like'
import { deletePost } from '@/api/Post'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { removePost } from '@/redux/slice/postSlice'
import { disabledColor, primaryColor } from '@/common/constants'
import { WithUserInfo } from '@/types/withUserInfo'
import { getUserById } from '@/api/User'
import { ErrorCode } from '@/types/commonErrorCode'
import { convertDate } from '@/utils/dateConvert'
import './Post.scss'
import { ICustomModalProps } from '@/components/CustomModal/CustomModal'
import { sendNotice } from '@/api/Notice'
import { useVibrateCallback } from '@/utils/hooks/useVibrateCallback'
import { increaseShoudNotVibrate } from '@/redux/slice/commonSlice'

type TPost = WithUserInfo<OTPost>

function isTPost(post: TPost | OTPost): post is TPost {
  return (post as TPost).userName !== undefined
}

export default function Post({
  post,
  onShowMenu,
  onShowModal
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
  onShowModal: (props: Partial<ICustomModalProps>) => Promise<boolean>
}) {
  const [avatar, setAvatar] = useState('')
  const [username, setUsername] = useState('')

  const [liked, setLiked] = useState(post.isLike)
  const [stared, setStared] = useState(post.isStar)

  const [likes, setLikes] = useState(post.likes)
  const [stars, setStars] = useState(post.stars)

  const [likeDisabled, setLikeDisabled] = useState(false)
  const [starDisabled, setStarDisabled] = useState(false)

  const dispatch = useAppDispatch()

  const showComponent = useAppSelector(state => state.review.showComponent)
  const user = useAppSelector(state => state.user)

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
  }, [post])

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

  const _handleLikePost = useVibrateCallback(handleLikePost, [handleLikePost])

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

  const _handleStarPost = useVibrateCallback(handleStarPost, [handleStarPost])

  const handleDeletePost = useVibrateCallback(async () => {
    const DelPost = ({ onChange }: { onChange: (e: string) => void }) => {
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
          <View>确定要删除该帖子吗？</View>
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

    if (user.id === post.userId) {
      const res = await Taro.showModal({
        title: '提示',
        content: '确定将帖子删除？'
      })
      if (res.confirm) {
        await deletePost(post.id)
        dispatch(removePost(post.id))
        Taro.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
      }
    } else if (user.role <= 1) {
      const res = await onShowModal({
        title: '警告',
        children: <DelPost onChange={e => (delReason = e)} />
      })
      if (res) {
        await deletePost(post.id)
        dispatch(removePost(post.id))
        await sendNotice(
          `您于 ${post.createAt} 发布的帖子 \"${post.title.substring(
            0,
            10
          )}...\" 因「${delReason}」被管理员删除`,
          post.userId
        )
        Taro.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })
      }
    }
  }, [user, post])

  const navigateToDetail = useCallback(
    (focus: boolean = false) => {
      if (focus) {
        dispatch(increaseShoudNotVibrate())
      }
      if (!showComponent) {
        Taro.navigateTo({
          url: `/pages/error/error?errorCode=${ErrorCode.NO_MORE_CONTENT}&showErrorCode=false`
        })
        return
      }
      if (!post.deleteAt) {
        Taro.navigateTo({
          url: `/packages/post/pages/detail/detail?postId=${post.id}&authorName=${username}&authorAvatar=${avatar}&sendCommentFocus=${focus}`
        })
      } else {
        Taro.navigateTo({
          url: `/pages/error/error?errorCode=${ErrorCode.POST_NOT_FOUND}&showErrorCode=false`
        })
      }
    },
    [showComponent, post]
  )

  const handleNavigateToUserInfo = useVibrateCallback(async () => {
    if (!showComponent) {
      Taro.navigateTo({
        url: `/pages/error/error?errorCode=${ErrorCode.NO_MORE_CONTENT}&showErrorCode=false`
      })
      return
    }
    await Taro.navigateTo({
      url: `/packages/user/pages/detail/detail?userId=${post.userId}`
    })
  }, [showComponent])

  return (
    <View className='post skeleton-bg'>
      <View className='post__header at-row'>
        <Image
          fadeIn
          lazyLoad
          className='post__header__avatar skeleton-redius'
          src={avatar}
          onClick={handleNavigateToUserInfo}
        />
        <View className='at-col'>
          <View className='at-row' onClick={handleNavigateToUserInfo}>
            <Text className='post__header__username'>
              {username || '加载中...'}
            </Text>
          </View>
          <View className='at-row'>
            <Text className='post__header__create-at'>
              {`发布于${convertDate(post.createAt)} ${
                showComponent && post.comments > 0
                  ? '回复于' + convertDate(post.updateAt)
                  : ''
              }`}
            </Text>
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
              className={`post__body__image at-col at-col-${
                post.images.length === 1 ? '8' : '4'
              } at-col--auto`}
              src={image}
              mode={post.images.length === 1 ? 'widthFix' : 'aspectFill'}
            />
          ))}
        </View>
      </View>
      <View className='post__footer at-row'>
        <View className='at-col-3' onClick={() => navigateToDetail()}>
          <AtIcon value='eye' size='20' color={disabledColor} />
          <Text className='post__footer__number'>{post.views}</Text>
        </View>
        {showComponent && (
          <View className='at-col-3' onClick={() => navigateToDetail(true)}>
            <AtIcon value='message' size='20' color={disabledColor} />
            <Text className='post__footer__number'>{post.comments}</Text>
          </View>
        )}
        <View className='at-col-3' onClick={_handleLikePost}>
          <AtIcon
            value={liked ? 'heart-2' : 'heart'}
            size='20'
            color={disabledColor}
          />
          <Text className='post__footer__number'>{likes}</Text>
        </View>
        <View className='at-col-3' onClick={_handleStarPost}>
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
