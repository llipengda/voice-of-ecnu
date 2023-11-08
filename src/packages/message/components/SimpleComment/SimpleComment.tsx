import { View, Text } from '@tarojs/components'
import SimplePost from '../SimplePost/SimplePost'
import { Post as OPost } from '@/types/post'
import { WithUserInfo } from '@/types/withUserInfo'
import './SimpleComment.scss'
import { Comment as OComment } from '@/types/comment'
import Taro from '@tarojs/taro'
import { useAppSelector } from '@/redux/hooks'
import { ErrorCode } from '@/types/commonErrorCode'

type Post = WithUserInfo<OPost>
type Comment = WithUserInfo<OComment>

interface IProps {
  post: Post
  comment: Comment
  isTop?: boolean
  bgColor?: string
  postBgColor?: string
  isLoaded: boolean
  isPostLoaded: boolean
}

export default function SimpleComment({
  post,
  comment,
  isTop = true,
  bgColor = isTop ? '#eee' : '#f6f6f6',
  postBgColor = isTop ? '#f6f6f6' : '#eee',
  isLoaded,
  isPostLoaded,
}: IProps) {
  if (isLoaded && !comment) {
    return (
      <View className='simple-comment' style={{ backgroundColor: bgColor }}>
        <View className='simple-comment__title'>评论不见了...</View>
      </View>
    )
  }
  if (!comment) {
    comment = {
      content: '',
      createAt: '',
      deleteAt: '',
      id: -1,
      images: [],
      likes: -1,
      postId: -1,
      replies: -1,
      userId: '',
      userName: '',
      userAvatar: '',
      isLike: false
    }
  }

  const showComponent = useAppSelector(state => state.review.showComponent)

  return (
    <View
      className='simple-comment'
      style={{ backgroundColor: bgColor }}
      onClick={e => {
        e.stopPropagation()
        if (post && comment && isLoaded) {
          if (!showComponent) {
            Taro.navigateTo({
              url: `/pages/error/error?errorCode=${ErrorCode.NO_MORE_CONTENT}&showErrorCode=false`,
            })
            return
          }
          Taro.navigateTo({
            url: post.deleteAt
              ? '/pages/error/error?errorCode=9031&showErrorCode=false'
              : `/packages/post/pages/detail/detail?postId=${
                  post.id
                }&authorName=${post.userName}&authorAvatar=${
                  post.userAvatar
                }&sendCommentFocus=${false}&scrollTo=#comment-${comment.id}`,
          })
        }
      }}
    >
      <View className='simple-comment__title'>
        <Text className='simple-comment__username'>
          {comment.userName}
          {comment.userName ? '：' : ''}
        </Text>
        {comment.content.length > 50
          ? comment.content.slice(0, 50) +
            '...' +
            (comment.images.length > 0 ? '[图片]' : '')
          : comment.content + (comment.images.length > 0 ? '[图片]' : '')}
        {!isLoaded && '加载中'}
      </View>
      <View className='simple-comment__post'>
        <SimplePost post={post} bgColor={postBgColor} isLoaded={isPostLoaded} />
      </View>
    </View>
  )
}
