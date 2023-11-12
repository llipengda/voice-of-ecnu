import { useShowPrivacyPolicy } from '../src/utils/hooks/useShowPrivacyPolicy'
import { confirmPrivacyPolicy } from '../src/api/User'
import store from '../src/redux/store'
import Taro from '@tarojs/taro'
import { renderHook } from '@testing-library/react'

jest.mock('../src/api/user')
jest.mock('@tarojs/taro', () => ({
  showModal: jest.fn(),
  useLoad: jest.fn().mockImplementation(fn => fn()),
  navigateBack: jest.fn()
}))
jest.mock('../src/redux/store', () => ({
  getState: jest.fn(() => ({
    user: {
      role: 4,
      id: '123'
    }
  })),
  dispatch: jest.fn()
}))

describe('useShowPrivacyPolicy', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not show modal if user role is not 4', () => {
    ;(store.getState as jest.Mock).mockImplementationOnce(() => ({
      user: {
        role: 3
      }
    }))
    renderHook(() => useShowPrivacyPolicy())
    expect(Taro.showModal).not.toHaveBeenCalled()
  })

  it('should show modal with correct content', () => {
    renderHook(() => useShowPrivacyPolicy())
    expect(Taro.showModal).toHaveBeenCalledWith({
      title: '用户隐私政策',
      content:
        '花狮喵小程序（以下称“我们”）将收集并存储您主动提供上传的图片、邮箱、性别（可选）、年级（可选）和专业（可选）等个人信息。\n其中，图片仅用于设置头像；邮箱仅用于认证是否为本校成员，将不会对外展示；其他用于展示的可选信息，均可选择“不显示”。\n我们承诺将妥善处理您的个人信息，并在您注销账号时将其彻底删除。\n点击“同意”按钮表示您已阅读并同意上述隐私政策；点击“不同意”按钮表示您不同意上述政策且将返回上一页面。',
      confirmText: '同意',
      cancelText: '不同意',
      success: expect.any(Function)
    })
  })

  it('should call confirmPrivacyPolicy when user agrees', async () => {
    const mockData = { id: '123', name: 'test' }
    ;(Taro.showModal as jest.Mock).mockImplementationOnce(options => {
      options.success({ confirm: true })
    })
    ;(confirmPrivacyPolicy as jest.Mock).mockResolvedValueOnce(mockData)
    renderHook(() => useShowPrivacyPolicy())
    expect(confirmPrivacyPolicy).toHaveBeenCalledWith('123')
  })

  it('should navigate back when user disagrees', async () => {
    ;(Taro.showModal as jest.Mock).mockImplementationOnce(options => {
      options.success({ confirm: false })
    })
    renderHook(() => useShowPrivacyPolicy())
    expect(Taro.navigateBack).toHaveBeenCalled()
  })
})
