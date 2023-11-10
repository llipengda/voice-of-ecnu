import { Image, View, Text } from '@tarojs/components'
import { useAppSelector } from '@/redux/hooks'
import Taro from '@tarojs/taro'
import { defaultAvatar } from '@/common/constants'
import male from '@/assets/male.drawio.svg'
import famale from '@/assets/famale.drawio.svg'
import { User, UserStatistics } from '@/types/user'
import '@/custom-theme.scss'
import './UserCard.scss'
import { AtIcon } from 'taro-ui'
import { checkBan } from '@/utils/dateConvert'

export default function UserCard({
  userStatistics,
  user,
  isSelf
}: {
  userStatistics: UserStatistics
  user: User
  isSelf: boolean
}) {
  const showComponent = useAppSelector(state => state.review.showComponent)

  const displayGender = () => {
    switch (user.gender) {
      case 1:
      case 2:
        return (
          <Image
            fadeIn
            lazyLoad
            src={user.gender == 1 ? male : famale}
            className='gender'
          />
        )
      default:
        return <></>
    }
  }

  const handleClickAvatar = async () => {
    if (isSelf) {
      return
    }
    await Taro.previewImage({
      current: user.avatar || defaultAvatar,
      urls: [user.avatar || defaultAvatar]
    })
  }

  const path = Taro.getCurrentInstance().router?.path || ''

  return (
    <View className='user-card'>
      {checkBan(user.bannedBefore || null) && (
        <View
          className='at-row'
          style={{
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF4949',
            background: '#FFE7E7',
            paddingTop: '5px',
            paddingBottom: '5px',
            borderRadius: '10px',
            fontWeight: 700,
            marginTop: '-10px'
          }}
        >
          <AtIcon value='blocked' size='20' color='#FF4949' />
          <Text style={{ marginLeft: '5px' }}>
            用户封禁中
            {path === '/pages/user/user' && isSelf
              ? ` - 您被封禁至 ${user.bannedBefore?.substring(0, 10)}`
              : ''}
          </Text>
        </View>
      )}
      <View
        className='at-row'
        onClick={() => {
          if (!isSelf) {
            return
          }
          Taro.navigateTo({ url: '/packages/user/pages/update/update' })
        }}
      >
        <View className='at-col at-col-5'>
          <Image
            fadeIn
            lazyLoad
            src={user.avatar || defaultAvatar}
            className='avatar'
            onClick={handleClickAvatar}
          />
        </View>
        <View className='at-col at-col-7 at-col__align--center'>
          <View className='at-row'>
            <Text className='user-name'>
              {user.name.length <= 5 ||
              !user.name.includes('用户') ||
              !/^[A-Za-z0-9]+$/.test(user.name)
                ? user.name.substring(0, 8) +
                  (user.name.length <= 8 ? '' : '...')
                : user.name.substring(0, 5) + '...'}
            </Text>
            {displayGender()}
            {path === '/pages/user/user' &&
              isSelf &&
              (user.role <= 2 ? (
                <Text className='verify-ok'>已认证</Text>
              ) : (
                <Text className='verify-fault'>未认证</Text>
              ))}
          </View>
          <View className='at-row'>
            <Text className='user-major' style={{ whiteSpace: 'pre-wrap' }}>
              {user.major ? (user.major == '不显示' ? '' : user.major) : ''}
            </Text>
          </View>
          <View className='at-row'>
            <View style={{ whiteSpace: 'pre-wrap' }}>
              {user.status?.substring(0, 30) || '这个人很懒，什么也没有留下。'}
              {(user.status?.length || 0) >= 30 && '...'}
            </View>
          </View>
        </View>
      </View>
      <View className='at-row grid'>
        <View
          className='at-col grid-text'
          onClick={() => {
            if (!isSelf) {
              return
            }
            Taro.navigateTo({
              url: '/packages/message/pages/noticeList/noticeList?type=1'
            })
          }}
        >
          <View className='count'>{userStatistics.likes}</View>
          <View>获赞</View>
        </View>
        <View
          className='at-col grid-text'
          onClick={() => {
            if (!isSelf) {
              return
            }
            Taro.navigateTo({
              url: '/packages/post/pages/my/my?type=post'
            })
          }}
        >
          <View className='count'>{userStatistics.posts}</View>
          <View>
            {isSelf ? '我的' : 'TA的'}
            {showComponent && '贴子'}
          </View>
        </View>
        {isSelf && (
          <View
            className='at-col grid-text'
            onClick={() => {
              Taro.navigateTo({
                url: '/packages/post/pages/my/my?type=star'
              })
            }}
          >
            <View className='count'>{userStatistics.stars}</View>
            <View>我的收藏</View>
          </View>
        )}
      </View>
    </View>
  )
}
