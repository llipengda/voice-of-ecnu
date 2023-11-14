import { ITouchEvent, View } from '@tarojs/components'
import '@/custom-theme.scss'
import './MessageListItem.scss'

interface IProps {
  icon: string
  title: string
  number: number
  onClick?: (event: ITouchEvent) => void
}

export default function MessageListItem({
  icon,
  title,
  number,
  onClick
}: IProps) {
  return (
    <View className='message-list-item'>
      <View className='message-list-item__icon__wrap' onClick={onClick}>
        <View className={`message-list-item__icon at-icon at-icon-${icon}`} />
        {number > 0 && (
          <View className='message-list-item__more__num'>{number}</View>
        )}
      </View>
      <View className='message-list-item__content'>
        <View className='message-list-item__content__title'>{title}</View>
      </View>
    </View>
  )
}
