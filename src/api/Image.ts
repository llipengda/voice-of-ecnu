import Taro from '@tarojs/taro'
import { serverUrl } from '@/common/constants'
import { Result } from '@/types/result'

export const uploadImage = async (filePath: string) => {
  try {
    if (!filePath) {
      return
    }
    await Taro.showLoading({
      title: '上传中...',
    })
    console.log('尝试上传图片', filePath)
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
    Taro.hideLoading()
    console.log('上传成功', newData)
    return newData.data
  } catch (err) {
    console.error('上传失败', err)
    await Taro.showToast({
      title: err.message,
      icon: 'error',
      duration: 1000,
    })
  }
}

export const uploadImages = async (files: string[]) => {
  try {
    if (!files) {
      return
    }
    await Taro.showLoading({
      title: '上传图片中...',
    })
    console.log('尝试上传多张图片', files)
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
    console.log('服务器返回数据', datas)
    datas.forEach(data => {
      const newData: Result<string> = JSON.parse(data.data)
      if (newData.code !== 0) {
        throw new Error(newData.msg)
      }
      res.push(newData.data)
    })
    console.log('上传多张图片成功', res)
    Taro.hideLoading()
    return res
  } catch (err) {
    console.error('上传多张图片失败', err)
    await Taro.showToast({
      title: err.message,
      icon: 'error',
      duration: 1000,
    })
  }
}
