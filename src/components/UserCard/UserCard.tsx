import { Image, View, Text } from '@tarojs/components'
import '../../custom-theme.scss'
import './UserCard.scss'
import { User } from 'types/user'

export default function UserCard({ user }: { user: User }) {
  return (
    <View>
      <View className='user-card'>
        <View className='at-row'>
          <View className='at-col at-col-5'>
            <Image src={user.avatar} className='avatar' />
          </View>
          <View className='at-col at-col-7 at-col__align--center'>
            <View className='at-row'>
              <Text className='user-name'>{user.name}</Text>
              {user.role <= 2 ? (
                <Text className='verify-ok'>已认证</Text>
              ) : (
                <Text className='verify-fault'>未认证</Text>
              )}
            </View>
            <View className='at-row'>
              <Text className='user-major'>{user.major || '未知专业'}</Text>
            </View>
            <View className='at-row'>
              <View style={{ whiteSpace: 'pre-wrap' }}>
                {user.status?.substring(0, 30) || '这个人很懒，什么也没有留下'}
                {(user.status?.length || 0) >= 30 && '...'}
              </View>
            </View>
          </View>
        </View>
        <View className='at-row grid'>
          <View className='at-col grid-text'>
            <View className='count'>10</View>
            <View>获赞数量</View>
          </View>
          <View className='at-col grid-text'>
            <View className='count'>5</View>
            <View>我的贴子</View>
          </View>
          <View className='at-col grid-text'>
            <View className='count'>158</View>
            <View>我的收藏</View>
          </View>
        </View>
      </View>
    </View>
  )
}
