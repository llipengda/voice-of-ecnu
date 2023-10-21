import UserCard from '@/package_user/components/UserCard/UserCard'
import UserList from '@/package_user/components/UserList/UserList'
import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'

export default function User() {
  useLoad(() => {
    console.log('Page loaded in Me.')
  })

  return (
    <View>
      <UserCard />
      <UserList />
    </View>
  )
}
