import { View, Text } from '@tarojs/components'
import SimplePost from '../SimplePost/SimplePost'
import { Post as OPost } from '@/types/post'
import { WithUserInfo } from '@/types/withUserInfo'
import './SimpleComment.scss'
import { Comment as OComment } from '@/types/comment'
import Taro from '@tarojs/taro'

type Post = WithUserInfo<OPost>
type Comment = WithUserInfo<OComment>

interface IProps {
  post: Post
  comment: Comment
  isTop?: boolean
  bgColor?: string
  postBgColor?: string
}

export default function SimpleComment({
  post,
  comment,
  isTop = true,
  bgColor = isTop ? '#eee' : '#f6f6f6',
  postBgColor = isTop ? '#f6f6f6' : '#eee',
}: IProps) {
  if (!comment) {
    return <></>
  }
  return (
    <View
      className='simple-comment'
      style={{ backgroundColor: bgColor }}
      onClick={e => {
        e.stopPropagation()
        Taro.navigateTo({
          url: `/packages/post/pages/detail/detail?postId=${
            post.id
          }&authorName=${post.userName}&authorAvatar=${
            post.userAvatar
          }&sendCommentFocus=${false}&scrollTo=#comment-${comment.id}`,
        })
      }}
    >
      <View className='simple-comment__title'>
        <Text className='simple-comment__username'>{comment.userName}：</Text>
        {comment.content.length > 50
          ? comment.content.slice(0, 50) +
            '...' +
            (comment.images.length > 0 ? '[图片]' : '')
          : comment.content + (comment.images.length > 0 ? '[图片]' : '')}
      </View>
      <View className='simple-comment__post'>
        <SimplePost post={post} bgColor={postBgColor} />
      </View>
    </View>
  )
}
