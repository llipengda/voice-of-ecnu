import { backgroundColor, primaryColor } from './common/constants'

export default defineAppConfig({
  style: 'v2',
  pages: [
    'pages/home/home',
    'pages/user/user',
    'pages/message/message',
    'pages/user/update/update',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: backgroundColor,
    navigationBarTitleText: '花狮之声',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#000',
    selectedColor: primaryColor,
    backgroundColor: backgroundColor,
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/home',
        text: '首页',
        iconPath: 'assets/home.png',
        selectedIconPath: 'assets/home_active.png',
      },
      {
        pagePath: 'pages/message/message',
        text: '消息',
        iconPath: 'assets/message.png',
        selectedIconPath: 'assets/message_active.png',
      },
      {
        pagePath: 'pages/user/user',
        text: '我的',
        iconPath: 'assets/user.png',
        selectedIconPath: 'assets/user_active.png',
      },
    ],
  },
})
