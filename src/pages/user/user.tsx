import UserCard from '@/components/UserCard/UserCard'
import UserList from '@/components/UserList/UserList'
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
