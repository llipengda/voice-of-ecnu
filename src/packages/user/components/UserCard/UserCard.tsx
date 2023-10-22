import { Image, View, Text } from '@tarojs/components'
import { useAppSelector } from '@/redux/hooks'
import Taro from '@tarojs/taro'
import { defaultAvatar } from '@/common/constants'
import male from '@/assets/male.drawio.svg'
import famale from '@/assets/famale.drawio.svg'
import '@/custom-theme.scss'
import './UserCard.scss'

export default function UserCard() {
  const user = useAppSelector(state => state.user)

  const displayGender = () => {
    switch (user.gender) {
      case 1:
      case 2:
        return (
          <Image src={user.gender == 1 ? male : famale} className='gender' />
        )
      default:
        return <></>
    }
  }

  return (
    <View className='user-card'>
      <View
        className='at-row'
        onClick={() =>
          Taro.navigateTo({ url: '/packages/user/pages/user/update/update' })
        }
      >
        <View className='at-col at-col-5'>
          <Image src={user.avatar || defaultAvatar} className='avatar' />
        </View>
        <View className='at-col at-col-7 at-col__align--center'>
          <View className='at-row'>
            <Text className='user-name'>
              {user.name.length <= 5 ||
              !user.name.includes('用户') ||
              !/^[A-Za-z0-9]+$/.test(user.name)
                ? user.name.substring(0, 8) + '...'
                : user.name.substring(0, 5) + '...'}
            </Text>
            {displayGender()}
            {user.role <= 2 ? (
              <Text className='verify-ok'>已认证</Text>
            ) : (
              <Text className='verify-fault'>未认证</Text>
            )}
          </View>
          <View className='at-row'>
            <Text className='user-major' style={{ whiteSpace: 'pre-wrap' }}>
              {user.major ? (user.major == '不显示' ? '' : user.major) : ''}
            </Text>
          </View>
          <View className='at-row'>
            <View style={{ whiteSpace: 'pre-wrap' }}>
              {user.status?.substring(0, 30) || '这个人很懒，什么也没有留下。'}
              {(user.status?.length || 0) >= 30 && '...'}
            </View>
          </View>
        </View>
      </View>
      <View className='at-row grid'>
        <View className='at-col grid-text'>
          <View className='count'>10</View>
          <View>获赞</View>
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
  )
}
