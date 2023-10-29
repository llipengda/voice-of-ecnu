import Taro from '@tarojs/taro'

export const getNavHeight = () => {
  const menuButtonObject = Taro.getMenuButtonBoundingClientRect()
  const sysinfo = Taro.getSystemInfoSync()
  const statusBarHeight = sysinfo.statusBarHeight!
  const menuBottonHeight = menuButtonObject.height
  const menuBottonTop = menuButtonObject.top
  const navBarHeight =
    statusBarHeight + menuBottonHeight + (menuBottonTop - statusBarHeight) * 2
  return navBarHeight
}

export const getTitleBottomHeight = () => {
  const menuButtonObject = Taro.getMenuButtonBoundingClientRect()
  const menuBottonHeight = menuButtonObject.height
  const titleBottom = menuBottonHeight / 2
  return titleBottom - 10
}
