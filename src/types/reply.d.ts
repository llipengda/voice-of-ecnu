export type Reply = {
  commentId: number
  content: string
  createAt: string
  deleteAt?: string
  id: number
  likes: number
  postId: number
  replyId?: number
  replyUserId?: string
  replyUserName?: string
  userId: string
  userName: string
  isLike: boolean
}

export type CreateReplyParams = {
  commentId: number
  replyId?: number
  content: string
}
