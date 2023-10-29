import Taro, { useLoad } from '@tarojs/taro'
import { getPostById } from '@/api/Post'
import { View, Image } from '@tarojs/components'
import { useState } from 'react'
import './detail.scss'
import { AtAvatar } from 'taro-ui'

export default function detail() {
  const postId = Taro.getCurrentInstance().router?.params?.postId
  const authorName = Taro.getCurrentInstance().router?.params?.authorName
  const authorAvatar = Taro.getCurrentInstance().router?.params?.authorAvatar

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [createAt, setCreateAt] = useState('')

  useLoad(async () => {
    const data = await getPostById(postId!)
    setTitle(data.title)
    setContent(data.content)
    setImages(data.images)
    setCreateAt(data.createAt)
  })

  return (
    <View className='post-detail'>
      <View className='post-detail__title'>{title || '加载中...'}</View>
      <View className='at-row'>
        <AtAvatar
          circle
          image={authorAvatar}
          className='post-detail__avatar'
          size='small'
        />
        <View className='at-col'>
          <View className='post-detail__author at-row'>{authorName}</View>
          <View className='post-detail__create-at at-row'>{createAt}</View>
        </View>
      </View>
      <View className='post-detail__content'>{content}</View>
      <View className='post-detail__images'>
        {images.map(image => (
          <Image
            src={image}
            key={image}
            mode='aspectFit'
            className='post-detail__image'
          />
        ))}
      </View>
    </View>
  )
}
