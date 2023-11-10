import { primaryColor } from '@/common/constants'
import { View } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import Taro from '@tarojs/taro'
import { deleteUser, getUserById, login } from '@/api/User'
import { sendNotice } from '@/api/Notice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setUser } from '@/redux/slice/userSlice'
import sleep from '@/utils/sleep'
import './settings.scss'
import { setReview } from '@/redux/slice/reviewSlice'

export default function Settings() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)

  const handleDeleteUser = async () => {
    const res = await Taro.showModal({
      title: '警告',
      content: '确定要注销账号吗？如果您点击确定，我们将彻底删除您的账号信息。'
    })
    if (res.confirm) {
      await Taro.showLoading({ title: '正在注销账号...' })
      const data = await deleteUser()
      if (!data) {
        Taro.hideLoading()
        return
      }
      await sendNotice('您已注销账号', user.id)
      const newUser = await getUserById(user.id)
      dispatch(setUser(newUser))
      const code = await Taro.login()
      await login(code.code)
      Taro.hideLoading()
      await Taro.showToast({
        title: '注销成功',
        icon: 'success',
        duration: 1000
      })
      await sleep(1000)
      await Taro.navigateBack()
    }
  }

  const handleRestart = async () => {
    await Taro.clearStorage()
    await Taro.reLaunch({
      url: '/pages/home/home'
    })
  }

  const handleUnlock = async () => {
    dispatch(setReview(true))
    await Taro.showToast({
      title: '解锁成功',
      icon: 'success',
      duration: 1000
    })
    await sleep(1000)
    await Taro.navigateBack()
  }

  return (
    <View className='settings'>
      <AtList className='settings-list' hasBorder={false}>
        {user.role <= 1 && (
          <AtListItem
            className='item'
            title='一键解锁'
            arrow='right'
            hasBorder={false}
            iconInfo={{ value: 'lock', color: primaryColor }}
            onClick={handleUnlock}
          />
        )}
        <AtListItem
          className='item'
          title='注销账号'
          arrow='right'
          hasBorder={false}
          iconInfo={{ value: 'close-circle', color: primaryColor }}
          onClick={handleDeleteUser}
        />
        <AtListItem
          className='item'
          title='清除缓存并重启小程序'
          arrow='right'
          hasBorder={false}
          iconInfo={{ value: 'reload', color: primaryColor }}
          onClick={handleRestart}
        />
      </AtList>
    </View>
  )
}
