import { View } from '@tarojs/components'
import './FloatLayout.scss'

interface IProps {
  isOpened: boolean
  onClose: () => void
  zIndex?: number
  title: string
  children?: JSX.Element | JSX.Element[] | never[]
}

export default function FloatLayout({
  isOpened,
  onClose,
  title,
  children,
  zIndex = 8000,
}: IProps) {
  return (
    <View
      className={isOpened ? 'float-layout active' : 'float-layout'}
      catchMove
      onTouchMove={e => e.stopPropagation()}
      style={{
        zIndex: zIndex,
      }}
    >
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
