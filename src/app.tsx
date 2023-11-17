import { Fragment, PropsWithChildren, useEffect } from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'
import Taro, { useError } from '@tarojs/taro'
import { login, getUserById, checkLogin } from './api/User'
import { setLoginInfo, setToken, setUserId } from './redux/slice/loginSlice'
import { setUser } from './redux/slice/userSlice'
import { useAppDispatch } from './redux/hooks'
import interceptor from './utils/interceptor'
import { checkNotice } from './api/Notice'
import './custom-theme.scss'
import { setNoticeCnt } from './redux/slice/noticeSlice'

function MyApp({ children }: PropsWithChildren<any>) {
  const dispatch = useAppDispatch()

  const tryLogin = async (
    needLogin: boolean,
    userId: string,
    token: string
  ) => {
    if (process.env.TARO_ENV !== 'weapp') {
      dispatch(
        setLoginInfo({
          userId: 'ojr-_60HXuBMPyzOuFUPvgSyTEkE',
          token: '500a22dd-db6b-4fcf-a147-e0b43fa81c30',
          role: 4
        })
      )
      Taro.setStorageSync('userId', 'ojr-_60HXuBMPyzOuFUPvgSyTEkE')
      Taro.setStorageSync('token', '500a22dd-db6b-4fcf-a147-e0b43fa81c30')
      return
    }
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
      Taro.hideLoading()
      await Taro.showToast({
        title: '登录成功',
        icon: 'success'
      })
    } catch (err) {
      console.error(err)
      await Taro.showToast({
        title: '登录失败',
        icon: 'error'
      })
    }
  }

  const getNoticeCnt = async () => {
    const data = await checkNotice()
    dispatch(setNoticeCnt(data))
    if (data.total === 0) {
      try {
        await Taro.hideTabBarRedDot({
          index: 1
        })
      } catch (err) {
        console.log(err)
      }
      return
    }
    try {
      Taro.setTabBarBadge({
        index: 1,
        text: data.total > 99 ? '99+' : data.total.toString()
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    Taro.addInterceptor(Taro.interceptors.logInterceptor)
    Taro.addInterceptor(Taro.interceptors.timeoutInterceptor)
    Taro.addInterceptor(interceptor)
  }, [])

  useEffect(() => {
    ;(async () => {
      await Taro.showLoading({ title: '登录中' })
      const token = Taro.getStorageSync('token')
      let userId = Taro.getStorageSync('userId')
      const needLogin = !((await checkLogin()) && token && userId)
      console.log('needLogin', needLogin)
      await tryLogin(needLogin, userId, token)
      await getNoticeCnt()
    })()
  }, [])

  return <Fragment>{children}</Fragment>
}

function App({ children }: PropsWithChildren<any>) {
  if (process.env.TARO_ENV === 'weapp') {
    Taro.showShareMenu({
      withShareTicket: true,
      // @ts-ignore
      menus: ['shareAppMessage', 'shareTimeline'],
      showShareItems: ['shareAppMessage', 'shareTimeline']
    })

    const page = Taro.getCurrentInstance().page
    if (page && !page.onShareAppMessage) {
      page.onShareAppMessage = () => {
        return {
          title: '花狮喵'
        }
      }
    }
  }

  useError(err => {
    console.error('UNHANDLED ERROR', err)
    if (Taro.getCurrentInstance().router?.path === '/pages/error/error') {
      return
    }
    Taro.redirectTo({
      url: '/pages/error/error?errorCode=-1'
    })
  })

  return (
    <Provider store={store}>
      <MyApp children={children} />
    </Provider>
  )
}

export default App
