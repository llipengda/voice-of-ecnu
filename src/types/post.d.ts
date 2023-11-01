export type Post = {
  comments: number
  content: string
  createAt: string
  deleteAt?: string
  id: number
  images: string[]
  likes: number
  stars: number
  title: string
  updateAt: string
  userId: string
  views: number
}

export type CreatePostParams = {
  content: string
  images: string[]
  title: string
}
