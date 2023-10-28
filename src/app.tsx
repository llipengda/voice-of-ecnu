import { Fragment, PropsWithChildren, useEffect } from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'
import Taro from '@tarojs/taro'
import { login, getUserById, checkLogin } from './api/User'
import { setLoginInfo } from './redux/slice/loginSlice'
import { setUser } from './redux/slice/userSlice'
import { useAppDispatch } from './redux/hooks'
import './custom-theme.scss'
import interceptor from './utils/interceptor'

function MyApp({ children }: PropsWithChildren<any>) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    Taro.addInterceptor(Taro.interceptors.logInterceptor)
    Taro.addInterceptor(Taro.interceptors.timeoutInterceptor)
    Taro.addInterceptor(interceptor)
  }, [])

  useEffect(() => {
    ;(async () => {
      const needLogin = !(
        (await checkLogin()) &&
        Taro.getStorageSync('userId') &&
        Taro.getStorageSync('token')
      )
      console.log(needLogin)
      try {
        Taro.showLoading({ title: '登录中' })
        if (needLogin) {
          const { code } = await Taro.login()
          const info = await login(code)
          dispatch(setLoginInfo(info!))
        }
        const user = await getUserById(
          (
            await Taro.getStorage({ key: 'userId' })
          ).data
        )
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
