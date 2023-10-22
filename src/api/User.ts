import { serverUrl } from '@/common/constants'
import Taro from '@tarojs/taro'
import { Result } from 'types/result'
import { LoginInfo, UpdateUserParams, User } from 'types/user'

export const login = async (code: string) => {
  const data = await Taro.request<Result<LoginInfo>>({
    url: `${serverUrl}/user/login?code=${code}`,
    method: 'POST',
  })
  await Taro.setStorage({ key: 'token', data: data.data.data.token })
  return data.data.data
}

export const getUserById = async (id: string) => {
  const data = await Taro.request<Result<User>>({
    url: `${serverUrl}/user/getUserById?userId=${id}`,
    method: 'GET',
  })
  return data.data.data
}

export const getUserList = async (page: number, pageSize: number) => {
  const data = await Taro.request<Result<User[]>>({
    url: `${serverUrl}/user/getUserList?page=${page}&pageSize=${pageSize}`,
    method: 'GET',
  })
  return data.data.data
}

export const updateUser = async (user: UpdateUserParams) => {
  const data = await Taro.request<Result<User>>({
    url: `${serverUrl}/user/updateUser`,
    method: 'POST',
    data: user,
  })
  return data.data.data
}

export const sendCode = async (email: string) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/user/sendCode?email=${email}`,
    method: 'POST',
    header: {
      session: (await Taro.getStorage<string>({ key: 'token' })).data,
    },
  })
  return data.data.data
}

export const verifyCode = async (email: string, code: string) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/user/verifyCode?email=${email}&code=${code}`,
    method: 'POST',
  })
  return data.data.data
}

export const verifyUser = async (userId: string) => {
  const data = await Taro.request<Result<User>>({
    url: `${serverUrl}/user/verifyUser?userId=${userId}`,
    method: 'POST',
  })
  return data.data.data
}
