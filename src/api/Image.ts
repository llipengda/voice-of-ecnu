import Taro from '@tarojs/taro'
import { serverUrl } from '@/common/constants'
import { Result } from '@/types/result'

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
        header: {
          session: (await Taro.getStorage<string>({ key: 'token' })).data,
        },
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

export const uploadImages = async (files: string[]) => {
  try {
    Taro.showLoading({
      title: '上传图片中...',
    })
    const res: string[] = []
    const tasks = files.map(async filePath => {
      return Taro.uploadFile({
        url: `${serverUrl}/uploadImage`,
        filePath,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data',
          header: {
            session: (await Taro.getStorage<string>({ key: 'token' })).data,
          },
        },
      })
    })
    const datas = await Promise.all(tasks)
    datas.forEach(data => {
      const newData: Result<string> = JSON.parse(data.data)
      if (newData.code !== 0) {
        throw new Error(newData.msg)
      }
      res.push(newData.data)
    })
    return res
  } catch (err) {
    Taro.showToast({
      title: err.message,
      icon: 'error',
    })
  } finally {
    Taro.hideLoading()
  }
}
