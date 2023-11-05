import { View, Image, Text } from '@tarojs/components'
import { Post as OPost } from '@/types/post'
import { WithUserInfo } from '@/types/withUserInfo'
import './SimplePost.scss'
import Taro from '@tarojs/taro'
import { ErrorCode } from '@/types/commonErrorCode'
import { useAppSelector } from '@/redux/hooks'

type Post = WithUserInfo<OPost>

interface IProps {
  post: Post
  bgColor?: string
  isLoaded: boolean
}

export default function SimplePost({
  post,
  bgColor = '#eee',
  isLoaded,
}: IProps) {
  if (isLoaded && !post) {
    return (
      <View className='simple-post' style={{ backgroundColor: bgColor }}>
        <View className='simple-post__title'>帖子走丢了...</View>
      </View>
    )
  }
  if (!post) {
    post = {
      comments: -1,
      content: '',
      createAt: '',
      deleteAt: '',
      id: -1,
      images: [],
      likes: -1,
      stars: -1,
      title: '',
      updateAt: '',
      userId: '',
      views: -1,
      userName: '',
      userAvatar: '',
    }
  }

  const showComponent = useAppSelector(state => state.review.showComponent)

  return (
    <View
      className='simple-post'
      style={{ backgroundColor: bgColor }}
      onClick={e => {
        e.stopPropagation()
        if (post && isLoaded) {
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
                }&sendCommentFocus=${false}`,
          })
        }
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
        <Text className='simple-post__username'>
          {post.userName}
          {post.userName ? '：' : ''}
        </Text>
        {post.title.length > 30 ? post.title.slice(0, 30) + '...' : post.title}
        {!isLoaded && '加载中...'}
      </View>
    </View>
  )
}
