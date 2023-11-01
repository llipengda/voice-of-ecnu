import { CommonErrorCode } from './commonErrorCode'

export type Result<T> = {
  code: number
  commonErrorCode?: CommonErrorCode
  data: T
  msg: string
}
