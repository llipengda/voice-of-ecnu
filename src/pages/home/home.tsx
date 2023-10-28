import { backgroundColor } from '@/common/constants'
import { View } from '@tarojs/components'
import { useRef, useState } from 'react'
import { AtFab, AtSearchBar, AtSegmentedControl } from 'taro-ui'
import CPost from '@/packages/post/components/Post/Post'
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
  const [isEmpty, setIsEmpty] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])

  const handleSearchClick = () => {
    Taro.navigateTo({
      url: `/packages/post/pages/home/search/search?key=${searchText}`,
    })
  }

  const index = useRef(1)

  const handleScrollToLower = async () => {
    const data = await getPostList(++index.current, 5, selected === 1)
    setPosts([...posts, ...data])
    setHasMore(data.length > 0)
    setIsEmpty(data.length === 0)
  }

  const handlePullDownRefresh = async () => {
    index.current = 1
    const data = await getPostList(index.current, 5, selected === 1)
    setPosts(data || [])
    setIsLoaded(true)
    setHasMore(data.length > 0)
    setIsEmpty(data.length === 0)
  }

  const handleOnclickPullDownRefresh = async () => {
    setPosts([])
    setIsEmpty(false)
    index.current = 1
    const data = await getPostList(index.current, 5, selected === 0)
    setPosts(data)
    setIsLoaded(true)
    setHasMore(data.length > 0)
  }

  const handleRemovePost = (id: number) => {
    setPosts(posts.filter(p => p.id !== id))
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
          handleOnclickPullDownRefresh()
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
          needInit
        >
          {posts.map(p => (
            <CPost
              post={p}
              key={p.id}
              onRemove={() => handleRemovePost(p.id)}
            />
          ))}
          {isEmpty && <View className='tip2'>没有更多内容</View>}
        </ListView>
      </View>
      <View style={{ position: 'fixed', bottom: '16px', right: '16px' }}>
        <AtFab
          onClick={() => {
            Taro.navigateTo({
              url: '/packages/post/pages/home/add/add',
            })
          }}
        >
          <View className='at-fab__icon at-icon at-icon-add' />
        </AtFab>
      </View>
    </View>
  )
}
