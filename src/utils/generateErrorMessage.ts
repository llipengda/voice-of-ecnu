import { ErrorCode } from '@/types/commonErrorCode'

export const generateErrorMessage = (errorCode: ErrorCode) => {
  switch (errorCode) {
    case ErrorCode.POST_NOT_EXIST:
    case ErrorCode.POST_NOT_FOUND:
      return '帖子不存在，可能已被删除'
    case ErrorCode.USER_BANNED:
      return '用户被封禁'
    case ErrorCode.COMMENT_NOT_FOUND:
      return '评论不存在，可能已被删除'
    case ErrorCode.REPLY_NOT_FOUND:
      return '回复不存在，可能已被删除'
    case ErrorCode.PARAM_ERROR:
      return '参数错误'
    case ErrorCode.STAR_FAILED:
      return '收藏失败'
    case ErrorCode.NOTICE_NOT_EXIST:
      return '通知不存在'
    case ErrorCode.REDIS_ERROR:
      return 'redis错误'
    case ErrorCode.USER_NOT_VERIFIED:
      return '用户未认证'
    case ErrorCode.BAD_REQUEST:
      return '请求出错，请检查网络或联系管理员'
    case ErrorCode.UNAUTHORIZED:
      return '未授权'
    case ErrorCode.FORBIDDEN:
      return '禁止访问'
    case ErrorCode.NOT_FOUND:
      return '页面不见了'
    case ErrorCode.REQUEST_TIMEOUT:
      return '请求超时，请检查网络'
    case ErrorCode.INTERNAL_SERVER_ERROR:
      return '服务器错误，请联系管理员'
    case ErrorCode.SERVICE_UNAVAILABLE:
      return '服务不可用，请联系管理员'
    case ErrorCode.GATEWAY_TIMEOUT:
      return '网络超时，请联系管理员'
    default:
      return '发生了未知错误'
  }
}
