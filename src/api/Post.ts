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
  postOrCommentOrReply: string,
  orderByPopularity: boolean = false
) => {
  const data = await Taro.request<Result<Post[]>>({
    url: `${serverUrl}/post/searchByPostOrCommentOrReply`,
    method: 'GET',
    data: {
      postOrCommentOrReply,
      page,
      pageSize,
      orderByPopularity,
    },
  })
  return data.data.data
}

export const deletePost = async (postId: number) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/post/deletePost?postId=${postId}`,
    method: 'POST',
  })
  return data.data.data
}

export const getPostById = async (postId: string) => {
  const data = await Taro.request<Result<Post>>({
    url: `${serverUrl}/post/getPostById`,
    method: 'GET',
    data: { postId },
  })
  return data.data.data
}
