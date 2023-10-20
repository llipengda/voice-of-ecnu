import { View, Image, Input } from '@tarojs/components'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import verifyOk from '@/assets/verify_ok.drawio.svg'
import verifyFailed from '@/assets/verify_failed.drawio.svg'
import { AtButton } from 'taro-ui'
import { useState } from 'react'
import * as USERAPI from '@/api/User'
import './VerifyForm.scss'
import '@/custom-theme.scss'
import { setUser } from '@/redux/slice/userSlice'
import Taro from '@tarojs/taro'

export default function VerifyForm() {
  const user = useAppSelector(state => state.user)

  const dispatch = useAppDispatch()

  const verified = user.role <= 2

  const [submitButtonLoading, setSubmitButtonLoading] = useState(false)
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)

  const [email, setEmail] = useState(user.email || '')
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
      setEmailErr('邮箱地址不合法')
    }
    setCanSendCode(false)
    return false
  }

  const checkCode = async (code: string) => {
    if (!code) {
      setCodeErr('请输入验证码')
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
    const timer = setInterval(() => {
      setSendCodeText(`${timeLeft--}秒后重试`)
      console.log(sendCodeDisabled || !canSendCode)
    }, 1000)
    setInterval(() => {
      setSendCodeDisabled(false)
      clearInterval(timer)
      setSendCodeText('发送验证码')
    }, 60 * 1000)
  }

  const handleReset = () => {
    setEmail(user.email || '')
    setCode('')
    setEmailErr('')
    setCodeErr('')
  }

  const handleSubmit = async () => {
    setSubmitButtonLoading(true)
    await USERAPI.verifyUser(user.id)
    const data = await USERAPI.updateUser({ email })
    dispatch(setUser(data!))
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
      <View className='form-container'>
        <View className='form-item'>
          <View className='form-label'>邮箱</View>
          <Input
            className='form-input first'
            value={email}
            onInput={e => {
              setEmail(e.detail.value)
              checkEmail(e.detail.value)
            }}
            placeholder='请使用华东师范大学邮箱认证'
          />
        </View>
        <View className='error'>{emailErr}</View>
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
        <View className='error'>{codeErr}</View>
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
