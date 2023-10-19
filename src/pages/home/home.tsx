import { login, getUserById } from '@/api/User'
import { useAppDispatch } from '@/redux/hooks'
import { setLoginInfo } from '@/redux/slice/loginSlice'
import { setUser } from '@/redux/slice/userSlice'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { AtButton } from 'taro-ui'

export default function Home() {
  const dispatch = useAppDispatch()

  useLoad(async () => {
    try {
      Taro.showLoading({ title: '登录中' })
      const { code } = await Taro.login()
      const info = await login(code)
      dispatch(setLoginInfo(info!))
      const user = await getUserById(info!.userId)
      dispatch(setUser(user!))
      Taro.showToast({
        title: '登录成功',
        icon: 'success',
      })
    } catch (err) {
      Taro.showToast({
        title: '登录失败',
        icon: 'error',
      })
    } finally {
      Taro.hideLoading()
    }
  })

  const [count, setCount] = useState(0)

  return (
    <View>
      <View style={{ textAlign: 'center' }}>clicked {count} times</View>
      <AtButton
        onClick={() => setCount(count => count + 1)}
        type='primary'
        size='small'
      >
        cilck me
      </AtButton>
    </View>
  )
}
