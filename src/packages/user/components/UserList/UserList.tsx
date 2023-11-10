import { AtList, AtListItem } from 'taro-ui'
import { primaryColor } from '@/common/constants'
import Taro from '@tarojs/taro'
import '@/custom-theme.scss'
import './UserList.scss'

export default function UserList() {
  const navigateTo = (name: string) => {
    Taro.navigateTo({ url: `/packages/user/pages/${name}/${name}` })
  }

  return (
    <AtList className='user-list' hasBorder={false}>
      <AtListItem
        className='item'
        title='修改个人信息'
        arrow='right'
        hasBorder={false}
        iconInfo={{ value: 'edit', color: primaryColor }}
        onClick={() => navigateTo('update')}
      />
      <AtListItem
        className='item'
        title='用户认证'
        arrow='right'
        hasBorder={false}
        iconInfo={{ value: 'user', color: primaryColor }}
        onClick={() => navigateTo('verify')}
      />
      <AtListItem
        className='item'
        title='更多选项'
        arrow='right'
        hasBorder={false}
        iconInfo={{ value: 'settings', color: primaryColor }}
        onClick={() => navigateTo('settings')}
      />
    </AtList>
  )
}
