import { Board } from '@/types/notice'
import { View } from '@tarojs/components'
import './BoardCard.scss'

interface IBoardCardProps {
  board: Board
}

export default function BoardCard({ board }: IBoardCardProps) {
  return (
    <View className='board-card'>
      <View className='board-card__title'>{board.title}</View>
      <View className='board-card__content'>
        {board.content.split('\n').map(c => (
          <View>{c}</View>
        ))}
      </View>
    </View>
  )
}
