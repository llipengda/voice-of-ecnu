import { Reply } from '@/types/reply'
import { View, Text } from '@tarojs/components'
import { Post as OPost } from '@/types/post'
import { WithUserInfo } from '@/types/withUserInfo'
import { Comment as OComment } from '@/types/comment'
import SimpleComment from '../SimpleComment/SimpleComment'
import Taro from '@tarojs/taro'
import { ErrorCode } from '@/types/commonErrorCode'
import { useAppSelector } from '@/redux/hooks'
import './SimpleReply.scss'

type Post = WithUserInfo<OPost>
type Comment = WithUserInfo<OComment>

interface IProps {
  post: Post
  comment: Comment
  reply: Reply
  bgColor?: string
  isLoaded: boolean
  isCommentLoaded: boolean
  isPostLoaded: boolean
}

export default function SimpleReply({
  post,
  comment,
  reply,
  bgColor = '#eee',
  isLoaded,
  isCommentLoaded,
  isPostLoaded
}: IProps) {
  const showComponent = useAppSelector(state => state.review.showComponent)

  if (isLoaded && !reply) {
    return (
      <View className='simple-reply' style={{ backgroundColor: bgColor }}>
        <View className='simple-reply__title'>回复消失了...</View>
      </View>
    )
  }
  if (!reply) {
    reply = {
      id: -1,
      userId: '',
      userName: '',
      postId: -1,
      commentId: -1,
      replyUserId: '',
      replyUserName: '',
      content: '',
      createAt: '',
      likes: -1,
      isLike: false
    }
  }

  return (
    <View
      className='simple-reply'
      style={{ backgroundColor: bgColor }}
      onClick={e => {
        e.stopPropagation()
        if (post && comment && reply && isLoaded) {
          if (!showComponent) {
            Taro.navigateTo({
              url: `/pages/error/error?errorCode=${ErrorCode.NO_MORE_CONTENT}&showErrorCode=false`
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
                }&sendCommentFocus=${false}&scrollTo=#comment-${comment.id}`
          })
        }
      }}
    >
      <View className='simple-reply__title'>
        <Text className='simple-reply__username'>
          {reply.userName}
          {reply.userName ? '：' : ''}
        </Text>
        {(reply.replyUserId?.length || -1) > 0 &&
          `回复 ${reply.replyUserName}：`}
        {reply.content.length > 50
          ? reply.content.slice(0, 50) + '...'
          : reply.content}
        {!isLoaded && '加载中...'}
      </View>
      <View className='simple-reply__post'>
        <SimpleComment
          post={post}
          comment={comment}
          isTop={false}
          isLoaded={isCommentLoaded}
          isPostLoaded={isPostLoaded}
        />
      </View>
    </View>
  )
}
