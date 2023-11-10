import { getUserById, getUserStatistics } from '@/api/User'
import UserCard from '@/packages/user/components/UserCard/UserCard'
import UserList from '@/packages/user/components/UserList/UserList'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setUser } from '@/redux/slice/userSlice'
import { UserStatistics } from '@/types/user'
import { View } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import { useState } from 'react'

export default function User() {
  const user = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()

  const [userStatistics, setUserStatistics] = useState<UserStatistics>({
    posts: 0,
    likes: 0,
    stars: 0
  })

  useDidShow(async () => {
    const data = await getUserStatistics()
    setUserStatistics(data)
  })

  useDidShow(async () => {
    const data = await getUserById(user.id)
    dispatch(setUser(data))
  })

  return (
    <View>
      <UserCard userStatistics={userStatistics} user={user} isSelf />
      <UserList />
    </View>
  )
}
