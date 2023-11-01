export type User = {
  id: string
  /**
   * @enum 0: 超级管理员, 1: 管理员, 2: 认证用户, 3: 未认证用户, 4: 未同意隐私政策用户
   */
  role: 0 | 1 | 2 | 3 | 4
  name: string
  email?: string
  avatar: string
  createTime: string
  status?: string // 个性签名
  bannedBefore?: Date
  /**
   * @enum 0: 未知, 1: 男, 2: 女, 3: 其他
   */
  gender?: 0 | 1 | 2 | 3
  grade?: string
  major?: string
}

export type LoginInfo = {
  role: User['role']
  token: string
  userId: string
}

type _UpdateUserParams = {
  role: User['role']
  name: string
  email: string
  avatar: string
  status: string
  gender: User['gender']
  grade: string
  major: string
}

export type UpdateUserParams = Partial<_UpdateUserParams>
