import Taro from '@tarojs/taro'
import { Input, View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { AtButton, AtImagePicker, AtTextarea } from 'taro-ui'
import { uploadImages } from '@/api/Image'
import { createPost } from '@/api/Post'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { addPost } from '@/redux/slice/postSlice'
import sleep from '@/utils/sleep'
import { addUserInfo } from '@/utils/addUserInfo'
import '@/custom-theme.scss'
import './add.scss'
import { useVibrateCallback } from '@/utils/hooks/useVibrateCallback'
import { addBoard } from '@/api/Notice'

interface FileItem {
  path: string
  size: number
}

interface File {
  url: string
  file?: FileItem
}

export default function Add() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])

  const [submitButtonLoading, setSubmitButtonLoading] = useState(false)

  const params = Taro.getCurrentInstance().router?.params

  const [type] = useState<'post' | 'board'>(
    (params?.type as 'post' | 'board') || 'post'
  )

  const dispatch = useAppDispatch()

  const showComponent = useAppSelector(state => state.review.showComponent)

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: showComponent ? (type === 'post' ? '发帖' : '发布公告') : '添加'
    })
  }, [showComponent])

  const handleCancel = useVibrateCallback(() => {
    Taro.navigateBack()
  })

  const handleSubmit = useVibrateCallback(async () => {
    setSubmitButtonLoading(true)
    if (!title) {
      Taro.showToast({
        title: '标题不能为空',
        icon: 'error',
        duration: 1000
      })
    } else {
      if (type === 'post') {
        const imgs = await uploadImages(images.map(image => image.url))
        const data = await createPost({
          title,
          content,
          images: imgs || []
        })
        if (data) {
          const newData = addUserInfo(data)
          dispatch(addPost(newData))
          setSubmitButtonLoading(false)
          await Taro.showToast({
            title: '发帖成功',
            icon: 'success',
            duration: 1000
          })
          await sleep(1000)
          Taro.navigateBack()
        }
      } else {
        await addBoard({ content, title })
        await Taro.showToast({
          title: '发布公告成功',
          icon: 'success',
          duration: 1000
        })
        await sleep(1000)
        Taro.navigateBack()
      }
    }
    setSubmitButtonLoading(false)
  }, [title, content, images])

  const showImage = useVibrateCallback((url: string) => {
    Taro.previewImage({
      current: url,
      urls: images.map(image => image.url)
    })
  })

  return (
    <View>
      {showComponent && (
        <View className='input-wrap'>
          <Input
            name='title'
            type='text'
            placeholder={type === 'board' ? '公告标题' : '起个标题吧...'}
            value={title}
            onInput={e => setTitle(e.detail.value)}
            className='title'
          />
          <AtTextarea
            value={content}
            onChange={e => setContent(e)}
            maxLength={500}
            placeholder={type === 'board' ? '公告内容' : '畅所欲言吧...'}
            className='content'
            height={400}
          />
          {type === 'post' && (
            <AtImagePicker
              files={images}
              onChange={e => setImages(e)}
              onImageClick={(_, f: File) => showImage(f.url)}
              multiple
              count={9}
            />
          )}
          <View className='action-container'>
            <AtButton
              type='secondary'
              className='button'
              onClick={handleCancel}
            >
              取消
            </AtButton>
            <AtButton
              type='primary'
              className='button'
              onClick={handleSubmit}
              loading={submitButtonLoading}
            >
              发布
            </AtButton>
          </View>
        </View>
      )}
    </View>
  )
}
