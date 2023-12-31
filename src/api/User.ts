import {
  $$fddnj5se7S$,
  $fGdfhs45df88d2$,
  serverUrl,
  $$4srfsfsdc5$$,
  $vfhudSs9f8se4E$
} from '@/common/constants'
import Taro from '@tarojs/taro'
import { Result } from '@/types/result'
import { LoginInfo, UpdateUserParams, User, UserStatistics } from '@/types/user'
import { sendNotice } from './Notice'
import store from '@/redux/store'
import { setShowComponent } from '@/redux/slice/reviewSlice'

export const login = async (code: string) => {
  const data = await Taro.request<Result<LoginInfo>>({
    url: `${serverUrl}/user/login?code=${code}`,
    method: 'POST'
  })
  await Taro.setStorage({ key: 'token', data: data.data.data.token })
  await Taro.setStorage({ key: 'userId', data: data.data.data.userId })
  return data.data.data
}

export const checkLogin = async () => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/user/check`,
    method: 'GET'
  })
  return data.data.data
}

export const getUserById = async (id: string) => {
  const data = await Taro.request<Result<User>>({
    url: `${serverUrl}/user/getUserById?userId=${id}`,
    method: 'GET'
  })
  if (data.data.data.role <= 0) {
    store.dispatch(setShowComponent(true))
  }
  if (store.getState().common.$gv485DBy$fg) {
    if (store.getState().user.id === id) {
      data.data.data.name = $vfhudSs9f8se4E$
      data.data.data.avatar = $$4srfsfsdc5$$
    } else {
      data.data.data.name = $fGdfhs45df88d2$
      data.data.data.avatar = $$fddnj5se7S$
    }
  }
  return data.data.data
}

export const getUserList = async (page: number, pageSize: number) => {
  const data = await Taro.request<Result<User[]>>({
    url: `${serverUrl}/user/getUserList?page=${page}&pageSize=${pageSize}`,
    method: 'GET'
  })
  return data.data.data
}

export const updateUser = async (user: UpdateUserParams) => {
  const data = await Taro.request<Result<User>>({
    url: `${serverUrl}/user/updateUser`,
    method: 'POST',
    data: user
  })
  return data.data.data
}

export const sendCode = async (email: string) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/user/sendCode?email=${email}`,
    method: 'POST'
  })
  return data.data.data
}

export const verifyCode = async (email: string, code: string) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/user/verifyCode?email=${email}&code=${code}`,
    method: 'POST'
  })
  return data.data.data
}

export const verifyUser = async (userId: string) => {
  const data = await Taro.request<Result<User>>({
    url: `${serverUrl}/user/verifyUser?userId=${userId}`,
    method: 'POST'
  })
  await sendNotice('您已成功完成认证', userId)
  return data.data.data
}

export const confirmPrivacyPolicy = async (userId: string) => {
  const data = await Taro.request<Result<User>>({
    url: `${serverUrl}/user/confirmPrivacyPolicy?userId=${userId}`,
    method: 'POST'
  })
  return data.data.data
}

export const banUser = async (days: number, userId: string) => {
  const bannedBefore = new Date(Date.now() + 86400000 * days)
  const data = await Taro.request<Result<User>>({
    url: `${serverUrl}/user/banUser?bannedBefore=${bannedBefore.toDateString()}&userId=${userId}`,
    method: 'POST'
  })
  if (data.data.code !== -1 && data.data.data) {
    if (days < 0) {
      await sendNotice('您已被管理员解除封禁', userId)
    } else {
      await sendNotice(`您因「违反社区秩序」被管理员封禁${days}天`, userId)
    }
  }
  return data.data.data
}

export const getUserStatistics = async () => {
  const data = await Taro.request<Result<UserStatistics>>({
    url: `${serverUrl}/user/getInfos`,
    method: 'GET'
  })
  return data.data.data
}

export const getUserStatisticsById = async (userId: string) => {
  const data = await Taro.request<Result<UserStatistics>>({
    url: `${serverUrl}/user/getInfoById`,
    method: 'GET',
    data: { userId }
  })
  return data.data.data
}

export const deleteUser = async () => {
  const data = await Taro.request<Result<string>>({
    url: `${serverUrl}/user/delete`,
    method: 'POST'
  })
  return data.data.data
}

export const checkName = async (name: string) => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/user/checkName?name=${name}`,
    method: 'GET'
  })
  return data.data.data
}

export const changeShowUserPost = async () => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/user/open`,
    method: 'POST'
  })
  return data.data.data
}

export const changeIsVibrate = async () => {
  const data = await Taro.request<Result<boolean>>({
    url: `${serverUrl}/user/vibrate`,
    method: 'POST'
  })
  return data.data.data
}
