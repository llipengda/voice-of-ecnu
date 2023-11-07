import { Notice as ONotice } from '@/types/notice'
import { WithUserInfo } from '@/types/withUserInfo'
import { View, Image, Text } from '@tarojs/components'
import SimplePost from '../SimplePost/SimplePost'
import { useEffect, useState } from 'react'
import { Post as OPost } from '@/types/post'
import { Comment as OComment } from '@/types/comment'
import './Notice.scss'
import { Reply } from '@/types/reply'
import SimpleComment from '../SimpleComment/SimpleComment'
import SimpleReply from '../SimpleReply/SimpleReply'
import { getPostByIdWithUserInfo } from '@/api/Post'
import { getCommentById } from '@/api/Comment'
import { getReplyById } from '@/api/Reply'
import { defaultAvatar } from '@/common/constants'
import { convertDate } from '@/utils/dateConvert'

type Notice = WithUserInfo<ONotice>
type Post = WithUserInfo<OPost>
type Comment = WithUserInfo<OComment>

interface IProps {
  notice: Notice
}

/**
 * @param noticeType 0:系统 1:给帖子点赞 2:给帖子回复 3:给评论点赞 4:给评论回复 5:给回复点赞 6:给回复回复
 */
const generateMessageByType = (noticeType: Notice['type']) => {
  switch (noticeType) {
    case 0:
      return '系统通知'
    case 1:
      return '赞了你的帖子'
    case 2:
      return '回复了你的帖子'
    case 3:
      return '赞了你的评论'
    case 4:
      return '回复了你的评论'
    case 5:
      return '赞了你的回复'
    case 6:
      return '回复了你的回复'
    default:
      return ''
  }
}

export default function Notice({ notice }: IProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [comment, setComment] = useState<Comment | null>(null)
  const [reply, setReply] = useState<Reply | null>(null)

  const [isReplyLoaded, setIsReplyLoaded] = useState(false)
  const [isCommentLoaded, setIsCommentLoaded] = useState(false)
  const [isPostLoaded, setIsPostLoaded] = useState(false)

  useEffect(() => {
    ;(async () => {
      switch (notice.type) {
        case 0:
          break
        case 1:
        case 2:
          const postData = await getPostByIdWithUserInfo(notice.objectId)
          setPost(postData)
          setIsPostLoaded(true)
          break
        case 3:
        case 4:
          const commentData = await getCommentById(notice.objectId)
          setIsCommentLoaded(true)
          setComment(commentData)
          const postCommentData = await getPostByIdWithUserInfo(
            commentData.postId
          )
          setPost(postCommentData)
          setIsPostLoaded(true)
          break
        case 5:
        case 6:
          const replyData = await getReplyById(notice.objectId)
          setIsReplyLoaded(true)
          setReply(replyData)
          const commentReplyData = await getCommentById(replyData.commentId)
          setIsCommentLoaded(true)
          setComment(commentReplyData)
          const postReplyData = await getPostByIdWithUserInfo(
            commentReplyData.postId
          )
          setPost(postReplyData)
          setIsPostLoaded(true)
          break
        default:
          break
      }
    })()
  }, [])

  /**
   * @param noticeType 0:系统 1:给帖子点赞 2:给帖子回复 3:给评论点赞 4:给评论回复 5:给回复点赞 6:给回复回复
   */
  const DetailLink = ({ noticeType }: { noticeType: Notice['type'] }) => {
    switch (noticeType) {
      case 0:
        return <></>
      case 1:
      case 2:
        return <SimplePost post={post!} isLoaded={isPostLoaded} />
      case 3:
      case 4:
        return (
          <SimpleComment
            post={post!}
            comment={comment!}
            isLoaded={isCommentLoaded}
            isPostLoaded={isPostLoaded}
          />
        )
      case 5:
      case 6:
        return (
          <SimpleReply
            post={post!}
            comment={comment!}
            reply={reply!}
            isLoaded={isReplyLoaded}
            isCommentLoaded={isCommentLoaded}
            isPostLoaded={isPostLoaded}
          />
        )
      default:
        return <></>
    }
  }

  return (
    <View className='notice'>
      {notice.type === 0 ? (
        <View>
          <View className='notice__header'>
            <Image
              className='notice__header__avatar'
              src={defaultAvatar}
              fadeIn
              lazyLoad
            />
            <View className='notice__header__info'>
              <View className='notice__header__info__name'>系统消息</View>
              <View className='notice__header__info__message'>
                <Text className='notice__header__info__time'>{` ${convertDate(notice.sendAt)}`}</Text>
              </View>
            </View>
          </View>
          <View className='notice__content'>{notice.content}</View>
        </View>
      ) : (
        <View>
          <View className='notice__header'>
            <Image
              className='notice__header__avatar'
              src={notice.userAvatar}
              fadeIn
              lazyLoad
            />
            <View className='notice__header__info'>
              <View className='notice__header__info__name'>
                {notice.userName}
              </View>
              <View className='notice__header__info__message'>
                {generateMessageByType(notice.type)}
                <Text className='notice__header__info__time'>{` ${convertDate(notice.sendAt)}`}</Text>
              </View>
            </View>
          </View>
          <View className='notice__content'>{notice.content}</View>
          <View className='notice__link'>
            <DetailLink noticeType={notice.type} />
          </View>
        </View>
      )}
    </View>
  )
}
