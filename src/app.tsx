import { Fragment, PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'
import Taro, { useLaunch } from '@tarojs/taro'
import { login, getUserById } from './api/User'
import { setLoginInfo } from './redux/slice/loginSlice'
import { setUser } from './redux/slice/userSlice'
import { useAppDispatch } from './redux/hooks'
import './custom-theme.scss'
import interceptor from './utils/interceptor'

function MyApp({ children }: PropsWithChildren<any>) {
  const dispatch = useAppDispatch()

  useLaunch(async () => {
    Taro.addInterceptor(Taro.interceptors.logInterceptor)
    Taro.addInterceptor(Taro.interceptors.timeoutInterceptor)
    Taro.addInterceptor(interceptor)
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

  return <Fragment>{children}</Fragment>
}

function App({ children }: PropsWithChildren<any>) {
  return (
    <Provider store={store}>
      <MyApp children={children} />
    </Provider>
  )
}

export default App
