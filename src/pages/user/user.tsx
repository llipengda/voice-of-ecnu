import { getUserStatistics } from '@/api/User'
import UserCard from '@/packages/user/components/UserCard/UserCard'
import UserList from '@/packages/user/components/UserList/UserList'
import { useAppSelector } from '@/redux/hooks'
import { UserStatistics } from '@/types/user'
import { View } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { useState } from 'react'

export default function User() {
  const user = useAppSelector(state => state.user)

  const [userStatistics, setUserStatistics] = useState<UserStatistics>({
    posts: 0,
    likes: 0,
    stars: 0
  })

  useDidShow(async () => {
    const data = await getUserStatistics()
    setUserStatistics(data)
  })

  return (
    <View>
      <UserCard userStatistics={userStatistics} user={user} isSelf />
      <UserList />
    </View>
  )
}
