import { getReplyList } from '@/api/Reply'
import { View, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { Reply } from 'types/reply'
import './ReplyBlock.scss'

export default function ReplyBlock({
  commentId,
  replyCount,
}: {
  commentId: number
  replyCount: number
}) {
  const [replies, setReplies] = useState<Reply[]>([])

  useEffect(() => {
    getReplyList(commentId, 1, 5).then(data => setReplies(data))
  }, [])

  return (
    <View className='reply-block'>
      {replies.map(reply => (
        <View className='reply-block__item' key={reply.id}>
          <Text className='reply-block__item__username'>{reply.userName}</Text>
          {reply.replyUserId && (
            <Text className='reply-block__item__username'>
              {' 回复 '}
              {reply.replyUserName}
            </Text>
          )}
          ：{reply.content}
        </View>
      ))}
      {replyCount > 5 && (
        <View className='reply-block__more'>查看更多{`${replyCount}条`}回复</View>
      )}
    </View>
  )
}
