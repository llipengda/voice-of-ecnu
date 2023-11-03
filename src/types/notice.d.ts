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

export type Notice = {
  content: string
  deleteAt: string
  id: number
  objectId: number
  receiverId: string
  sendAt: string
  senderId: string
  /** 0:系统 1:给帖子点赞 2:给帖子回复 3:给评论点赞 4:给评论回复 5:给回复点赞 6:给回复回复 */
  type: 0 | 1 | 2 | 3 | 4 | 5 | 6
}
