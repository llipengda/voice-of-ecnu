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
      <UserCard
        user={{
          id: '11',
          role: 2,
          email: '',
          name: '张三',
          avatar: 'https://taro-ui.jd.com/img/logo-taro.png',
          status: '凡事都有偶然的凑巧，结果却又如宿命的必然。',
          createdAt: new Date(),
        }}
      />
      <UserList />
    </View>
  )
}
