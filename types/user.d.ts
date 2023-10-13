export interface User {
  id: string
  role: 0 | 1 | 2 | 3
  // 0: 超级管理员, 1: 管理员, 2: 认证用户, 3: 未认证用户
  name: string
  email?: string
  avatar: string
  createdAt: Date
  status?: string // 个性签名
  bannedBefore?: Date
  gender?: 0 | 1 | 2 | 3
  // 0: 未知, 1: 男, 2: 女, 3: 其他
  grade?: string
  major?: string
}
