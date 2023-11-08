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

export default function Settings() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)

  const handleDeleteUser = async () => {
    const res = await Taro.showModal({
      title: '警告',
      content: '确定要注销用户吗？如果您点击确定，我们将彻底删除您的用户信息。'
    })
    if (res.confirm) {
      await Taro.showLoading({ title: '正在注销用户...' })
      await deleteUser()
      await sendNotice('您已注销用户', user.id)
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

  return (
    <View className='settings'>
      <AtList className='settings-list' hasBorder={false}>
        <AtListItem
          className='item'
          title='注销用户'
          arrow='right'
          hasBorder={false}
          iconInfo={{ value: 'close-circle', color: primaryColor }}
          onClick={handleDeleteUser}
        />
      </AtList>
    </View>
  )
}
