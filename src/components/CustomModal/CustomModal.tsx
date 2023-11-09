import { View, Text } from '@tarojs/components'
import React from 'react'
import './CustomModal.scss'

interface ICustomModalProps {
  isOpen: boolean
  onCancle: () => void
  onConfirm: () => void
  title: string
  children: React.ReactNode
  customCancelText?: string
  customConfirmText?: string
}

const CustomModal: React.FC<ICustomModalProps> = ({
  isOpen,
  onCancle,
  onConfirm,
  title,
  children,
  customCancelText = '取消',
  customConfirmText = '确认'
}) => {
  if (!isOpen) {
    return null
  }

  return (
    <View className='custom-modal'>
      <View className='custom-modal__wrapper'>
        <View className='custom-modal__header'>
          <Text>{title}</Text>
        </View>
        <View className='custom-modal__content'>{children}</View>
        <View className='custom-modal__footer'>
          <View className='custom-modal__btn' onClick={onCancle}>
            {customCancelText}
          </View>
          <View className='custom-modal__btn' onClick={onConfirm}>
            {customConfirmText}
          </View>
        </View>
      </View>
    </View>
  )
}

export default CustomModal
