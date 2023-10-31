import { View } from '@tarojs/components'
import './FloatLayout.scss'

interface IProps {
  isOpened: boolean
  onClose: () => void
  title: string
  children?: JSX.Element
}

export default function FloatLayout({
  isOpened,
  onClose,
  title,
  children,
}: IProps) {
  return (
    <View className={isOpened ? 'float-layout active' : 'float-layout'}>
      <View className='float-layout__overlay' onClick={onClose} />
      <View className='float-layout__container layout'>
        <View className='layout-header  xmg-border-b'>
          {title}
          <View className='at-icon at-icon-close close-img' onClick={onClose} />
        </View>
        <View className='layout-body'>{children}</View>
      </View>
    </View>
  )
}
