import { ErrorCode } from '@/types/commonErrorCode'
import { Result } from '@/types/result'
import Taro from '@tarojs/taro'
import sleep from './sleep'
import { getUserById, login } from '@/api/User'
import store from '@/redux/store'
import { setLoginInfo } from '@/redux/slice/loginSlice'
import { setUser } from '@/redux/slice/userSlice'

const switchErrorCode = async (
  res: Taro.request.SuccessCallbackResult<Result<any>>,
  chain: Taro.Chain
) => {
  const errorCode = res.data.commonErrorCode?.errorCode
  console.error('errorCode is', errorCode)
  switch (errorCode) {
    case ErrorCode.LOGIN_HAS_OVERDUE:
      console.error('errorCode is', errorCode)
      await Taro.showLoading({
        title: '重新登陆中...',
      })
      const { code } = await Taro.login()
      const info = await login(code)
      store.dispatch(setLoginInfo(info))
      const user = await getUserById(info.userId)
      store.dispatch(setUser(user))
      Taro.hideLoading()
      await Taro.showToast({
        title: '登陆成功',
        icon: 'success',
        duration: 1000,
      })
      await sleep(1000)
      await Taro.showLoading({
        title: '重新请求中...',
      })
      const requestParams = chain.requestParams
      console.log(requestParams)
      requestParams.header = {
        ...requestParams.header,
        session: info.token,
      }
      const data = await Taro.request(requestParams)
      Taro.hideLoading()
      return data

    case ErrorCode.USER_NOT_VERIFIED:
      await Taro.showModal({
        title: '提示',
        content: '您还未进行身份认证，是否前往认证？',
        success: async res => {
          if (res.confirm) {
            await Taro.navigateTo({
              url: '/packages/user/pages/verify/verify',
            })
          }
        },
      })
      return res

    case ErrorCode.USER_BANNED:
      const bannedBefore = store.getState().user.bannedBefore || null
      await Taro.showModal({
        title: '提示',
        content: `您已被封禁${
          bannedBefore ? '至 ' + bannedBefore : ''
        }，暂时不能执行此操作。`,
        showCancel: false,
      })
      return res

    default:
      return res
  }
}

const interceptor: Taro.interceptor = chain => {
  const requestParams = chain.requestParams
  const token = Taro.getStorageSync('token')
  if (token) {
    requestParams.header = {
      ...requestParams.header,
      session: token,
    }
  }
  return chain
    .proceed(requestParams)
    .then(async (res: Taro.request.SuccessCallbackResult<Result<any>>) => {
      if (res.statusCode !== 200) {
        console.error(res)
        await Taro.showToast({
          title: '发生了未知错误',
          icon: 'error',
          duration: 1000,
        })
      } else if (res.data.code !== 0) {
        console.error(res)
        await Taro.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 1000,
        })
        await sleep(1000)
        return await switchErrorCode(res, chain)
      }
      return res
    })
}

export default interceptor
