import { backgroundColor, primaryColor } from './common/constants'

export default defineAppConfig({
  style: 'v2',
  pages: [
    'pages/home/home',
    'pages/message/message',
    'pages/user/user',
    'pages/error/error',
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
        iconPath: 'assets/home.drawio.png',
        selectedIconPath: 'assets/home_active.drawio.png',
      },
      {
        pagePath: 'pages/message/message',
        text: '消息',
        iconPath: 'assets/message.drawio.png',
        selectedIconPath: 'assets/message_active.drawio.png',
      },
      {
        pagePath: 'pages/user/user',
        text: '我的',
        iconPath: 'assets/user.drawio.png',
        selectedIconPath: 'assets/user_active.drawio.png',
      },
    ],
  },
  subpackages: [
    {
      root: 'packages/user',
      pages: [
        'pages/update/update',
        'pages/verify/verify',
        'pages/settings/settings',
      ],
    },
    {
      root: 'packages/post',
      pages: ['pages/search/search', 'pages/add/add', 'pages/detail/detail'],
    },
    {
      root: 'packages/message',
      pages: ['pages/noticeList/noticeList'],
    },
  ],
})
