import Taro from '@tarojs/taro'

/**
 * 获取导航栏高度
 * @returns 导航栏高度
 */
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

/**
 * 获取标题底部高度
 * @returns 标题底部高度
 */
export const getTitleBottomHeight = () => {
  const menuButtonObject = Taro.getMenuButtonBoundingClientRect()
  const menuBottonHeight = menuButtonObject.height
  const titleBottom = menuBottonHeight / 2
  return titleBottom - 10
}
