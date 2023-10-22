import { backgroundColor } from '@/common/constants'
import { View } from '@tarojs/components'
import { useState } from 'react'
import { AtSearchBar } from 'taro-ui'
import CPost from '@/packages/home/components/Post/Post'
import './home.scss'

const post1 = {
  id: 1,
  title: '尼玛思乐',
  content:
    '我真是草死你的亲妈了尼玛真是个hi四u警方第四部分上的人覆盖看过喝热水过热i一个导入格式冈让二发热病人部分人热罚款我办法让让发布人非把尽快把福建人三百放假啊是日本部分国家让部分金卡日本国金融保护局不兼容三百不然就哭吧噶人举报机构法人吧结果卡不然就阿克巴加班费噶尽快把就哈比就不放假啊部分就哈比飞机哈日发布人就哈比复活节然后放入花椒粉红佳人',
  userId: 'ojr-_60HXuBMPyzOuFUPvgSyTEkE',
  createAt: new Date().toLocaleString(),
  updateAt: new Date().toLocaleString(),
  comments: 0,
  images: [
    'https://www.xiaowu.fun/static/1.jpg',
    'https://www.xiaowu.fun/static/1.jpg',
    'https://www.xiaowu.fun/static/1.jpg',
    'https://www.xiaowu.fun/static/1.jpg',
    'https://www.xiaowu.fun/static/1.jpg',
  ],
  likes: 0,
  stars: 0,
  views: 0,
}

export default function Home() {
  const [searchText, setSearchText] = useState('')

  const handleSearchClick = () => {
    console.log('searchText', searchText)
  }

  return (
    <View>
      {/* <AtSearchBar
        value={searchText}
        onChange={e => setSearchText(e)}
        onActionClick={handleSearchClick}
        customStyle={{ background: backgroundColor, color: '#fff' }}
      />
      <CPost post={post1} />
      <CPost post={post1} /> */}
    </View>
  )
}
