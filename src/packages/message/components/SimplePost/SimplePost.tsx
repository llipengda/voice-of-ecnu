import { View, Image, Text } from '@tarojs/components'
import { Post as OPost } from '@/types/post'
import { WithUserInfo } from '@/types/withUserInfo'
import './SimplePost.scss'
import Taro from '@tarojs/taro'

type Post = WithUserInfo<OPost>

interface IProps {
  post: Post
  bgColor?: string
}

export default function SimplePost({ post, bgColor = '#eee' }: IProps) {
  if (!post) {
    return <></>
  }
  return (
    <View
      className='simple-post'
      style={{ backgroundColor: bgColor }}
      onClick={e => {
        e.stopPropagation()
        Taro.navigateTo({
          url: `/packages/post/pages/detail/detail?postId=${
            post.id
          }&authorName=${post.userName}&authorAvatar=${
            post.userAvatar
          }&sendCommentFocus=${false}`,
        })
      }}
    >
      {post.images.length > 0 && (
        <Image
          src={post.images[0]}
          mode='aspectFill'
          className='simple-post__image'
        />
      )}
      <View className='simple-post__title'>
        <Text className='simple-post__username'>{post.userName}：</Text>
        {post.title.length > 30 ? post.title.slice(0, 30) + '...' : post.title}
      </View>
    </View>
  )
}
