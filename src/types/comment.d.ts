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
}

export type CreateCommentParams = {
  postId: number,
  image: string[],
  content: string
}
