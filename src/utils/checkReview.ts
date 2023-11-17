import { expectedReviewDate } from '@/common/constants'
import Taro from '@tarojs/taro'

export const checkReview = () => {
  if (process.env.TARO_ENV !== 'weapp') {
    return true
  }
  const environment = Taro.getAccountInfoSync().miniProgram.envVersion
  if (environment !== 'release' && new Date() < expectedReviewDate) {
    return false
  }
  return true
}
