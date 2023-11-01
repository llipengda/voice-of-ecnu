export type WithUserInfo<T> = T & {
  userName: string
  userAvatar: string
}