import store from '@/redux/store'
import { WithUserInfo } from '@/types/withUserInfo'

export const addUserInfo: <T>(data: T) => WithUserInfo<T> = data => {
  const userName = store.getState().user.name
  const userAvatar = store.getState().user.avatar
  return {
    ...data,
    userName,
    userAvatar,
  }
}
