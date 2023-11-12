import { confirmPrivacyPolicy } from '@/api/User'
import { setUser } from '@/redux/slice/userSlice'
import store from '@/redux/store'
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'

/**
 * 显示用户隐私政策弹窗
 * @returns void
 */
export const useShowPrivacyPolicy = () => {
  useLoad(() => {
    const user = store.getState().user
    if (user.role !== 4) {
      return
    }
    Taro.showModal({
      title: '用户隐私政策',
      content:
        '花狮喵小程序（以下称“我们”）将收集并存储您主动提供上传的图片、邮箱、性别（可选）、年级（可选）和专业（可选）等个人信息。\n其中，图片仅用于设置头像；邮箱仅用于认证是否为本校成员，将不会对外展示；其他用于展示的可选信息，均可选择“不显示”。\n我们承诺将妥善处理您的个人信息，并在您注销账号时将其彻底删除。\n点击“同意”按钮表示您已阅读并同意上述隐私政策；点击“不同意”按钮表示您不同意上述政策且将返回上一页面。',
      confirmText: '同意',
      cancelText: '不同意',
      success: async res => {
        if (res.confirm) {
          const data = await confirmPrivacyPolicy(user.id)
          store.dispatch(setUser(data))
        } else {
          Taro.navigateBack()
        }
      }
    })
  })
}
