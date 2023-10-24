import { serverUrl } from '@/common/constants'
import Taro from '@tarojs/taro'
import { CreatePostParams, Post } from 'types/post'
import { Result } from 'types/result'

export const getPostList = async (
  page: number,
  pageSize: number,
  orderByPopularity: boolean = false
) => {
  const data = await Taro.request<Result<Post[]>>({
    url: `${serverUrl}/post/getPostList`,
    method: 'GET',
    data: {
      page,
      pageSize,
      orderByPopularity,
    },
  })
  return data.data.data
}

export const createPost = async (post: CreatePostParams) => {
  const data = await Taro.request<Result<Post>>({
    url: `${serverUrl}/post/createPost`,
    method: 'POST',
    data: post,
  })
  return data.data.data
}

export const searchByPostOrCommentOrReply = async (
  page: number,
  pageSize: number,
  postOrCommentOrReply: string
) => {
  const data = await Taro.request<Result<Post[]>>({
    url: `${serverUrl}/post/searchByPostOrCommentOrReply`,
    method: 'GET',
    data: {
      postOrCommentOrReply,
      page,
      pageSize,
    },
  })
  return data.data.data
}
