import { backgroundColor } from '@/common/constants'
import { View } from '@tarojs/components'
import { useRef, useState } from 'react'
import { AtSearchBar, AtSegmentedControl } from 'taro-ui'
import CPost from '@/packages/home/components/Post/Post'
import ListView from 'taro-listview'
import { getPostList } from '@/api/Post'
import { Post } from 'types/post'
import './home.scss'
import Taro from '@tarojs/taro'

export default function Home() {
  const [searchText, setSearchText] = useState('')

  const [selected, setSelected] = useState(0)

  const [isLoaded, setIsLoaded] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])

  const [scrollTop, setScrollTop] = useState(0)

  const handleSearchClick = () => {
    Taro.navigateTo({
      url: `/packages/home/pages/home/search/search?key=${searchText}`
    })
  }

  const index = useRef(1)

  const handleScrollToLower = async () => {
    const data = await getPostList(++index.current, 5, selected === 1)
    setPosts([...posts, ...data])
    setHasMore(data.length > 0)
  }

  const handlePullDownRefresh = async () => {
    index.current = 1
    const data = await getPostList(index.current, 5, selected === 1)
    setPosts(data)
    setIsLoaded(true)
    setHasMore(data.length > 0)
  }

  return (
    <View style={{ width: '100%' }}>
      <AtSearchBar
        value={searchText}
        onChange={e => setSearchText(e)}
        onActionClick={handleSearchClick}
        customStyle={{ background: backgroundColor, color: '#fff' }}
      />
      <AtSegmentedControl
        values={['最新', '热门']}
        current={selected}
        onClick={i => {
          setSelected(i)
          handlePullDownRefresh()
          setScrollTop(0)
        }}
      />
      <View className='skeleton'>
        {/* @ts-ignore */}
        <ListView
          isLoaded={isLoaded}
          hasMore={hasMore}
          style={{ height: '88vh', width: '100%', overflowX: 'hidden' }}
          onPullDownRefresh={handlePullDownRefresh}
          onScrollToLower={handleScrollToLower}
          onScroll={e => setScrollTop(e.detail.scrollTop)}
          scrollTop={scrollTop}
          needInit
        >
          {posts.map(p => (
            <CPost post={p} key={p.id} />
          ))}
        </ListView>
      </View>
    </View>
  )
}
