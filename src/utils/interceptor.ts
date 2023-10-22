import Taro from '@tarojs/taro'

const interceptor: Taro.interceptor = chain => {
  const requestParams = chain.requestParams
  const token = Taro.getStorageSync('token')
  if (token) {
    requestParams.header = {
      ...requestParams.header,
      session: token,
    }
  }
  return chain.proceed(requestParams).then(res => {
    if (res.statusCode !== 200) {
      Taro.showToast({
        title: '发生了未知错误',
        icon: 'error',
      })
    } else if (res.data.code !== 0) {
      Taro.showToast({
        title: res.data.msg,
        icon: 'error',
      })
    }
    return res
  })
}

export default interceptor
