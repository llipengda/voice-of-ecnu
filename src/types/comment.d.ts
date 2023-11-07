export type Comment = {
  content: string
  createAt: string
  deleteAt?: string
  id: number
  images: string[]
  likes: number
  postId: number
  replies: number
  userId: string
  isLike: boolean
}

export type CreateCommentParams = {
  postId: number,
  images: string[],
  content: string
}
