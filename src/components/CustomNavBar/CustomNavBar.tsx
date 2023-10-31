import { View, Text } from '@tarojs/components'
import { getNavHeight, getTitleBottomHeight } from '@/utils/navbar'
import { AtTabs } from 'taro-ui'
import './CustomNavBar.scss'

interface CustomNavBarProps {
  title?: string
  showTabs?: boolean
  tabList?: { title: string }[]
  tabIndex?: number
  onSwitchTab?: (index: number) => void
}

export default function CustomNavBar({ title, showTabs, tabList, tabIndex, onSwitchTab }: CustomNavBarProps) {
  const _onSwitchTab = onSwitchTab || ((_: number) => {})

  return (
    <View
      style={{
        height: `${getNavHeight()}Px`,
      }}
      className='custom-nav-bar'
    >
      <View
        className='custom-nav-bar__header'
        style={{ bottom: `${getTitleBottomHeight()}Px` }}
      >
        <Text className='custom-nav-bar__header__title'>{title}</Text>
        {showTabs && (
          <AtTabs
            current={tabIndex!}
            onClick={i => _onSwitchTab(i)}
            tabList={tabList!}
            className='custom-nav-bar__header__tabs'
          />
        )}
      </View>
    </View>
  )
}
