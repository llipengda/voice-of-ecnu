import { serverUrl } from '@/common/constants'
import Taro from '@tarojs/taro'
import { Result } from 'types/result'

export const uploadImage = async (filePath: string) => {
  try {
    Taro.showLoading({
      title: '上传中...',
    })
    const data = await Taro.uploadFile({
      url: `${serverUrl}/uploadImage`,
      filePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data',
      },
    })
    const newData: Result<string> = JSON.parse(data.data)
    if (newData.code !== 0) {
      throw new Error(newData.msg)
    }
    return newData.data
  } catch (err) {
    Taro.showToast({
      title: err.message,
      icon: 'error',
    })
  } finally {
    Taro.hideLoading()
  }
}
