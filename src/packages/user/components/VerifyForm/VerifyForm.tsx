import { View, Image, Input } from '@tarojs/components'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import verifyOk from '@/packages/user/assets/verify_ok.drawio.svg'
import verifyFailed from '@/packages/user/assets/verify_failed.drawio.svg'
import { AtButton } from 'taro-ui'
import { useState } from 'react'
import * as USERAPI from '@/api/User'
import './VerifyForm.scss'
import '@/custom-theme.scss'
import { setUser } from '@/redux/slice/userSlice'
import Taro, { useLoad } from '@tarojs/taro'
import showPrivacyPolicy from '@/utils/privacy'
import { setLoginInfo } from '@/redux/slice/loginSlice'

export default function VerifyForm() {
  const user = useAppSelector(state => state.user)

  useLoad(() => {
    showPrivacyPolicy(user)
  })

  const dispatch = useAppDispatch()

  const verified = user.role <= 2

  const [submitButtonLoading, setSubmitButtonLoading] = useState(false)
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)

  const [email, setEmail] = useState('')
  const [emailFirst, setEmailFirst] = useState('')
  const [emailLast, setEmailLast] = useState('')
  const [emailErr, setEmailErr] = useState('')

  const [code, setCode] = useState('')
  const [codeErr, setCodeErr] = useState('')

  const [sendCodeText, setSendCodeText] = useState('发送验证码')
  const [sendCodeDisabled, setSendCodeDisabled] = useState(false)
  const [canSendCode, setCanSendCode] = useState(false)
  const [sendCodeLoading, setSendCodeLoading] = useState(false)

  const checkEmail = (email: string) => {
    const regex =
      /^[A-Za-z0-9\u4e00-\u9fa5\.]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+\.ecnu\.edu\.cn$/i
    if (regex.test(email)) {
      setEmailErr('')
      setCanSendCode(true)
      return true
    } else if (!email) {
      setEmailErr('请输入邮箱')
    } else {
      setEmailErr('邮箱地址不满足要求')
    }
    setCanSendCode(false)
    return false
  }

  const checkCode = async (code: string) => {
    if (!code) {
      setCodeErr('请输入验证码')
      return false
    }
    if (code.length !== 6) {
      setCodeErr('验证码错误')
      return false
    }
    const ok = await USERAPI.verifyCode(email, code)
    if (ok) {
      setCodeErr('')
      setSubmitButtonDisabled(false)
      return true
    } else {
      setCodeErr('验证码错误')
      return false
    }
  }

  const sendCode = async () => {
    setSendCodeLoading(true)
    await USERAPI.sendCode(email)
    setSendCodeDisabled(true)
    setSendCodeLoading(false)
    let timeLeft = 60
    setSendCodeText(`${timeLeft--}秒后重试`)
    const timer = setInterval(() => {
      setSendCodeText(`${timeLeft--}秒后重试`)
    }, 1000)
    setInterval(() => {
      setSendCodeDisabled(false)
      clearInterval(timer)
      setSendCodeText('发送验证码')
    }, 60 * 1000)
  }

  const handleReset = () => {
    setEmail('')
    setEmailFirst('')
    setEmailLast('')
    setCode('')
    setEmailErr('')
    setCodeErr('')
  }

  const handleSubmit = async () => {
    if (((await checkCode(code)) && checkEmail(email)) === false) {
      return
    }
    setSubmitButtonLoading(true)
    await USERAPI.verifyUser(user.id)
    const data = await USERAPI.updateUser({ email })
    dispatch(setUser(data!))
    const { code: loginCode } = await Taro.login()
    const info = await USERAPI.login(loginCode)
    dispatch(setLoginInfo(info!))
    setSubmitButtonLoading(false)
    Taro.showToast({
      title: '认证成功',
      icon: 'success',
      duration: 1000,
    })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  return (
    <View className='verify-form'>
      <View className='image-warp'>
        <Image
          fadeIn
          lazyLoad
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
      <View className='label'>
        {verified ? '修改认证邮箱' : '本校成员认证'}
      </View>
      <View className='discription'>请使用 `.ecnu.edu.cn` 校园邮箱认证</View>
      <View className='discription c2'>
        您的邮箱将<strong>不会</strong>被对外展示
      </View>
      <View className='form-container'>
        <View className='form-item'>
          <View className='form-label'>邮箱</View>
          <Input
            className='form-input first'
            value={emailFirst}
            onInput={e => {
              setEmailFirst(e.detail.value)
              setEmail(e.detail.value + '@' + emailLast + '.ecnu.edu.cn')
              checkEmail(e.detail.value + '@' + emailLast + '.ecnu.edu.cn')
            }}
            placeholder='请输入邮箱'
          />
          @
          <Input
            className='form-input form-input__last'
            value={emailLast}
            onInput={e => {
              setEmailLast(e.detail.value)
              setEmail(emailFirst + '@' + e.detail.value + '.ecnu.edu.cn')
              checkEmail(emailFirst + '@' + e.detail.value + '.ecnu.edu.cn')
            }}
          />
          .ecnu.edu.cn
        </View>
        <View className='error'>{emailErr ? '⚠️' + emailErr : ''}</View>
        <View className='form-item'>
          <View className='form-label'>验证码</View>
          <Input
            className='form-input'
            value={code}
            onInput={e => {
              setCode(e.detail.value)
              checkCode(e.detail.value)
            }}
            disabled={!canSendCode}
            placeholder='请输入验证码'
          />
          <AtButton
            type='secondary'
            size='small'
            className='send-code-button'
            disabled={sendCodeDisabled || !canSendCode}
            loading={sendCodeLoading}
            onClick={sendCode}
          >
            {sendCodeText}
          </AtButton>
        </View>
        <View className='error'>{codeErr ? '⚠️' + codeErr : ''}</View>
      </View>
      <View className='action-container'>
        <AtButton type='secondary' className='button' onClick={handleReset}>
          重置
        </AtButton>
        <AtButton
          type='primary'
          className='button'
          onClick={handleSubmit}
          loading={submitButtonLoading}
          disabled={submitButtonDisabled}
        >
          提交
        </AtButton>
      </View>
    </View>
  )
}
