import { View, Image } from '@tarojs/components'
import { useAppSelector } from '@/redux/hooks'
import verifyOk from '@/assets/verify_ok.drawio.svg'
import verifyFailed from '@/assets/verify_failed.drawio.svg'
import './VerifyForm.scss'
import '@/custom-theme.scss'

export default function VerifyForm() {
  const user = useAppSelector(state => state.user)

  const verified = user.role <= 2

  return (
    <View className='verify-form'>
      <View className='image-warp'>
        <Image
          src={verified ? verifyOk : verifyFailed}
          className='status-image'
          style={{ marginLeft: verified ? '30px' : '0' }}
        />
      </View>
      <View
        className='title'
        style={{ color: verified ? '#006600' : '#a50040' }}
      >
        {verified ? '已认证' : '未认证'}
      </View>
    </View>
  )
}
