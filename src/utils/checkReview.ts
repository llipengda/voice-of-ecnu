import { expectedReviewDate } from '@/common/constants'
import Taro from '@tarojs/taro'

export const checkReview = () => {
  console.error('check review')
  const environment = Taro.getAccountInfoSync().miniProgram.envVersion
  if (environment !== 'release' && new Date() < expectedReviewDate) {
    return false
  }
  return true
}
