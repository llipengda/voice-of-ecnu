export type NoticeMap = {
  总消息数: number
  系统消息: number
  回复收到了回复: number
  帖子收到了回复: number
  评论收到了回复: number
  回复收到了点赞: number
  帖子收到了点赞: number
  评论收到了点赞: number
}

export type NoticeCnt = {
  total: number
  system: number
  reply: {
    total: number
    post: number
    comment: number
    reply: number
  }
  like: {
    total: number
    post: number
    comment: number
    reply: number
  }
}
