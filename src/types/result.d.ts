export type Result<T> = {
  code: number
  commonErrorCode?: string
  data: T
  msg: string
}