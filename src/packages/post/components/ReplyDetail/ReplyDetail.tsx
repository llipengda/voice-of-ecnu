import { View } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import ListView from 'taro-listview'
import { Comment } from '@/types/comment'
import { Reply as OReply } from '@/types/reply'
import CComment from '../Comment/Comment'
import CReply from '../Reply/Reply'
import { getReplyList } from '@/api/Reply'
import { AtDivider } from 'taro-ui'
import { WithUserInfo } from '@/types/withUserInfo'
import './ReplyDetail.scss'

type Reply = WithUserInfo<OReply>

interface IProps {
  comment: WithUserInfo<Comment>
  isShow: boolean
  onClickReply: (
    replyId: number,
    replyUserName: string,
    replyContent: string
  ) => void
  newReply: Reply | null
  onShowMenu: (
    replyId: number,
    replyUserId: string,
    replyContent: string,
    replyUserName: string,
    likedReply: boolean,
    onLikeReply: () => void,
    onRemoveReply: (replyId: number) => void
  ) => void
  onRemoveReply: (removeReplyCommentId: number) => void
}

export default function ReplyDetail({
  comment,
  isShow,
  onClickReply,
  newReply,
  onShowMenu,
  onRemoveReply
}: IProps) {
  const [replies, setReplies] = useState<Reply[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)

  const index = useRef(1)

  const handleScrollToLower = async () => {
    const data = await getReplyList(comment.id, ++index.current, 10)
    setReplies([...replies, ...data])
    setHasMore(data.length === 10)
  }

  const getData = async () => {
    index.current = 1
    const data = await getReplyList(comment.id, index.current, 10)
    setReplies(data || [])
    setHasMore(data.length === 10)
    setIsEmpty(data.length === 0)
  }

  const handlePullDownRefresh = async () => {
    await getData()
  }

  useEffect(() => {
    if (!isShow) {
      setReplies([])
      return
    }
    handlePullDownRefresh()
  }, [isShow])

  useEffect(() => {
    if (newReply && newReply.commentId === comment.id && isShow && !hasMore) {
      setReplies([...replies, newReply])
    }
  }, [newReply])

  const handleRemoveReply = (replyId: number) => {
    onRemoveReply(replies.find(reply => reply.id === replyId)?.commentId || -1)
    setReplies(replies.filter(reply => reply.id !== replyId))
  }

  const handleShowMenu = (
    replyId: number,
    replyUserId: string,
    replyContent: string,
    replyUserName: string,
    likedReply: boolean,
    onLikeReply: () => void
  ) => {
    onShowMenu(
      replyId,
      replyUserId,
      replyContent,
      replyUserName,
      likedReply,
      onLikeReply,
      handleRemoveReply
    )
  }

  return (
    <View
      className='reply-detail'
      catchMove
      onTouchMove={e => e.stopPropagation()}
    >
      {isShow && (
        /* @ts-ignore */
        <ListView
          isLoaded={true}
          hasMore={hasMore}
          style={{
            height: '70vh',
            width: '100%',
            overflowX: 'hidden'
          }}
          onPullDownRefresh={handlePullDownRefresh}
          onScrollToLower={handleScrollToLower}
        >
          <View className='reply-detail__comment'>
            <CComment
              comment={comment}
              onShowMenu={() => {}}
              onshowReplyDetail={() => {}}
              showMenuBtn={false}
              showReply={false}
              showBorder={false}
              showDetail={false}
              onCustomClickBody={() => onClickReply(-1, '', '')}
            />
          </View>
          <View onClick={() => onClickReply(-1, '', '')}>
            <AtDivider
              content='回复'
              height={80}
              className='reply-detail__divider'
            />
          </View>
          {replies.map(reply => (
            <CReply
              key={reply.id}
              reply={reply}
              onShowMenu={handleShowMenu}
              onClickReply={onClickReply}
            />
          ))}
          {(isEmpty || !hasMore) && (
            <View className='tip2' onClick={() => onClickReply(-1, '', '')}>
              没有更多内容
            </View>
          )}
        </ListView>
      )}
    </View>
  )
}
