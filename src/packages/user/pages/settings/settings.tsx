import { primaryColor } from '@/common/constants'
import { Switch, View } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import Taro from '@tarojs/taro'
import { changeIsVibrate, changeShowUserPost, deleteUser, getUserById, login } from '@/api/User'
import { sendNotice } from '@/api/Notice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setUser } from '@/redux/slice/userSlice'
import sleep from '@/utils/sleep'
import { setReview } from '@/redux/slice/reviewSlice'
import './settings.scss'
import '@/custom-theme.scss'
import { useState } from 'react'

export default function Settings() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const showComponent = useAppSelector(state => state.review.showComponent)

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
    const res = await Taro.showModal({
      title: '警告',
      content: '确定要清除缓存并重启小程序吗？'
    })
    if (!res.confirm) {
      return
    }
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

  const handleShowPrivacy = () => {
    // @ts-ignore
    wx.openPrivacyContract({
      success: () => {}
    })
  }

  const [switchShowPostDisabled, setSwitchShowPostDisabled] = useState(false)

  const handleShowPost = async () => {
    setSwitchShowPostDisabled(true)
    await changeShowUserPost()
    dispatch(setUser({ ...user, isOpen: !user.isOpen }))
    setSwitchShowPostDisabled(false)
  }

  const [switchVibrateDisabled, setSwitchVibrateDisabled] = useState(false)

  const handleChangeVibrate = async () => {
    setSwitchVibrateDisabled(true)
    await changeIsVibrate()
    dispatch(setUser({ ...user, isVibrate: !user.isVibrate }))
    setSwitchVibrateDisabled(false)
  }

  return (
    <View className='settings'>
      <View className='settings__lable'>常规设置</View>
      <AtList className='settings-list' hasBorder={false}>
        {!showComponent && user.role <= 1 && (
          <AtListItem
            className='item'
            title='一键解锁'
            arrow='right'
            hasBorder={false}
            iconInfo={{ value: 'lock', color: primaryColor }}
            onClick={handleUnlock}
          />
        )}
        <View className='settings__action'>
          <AtListItem
            className='item item--no-border'
            title='开启震动反馈'
            hasBorder={false}
            iconInfo={{ value: 'iphone', color: primaryColor }}
          />
          <Switch
            checked={user.isVibrate}
            color='#b70031'
            disabled={switchVibrateDisabled}
            onChange={handleChangeVibrate}
            className='settings__action__switch'
          />
        </View>
      </AtList>
      <View className='settings__lable'>隐私设置</View>
      <AtList className='settings-list' hasBorder={false}>
        <AtListItem
          className='item'
          title='隐私协议'
          arrow='right'
          hasBorder={false}
          iconInfo={{ value: 'bullet-list', color: primaryColor }}
          onClick={handleShowPrivacy}
        />
        <View className='settings__action'>
          <AtListItem
            className='item item--no-border'
            title='展示我的帖子'
            hasBorder={false}
            iconInfo={{ value: 'share-2', color: primaryColor }}
          />
          <Switch
            checked={user.isOpen}
            color='#b70031'
            disabled={switchShowPostDisabled}
            onChange={handleShowPost}
            className='settings__action__switch'
          />
        </View>
      </AtList>
      <View className='settings__lable'>关于「花狮喵」</View>
      <AtList className='settings-list' hasBorder={false}>
        <AtListItem
          className='item'
          title='关于我们'
          arrow='right'
          hasBorder={false}
          iconInfo={{ value: 'link', color: primaryColor }}
          onClick={() => {}}
        />
        <AtListItem
          className='item'
          title='加入我们'
          arrow='right'
          hasBorder={false}
          iconInfo={{ value: 'add-circle', color: primaryColor }}
          onClick={() => {}}
        />
        <AtListItem
          className='item item--no-border'
          title='意见反馈'
          arrow='right'
          hasBorder={false}
          iconInfo={{ value: 'help', color: primaryColor }}
          onClick={() => {}}
        />
      </AtList>
      <View className='settings__btn'>
        <View
          className='settings__button'
          onClick={handleDeleteUser}
        >
          注销账号
        </View>
        <View
          className='settings__button'
          onClick={handleRestart}
        >
          清除缓存并重启小程序
        </View>
      </View>
    </View>
  )
}
