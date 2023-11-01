export enum ErrorCode {
  /** 会话丢失 - 登录已失效，请重新登录 */
  INVALID_SESSION = 2006,

  /** 用户非管理员 - 用户非管理员 */
  USER_NOT_ADMIN = 2002,

  /** 未传入sessionId - 请传入会话id */
  NEED_SESSION_ID = 2003,

  /** 登录已过期 - 登录已过期 */
  LOGIN_HAS_OVERDUE = 2004,

  /** 该session数据库里没有 - 请在header里key为session处对应有效的sessionId */
  SESSION_IS_INVALID = 2005,

  /** 发送邮件失败 - 请检查邮箱账号 */
  SEND_EMAIL_FAILED = 2024,

  /** 该邮箱已被使用 - 请更换邮箱 */
  EMAIL_HAS_BEEN_SIGNED_UP = 2025,

  /** 邮箱验证码错误 - 请输入正确的邮箱验证码 */
  VERIFICATION_CODE_WRONG = 2026,

  /** 该邮箱尚未注册账号 - 请输入正确的邮箱或先用此邮箱注册账号 */
  EMAIL_NOT_SIGNED_UP = 2027,

  /** 密码强度不够 - 请输入符合要求的密码 */
  PASSWORD_NOT_QUANTIFIED = 2028,

  /** 您没有删除该实体的权限 - 请选择您能操作的实体进行删除 */
  CAN_NOT_DELETE = 2030,

  /** 您上一次验证码尚未失效 - 请勿重复发送验证码 */
  DO_NOT_SEND_VERIFICATION_CODE_AGAIN = 2031,

  /** 该用户没有评论的权限 - 请联系超管修改权限 */
  CAN_NOT_COMMENT = 2033,

  /** 该用户没有修改/删除的权限 - 请联系超管修改权限 */
  CAN_NOT_MODIFY = 2034,

  /** 评论不存在 - 请重新检查id */
  COMMENT_NOT_EXIST = 2037,

  /** 验证码已过期 - 请重新发送验证码 */
  VERIFICATION_CODE_HAS_EXPIRED = 2038,

  /** 读取文件失败 - 请检查文件 */
  READ_FILE_ERROR = 2039,

  /** 用户不存在 - 用户不存在 */
  USER_NOT_EXIST = 9001,

  /** 更新失败 - 没有信息被更改 */
  UPDATE_FAILED = 9007,

  /** 传入的code有误 - 传入的code有误 */
  WRONG_CODE = 9021,

  /** 认证不存在 - 认证不存在 */
  AUTHEN_NOT_EXIST = 9022,

  /** 用户未身份认证 - 用户未身份认证 */
  STILL_NOT_VERIFIED = 9023,

  /** 已经发送过同样的申请啦！ - 已经发送过同样的申请啦！ */
  APPLY_EXIST = 9024,

  /** 用户不是这个团队的 - 用户不是这个团队的！ */
  USER_NOT_THIS_TEAM = 9025,

  /** 系统错误 - 手机号获取失败 */
  SYSTEM_ERROR = 9026,

  /** 输入为空！ - 输入为空！ */
  INPUT_NULL = 9027,

  /** 邮箱地址有误 - 邮箱地址有误 */
  EMAIL_PATTERN_ERROR = 9028,

  /** 权限不足 - 请联系管理员 */
  PERMISSION_DENIED = 9029,

  /** 微信登录失败 - 请检查微信登录 */
  WECHAT_ERROR = 9030,

  /** 帖子不存在 - 帖子不存在 */
  POST_NOT_EXIST = 9031,

  /** 用户被封禁 - 用户被封禁 */
  USER_BANNED = 9032,

  /** 帖子不存在 - 帖子不存在 */
  POST_NOT_FOUND = 9033,

  /** 评论不存在 - 评论不存在 */
  COMMENT_NOT_FOUND = 9034,

  /** 回复不存在 - 回复不存在 */
  REPLY_NOT_FOUND = 9035,

  /** 参数错误 - 参数错误 */
  PARAM_ERROR = 9036,

  /** 收藏失败 - 收藏失败 */
  STAR_FAILED = 9037,

  /** 通知不存在 - 通知不存在 */
  NOTICE_NOT_EXIST = 9038,

  /** redis错误 - redis错误 */
  REDIS_ERROR = 9039,

  /** 用户未认证 - 用户未认证 */
  USER_NOT_VERIFIED = 9040,
}

export type CommonErrorCode = {
  errorCode: ErrorCode
  errorReason: string
  errorSuggestion: string
} | null | undefined
