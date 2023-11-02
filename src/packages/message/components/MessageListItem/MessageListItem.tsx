import { ITouchEvent, View } from '@tarojs/components'
import '@/custom-theme.scss'
import './MessageListItem.scss'

interface IProps {
  icon: string
  title: string
  describe: string
  number: number
  onClick?: (event: ITouchEvent) => void
}

export default function MessageListItem({
  icon,
  title,
  describe,
  number,
  onClick
}: IProps) {
  return (
    <View className='message-list-item'>
      <View className='at-row' onClick={onClick}>
        <View className={`message-list-item__icon at-icon at-icon-${icon}`} />
        <View className='message-list-item__content'>
          <View className='message-list-item__content__title'>{title}</View>
          {number > 0 && (
            <View className='message-list-item__content__desc'>{describe}</View>
          )}
        </View>
        <View className='message-list-item__more'>
          {number > 0 && (
            <View className='message-list-item__more__num'>{number}</View>
          )}
          <View className='message-list-item__more__icon at-icon at-icon-chevron-right' />
        </View>
      </View>
    </View>
  )
}
