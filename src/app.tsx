import { Fragment, PropsWithChildren, useEffect } from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'
import Taro from '@tarojs/taro'
import { login, getUserById, checkLogin } from './api/User'
import { setLoginInfo, setToken, setUserId } from './redux/slice/loginSlice'
import { setUser } from './redux/slice/userSlice'
import { useAppDispatch } from './redux/hooks'
import interceptor from './utils/interceptor'
import './custom-theme.scss'

function MyApp({ children }: PropsWithChildren<any>) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    Taro.addInterceptor(Taro.interceptors.logInterceptor)
    Taro.addInterceptor(Taro.interceptors.timeoutInterceptor)
    Taro.addInterceptor(interceptor)
  }, [])

  useEffect(() => {
    ;(async () => {
      Taro.showLoading({ title: '登录中' })
      const token = Taro.getStorageSync('token')
      let userId = Taro.getStorageSync('userId')
      const needLogin = !((await checkLogin()) && token && userId)
      console.log('needLogin', needLogin)
      try {
        if (needLogin) {
          const { code } = await Taro.login()
          const info = await login(code)
          dispatch(setLoginInfo(info!))
          userId = info!.userId
        } else {
          dispatch(setToken(token))
          dispatch(setUserId(userId))
        }
        const user = await getUserById(userId)
        dispatch(setUser(user!))
        Taro.showToast({
          title: '登录成功',
          icon: 'success',
        })
      } catch (err) {
        console.error(err)
        Taro.showToast({
          title: '登录失败',
          icon: 'error',
        })
      } finally {
        Taro.hideLoading()
      }
    })()
  }, [])

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
