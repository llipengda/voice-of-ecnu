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
  return chain.proceed(requestParams).then(async res => {
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
    }
    return res
  })
}

export default interceptor
