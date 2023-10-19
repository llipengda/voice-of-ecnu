import { serverUrl } from '@/common/constants'
import Taro from '@tarojs/taro'
import { Result } from 'types/result'
import { LoginInfo, UpdateUserParams, User } from 'types/user'

export const login = async (code: string) => {
  try {
    const data = await Taro.request<Result<LoginInfo>>({
      url: `${serverUrl}/user/login?code=${code}`,
      method: 'POST',
    })
    if (data.data.code !== 0) {
      throw new Error(data.data.msg)
    }
    console.log(data.data.data)
    await Taro.setStorage({ key: 'token', data: data.data.data.token })
    return data.data.data
  } catch (error) {
    Taro.showToast({
      title: error.message,
      icon: 'error',
    })
  }
}

export const getUserById = async (id: string) => {
  try {
    const data = await Taro.request<Result<User>>({
      url: `${serverUrl}/user/getUserById?userId=${id}`,
      method: 'GET',
    })
    if (data.data.code !== 0) {
      throw new Error(data.data.msg)
    }
    return data.data.data
  } catch (error) {
    Taro.showToast({
      title: error.message,
      icon: 'error',
    })
  }
}

export const getUserList = async (page: number, pageSize: number) => {
  try {
    const data = await Taro.request<Result<User[]>>({
      url: `${serverUrl}/user/getUserList?page=${page}&pageSize=${pageSize}`,
      method: 'GET',
      header: {
        session: (await Taro.getStorage<string>({ key: 'token' })).data,
      },
    })
    if (data.data.code !== 0) {
      throw new Error(data.data.msg)
    }
    return data.data.data
  } catch (error) {
    Taro.showToast({
      title: error.message,
      icon: 'error',
    })
  }
}

export const updateUser = async (user: UpdateUserParams) => {
  try {
    const data = await Taro.request<Result<User>>({
      url: `${serverUrl}/user/updateUser`,
      method: 'POST',
      header: {
        session: (await Taro.getStorage<string>({ key: 'token' })).data,
      },
      data: user,
    })
    if (data.data.code !== 0) {
      throw new Error(data.data.msg)
    }
    return data.data.data
  } catch (error) {
    Taro.showToast({
      title: error.message,
      icon: 'error',
    })
  }
}
